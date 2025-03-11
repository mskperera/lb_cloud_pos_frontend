import React from "react";
import { Bar } from "react-chartjs-2";

const PaymentBreakdown = () => {
  // Payment breakdown data
  const paymentData = [
    { method: "Credit Card", transactions: 120, amount: 4500 },
    { method: "PayPal", transactions: 80, amount: 3200 },
    { method: "Bank Transfer", transactions: 50, amount: 2500 },
    { method: "Cash", transactions: 40, amount: 2000 },
  ];


  return (

     <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl mb-4">
        Payment Method Breakdown
      </h3>
      <table className="w-full text-sm text-left text-gray-500 bg-white border-collapse border border-gray-200">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3 border border-gray-200">Payment Method</th>
              <th className="px-6 py-3 border border-gray-200">Transactions</th>
              <th className="px-6 py-3 border border-gray-200">Total Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment, index) => (
              <tr
                key={index}
                className={`border border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4">{payment.method}</td>
                <td className="px-6 py-4 text-center">{payment.transactions}</td>
                <td className="px-6 py-4 text-right">${payment.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>

  );
};

export default PaymentBreakdown;
