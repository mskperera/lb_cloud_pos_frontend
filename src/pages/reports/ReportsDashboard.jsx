import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChartLine, FaBoxOpen, FaShoppingCart, FaExclamationTriangle,
  FaCalendarAlt, FaWarehouse, FaChevronDown, FaChevronRight, FaFileInvoice
} from 'react-icons/fa';

const ReportsDashboard = () => {
  const navigate = useNavigate();
  
  // State to manage the open/collapsed status of each section over the course of the session
  const [openSections, setOpenSections] = useState({
    sales: true,
    inventory: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const reportGroups = [
    {
      id: "sales",
      title: "Sales Reports",
      icon: <FaChartLine className="text-gray-500" />,
      description: "Track revenue, end-of-day operations, best sellers & profitability",
      reports: [
        { name: "Daily Sales Summary", icon: <FaCalendarAlt />, path: "/reports/dailySalesSummaryReport", desc: "End-of-day summary with payments & discounts" },
       { name: "Sales by Product / SKU", icon: <FaShoppingCart />, path: "/reports/salesByProductMonthlyReport", desc: "See top-selling items by revenue & quantity" },
       { name: "Z-Report History", icon: <FaFileInvoice />, path: "/reports/zReportHistory", desc: "View chronological register closing data and daily financial resets" },
       
      ]
    },
    {
      id: "inventory",
      title: "Inventory & Stock Reports",
      icon: <FaBoxOpen className="text-gray-500" />,
      description: "Monitor stock levels, movement, and value tracking",
      reports: [
        { name: "Inventory On Hand Report", icon: <FaWarehouse />, path: "/reports/InventoryOnHandReport", desc: "Current inventory counts across all active items" },
        { name: "Low Stock / Reorder Alert", icon: <FaExclamationTriangle />, path: "/reports/low-stock", desc: "Identify low inventory items needing immediate reorder" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10 pb-6">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reports</h2>
      </div>


        {reportGroups.map((group) => {
          const isOpen = openSections[group.id];
          return (
            <div key={group.id} className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
              
              {/* Collapsible Section Header Heading */}
              <button
                onClick={() => toggleSection(group.id)}
                className="w-full flex items-center justify-between p-5 bg-gray-200 hover:bg-gray-300 transition-colors text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{group.icon}</span>
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">{group.title}</h2>
                    <p className="text-xs text-gray-400 font-normal mt-0.5">{group.description}</p>
                  </div>
                </div>
                <div className="text-gray-700 pr-2">
                  {isOpen ? <FaChevronDown size={14} className="transition-transform duration-200" /> : <FaChevronRight size={14} className="transition-transform duration-200" />}
                </div>
              </button>

              {/* Smooth Collapsible Body Grid */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 p-6 border-t border-gray-100" : "grid-rows-[0fr] opacity-0 p-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.reports.map((report, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(report.path)}
                        className="group flex flex-col justify-between p-5 bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg cursor-pointer transition-all duration-200"
                      >
                        <div>
                          <div className="flex items-center gap-3 text-gray-700 font-medium group-hover:text-blue-600 transition-colors mb-2">
                            <span className="text-lg bg-gray-100 group-hover:bg-blue-50 p-2 rounded-md text-gray-500 group-hover:text-blue-600 transition-colors">
                              {report.icon}
                            </span>
                            <span className="text-sm font-semibold tracking-tight">{report.name}</span>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed pl-11">
                            {report.desc}
                          </p>
                        </div>
                        
                        <div className="text-xs text-blue-600 font-semibold mt-4 pl-11 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Report &rarr;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsDashboard;