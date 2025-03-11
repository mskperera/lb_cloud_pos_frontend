import React, { useEffect, useState } from "react";
import ReusableReportViewer from "../ReusableReportViewer";
import { getInventoryStockLevel, getProducts } from "../../../functions/report";
import { formatCurrency, formatUtcToLocal } from "../../../utils/format";

const InventoryStockLevelReport = ({ refreshReport, title }) => {
  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const storeId = store.storeId;

  const [totalRows, setTotalRows] = useState("");
  const [reportData, setReportData] = useState([
    // { id: 1, item: "Industrial Gear", quantity: 20, price: 500, total: 10000 },
    // { id: 2, item: "Hydraulic Pump", quantity: 15, price: 1200, total: 18000 },
    // { id: 3, item: "Conveyor Belt", quantity: 10, price: 800, total: 8000 },
    // { id: 4, item: "Welding Machine", quantity: 5, price: 2500, total: 12500 },
    // { id: 5, item: "Air Compressor", quantity: 8, price: 2000, total: 16000 }
  ]);

  const [showReport, setShowReport] = useState(false);

  const tableHeaders = [
    { text: "SKU", alignment: "right", defaultAdded: true },
    // {text:"Barcode",alignment:"right",defaultAdded:true},
    { text: "Product Name", alignment: "right", defaultAdded: true },
    // {text:"Brand",alignment:"right",defaultAdded:true},
    { text: "Stock Qty", alignment: "right", defaultAdded: true },

    // {text:"Unit Cost",alignment:"right",defaultAdded:true} ,
    // {text:"Total Cost",alignment:"right",defaultAdded:true},
    { text: "Unit Price", alignment: "right", defaultAdded: true },
    { text: "Total Price", alignment: "right", defaultAdded: true },
    { text: "Last Stock", alignment: "right", defaultAdded: false },
    //  {text:"Stock Status",alignment:"right",defaultAdded:false},
    { text: "Reorder Level", alignment: "right", defaultAdded: true },
  ];

  const grandTotal = 2500;
  const tableBottom = (
    <tr className="bg-gray-200 font-bold">
      <td
        colSpan={tableHeaders.length - 1}
        className="border border-gray-300 px-4 py-2 text-right"
      >
        Grand Total:
      </td>
      <td className={`border border-gray-300 px-4 py-2 text-right`}>
        USD {grandTotal.toLocaleString()}
      </td>
    </tr>
  );

  const loadReports = async () => {
    setShowReport(false);
    const res = await getInventoryStockLevel(storeId);
    const records = res.data.results[0];
    const noOfTotalRows = res.data.outputValues.totalRows;
    setTotalRows(noOfTotalRows);
    const orderdData = [];
    records.forEach((e) => {
      orderdData.push({
        sku: e.sku,
        //barcode:e.barcode,
        productName: e.productName,
        // brandName:e.brandName,
        stockQty: `${e.stockQty} ${e.measurementUnitName}`,

        //measurementUnitName:e.measurementUnitName,
        //productTypeName:e.productTypeName,
        // unitCost:e.unitCost,
        // totalCostValue: e.totalCostValue,

        unitPrice: formatCurrency(e.unitPrice, false),
        totalPriceValue: formatCurrency(e.totalPriceValue, false),

        lastRestocked: formatUtcToLocal(e.lastRestocked),
        reorderLevel: e.reorderLevel,
        // stockStatus:e.stockQty>e.reorderLevel ? "In Stock":"Low Stock"
      });
    });

    setReportData(orderdData);
    console.log("productsRes report", records);
    console.log("noOfTotalRows report", noOfTotalRows);
    setShowReport(true);
  };

  const handleViewReport = () => {
    loadReports();
  };

  return (
    <div>
      <div className="flex justify-end">
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
          // tableBottom={tableBottom}
          //  injectableComponents={[<div>jfd</div>]}
        />
      )}
    </div>
  );
};

export default InventoryStockLevelReport;
