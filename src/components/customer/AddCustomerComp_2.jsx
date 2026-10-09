import React, { useState, useEffect } from "react";
import { addContact, updateCustomer, getContacts } from "../../functions/contacts";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../messges/FormElementMessage";
import { useToast } from "../useToast";
import { CONTACT_TYPE, SAVE_TYPE } from "../../utils/constants";
import { getContactTypes } from "../../functions/dropdowns";
import {
  UserPlus,
  UserCheck,
  User,
  Mail,
  Phone,
  Smartphone,
  FileText,
  Tag,
  Hash,
  X,
  Save,
  Loader2,
} from "lucide-react";

import MessagePopup from "../MessagePopup";



export default function AddCustomer({
  saveType = SAVE_TYPE.ADD,
  id = 0,
  isOpen = true,
  onClose,
  onSaved,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const showToast = useToast();

  const [messagePopup, setMessagePopup] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });


  const [contactCode, setCustomerCode] = useState({
    label: "Contact Code",
    value: "[Auto Generate]",
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
    label: "Email Address",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [mobile, setMobile] = useState({
    label: "Mobile Number",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [tel, setTel] = useState({
    label: "Telephone Number",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [remark, setRemark] = useState({
    label: "Remarks / Notes",
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
    try {
      const objArr = await getContactTypes();
      setContactTypeOptions(objArr.data.results[0] || []);
    } catch (err) {
      showToast("danger", "Error", "Failed to load contact types");
    }
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

  const resetValues = () => {
    setCustomerCode((p) => ({ ...p, value: "[Auto Generate]", isTouched: false }));
    setCustomerName((p) => ({ ...p, value: "", isTouched: false }));
    setEmail((p) => ({ ...p, value: "", isTouched: false }));
    setMobile((p) => ({ ...p, value: "", isTouched: false }));
    setTel((p) => ({ ...p, value: "", isTouched: false }));
    setRemark((p) => ({ ...p, value: "", isTouched: false }));
    setContactType((p) => ({ ...p, value: CONTACT_TYPE.CUSTOMER, isTouched: false }));
  };

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div className="mt-1 space-y-1">
          {state.validationMessages?.map((message, index) => (
            <FormElementMessage
              key={index}
              className="text-rose-500 text-xs font-medium"
              severity="error"
              text={message}
            />
          ))}
        </div>
      )
    );
  };

  const loadValuesForUpdate = async () => {
    setIsLoadingData(true);
    try {
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

      if (ress.data?.results?.[0]?.[0]) {
        const {
          contactCode,
          contactName,
          email,
          mobile,
          tel,
          remark,
          contactTypeId,
        } = ress.data.results[0][0];

        setCustomerCode((p) => ({ ...p, value: contactCode || "" }));
        setCustomerName((p) => ({ ...p, value: contactName || "" }));
        setEmail((p) => ({ ...p, value: email || "" }));
        setMobile((p) => ({ ...p, value: mobile || "" }));
        setTel((p) => ({ ...p, value: tel || "" }));
        setContactType((p) => ({ ...p, value: contactTypeId }));
        setRemark((p) => ({ ...p, value: remark || "" }));
      }
    } catch (err) {
      showToast("danger", "Error", "Failed to load contact details");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (saveType === SAVE_TYPE.UPDATE && id) {
      loadValuesForUpdate();
    } else {
      resetValues();
    }
  }, [saveType, id, isOpen]);


// AddCustomer.jsx -> onSubmit update
const onSubmit = async (e) => {
  if (e) e.preventDefault();
  setIsSubmitting(true);

  const payLoad = {
    tableId: null,
    contactTypeId: Number(contactType.value),
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

    if (res?.data?.error) {
      //showToast("danger", "Exception", res.data.error.message);

      setMessagePopup({
            isOpen: true,
            type: "danger",
            title: "Error Occurred",
            message: res.data.error.message,
          });


      setIsSubmitting(false);
      return;
    }

    const { outputMessage, responseStatus } = res?.data?.outputValues || {};
    if (responseStatus === "failed") {

    setMessagePopup({
            isOpen: true,
            type: "warning",
            title: "Exception",
            message: outputMessage,
          });

             setIsSubmitting(false);
      return;
     // showToast("warning", "Exception", outputMessage);
    }  


      showToast("success", "Success", outputMessage || "Saved successfully!");
      resetValues();
      // Pass the API response along with id and payload over the course of calling onSaved
      onSaved?.({ id, payload: payLoad, result: res?.data });
      onClose?.();
    
  } catch (err) {
    showToast("danger", "Exception", err.message || "An error occurred");
  } finally {
    setIsSubmitting(false);
  }
};


//   const onSubmit = async (e) => {
//     if (e) e.preventDefault();
//     setIsSubmitting(true);

//     const payLoad = {
//       tableId: null,
//       contactTypeId: Number(contactType.value),
//       contactName: contactName.value,
//       email: email.value,
//       mobile: mobile.value,
//       tel: tel.value,
//       remark: remark.value,
//     };

//     try {
//       let res;
//       if (saveType === SAVE_TYPE.ADD) {
//         res = await addContact(payLoad);
//       } else if (saveType === SAVE_TYPE.UPDATE) {
//         res = await updateCustomer(id, payLoad);
//       }

//       if (res?.data?.error) {
//         showToast("danger", "Exception", res.data.error.message);
//         setIsSubmitting(false);
//         return;
//       }

//       const { outputMessage, responseStatus } = res?.data?.outputValues || {};
//       if (responseStatus === "failed") {
//         showToast("warning", "Exception", outputMessage);
//       } else {
//         showToast("success", "Success", outputMessage || "Saved successfully!");
//         resetValues();
//         onSaved?.({ id, payload: payLoad });
//         onClose?.();
//       }
//     } catch (err) {
//       showToast("danger", "Exception", err.message || "An error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

  if (!isOpen) return null;

  const isUpdate = saveType === SAVE_TYPE.UPDATE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl my-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
    <MessagePopup
        isOpen={messagePopup.isOpen}
        onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
        type={messagePopup.type}
        title={messagePopup.title}
        message={messagePopup.message}
      />


        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl border border-sky-200">
              {isUpdate ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isUpdate ? "Edit Contact Details" : "Create New Contact"}
              </h2>
              <p className="text-xs text-slate-500">
                {isUpdate
                  ? "Update contact info and system permissions."
                  : "Enter key information to register a new customer or supplier."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              <span>Loading record...</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {contactType.label} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <select
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
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
              </div>
              {validationMessages(contactType)}
            </div>

            {/* Contact Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {contactCode.label}
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed"
                  readOnly
                  value={contactCode.value}
                />
              </div>
              {validationMessages(contactCode)}
            </div>

            {/* Contact Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {contactName.label} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. John Doe / Acme Corp"
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={contactName.value}
                  onChange={(e) =>
                    handleInputChange(setCustomerName, contactName, e.target.value)
                  }
                />
              </div>
              {validationMessages(contactName)}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {email.label}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={email.value}
                  onChange={(e) => handleInputChange(setEmail, email, e.target.value)}
                />
              </div>
              {validationMessages(email)}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mobile.label}
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={mobile.value}
                  onChange={(e) => handleInputChange(setMobile, mobile, e.target.value)}
                />
              </div>
              {validationMessages(mobile)}
            </div>

            {/* Tel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {tel.label}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  value={tel.value}
                  onChange={(e) => handleInputChange(setTel, tel, e.target.value)}
                />
              </div>
              {validationMessages(tel)}
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {remark.label}
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <textarea
                  rows={3}
                  placeholder="Add any additional notes or preferences..."
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-y"
                  value={remark.value}
                  onChange={(e) => handleInputChange(setRemark, remark, e.target.value)}
                />
              </div>
              {validationMessages(remark)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 rounded-lg shadow-sm transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isUpdate ? "Update Contact" : "Save Contact"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}