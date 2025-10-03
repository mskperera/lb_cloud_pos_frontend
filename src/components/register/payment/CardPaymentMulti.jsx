

import { forwardRef, useImperativeHandle, useState } from "react";
import FormElementMessage from "../../messges/FormElementMessage";
import { validate } from "../../../utils/formValidation";
import { PAYMENT_METHODS } from "../../../utils/constants";
import ExpirationDateInput from "../../textInput/ExpirationDateInput";
import CardType from "./CardType";
import { FaCreditCard } from "react-icons/fa";


const CardPaymentMulti = ({ onAddPayment }) => {
  //   const [selectedBank, setSelectedBank] = useState(null);

  // const banksOptions = [
  //   { name: "Sampath", id: 1 },
  //   { name: "Commercial Bank", id: 2 },
  //   { name: "NDB", id: 3 },
  //   { name: "BOC", id: 4 },
  //   { name: "DFCC", id: 5 },
  // ];

  const cardTypes = [
    { id: 1, name: "VISA" },
    { id: 2, name: "MASTER" },
    { id: 3, name: "AMEX" },
  ]; // Add more card types if needed

  const [payAmount, setPayAmount] = useState({
    label: "Amount",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [cardHolderName, setCardHolderName] = useState({
    label: "Card Holder Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [bank, setBank] = useState({
    label: "Bank",
    value: "1",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [cardType, setCardType] = useState({
    label: "Card Type",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [cardNo, setCardNo] = useState({
    label: "Card Number",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  const [cardExpirationMonth, setCardExpirationMonth] = useState({
    label: "Expiration Month",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "cardExpiration" },
  });

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
              text={`Validation: ${message}`}
            />
          ))}
        </div>
      )
    );
  };

  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", value);
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
    // List of all states to validate
    const states = [
      cardType,
      bank,
      cardNo,
      cardHolderName,
      cardExpirationMonth,
      payAmount,
    ];
    const updatedStates = states.map((state) => {
      // Validate each state
      const validation = validate(state.value, state);
      // Return updated state
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true, // or based on some other logic
        validationMessages: validation.messages,
      };
    });

    // Now update all states
    setCardType(updatedStates[0]);
    setBank(updatedStates[1]);
    setCardNo(updatedStates[2]);
    setCardHolderName(updatedStates[3]);
    setCardExpirationMonth(updatedStates[4]);
    setPayAmount(updatedStates[5]);
    // Check if all states are valid
    const allValid = updatedStates.every((state) => state.isValid);
    return allValid;
  };

  // useImperativeHandle(ref, () => ({
  //   getValidatedData
  // }));

  // useImperativeHandle(ref, () => ({
  //   getValidatedData: () => {
  //     return new Promise((resolve, reject) => {
  //       const allValid = validateAll();

  //       if (!allValid) {
  //         console.error("Validation errors", { cardType });
  //         resolve({ allValid, fields: null });  // Resolve with allValid false and no fields
  //         return;
  //       }

  //       resolve({ allValid, fields: {cardTypeId:cardType.value,bankId:bank.value.id,cardNo:cardNo.value,cardHolderName:cardHolderName.value,
  //         cardExpirationMonth:cardExpirationMonth.value,payAmount: payAmount.value} }); // Resolve with data
  //     });
  //   }
  // }));

  const splitPaymentHandler = () => {
    const allValid = validateAll();

    if (!allValid) {
      // Handle validation errors
      console.error("Validation errors", {
        cardType,
      });

      return;
    }

    onAddPayment({
      allValid,
      fields: {
        cardTypeId: cardType.value,
        bankId: bank.value.id,
        cardNo: cardNo.value,
        cardHolderName: cardHolderName.value,
        cardExpirationMonth: cardExpirationMonth.value,
        payAmount: payAmount.value,
      },
    });
  };

  return (
    <>
        <div className="flex flex-col gap-4 border-2 p-5 rounded-md">
        <div className="flex justify-center gap-2 items-center">
          {/* <FontAwesomeIcon icon={faCreditCard} className="text-2xl" /> */}
                   <FaCreditCard className="text-2xl" />
          <span className="text-md font-semibold">New Card Payment</span>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="grid lg:grid-cols-2 gap-4 mt-4 w-full items-center">
            <div className="lg:col-span-2 flex flex-col justify-center items-center mb-7">
              <div className="flex gap-2">
                {cardTypes.map((type) => (
                  <CardType
                    key={type.id}
                    type={type}
                    isSelected={cardType.value === type.id}
                    onClick={() => {
                      handleInputChange(setCardType, cardType, type.id);
                    }}
                  />
                ))}
              </div>
              <div className="col-12">{validationMessages(cardType)}</div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full"> Card Number (Last 4 digits)</label>
              <input
                type="text"
                className="border p-2 rounded"
                maxLength="4"
                value={cardNo.value}
                placeholder="Enter last 4 digits"
                onChange={(e) =>
                  handleInputChange(setCardNo, cardNo, e.target.value)
                }
              />
              {validationMessages(cardNo)}
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full">Card Holder</label>
              <input
                type="text"
                className="border p-2 rounded"
                placeholder=""
                value={cardHolderName.value}
                onChange={(e) => {
                  handleInputChange(
                    setCardHolderName,
                    cardHolderName,
                    e.target.value
                  );
                }}
              />
              {validationMessages(cardHolderName)}
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full"> Expiration MM/YY</label>
              <ExpirationDateInput
                type="text"
                className="border p-2 rounded"
                placeholder=""
                value={cardExpirationMonth.value}
                onChange={(value) => {
                  handleInputChange(
                    setCardExpirationMonth,
                    cardExpirationMonth,
                    value
                  );
                }}
              />
              {validationMessages(cardExpirationMonth)}
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-32"> Pay Amount </label>
              <input
                type="number"
                className="border p-2 rounded"
                placeholder=""
                value={payAmount.value}
                onChange={(e) => {
                  handleInputChange(setPayAmount, payAmount, e.target.value);
                }}
              />
              {validationMessages(payAmount)}
            </div>

<div className="flex justify-center col-span-2">
            <button
           className="w-full md:w-1/2 py-2 px-4 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
             onClick={splitPaymentHandler}
            >
              Add Payment
            </button>
          </div></div>
        </div>
      </div>
    </>
  );
};

export default CardPaymentMulti;

// import { forwardRef, useImperativeHandle, useState } from "react";
// import FormElementMessage from "../../messges/FormElementMessage";
// import { validate } from "../../../utils/formValidation";
// import { PAYMENT_METHODS } from "../../../utils/constants";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
// import ExpirationDateInput from "../../textInput/ExpirationDateInput";
// import CardType from "./CardType";


// const CardPaymentMulti = ({ onAddPayment }) => {
//   //   const [selectedBank, setSelectedBank] = useState(null);

//   // const banksOptions = [
//   //   { name: "Sampath", id: 1 },
//   //   { name: "Commercial Bank", id: 2 },
//   //   { name: "NDB", id: 3 },
//   //   { name: "BOC", id: 4 },
//   //   { name: "DFCC", id: 5 },
//   // ];

//   const cardTypes = [
//     { id: 1, name: "VISA" },
//     { id: 2, name: "MASTER" },
//     { id: 3, name: "AMEX" },
//   ]; // Add more card types if needed

//   const [payAmount, setPayAmount] = useState({
//     label: "Amount",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });

//   const [cardHolderName, setCardHolderName] = useState({
//     label: "Card Holder Name",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });

//   const [bank, setBank] = useState({
//     label: "Bank",
//     value: "1",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });

//   const [cardType, setCardType] = useState({
//     label: "Card Type",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "integer" },
//   });

//   const [cardNo, setCardNo] = useState({
//     label: "Card Number",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });
//   const [cardExpirationMonth, setCardExpirationMonth] = useState({
//     label: "Expiration Month",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "cardExpiration" },
//   });

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
//     console.log("Nlllll", value);
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
//     const states = [
//       cardType,
//       bank,
//       cardNo,
//       cardHolderName,
//       cardExpirationMonth,
//       payAmount,
//     ];
//     const updatedStates = states.map((state) => {
//       // Validate each state
//       const validation = validate(state.value, state);
//       // Return updated state
//       return {
//         ...state,
//         isValid: validation.isValid,
//         isTouched: true, // or based on some other logic
//         validationMessages: validation.messages,
//       };
//     });

//     // Now update all states
//     setCardType(updatedStates[0]);
//     setBank(updatedStates[1]);
//     setCardNo(updatedStates[2]);
//     setCardHolderName(updatedStates[3]);
//     setCardExpirationMonth(updatedStates[4]);
//     setPayAmount(updatedStates[5]);
//     // Check if all states are valid
//     const allValid = updatedStates.every((state) => state.isValid);
//     return allValid;
//   };

//   // useImperativeHandle(ref, () => ({
//   //   getValidatedData
//   // }));

//   // useImperativeHandle(ref, () => ({
//   //   getValidatedData: () => {
//   //     return new Promise((resolve, reject) => {
//   //       const allValid = validateAll();

//   //       if (!allValid) {
//   //         console.error("Validation errors", { cardType });
//   //         resolve({ allValid, fields: null });  // Resolve with allValid false and no fields
//   //         return;
//   //       }

//   //       resolve({ allValid, fields: {cardTypeId:cardType.value,bankId:bank.value.id,cardNo:cardNo.value,cardHolderName:cardHolderName.value,
//   //         cardExpirationMonth:cardExpirationMonth.value,payAmount: payAmount.value} }); // Resolve with data
//   //     });
//   //   }
//   // }));

//   const splitPaymentHandler = () => {
//     const allValid = validateAll();

//     if (!allValid) {
//       // Handle validation errors
//       console.error("Validation errors", {
//         cardType,
//       });

//       return;
//     }

//     onAddPayment({
//       allValid,
//       fields: {
//         cardTypeId: cardType.value,
//         bankId: bank.value.id,
//         cardNo: cardNo.value,
//         cardHolderName: cardHolderName.value,
//         cardExpirationMonth: cardExpirationMonth.value,
//         payAmount: payAmount.value,
//       },
//     });
//   };

//   return (
//     <>
//         <div className="flex flex-col gap-4 border-2 p-5 rounded-md">
//         <div className="flex justify-center gap-2 items-center">
//           <FontAwesomeIcon icon={faCreditCard} className="text-2xl" />
//           <span className="text-md font-semibold">New Card Payment</span>
//         </div>

//         <div className="flex flex-col gap-4 items-center">
//           <div className="grid lg:grid-cols-2 gap-4 mt-4 w-full items-center">
//             <div className="lg:col-span-2 flex flex-col justify-center items-center mb-7">
//               <div className="flex gap-2">
//                 {cardTypes.map((type) => (
//                   <CardType
//                     key={type.id}
//                     type={type}
//                     isSelected={cardType.value === type.id}
//                     onClick={() => {
//                       handleInputChange(setCardType, cardType, type.id);
//                     }}
//                   />
//                 ))}
//               </div>
//               <div className="col-12">{validationMessages(cardType)}</div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="w-full"> Card Number (Last 4 digits)</label>
//               <input
//                 type="text"
//                 className="border p-2 rounded"
//                 maxLength="4"
//                 value={cardNo.value}
//                 placeholder="Enter last 4 digits"
//                 onChange={(e) =>
//                   handleInputChange(setCardNo, cardNo, e.target.value)
//                 }
//               />
//               {validationMessages(cardNo)}
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="w-full">Card Holder</label>
//               <input
//                 type="text"
//                 className="border p-2 rounded"
//                 placeholder=""
//                 value={cardHolderName.value}
//                 onChange={(e) => {
//                   handleInputChange(
//                     setCardHolderName,
//                     cardHolderName,
//                     e.target.value
//                   );
//                 }}
//               />
//               {validationMessages(cardHolderName)}
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="w-full"> Expiration MM/YY</label>
//               <ExpirationDateInput
//                 type="text"
//                 className="border p-2 rounded"
//                 placeholder=""
//                 value={cardExpirationMonth.value}
//                 onChange={(value) => {
//                   handleInputChange(
//                     setCardExpirationMonth,
//                     cardExpirationMonth,
//                     value
//                   );
//                 }}
//               />
//               {validationMessages(cardExpirationMonth)}
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="w-32"> Pay Amount </label>
//               <input
//                 type="number"
//                 className="border p-2 rounded"
//                 placeholder=""
//                 value={payAmount.value}
//                 onChange={(e) => {
//                   handleInputChange(setPayAmount, payAmount, e.target.value);
//                 }}
//               />
//               {validationMessages(payAmount)}
//             </div>

// <div className="flex justify-center col-span-2">
//             <button
//               className="btn w-[40%] bg-primaryColor hover:bg-primaryColorHover text-white"
//               onClick={splitPaymentHandler}
//             >
//               Add Payment
//             </button>
//           </div></div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CardPaymentMulti;
