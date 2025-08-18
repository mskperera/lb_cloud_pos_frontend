import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addContact, updateCustomer, getContacts } from "../../functions/contacts";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../messges/FormElementMessage";
import { useToast } from "../useToast";
import { CONTACT_TYPE, SAVE_TYPE } from "../../utils/constants";
import { getContactTypes } from "../../functions/dropdowns";

export default function AddCustomer({ saveType, id = 0 }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const [contactCode, setCustomerCode] = useState({
    label: "Contact Code",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [contactName, setCustomerName] = useState({
    label: "Contact Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [email, setEmail] = useState({
    label: "Email",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [mobile, setMobile] = useState({
    label: "Mobile",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [tel, setTel] = useState({
    label: "Tel",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [remark, setRemark] = useState({
    label: "Remark",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [contactType, setContactType] = useState({
    label: "Contact Type",
    value: CONTACT_TYPE.CUSTOMER,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [contactTypeOptions, setContactTypeOptions] = useState([]);

  useEffect(() => {
    loadDrpProductTypes();
  }, []);

  const loadDrpProductTypes = async () => {
    const objArr = await getContactTypes();
    setContactTypeOptions(objArr.data.results[0]);
  };

  const handleInputChange = (setState, state, value) => {
    const validation = validate(value, state);
    setState({
      ...state,
      value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div className="mt-1 space-y-1">
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="text-red-500 text-sm"
              severity="error"
              text={message}
            />
          ))}
        </div>
      )
    );
  };

  const loadValuesForUpdate = async () => {
    const ress = await getContacts({
      contactId: id,
      contactTypeIds: [1, 2, 3],
      contactCode: null,
      contactName: null,
      email: null,
      mobile: null,
      tel: null,
      searchByKeyword: false,
    });

    const {
      contactCode,
      contactName,
      email,
      mobile,
      tel,
      remark,
      contactTypeId,
    } = ress.data.results[0][0];

    setCustomerCode((p) => ({ ...p, value: contactCode }));
    setCustomerName((p) => ({ ...p, value: contactName }));
    setEmail((p) => ({ ...p, value: email }));
    setMobile((p) => ({ ...p, value: mobile }));
    setTel((p) => ({ ...p, value: tel }));
    setContactType((p) => ({ ...p, value: contactTypeId }));
    setRemark((p) => ({ ...p, value: remark }));
  };

  useEffect(() => {
    if (saveType === SAVE_TYPE.UPDATE) {
      loadValuesForUpdate();
    }
  }, [saveType, contactTypeOptions]);

  useEffect(() => {
    setCustomerCode((p) => ({ ...p, value: "[Auto Generate]" }));
  }, []);

  const onSubmit = async () => {
    setIsSubmitting(true);

    const payLoad = {
      tableId: null,
      contactTypeId: contactType.value,
      contactName: contactName.value,
      email: email.value,
      mobile: mobile.value,
      tel: tel.value,
      remark: remark.value,
    };

    try {
      let res;
      if (saveType === SAVE_TYPE.ADD) {
        res = await addContact(payLoad);
      } else if (saveType === SAVE_TYPE.UPDATE) {
        res = await updateCustomer(id, payLoad);
      }

      if (res.data.error) {
        showToast("danger", "Exception", res.data.error.message);
        setIsSubmitting(false);
        return;
      }

      const { outputMessage, responseStatus } = res.data.outputValues;
      if (responseStatus === "failed") {
        showToast("warning", "Exception", outputMessage);
      } else {
        navigate(`/customers/list`);
        showToast("success", "Success", outputMessage);
      }
    } catch (err) {
      showToast("danger", "Exception", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 w-[70%] py-5">
        {/* Header */}
        <div className="lg:col-span-3 text-center mb-6">
          <h2 className="text-2xl font-bold">
            {saveType === SAVE_TYPE.ADD ? "Add Contact" : "Update Contact"}
          </h2>
        </div>

        {/* Contact Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{contactType.label}</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={contactType.value}
            onChange={(e) =>
              handleInputChange(setContactType, contactType, e.target.value)
            }
          >
            {contactTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.displayName}
              </option>
            ))}
          </select>
          {validationMessages(contactType)}
        </div>

        {/* Contact Code */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{contactCode.label}</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 bg-gray-100"
            readOnly
            value={contactCode.value}
          />
          {validationMessages(contactCode)}
        </div>

        {/* Contact Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{contactName.label}</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={contactName.value}
            onChange={(e) =>
              handleInputChange(setCustomerName, contactName, e.target.value)
            }
          />
          {validationMessages(contactName)}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{email.label}</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email.value}
            onChange={(e) => handleInputChange(setEmail, email, e.target.value)}
          />
          {validationMessages(email)}
        </div>

        {/* Mobile */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{mobile.label}</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={mobile.value}
            onChange={(e) => handleInputChange(setMobile, mobile, e.target.value)}
          />
          {validationMessages(mobile)}
        </div>

        {/* Tel */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{tel.label}</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tel.value}
            onChange={(e) => handleInputChange(setTel, tel, e.target.value)}
          />
          {validationMessages(tel)}
        </div>

        {/* Remark */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">{remark.label}</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={remark.value}
            onChange={(e) => handleInputChange(setRemark, remark, e.target.value)}
          />
          {validationMessages(remark)}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10 col-span-full">
          <button
            className={`w-56 rounded-lg bg-sky-600 text-white font-semibold py-2 px-4 shadow-md hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50`}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : saveType === SAVE_TYPE.UPDATE
              ? "Update"
              : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
