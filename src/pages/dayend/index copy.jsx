

import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import './dayend.css';
import helpIcon from '../../assets/images/help.png'

const BoldDetail = ({ label, value }) => (
  <div className="mb-2 p-2 ">
    <div className="flex flex-row align-items-center justify-content-between">
      <span className="font-bold"> {label}</span>
      <span className="font-bold">{value}</span>
    </div>
  </div>
);

const NormalDetail = ({ label, value }) => (
  <div className="mb-2 p-2">
    <div className="flex flex-row align-items-center justify-content-between">
      <span className="font-normal">{label}</span>
      <span>{value}</span>
    </div>
  </div>
);


const DetailCard = ({ label, value,bgColor }) => (
  <div className={`detail-card ${bgColor}`}>
    <div className="flex flex-row align-items-center justify-content-between">
      <span className="font-bold">{label}</span>
      <span>{value}</span>
    </div>
  </div>
);

const CashDenomination = ({ label, value }) => (
  <div className={`cash-denomination-input`}>
    <p className="label">{label}</p>
    <input className="box" type="number" value={value} />
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

  const cashDenominations =  [
      { label: "Rs 1", quantity: "10" },
      { label: "Rs 2", quantity: "5" },
      { label: "Rs 5", quantity: "25" },
      { label: "Rs 10", quantity: "10" },
      { label: "Rs 20", quantity: "10" },
      { label: "Rs 50", quantity: "50" },
      { label: "Rs 100", quantity: "50" },
      { label: "Rs 500", quantity: "50" },
      { label: "Rs 1000", quantity: "50" },
      { label: "Rs 5000", quantity: "50" }

  ];


  return (
    <div className="dayend-container">
      <div className="title">
        <h2>Day Ending</h2>
      </div>
      <div className="dayend-details">
        <div className="transactions">
          <BoldDetail label="Transactions" value="0.00" />
          <BoldDetail label="Voided Transactions" value="0.00" />
          <BoldDetail label="Return Transactions" value="0.00" />
          <BoldDetail label="Average Transaction Value (ATV)" value="0.00" />
          <BoldDetail label="Number Of Customers" value="0.00" />

          <br />
          <NormalDetail label="Product Sales" value="0.00" />
          <NormalDetail label="Service Fees" value="0.00" />
          <BoldDetail label="Total Sales" value="0.00" />

          <br />
          <NormalDetail label="Discounts" value="0.00" />
          <NormalDetail label="Returns" value="0.00" />
          <NormalDetail label="Refunds" value="0.00" />
          <NormalDetail label="Total Tax:" value="0.00" />
          <NormalDetail label="Discounts" value="0.00" />
          <BoldDetail label="Net Sales" value="0.00" />

          <br />
          <BoldDetail label="Net Cash Sales" value="0.00" />
          <BoldDetail label="Net Card Sales" value="0.00" />
        </div>

        <div className="cash">
         
          <div className="cash-summary">
            <BoldDetail label="Net Cash Sales" value="0.00" />
            <BoldDetail label="Opening Amount" value="0.00" />
            <BoldDetail label="Cash Additions / Drops" value="0.00" />
            <BoldDetail label="Cash Removels / Pickups" value="0.00" />

            <BoldDetail label="Expected Cash" value="0.00" />
            <BoldDetail label="Actual cash" value="0.00" />
            <BoldDetail label="Short/Over" value="0.00" />
          </div>

          <div className="cash-denomination-container">
            {cashDenominations.map((c) => (
              <CashDenomination label={c.label} value={c.value} />
            ))}
          </div>

       
    
  
     

        </div>
   
  
      </div>
      <div className="dayend-button-container">
        <button className="button button-xl primary round-2 dayend">Finish Day</button>
   
        </div>
    </div>
  );
};

export default DayEnd;
