import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endSession, getSessionEnd } from "../../functions/session";
import { formatCurrency, getCurrency } from "../../utils/format";
import { useToast } from "../../components/useToast";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";

const Detail = ({ label, value, bold }) => (
  <div className="flex justify-between py-2 sm:py-3">
    <span className={`${bold ? "font-semibold" : "font-normal"} text-sm sm:text-base text-gray-700`}>
      {label}
    </span>
    <span className={`${bold ? "font-semibold" : "font-normal"} text-sm sm:text-base text-gray-900`}>
      {value}
    </span>
  </div>
);

const CashDenomination = ({ label, qty, value, onChangeHandler }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs sm:text-sm font-medium text-gray-600">{label} (pieces)</label>
    <input
      type="number"
      value={value}
      onChange={onChangeHandler}
      className="w-16 sm:w-20 px-3 py-2 text-sm sm:text-base text-center bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
      min="0"
    />
  </div>
);

const DayEnd = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [dayendDetails, setDayendDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [cashDenominations, setCashDenominations] = useState([
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 5000`, qty: 5000, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 1000`, qty: 1000, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 500`, qty: 500, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 100`, qty: 100, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 50`, qty: 50, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 20`, qty: 20, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 10`, qty: 10, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 5`, qty: 5, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 2`, qty: 2, amount: 0, value: 0 },
    { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 1`, qty: 1, amount: 0, value: 0 },
  ]);
  const [cashDenominationTotal, setCashDenominationTotal] = useState(0);
  const [short, setShort] = useState(0);

  const terminalId = JSON.parse(localStorage.getItem("terminalId"));
  const sessionDetails = JSON.parse(localStorage.getItem("sessionDetails"));

  useEffect(() => {
    loadDayendDetails();
  }, []);

  const loadDayendDetails = async () => {
    try {
      setIsLoading(true);
      const payload = { sessionId: sessionDetails.sessionId, terminalId };
      const _result = await getSessionEnd(payload);
      setDayendDetails(_result.data.records[0]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("error:", err);
    }
  };

  useEffect(() => {
    const total = cashDenominations.reduce((sum, d) => sum + d.amount, 0);
    setCashDenominationTotal(total);
  }, [cashDenominations]);

  useEffect(() => {
    const shortAmount = cashDenominationTotal - (dayendDetails?.expectedCash || 0);
    setShort(shortAmount);
  }, [dayendDetails, cashDenominationTotal]);

  const onChangeHandler = (e, label) => {
    const value = parseInt(e.target.value) || 0;
    const cashDenominationsUpdated = cashDenominations.map((d) =>
      d.label === label ? { ...d, value, amount: d.qty * value } : d
    );
    setCashDenominations(cashDenominationsUpdated);
  };

  const onDayEnd = async () => {
    const payLoad = {
      sessionId: sessionDetails.sessionId,
      actualCash: cashDenominationTotal,
      short: short,
      isConfirm: false,
    };

    setIsLoading(true);
    const res = await endSession(payLoad);
    setIsLoading(false);

    const { success, exception, error } = res.data;
    if (error) {
      showToast("danger", "Error", error.message);
      return;
    }
    if (exception) {
      showToast("danger", "Exception", exception.message);
      return;
    }
    showToast("success", "Success", success.message);
    navigate("/home");
  };

  const handleConfirm = () => {
    setShowDialog(false);
    onDayEnd();
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const confirmDayend = () => {
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50 to-sky-50 p-4 sm:p-6 lg:p-8">
      {/* Confirmation Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Confirm Session End</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to end the session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm sm:text-base font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm sm:text-base font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Day End Summary</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Review today's transactions and finalize cash counts to close the session.
        </p>
      </div>

      {/* Quick Glance Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { title: "Total Sales", value: formatCurrency(dayendDetails?.totalSales), color: "text-sky-600" },
          { title: "Transactions", value: dayendDetails?.noOfTransactions || 0, color: "text-gray-600" },
          { title: "Expected Cash", value: formatCurrency(dayendDetails?.expectedCash), color: "text-sky-600" },
          { title: "Actual Cash", value: formatCurrency(cashDenominationTotal), color: "text-sky-600" },
          {
            title: "Short/Over",
            value: formatCurrency(short),
            color: short > 0 ? "text-sky-600" : short < 0 ? "text-red-600" : "text-gray-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-sky-600 border-spacing-2 p-4 sm:p-5 transform transition-all duration-200 hover:shadow-lg"
          >
            <h2 className="text-sm sm:text-base font-semibold text-gray-700">{item.title}</h2>
            <p className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Transaction and Sales Summary */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl border border-sky-600 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Transaction Summary</h2>
            <div className="space-y-2">
              <Detail label="Transactions" value={dayendDetails?.noOfTransactions} bold />
              <Detail label="Voided Transactions" value={dayendDetails?.noOfVoidedTransactions} bold />
              <Detail label="Number of Customers" value={dayendDetails?.noOfCustomers} bold />
              <Detail label="Products Sold" value={dayendDetails?.noOfProductsSold} />
              <Detail label="Products Returned" value={dayendDetails?.noOfProductsReturned} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-sky-600 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Sales Summary</h2>
            <div className="space-y-2">
              <Detail label="Product Sales" value={formatCurrency(dayendDetails?.productSales)} />
              <Detail label="Total Sales" value={formatCurrency(dayendDetails?.totalSales)} bold />
              <Detail label="Discounts" value={formatCurrency(dayendDetails?.totalDiscounts)} />
              <Detail label="Returns" value={formatCurrency(dayendDetails?.totalReturns)} />
              <Detail label="Refunds" value={formatCurrency(dayendDetails?.totalRefunds)} />
              <Detail label="Total Tax" value={formatCurrency(dayendDetails?.totalTax)} />
              <Detail label="Net Sales" value={formatCurrency(dayendDetails?.netSales)} bold />
              <Detail label="ATV Net" value={formatCurrency(dayendDetails?.averageTransactionValueNet)} bold />
              <Detail label="ATV Gross" value={formatCurrency(dayendDetails?.averageTransactionValueGross)} bold />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-sky-600 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
              <Detail label="Net Card Sales" value={formatCurrency(dayendDetails?.netCardSales)} bold />
            </div>
          </div>
        </div>

        {/* Cash Handling */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-sky-600 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Cash Handling</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Enter the number of each cash denomination to calculate the actual cash total.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {cashDenominations.map((c) => (
                <CashDenomination
                  key={c.label}
                  label={c.label}
                  qty={c.qty}
                  value={c.value}
                  onChangeHandler={(e) => onChangeHandler(e, c.label)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
              <Detail label="Opening Amount" value={formatCurrency(dayendDetails?.openingcashAmount)} bold />
              <Detail label="Cash Additions / Drops" value={formatCurrency(dayendDetails?.cashAdditions)} bold />
              <Detail label="Cash Removals / Pickups" value={formatCurrency(dayendDetails?.cashRemovals)} bold />
              <Detail label="Expected Cash" value={formatCurrency(dayendDetails?.expectedCash)} bold />
              <Detail label="Actual Cash" value={formatCurrency(cashDenominationTotal)} bold />
              <Detail
                label="Short/Over"
                value={formatCurrency(short)}
                bold
                className={short > 0 ? "text-sky-600" : short < 0 ? "text-red-600" : "text-gray-600"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Finish Day Button */}
      <div className="text-center mt-8">
        <button
          className={`w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={confirmDayend}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Confirm Day End"
          )}
        </button>
      </div>
    </div>
  );
};

export default DayEnd;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './dayend.css'; // Assuming custom styles if needed
// import { endSession, getSessionEnd } from "../../functions/session";
// import { formatCurrency, getCurrency } from "../../utils/format";
// import { useToast } from "../../components/useToast";
// import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";

// const Detail = ({ label, value, bold }) => (
//   <div className="flex justify-between py-1 sm:py-2">
//     <span className={bold ? "font-bold text-sm sm:text-base" : "font-normal text-sm sm:text-base"}>{label}</span>
//     <span className={bold ? "font-bold text-sm sm:text-base" : "text-sm sm:text-base"}>{value}</span>
//   </div>
// );

// const CashDenomination = ({ label, qty, value, onChangeHandler }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-xs sm:text-sm text-gray-600">{label} (pieces)</label>
//     <input
//       type="number"
//       value={value}
//       onChange={onChangeHandler}
//       className="input input-bordered w-16 sm:w-20 text-center text-sm sm:text-base"
//       min="0"
//     />
//   </div>
// );

// const DayEnd = () => {
//   const navigate = useNavigate();
//   const showToast = useToast();
//   const [dayendDetails, setDayendDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);

//   const terminalId = JSON.parse(localStorage.getItem("terminalId"));
//   const sessionDetails = JSON.parse(localStorage.getItem("sessionDetails"));

//   useEffect(() => {
//     loadDayendDetails();
//   }, []);

//   const loadDayendDetails = async () => {
//     try {
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

//   const [cashDenominations, setCashDenominations] = useState([
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 5000`, qty: 5000, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 1000`, qty: 1000, amount: 0, value: 0 },
//     { label: `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)} 500`,qty: 500, amount: 0, value: 0 },
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
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//       {/* Confirmation Modal */}
//       {showDialog && (
//         <div className="modal modal-open">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg sm:text-xl">Confirm Session End</h3>
//             <p className="py-4 text-sm sm:text-base">Are you sure you want to proceed?</p>
//             <div className="modal-action">
//               <button className="btn btn-primary btn-sm sm:btn-md" onClick={handleConfirm}>
//                 Confirm
//               </button>
//               <button className="btn btn-sm sm:btn-md" onClick={handleCancel}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Title */}
//       <div className="text-center mb-4 sm:mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Day Ending</h1>
//         <p className="text-gray-600 text-sm sm:text-base">
//           Review the day's transactions and enter cash counts to complete the process.
//         </p>
//       </div>

//       {/* Quick Glance Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
//         <div className="card bg-white shadow-md p-3 sm:p-4">
//           <h2 className="text-sm sm:text-lg font-semibold text-gray-700">Total Sales</h2>
//           <p className="text-lg sm:text-2xl font-bold text-sky-600">
//             {formatCurrency(dayendDetails?.totalSales)}
//           </p>
//         </div>
//         <div className="card bg-white shadow-md p-3 sm:p-4">
//           <h2 className="text-sm sm:text-lg font-semibold text-gray-700">Transactions</h2>
//           <p className="text-lg sm:text-2xl font-bold text-gray-600">
//             {dayendDetails?.noOfTransactions || 0}
//           </p>
//         </div>
//         <div className="card bg-white shadow-md p-3 sm:p-4">
//           <h2 className="text-sm sm:text-lg font-semibold text-gray-700">Expected Cash</h2>
//           <p className="text-lg sm:text-2xl font-bold text-sky-600">
//             {formatCurrency(dayendDetails?.expectedCash)}
//           </p>
//         </div>
//         <div className="card bg-white shadow-md p-3 sm:p-4">
//           <h2 className="text-sm sm:text-lg font-semibold text-gray-700">Actual Cash</h2>
//           <p className="text-lg sm:text-2xl font-bold text-sky-600">
//             {formatCurrency(cashDenominationTotal)}
//           </p>
//         </div>
//         <div className="card bg-white shadow-md p-3 sm:p-4">
//           <h2 className="text-sm sm:text-lg font-semibold text-gray-700">Short/Over</h2>
//           <p
//             className={`text-lg sm:text-2xl font-bold ${
//               short > 0 ? "text-sky-600" : short < 0 ? "text-red-600" : "text-gray-600"
//             }`}
//           >
//             {formatCurrency(short)}
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
//         {/* Transaction Summary */}
//         <div className="flex-1 space-y-4 sm:space-y-6">
//           <div className="card bg-white shadow-md p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Transaction Summary</h2>
//             <Detail label="Transactions" value={dayendDetails?.noOfTransactions} bold />
//             <Detail label="Voided Transactions" value={dayendDetails?.noOfVoidedTransactions} bold />
//             <Detail label="Number of Customers" value={dayendDetails?.noOfCustomers} bold />
//             <Detail label="Products Sold" value={dayendDetails?.noOfProductsSold} />
//             <Detail label="Products Returned" value={dayendDetails?.noOfProductsReturned} />
//           </div>

//           <div className="card bg-white shadow-md p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Sales Summary</h2>
//             <Detail label="Product Sales" value={formatCurrency(dayendDetails?.productSales)} />
//             <Detail label="Total Sales" value={formatCurrency(dayendDetails?.totalSales)} bold />
//             <Detail label="Discounts" value={formatCurrency(dayendDetails?.totalDiscounts)} />
//             <Detail label="Returns" value={formatCurrency(dayendDetails?.totalReturns)} />
//             <Detail label="Refunds" value={formatCurrency(dayendDetails?.totalRefunds)} />
//             <Detail label="Total Tax" value={formatCurrency(dayendDetails?.totalTax)} />
//             <Detail label="Net Sales" value={formatCurrency(dayendDetails?.netSales)} bold />
//             <Detail label="ATV Net" value={formatCurrency(dayendDetails?.averageTransactionValueNet)} bold />
//             <Detail label="ATV Gross" value={formatCurrency(dayendDetails?.averageTransactionValueGross)} bold />
//           </div>

//           <div className="card bg-white shadow-md p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment Summary</h2>
//             <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
//             <Detail label="Net Card Sales" value={formatCurrency(dayendDetails?.netCardSales)} bold />
//           </div>
//         </div>

//         {/* Cash Handling */}
//         <div className="flex-1">
//           <div className="card bg-white shadow-md p-4 sm:p-6">
//             <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Cash Handling</h2>
//             <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
//               Enter the number of each cash denomination.
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
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
//             <div className="space-y-1 sm:space-y-2">
//               <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
//               <Detail label="Opening Amount" value={formatCurrency(dayendDetails?.openingcashAmount)} bold />
//               <Detail label="Cash Additions / Drops" value={formatCurrency(dayendDetails?.cashAdditions)} bold />
//               <Detail label="Cash Removals / Pickups" value={formatCurrency(dayendDetails?.cashRemovals)} bold />
//               <Detail label="Expected Cash" value={formatCurrency(dayendDetails?.expectedCash)} bold />
//               <Detail label="Actual Cash" value={formatCurrency(cashDenominationTotal)} bold />
//               <Detail label="Short/Over" value={formatCurrency(short)} bold />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Finish Day Button */}
//       <div className="text-center mt-6 sm:mt-8">
//         <button
//           className="btn btn-primary btn-lg w-full sm:w-auto"
//           onClick={confirmDayend}
//           disabled={isLoading}
//         >
//           {isLoading ? "Processing..." : "Confirm Day End"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DayEnd;