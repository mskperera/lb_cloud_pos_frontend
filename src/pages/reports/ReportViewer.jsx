import React, { useState } from "react";
import MonthlySalesReport from "./views/MonthlySalesReport";
import SalesByProductReport from "./views/SalesByProductReport";
import ProductsReport from "./views/ProductsReport";
import InventoryStockLevelReport from "./views/InventoryStockLevelReport";
import InventoryMovementReport from "./views/InventoryMovementReport";
import InventoryValuationReport from "./views/InventoryValuationReport";
import ProfitAndLossReport from "./views/ProfitAndLossReport";
import Reportm from "./Reportm";
import DailySalesReport from "./views/DailySalesReport";

function ReportViewer() {
  const [refreshReport, setRefreshReport] = useState(false);

  const reports = [
    { name: "Daily Sales Report", description: "This report provides daily sales data, including total sales, product sales, and other metrics.", component: DailySalesReport },
    { name: "Monthly Sales Report", description: "This report gives a detailed view of sales for the month, with comparisons and trends.", component: MonthlySalesReport },
    { name: "Sales by Product Report", description: "This report breaks down sales data by product, showing quantities sold and revenue for each product.", component: SalesByProductReport },
    { name: "Products Report", description: "Provides insights on the current product inventory, including stock levels and product performance.", component: ProductsReport },
    { name: "Inventory Stock Level Report", description: "This report shows the current stock levels of all products in the inventory.", component: InventoryStockLevelReport },
    { name: "Inventory Movement Report", description: "Shows how inventory has moved over a specific period, including stock added and removed.", component: InventoryMovementReport },
    { name: "Inventory Valuation Report", description: "This report gives the valuation of the current inventory, based on various costing methods.", component: InventoryValuationReport },
    { name: "Profit and Loss Report", description: "Provides an overview of company financials, showing profits and losses for a specified period.", component: ProfitAndLossReport },
  ];

  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [isReportVisible, setIsReportVisible] = useState(false);

  const handleReportSelection = (event) => {
    const selected = reports.find((report) => report.name === event.target.value);
    setSelectedReport(selected);
    if(selected){
      setIsReportVisible(true);
    }
 
  else{
    setIsReportVisible(false);
  }
  };

  const SelectedReportComponent = selectedReport.component;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* <h1 className="text-3xl font-semibold text-center mb-6">Report Viewer</h1> */}

      <div className="mb-4 flex justify-between">
        <select
          className="p-2 border rounded-md shadow-md w-1/2"
          onChange={handleReportSelection}
          value={selectedReport.name}
        >
          {reports.map((report, index) => (
            <option key={index} value={report.name}>
              {report.name}
            </option>
          ))}
        </select>
        {/* <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
          onClick={handleViewReport}
        >
          View Report
        </button> */}
      </div>

   <p className="text-center mb-4 text-gray-600">{selectedReport.description}</p>

   
        <div>
          {/* <h3 className="text-2xl font-semibold text-center mb-4">{selectedReport.name}</h3> */}
          <SelectedReportComponent
            title={selectedReport.name}
            refreshReport={refreshReport}
           // onReload={handleViewReport}
          />
        </div>

    </div>
  );
}

export default ReportViewer;
