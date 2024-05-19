// import { useState } from "react";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";



// const DayendDetail = ({ label, value }) => (
//   <div className="mb-2 p-2 pl-4 pr-4 card">
//     <div className="flex flex-row align-items-center justify-content-between">
//       <span className="font-bold">{label}</span>
//       <span>{value}</span>
//     </div>
//   </div>
// );

// const CashDenominationDetail = ({ label, quantity }) => (
//   <div className="mb-2 p-2 pl-4 pr-4 card">
//     <div className="flex flex-row align-items-center justify-content-between">
//       <span>{label}</span>
//       <span>{quantity}</span>
//     </div>
//   </div>
// );

// const DayEnd = () => {
//   const navigate = useNavigate();

//   const reportDetails = {
//     totalSales: "$5,200",
//     cashSales: "$2,000",
//     creditCardSales: "$2,700",
//     digitalWalletPayments: "$500",
//     returnsAndRefunds: "-$100",
//     discountsAndPromotions: "-$150",
//     totalNonCashPayments: "$3,200",
//     totalTaxCollected: "$400",
//     totalReceiptsIssued: "150",
//     openingStock: "500 units",
//     closingStock: "420 units",
//     soldUnits: "80 units",
//     pettyCashExpenses: "$50",
//     officeSupplies: "$30",
//     cleaningSupplies: "$20",
//     supplierPayment: "$1,000",
//     cashOverUnder: "+$50",
//     morningShift: "John Doe (8 am - 4 pm)",
//     eveningShift: "Jane Smith (12 pm - 8 pm)"
//   };

//   const cashDenominations = {
//     totalCashInDrawer: "$2,050",
//     breakdown: [
//       { label: "$100 bills", quantity: "10" },
//       { label: "$50 bills", quantity: "5" },
//       { label: "$20 bills", quantity: "25" },
//       { label: "$10 bills", quantity: "10" },
//       { label: "$5 bills", quantity: "10" },
//       { label: "$1 bills", quantity: "50" },
//       { label: "Coins", quantity: "$50" }
//     ],
//     nonCashPayments: {
//       totalNonCashPayments: "$3,200",
//       creditDebitCards: "$2,700",
//       digitalWallets: "$500"
//     }
//   };

//   return (
//     <div className="grid pl-5">
//       {/* Sales Summary */}
//       <div className="col-6">
//         <h3>Sales Summary</h3>
//         <DayendDetail label="Total Sales" value={reportDetails.totalSales} />
//         <DayendDetail label="Cash Sales" value={reportDetails.cashSales} />
//         <DayendDetail label="Credit Card Sales" value={reportDetails.creditCardSales} />
//         {/* ... other sales details ... */}
//       </div>

//       {/* Inventory Movement */}
//       <div className="col-6">
//         <h3>Inventory Movement</h3>
//         <DayendDetail label="Opening Stock" value={reportDetails.openingStock} />
//         <DayendDetail label="Closing Stock" value={reportDetails.closingStock} />
//         {/* ... other inventory details ... */}
//       </div>

//       {/* Expenses and Payouts */}
//       <div className="col-6">
//         <h3>Expenses and Payouts</h3>
//         <DayendDetail label="Petty Cash Expenses" value={reportDetails.pettyCashExpenses} />
//         {/* ... other expenses details ... */}
//       </div>

//       {/* Employee Shift Details */}
//       <div className="col-6">
//         <h3>Employee Shift Details</h3>
//         <DayendDetail label="Morning Shift" value={reportDetails.morningShift} />
//         {/* ... other shift details ... */}
//       </div>

//       {/* Cash in Drawer */}
//       <div className="col-6">
//         <h3>Total Cash in Drawer</h3>
//         <DayendDetail label="Total Cash in Drawer" value={cashDenominations.totalCashInDrawer} />
//         {cashDenominations.breakdown.map((denomination, index) => (
//           <CashDenominationDetail key={index} label={denomination.label} quantity={denomination.quantity} />
//         ))}
//       </div>

//       {/* Non-Cash Payments */}
//       <div className="col-6">
//         <h3>Non-Cash Payments</h3>
//         <DayendDetail label="Total Non-Cash Payments" value={cashDenominations.nonCashPayments.totalNonCashPayments} />
//         <DayendDetail label="Credit/Debit Cards" value={cashDenominations.nonCashPayments.creditDebitCards} />
//         <DayendDetail label="Digital Wallets" value={cashDenominations.nonCashPayments.digitalWallets} />
//       </div>

//       {/* Finish Day Button */}
//       <div className="col-12 flex justify-content-center">
//         <Button
//           className="p-3"
//           aria-label="Finish Day"
//           severity="primary"
//           onClick={() => {}}
//           style={{ width: "100%", display: "block" }}
//           size="large"
//           rounded
//         >
//           <span className="px-2">Finish Day</span>
//         </Button>
//       </div>
//     </div>
//   );
// };


// export default DayEnd;

import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const DayendDetail = ({ label, value }) => (
  <div className="mb-2 p-2 pl-4 pr-4 card">
    <div className="flex flex-row align-items-center justify-content-between">
      <span className="font-bold">{label}</span>
      <span>{value}</span>
    </div>
  </div>
);

const CashDenominationDetail = ({ label, quantity }) => (
  <div className="mb-2 p-2 pl-4 pr-4 card">
    <div className="flex flex-row align-items-center justify-content-between">
      <span>{label}</span>
      <span>{quantity}</span>
    </div>
  </div>
);

const DayEnd = () => {
  const navigate = useNavigate();

  const reportDetails = {
    totalSales: "$5,200",
    cashSales: "$2,000",
    creditCardSales: "$2,700",
    digitalWalletPayments: "$500",
    returnsAndRefunds: "-$100",
    discountsAndPromotions: "-$150",
    totalNonCashPayments: "$3,200",
    totalTaxCollected: "$400",
    totalReceiptsIssued: "150",
    openingStock: "500 units",
    closingStock: "420 units",
    soldUnits: "80 units",
    pettyCashExpenses: "$50",
    officeSupplies: "$30",
    cleaningSupplies: "$20",
    supplierPayment: "$1,000",
    cashOverUnder: "+$50",
    morningShift: "John Doe (8 am - 4 pm)",
    eveningShift: "Jane Smith (12 pm - 8 pm)",
  };

  const cashDenominations = {
    totalCashInDrawer: "$2,050",
    breakdown: [
      { label: "$100 bills", quantity: "10" },
      { label: "$50 bills", quantity: "5" },
      { label: "$20 bills", quantity: "25" },
      { label: "$10 bills", quantity: "10" },
      { label: "$5 bills", quantity: "10" },
      { label: "$1 bills", quantity: "50" },
      { label: "Coins", quantity: "$50" },
    ],
    nonCashPayments: {
      totalNonCashPayments: "$3,200",
      creditDebitCards: "$2,700",
      digitalWallets: "$500",
    },
  };

  const incidentsAndNotes = [
    "Credit card machine malfunctioned for 30 minutes.",
    "Customer complaint regarding a defective product, resolved with a refund.",
  ];

  return (
    <div className="grid pl-5">
         <div className="col-6">
        <h2>Day-End Report for XYZ Retail Store</h2>
        </div>
        <div className="col-6">
        <h3>Date: March 15, 2023</h3>
        </div>
      {/* Sales Summary */}
      <div className="col-6">
  <h3>Sales Summary</h3>
  <DayendDetail label="Total Sales" value={reportDetails.totalSales} style={{ backgroundColor: "#f0f0f0", padding: "8px" }} />
  <div className="ml-4"> {/* Adding tab space */}
    <DayendDetail label="Cash Sales" value={reportDetails.cashSales} style={{ marginLeft: "16px" }} />
    <DayendDetail label="Credit Card Sales" value={reportDetails.creditCardSales} style={{ marginLeft: "16px" }} />
  </div>
  <DayendDetail label="Digital Wallet Payments" value={reportDetails.digitalWalletPayments} />
  <DayendDetail label="Returns and Refunds" value={reportDetails.returnsAndRefunds} />
  <DayendDetail label="Discounts and Promotions" value={reportDetails.discountsAndPromotions} />
</div>


      {/* Inventory Movement */}
      <div className="col-6">
        <h3>Inventory Movement</h3>
        <DayendDetail label="Opening Stock" value={reportDetails.openingStock} />
        <DayendDetail label="Closing Stock" value={reportDetails.closingStock} />
        <DayendDetail label="Sold" value={reportDetails.soldUnits} />
      </div>

      {/* Expenses and Payouts */}
      <div className="col-6">
        <h3>Expenses and Payouts</h3>
        <DayendDetail label="Petty Cash Expenses" value={reportDetails.pettyCashExpenses} />
        <div className="ml-4"> {/* Adding tab space */}
        <DayendDetail label="Office Supplies" value={reportDetails.officeSupplies} />
        <DayendDetail label="Cleaning Supplies" value={reportDetails.cleaningSupplies} />
        </div>
        <DayendDetail label="Supplier Payment" value={reportDetails.supplierPayment} />
      </div>

      {/* Employee Shift Details */}
      <div className="col-6">
        <h3>Employee Shift Details</h3>
        <DayendDetail label="Morning Shift" value={reportDetails.morningShift} />
        <DayendDetail label="Evening Shift" value={reportDetails.eveningShift} />
      </div>

      {/* Cash in Drawer */}
      <div className="col-6">
        <h3>Total Cash in Drawer</h3>
        <DayendDetail label="Total Cash in Drawer" value={cashDenominations.totalCashInDrawer} />
        {cashDenominations.breakdown.map((denomination, index) => (
          <CashDenominationDetail key={index} label={denomination.label} quantity={denomination.quantity} />
        ))}
      </div>

      {/* Non-Cash Payments */}
      <div className="col-6">
        <h3>Non-Cash Payments</h3>
        <DayendDetail label="Total Non-Cash Payments" value={cashDenominations.nonCashPayments.totalNonCashPayments} />
        <div className="ml-4"> {/* Adding tab space */}
        <DayendDetail label="Credit/Debit Cards" value={cashDenominations.nonCashPayments.creditDebitCards} />
        <DayendDetail label="Digital Wallets" value={cashDenominations.nonCashPayments.digitalWallets} />
        </div>
      </div>

{/* Cash Drawer Reconciliation */}
<div className="col-6">
  <h3>Cash Drawer Reconciliation</h3>
  <DayendDetail label="Expected Cash Amount" value="$2,000" />
  <DayendDetail label="Actual Cash Count" value="$2,050" />
  <DayendDetail label="Over/Under" value="+$50" style={{ backgroundColor: "#f0f0f0", padding: "8px" }} />
</div>

      {/* Z-Out Register Report */}
<div className="col-6">
  <h3>Z-Out Register Report</h3>
  <DayendDetail label="Total Sales (from POS)" value="$5,200" style={{ backgroundColor: "#f0f0f0", padding: "8px" }} />
  <DayendDetail label="Total Tax Collected" value="$400" style={{ marginLeft: "16px" }} />
  <DayendDetail label="Total Receipts Issued" value="150" style={{ marginLeft: "16px" }} />
</div>


      {/* Incidents and Notes */}
      <div className="col-6">
        <h3>Incidents or Notes</h3>
        <ul>
          {incidentsAndNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
{/* Signature/Verification */}
<div className="col-6">
  <h3>Signature/Verification</h3>
  <DayendDetail label="Prepared by" value="John Doe" />
  <DayendDetail label="Verified by (Manager)" value="Jane Smith" />
  <DayendDetail label="Date" value="March 15, 2023" />
</div>

      {/* Finish Day Button */}
      <div className="col-12 flex justify-content-center">
        <Button
          className="p-3"
          aria-label="Finish Day"
          severity="primary"
          onClick={() => {}}
          style={{ width: "100%", display: "block" }}
          size="large"
          rounded
        >
          <span className="px-2">Finish Day</span>
        </Button>
      </div>
    </div>
  );
};

export default DayEnd;
