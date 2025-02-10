import React, { useEffect, useState } from "react";
import ReusableReportViewer from "../ReusableReportViewer";
import { getDailySalesDetails } from "../../../functions/report";
import { formatCurrency, formatUtcToLocal } from "../../../utils/format";
import { getDrpSession } from "../../../functions/dropdowns";
import ReusableSubReportViewer from "../ReusableSubReportViewer";
import { getCurrencyInfo } from "../../../utils/utils";

const DailySalesReport = ({ refreshReport, title }) => {
  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const storeId = store.storeId;
  const utcOffset = 330;

  const [sessionId, setSessionId] = useState("");
  const [totalRows, setTotalRows] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportDataPaymentSummary, setReportDataPaymentSummary] = useState([]);
  const [reportDataOrderAndPayments, setReportDataOrderAndPayments] = useState([]);
  const [reportDataOrderAndPaymentsVoided, setReportDataOrderAndPaymentsVoided] = useState([]);

  const [reportDataSalesByCustomers, setReportDataSalesByCustomers] = useState([]);

  const tableHeaders = [
    { text: "SKU", alignment: "right", defaultAdded: true },
    { text: "Product Name", alignment: "right", defaultAdded: true },
    { text: `Unit Price(${getCurrencyInfo().symbol})`, alignment: "right", defaultAdded: true },
    { text: "Qty Sold", alignment: "right", defaultAdded: true },
    { text: `Gross Amount(${getCurrencyInfo().symbol})`, alignment: "right", defaultAdded: true },
    { text: `Discount(${getCurrencyInfo().symbol})`, alignment: "right", defaultAdded: true },
    { text: `Tax(${getCurrencyInfo().symbol})`, alignment: "right", defaultAdded: true },
    { text: `Net Amount(${getCurrencyInfo().symbol})`, alignment: "right", defaultAdded: false },
  ];

  const tableHeadersPaymentSummary = [
    { text: "Payment Method", alignment: "right", defaultAdded: true },
    { text: "Amount Paid", alignment: "right", defaultAdded: true },
    { text: "Transaction Date", alignment: "right", defaultAdded: true },
  ];

  const tableHeadersOrderAndPayments = [
    { text: "Order No", alignment: "right", defaultAdded: true },
    { text: "Total Payments", alignment: "right", defaultAdded: true },
    { text: "Payment Method", alignment: "right", defaultAdded: true },
    { text: "Amount Paid", alignment: "right", defaultAdded: true },
    { text: "Transaction Date", alignment: "right", defaultAdded: true },
  ];

  const tableHeadersOrderAndPaymentsVoided = [
    { text: "Order No", alignment: "right", defaultAdded: true },
    { text: "Total Payments", alignment: "right", defaultAdded: true },
    { text: "Payment Method", alignment: "right", defaultAdded: true },
    { text: "Amount Paid", alignment: "right", defaultAdded: true },
    { text: "Transaction Date", alignment: "right", defaultAdded: true },
  ];

  const tableHeadersSalesByCustomers = [
    { text: "Customer", alignment: "right", defaultAdded: true },
    { text: "TotalPayments", alignment: "right", defaultAdded: true },
    { text: "Amount Paid", alignment: "right", defaultAdded: true },
    { text: "Transaction Date", alignment: "right", defaultAdded: true },
  ];

  const [totalGrossAmount, setTotalGrossAmount] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [sessionsOptions, setSessionsOptions] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const loadDrpSession = async () => {
    const objArr = await getDrpSession("desc",storeId);
    setSessionsOptions(objArr.data.results[0]);
  };

  useEffect(() => {
    loadDrpSession();
  }, []);

  const tableBottom = (
    <>
      <td className=" col-span-3 border border-gray-300 px-4 py-2 text-right">
        Total:
      </td>
        <td></td>   <td></td>   <td></td>
      <td className="border border-gray-300 px-4 py-2 text-right">
        {formatCurrency(totalGrossAmount, false)}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-right">
        {formatCurrency(totalDiscountAmount, false)}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-right">
        {formatCurrency(totalTaxAmount, false)}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-right">
        {formatCurrency(totalNetAmount, false)}
      </td>
    </>
  );

  const loadReports = async () => {
    if (!sessionId) return;

    setShowReport(false);
    const res = await getDailySalesDetails(storeId, sessionId, utcOffset);
    const records = res.data.results[0];
    const paymentSummaryRecords = res.data.results[1];
    const orderAndPaymentRecords = res.data.results[2];
    const orderAndPaymentRecordsVoided = res.data.results[3];
    const salesByCustomersRecords = res.data.results[4];
    const noOfTotalRows = res.data.outputValues.totalRows;
    setTotalRows(noOfTotalRows);

    const orderedData = records.map((e) => ({
      sku: e.sku,
      productName: e.productName,
      unitPrice: formatCurrency(e.unitPrice, false),
      qtySold: `${e.qtySold} ${e.measurementUnitName}`,
      grossAmount: formatCurrency(e.grossAmount, false),
      discountAmount: formatCurrency(e.discountAmount, false),
      taxAmount: formatCurrency(e.taxAmount, false),
      netAmount: formatCurrency(e.netAmount, false),

      grossAmountn: parseFloat(e.grossAmount),
      discountAmountn: parseFloat(e.discountAmount),
      taxAmountn: parseFloat(e.taxAmount),
      netAmountn: parseFloat(e.netAmount)
    }));
    
    setReportData(orderedData);

    const grossTotal = orderedData.reduce((acc, curr) => acc + (curr.grossAmountn || 0), 0);
    const totalDiscount = orderedData.reduce((acc, curr) => acc + (curr.discountAmountn || 0), 0);
    const totalTax = orderedData.reduce((acc, curr) => acc + (curr.taxAmountn || 0), 0);
    const netTotal = orderedData.reduce((acc, curr) => acc + (curr.netAmountn || 0), 0);

    setTotalGrossAmount(grossTotal);
    setTotalDiscountAmount(totalDiscount);
    setTotalTaxAmount(totalTax);
    setTotalNetAmount(netTotal);

    //payment Summary
    const paymentSummaryOrderedData = paymentSummaryRecords.map((e) => ({
      paymentMethod: e.paymentMethod,
      amountPaid: formatCurrency(e.amountPaid, false),
      transactionDate:formatUtcToLocal(e.transactionDate),
    }));
    setReportDataPaymentSummary(paymentSummaryOrderedData)


       //Orders and payments
       const ordersAndPaymentsData = orderAndPaymentRecords.map((e) => ({
        orderNo: e.orderNo,
        totalPayments: formatCurrency(e.totalPayments, false),
        paymentMethod: e.paymentMethod,
        amountPaid: formatCurrency(e.amountPaid, false),
        transactionDate:formatUtcToLocal(e.transactionDate),
      }));
      setReportDataOrderAndPayments(ordersAndPaymentsData);
  
  
      //Orders and payments voided
  const ordersAndPaymentsDataVoided = orderAndPaymentRecordsVoided.map((e) => ({
    orderNo: e.orderNo,
    totalPayments: formatCurrency(e.totalPayments, false),
    paymentMethod: e.paymentMethod,
    amountPaid: formatCurrency(e.amountPaid, false),
    transactionDate:formatUtcToLocal(e.transactionDate),
  }));
  setReportDataOrderAndPaymentsVoided(ordersAndPaymentsDataVoided);


    //Sales by Customers
    const salesByCutomerData = salesByCustomersRecords.map((e) => ({
      customer: `${e.contactName}|${e.contactCode} `,
      totalPayments: formatCurrency(e.totalPayments, false),
      amountPaid: formatCurrency(e.amountPaid, false),
      transactionDate:formatUtcToLocal(e.transactionDate),
    }));
    setReportDataSalesByCustomers(salesByCutomerData);
  


    setShowReport(true);
  };

  // useEffect(() => {
  //   loadReports();
  // }, [storeId, sessionId, refreshReport]);


  const handleViewReport = () => {
    loadReports();
  };

  
  return (
    <div>
      <div className="flex justify-between">
{/* Session Dropdown */}
<div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Session:</label>
        <select
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled>Select a session</option>
          {sessionsOptions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.displayName}
            </option>
          ))}
        </select>
      </div>


      <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
          onClick={handleViewReport}
        >
          View Report
        </button>
      </div>
      
    {showReport &&  <ReusableReportViewer
        reportData={reportData}
        title={title}
        lblLeft={`Total Items : ${totalRows}`}
        lblRight={`Store : ${store.storeCode} | ${store.storeName}`}
        tableHeaders={tableHeaders}
        tableBottom={tableBottom}
        injectableComponents={
<>
<ReusableSubReportViewer
        reportData={reportDataPaymentSummary}
        title={"Payment Summary"}
        //lblLeft={`Total Items : ${totalRows}`}
       // lblRight={`Store : ${store.storeCode} | ${store.storeName}`}
        tableHeaders={tableHeadersPaymentSummary}
       // tableBottom={tableBottom}
        //injectableComponents
      />

<ReusableSubReportViewer
        reportData={reportDataOrderAndPayments}
        title={"Order and Payments"}
        //lblLeft={`Total Items : ${totalRows}`}
       // lblRight={`Store : ${store.storeCode} | ${store.storeName}`}
        tableHeaders={tableHeadersOrderAndPayments}
       // tableBottom={tableBottom}
        //injectableComponents
      />

      
<ReusableSubReportViewer
        reportData={reportDataOrderAndPaymentsVoided}
        title={"Order and Payments Voided"}
        //lblLeft={`Total Items : ${totalRows}`}
       // lblRight={`Store : ${store.storeCode} | ${store.storeName}`}
        tableHeaders={tableHeadersOrderAndPaymentsVoided}
       // tableBottom={tableBottom}
        //injectableComponents
      />

      <ReusableSubReportViewer
        reportData={reportDataSalesByCustomers}
        title={"Sales By Customers"}
        //lblLeft={`Total Items : ${totalRows}`}
       // lblRight={`Store : ${store.storeCode} | ${store.storeName}`}
        tableHeaders={tableHeadersSalesByCustomers}
       // tableBottom={tableBottom}
        //injectableComponents
      />
</>
        }
      />
      }
    </div>
  );
};

export default DailySalesReport;
