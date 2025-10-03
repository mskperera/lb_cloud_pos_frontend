
import { FaCreditCard, FaMoneyBillAlt, FaTimes } from "react-icons/fa";
import { PAYMENT_METHODS } from "../../../utils/constants";

const PaymentMethodCard = ({ payment, onRemove }) => {
  let icon, title, details;

  switch (payment.methodId) {
    case PAYMENT_METHODS.CASH:
      icon = <FaMoneyBillAlt className="text-3xl text-sky-600" />;
      title = "Cash";
      details = (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-700">Pay Amount:</p>
            <p className="text-gray-600">{payment.amountPaid}</p>
          </div>
        </div>
      );
      break;
    case PAYMENT_METHODS.CARD:
      icon = <FaCreditCard className="text-3xl text-sky-600" />;
      title = "Card";
      details = (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-700">Card Type:</p>
            <p className="text-gray-600">{payment.cardPayment.cardTypeId}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-700">Card Number:</p>
            <p className="text-gray-600">**** **** **** {payment.cardPayment.cardLastFourDigits}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-700">Amount:</p>
            <p className="text-gray-600">{payment.amountPaid}</p>
          </div>
        </div>
      );
      break;
    default:
      return null;
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm p-4 hover:shadow-sm transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-lg font-semibold text-gray-700">{title}</p>
        </div>
        <button
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          onClick={() => onRemove(payment.id)}
        >
          <FaTimes />
        </button>
      </div>
      {details}
    </div>
  );
};

const MultiPaymentList = ({ paymentList, onRemovePayment }) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {paymentList.map((payment) => (
        <PaymentMethodCard
          key={payment.id}
          payment={payment}
          onRemove={onRemovePayment}
        />
      ))}
    </div>
  );
};

export default MultiPaymentList;


// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { PAYMENT_METHODS } from "../../../utils/constants";
// import { faCreditCard, faMoneyBillAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

// const PaymentMethodCard = ({ payment, onRemove }) => {
//   let icon, title, details;

//   switch (payment.methodId) {
//     case PAYMENT_METHODS.CASH:
//       icon = <FontAwesomeIcon icon={faMoneyBillAlt} className="text-3xl text-sky-600" />;
//       title = "Cash";
//       details = (
//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between">
//             <p className="font-semibold text-gray-700">Pay Amount:</p>
//             <p className="text-gray-600">{payment.amountPaid}</p>
//           </div>
//         </div>
//       );
//       break;
//     case PAYMENT_METHODS.CARD:
//       icon = <FontAwesomeIcon icon={faCreditCard} className="text-3xl text-sky-600" />;
//       title = "Card";
//       details = (
//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between">
//             <p className="font-semibold text-gray-700">Card Type:</p>
//             <p className="text-gray-600">{payment.cardPayment.cardTypeId}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="font-semibold text-gray-700">Card Number:</p>
//             <p className="text-gray-600">**** **** **** {payment.cardPayment.cardLastFourDigits}</p>
//           </div>
//           <div className="flex justify-between">
//             <p className="font-semibold text-gray-700">Amount:</p>
//             <p className="text-gray-600">{payment.amountPaid}</p>
//           </div>
//         </div>
//       );
//       break;
//     default:
//       return null;
//   }

//   return (
//     <div className="flex flex-col bg-white rounded-lg shadow-sm p-4 hover:shadow-sm transition-shadow duration-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           {icon}
//           <p className="text-lg font-semibold text-gray-700">{title}</p>
//         </div>
//         <button
//           className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
//           onClick={() => onRemove(payment.id)}
//         >
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//       </div>
//       {details}
//     </div>
//   );
// };

// const MultiPaymentList = ({ paymentList, onRemovePayment }) => {
//   return (
//     <div className="flex flex-col gap-4 mt-4">
//       {paymentList.map((payment) => (
//         <PaymentMethodCard
//           key={payment.id}
//           payment={payment}
//           onRemove={onRemovePayment}
//         />
//       ))}
//     </div>
//   );
// };

// export default MultiPaymentList;

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faMoneyBillAlt,
//   faCreditCard,
// } from "@fortawesome/free-solid-svg-icons";
// import { PAYMENT_METHODS } from "../../../utils/constants";

// const PaymentMethodCard = ({ payment, onRemove }) => {
//   let icon, title, details;

//   switch (payment.methodId) {
//     case PAYMENT_METHODS.CASH:
//       icon = (
//         <FontAwesomeIcon icon={faMoneyBillAlt} style={{ fontSize: "40px" }} />
//       );
//       title = "Cash";
//       details = (
//         <div>
//           <div className="flex flex-row gap-2 justify-content-between mb-2">
//             <p className="text-md font-semibold m-0">Pay Amount :</p>
//             <p className="text-md font-normal m-0">{payment.amountPaid}</p>
//           </div>

          
//         </div>
//       );
//       break;
//     case PAYMENT_METHODS.CARD:
//       icon = (
//         <FontAwesomeIcon icon={faCreditCard} style={{ fontSize: "40px" }} />
//       );
//       title = "Card";
//       details = (
//         <div>
//           <div className="flex flex-row gap-2 justify-content-between mb-2">
//             <p className="text-md font-semibold m-0">Card Type</p>
//             <p className="text-md font-normal m-0">
//               {payment.cardPayment.cardTypeId}
//             </p>
//           </div>
//           <div className="flex flex-row gap-2 justify-content-between mb-2">
//             <p className="text-md font-semibold m-0">Card Number</p>
//             <p className="text-md font-normal m-0">
//               **** **** **** {payment.cardPayment.cardLastFourDigits}
//             </p>
//           </div>
//           <div className="flex flex-row gap-2 justify-content-between mb-2">
//             <p
//               className="text-md font-semibold
// Save to grepper
// m-0"
//             >
//               Amount
//             </p>
//             <p className="text-md font-normal m-0">{payment.amountPaid}</p>
//           </div>
//         </div>
//       );
//       break;
//     // Add case for other payment methods like credit if needed
//     default:
//       return null;
//   }

//   return (
//     <div
//       className="flex flex-column card shadow-1 hover:shadow-4 surface-card border-round justify-content-center p-2"
//       style={{ cursor: "pointer" }}
//     >
//       <div className="flex align-items-center justify-content-between">
//         <div className="flex align-items-center">
//           {icon}
//           <p className="text-lg font-semibold ml-2">{title}</p>
//         </div>
//         <button
//           icon="pi pi-times"
//           className="p-button-rounded p-button-text p-button-danger p-button-sm"
//           onClick={() => onRemove(payment.id)}
//         />
//       </div>
//       {details}
//     </div>
//   );
// };

// const MultiPaymentList = ({ paymentList, onRemovePayment,orderSummary }) => {
//   return (
//     <div className="flex gap-4">
//           {paymentList.map((payment) => (
//             <PaymentMethodCard
//               key={payment.id}
//               payment={payment}
//               onRemove={onRemovePayment}
//             />
//           ))}
//     </div>
//   );
// };

// export default MultiPaymentList;
