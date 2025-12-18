import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChartLine, FaBoxOpen, FaShoppingCart, FaUsers, FaFileInvoiceDollar,
  FaClipboardList, FaTruckLoading, FaHistory, FaSearchDollar, FaExclamationTriangle,
  FaDollarSign, FaTags, FaChartBar, FaCalendarAlt, FaWarehouse, FaUndo
} from 'react-icons/fa';

const ReportsDashboard = () => {
  const navigate = useNavigate();

  const reportGroups = [
    {
      title: "Sales Reports",
      icon: <FaChartLine className="text-4xl text-white" />,
      gradient: "blue-700",
      reports: [
        { name: "Daily Sales Summary", icon: <FaCalendarAlt />, path: "/reports/dailySalesSummaryReport" },
        { name: "Sales by Product / SKU", icon: <FaShoppingCart />, path: "/reports/salesByProductMonthlyReport" },
        // { name: "Best & Worst Selling Items", icon: <FaChartBar />, path: "/reports/best-worst-selling" },
        // { name: "Profit & Loss Report", icon: <FaDollarSign />, path: "/reports/profit-loss" },
        // { name: "Sales Trend (Weekly/Monthly)", icon: <FaChartLine />, path: "/reports/sales-trend" },
      ]
    },
    {
      title: "Inventory & Stock Reports",
      icon: <FaBoxOpen className="text-4xl text-white" />,
      gradient: "emerald-700",
      reports: [
        { name: "Inventory On Hand Report", icon: <FaWarehouse />, path: "/reports/InventoryOnHandReport" },
        { name: "Low Stock / Reorder Alert", icon: <FaExclamationTriangle />, path: "/reports/low-stock" },
        // { name: "Inventory Value Summary", icon: <FaFileInvoiceDollar />, path: "/reports/inventory-value" },
        // { name: "Stock Aging / Dead Stock", icon: <FaHistory />, path: "/reports/dead-stock" },
        { name: "Sell-Through & Turnover", icon: <FaChartLine />, path: "/reports/turnover" },
        // { name: "Inventory vs Sales", icon: <FaSearchDollar />, path: "/reports/stock-vs-sales" },
      ]
    },
    // {
    //   title: "Vendor / Purchase Reports",
    //   icon: <FaTruckLoading className="text-4xl text-white" />,
    //   gradient: "purple-700",
    //   reports: [
    //     { name: "Purchase Orders Summary", icon: <FaClipboardList />, path: "/reports/purchase-orders" },
    //     { name: "Vendor Performance", icon: <FaUsers />, path: "/reports/vendor-performance" },
    //     { name: "Stock Received vs Ordered", icon: <FaUndo />, path: "/reports/received-vs-ordered" },
    //     { name: "Cost of Goods Purchased", icon: <FaDollarSign />, path: "/reports/cost-of-goods" },
    //   ]
    // },
    // {
    //   title: "Customer & Service Reports",
    //   icon: <FaUsers className="text-4xl text-white" />,
    //   gradient: "indigo-700",
    //   reports: [
    //     { name: "Customer Purchase History", icon: <FaHistory />, path: "/reports/customer-history" },
    //     { name: "Service / Product Mix", icon: <FaTags />, path: "/reports/service-mix" },
    //     { name: "Returns & Refunds Report", icon: <FaUndo />, path: "/reports/returns-refunds" },
    //   ]
    // },
    // {
    //   title: "Audit & Security Reports",
    //   icon: <FaExclamationTriangle className="text-4xl text-white" />,
    //   gradient: "red-700",
    //   reports: [
    //     { name: "Audit Trail / Activity Log", icon: <FaClipboardList />, path: "/reports/audit-trail" },
    //     { name: "Voided / Discount Report", icon: <FaTags />, path: "/reports/voided-discounts" },
    //     { name: "Stock Variance Report", icon: <FaSearchDollar />, path: "/reports/stock-variance" },
    //   ]
    // }
  ];

  const handleReportClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reports Dashboard</h1>
          <p className="text-xl text-gray-600">Select a report to view detailed insights</p>
        </div> */}

        {/* Report Groups */}
        {reportGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-16">
            {/* Group Title */}
            <div className={`flex items-center gap-6 p-4 rounded-2xl shadow-lg bg-sky-600 ${group.gradient} text-white mb-8`}>
              {group.icon}
              <div>
                <h2 className="text-2xl font-bold">{group.title}</h2>
                <p className="text-lg opacity-90">
                  {groupIdx === 0 && "Track revenue, best sellers & profitability"}
                  {groupIdx === 1 && "Monitor stock levels, movement & value"}
                  {groupIdx === 2 && "Manage suppliers & purchasing efficiently"}
                  {groupIdx === 3 && "Understand customer behavior & loyalty"}
                  {groupIdx === 4 && "Ensure security, accuracy & control"}
                </p>
              </div>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.reports.map((report, idx) => (
                <div
                  key={idx}
                  onClick={() => handleReportClick(report.path)}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group"
                >
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600 mb-5 group-hover:scale-110 transition-transform">
                      {React.cloneElement(report.icon, { className: "text-4xl" })}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {report.name.includes("Daily") && "End-of-day summary with payments & discounts"}
                      {report.name.includes("Product") && "See top-selling items by revenue & quantity"}
                      {report.name.includes("Best") && "Identify winners and underperformers"}
                      {report.name.includes("Profit") && "True earnings after cost of goods"}
                      {report.name.includes("Trend") && "Visualize growth over time"}
                      {report.name.includes("Stock Level") && "Current inventory across all items"}
                      {report.name.includes("Low Stock") && "Never run out of popular items"}
                      {report.name.includes("Value") && "Know how much capital is tied in stock"}
                      {report.name.includes("Aging") && "Spot slow-moving or dead inventory"}
                      {report.name.includes("Purchase") && "Track orders, vendors & spending"}
                      {report.name.includes("Customer") && "Build loyalty with purchase insights"}
                      {report.name.includes("Returns") && "Monitor refunds and customer issues"}
                      {report.name.includes("Audit") && "Full transparency on all actions"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-center py-3 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Report
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsDashboard;