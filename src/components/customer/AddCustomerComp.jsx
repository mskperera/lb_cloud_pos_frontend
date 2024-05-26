import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect, useRef } from "react";
import { json, useNavigate } from "react-router-dom";
import { addCustomer, getCustomers, updateCustomer } from "../../functions/customer";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../messges/FormElementMessage";
import { useToast } from "../useToast";
import { SAVE_TYPE } from "../../utils/constants";

export default function AddCustomer({saveType,id}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const [customerCode, setCustomerCode] = useState({
    label: "Customer code",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string"  },
  });

  const [customerName, setCustomerName] = useState({
    label: "Customer Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string"  },
  });

  const [email, setEmail] = useState({
    label: "Email",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string"  },
  });

  const [mobile, setMobile] = useState({
    label: "Mobile",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false , dataType: "string" },
  });

  const [tel, setTel] = useState({
    label: "Tel",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [whatsappNumber, setWhatsappNo] = useState({
    label: "WhatsappNo",
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
    rules: { required: false, dataType: "string"  },
  });




  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", state);
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
      return;
    }
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };


  const validationMessages = (state) => {
    // Ensure that the function returns JSX or null
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="mt-2 w-full"
              severity="error"
              text={`${message}`}
            />
          ))}
        </div>
      )
    );
  };


  const loadValuesForUpdate=async()=>{
  const ress=await  getCustomers({
    customerId:id,
    customerCode: null,
    customerName: null,
    email:null,
    mobile:null,
    tel:null,
    whatsappNumber:null,
    searchByKeyword:false
    });



    const {customerId,
      customerCode,
      customerName,
      email,
      mobile,
      tel,
      whatsappNumber,
      remark,
      createdDate_UTC,
      modifiedDate_UTC
    }=ress.data.results[0][0];

    setCustomerCode(p=>({...p,value:customerCode}));
      setCustomerName(p=>({...p,value:customerName}));
      setEmail(p=>({...p,value:email}));
      setMobile(p=>({...p,value:mobile}));
      setTel(p=>({...p,value:tel}));
      setWhatsappNo(p=>({...p,value:whatsappNumber}));
      
      setRemark(p=>({...p,value:remark}));
    console.log('customer',ress.data.results[0][0])

  }
  useEffect(()=>{
    if(saveType===SAVE_TYPE.UPDATE){
      loadValuesForUpdate();
    }
  },[saveType]);



useEffect(()=>{
  setCustomerCode(p=>({...p,value:'[Auto Generate]'}));

},[])

  const onSubmit=async()=>{

    const payLoad={   
      tableId:null,
      customerName:customerName.value,
      email:email.value,
      mobile:mobile.value,
      tel:tel.value,
      whatsappNumber:whatsappNumber.value,
      remark:remark.value,
    }

    if(saveType===SAVE_TYPE.ADD){
    const res = await addCustomer(payLoad);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      showToast("error", "Exception", error.message);
      return;
    }

    const { customerCode, outputMessage, responseStatus } = res.data.outputValues;
    if(responseStatus==="failed"){
      showToast("warning", "Exception",outputMessage);
    }
    setIsSubmitting(false);
    
    navigate(`/customers`)
    showToast("success", "Success", outputMessage);
  }
  else if(saveType===SAVE_TYPE.UPDATE){
    const res = await updateCustomer(id,payLoad);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      showToast("error", "Exception", error.message);
    }

    const { customerCode, outputMessage, responseStatus } = res.data.outputValues;
    if(responseStatus==="failed"){
      showToast("warning", "Exception",outputMessage);
    }
    console.log("customerCode", customerCode);
    setIsSubmitting(false);
    
    navigate(`/customers`)
    showToast("success", "Success", outputMessage);
  }
  }
  return (
    <>
     {saveType===SAVE_TYPE.ADD && <h2 className="text-center">Add Customer</h2>}
     {saveType===SAVE_TYPE.UPDATE && <h2 className="text-center">Update Customer</h2>}
      <div className="grid px-4">
        <div className="col-12">
          <div className="grid mt-4">
            <div className="col-3">
              <div className="flex flex-column gap-2">
               
                <label htmlFor="customerCode">{customerCode.label}</label>
                <InputText
                  id="customerCode"
                  readOnly={true}
                  value={customerCode.value}
                  onChange={(e) => {
                    console.log("customerCode", e.target.value);
                    handleInputChange(setCustomerCode, customerCode, e.target.value); // Ensure 'discount' state has 'rules'
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(customerCode)}
              </div>
            </div>
    
          </div>{" "}
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="customerName">{customerName.label}</label>
            <InputText
                  id="customerName"
                  value={customerName.value}
                  onChange={(e) => {
                    console.log("customerName", e.target.value);
                    handleInputChange(setCustomerName, customerName, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(customerName)}
          </div>
        </div>
    
       
        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="email">{email.label}</label>
            <InputText
                  id="email"
                  value={email.value}
                  onChange={(e) => {
                    console.log("email", e.target.value);
                    handleInputChange(setEmail, email, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(email)}
          </div>
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="email">{mobile.label}</label>
            <InputText
                  id="taxRate"
                  value={mobile.value}
                  onChange={(e) => {
                    handleInputChange(setMobile, mobile, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(mobile)}
          </div>
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="tel">{tel.label}</label>
            <InputText
                  id="tel"
                  value={tel.value}
                  onChange={(e) => {
                    console.log("tel", e.target.value);
                    handleInputChange(setTel, tel, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(tel)}
          </div>
        </div>
        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="whatsappNumber">{whatsappNumber.label}</label>
            <InputText
                  id="whatsappNumber"
                  value={whatsappNumber.value}
                  onChange={(e) => {
                    console.log("whatsappNumber", e.target.value);
                    handleInputChange(setWhatsappNo, whatsappNumber, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(whatsappNumber)}

          </div>
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="remark">{remark.label}</label>
            <InputText
                  id="remark"
                  value={remark.value}
                  onChange={(e) => {
                    console.log("remark", e.target.value);
                    handleInputChange(setRemark, remark, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(remark)}

          </div>
        </div>

      </div>

      <div className="grid mt-4 px-4">
        <div className="col-12 p-2 flex justify-content-center">
          <Button
            label={isSubmitting ? "Submitting..." : saveType===SAVE_TYPE.UPDATE ? "Update":"Add"}
            aria-label="Tender"
            className="p-button-rounded p-button-lg p-button-primary"
             onClick={onSubmit}
            style={{ width: "20%" }}
          />
        </div>
      </div>
    </>
  );
}
