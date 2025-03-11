import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import './Reportm.css'

const Reportm = () => {
  const printRef = useRef();

  // Dummy data
 // Dummy data
 const reportData = [
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },

  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
  { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
  { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
  { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
  { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
  { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 },
];


  const handlePrint = useReactToPrint({
    content: () => {
      return printRef.current;
    },
    documentTitle: "Industrial_Report",
    pageStyle: `
      @page {
        margin: 20mm;
      }
      .page-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        padding: 10px 0;
      }
    `
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Industrial Report Viewer</h1>

      {/* Print Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handlePrint}
        >
          Print Report
        </button>
      </div>

      {/* Report Table */}
      <div ref={printRef} className="bg-white rounded-lg p-6">
        <div className="flex justify-between">
          <div>lbl left</div>
        <h2 className="text-xl font-semibold mb-4 text-center">Sales Report</h2>
        <div>lbl right</div>
        </div>
       
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Price (USD)</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((data, index) => (
              <tr key={data.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{data.item}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{data.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{data.price.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{data.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right">
          <p className="font-bold">Grand Total: USD {reportData.reduce((sum, row) => sum + row.total, 0).toLocaleString()}</p>
        </div>

        {/* Page Footer */}
        <div className="page-footer">
          <p>Page <span className="page-number"></span></p>
        </div>
      </div>
    </div>
  );
};

export default Reportm;
