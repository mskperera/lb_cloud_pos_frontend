
import { useEffect, useRef, useState } from "react";
import CashPayment from "./CashPayment";
import CardPayment from "./CardPayment";
import MultiPaymentList from "./MultiPaymentList";
import CashPaymentMulti from "./CashPaymentMulti";
import CardPaymentMulti from "./CardPaymentMulti";
import { PAYMENT_METHODS } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addMultiPayment,
  clearOrderList,
  clearPayment,
  removePayment,
} from "../../../state/orderList/orderListSlice";
import FormElementMessage from "../../messges/FormElementMessage";
import { addOrder } from "../../../functions/register";
import { formatCurrency } from "../../../utils/format";
import MessagePopup from "../../MessagePopup";

import ConfirmDialog from "../../dialog/ConfirmDialog";
import { UserIcon } from "lucide-react";

const Payment = ({showPaymentConfirm,setOrderId,handlePaymentClose}) => {
  const terminal = JSON.parse(localStorage.getItem('terminal'));
  const sessionDetails = JSON.parse(localStorage.getItem('sessionDetails'));
  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messagePopup, setMessagePopup] = useState({ isOpen: false, type: "info", title: "", message: "" });
  const { paymentList, list, orderSummary, customer } = useSelector(
    (state) => state.orderList
  );
  
  //const { customer } = useSelector((state) => state.orderList);

  const dispatch = useDispatch();


  const [paymentMethod, setPaymentMethod] = useState({
    label: "Payment Method",
    value: "Cash",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [paymentMethodSplit, setPaymentMethodSplit] = useState({
    label: "Payment Method Split",
    value: "Cash",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
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

  const addMultiPaymentToReducer = async (obj) => {
    let paymentData = null;
    let cashPaymentRes = null;
    if (paymentMethodSplit.value === "Cash") {
      cashPaymentRes = obj;
      console.log("Result from child:", cashPaymentRes);
      if (!cashPaymentRes?.allValid) return;
      const { payAmount } = cashPaymentRes.fields;
      paymentData = {
        methodId: PAYMENT_METHODS.CASH,
        amountPaid: payAmount,
        cashPayment: {
          receivedAmount: payAmount,
        },
      };
      setPaymentMethodSplit({ ...paymentMethodSplit, value: '' });
    }

    let cardPaymentRes = null;
    if (paymentMethodSplit.value === "Card") {
      cardPaymentRes = obj;
      console.log("Result from child:", cardPaymentRes);
      if (!cardPaymentRes?.allValid) return;
      const {
        bankId,
        cardExpirationMonth,
        cardHolderName,
        cardNo,
        cardTypeId,
        payAmount,
      } = cardPaymentRes.fields;
      const month = cardExpirationMonth.split("/")[0];
      const year = cardExpirationMonth.split("/")[1];
      paymentData = {
        methodId: PAYMENT_METHODS.CARD,
        amountPaid: payAmount,
        cardPayment: {
          cardHolderName: cardHolderName,
          bankId: bankId,
          cardTypeId: cardTypeId,
          cardLastFourDigits: cardNo,
          cardExpirationMonth: month,
          cardExpirationYear: year,
        },
      };
      setPaymentMethodSplit({ ...paymentMethodSplit, value: '' });
    }
    return paymentData;
  };

  const onSubmit = async (isPayConfirmed) => {
    if (!customer && !isPayConfirmed) {
      setShowDialog(true);
      return;
    }

  if (selectedTab === "Single" && paymentMethod.value === "Card") {
  const cardValidationResult = await cardPaymentRef.current?.getValidatedData?.();
  if (!cardValidationResult?.allValid) {
    setMessagePopup({
      isOpen: true,
      type: "warning",
      title: "Card Selection Required",
      message: "Please choose Visa, Mastercard, or AMEX before completing the payment.",
    });
    return;
  }
}

    setIsSubmitting(true);
    const {
      overallDiscountTypeId,
      overallDiscountValue,
      overallDiscountReasonId,
      overallDiscountReasonRemark,
    } = orderSummary;
    const payLoad = {
      customerId: customer?.contactId,
      terminalId: terminal.terminalId,
      sessionId: sessionDetails.sessionId,
     // storeId: store.storeId,
      orderList: list,
      isConfirm: true,
    };
    if (orderSummary.overallDiscounts) {
      payLoad.overallDiscounts = {
        overallDiscountTypeId: overallDiscountTypeId,
        overallDiscountValue: overallDiscountValue,
        overallDiscountReasonId: overallDiscountReasonId,
        overallDiscountRemark: overallDiscountReasonRemark,
      };
    }
    payLoad.paymentList = paymentList;
    console.log('onSubmit:payLoad', payLoad);
    const res = await addOrder(payLoad, "");
    console.log('onSubmit:addOrder', res.data);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      setMessagePopup({
        isOpen: true,
        type: "danger",
        title: "Payment Failed",
        message: error.message || "Unable to process the payment request.",
      });
      return;
    }

    const { orderId, outputMessage, responseStatus } = res.data.outputValues;

    if (responseStatus === "failed") {
      setIsSubmitting(false);
      setMessagePopup({
        isOpen: true,
        type: "warning",
        title: "Payment Warning",
        message: outputMessage || "The payment could not be completed.",
      });
      return;
    }


 
    console.log("addOrder", orderId);
    dispatch(clearOrderList({}));

    
    showPaymentConfirm(true);
    setOrderId(orderId);
   // navigate(`/paymentConfirm?orderId=${orderId}`);

   
setMessagePopup({
      isOpen: true,
      type: "success",
      title: "Payment Successful",
      message: outputMessage || "The order was processed successfully.",
    });
    setIsSubmitting(false);
  };

  const cashPaymentRef = useRef();
  const cardPaymentRef = useRef();

  const onSplitPaymentHandler = async (obj) => {
    console.log("onaddpayment", obj);
    const paymentData = await addMultiPaymentToReducer(obj);
    console.log("addMultiPayment", paymentData);
    dispatch(addMultiPayment({ paymentData }));
  };

  const onRemovePaymentHandler = (value) => {
    console.log("onRemovePaymentHandler", value);
    dispatch(removePayment({ id: value }));
  };

  const [selectedTab, setSelectedTab] = useState('Single');
  useEffect(() => {
    dispatch(clearPayment());
  }, [selectedTab, dispatch]);

  const [amountReceived, setAmountReceived] = useState(0);
  useEffect(() => {
    const sum = paymentList.reduce((acc, current) => acc + Number(current.amountPaid), 0);
    setAmountReceived(sum);
  }, [paymentList]);

  const [showDialog, setShowDialog] = useState(false);
  const handleConfirm = () => {
    setShowDialog(false);
    onSubmit(true);
  };
  const handleCancel = () => {
    setShowDialog(false);
  };


return (
  <>
    {showDialog && (
      <ConfirmDialog
        isVisible={true}
        message="No customer selected. Continue order as a walk-in customer?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirmation"
        severity="info"
      />
    )}

    <div className="mx-auto flex w-[700px] max-w-full flex-col items-center gap-4 overflow-x-auto px-4 ">
      <div
        className="
    w-full
    rounded-2xl
    bg-sky-700
    p-4
    text-white
    shadow-lg
    shadow-sky-800/20
  "
      >
        {/* Header */}
        <div
          className="
      flex
      flex-col
      gap-3
      sm:flex-row
      items-center
      justify-between
    "
        >
          <h2
            className="
        text-base
        font-bold
        uppercase
        tracking-[0.18em]
        text-sky-100
      "
          >
            Payment Summary
          </h2>

          <div
            className="
        flex
        items-center
        gap-2
        rounded-full
        bg-sky-600
        px-3
        py-1.5
        text-sm
        font-medium
      "
          >
            <UserIcon size={18} strokeWidth={2.2} />

            <span>
              {customer
                ? `${customer.contactCode} | ${customer.contactName}`
                : "Walk-in Customer"}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          className="
      mt-4
      grid
      grid-cols-1
      gap-3
      sm:grid-cols-3
    "
        >
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-sky-100/90">
              Total Due
            </p>

            <p className="mt-1 text-lg font-bold">
              {formatCurrency(orderSummary.grandTotal)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-sky-100/90">
              Amount Tendered
            </p>

            <p className="mt-1 text-lg font-bold">
              {formatCurrency(amountReceived)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-sky-100/90">
              {orderSummary.shortfall > 0 ? "Remaining" : "Change Due"}
            </p>

            <p className="mt-1 text-lg font-bold">
              {orderSummary.shortfall > 0
                ? formatCurrency(orderSummary.shortfall)
                : formatCurrency(orderSummary.cashBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* <div
        className="
          w-full
          rounded-3xl
          bg-sky-700
          p-6
          text-white
          shadow-lg
          shadow-sky-800/20
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            items-center
            justify-between
          "
        >
          <div>
            <p
              className="
                text-lg
                uppercase
                tracking-widest
                text-sky-100
                font-semibold
                item-center
              "
            >
              Payment Summary
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-sky-600
              px-4
              py-2
              text-sm
              font-semibold
            "
          >
            <UserIcon size={20} strokeWidth={2.25} />

            <span>
              {customer
                ? `${customer.contactCode} | ${customer.contactName}`
                : "Walk-in customer"}
            </span>
          </div>
        </div>

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          <div className="rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-widest text-sky-100">
              Total Due
            </p>

            <p className="mt-3 text-xl font-bold">
              {formatCurrency(orderSummary.grandTotal)}
            </p>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-4
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-widest
                text-sky-100
              "
            >
              Amount Tendered
            </p>

            <p
              className="
                mt-3
                text-xl
                font-bold
              "
            >
              {formatCurrency(amountReceived)}
            </p>
          </div>

          <div
            className="
              rounded-3xl
              bg-white/10
              p-4
            "
          >
            <p
              className="
                text-xs
                uppercase
                tracking-widest
                text-sky-100
              "
            >
              {orderSummary.shortfall > 0
                ? "Remaining Shortfall"
                : "Change Due"}
            </p>

            <p
              className="
                mt-3
                text-xl
                font-bold
              "
            >
              {orderSummary.shortfall > 0
                ? formatCurrency(orderSummary.shortfall)
                : formatCurrency(orderSummary.cashBalance)}
            </p>
          </div>
        </div>
      </div> */}

      <div
        className="
          flex
          w-full
          gap-3
        "
      >
        <button
          onClick={() => setSelectedTab("Single")}
          className={`
            flex-1
            h-12
            rounded-xl
            font-bold
            transition-all
            text-base
            ${
              selectedTab === "Single"
                ? "bg-sky-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }
          `}
        >
          Single Payment
        </button>

        <button
          onClick={() => setSelectedTab("Split")}
          className={`
            flex-1
            h-12
            rounded-xl
            font-bold
            transition-all
            text-base
            ${
              selectedTab === "Split"
                ? "bg-sky-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }
          `}
        >
          Split Payment
        </button>
      </div>

      <div
        className="
          w-full
          bg-white "
      >
        {selectedTab === "Single" && (
          <div
            className="
            flex
            flex-col
            gap-6
            lg:flex-row
          "
          >
            {/* PAYMENT METHOD */}

            <div
              className="
              flex
              gap-3
              lg:w-1/4
              lg:flex-col
            "
            >
              {["Cash", "Card", "Credit"].map((method) => (
                <button
                  key={method}
                  onClick={() =>
                    setPaymentMethod({
                      ...paymentMethod,
                      value: method,
                    })
                  }
                  className={`
                    h-12
                    rounded-xl
                    font-semibold
                    transition-all
                    ${
                      paymentMethod.value === method
                        ? "bg-sky-600 text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* PAYMENT FORM */}

            <div className="flex-1">
              {paymentMethod.value === "Cash" && (
                <CashPayment ref={cashPaymentRef} />
              )}

              {paymentMethod.value === "Card" && (
                <CardPayment ref={cardPaymentRef} />
              )}

              {validationMessages(paymentMethod)}

              {orderSummary.cashBalanceException &&
                orderSummary.isRecevedAmountTouched && (
                  <FormElementMessage
                    className="mt-2 w-full"
                    severity="error"
                    text={orderSummary.cashBalanceException}
                  />
                )}
            </div>
          </div>
        )}

        {selectedTab === "Split" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-3 justify-center mt-2">
              <span className="text-sm font-semibold text-slate-700">
               Payment Method
              </span>

              <select
                className="
      h-10
      w-44
      rounded-lg
      border
      border-slate-300
      bg-white
      px-3
      text-sm
      font-medium
      text-slate-800
      focus:border-sky-500
      focus:outline-none
      focus:ring-2
      focus:ring-sky-100
    "
                value={paymentMethodSplit.value}
                onChange={(e) =>
                  setPaymentMethodSplit({
                    ...paymentMethodSplit,
                    value: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {validationMessages(paymentMethodSplit)}

            {paymentMethodSplit.value === "Cash" && (
              <CashPaymentMulti onAddPayment={onSplitPaymentHandler} />
            )}

            {paymentMethodSplit.value === "Card" && (
              <CardPaymentMulti onAddPayment={onSplitPaymentHandler} />
            )}

            <MultiPaymentList
              paymentList={paymentList}
              onRemovePayment={onRemovePaymentHandler}
            />
          </div>
        )}
      </div>

      <div
        className="w-full flex
          justify-end gap-3"
      >
        <button
          className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-8
            py-3
            font-semibold
            text-slate-700
            hover:bg-slate-50
          "
          onClick={handlePaymentClose}
        >
          Cancel
        </button>

        <button
          className={`
            rounded-xl
            px-8
            py-3
            font-bold
            text-white
            ${
              isSubmitting
                ? "cursor-not-allowed bg-slate-400"
                : "bg-sky-600 hover:bg-sky-700"
            }
          `}
          onClick={() => onSubmit(false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Completing..." : "Complete Payment"}
        </button>
      </div>
    </div>

    <MessagePopup
      isOpen={messagePopup.isOpen}
      onClose={() =>
        setMessagePopup((prev) => ({
          ...prev,
          isOpen: false,
        }))
      }
      type={messagePopup.type}
      title={messagePopup.title}
      message={messagePopup.message}
    />
  </>
);




//   return (
//     <>
//       {showDialog && (
//         <ConfirmDialog
//           isVisible={true}
//           message="No customer selected. Continue order as a walk-in customer?"
//           onConfirm={handleConfirm}
//           onCancel={handleCancel}
//           title="Confirmation"
//           severity="info"
//         />
//       )}

     

//   {/* Replace your outer wrapping div line with this configuration */}
// <div className="mx-auto flex w-[896px] max-w-full flex-col items-center gap-4 overflow-x-auto px-4">
//         <div className="flex justify-center gap-2 w-full">
//           <button
//             onClick={() => setSelectedTab("Single")}
//             className={`flex-1 py-2 px-6 rounded-lg font-semibold text-center transition-all duration-300 ${
//               selectedTab === "Single"
//                 ? "bg-sky-600 text-white shadow-md"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             Single
//           </button>
//           <button
//             onClick={() => setSelectedTab("Split")}
//             className={`flex-1 py-2 px-6 rounded-lg font-semibold text-center transition-all duration-300 ${
//               selectedTab === "Split"
//                 ? "bg-sky-600 text-white shadow-md"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             Split
//           </button>
//         </div>
//         <div className="w-full rounded-3xl bg-sky-700 text-white p-6 shadow-lg shadow-sky-800/20">
//           <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
//             <div>
//               <p className="text-xs uppercase tracking-[0.24em] text-sky-100/80">Order summary</p>
    
//             </div>
         
//          <div className="flex items-center gap-2 rounded-full bg-sky-600/90 px-4 py-2 text-sm font-semibold text-white shadow-sm w-fit">  
//   <UserIcon size={20} strokeWidth={2.25} className="shrink-0" /> 
//   <span>
//     {customer ? `${customer.contactCode} | ${customer.contactName}` : "Walk-in customer"}
//   </span>
// </div>
//           </div>

//           <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 xl:grid-cols-3">
//             <div className="rounded-3xl bg-white/10 p-4">
//               <p className="text-xs uppercase tracking-[0.24em] text-sky-100/80">Total Due</p>
//               <p className="mt-3 text-xl font-semibold">{formatCurrency(orderSummary.grandTotal)}</p>
//             </div>
//             <div className="rounded-3xl bg-white/10 p-4">
//               <p className="text-xs uppercase tracking-[0.24em] text-sky-100/80">Amount Tenderd</p>
//               <p className="mt-3 text-xl font-semibold">{formatCurrency(amountReceived)}</p>
//             </div>
//   {(() => {
//   const hasShortfall = orderSummary.shortfall > 0;

//   return (
//     <div className={`rounded-3xl p-4 transition-colors duration-200 bg-white/10`}>
//       <p className={`text-xs uppercase tracking-[0.24em] text-sky-100/80`}>
//         {hasShortfall ? "Remaining Shortfall" : "Change Due"}
//       </p>
//       <p className={`mt-3 text-xl font-semibold text-white`}>
//         {hasShortfall 
//           ? formatCurrency(orderSummary.shortfall) 
//           : formatCurrency(orderSummary.cashBalance)
//         }
//       </p>
//     </div>
//   );
// })()}
       
//           </div>
//         </div>
//         <div className="w-full overflow-hidden rounded-lg  bg-white p-2">
//           {selectedTab === "Single" && (
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="flex flex-col gap-2 md:w-1/4">
//                 {["Cash", "Card", "Credit"].map((method) => (
//                   <button
//                     key={method}
//                     onClick={() => setPaymentMethod({ ...paymentMethod, value: method })}
//                     className={`py-4 px-6 text-sm uppercase font-semibold rounded-lg transition-all duration-300 ${
//                       paymentMethod.value === method
//                         ? "bg-sky-600 text-white hover:bg-sky-700"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     }`}
//                   >
//                     {method}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex-1">
//                 {paymentMethod.value === "Cash" && <CashPayment ref={cashPaymentRef} />}
//                 {paymentMethod.value === "Card" && <CardPayment ref={cardPaymentRef} />}
//                 {validationMessages(paymentMethod)}
//                 {orderSummary.cashBalanceException && orderSummary.isRecevedAmountTouched && (
//                   <FormElementMessage
//                     className="mt-2 w-full"
//                     severity="error"
//                     text={orderSummary.cashBalanceException}
//                   />
//                 )}
//               </div>
//             </div>
//           )}
//           {selectedTab === "Split" && (
//             <div className="flex flex-col gap-6">
//         <div className="flex items-center justify-between gap-4">

//   <label className="text-base font-semibold text-slate-700">
//     Payment Method
//   </label>


//   <select
//     className="
//       min-w-[180px]
//       h-11
//       rounded-lg
//       border
//       border-slate-300
//       bg-white
//       px-3
//       text-sm
//       font-semibold
//       text-slate-800
//       shadow-sm
//       transition
//       hover:border-sky-400
//       focus:border-sky-500
//       focus:outline-none
//       focus:ring-2
//       focus:ring-sky-100
//     "
//     onChange={(e) =>
//       setPaymentMethodSplit({
//         ...paymentMethodSplit,
//         value: e.target.value
//       })
//     }
//     value={paymentMethodSplit.value}
//   >

//     <option value="">
//       Select Method
//     </option>

//     <option value="Cash">
//       Cash
//     </option>

//     <option value="Card">
//       Card
//     </option>

//     <option value="Credit">
//       Credit
//     </option>

//   </select>

// </div>
//               {validationMessages(paymentMethodSplit)}
//               <div>
//                 {paymentMethodSplit.value === "Cash" && (
//                   <CashPaymentMulti onAddPayment={onSplitPaymentHandler} />
//                 )}
//                 {paymentMethodSplit.value === "Card" && (
//                   <CardPaymentMulti onAddPayment={onSplitPaymentHandler} />
//                 )}
//                 <MultiPaymentList
//                   paymentList={paymentList}
//                   onRemovePayment={onRemovePaymentHandler}
//                 />
//               </div>
//             </div>
//           )}
//           <div className="flex justify-end mt-6 gap-4">
        


//  <button
//        className={`rounded-xl px-8 py-3 font-semibold transition ${
//          isSubmitting
//            ? "cursor-not-allowed bg-slate-300"
//            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
//       }`}
//        onClick={handlePaymentClose}
//      >
//        Cancel
//      </button>

//      <button
//        className={`rounded-xl px-8 py-3 font-bold text-white transition ${
//          isSubmitting
//            ? "cursor-not-allowed bg-slate-400"
//            : "bg-sky-600 hover:bg-sky-700"
//        }`}
//        onClick={() => onSubmit(false)}
//        disabled={isSubmitting}
//      >
// {isSubmitting ? "Completing..." : "Complete Payment"}
//      </button>





             
//           </div>
//         </div>
//       </div>

//       <MessagePopup
//         isOpen={messagePopup.isOpen}
//         onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
//         type={messagePopup.type}
//         title={messagePopup.title}
//         message={messagePopup.message}
//       />
//     </>
//   );
};

export default Payment;








// import { useEffect, useRef, useState } from "react";
// import CashPayment from "./CashPayment";
// import CardPayment from "./CardPayment";
// import MultiPaymentList from "./MultiPaymentList";
// import CashPaymentMulti from "./CashPaymentMulti";
// import CardPaymentMulti from "./CardPaymentMulti";
// import { PAYMENT_METHODS } from "../../../utils/constants";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addMultiPayment,
//   clearOrderList,
//   clearPayment,
//   removePayment,
// } from "../../../state/orderList/orderListSlice";
// import FormElementMessage from "../../messges/FormElementMessage";
// import { addOrder } from "../../../functions/register";
// import { formatCurrency } from "../../../utils/format";
// import MessagePopup from "../../MessagePopup";

// import ConfirmDialog from "../../dialog/ConfirmDialog";
// import { UserIcon } from "lucide-react";

// const Payment = ({showPaymentConfirm,setOrderId,handlePaymentClose}) => {
//   const terminal = JSON.parse(localStorage.getItem('terminal'));
//   const sessionDetails = JSON.parse(localStorage.getItem('sessionDetails'));
//   const store = JSON.parse(localStorage.getItem('selectedStore'));
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [messagePopup, setMessagePopup] = useState({ isOpen: false, type: "info", title: "", message: "" });
//   const { paymentList, list, orderSummary, customer } = useSelector(
//     (state) => state.orderList
//   );
  
//   //const { customer } = useSelector((state) => state.orderList);

//   const dispatch = useDispatch();


//   const [paymentMethod, setPaymentMethod] = useState({
//     label: "Payment Method",
//     value: "Cash",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "integer" },
//   });

//   const [paymentMethodSplit, setPaymentMethodSplit] = useState({
//     label: "Payment Method Split",
//     value: "Cash",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });

//   const validationMessages = (state) => {
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

//   const addMultiPaymentToReducer = async (obj) => {
//     let paymentData = null;
//     let cashPaymentRes = null;
//     if (paymentMethodSplit.value === "Cash") {
//       cashPaymentRes = obj;
//       console.log("Result from child:", cashPaymentRes);
//       if (!cashPaymentRes?.allValid) return;
//       const { payAmount } = cashPaymentRes.fields;
//       paymentData = {
//         methodId: PAYMENT_METHODS.CASH,
//         amountPaid: payAmount,
//         cashPayment: {
//           receivedAmount: payAmount,
//         },
//       };
//       setPaymentMethodSplit({ ...paymentMethodSplit, value: '' });
//     }

//     let cardPaymentRes = null;
//     if (paymentMethodSplit.value === "Card") {
//       cardPaymentRes = obj;
//       console.log("Result from child:", cardPaymentRes);
//       if (!cardPaymentRes?.allValid) return;
//       const {
//         bankId,
//         cardExpirationMonth,
//         cardHolderName,
//         cardNo,
//         cardTypeId,
//         payAmount,
//       } = cardPaymentRes.fields;
//       const month = cardExpirationMonth.split("/")[0];
//       const year = cardExpirationMonth.split("/")[1];
//       paymentData = {
//         methodId: PAYMENT_METHODS.CARD,
//         amountPaid: payAmount,
//         cardPayment: {
//           cardHolderName: cardHolderName,
//           bankId: bankId,
//           cardTypeId: cardTypeId,
//           cardLastFourDigits: cardNo,
//           cardExpirationMonth: month,
//           cardExpirationYear: year,
//         },
//       };
//       setPaymentMethodSplit({ ...paymentMethodSplit, value: '' });
//     }
//     return paymentData;
//   };

//   const onSubmit = async (isPayConfirmed) => {
//     if (!customer && !isPayConfirmed) {
//       setShowDialog(true);
//       return;
//     }

//   if (selectedTab === "Single" && paymentMethod.value === "Card") {
//   const cardValidationResult = await cardPaymentRef.current?.getValidatedData?.();
//   if (!cardValidationResult?.allValid) {
//     setMessagePopup({
//       isOpen: true,
//       type: "warning",
//       title: "Card Selection Required",
//       message: "Please choose Visa, Mastercard, or AMEX before completing the payment.",
//     });
//     return;
//   }
// }

//     setIsSubmitting(true);
//     const {
//       overallDiscountTypeId,
//       overallDiscountValue,
//       overallDiscountReasonId,
//       overallDiscountReasonRemark,
//     } = orderSummary;
//     const payLoad = {
//       customerId: customer?.contactId,
//       terminalId: terminal.terminalId,
//       sessionId: sessionDetails.sessionId,
//       storeId: store.storeId,
//       orderList: list,
//       isConfirm: true,
//     };
//     if (orderSummary.overallDiscounts) {
//       payLoad.overallDiscounts = {
//         overallDiscountTypeId: overallDiscountTypeId,
//         overallDiscountValue: overallDiscountValue,
//         overallDiscountReasonId: overallDiscountReasonId,
//         overallDiscountRemark: overallDiscountReasonRemark,
//       };
//     }
//     payLoad.paymentList = paymentList;
//     console.log('onSubmit:payLoad', payLoad);
//     const res = await addOrder(payLoad, "");
//     console.log('onSubmit:addOrder', res.data);
//     if (res.data.error) {
//       setIsSubmitting(false);
//       const { error } = res.data;
//       setMessagePopup({
//         isOpen: true,
//         type: "danger",
//         title: "Payment Failed",
//         message: error.message || "Unable to process the payment request.",
//       });
//       return;
//     }

//     const { orderId, outputMessage, responseStatus } = res.data.outputValues;

//     if (responseStatus === "failed") {
//       setIsSubmitting(false);
//       setMessagePopup({
//         isOpen: true,
//         type: "warning",
//         title: "Payment Warning",
//         message: outputMessage || "The payment could not be completed.",
//       });
//       return;
//     }


 
//     console.log("addOrder", orderId);
//     dispatch(clearOrderList({}));

    
//     showPaymentConfirm(true);
//     setOrderId(orderId);
//    // navigate(`/paymentConfirm?orderId=${orderId}`);

   
// setMessagePopup({
//       isOpen: true,
//       type: "success",
//       title: "Payment Successful",
//       message: outputMessage || "The order was processed successfully.",
//     });
//     setIsSubmitting(false);
//   };

//   const cashPaymentRef = useRef();
//   const cardPaymentRef = useRef();

//   const onSplitPaymentHandler = async (obj) => {
//     console.log("onaddpayment", obj);
//     const paymentData = await addMultiPaymentToReducer(obj);
//     console.log("addMultiPayment", paymentData);
//     dispatch(addMultiPayment({ paymentData }));
//   };

//   const onRemovePaymentHandler = (value) => {
//     console.log("onRemovePaymentHandler", value);
//     dispatch(removePayment({ id: value }));
//   };

//   const [selectedTab, setSelectedTab] = useState('Single');
//   useEffect(() => {
//     dispatch(clearPayment());
//   }, [selectedTab, dispatch]);

//   const [amountReceived, setAmountReceived] = useState(0);
//   useEffect(() => {
//     const sum = paymentList.reduce((acc, current) => acc + Number(current.amountPaid), 0);
//     setAmountReceived(sum);
//   }, [paymentList]);

//   const [showDialog, setShowDialog] = useState(false);
//   const handleConfirm = () => {
//     setShowDialog(false);
//     onSubmit(true);
//   };
//   const handleCancel = () => {
//     setShowDialog(false);
//   };

//   return (
//     <>
//       {showDialog && (
//         <ConfirmDialog
//           isVisible={true}
//           message="No customer selected. Continue order as a walk-in customer?"
//           onConfirm={handleConfirm}
//           onCancel={handleCancel}
//           title="Confirmation"
//           severity="info"
//         />
//       )}

     

// <div className="max-w-4xl rounded-3xl shadow-sm">



//    <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 p-6">

//   {/* Header */}
//   <div className="flex flex-col gap-4 sm:flex-row items-center sm:justify-between">

//     <div>
//       <h3 className=" font-bold uppercase text-slate-800">
//         Payment Summary
//       </h3>

//       {/* <p className="text-sm text-slate-500">
//         Review payment before completing the transaction.
//       </p> */}
//     </div>

//     <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">

//       <UserIcon
//         size={18}
//         className="text-slate-500"
//       />

//       <span className="text-sm font-semibold text-slate-700">
//         {customer
//           ? `${customer.contactCode} • ${customer.contactName}`
//           : "Walk-in Customer"}
//       </span>

//     </div>

//   </div>

//   {/* Summary */}
//   <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

//     {/* Grand Total */}
//     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

//       <p className="text-sm font-semibold tracking-wider text-slate-500">
//         Grand Total
//       </p>

//       <p className="mt-2 text-xl font-bold text-slate-900">
//         {formatCurrency(orderSummary.grandTotal)}
//       </p>

//     </div>

//     {/* Paid Total */}
//     <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">

//       <p className="text-sm font-semibold tracking-wider text-emerald-700">
//         Paid Total
//       </p>

//       <p className="mt-2 text-xl font-bold text-emerald-700">
//         {formatCurrency(amountReceived)}
//       </p>

//     </div>

//     {/* Amount Due / Change */}
//     <div
//       className={`rounded-xl border p-5 shadow-sm ${
//         orderSummary.cashBalance > 0
//           ? "border-amber-200 bg-amber-50"
//           : "border-sky-200 bg-sky-50"
//       }`}
//     >

//       <p
//         className={`text-sm font-semibold tracking-wider ${
//           orderSummary.cashBalance > 0
//             ? "text-amber-700"
//             : "text-sky-700"
//         }`}
//       >
//         {orderSummary.cashBalance > 0
//           ? "Amount Due"
//           : "Change"}
//       </p>

//       <p
//         className={`mt-2 text-xl font-bold ${
//           orderSummary.cashBalance > 0
//             ? "text-amber-700"
//             : "text-sky-700"
//         }`}
//       >
//         {formatCurrency(Math.abs(orderSummary.cashBalance))}
//       </p>

//     </div>

//   </div>

// </div>

//   {/* ================= Payment Mode ================= */}
//   <div className="mt-8">

//     {/* <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
//       Payment Mode
//     </p> */}

//     <div className="inline-flex rounded-xl bg-slate-200 p-1">

//       <button
//         onClick={() => setSelectedTab("Single")}
//         className={`rounded-lg px-8 py-2.5 text-sm font-semibold transition ${
//           selectedTab === "Single"
//             ? "bg-white text-sky-700 shadow-sm"
//             : "text-slate-600 hover:text-slate-800"
//         }`}
//       >
//         Single Payment
//       </button>

//       <button
//         onClick={() => setSelectedTab("Split")}
//         className={`rounded-lg px-8 py-2.5 text-sm font-semibold transition ${
//           selectedTab === "Split"
//             ? "bg-white text-sky-700 shadow-sm"
//             : "text-slate-600 hover:text-slate-800"
//         }`}
//       >
//         Split Payment
//       </button>

//     </div>

//   </div>

//   {/* ================= Payment Area ================= */}
//   <div className="mt-6">

//     {selectedTab === "Single" && (

//       <div className="flex flex-col gap-6 lg:flex-row">

//         {/* Payment Methods */}
//         <div className="w-full lg:w-64">

//           <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

//             <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
//               Payment Method
//             </p>

//             <div className="space-y-2">

//               {["Cash", "Card", "Credit"].map((method) => (

//                 <button
//                   key={method}
//                   onClick={() =>
//                     setPaymentMethod({
//                       ...paymentMethod,
//                       value: method,
//                     })
//                   }
//                   className={`w-full rounded-xl px-4 py-3 text-left font-semibold transition ${
//                     paymentMethod.value === method
//                       ? "bg-sky-600 text-white shadow"
//                       : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
//                   }`}
//                 >
//                   {method}
//                 </button>

//               ))}

//             </div>

//           </div>

//         </div>

//         {/* Payment Form */}

//         <div className="flex-1  p-6 shadow-sm  rounded-2xl border border-slate-200 bg-slate-50">

//           {paymentMethod.value === "Cash" && (
//             <CashPayment ref={cashPaymentRef} />
//           )}

//           {paymentMethod.value === "Card" && (
//             <CardPayment ref={cardPaymentRef} />
//           )}

//           {validationMessages(paymentMethod)}

//           {orderSummary.cashBalanceException &&
//             orderSummary.isRecevedAmountTouched && (
//               <FormElementMessage
//                 className="mt-4 w-full"
//                 severity="error"
//                 text={orderSummary.cashBalanceException}
//               />
//             )}

//         </div>

//       </div>

//     )}

//     {selectedTab === "Split" && (

//       <div className="space-y-5">

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

//             <div>

//               <h3 className="font-semibold text-slate-800">
//                 Split Payments
//               </h3>

//               <p className="text-sm text-slate-500">
//                 Add multiple payment methods.
//               </p>

//             </div>

//             <select
//               className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
//               value={paymentMethodSplit.value}
//               onChange={(e) =>
//                 setPaymentMethodSplit({
//                   ...paymentMethodSplit,
//                   value: e.target.value,
//                 })
//               }
//             >
//               <option value="">Select Payment Method</option>
//               <option value="Cash">Cash</option>
//               <option value="Card">Card</option>
//               <option value="Credit">Credit</option>
//             </select>

//           </div>

//         </div>

//         {validationMessages(paymentMethodSplit)}

     
//           {paymentMethodSplit.value === "Cash" && (
//             <CashPaymentMulti onAddPayment={onSplitPaymentHandler} />
//           )}

//           {paymentMethodSplit.value === "Card" && (
//             <CardPaymentMulti onAddPayment={onSplitPaymentHandler} />
//           )}

      

//         {/* <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"> */}

//           <MultiPaymentList
//             paymentList={paymentList}
//             onRemovePayment={onRemovePaymentHandler}
//           />

//         {/* </div> */}

//       </div>

//     )}

//   </div>

//   {/* ================= Footer ================= */}
//   <div className="mt-8 flex justify-end gap-3 ">

//     <button
//       className={`rounded-xl px-8 py-3 font-semibold transition ${
//         isSubmitting
//           ? "cursor-not-allowed bg-slate-300"
//           : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
//       }`}
//       onClick={handlePaymentClose}
//     >
//       Cancel
//     </button>

//     <button
//       className={`rounded-xl px-8 py-3 font-bold text-white transition ${
//         isSubmitting
//           ? "cursor-not-allowed bg-slate-400"
//           : "bg-sky-600 hover:bg-sky-700"
//       }`}
//       onClick={() => onSubmit(false)}
//       disabled={isSubmitting}
//     >
//       {isSubmitting ? "Submitting..." : "Tender"}
//     </button>

//   </div>

// </div>

//       <MessagePopup
//         isOpen={messagePopup.isOpen}
//         onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
//         type={messagePopup.type}
//         title={messagePopup.title}
//         message={messagePopup.message}
//       />
//     </>
//   );
// };

// export default Payment;