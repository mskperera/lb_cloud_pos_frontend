import React from 'react';

const DayEndReportPreview = () => {
  const receiptData = {
    // ... (previous receipt data)

    numberOfTransactions: 1000.00,
    numberOfSoldItems: 1000.00,
    numberOfReturnedItems: 1000.00,
    totalSold: 1000.00,
    totalCustomers: 1000.00,
    cashSales: 1000.00,
    cardSales: 1000.00,
    totalRefunds: 1000.00,
    totalDiscount: 1000.00,
    totalTax: 1000.00,
    grossSales: 1000.00,
    netSales: 1000.00,
    averageTransactionValue: 1000.00,
  };

  const receiptStyle = {
    // ... (previous styles)
  };

  const itemStyle = {
    // ... (previous styles)
  };

  return (
    <div style={receiptStyle}>
      <h2 style={{ textAlign: 'center' }}>Day-End Report</h2>
      {/* ... (previous receipt content) */}
      <hr />

      <div>
        <p>Number of Transactions: {receiptData.numberOfTransactions}</p>
        <p>No of Sold Items: {receiptData.numberOfSoldItems}</p>
        <p>No of Returned Items: {receiptData.numberOfReturnedItems}</p>
        <p>Total Sold: {receiptData.totalSold}</p>
        <p>Total Customers: {receiptData.totalCustomers}</p>
        <p>Cash Sales: {receiptData.cashSales}</p>
        <p>Card Sales: {receiptData.cardSales}</p>
        <p>Total Refunds: {receiptData.totalRefunds}</p>
        <p>Total Discount: {receiptData.totalDiscount}</p>
        <p>Total Tax: {receiptData.totalTax}</p>
        <p>Gross Sales: {receiptData.grossSales}</p>
        <p>Net Sales: {receiptData.netSales}</p>
        <p>Average Transaction Value (ATV): {receiptData.averageTransactionValue}</p>
      </div>
    </div>
  );
};

export default DayEndReportPreview;
