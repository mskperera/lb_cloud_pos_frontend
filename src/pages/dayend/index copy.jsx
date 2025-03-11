import React from "react";
import { useNavigate } from "react-router-dom";
import helpIcon from "../../assets/images/help.png";

const BoldDetail = ({ label, value }) => (
  <div className="mb-4 p-4 flex justify-between border-b border-gray-200">
    <span className="font-semibold text-gray-800">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

const NormalDetail = ({ label, value }) => (
  <div className="mb-4 p-4 flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
);

const CashDenomination = ({ label, value }) => (
  <div className="mb-4 p-2 flex flex-col items-center">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <input
      className="w-24 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="number"
      value={value}
    />
  </div>
);

const DayEnd = () => {
  const navigate = useNavigate();

  const cashDenominations = [
    { label: "Rs 1", value: "10" },
    { label: "Rs 2", value: "5" },
    { label: "Rs 5", value: "25" },
    { label: "Rs 10", value: "10" },
    { label: "Rs 20", value: "10" },
    { label: "Rs 50", value: "50" },
    { label: "Rs 100", value: "50" },
    { label: "Rs 500", value: "50" },
    { label: "Rs 1000", value: "50" },
    { label: "Rs 5000", value: "50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Day Ending</h2>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* Transactions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h3>
            <BoldDetail label="Transactions" value="0.00" />
            <BoldDetail label="Voided Transactions" value="0.00" />
            <BoldDetail label="Return Transactions" value="0.00" />
            <BoldDetail label="Average Transaction Value (ATV)" value="0.00" />
            <BoldDetail label="Number Of Customers" value="0.00" />
            <NormalDetail label="Product Sales" value="0.00" />
            <NormalDetail label="Service Fees" value="0.00" />
            <BoldDetail label="Total Sales" value="0.00" />
          </div>

          {/* Cash Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Summary</h3>
            <BoldDetail label="Net Cash Sales" value="0.00" />
            <BoldDetail label="Opening Amount" value="0.00" />
            <BoldDetail label="Cash Additions / Drops" value="0.00" />
            <BoldDetail label="Cash Removals / Pickups" value="0.00" />
            <BoldDetail label="Expected Cash" value="0.00" />
            <BoldDetail label="Actual Cash" value="0.00" />
            <BoldDetail label="Short/Over" value="0.00" />
          </div>

          {/* Cash Denomination */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Denomination</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cashDenominations.map((c, idx) => (
                <CashDenomination key={idx} label={c.label} value={c.value} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end">
          <button
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
            onClick={() => console.log("Day Finished")}
          >
            Finish Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayEnd;
