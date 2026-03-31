// src/pages/inventory/transferorders/TransferOrderList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";

import { format } from "date-fns"; // optional – better than moment for new projects
import BackButton from "../../components/BackButton";

const TransferOrderList = () => {
  const navigate = useNavigate();

  // In real app → fetch from API or localStorage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay + demo data
    setTimeout(() => {
      const mockOrders = [
        {
          number: "TO1008",
          date: "2021-06-18",
          status: "In transit",
          source: "Pizzerria",
          destination: "Coffee shop",
          itemsCount: 3,
          totalQuantity: 261,
          orderedBy: "Owner",
        },
        {
          number: "TO1012",
          date: "2025-03-15",
          status: "Received",
          source: "Main Warehouse",
          destination: "Downtown Store",
          itemsCount: 5,
          totalQuantity: 450,
          orderedBy: "Manager",
        },
        {
          number: "TO1015",
          date: "2025-04-02",
          status: "Draft",
          source: "Pizzerria",
          destination: "Uptown Cafe",
          itemsCount: 2,
          totalQuantity: 80,
          orderedBy: "Staff",
        },
        {
          number: "TO1021",
          date: "2026-02-28",
          status: "Sent",
          source: "Central Kitchen",
          destination: "Branch 3",
          itemsCount: 4,
          totalQuantity: 320,
          orderedBy: "Owner",
        },
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 600);
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return "bg-blue-100/70 text-blue-700 border border-blue-200";
      case "received":
        return "bg-green-100/70 text-green-700 border border-green-200";
      case "sent":
        return "bg-purple-100/70 text-purple-700 border border-purple-200";
      case "draft":
        return "bg-gray-100/70 text-gray-700 border border-gray-200";
      case "deleted":
      case "cancelled":
        return "bg-red-100/70 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] p-7 flex items-center justify-center">
        <div className="text-[#6D6D72] text-lg">Loading transfer orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-6 lg:p-7 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4 md:gap-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <BackButton
              onClick={() => navigate("/inventory/list")}
              title="Back to Inventory"
            />
            <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-[#1C1C1E] tracking-[-0.4px]">
              Transfer Orders
            </h1>
          </div>

          <button
            onClick={() => navigate("/inventory/transferorders/create")}
            className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-green-700 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:bg-green-800 transition text-sm md:text-base"
          >
            <FaPlus className="w-4 h-4" />
            <span>Create New Transfer</span>
          </button>
        </div>

        {/* Table Card - Desktop View */}
        <div className="hidden md:block bg-white rounded-xl md:rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b bg-gray-50/70">
            <h2 className="text-base md:text-lg font-semibold text-[#1C1C1E]">
              All Transfer Orders
            </h2>
            <p className="text-xs md:text-sm text-[#6D6D72] mt-1">
              {orders.length} orders found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                    Transfer No
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                    Date
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                    Source → Destination
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72] text-center">
                    Items
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72] text-center">
                    Total Qty
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold uppercase tracking-wider text-[#6D6D72] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 md:py-16 text-center text-[#AEAEB2] text-sm md:text-lg">
                      No transfer orders found • Create one to get started
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.number} className="hover:bg-[#F9F9FB] transition-colors group">
                      <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-[#1C1C1E] text-sm">
                        {order.number}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[#6D6D72] text-sm">
                        {format(new Date(order.date), "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-sm">
                        <div className="font-medium">{order.source}</div>
                        <div className="text-xs text-[#6D6D72] mt-0.5">→ {order.destination}</div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center font-medium text-sm">{order.itemsCount}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center font-medium text-sm">{order.totalQuantity}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-sm">
                        <span className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <button
                          onClick={() => navigate(`/inventory/transferorders/${order.number}`)}
                          className="inline-flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-[#E5E5EA] rounded-lg text-[#007AFF] font-medium hover:bg-blue-50 hover:border-blue-300 transition shadow-sm text-xs md:text-sm"
                          title="View Details"
                        >
                          <FaEye className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden md:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 md:p-5 border-t bg-gray-50/50 text-xs md:text-sm text-[#6D6D72] text-center">
            Showing {orders.length} of {orders.length} orders
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-[#AEAEB2]">
              No transfer orders found • Create one to get started
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.number} className="bg-white rounded-lg border border-[#E5E5EA] p-4 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <div className="font-bold text-[#1C1C1E] text-sm">{order.number}</div>
                    <div className="text-xs text-[#6D6D72] mt-0.5">{format(new Date(order.date), "MMM dd, yyyy")}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-[#6D6D72] space-y-1.5 mb-3">
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-medium text-[#1C1C1E]">{order.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-medium text-[#1C1C1E]">{order.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium text-[#1C1C1E]">{order.itemsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Qty:</span>
                    <span className="font-medium text-[#1C1C1E]">{order.totalQuantity}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/inventory/transferorders/${order.number}`)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#007AFF] text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
                >
                  <FaEye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
        </div>
      </div>

  );
};

export default TransferOrderList;