import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endSession, getSessionEnd, getSessionMismatchCheck } from "../../functions/session";
import { formatCurrency, getCurrency } from "../../utils/format";
import { useToast } from "../../components/useToast";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
import LoadingPopup from '../../components/LoadingPopup';
import DialogModel2 from "../../components/model/DialogModel2";
import { Coins, Store, Clock, Terminal, Calendar, Monitor } from "lucide-react";

const Detail = ({ label, value, bold = false, highlight = false }) => (
  <div className="flex justify-between py-2.5 border-b border-slate-100 last:border-b-0">
    <span className={`text-slate-600 text-sm ${bold ? "font-semibold" : ""}`}>
      {label}
    </span>
    <span className={`text-right text-sm ${bold ? "font-semibold text-slate-900" : "text-slate-700"} 
                     ${highlight ? "text-emerald-600 font-medium" : ""}`}>
      {value}
    </span>
  </div>
);

const CashDenominationRow = ({ denom, value, onChange }) => (
  <div className="grid grid-cols-12 items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0">
    <div className="col-span-5 font-medium text-slate-700 px-4 flex items-center gap-2">
     <Coins className="h-6 w-6 text-slate-500" />
     <span>{denom.label}</span>
    </div>
    <div className="col-span-3">
      <input
        type="number"
        value={value}
        onChange={onChange}
        min="0"
        className="w-full px-4 py-2 text-center bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
      />
    </div>
    <div className="col-span-4 text-right font-medium text-slate-900 px-4 font-mono">
      {formatCurrency(denom.qty * value, false)}
    </div>
  </div>
);

const DayEnd = ({ isVisible, setIsVisible }) => {
  const navigate = useNavigate();
  const showToast = useToast();

  const [dayendDetails, setDayendDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [cashDenominations, setCashDenominations] = useState([
    { label: `5000`, qty: 5000, value: 0 },
    { label: `1000`, qty: 1000, value: 0 },
    { label: `500`, qty: 500, value: 0 },
    { label: `100`, qty: 100, value: 0 },
    { label: `50`, qty: 50, value: 0 },
    { label: `20`, qty: 20, value: 0 },
    { label: `10`, qty: 10, value: 0 },
    { label: `5`, qty: 5, value: 0 },
    { label: `2`, qty: 2, value: 0 },
    { label: `1`, qty: 1, value: 0 },
  ]);

  const cashDenominationTotal = cashDenominations.reduce((sum, d) => sum + d.qty * d.value, 0);
  const short = cashDenominationTotal - (dayendDetails?.expectedCash || 0);

  const terminal = JSON.parse(localStorage.getItem("terminal"));
  const sessionDetails = JSON.parse(localStorage.getItem("sessionDetails"));
  const selectedStore = JSON.parse(localStorage.getItem("selectedStore")) || {};
  
  const sessionName = sessionDetails?.sessionName;
  
  const terminalName = terminal?.terminalName;

  const storeName = selectedStore?.storeName || "N/A";

  useEffect(() => {
    if (isVisible) {
      loadSessionMismatchCheck();
      loadDayendDetails();
    }
  }, [isVisible]);

  const loadSessionMismatchCheck = async () => {
    try {
      const result = await getSessionMismatchCheck(sessionDetails.sessionId, terminal?.terminalId);
      if (result.data.values.isSessionMismatched) {
        navigate('/home');
      }
    } catch (err) {
      console.error("Mismatch check error:", err);
    }
  };

  const loadDayendDetails = async () => {
    try {
      setIsLoading(true);
      const payload = { sessionId: sessionDetails.sessionId, terminalId: terminal?.terminalId };
      const result = await getSessionEnd(payload);
      setDayendDetails(result.data.records[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDenominationChange = (index, newValue) => {
    const updated = [...cashDenominations];
    updated[index].value = parseInt(newValue) || 0;
    setCashDenominations(updated);
  };

  const handleDayEnd = async () => {
    const payload = {
      sessionId: sessionDetails.sessionId,
      actualCash: cashDenominationTotal,
      short: short,
      isConfirm: true,
    };

    setIsLoading(true);
    try {
      const res = await endSession(payload);
      const { success, exception, error } = res.data;

      if (error) return showToast("danger", "Error", error.message);
      if (exception) return showToast("danger", "Exception", exception.message);

      showToast("success", "Success", success?.message || "Session ended successfully");
      navigate("/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogModel2 title="Day End" onHide={() => setIsVisible(false)}>
      <div className="max-w-7xl mx-auto p-5 overflow-y-auto">
        {isLoading && !dayendDetails ? (
          <LoadingPopup text="Loading Day-End Summary..." />
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-10 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Day End Summary</h1>
              <div className="flex flex-wrap gap-6 items-center justify-center">
                <p className="flex items-center gap-2 text-slate-600">
                  <Store className="h-6 w-6 text-slate-500" />
                  Store: <span className="font-semibold text-slate-800">{storeName}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-6 w-6 text-slate-500" />
                  Session: <span className="font-semibold text-slate-800">{sessionName}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Monitor className="h-6 w-6 text-slate-500" />
                  Terminal: <span className="font-semibold text-slate-800">{terminalName}</span>
                </p>
              </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cash Denominations */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold mb-5">Cash Denominations</h2>
                  <p className="text-slate-600 mb-6">
                    Count the physical cash and enter quantities below
                  </p>

                  <div className="bg-slate-50 rounded-xl p-1">
                    <div className="grid grid-cols-12  font-medium text-slate-500 px-4 py-3 border-b border-slate-200">
                      <div className="col-span-5">Denomination ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</div>
                      <div className="col-span-3 text-center">Quantity</div>
                      <div className="col-span-4 text-right">Amount ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</div>
                    </div>

                    {cashDenominations.map((denom, index) => (
                      <CashDenominationRow
                        key={denom.label}
                        denom={denom}
                        value={denom.value}
                        onChange={(e) => onDenominationChange(index, e.target.value)}
                      />
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center bg-slate-50 rounded-xl px-6 py-4">
                    <span className="font-semibold text-lg">Total Actual Cash</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(cashDenominationTotal,false)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Summaries */}
              <div className="lg:col-span-5 space-y-8">

                          {/* Sales & Transaction Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold mb-5">Sales Summary ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</h2>
                  <div className="space-y-1">
                  <Detail label="Revenue" value={formatCurrency(dayendDetails?.totalSales,false)} bold />
                    <Detail label="Discounts" value={formatCurrency(dayendDetails?.totalDiscounts,false)} />
                    <Detail label="Voided Transactions" value={formatCurrency(dayendDetails?.voidedTransactionsAmount,false)} />
                     <Detail label="Total Cost of Items Sold (COGS)" value={formatCurrency(dayendDetails?.totalCostAmount,false)} />
                    <Detail label="Net Sales" value={formatCurrency(dayendDetails?.netSales,false)} bold />
                  </div>
                </div>

                {/* Cash Flow Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold mb-5">Financial Flow Breakdown ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</h2>
               
                  <div className="space-y-1">


                      <Detail label="Opening Balance" value={formatCurrency(dayendDetails?.openingCashAmount,false)} bold />
                  
               <Detail label="Cash Sales" value={formatCurrency(dayendDetails?.netCashSales,false)} bold />
                   <Detail label="Card Sales" value={formatCurrency(dayendDetails?.netCardSales,false)} bold />
                
                 
                  <Detail label="Cash In" value={formatCurrency(dayendDetails?.cashAdditions,false)} />
                    <Detail label="Cash Out" value={formatCurrency(dayendDetails?.cashRemovals,false)} />
                    <Detail label="Expected Cash" value={formatCurrency(dayendDetails?.expectedCash,false)} bold highlight />
                    <Detail label="Actual Cash Counted" value={formatCurrency(cashDenominationTotal,false)} bold highlight />
                    <Detail 
                      label="Short / Over" 
                      value={formatCurrency(short,false)} 
                      bold 
                      highlight={short !== 0}
                    />
                  </div>
                </div>

      

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold mb-5">Transaction Summary ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</h2>
                  <div className="space-y-1">
                    <Detail label="Total Transactions" value={dayendDetails?.noOfTransactions} bold />
                    <Detail label="Voided Transactions" value={dayendDetails?.noOfVoidedTransactions} />
                    <Detail label="Customers Served" value={dayendDetails?.noOfCustomers} bold />
                    <Detail label="Items Sold" value={dayendDetails?.noOfProductsSold} />
                  </div>
                </div>



       
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold mb-5">Sales Detailed ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</h2>
                  <div className="space-y-1">
                    <Detail label="Product Sales" value={formatCurrency(dayendDetails?.productSales,false)} />
                      <Detail label="Non-Product (Services) Sales" value={formatCurrency(dayendDetails?.nonProductSales,false)} />
              
                </div>
                </div>


              </div>
            </div>

            {/* Action Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isLoading}
                className="px-10 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-sky-500/30 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-3"
              >
                {isLoading ? "Processing..." : "Confirm & End Session"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-slate-900">End Session?</h3>
            <p className="mt-3 text-slate-600">
              This action will finalize the day's transactions. Make sure all cash has been counted accurately.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-3.5 text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDayEnd}
                className="flex-1 py-3.5 text-white font-semibold bg-red-600 hover:bg-red-700 rounded-2xl transition"
              >
                Yes, End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogModel2>
  );
};

export default DayEnd;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { endSession, getSessionEnd, getSessionMismatchCheck } from "../../functions/session";
// import { formatCurrency, getCurrency } from "../../utils/format";
// import { useToast } from "../../components/useToast";
// import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
// import LoadingPopup from '../../components/LoadingPopup';
// import DialogModel2 from "../../components/model/DialogModel2";

// const Detail = ({ label, value, bold, textColor }) => (
//   <div className="flex justify-between py-2 sm:py-3 leading-6">
//     <span className={`${bold ? "font-semibold" : "font-normal"} ${textColor || "text-slate-600"} text-sm sm:text-base`}>
//       {label}
//     </span>
//     <span className={`${bold ? "font-semibold" : "font-normal"} ${textColor || "text-slate-900"} text-sm sm:text-base`}>
//       {value}
//     </span>
//   </div>
// );

// const CashDenomination = ({ label, qty, value, onChangeHandler }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-sm font-medium text-gray-700">{label} X </label>
//     <input
//       type="number"
//       value={value}
//       onChange={onChangeHandler}
//       className="w-16 sm:w-20 px-3 py-2 text-sm sm:text-base text-center bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//       min="0"
//     />
//   </div>
// );

// const DayEnd = ({isVisible,setIsVisible}) => {
//   const navigate = useNavigate();
//   const showToast = useToast();
//   const [dayendDetails, setDayendDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);
//   const [cashDenominations, setCashDenominations] = useState([
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 5000`, qty: 5000, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 1000`, qty: 1000, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 500`, qty: 500, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 100`, qty: 100, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 50`, qty: 50, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 20`, qty: 20, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 10`, qty: 10, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 5`, qty: 5, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 2`, qty: 2, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 1`, qty: 1, amount: 0, value: 0 },
//   ]);
//   const [cashDenominationTotal, setCashDenominationTotal] = useState(0);
//   const [short, setShort] = useState(0);

//   const terminalId = JSON.parse(localStorage.getItem("terminalId"));
//   const sessionDetails = JSON.parse(localStorage.getItem("sessionDetails"));
//   const sessionName =
//     sessionDetails?.sessionDetails ||
//     sessionDetails?.details ||
//     sessionDetails?.sessionName ||
//     sessionDetails?.name ||
//     "N/A";

//   useEffect(() => {
//     if(isVisible){
//     loadSessionMismatchCheck();
//     loadDayendDetails();
//     }
//   }, []);





//   const loadSessionMismatchCheck = async () => {
//     try {
//       const _result = await getSessionMismatchCheck(sessionDetails.sessionId,terminalId);
//     console.log("isSessionMismatched:", _result.data.values.isSessionMismatched);
//       const isSessionMismatched=_result.data.values.isSessionMismatched;

//  if(isSessionMismatched){
//   navigate('/home');
//  }
//     } catch (err) {
//       console.log("error:", err);
//     }
//   };


//   const loadDayendDetails = async () => {
//     try {
//             console.log("loadDayendDetails:");
//       setIsLoading(true);
//       const payload = { sessionId: sessionDetails.sessionId, terminalId };
//       const _result = await getSessionEnd(payload);
//       setDayendDetails(_result.data.records[0]);
//       setIsLoading(false);
//     } catch (err) {
//       setIsLoading(false);
//       console.log("error:", err);
//     }
//   };

//   useEffect(() => {
//     const total = cashDenominations.reduce((sum, d) => sum + d.amount, 0);
//     setCashDenominationTotal(total);
//   }, [cashDenominations]);

//   useEffect(() => {
//     const shortAmount = cashDenominationTotal - (dayendDetails?.expectedCash || 0);
//     setShort(shortAmount);
//   }, [dayendDetails, cashDenominationTotal]);

//   const onChangeHandler = (e, label) => {
//     const value = parseInt(e.target.value) || 0;
//     const cashDenominationsUpdated = cashDenominations.map((d) =>
//       d.label === label ? { ...d, value, amount: d.qty * value } : d
//     );
//     setCashDenominations(cashDenominationsUpdated);
//   };

//   const onDayEnd = async () => {
//     const payLoad = {
//       sessionId: sessionDetails.sessionId,
//       actualCash: cashDenominationTotal,
//       short: short,
//       isConfirm: false,
//     };

//     setIsLoading(true);
//     const res = await endSession(payLoad);
//     setIsLoading(false);

//     const { success, exception, error } = res.data;
//     if (error) {
//       showToast("danger", "Error", error.message);
//       return;
//     }
//     if (exception) {
//       showToast("danger", "Exception", exception.message);
//       return;
//     }
//     showToast("success", "Success", success.message);
//     navigate("/home");
//   };

//   const handleConfirm = () => {
//     setShowDialog(false);
//     onDayEnd();
//   };

//   const handleCancel = () => {
//     setShowDialog(false);
//   };

//   const confirmDayend = () => {
//     setShowDialog(true);
//   };

 

//   return (
//     <div className="bg-[#edf2fa]">
//   {isLoading ? 
//   <div className="w-1/2">
//   <LoadingPopup text="Opening Day-End Panel…" />
//   </ div>:
//     <>

//              <DialogModel2
//         title="Day End"
//         onHide={() => setIsVisible(false)}
//       >

// <div className="p-5 overflow-y-auto">


//       {showDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
//             <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Confirm Session End</h3>
//             <p className="text-sm sm:text-base text-gray-600 mb-6">
//               Are you sure you want to end the session? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 className="px-4 py-2 text-sm sm:text-base font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200"
//                 onClick={handleConfirm}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Title */}
//       <div className="text-center mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Day End Summary</h1>
//         <p className="text-sm sm:text-base text-gray-600 mt-2">
//           Session Name: <span className="font-semibold text-gray-900">{sessionName}</span>
//         </p>
//       </div>


//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//         {[
//           { title: "Total Sales", value: formatCurrency(dayendDetails?.totalSales), color: "text-sky-600" },
//           { title: "Transactions", value: dayendDetails?.noOfTransactions || 0, color: "text-gray-600" },
//           { title: "Expected Cash", value: formatCurrency(dayendDetails?.expectedCash), color: "text-sky-600" },
//           { title: "Actual Cash", value: formatCurrency(cashDenominationTotal), color: "text-sky-600" },
//           {
//             title: "Short/Over",
//             value: formatCurrency(short),
//             color: short < 0 ? "text-red-600" : "text-sky-600",
//           },
//         ].map((item, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-xl border-gray-300 border-2 p-4 sm:p-5 transform transition-all duration-200 hover:shadow-lg"
//           >
//             <h2 className="text-sm sm:text-base font-semibold text-gray-700">{item.title}</h2>
//             <p className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</p>
//           </div>
//         ))}
//       </div>


//           <div className="bg-white rounded-xl border-gray-300 border-2  p-5 sm:p-6 mb-5">
//             <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-3">Cash Handling</h2>
//             <p className="text-sm sm:text-base text-slate-600 leading-6 mb-4">
//               Enter the number of each cash denomination to calculate the actual cash total.
//             </p>

// <div className="grid grid-cols-2 gap-10">
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-10">
//               {cashDenominations.map((c) => (
//                 <CashDenomination
//                   key={c.label}
//                   label={c.label}
//                   qty={c.qty}
//                   value={c.value}
//                   onChangeHandler={(e) => onChangeHandler(e, c.label)}
//                 />
//               ))}
//             </div>

//             <div className="space-y-2">
//               <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
//               <Detail label="Opening Amount" value={formatCurrency(dayendDetails?.openingCashAmount)} bold />
//               <Detail label="Cash Additions / Drops" value={formatCurrency(dayendDetails?.cashAdditions)} bold />
//               <Detail label="Cash Removals / Pickups" value={formatCurrency(dayendDetails?.cashRemovals)} bold />
//               <Detail label="Expected Cash" value={formatCurrency(dayendDetails?.expectedCash)} bold />
//               <Detail label="Actual Cash" value={formatCurrency(cashDenominationTotal)} bold />
//               <Detail
//                 label="Short/Over"
//                 value={formatCurrency(short)}
//                 bold
//                 textColor={short < 0 ? "text-red-600" : "text-gray-600"}
//               />
//             </div>
// </div>

//           </div>



//         {/* Transaction and Sales Summary */}
//         <div className="grid grid-cols-2 gap-10">

//           <div className="bg-white rounded-xl border-gray-300 border-2  p-5 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-3">Sales Summary</h2>
//             <div className="space-y-2">
//               <Detail label="Product Sales" value={formatCurrency(dayendDetails?.productSales)} />
//               <Detail label="Total Sales" value={formatCurrency(dayendDetails?.totalSales)} bold />
//               <Detail label="Discounts" value={formatCurrency(dayendDetails?.totalDiscounts)} />
//               <Detail label="Returns" value={formatCurrency(dayendDetails?.totalReturns)} />
//               <Detail label="Refunds" value={formatCurrency(dayendDetails?.totalRefunds)} />
//               <Detail label="Total Tax" value={formatCurrency(dayendDetails?.totalTax)} />
//               <Detail label="Net Sales" value={formatCurrency(dayendDetails?.netSales)} bold />
//               <Detail label="ATV Net" value={formatCurrency(dayendDetails?.averageTransactionValueNet)} bold />
//               <Detail label="ATV Gross" value={formatCurrency(dayendDetails?.averageTransactionValueGross)} bold />
//             </div>
//           </div>



// <div className="flex flex-col gap-5">


//   <div className="bg-white rounded-xl border-gray-300 border-2  p-5 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-3">Transaction Summary</h2>
//             <div className="space-y-2">
//               <Detail label="Transactions" value={dayendDetails?.noOfTransactions} bold />
//               <Detail label="Voided Transactions" value={dayendDetails?.noOfVoidedTransactions} bold />
//               <Detail label="Number of Customers" value={dayendDetails?.noOfCustomers} bold />
//               <Detail label="Products Sold" value={dayendDetails?.noOfProductsSold} />
//               <Detail label="Products Returned" value={dayendDetails?.noOfProductsReturned} />
//             </div>
//           </div>

  
//             <div className="bg-white rounded-xl border-gray-300 border-2 p-5 sm:p-6 mt-6">
//             <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-3">Payment Summary</h2>
//             <div className="space-y-2">
//               <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
//               <Detail label="Net Card Sales" value={formatCurrency(dayendDetails?.netCardSales)} bold />
//             </div>
//           </div>

// </div>

        
//         </div>

   


//       {/* Finish Day Button */}
//       <div className="text-center mt-8">
//         <button
//           className={`w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           onClick={confirmDayend}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <span className="flex items-center justify-center">
//               <svg
//                 className="animate-spin h-5 w-5 mr-2 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
//                 ></path>
//               </svg>
//               Processing...
//             </span>
//           ) : (
//             "Confirm Day End"
//           )}
//         </button>
//       </div>
// </div>
// </DialogModel2>
//     </>
// }
//     </div>
//   );
// };

// export default DayEnd;