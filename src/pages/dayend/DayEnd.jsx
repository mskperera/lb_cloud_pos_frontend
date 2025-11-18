import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endSession, getSessionEnd, getSessionMismatchCheck } from "../../functions/session";
import { formatCurrency, getCurrency } from "../../utils/format";
import { useToast } from "../../components/useToast";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
import DialogModel from "../../components/model/DialogModel";
import LoadingPopup from '../../components/LoadingPopup';

const Detail = ({ label, value, bold,textColor }) => (
  <div className="flex justify-between py-2 sm:py-3">
    <span className={`${bold ? "font-semibold" : "font-normal"} ${textColor} text-sm sm:text-base text-gray-700`}>
      {label}
    </span>
    <span className={`${bold ? "font-semibold" : "font-normal"} ${textColor}  text-sm sm:text-base text-gray-900`}>
      {value}
    </span>
  </div>
);

const CashDenomination = ({ label, qty, value, onChangeHandler }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label} X </label>
    <input
      type="number"
      value={value}
      onChange={onChangeHandler}
      className="w-16 sm:w-20 px-3 py-2 text-sm sm:text-base text-center bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
      min="0"
    />
  </div>
);

const DayEnd = ({isVisible,setIsVisible}) => {
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
    if(isVisible){
    loadSessionMismatchCheck();
    loadDayendDetails();
    }
  }, []);





  const loadSessionMismatchCheck = async () => {
    try {
      const _result = await getSessionMismatchCheck(sessionDetails.sessionId,terminalId);
    console.log("isSessionMismatched:", _result.data.values.isSessionMismatched);
      const isSessionMismatched=_result.data.values.isSessionMismatched;

 if(isSessionMismatched){
  navigate('/home');
 }
    } catch (err) {
      console.log("error:", err);
    }
  };


  const loadDayendDetails = async () => {
    try {
            console.log("loadDayendDetails:");
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
    <div className="bg-[#edf2fa] p-4 sm:p-6 lg:p-8">
  {isLoading ? 
  <div className="w-1/2">
  <LoadingPopup text="Opening Day-End Panel…" />
  </ div>:
    <>

             <DialogModel
        header="Day End"
        visible={true}
        onHide={() => setIsVisible(false)}
      >
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
        {/* <p className="text-sm sm:text-base text-gray-600 mt-2">
          Review today's transactions and finalize cash counts to close the session.
        </p> */}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { title: "Total Sales", value: formatCurrency(dayendDetails?.totalSales), color: "text-sky-600" },
          { title: "Transactions", value: dayendDetails?.noOfTransactions || 0, color: "text-gray-600" },
          { title: "Expected Cash", value: formatCurrency(dayendDetails?.expectedCash), color: "text-sky-600" },
          { title: "Actual Cash", value: formatCurrency(cashDenominationTotal), color: "text-sky-600" },
          {
            title: "Short/Over",
            value: formatCurrency(short),
            color: short < 0 ? "text-red-600" : "text-sky-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border-gray-300 border-2 p-4 sm:p-5 transform transition-all duration-200 hover:shadow-lg"
          >
            <h2 className="text-sm sm:text-base font-semibold text-gray-700">{item.title}</h2>
            <p className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>


          <div className="bg-white rounded-xl border-gray-300 border-2  p-5 sm:p-6 mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Cash Handling</h2>
            <p className=" text-sky-700 mb-4">
              Enter the number of each cash denomination to calculate the actual cash total.
            </p>

<div className="grid grid-cols-2 gap-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-10">
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
              <Detail label="Opening Amount" value={formatCurrency(dayendDetails?.openingCashAmount)} bold />
              <Detail label="Cash Additions / Drops" value={formatCurrency(dayendDetails?.cashAdditions)} bold />
              <Detail label="Cash Removals / Pickups" value={formatCurrency(dayendDetails?.cashRemovals)} bold />
              <Detail label="Expected Cash" value={formatCurrency(dayendDetails?.expectedCash)} bold />
              <Detail label="Actual Cash" value={formatCurrency(cashDenominationTotal)} bold />
              <Detail
                label="Short/Over"
                value={formatCurrency(short)}
                bold
                textColor={short < 0 ? "text-red-600" : "text-gray-600"}
              />
            </div>
</div>

          </div>



        {/* Transaction and Sales Summary */}
        <div className="grid grid-cols-2 gap-10">

          <div className="bg-white rounded-xl border-gray-300 border-2  p-5 sm:p-6">
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



<div className="flex flex-col gap-5">


  <div className="bg-white rounded-xl border-gray-300 border-2  p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Transaction Summary</h2>
            <div className="space-y-2">
              <Detail label="Transactions" value={dayendDetails?.noOfTransactions} bold />
              <Detail label="Voided Transactions" value={dayendDetails?.noOfVoidedTransactions} bold />
              <Detail label="Number of Customers" value={dayendDetails?.noOfCustomers} bold />
              <Detail label="Products Sold" value={dayendDetails?.noOfProductsSold} />
              <Detail label="Products Returned" value={dayendDetails?.noOfProductsReturned} />
            </div>
          </div>

  
            <div className="bg-white rounded-xl border-gray-300 border-2 p-5 sm:p-6 mt-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <Detail label="Net Cash Sales" value={formatCurrency(dayendDetails?.netCashSales)} bold />
              <Detail label="Net Card Sales" value={formatCurrency(dayendDetails?.netCardSales)} bold />
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

</DialogModel>
    </>
}
    </div>
  );
};

export default DayEnd;