import React, { useEffect, useState } from "react";
import moment from "moment";
import { getStockEntryFull } from "../../functions/stockEntry";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
//import "daisyui/dist/full.css"; // Import daisyUI styles
import { formatCurrency, formatUtcToLocal } from "../../utils/format";

const StockEntryFull = () => {
  let location = useLocation();
  let searchParams = new URLSearchParams(location.search);
  let stockEntryId = searchParams.get("stockEntryId");

  const [stockEntryHeader, setStockEntryHeader] = useState(null);
  const [stockEntryDetails, setStockEntryDetails] = useState([]);

  useEffect(() => {
    loadstockEntry();
    console.log("stockEntryId", stockEntryId);
  }, [stockEntryId]);

  const loadstockEntry = async () => {
    const result = await getStockEntryFull(stockEntryId);
    const header = result.data.results[0][0];
    setStockEntryHeader(header);

    const details = result.data.results[1];
    setStockEntryDetails(details);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Adding the header of the document (Stock Entry)
    if (stockEntryHeader) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold"); // Bold font for the title
      doc.text("Stock Entry", 20, 20);
  
      doc.setFont("helvetica", "normal"); // Set normal font for the details
      doc.setFontSize(10);
  
      // Column 1 (left side)
      const labelX = 20;
      const valueX = 60; // Adjusted value for better spacing
  
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black color for labels
      doc.text("GRN No:", labelX, 30);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Light gray color for values
      doc.text(stockEntryHeader.stockEntryRefNo, valueX, 30);
  
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black color for labels
      doc.text("Stock Received Date:", labelX, 40);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Light gray color for values
      doc.text(formatUtcToLocal(stockEntryHeader.stockReceivedDate, true), valueX, 40);
  
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black color for labels
      doc.text("Created Date:", labelX, 50);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Light gray color for values
      doc.text(formatUtcToLocal(stockEntryHeader.CreatedDate_UTC), valueX, 50);
  
      // Column 2 (right side)
      const rightLabelX = 120;
      const rightValueX = 170; // Adjusted value for better spacing
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black color for labels
      doc.text("Supplier Name:", rightLabelX, 30);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Light gray color for values
      doc.text(stockEntryHeader.supplierName, rightValueX, 30);
  
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black color for labels
      doc.text("User:", rightLabelX, 40);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Light gray color for values
      doc.text(stockEntryHeader.displayName, rightValueX, 40);
    }
  
    // Adding a table for Stock Entry Details
    let lastYPosition = 60; // Start position for the table (adjusted to leave space for header)
  
    if (stockEntryDetails.length > 0) {
      const tableData = stockEntryDetails.map((detail) => [
        detail.batchNo,
        detail.productName,
        detail.sku,
        `${detail.qtyAdded} ${detail.measurementUnitName}`,
        detail.unitCost,
        detail.unitPrice,
        (detail.qtyAdded * detail.unitCost).toFixed(2), // Total (qty * unitCost)
      ]);
  
      doc.autoTable({
        startY: lastYPosition, // Start position for the table
        head: [
          ['Batch No','Product Name', 'SKU',  'Qty Added', 'Unit Cost', 'Unit Price', 'Total Cost'],
        ],
        body: tableData,
        headStyles: {
          fillColor: [107, 114, 128], // Equivalent to text-gray-500
          textColor: [255, 255, 255], // White text color
        },
        theme: 'grid',
        styles: { fontSize: 10 },
        didDrawPage: function (data) {
          lastYPosition = data.cursor.y; // Update the last Y position after table
        },
      });
    }
  
    // Adding Total label next to the last row of the table, aligned to the right
    if (stockEntryHeader) {
      const totalText = `Total: ${formatCurrency(stockEntryHeader.total)}`;
      const pageWidth = doc.internal.pageSize.width; // Get the width of the page
      const totalTextWidth = doc.getTextWidth(totalText); // Calculate the width of the "Total" text
      const margin = 20; // Right margin to ensure some space from the page edge
  
      // Align the "Total" text to the right, just below the last row of the table
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0); // Black color for "Total"
      doc.text(totalText, pageWidth - totalTextWidth - margin, lastYPosition + 10); // Positioning just below the table
    }
  
    // Save the PDF
    doc.save("stock-entry.pdf");
  };
  
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Stock Entry Header */}
      <div className="p-6 bg-white">
        {stockEntryHeader && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 px-6">Stock Entry</h2>
            <div className="grid grid-cols-3 gap-4 mt-4 px-6">
              <div>
                <span className="text-sm font-medium text-gray-500">Stock Entry ID:</span>
                <p className="text-gray-800">{stockEntryHeader.stockEntryId}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Stock Received Date:</span>
                <p className="text-gray-800">
                  { formatUtcToLocal(stockEntryHeader.stockReceivedDate,true)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">User :</span>
                <p className="text-gray-800">{stockEntryHeader.displayName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">GRN No:</span>
                <p className="text-gray-800">{stockEntryHeader.stockEntryRefNo}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Supplier Name:</span>
                <p className="text-gray-800">{stockEntryHeader.supplierName}</p>
              </div>
           
              <div>
                <span className="text-sm font-medium text-gray-500">Created Date:</span>
                <p className="text-gray-800">
                  {formatUtcToLocal(stockEntryHeader.CreatedDate_UTC)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Entry Details */}
        {stockEntryDetails.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <table className="table-auto w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-left">
                <th className="border border-gray-300 p-2">Batch No</th>
                  <th className="border border-gray-300 p-2">Product Name</th>
                  <th className="border border-gray-300 p-2">SKU</th>
                  <th className="px-4 py-2"> Expiration Date</th>
                  <th className="border border-gray-300 p-2">Qty Added</th>
                  <th className="border border-gray-300 p-2">Unit Cost</th>
                  <th className="border border-gray-300 p-2">Unit Price</th>
                  <th className="border border-gray-300 p-2">Total Cost</th> {/* Added Total column */}
                </tr>
              </thead>
              <tbody>
                {stockEntryDetails.map((detail) => (
                  <tr key={detail.stockEntryDetailsId} className="text-gray-700">
                                      <td className="border border-gray-300 p-2">{detail.batchNo}</td>
                    <td className="border border-gray-300 p-2">{detail.productName}</td>
                    <td className="border border-gray-300 p-2">{detail.sku}</td>
                    <td className="border border-gray-300 p-2">
                   {detail.expirationDate && formatUtcToLocal(detail.expirationDate,true)}
                      </td>
                    <td className="border border-gray-300 p-2">{detail.qtyAdded} {detail.measurementUnitName}</td>
                    <td className="border border-gray-300 p-2">{detail.unitCost}</td>
                    <td className="border border-gray-300 p-2">{detail.unitPrice}</td>
                    <td className="border border-gray-300 p-2">{(detail.qtyAdded * detail.unitCost).toFixed(2)}</td> {/* Total column calculation */}
                  </tr>
                ))}
                  <tr className="text-gray-700">
                  <td className="border border-gray-300 p-2" colSpan="6"></td>
                    <td className="border border-gray-300 p-2">
                <span className="text-lg font-bold text-gray-500">Total:</span></td>
              <td className="border border-gray-300 p-2">
              <span className="text-lg font-bold text-gray-500">{formatCurrency(stockEntryHeader.total)}</span></td>

                  </tr>
              </tbody>
            </table>
              
          </div>
        )}
        {/* Button to export to PDF */}
        <div className="mt-6">
          <button
            onClick={exportToPDF}
            className="btn btn-primary"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockEntryFull;
