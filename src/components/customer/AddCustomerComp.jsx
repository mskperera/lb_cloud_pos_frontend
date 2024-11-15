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
    searchByKeyword:false
    });



    const {customerId,
      customerCode,
      customerName,
      email,
      mobile,
      tel,
      remark,
      createdDate_UTC,
      modifiedDate_UTC
    }=ress.data.results[0][0];

    setCustomerCode(p=>({...p,value:customerCode}));
      setCustomerName(p=>({...p,value:customerName}));
      setEmail(p=>({...p,value:email}));
      setMobile(p=>({...p,value:mobile}));
      setTel(p=>({...p,value:tel}));
      
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
      remark:remark.value,
    }

    if(saveType===SAVE_TYPE.ADD){
    const res = await addCustomer(payLoad);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      showToast("danger", "Exception", error.message);
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
      showToast("danger", "Exception", error.message);
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
    <div className="flex justify-center">
         <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 ml-5 w-[70%] py-5">
      <div className="flex justify-center lg:col-span-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            {saveType === SAVE_TYPE.ADD ? "Add Customer" : "Update Customer"}
          </h2>
        </div>
      </div>

   
      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{customerCode.label}</span>
        </label>
        <div className="flex items-center">
          <input
            type="text"
            className="input input-bordered flex-1"
            readOnly={true}
            value={customerCode.value}
            onChange={(e) =>
              handleInputChange(setCustomerCode, customerCode, e.target.value)
            }
          />
   
        </div>
        {validationMessages(customerCode)}
      </div>


      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{customerName.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={customerName.value}
          onChange={(e) =>
            handleInputChange(setCustomerName, customerName, e.target.value)
          }
        />
        {validationMessages(customerName)}
      </div>



      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{email.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={email.value}
          onChange={(e) =>
            handleInputChange(setEmail, email, e.target.value)
          }
        />
        {validationMessages(email)}
      </div>


      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{mobile.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={mobile.value}
          onChange={(e) =>
            handleInputChange(setMobile, mobile, e.target.value)
          }
        />
        {validationMessages(mobile)}
      </div>


      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{tel.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={tel.value}
          onChange={(e) =>
            handleInputChange(setTel, tel, e.target.value)
          }
        />
        {validationMessages(tel)}
      </div>


      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{remark.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={remark.value}
          onChange={(e) =>
            handleInputChange(setRemark, remark, e.target.value)
          }
        />
        {validationMessages(remark)}
      </div>
         
<div className="flex justify-center mt-20 col-span-full">
        <button
          className={`btn btn-primary w-56 ${isSubmitting ? "loading" : ""}`}
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
