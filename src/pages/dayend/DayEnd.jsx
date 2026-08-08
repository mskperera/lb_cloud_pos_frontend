import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  endSession,
  getSessionEnd,
  getSessionMismatchCheck,
} from "../../functions/session";
import { formatCurrency, getCurrency } from "../../utils/format";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
import LoadingPopup from "../../components/LoadingPopup";
import DialogModel2 from "../../components/model/DialogModel2";
import MessagePopup from "../../components/MessagePopup";
import { Coins, Store, Calendar, Monitor, Receipt, Scale, CreditCard, CalendarCheck, Calendar1, CalendarCheckIcon, ReceiptText } from "lucide-react";
import ZReportIndex from "../z-report";

const Detail = ({ label, value, bold = false, statusType = "default" }) => {
  const getStatusColor = () => {
    switch (statusType) {
      case "success": return "text-emerald-600 font-semibold";
      case "danger": return "text-rose-600 font-semibold";
      case "warning": return "text-amber-600 font-semibold";
      case "info": return "text-sky-600 font-semibold";
      default: return bold ? "text-slate-900 font-semibold" : "text-slate-700";
    }
  };

  return (
    <div className="flex justify-between py-2.5 border-b border-slate-100 last:border-b-0 items-center">
      <span className={`text-slate-600 text-sm ${bold ? "font-medium text-slate-800" : ""}`}>
        {label}
      </span>
      <span className={`text-right text-sm font-mono ${getStatusColor()}`}>
        {value}
      </span>
    </div>
  );
};

const CashDenominationRow = ({ denom, value, onChange }) => (
  <div className="flex bg-slate-50 items-center justify-between gap-3 py-2 px-3 hover:bg-slate-50 rounded-xl border border-slate-100">
    <div className="w-16 font-semibold text-slate-700 text-sm">
      {denom.label}
    </div>
    <div className="w-20">
      <input
        type="number"
        value={value || ""}
        placeholder="0"
        onChange={onChange}
        min="0"
        className="w-full px-2 py-1.5 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all font-medium"
      />
    </div>
    <div className="w-24 text-right font-medium text-slate-800 text-sm font-mono">
      {formatCurrency(denom.qty * value, false)}
    </div>
  </div>
);

const DayEnd = ({ isVisible, setIsVisible }) => {
  const navigate = useNavigate();

  const [dayendDetails, setDayendDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isZReportVisible, setIsZReportVisible] = useState(false);
  const [messagePopup, setMessagePopup] = useState({ isOpen: false, type: "info", title: "", message: "" });

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

  // NEW STATES: Card Verification, Slip/Batch details and Notes
  const [actualCardSales, setActualCardSales] = useState("");
  const [terminalSlipNo, setTerminalSlipNo] = useState("");
  const [managerNotes, setManagerNotes] = useState("");

  const [isSessionEnded, setIsSessionEnded] = useState(false);

  const cashDenominationTotal = cashDenominations.reduce(
    (sum, d) => sum + d.qty * d.value,
    0,
  );
  const short = cashDenominationTotal - (dayendDetails?.expectedCash || 0);

  // NEW CALCULATIONS: Card Discrepancy Calculation
  const parsedActualCardSales = parseFloat(actualCardSales) || 0;
  const expectedCardSales = parseFloat(dayendDetails?.netCardSales) || 0;
  const cardShortOver = parsedActualCardSales - expectedCardSales;

  // Safe JSON localStorage parsing wrapper
  const safeParseItem = (key, fallback = null) => {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined") return fallback;
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return fallback;
    }
  };

  const terminal = safeParseItem("terminal");
  const sessionDetails = safeParseItem("sessionDetails");
  const selectedStore = safeParseItem("selectedStore", {});

  const sessionName = sessionDetails?.sessionName;
  const terminalName = terminal?.terminalName;
  const storeName = selectedStore?.storeName || "N/A";

  const loadSessionMismatchCheck = useCallback(async () => {
    try {
      if (!sessionDetails?.sessionId || !terminal?.terminalId) return;
      const result = await getSessionMismatchCheck(
        sessionDetails.sessionId,
        terminal?.terminalId,
      );
      if (result.data.values.isSessionMismatched) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Mismatch check error:", err);
    }
  }, [navigate, sessionDetails?.sessionId, terminal?.terminalId]);

  const loadDayendDetails = useCallback(async () => {
    try {
      if (!sessionDetails?.sessionId || !terminal?.terminalId) return;
      setIsLoading(true);
      const payload = {
        sessionId: sessionDetails.sessionId,
        terminalId: terminal?.terminalId,
      };
      const result = await getSessionEnd(payload);
      setDayendDetails(result.data.records[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionDetails?.sessionId, terminal?.terminalId]);

  useEffect(() => {
    if (isVisible) {
      loadSessionMismatchCheck();
      loadDayendDetails();
    }
  }, [isVisible, loadDayendDetails, loadSessionMismatchCheck]);

  const onDenominationChange = (index, newValue) => {
    const updated = [...cashDenominations];
    updated[index].value = parseInt(newValue) || 0;
    setCashDenominations(updated);
  };

  const handleDayEnd = async () => {
    if (!sessionDetails?.sessionId) return;
    const payload = {
      sessionId: sessionDetails.sessionId,
      actualCash: cashDenominationTotal,
      short: short,
      actualCardTotal: parsedActualCardSales,          // MODIFIED: Payload එකට එක් කළ නව දත්ත
      cardShortOver: cardShortOver,                // MODIFIED: Payload එකට එක් කළ නව දත්ත
      terminalSlipNo: terminalSlipNo,              // MODIFIED: Payload එකට එක් කළ නව දත්ත
      managerNotes: managerNotes,                  // MODIFIED: Payload එකට එක් කළ නව දත්ත
      isConfirm: true,
    };

    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const res = await endSession(payload);

      if(res.data?.error){
        setMessagePopup({
          isOpen: true,
          type: "danger",
          title: "Unexpected Error",
          message: res.data.error,
        });
        return;
      }
      const { outputValues } = res.data;

      if (outputValues?.responseStatus === "failed") {
        setMessagePopup({
          isOpen: true,
          type: "danger",
          title: "Closing Failed",
          message: outputValues.outputMessage,
        });
        return;
      }

      setIsSessionEnded(true);
      
    } catch (err) {
      console.error(err);
      setMessagePopup({
        isOpen: true,
        type: "danger",
        title: "Unexpected Error",
        message: "Something went wrong during closing. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

return (
  <DialogModel2 title="Day End Closing" onHide={() => setIsVisible(false)}>
    {/* Container with relative positioning and flexbox to distribute content */}
    <div className="relative flex flex-col max-h-[85vh] w-full max-w-7xl mx-auto">
      {/* Scrollable Content Area */}
      <div className="flex-1 p-5 overflow-y-auto pb-44">
        {isLoading && !dayendDetails ? (
          <LoadingPopup text="Loading Day-End Summary..." />
        ) : (
          <>
            {/* Metadata Header Summary Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-sky-600" />
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Day End Process Summary
                </h1>
              </div>
              <div className="flex flex-wrap gap-6 items-center text-sm">
                <p className="flex items-center gap-2 text-slate-600">
                  <Store className="h-4 w-4 text-slate-400" />
                  Store:{" "}
                  <span className="font-semibold text-slate-800">
                    {storeName}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <CalendarCheckIcon className="h-4 w-4 text-slate-400" />
                  Session:{" "}
                  <span className="font-semibold text-slate-800">
                    {sessionName}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Monitor className="h-4 w-4 text-slate-400" />
                  Terminal:{" "}
                  <span className="font-semibold text-slate-800">
                    {terminalName}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* ROW 3: Operations & Quantities Box */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Sales Totals Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      Sales Summary
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <Detail
                      label="Product Sales"
                      value={formatCurrency(dayendDetails?.productSales, false)}
                    />
                    <Detail
                      label="Service / Non-Product Sales"
                      value={formatCurrency(
                        dayendDetails?.nonProductSales,
                        false,
                      )}
                    />
                    <Detail
                      label="Gross Sales"
                      value={formatCurrency(dayendDetails?.totalSales, false)}
                      bold
                    />
                    <Detail
                      label="(-) Active Discounts Given"
                      value={formatCurrency(
                        dayendDetails?.totalDiscounts,
                        false,
                      )}
                    />
                    <div className="border-t border-slate-100 my-2" />
                    <Detail
                      label="Net Sales"
                      value={formatCurrency(dayendDetails?.netSales, false)}
                      bold
                    />
                    <div className="border-t border-slate-100 my-2" />
                    <Detail
                      label="Voided Invoices Value"
                      value={formatCurrency(
                        dayendDetails?.voidedTransactionsAmount,
                        false,
                      )}
                      statusType="warning"
                    />
                    <Detail
                      label="Total Cost of Goods Sold (COGS)"
                      value={formatCurrency(
                        dayendDetails?.totalCostAmount,
                        false,
                      )}
                    />
                  </div>
                </div>

                {/* Operations & Quantities Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h2 className="text-lg font-semibold mb-4 text-slate-900">
                    Operations & Quantities
                  </h2>
                  <div className="space-y-0.5">
                    <Detail
                      label="Successful Transactions"
                      value={
                        (dayendDetails?.noOfTransactions || 0) -
                        (dayendDetails?.noOfVoidedTransactions || 0)
                      }
                      bold
                    />
                    <Detail
                      label="Registered Customer Sales"
                      value={dayendDetails?.noOfCustomers}
                      bold
                    />
                    <Detail
                      label="Physical Items Moved"
                      value={dayendDetails?.noOfProductsSold}
                    />
                    <div className="border-t border-dashed border-slate-200 my-2" />
                    <Detail
                      label="Voided Transactions"
                      value={dayendDetails?.noOfVoidedTransactions}
                      statusType="warning"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 1: Cash Counter & Flow Breakdown */}
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      {/* <Coins className="h-5 w-5 text-sky-600" /> */}
                      Cash Payment Verification
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    Enter the quantity of notes and coins counted in your
                    drawer.
                  </p>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div className="hidden sm:flex justify-between text-xs font-semibold text-slate-400 px-3 tracking-wider mb-1">
                      <span>Denom</span> <span className="mr-6">Qty</span>{" "}
                      <span>Amount</span>
                    </div>
                    <div className="hidden sm:flex justify-between text-xs font-semibold text-slate-400 px-3 tracking-wider mb-1">
                      <span>Denom</span> <span className="mr-6">Qty</span>{" "}
                      <span>Amount</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {cashDenominations.map((denom, index) => (
                      <CashDenominationRow
                        key={denom.label}
                        denom={denom}
                        value={denom.value}
                        onChange={(e) =>
                          onDenominationChange(index, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Cash Flow Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      Cash Flow Breakdown
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <Detail
                      label="(+) Opening Drawer Cash"
                      value={formatCurrency(
                        dayendDetails?.openingCashAmount,
                        false,
                      )}
                    />
                    <Detail
                      label="(+) Cash Sales"
                      value={formatCurrency(dayendDetails?.netCashSales, false)}
                    />
                    <Detail
                      label="(+) Paid In"
                      value={formatCurrency(dayendDetails?.paidIn, false)}
                    />
                    <Detail
                      label="(-) Paid Out"
                      value={formatCurrency(dayendDetails?.paidOut, false)}
                    />

                    <Detail
                      label="Expected Drawer Cash"
                      value={formatCurrency(dayendDetails?.expectedCash, false)}
                      bold
                    />
                    <div className="border-t border-slate-100 my-2" />
                    <Detail
                      label="Actual Drawer Cash Counted"
                      value={formatCurrency(cashDenominationTotal, false)}
                      bold
                      statusType="info"
                    />
                    <Detail
                      label="Cash Short / Over"
                      value={
                        short > 0
                          ? "+" + formatCurrency(short, false)
                          : formatCurrency(short, false)
                      }
                      statusType={(() => {
                        const absDifference = Math.abs(short);
                        const isSmallVariance =
                          absDifference >= 0.01 && absDifference <= 1.0;
                        if (short === 0) {
                          return "success";
                        } else {
                          if (isSmallVariance) {
                            return "warning";
                          } else {
                            return "danger";
                          }
                        }
                      })()}
                      bold
                    />
                  </div>
                </div>
              </div>

              {/* ROW 2: Card Verification Section */}
              <div className="grid lg:grid-cols-1 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        {/* <CreditCard className="h-5 w-5 text-sky-600" />  */}
                        Card Payment Verification
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                  Enter the final grand total printed from your physical card terminal slip.
                    </p>
                    <div className="px-5">
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="grid grid-cols-2 items-center">
                          <label className="block text-sm text-slate-600 mb-1.5 tracking-wide">
                            Actual Card Total
                          </label>
                          <input
                            type="number"
                            value={actualCardSales}
                            placeholder="0.00"
                            onChange={(e) => setActualCardSales(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm font-semibold text-slate-800 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 items-center">
                          <label className="block text-sm text-slate-600 mb-1.5 tracking-wide">
                            Terminal Slip No
                          </label>
                          <input
                            type="text"
                            value={terminalSlipNo}
                            placeholder="Slip/Batch ID"
                            onChange={(e) => setTerminalSlipNo(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm font-semibold text-slate-800 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-slate-500 text-right">
                      ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
                    </span>
                    <div className="space-y-0.5 p-3">
                        <Detail
                      label="(+) Card Sales"
                      value={formatCurrency(dayendDetails?.netCardSales, false)}
                    />
                    
                      <Detail
                        label="Expected Card Total"
                        value={formatCurrency(expectedCardSales, false)}
                        bold
                      />
                      <Detail
                        label="Actual Card Total"
                        value={formatCurrency(parsedActualCardSales, false)}
                        statusType="info"
                        bold
                      />
                      <Detail
                        label="Card Short / Over"
                        value={
                          cardShortOver > 0
                            ? "+" + formatCurrency(cardShortOver, false)
                            : formatCurrency(cardShortOver, false)
                        }
                       // statusType={cardShortOver === 0 ? "success" : "danger"}

                        statusType={(() => {
                        const absDifference = Math.abs(cardShortOver);
                        const isSmallVariance =
                          absDifference >= 0.01 && absDifference <= 1.0;
                        if (cardShortOver === 0) {
                          return "success";
                        } else {
                          if (isSmallVariance) {
                            return "warning";
                          } else {
                            return "danger";
                          }
                        }
                      })()}

                        bold
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Z-Report Modal Overlay */}
            {isZReportVisible && (
              <DialogModel2
                onHide={() => setIsZReportVisible(false)}
                title={`Z-Report Summary [Session: ${sessionDetails.sessionId}]`}
                isVisible={isZReportVisible}
                hideCloseButton={true}
              >
                <div className="p-6 bg-white overflow-y-auto max-h-[80vh]">
                  <ZReportIndex
                    sessionId={sessionDetails.sessionId}
                    setIsZReportVisible={setIsZReportVisible}
                    reload={() => {
                      Math.random();
                    }}
                    opendBy="dayendClose"
                  />
                </div>
              </DialogModel2>
            )}
          </>
        )}
      </div>

      {/* FIXED STICKY FOOTER CONTAINING BOTH RECONCILIATION MONITOR AND ACTIONS */}
      {!isLoading && dayendDetails && (
        <div className="absolute bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-200 p-4 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-5 z-20 rounded-b-2xl">
          {/* Left Side: Reconciliation Summary */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 mr-2">
              <Scale className="h-4 w-4 text-slate-500" />
              {/* <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Reconciliation
              </span> */}
            </div>

            {(() => {
         
  const netSales = parseFloat(dayendDetails?.netSales);
  const openingCash = parseFloat(dayendDetails?.openingCashAmount);
  
  // 2. What SHOULD exist in total (Revenue + Starting Float)
  const expectedTotal = netSales + openingCash;

  // 3. What ACTUALLY exists (Physical Cash Counted + Terminal Card Counted)
  // Note: cashDenominationTotal and parsedActualCardSales should also be safe floats
  const actualPaymentTotal = (cashDenominationTotal || 0) + (parsedActualCardSales || 0);

  // 4. Calculate Difference
  const difference = actualPaymentTotal - expectedTotal;
  const absDifference = Math.abs(difference);

  // Tolerance settings
  const isBalanced = absDifference < 0.01;
  const isSmallVariance = absDifference >= 0.01 && absDifference <= 1.0;

              const status = isBalanced
                ? {
                    label: "Perfect Match",
                    icon: "✅",
                    wrapper: "bg-emerald-50 border-emerald-200",
                    title: "text-emerald-700",
                    amount: "text-emerald-600",
                  }
                : isSmallVariance
                  ? {
                      label: "Small Variance",
                      icon: "⚠️",
                      wrapper: "bg-amber-50 border-amber-200",
                      title: "text-amber-700",
                      amount: "text-amber-600",
                    }
                  : {
                      label: "Variance Detected",
                      icon: "❌",
                      wrapper: "bg-rose-50 border-rose-200",
                      title: "text-rose-700",
                      amount: "text-rose-600",
                    };

              return (
                <>
                  {/* Expected */}
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm min-w-[160px]">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                      Expected Total
                    </p>

                    <p className="text-lg font-bold font-mono text-slate-900">
                      {formatCurrency(expectedTotal, false)}
                    </p>
                  </div>

                  {/* Compare Indicator */}
                  <div
                    className={`text-2xl font-bold ${
                      isBalanced
                        ? "text-emerald-500"
                        : isSmallVariance
                          ? "text-amber-500"
                          : "text-rose-500"
                    }`}
                  >
                    {isBalanced ? "=" : "≠"}
                  </div>

                  {/* Counted */}
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm min-w-[160px]">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                      Counted Total
                    </p>

                    <p className="text-lg font-bold font-mono text-sky-600">
                      {formatCurrency(actualPaymentTotal, false)}
                    </p>
                  </div>

                  {/* Status */}
                  <div
                    className={`rounded-xl px-5 py-3 border shadow-sm min-w-[210px] ${status.wrapper}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{status.icon}</span>

                      <div>
                        <p className={`text-sm font-bold ${status.title}`}>
                          {status.label}
                        </p>

                        <p className={`text-xs font-mono ${status.amount}`}>
                          Difference {difference > 0 ? "+" : ""}
                          {formatCurrency(difference, false)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Right Side: Primary Contextual Action Button */}
          <div className="w-full lg:w-auto flex justify-end">
            {!isSessionEnded ? (
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isLoading}
                className="w-full lg:w-auto px-10 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-md shadow-sky-500/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? "Finalizing..." : "Verify & Close Session"}
              </button>
            ) : (
              <div className="bg-emerald-100 border border-emerald-200 rounded-xl px-4 py-2 flex items-center gap-4 animate-fade-in text-sm">
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-emerald-800">
                    Session Closed Successfully!
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsZReportVisible(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <ReceiptText className="h-3.5 w-3.5" /> View Z Report
                  </button>
                  <button
                    onClick={() => {
                      setIsVisible(false);
                      navigate("/home");
                    }}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-[11px] transition-all"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    <MessagePopup
      isOpen={messagePopup.isOpen}
      onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
      type={messagePopup.type}
      title={messagePopup.title}
      message={messagePopup.message}
    />

    {/* Confirmation Overlay Modal */}
    {showConfirmDialog && (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            Finalize Day End?
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            This process logs your verified cash counting numbers, registers
            discrepancies, and locks down current session sales registers. This
            cannot be undone.
          </p>
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDayEnd}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition"
            >
              Confirm Closing
            </button>
          </div>
        </div>
      </div>
    )}
  </DialogModel2>
);
};

export default DayEnd;


// import React, { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   endSession,
//   getSessionEnd,
//   getSessionMismatchCheck,
// } from "../../functions/session";
// import { formatCurrency, getCurrency } from "../../utils/format";
// import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
// import LoadingPopup from "../../components/LoadingPopup";
// import DialogModel2 from "../../components/model/DialogModel2";
// import MessagePopup from "../../components/MessagePopup";
// import { Coins, Store, Calendar, Monitor, Receipt, Scale, CreditCard } from "lucide-react";
// import ZReportIndex from "../z-report";

// const Detail = ({ label, value, bold = false, statusType = "default" }) => {
//   const getStatusColor = () => {
//     switch (statusType) {
//       case "success": return "text-emerald-600 font-semibold";
//       case "danger": return "text-rose-600 font-semibold";
//       case "warning": return "text-amber-600 font-semibold";
//       case "info": return "text-sky-600 font-semibold";
//       default: return bold ? "text-slate-900 font-semibold" : "text-slate-700";
//     }
//   };

//   return (
//     <div className="flex justify-between py-2.5 border-b border-slate-100 last:border-b-0 items-center">
//       <span className={`text-slate-600 text-sm ${bold ? "font-medium text-slate-800" : ""}`}>
//         {label}
//       </span>
//       <span className={`text-right text-sm font-mono ${getStatusColor()}`}>
//         {value}
//       </span>
//     </div>
//   );
// };

// const CashDenominationRow = ({ denom, value, onChange }) => (
//   <div className="flex bg-slate-50 items-center justify-between gap-3 py-2 px-3 hover:bg-slate-50 rounded-xl border border-slate-100">
//     <div className="w-16 font-semibold text-slate-700 text-sm">
//       {denom.label}
//     </div>
//     <div className="w-20">
//       <input
//         type="number"
//         value={value || ""}
//         placeholder="0"
//         onChange={onChange}
//         min="0"
//         className="w-full px-2 py-1.5 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all font-medium"
//       />
//     </div>
//     <div className="w-24 text-right font-medium text-slate-800 text-sm font-mono">
//       {formatCurrency(denom.qty * value, false)}
//     </div>
//   </div>
// );

// const DayEnd = ({ isVisible, setIsVisible }) => {
//   const navigate = useNavigate();

//   const [dayendDetails, setDayendDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [isZReportVisible, setIsZReportVisible] = useState(false);
//   const [messagePopup, setMessagePopup] = useState({ isOpen: false, type: "info", title: "", message: "" });

//   const [cashDenominations, setCashDenominations] = useState([
//     { label: `5000`, qty: 5000, value: 0 },
//     { label: `1000`, qty: 1000, value: 0 },
//     { label: `500`, qty: 500, value: 0 },
//     { label: `100`, qty: 100, value: 0 },
//     { label: `50`, qty: 50, value: 0 },
//     { label: `20`, qty: 20, value: 0 },
//     { label: `10`, qty: 10, value: 0 },
//     { label: `5`, qty: 5, value: 0 },
//     { label: `2`, qty: 2, value: 0 },
//     { label: `1`, qty: 1, value: 0 },
//   ]);

//   // NEW STATES: Card Verification, Slip/Batch details and Notes
//   const [actualCardSales, setActualCardSales] = useState("");
//   const [terminalSlipNo, setTerminalSlipNo] = useState("");
//   const [managerNotes, setManagerNotes] = useState("");

//   const [isSessionEnded, setIsSessionEnded] = useState(false);

//   const cashDenominationTotal = cashDenominations.reduce(
//     (sum, d) => sum + d.qty * d.value,
//     0,
//   );
//   const short = cashDenominationTotal - (dayendDetails?.expectedCash || 0);

//   // NEW CALCULATIONS: Card Discrepancy Calculation
//   const parsedActualCardSales = parseFloat(actualCardSales) || 0;
//   const expectedCardSales = parseFloat(dayendDetails?.netCardSales) || 0;
//   const cardShortOver = parsedActualCardSales - expectedCardSales;

//   // Safe JSON localStorage parsing wrapper
//   const safeParseItem = (key, fallback = null) => {
//     const item = localStorage.getItem(key);
//     if (!item || item === "undefined") return fallback;
//     try {
//       return JSON.parse(item);
//     } catch (e) {
//       console.error(`Error parsing localStorage key "${key}":`, e);
//       return fallback;
//     }
//   };

//   const terminal = safeParseItem("terminal");
//   const sessionDetails = safeParseItem("sessionDetails");
//   const selectedStore = safeParseItem("selectedStore", {});

//   const sessionName = sessionDetails?.sessionName;
//   const terminalName = terminal?.terminalName;
//   const storeName = selectedStore?.storeName || "N/A";

//   const loadSessionMismatchCheck = useCallback(async () => {
//     try {
//       if (!sessionDetails?.sessionId || !terminal?.terminalId) return;
//       const result = await getSessionMismatchCheck(
//         sessionDetails.sessionId,
//         terminal?.terminalId,
//       );
//       if (result.data.values.isSessionMismatched) {
//         navigate("/home");
//       }
//     } catch (err) {
//       console.error("Mismatch check error:", err);
//     }
//   }, [navigate, sessionDetails?.sessionId, terminal?.terminalId]);

//   const loadDayendDetails = useCallback(async () => {
//     try {
//       if (!sessionDetails?.sessionId || !terminal?.terminalId) return;
//       setIsLoading(true);
//       const payload = {
//         sessionId: sessionDetails.sessionId,
//         terminalId: terminal?.terminalId,
//       };
//       const result = await getSessionEnd(payload);
//       setDayendDetails(result.data.records[0]);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [sessionDetails?.sessionId, terminal?.terminalId]);

//   useEffect(() => {
//     if (isVisible) {
//       loadSessionMismatchCheck();
//       loadDayendDetails();
//     }
//   }, [isVisible, loadDayendDetails, loadSessionMismatchCheck]);

//   const onDenominationChange = (index, newValue) => {
//     const updated = [...cashDenominations];
//     updated[index].value = parseInt(newValue) || 0;
//     setCashDenominations(updated);
//   };

//   const handleDayEnd = async () => {
//     if (!sessionDetails?.sessionId) return;
//     const payload = {
//       sessionId: sessionDetails.sessionId,
//       actualCash: cashDenominationTotal,
//       short: short,
//       actualCard: parsedActualCardSales,          // MODIFIED: Payload එකට එක් කළ නව දත්ත
//       cardShortOver: cardShortOver,                // MODIFIED: Payload එකට එක් කළ නව දත්ත
//       terminalSlipNo: terminalSlipNo,              // MODIFIED: Payload එකට එක් කළ නව දත්ත
//       managerNotes: managerNotes,                  // MODIFIED: Payload එකට එක් කළ නව දත්ත
//       isConfirm: true,
//     };

//     setIsLoading(true);
//     setShowConfirmDialog(false);

//     try {
//       const res = await endSession(payload);

//       if(res.data?.error){
//         setMessagePopup({
//           isOpen: true,
//           type: "danger",
//           title: "Unexpected Error",
//           message: res.data.error,
//         });
//         return;
//       }
//       const { outputValues } = res.data;

//       if (outputValues?.responseStatus === "failed") {
//         setMessagePopup({
//           isOpen: true,
//           type: "danger",
//           title: "Closing Failed",
//           message: outputValues.outputMessage,
//         });
//         return;
//       }

//       setIsSessionEnded(true);
      
//     } catch (err) {
//       console.error(err);
//       setMessagePopup({
//         isOpen: true,
//         type: "danger",
//         title: "Unexpected Error",
//         message: "Something went wrong during closing. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <DialogModel2 title="Day End Closing" onHide={() => setIsVisible(false)}>
//       <div className="max-w-7xl mx-auto p-4 overflow-y-auto">
//         {isLoading && !dayendDetails ? (
//           <LoadingPopup text="Loading Day-End Summary..." />
//         ) : (
//           <>
//             {/* Metadata Header Summary Bar */}
//             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <Receipt className="h-6 w-6 text-sky-600" />
//                 <h1 className="text-xl font-bold text-slate-900 tracking-tight">
//                   Day End Process Summary
//                 </h1>
//               </div>
//               <div className="flex flex-wrap gap-6 items-center text-sm">
//                 <p className="flex items-center gap-2 text-slate-600">
//                   <Store className="h-4 w-4 text-slate-400" />
//                   Store:{" "}
//                   <span className="font-semibold text-slate-800">
//                     {storeName}
//                   </span>
//                 </p>
//                 <p className="flex items-center gap-2 text-slate-600">
//                   <Calendar className="h-4 w-4 text-slate-400" />
//                   Session:{" "}
//                   <span className="font-semibold text-slate-800">
//                     {sessionName}
//                   </span>
//                 </p>
//                 <p className="flex items-center gap-2 text-slate-600">
//                   <Monitor className="h-4 w-4 text-slate-400" />
//                   Terminal:{" "}
//                   <span className="font-semibold text-slate-800">
//                     {terminalName}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">

//      {/* ROW 3: Operations & Quantities Box */}
//               <div className="grid lg:grid-cols-2 gap-5">
//                 {/* Sales Totals Card */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
                 
              

//   <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                      Sales Summary 
//                     </h2>
//                     <span className="text-sm text-slate-500">
//                     ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                     </span>
//                   </div>



 

//                   <div className="space-y-0.5">
//                     <Detail
//                       label="Product Sales"
//                       value={formatCurrency(dayendDetails?.productSales, false)}
//                     />
//                     <Detail
//                       label="Service / Non-Product Sales"
//                       value={formatCurrency(
//                         dayendDetails?.nonProductSales,
//                         false,
//                       )}
//                     />
//                     <Detail
//                       label="Gross Sales"
//                       value={formatCurrency(dayendDetails?.totalSales, false)}
//                       bold
//                     />
//                     <Detail
//                       label="(-) Active Discounts Given"
//                       value={formatCurrency(
//                         dayendDetails?.totalDiscounts,
//                         false,
//                       )}
//                     />
//                     <div className="border-t border-slate-100 my-2" />
//                     <Detail
//                       label="Net Sales"
//                       value={formatCurrency(dayendDetails?.netSales, false)}
//                       bold
//                     />
//                     <div className="border-t border-slate-100 my-2" />
//                     <Detail
//                       label="Voided Invoices Value"
//                       value={formatCurrency(
//                         dayendDetails?.voidedTransactionsAmount,
//                         false,
//                       )}
//                       statusType="warning"
//                     />
//                     <Detail
//                       label="Total Cost of Goods Sold (COGS)"
//                       value={formatCurrency(
//                         dayendDetails?.totalCostAmount,
//                         false,
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
//                   <h2 className="text-lg font-semibold mb-4 text-slate-900">
//                     Operations & Quantities
//                   </h2>
//                   <div className="space-y-0.5">
//                     <Detail
//                       label="Successful Transactions"
//                       value={
//                         (dayendDetails?.noOfTransactions || 0) -
//                         (dayendDetails?.noOfVoidedTransactions || 0)
//                       }
//                       bold
//                     />
//                     <Detail
//                       label="Registered Customer Sales"
//                       value={dayendDetails?.noOfCustomers}
//                       bold
//                     />
//                     <Detail
//                       label="Physical Items Moved"
//                       value={dayendDetails?.noOfProductsSold}
//                     />
//                     <div className="border-t border-dashed border-slate-200 my-2" />
//                     <Detail
//                       label="Voided Transactions"
//                       value={dayendDetails?.noOfVoidedTransactions}
//                       statusType="warning"
//                     />
//                   </div>
//                 </div>
//               </div>


//               {/* ROW 1: Cash Counter & Flow Breakdown */}
//               <div className="grid lg:grid-cols-2 gap-5">
//                 {/* Compact Dual Column Cash Counter Card */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
//                   <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                       <Coins className="h-5 w-5 text-sky-600" /> Physical Cash Verification
//                     </h2>
//                     <span className="text-sm text-slate-500">
//                     ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                     </span>
//                   </div>
//                   <p className="text-sm text-slate-500 mb-4">
//               Enter the quantity of notes and coins counted in your drawer.
//                   </p>

//                   <div className="grid grid-cols-2 gap-x-6 gap-y-3">
//                     <div className="hidden sm:flex justify-between text-xs font-semibold text-slate-400 px-3  tracking-wider mb-1">
//                       <span>Denom</span> <span className="mr-6">Qty</span>{" "}
//                       <span>Amount</span>
//                     </div>
//                     <div className="hidden sm:flex justify-between text-xs font-semibold text-slate-400 px-3  tracking-wider mb-1">
//                       <span>Denom</span> <span className="mr-6">Qty</span>{" "}
//                       <span>Amount</span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
//                     {cashDenominations.map((denom, index) => (
//                       <CashDenominationRow
//                         key={denom.label}
//                         denom={denom}
//                         value={denom.value}
//                         onChange={(e) =>
//                           onDenominationChange(index, e.target.value)
//                         }
//                       />
//                     ))}
//                   </div>

//                   {/* <div className="mt-5 flex justify-between items-center bg-slate-50 rounded-xl px-5 py-3 border border-slate-100">
//                     <span className="font-semibold text-slate-800">Total Actual Cash Counted</span>
//                     <span className="text-xl font-bold text-sky-600 font-mono">
//                       {formatCurrency(cashDenominationTotal, false)}
//                     </span>
//                   </div> */}
//                 </div>

//                 {/* Financial Drawer Flow Breakdown */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
                

//                       <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                      Cash Flow Breakdown
//                     </h2>
//                     <span className="text-sm text-slate-500">
//                     ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                     </span>
//                   </div>

//                   <div className="space-y-0.5">
//                     <Detail
//                       label="Opening Drawer Cash"
//                       value={formatCurrency(
//                         dayendDetails?.openingCashAmount,
//                         false,
//                       )}
//                       bold
//                     />
//                     <Detail
//                       label="(+) Cash Sales"
//                       value={formatCurrency(dayendDetails?.netCashSales, false)}
//                     />
//                     <Detail
//                       label="(+) Paid In"
//                       value={formatCurrency(dayendDetails?.paidIn, false)}
//                     />
//                     <Detail
//                       label="(-) Paid Out"
//                       value={formatCurrency(dayendDetails?.paidOut, false)}
//                     />

//                     <div className="border-t border-slate-100 my-2" />

//                     <Detail
//                       label="Expected Drawer Cash"
//                       value={formatCurrency(dayendDetails?.expectedCash, false)}
//                       bold
//                     />
//                     <Detail
//                       label="Actual Drawer Cash"
//                       value={formatCurrency(cashDenominationTotal, false)}
//                       bold
//                       statusType="info"
//                     />
//                     <Detail
//                       label="Cash Short / Over"
//                       value={formatCurrency(short, false)}
//                       statusType={
//                         short === 0
//                           ? "success"
//                           : short < 0
//                             ? "danger"
//                             : "warning"
//                       }
//                       bold
//                     />

//                     {/* <div className="border-t border-slate-100 my-2" />
//                     <Detail label="Expected Card Sales" value={formatCurrency(dayendDetails?.netCardSales, false)} bold /> */}
//                   </div>
//                 </div>
//               </div>

//               {/* MODIFIED ROW 2: Card Verification Section & Sales Summary */}
//               <div className="grid lg:grid-cols-1 gap-5">
//                 {/* NEW COMPONENT: Physical Card Terminal Verification Box */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-2 gap-5">
//                   <div>
             

//         <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                       <CreditCard className="h-5 w-5 text-sky-600" /> Card Payment Verification
//                     </h2>
               
//                   </div>


//                     <p className="text-sm text-slate-500 mb-4">
//                       Enter the final grand total printed from your physical card terminal settlement slip.
//                     </p>

                 
//                       <div className="px-5">
//                         <div className="grid grid-cols-1 gap-4 mb-4">
//                           <div className="grid grid-cols-2 items-center">
//                             <label className="block text-sm text-slate-600 mb-1.5 tracking-wide">
//                               Actual Card Sales
//                             </label>
//                             <input
//                               type="number"
//                               value={actualCardSales}
//                               placeholder="0.00"
//                               onChange={(e) =>
//                                 setActualCardSales(e.target.value)
//                               }
//                               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm font-semibold text-slate-800 transition-all"
//                             />
//                           </div>
//                            <div className="grid grid-cols-2 items-center">
//                             <label className="block text-sm text-slate-600 mb-1.5 tracking-wide">
//                               Terminal Slip No
//                             </label>
//                             <input
//                               type="text"
//                               value={terminalSlipNo}
//                               placeholder="Slip/Batch ID"
//                               onChange={(e) =>
//                                 setTerminalSlipNo(e.target.value)
//                               }
//                               className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-sm font-semibold text-slate-800 transition-all"
//                           />
//                           </div>
//                         </div>
//                       </div>

                  
                   
//                   </div>



// <div className="flex flex-col gap-2">
//          <span className="text-sm text-slate-500 text-right">
//                     ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                     </span>

//                       <div className="space-y-0.5 p-3 ">
//                         <Detail
//                           label="Expected Card Sales"
//                           value={formatCurrency(expectedCardSales, false)}
//                           bold
//                         />
//                         <Detail
//                           label="Actual Card Sales"
//                           value={formatCurrency(parsedActualCardSales, false)}
//                           statusType="info"
//                           bold
//                         />
//                         <Detail
//                           label="Card Short / Over"
//                           value={formatCurrency(cardShortOver, false)}
//                           statusType={
//                             cardShortOver === 0
//                               ? "success"
//                               : cardShortOver < 0
//                                 ? "danger"
//                                 : "warning"
//                           }
//                           bold
//                         />
//                       </div>
// </div>


//                 </div>
//               </div>

         
//             </div>

//             {/* MODIFIED: HORIZONTAL RECONCILIATION MONITOR WITH CARD VERIFICATION */}
//             <div className="mt-8 bg-white border-2 border-sky-100 rounded-2xl p-5 shadow-xs">
//               <div className="flex items-center justify-between pb-3 mb-4 flex-wrap gap-2">
//                 <div className="flex items-center gap-2">
//                   <Scale className="h-5 w-5 text-gray-600" />
//                   <h2 className="text-lg font-bold text-slate-800 tracking-tight">
//                     End-Of-Day Revenue Reconciliation Monitor
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex flex-col md:flex-row items-center justify-start gap-4 flex-wrap">
//                 {/* 1. Combined Actual Drawer Cash Box */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between">
//                   <div>
//                     <p className="text-xs text-slate-500 font-bold mb-1">
//                       Actual Drawer Cash
//                     </p>
//                     <p className="text-lg font-bold font-mono text-sky-600">
//                       {formatCurrency(cashDenominationTotal, false)}
//                     </p>
//                   </div>
//                   <p className="text-xs text-slate-400 mt-2">
//                     Physical cash in drawer
//                   </p>
//                 </div>

//                 {/* PLUS OPERATOR MARK */}
//                 <div className="flex items-center justify-center bg-slate-100 text-slate-600 w-8 h-8 rounded-full border border-slate-200 text-sm font-extrabold shadow-2xs">
//                   +
//                 </div>

//                 {/* 2. Actual Counted Card Sales Box */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between w-full md:w-48 min-h-[90px]">
//                   <div>
//                     <p className="text-xs text-slate-500 font-bold mb-1">
//                       Actual Card Sales
//                     </p>
//                     <p className="text-lg font-bold font-mono text-slate-900">
//                       {formatCurrency(parsedActualCardSales, false)}
//                     </p>
//                   </div>
//                   <p className="text-xs text-slate-400 mt-auto">
//                     Counted terminal total
//                   </p>
//                 </div>

//                 {/* EQUAL OPERATOR MARK */}
//                 <div className="flex items-center justify-center bg-sky-100 text-sky-700 w-8 h-8 rounded-full border border-sky-200 text-sm font-extrabold shadow-2xs">
//                   =
//                 </div>

//                 {/* 3. Reconciled Total with Double Mismatch validation */}
//                 {(() => {
//                   const expectedTotalFunds =
//                     parseFloat(dayendDetails?.openingCashAmount) +
//                     parseFloat(dayendDetails?.netSales) +
//                     parseFloat(dayendDetails?.paidIn) -
//                     parseFloat(dayendDetails?.paidOut);

//                   const actualTotalFunds =
//                     cashDenominationTotal + parsedActualCardSales;
//                   const finalDiscrepancy =
//                     actualTotalFunds - expectedTotalFunds;

//                   // Cash හෝ Card දෙකෙන් එකක හෝ වෙනසක් තිබේ නම් Mismatch පෙන්වයි
//                   const isFullyBalanced = short === 0 && cardShortOver === 0;

//                   return (
//                     <div
//                       className={`rounded-xl p-3.5 border-2 shadow-xs transition-colors flex flex-col justify-between w-full md:w-52 min-h-[90px] ${
//                         isFullyBalanced
//                           ? "bg-emerald-50/60 border-emerald-200"
//                           : "bg-rose-50/60 border-rose-200"
//                       }`}
//                     >
//                       <div>
//                         <div className="flex justify-between items-center mb-0.5">
//                           <p className="text-xs text-slate-700 font-bold">
//                             Reconciled Total
//                           </p>
//                           <span
//                             className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md ${
//                               isFullyBalanced
//                                 ? "bg-emerald-200 text-emerald-800"
//                                 : "bg-rose-200 text-rose-800"
//                             }`}
//                           >
//                             {isFullyBalanced ? "Balanced" : "Mismatch"}
//                           </span>
//                         </div>
//                         <p
//                           className={`text-xl font-extrabold font-mono tracking-tight mb-1 ${
//                             isFullyBalanced
//                               ? "text-emerald-700"
//                               : "text-rose-700"
//                           }`}
//                         >
//                           {formatCurrency(actualTotalFunds, false)}
//                         </p>
//                       </div>

//                       <p
//                         className={`text-[11px] font-bold font-mono ${isFullyBalanced ? "text-emerald-600" : "text-rose-600"}`}
//                       >
//                         Diff: {finalDiscrepancy > 0 ? "+" : ""}
//                         {formatCurrency(finalDiscrepancy, false)}
//                       </p>
//                     </div>
//                   );
//                 })()}




//    {/* <div className="">
//                     <label className="block text-xs font-bold text-slate-600 mb-1">
//                       Notes
//                     </label>
//                     <textarea
//                       value={managerNotes}
//                       rows="2"
//                       placeholder="Enter any shift variance notes here..."
//                       onChange={(e) => setManagerNotes(e.target.value)}
//                       className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
//                     />
//                   </div> */}

//               </div>
//             </div>

//             {/* Z-Report Modal Overlay */}
//             {isZReportVisible && (
//               <DialogModel2
//                 onHide={() => setIsZReportVisible(false)}
//                 title={`Z-Report Summary [Session: ${sessionDetails.sessionId}]`}
//                 isVisible={isZReportVisible}
//                 hideCloseButton={true}
//               >
//                 <div className="p-6 bg-white overflow-y-auto max-h-[80vh]">
//                   <ZReportIndex
//                     sessionId={sessionDetails.sessionId}
//                     setIsZReportVisible={setIsZReportVisible}
//                     reload={() => {
//                       Math.random();
//                     }}
//                     opendBy="dayendClose"
//                   />
//                 </div>
//               </DialogModel2>
//             )}

//             {/* Action Trigger Footer Section */}
//             <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
//               {!isSessionEnded ? (
//                 <button
//                   onClick={() => setShowConfirmDialog(true)}
//                   disabled={isLoading}
//                   className="w-full sm:w-auto px-12 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-md shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 tracking-wide"
//                 >
//                   {isLoading ? "Finalizing..." : "Verify & Close Day End"}
//                 </button>
//               ) : (
//                 <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
//                   <div className="text-left">
//                     <p className="text-sm font-bold text-emerald-800">
//                       Session Closed Successfully!
//                     </p>
//                     <p className="text-xs text-emerald-600">
//                       You can now print the official Z Report for auditing.
//                     </p>
//                   </div>
//                   <div className="flex gap-2 w-full sm:w-auto">
//                     <button
//                       onClick={() => setIsZReportVisible(true)}
//                       className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
//                     >
//                       <Receipt className="h-4 w-4" /> View Z Report
//                     </button>
//                     <button
//                       onClick={() => {
//                         setIsVisible(false);
//                         navigate("/home");
//                       }}
//                       className="flex-1 sm:flex-none px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl text-sm transition-all"
//                     >
//                       Go to Home
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       <MessagePopup
//         isOpen={messagePopup.isOpen}
//         onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
//         type={messagePopup.type}
//         title={messagePopup.title}
//         message={messagePopup.message}
//       />

//       {/* Confirmation Overlay Modal */}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-100">
//             <h3 className="text-xl font-bold text-slate-900">
//               Finalize Day End?
//             </h3>
//             <p className="mt-2 text-sm text-slate-500 leading-relaxed">
//               This process logs your verified cash counting numbers, registers
//               discrepancies, and locks down current session sales registers.
//               This cannot be undone.
//             </p>
//             <div className="mt-6 flex gap-3 justify-end">
//               <button
//                 onClick={() => setShowConfirmDialog(false)}
//                 className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDayEnd}
//                 className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition"
//               >
//                 Confirm Closing
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </DialogModel2>
//   );
// };

// export default DayEnd;



// import React, { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   endSession,
//   getSessionEnd,
//   getSessionMismatchCheck,
// } from "../../functions/session";
// import { formatCurrency, getCurrency } from "../../utils/format";
// import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
// import LoadingPopup from "../../components/LoadingPopup";
// import DialogModel2 from "../../components/model/DialogModel2";
// import MessagePopup from "../../components/MessagePopup";
// import { Coins, Store, Calendar, Monitor, Receipt, Scale } from "lucide-react";
// import ZReportIndex from "../z-report";

// const Detail = ({ label, value, bold = false, statusType = "default" }) => {
//   const getStatusColor = () => {
//     switch (statusType) {
//       case "success": return "text-emerald-600 font-semibold";
//       case "danger": return "text-rose-600 font-semibold";
//       case "warning": return "text-amber-600 font-semibold";
//       case "info": return "text-sky-600 font-semibold";
//       default: return bold ? "text-slate-900 font-semibold" : "text-slate-700";
//     }
//   };

//   return (
//     <div className="flex justify-between py-2.5 border-b border-slate-100 last:border-b-0 items-center">
//       <span className={`text-slate-600 text-sm ${bold ? "font-medium text-slate-800" : ""}`}>
//         {label}
//       </span>
//       <span className={`text-right text-sm font-mono ${getStatusColor()}`}>
//         {value}
//       </span>
//     </div>
//   );
// };

// const CashDenominationRow = ({ denom, value, onChange }) => (
//   <div className="flex bg-slate-50 items-center justify-between gap-3 py-2 px-3 hover:bg-slate-50 rounded-xl border border-slate-100">
//     <div className="w-16 font-semibold text-slate-700 text-sm">
//       {denom.label}
//     </div>
//     <div className="w-20">
//       <input
//         type="number"
//         value={value || ""}
//         placeholder="0"
//         onChange={onChange}
//         min="0"
//         className="w-full px-2 py-1.5 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-all font-medium"
//       />
//     </div>
//     <div className="w-24 text-right font-medium text-slate-800 text-sm font-mono">
//       {formatCurrency(denom.qty * value, false)}
//     </div>
//   </div>
// );

// const DayEnd = ({ isVisible, setIsVisible }) => {
//   const navigate = useNavigate();

//   const [dayendDetails, setDayendDetails] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [isZReportVisible, setIsZReportVisible] = useState(false);
//   const [messagePopup, setMessagePopup] = useState({ isOpen: false, type: "info", title: "", message: "" });

//   const [cashDenominations, setCashDenominations] = useState([
//     { label: `5000`, qty: 5000, value: 0 },
//     { label: `1000`, qty: 1000, value: 0 },
//     { label: `500`, qty: 500, value: 0 },
//     { label: `100`, qty: 100, value: 0 },
//     { label: `50`, qty: 50, value: 0 },
//     { label: `20`, qty: 20, value: 0 },
//     { label: `10`, qty: 10, value: 0 },
//     { label: `5`, qty: 5, value: 0 },
//     { label: `2`, qty: 2, value: 0 },
//     { label: `1`, qty: 1, value: 0 },
//   ]);


// const [isSessionEnded, setIsSessionEnded] = useState(false); // අලුතින් එක් කළ state එක


//   const cashDenominationTotal = cashDenominations.reduce(
//     (sum, d) => sum + d.qty * d.value,
//     0,
//   );
//   const short = cashDenominationTotal - (dayendDetails?.expectedCash || 0);

//   // Safe JSON localStorage parsing wrapper
//   const safeParseItem = (key, fallback = null) => {
//     const item = localStorage.getItem(key);
//     if (!item || item === "undefined") return fallback;
//     try {
//       return JSON.parse(item);
//     } catch (e) {
//       console.error(`Error parsing localStorage key "${key}":`, e);
//       return fallback;
//     }
//   };

//   const terminal = safeParseItem("terminal");
//   const sessionDetails = safeParseItem("sessionDetails");
//   const selectedStore = safeParseItem("selectedStore", {});

//   const sessionName = sessionDetails?.sessionName;
//   const terminalName = terminal?.terminalName;
//   const storeName = selectedStore?.storeName || "N/A";

//   const loadSessionMismatchCheck = useCallback(async () => {
//     try {
//       if (!sessionDetails?.sessionId || !terminal?.terminalId) return;
//       const result = await getSessionMismatchCheck(
//         sessionDetails.sessionId,
//         terminal?.terminalId,
//       );
//       if (result.data.values.isSessionMismatched) {
//         navigate("/home");
//       }
//     } catch (err) {
//       console.error("Mismatch check error:", err);
//     }
//   }, [navigate, sessionDetails?.sessionId, terminal?.terminalId]);

//   const loadDayendDetails = useCallback(async () => {
//     try {
//       if (!sessionDetails?.sessionId || !terminal?.terminalId) return;
//       setIsLoading(true);
//       const payload = {
//         sessionId: sessionDetails.sessionId,
//         terminalId: terminal?.terminalId,
//       };
//       const result = await getSessionEnd(payload);
//       setDayendDetails(result.data.records[0]);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [sessionDetails?.sessionId, terminal?.terminalId]);

//   useEffect(() => {
//     if (isVisible) {
//       loadSessionMismatchCheck();
//       loadDayendDetails();
//     }
//   }, [isVisible, loadDayendDetails, loadSessionMismatchCheck]);

//   const onDenominationChange = (index, newValue) => {
//     const updated = [...cashDenominations];
//     updated[index].value = parseInt(newValue) || 0;
//     setCashDenominations(updated);
//   };


// const handleDayEnd = async () => {
//   if (!sessionDetails?.sessionId) return;
//   const payload = {
//     sessionId: sessionDetails.sessionId,
//     actualCash: cashDenominationTotal,
//     short: short,
//     isConfirm: true,
//   };

//   setIsLoading(true);
//   setShowConfirmDialog(false);

//   try {
//     const res = await endSession(payload);

//     if(res.data?.error){
//       setMessagePopup({
//         isOpen: true,
//         type: "danger",
//         title: "Unexpected Error",
//         message: res.data.error,
//       });
//       return;
//     }
//     const { outputValues } = res.data;

//     if (outputValues?.responseStatus === "failed") {
//       setMessagePopup({
//         isOpen: true,
//         type: "danger",
//         title: "Closing Failed",
//         message: outputValues.outputMessage,
//       });
//       return;
//     }

//     // setMessagePopup({
//     //   isOpen: true,
//     //   type: "success",
//     //   title: "Session Closed",
//     //   message: outputValues?.outputMessage,
//     // });

//     setIsSessionEnded(true);
    
//   } catch (err) {
//     console.error(err);
//     setMessagePopup({
//       isOpen: true,
//       type: "danger",
//       title: "Unexpected Error",
//       message: "Something went wrong during closing. Please try again.",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <DialogModel2 title="Day End Closing" onHide={() => setIsVisible(false)}>
//       <div className="max-w-7xl mx-auto p-4 overflow-y-auto">
//         {isLoading && !dayendDetails ? (
//           <LoadingPopup text="Loading Day-End Summary..." />
//         ) : (
//           <>
//             {/* Metadata Header Summary Bar */}
//             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <Receipt className="h-6 w-6 text-sky-600" />
//                 <h1 className="text-xl font-bold text-slate-900 tracking-tight">
//                   Day End Process Summary
//                 </h1>
//               </div>
//               <div className="flex flex-wrap gap-6 items-center text-sm">
//                 <p className="flex items-center gap-2 text-slate-600">
//                   <Store className="h-4 w-4 text-slate-400" />
//                   Store: <span className="font-semibold text-slate-800">{storeName}</span>
//                 </p>
//                 <p className="flex items-center gap-2 text-slate-600">
//                   <Calendar className="h-4 w-4 text-slate-400" />
//                   Session: <span className="font-semibold text-slate-800">{sessionName}</span>
//                 </p>
//                 <p className="flex items-center gap-2 text-slate-600">
//                   <Monitor className="h-4 w-4 text-slate-400" />
//                   Terminal: <span className="font-semibold text-slate-800">{terminalName}</span>
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6">
              
//               {/* LEFT COLUMN: Cash Verification Inputs & Reconciliations (7 Columns) */}
//               <div className="grid lg:grid-cols-2 gap-5">
                
//                 {/* Compact Dual Column Cash Counter Card */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
//                   <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
//                       <Coins className="h-5 w-5 text-sky-600" /> Physical Cash Verification
//                     </h2>
//                     <span className="text-xs text-slate-500">
//                       Currency: ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                     </span>
//                   </div>
//                   <p className="text-xs text-slate-500 mb-4">
//                     Input currency piece quantities counted within your drawer.
//                   </p>

//                   {/* Compact Header */}
//                   <div className="grid grid-cols-2 gap-x-6 gap-y-3">
//                     <div className="hidden sm:flex justify-between text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider mb-1">
//                       <span>Denom</span> <span className="mr-6">Qty</span> <span>Amount</span>
//                     </div>
//                     <div className="hidden sm:flex justify-between text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider mb-1">
//                       <span>Denom</span> <span className="mr-6">Qty</span> <span>Amount</span>
//                     </div>
//                   </div>

//                   {/* Two-Column Grid Mapping */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
//                     {cashDenominations.map((denom, index) => (
//                       <CashDenominationRow
//                         key={denom.label}
//                         denom={denom}
//                         value={denom.value}
//                         onChange={(e) => onDenominationChange(index, e.target.value)}
//                       />
//                     ))}
//                   </div>

//                   <div className="mt-5 flex justify-between items-center bg-slate-50 rounded-xl px-5 py-3 border border-slate-100">
//                     <span className="font-semibold text-slate-800">Total Actual Cash Counted</span>
//                     <span className="text-xl font-bold text-sky-600 font-mono">
//                       {formatCurrency(cashDenominationTotal, false)}
//                     </span>
//                   </div>
//                 </div>



                
//    {/* Financial Drawer Flow Breakdown directly below the inputs */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
//                   <h2 className="text-lg font-semibold mb-4 text-slate-900">
//                     Financial Flow Breakdown ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                   </h2>
//                   <div className="space-y-0.5">
//                     <Detail label="Opening Drawer Cash" value={formatCurrency(dayendDetails?.openingCashAmount, false)} bold />
//                     <Detail label="(+) Cash Sales" value={formatCurrency(dayendDetails?.netCashSales, false)} />
//                     <Detail label="(+) Paid In" value={formatCurrency(dayendDetails?.paidIn, false)} />
//                     <Detail label="(-) Paid Out" value={formatCurrency(dayendDetails?.paidOut, false)} />
                    
//                     <div className="border-t border-slate-100 my-2" />
                    
//                     <Detail 
//                       label="Expected Drawer Cash" 
//                       value={formatCurrency(dayendDetails?.expectedCash, false)} 
//                      // statusType="info" 
//                      bold
//                     />
//                     <Detail 
//                       label="Actual Drawer Cash" 
//                       value={formatCurrency(cashDenominationTotal, false)} 
//                       bold 
//                       statusType="info"
//                     />
//                     <Detail 
//                       label="Cash Short / Over" 
//                       value={formatCurrency(short, false)} 
//                       statusType={short === 0 ? "success" : short < 0 ? "danger" : "warning"}
//                       bold
//                     />

//                     <div className="border-t border-slate-100 my-2" />
//                     <Detail label="Expected Card Sales" value={formatCurrency(dayendDetails?.netCardSales, false)} bold />
//                   </div>
//                 </div>



         

//               </div>

//               {/* RIGHT COLUMN: Sales & Audit Summaries (5 Columns) */}
//                   <div className="grid lg:grid-cols-2 gap-5">


//                     {/* Sales Totals Card */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
//                   <h2 className="text-lg font-semibold mb-4 text-slate-900">
//                     Sales Summary ({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})
//                   </h2>
              
//                   <div className="space-y-0.5">
//                          <Detail label="Product Sales" value={formatCurrency(dayendDetails?.productSales, false)} />
//                     <Detail label="Service / Non-Product Sales" value={formatCurrency(dayendDetails?.nonProductSales, false)} />
                
//                     <Detail label="Gross Sales" value={formatCurrency(dayendDetails?.totalSales, false)} bold />
//                     <Detail label="(-) Active Discounts Given" value={formatCurrency(dayendDetails?.totalDiscounts, false)} />
//                     <div className="border-t border-slate-100 my-2" />
               
//                     <Detail label="Net Sales" value={formatCurrency(dayendDetails?.netSales, false)}  bold />
//                     <div className="border-t border-slate-100 my-2" />
               
//                     <Detail label="Voided Invoices Value" value={formatCurrency(dayendDetails?.voidedTransactionsAmount, false)} statusType="warning" />
//                    <Detail label="Total Cost of Goods Sold (COGS)" value={formatCurrency(dayendDetails?.totalCostAmount, false)} />
                  
//                   </div>
//                 </div>


//                 {/* Audit & Unit Counter Card */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-5">
//                   <h2 className="text-lg font-semibold mb-4 text-slate-900">
//                     Operations & Quantities
//                   </h2>
//                   <div className="space-y-0.5">
//                     <Detail
//                       label="Successful Transactions"
//                       value={(dayendDetails?.noOfTransactions || 0) - (dayendDetails?.noOfVoidedTransactions || 0)}
//                       bold
//                     />
//                     <Detail label="Registered Customer Sales" value={dayendDetails?.noOfCustomers} bold />
//                     <Detail label="Physical Items Moved" value={dayendDetails?.noOfProductsSold} />
                 
//                     <div className="border-t border-dashed border-slate-200 my-2" />
                    
//                     <Detail
//                       label="Total Cancelled / Voided Transactions"
//                       value={dayendDetails?.noOfVoidedTransactions}
//                       statusType="warning"
//                     />
//                   </div>
//                 </div>
//               </div>

//             </div>

//           {/* EYE CATCHING FULL-WIDTH HORIZONTAL RECONCILIATION SECTION (LIGHT THEME) */}
// {/* EYE CATCHING FULL-WIDTH HORIZONTAL RECONCILIATION SECTION (5-COLUMN LIGHT THEME) */}
// <div className="mt-8 bg-white border-2 border-sky-100 rounded-2xl p-5 shadow-xs">
//   <div className="flex items-center justify-between pb-3 mb-4 flex-wrap gap-2">
//     <div className="flex items-center gap-2">
//       <Scale className="h-5 w-5 text-gray-600" />
//       <h2 className="text-lg font-bold text-slate-800 tracking-tight">
//         End-Of-Day Revenue Reconciliation Monitor
//       </h2>
//     </div>
//   </div>

//   {/* Flex layout container to horizontally string cards and math operators together smoothly */}
//   <div className="flex flex-col md:flex-row items-center justify-start gap-4 flex-wrap">
    
//     {/* 1. Combined Actual Drawer Cash Box */}
//     <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between">
//       <div>
//         <p className="text-xs text-slate-500 font-bold mb-1">Actual Drawer Cash</p>
//         <p className="text-lg font-bold font-mono text-sky-600">
//           {formatCurrency(cashDenominationTotal, false)}
//         </p>
//       </div>
//       <p className="text-xs text-slate-400 mt-2">Physical cash in drawer</p>
//     </div>

//     {/* PLUS OPERATOR MARK */}
//     <div className="flex items-center justify-center bg-slate-100 text-slate-600 w-8 h-8 rounded-full border border-slate-200 text-sm font-extrabold shadow-2xs">
//       +
//     </div>

//     {/* 2. Card Sales */}
//     <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col justify-between w-full md:w-48 min-h-[90px]">
//       <div>
//         <p className="text-xs text-slate-500 font-bold mb-1">Card Sales</p>
//         <p className="text-lg font-bold font-mono text-slate-900">
//           {formatCurrency(dayendDetails?.netCardSales, false)}
//         </p>
//       </div>
//       <p className="text-xs text-slate-400 mt-auto">Digital card terminal total</p>
//     </div>

//     {/* EQUAL OPERATOR MARK */}
//     <div className="flex items-center justify-center bg-sky-100 text-sky-700 w-8 h-8 rounded-full border border-sky-200 text-sm font-extrabold shadow-2xs">
//       =
//     </div>

//  {(() => {
//       // Expected Drawer Cash = Opening Cash + Net Cash Sales + Paid In - Paid Out
//       // Expected Total Revenue = Opening Cash + Net Sales + Paid In - Paid Out
//       const expectedTotalFunds = 
//        parseFloat(dayendDetails?.openingCashAmount) + 
//         parseFloat(dayendDetails?.netSales)+ 
//         parseFloat(dayendDetails?.paidIn) - 
//         parseFloat(dayendDetails?.paidOut);
        
//       const actualTotalFunds = cashDenominationTotal + (parseFloat(dayendDetails?.netCardSales) || 0);
//       const finalDiscrepancy = actualTotalFunds - expectedTotalFunds;

//       return (
//         <div className={`rounded-xl p-3.5 border-2 shadow-xs transition-colors flex flex-col justify-between ${
//           finalDiscrepancy === 0 
//             ? "bg-emerald-50/60 border-emerald-200" 
//             : "bg-rose-50/60 border-rose-200"
//         }`}>
//           <div>
//             <div className="flex justify-between gap-5 items-center mb-0.5">
//               <p className="text-xs text-slate-700 font-bold">Reconciled Total</p>
//               <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md ${
//                 finalDiscrepancy === 0 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
//               }`}>
//                 {finalDiscrepancy === 0 ? "Balanced" : "Mismatch"}
//               </span>
//             </div>
//             <p className={`text-xl font-extrabold font-mono tracking-tight mb-1 ${
//               finalDiscrepancy === 0 ? "text-emerald-700" : "text-rose-700"
//             }`}>
//               {formatCurrency(actualTotalFunds, false)}
//             </p>
//           </div>
    
           
//           <p className={`text-[11px] font-bold font-mono ${finalDiscrepancy === 0 ? "text-emerald-600" : "text-rose-600"}`}>
//             Diff: {finalDiscrepancy > 0 ? "+" : ""}{formatCurrency(finalDiscrepancy, false)}
//           </p>
//         </div>
//       );
//     })()}



//   </div>
// </div>
          






//       {isZReportVisible && (
//         <DialogModel2 
//           onHide={() => setIsZReportVisible(false)} 
//           title={`Z-Report Summary [Session: ${sessionDetails.sessionId}]`}   
//           isVisible={isZReportVisible}
//               hideCloseButton={true}
//         >
//           <div className="p-6 bg-white overflow-y-auto max-h-[80vh]">
          
// <ZReportIndex sessionId={sessionDetails.sessionId} setIsZReportVisible={setIsZReportVisible} reload={()=>{
//   Math.random();
// }} opendBy="dayendClose" />

//           </div>
//         </DialogModel2>
//       )}







          
//    {/* Action Trigger Footer Section */}
//             <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
//               {!isSessionEnded ? (
//                 <button
//                   onClick={() => setShowConfirmDialog(true)} // Modal එක open කරයි
//                   disabled={isLoading}
//                   className="w-full sm:w-auto px-12 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-md shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 tracking-wide"
//                 >
//                   {isLoading ? "Finalizing..." : "Verify & Close Day End"}
//                 </button>
//               ) : (
//                 /* සැසිය සාර්ථකව වැසුණු පසු පෙන්වන Z Report පැනලය */
//                 <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
//                   <div className="text-left">
//                     <p className="text-sm font-bold text-emerald-800">Session Closed Successfully!</p>
//                     <p className="text-xs text-emerald-600">You can now print the official Z Report for auditing.</p>
//                   </div>
//                   <div className="flex gap-2 w-full sm:w-auto">
//                     <button
//                       onClick={() => setIsZReportVisible(true)}
//                       className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
//                     >
//                       <Receipt className="h-4 w-4" /> View Z Report
//                     </button>
//                     <button
//                       onClick={() => {
//                         setIsVisible(false);
//                         navigate("/home");
//                       }}
//                       className="flex-1 sm:flex-none px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl text-sm transition-all"
//                     >
//                       Go to Home
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       <MessagePopup
//         isOpen={messagePopup.isOpen}
//         onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
//         type={messagePopup.type}
//         title={messagePopup.title}
//         message={messagePopup.message}
//       />

//       {/* Confirmation Overlay Modal */}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-100">
//             <h3 className="text-xl font-bold text-slate-900">Finalize Day End?</h3>
//             <p className="mt-2 text-sm text-slate-500 leading-relaxed">
//               This process logs your verified cash counting numbers, registers discrepancies, and locks down current session sales registers. This cannot be undone.
//             </p>
//             <div className="mt-6 flex gap-3 justify-end">
//               <button
//                 onClick={() => setShowConfirmDialog(false)}
//                 className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDayEnd} // මෙය එබූ විට handleDayEnd ක්‍රියාත්මක වී Z Report එක පෙන්වයි
//                 className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm transition"
//               >
//                 Confirm Closing
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </DialogModel2>
//   );
// };

// export default DayEnd;