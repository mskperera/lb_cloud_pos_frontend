import FormElementMessage from "../../messges/FormElementMessage";
import { validate } from "../../../utils/formValidation";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";

const CashDemomination = ({ currency, amount, isSelected, onClick }) => {
  return (
    <div className="p-1 cursor-pointer" onClick={onClick}>
      <div
        className={`py-2 px-4 rounded-lg shadow-sm transition-colors duration-300 ${
          isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <span className="font-semibold">{`${currency}${amount}`}</span>
      </div>
    </div>
  );
};

const CashPaymentMulti = ({ onAddPayment }) => {
  const { paymentList, orderSummary } = useSelector((state) => state.orderList);
  const [amountReceived, setAmountReceived] = useState({
    label: "Received Amount",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "decimal" },
  });

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="mt-2 w-full"
              severity="error"
              text={`Validation: ${message}`}
            />
          ))}
        </div>
      )
    );
  };

  const handleInputChange = (setState, state, value) => {
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

  const validateAll = () => {
    const states = [amountReceived];
    const updatedStates = states.map((state) => {
      const validation = validate(state.value, state);
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true,
        validationMessages: validation.messages,
      };
    });
    setAmountReceived(updatedStates[0]);
    return updatedStates.every((state) => state.isValid);
  };

  const splitPaymentHandler = () => {
    const allValid = validateAll();
    if (!allValid) {
      console.error("Validation errors", { amountReceived });
      return;
    }
    onAddPayment({ allValid, fields: { payAmount: amountReceived.value } });
  };

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-200 p-6 rounded-lg bg-white shadow-sm">
      <div className="flex justify-center gap-2 items-center">
        <FontAwesomeIcon icon={faMoneyBillAlt} className="text-2xl text-blue-600" />
        <span className="text-lg font-semibold text-gray-700">New Cash Payment</span>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-4 w-full">
          <label className="font-semibold text-gray-700">Pay Amount</label>
          <input
            type="number"
            value={amountReceived.value}
            onChange={(e) => handleInputChange(setAmountReceived, amountReceived, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {validationMessages(amountReceived)}
        <button
          className="w-full md:w-1/2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={splitPaymentHandler}
        >
          Add Payment
        </button>
      </div>
    </div>
  );
};

export default CashPaymentMulti;

// import FormElementMessage from "../../messges/FormElementMessage";
// import { validate } from "../../../utils/formValidation";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
// import { useState } from "react";

// const CashDemomination = ({ currency, amount, isSelected, onClick }) => {
//   return (
//     <div
//       className="col-12 md:col-4 sm:col-4 lg:col-4 xl:col-2 p-1"
//       style={{ cursor: "pointer" }}
//       onClick={onClick}
//     >
//       <div className={`shadow-1 hover:shadow-4 border-round ${isSelected ? 'bg-primary text-white' : ''}`}>
//         <div className="flex justify-content-center flex-wrap p-3">
//           <span className="font-bold">{`${currency}${amount}`}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CashPaymentMulti = ({onAddPayment}) => {

//   const {paymentList,orderSummary} = useSelector((state) => state.orderList);



// const [amountReceived,setAmountReceived] = useState({
//   label: "Received Amount",
//   value: "",
//   isTouched: false,
//   isValid: false,
//   rules: { required: true, dataType: "decimal" },
// });




//   const validationMessages = (state) => {
//     // Ensure that the function returns JSX or null
//     return (
//       !state.isValid &&
//       state.isTouched && (
//         <div>
//           {state.validationMessages.map((message, index) => (
//             <FormElementMessage
//               key={index}
//               className="mt-2 w-full"
//               severity="error"
//               text={`Validation: ${message}`}
//             />
//           ))}
//         </div>
//       )
//     );
//   };

//   const handleInputChange = (setState, state, value) => {
//     console.log("Nlllll", state);
//     if (!state.rules) {
//       console.error("No rules defined for validation in the state", state);
//       return;
//     }
//     const validation = validate(value, state);
//     setState({
//       ...state,
//       value: value,
//       isValid: validation.isValid,
//       isTouched: true,
//       validationMessages: validation.messages,
//     });
//   };
  
//   const validateAll = () => {
//     // List of all states to validate
//     const states = [amountReceived];
//     const updatedStates = states.map((state) => {
//       // Validate each state
//       const validation = validate(state.value, state);
// console.log('run validation',validation)
//       // Return updated state
//       return {
//         ...state,
//         isValid: validation.isValid,
//         isTouched: true, // or based on some other logic
//         validationMessages: validation.messages,
//       };
//     });

//     // Now update all states
//     setAmountReceived(updatedStates[0]);
//     //setDiscountType(updatedStates[1]);
//     //setDiscount(updatedStates[2]);
//     //setOtherReasonRemark(updatedStates[3]);

//     // Check if all states are valid
//     const allValid = updatedStates.every((state) => state.isValid);
//     return allValid;
//   };


//   const splitPaymentHandler = () => {
//     const allValid = validateAll();
  
//     if (!allValid) {
//       // Handle validation errors
//       console.error("Validation errors", {
//         amountReceived,
//       });

//       return; 
//     }

//   onAddPayment({ allValid, fields: { payAmount: amountReceived.value } });
//   };

 
//     return (
//       <>
//         <div className="flex flex-col gap-4 border-2 p-5 rounded-md">
//           <div className="flex justify-center gap-2 items-center">
//             <FontAwesomeIcon icon={faMoneyBill} className="text-2xl" />
//             <span className="text-md font-semibold">New Cash Payment</span>
//           </div>

//           <div className="flex flex-col gap-4 items-center">
//             <div className="flex justify-center items-center gap-2">
//               <div className="">Pay amount</div>
//               <input
//                 type="number"
//                 value={amountReceived && amountReceived.value}
//                 onChange={(e) => {
//                   handleInputChange(
//                     setAmountReceived,
//                     amountReceived,
//                     e.target.value
//                   );
//                 }}
//                 className="border p-2 rounded"
//               />
//               {validationMessages(amountReceived)}
//             </div>

//             <button
//               className="btn w-[40%] bg-primaryColor hover:bg-primaryColorHover text-white"
//               onClick={splitPaymentHandler}
//             >
//               Add Payment
//             </button>
//           </div>
//         </div>
//       </>
//     );

// };

//  export default CashPaymentMulti;