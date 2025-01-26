import React, { useEffect, useState } from "react";
import ReusableReportViewer from "../ReusableReportViewer";
import { getMonthlySalesDetails } from "../../../functions/report";
import { formatCurrency, formatUtcToLocal } from "../../../utils/format";
import ReusableSubReportViewer from "../ReusableSubReportViewer";

const MonthlySalesReport = ({ refreshReport, title }) => {
  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const storeId = store.storeId;

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexed
  const [totalRows, setTotalRows] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportDataPaymentSummary, setReportDataPaymentSummary] = useState([]);
  const [reportDataOrderAndPayments, setReportDataOrderAndPayments] = useState([]);
  const [reportDataOrderAndPaymentsVoided, setReportDataOrderAndPaymentsVoided] = useState([]);
  const [reportDataSalesByCustomers, setReportDataSalesByCustomers] = useState([]);

  const tableHeaders = [
    { text: "SKU", alignment: "right", defaultAdded: true },
    { text: "Product Name", alignment: "right", defaultAdded: true },
    { text: "Unit Price", alignment: "right", defaultAdded: true },
    { text: "Qty Sold", alignment: "right", defaultAdded: true },
    { text: "Gross Amount", alignment: "right", defaultAdded: true },
    { text: "Discount Amount", alignment: "right", defaultAdded: true },
    { text: "Net Amount", alignment: "right", defaultAdded: false },
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
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [sessionsOptions, setSessionsOptions] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const loadReports = async () => {
    if (!year || !month) return;

    setShowReport(false);
    const res = await getMonthlySalesDetails(storeId, year, month);
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
      netAmount: formatCurrency(e.netAmount, false),

      grossAmountn: parseFloat(e.grossAmount),
      netAmountn: parseFloat(e.netAmount),
    }));
    
    setReportData(orderedData);

    const grossTotal = orderedData.reduce((acc, curr) => acc + (curr.grossAmountn || 0), 0);
    const netTotal = orderedData.reduce((acc, curr) => acc + (curr.netAmountn || 0), 0);

    setTotalGrossAmount(grossTotal);
    setTotalNetAmount(netTotal);

    const paymentSummaryOrderedData = paymentSummaryRecords.map((e) => ({
      paymentMethod: e.paymentMethod,
      amountPaid: formatCurrency(e.amountPaid, false),
      transactionDate: formatUtcToLocal(e.transactionDate),
    }));
    setReportDataPaymentSummary(paymentSummaryOrderedData);

    const ordersAndPaymentsData = orderAndPaymentRecords.map((e) => ({
      orderNo: e.orderNo,
      totalPayments: formatCurrency(e.totalPayments, false),
      paymentMethod: e.paymentMethod,
      amountPaid: formatCurrency(e.amountPaid, false),
      transactionDate: formatUtcToLocal(e.transactionDate),
    }));
    setReportDataOrderAndPayments(ordersAndPaymentsData);

    const ordersAndPaymentsDataVoided = orderAndPaymentRecordsVoided.map((e) => ({
      orderNo: e.orderNo,
      totalPayments: formatCurrency(e.totalPayments, false),
      paymentMethod: e.paymentMethod,
      amountPaid: formatCurrency(e.amountPaid, false),
      transactionDate: formatUtcToLocal(e.transactionDate),
    }));
    setReportDataOrderAndPaymentsVoided(ordersAndPaymentsDataVoided);

    const salesByCutomerData = salesByCustomersRecords.map((e) => ({
      customer: `${e.contactName}|${e.contactCode} `,
      totalPayments: formatCurrency(e.totalPayments, false),
      amountPaid: formatCurrency(e.amountPaid, false),
      transactionDate: formatUtcToLocal(e.transactionDate),
    }));
    setReportDataSalesByCustomers(salesByCutomerData);

    setShowReport(true);
  };

  const handleViewReport = () => {
    loadReports();
  };

  return (
    <div>
      <div className="flex justify-between">
        {/* Year Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Year:</label>
          <select
  value={year}
  onChange={(e) => setYear(e.target.value)}
  className="select select-bordered w-full max-w-xs"
>
  <option value="" disabled>Select Year</option>
  {Array.from({ length: new Date().getFullYear() - 2019 }, (_, index) => 2020 + index).map((y) => (
    <option key={y} value={y}>
      {y}
    </option>
  ))}
</select>


        </div>

        {/* Month Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="" disabled>Select Month</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* View Report Button */}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
          onClick={handleViewReport}
        >
          View Report
        </button>
      </div>

      {showReport && (
        <ReusableReportViewer
          reportData={reportData}
          title={title}
          lblLeft={`Total Items : ${totalRows}`}
          lblRight={`Store : ${store.storeCode} | ${store.storeName}`}
          tableHeaders={tableHeaders}
          tableBottom={
            <tr className="bg-gray-200 font-bold">
              <td colSpan={tableHeaders.length - 1} className="border border-gray-300 px-4 py-2 text-right">
                Total:
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {formatCurrency(totalGrossAmount, true)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {formatCurrency(totalNetAmount, true)}
              </td>
            </tr>
          }
          injectableComponents={
            <>
              <ReusableSubReportViewer
                reportData={reportDataPaymentSummary}
                title={"Payment Summary"}
                tableHeaders={tableHeadersPaymentSummary}
              />
              <ReusableSubReportViewer
                reportData={reportDataOrderAndPayments}
                title={"Order and Payments"}
                tableHeaders={tableHeadersOrderAndPayments}
              />
              <ReusableSubReportViewer
                reportData={reportDataOrderAndPaymentsVoided}
                title={"Order and Payments Voided"}
                tableHeaders={tableHeadersOrderAndPaymentsVoided}
              />
              <ReusableSubReportViewer
                reportData={reportDataSalesByCustomers}
                title={"Sales By Customers"}
                tableHeaders={tableHeadersSalesByCustomers}
              />
            </>
          }
        />
      )}
    </div>
  );
};

export default MonthlySalesReport;
