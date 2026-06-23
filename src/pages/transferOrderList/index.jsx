// src/pages/inventory/transferorders/TransferOrderList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";

import BackButton from "../../components/BackButton";
import ReusableTable from "../../components/ReusableTable";
import { getTransferOrders } from "../../functions/transferOrder";
import moment from "moment";
import { XIcon } from "lucide-react";

import DaisyUIPaginator from "../../components/DaisyUIPaginator"

const TransferOrderList = () => {
  const navigate = useNavigate();

  // In real app → fetch from API or localStorage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [totalRecords, setTotalRecords] = useState(0);

  const [selectedFilterBy, setSelectedFilterBy] = useState({
    label: "Filter by",
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue, setSearchValue] = useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");



  useEffect(() => {
    loadTranferOrders(searchValue.value, searchFromDate, searchToDate, false);
  }, [currentPage, rowsPerPage]);


  
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


  const orderColumns = [
    {
      key: "transferNo",
      label: "Transfer Order No",
      align: "left",
    },
    {
      key: "createdDate_UTC",
      label: "Date",
      align: "left",
      render: (order) => moment(order.createdDate_UTC).format("yyyy MMM DD hh:mm A"),
    },
    {
      key: "route",
      label: "Source → Destination",
      align: "left",
      render: (order) => (
        <div>
          <div className="font-medium">{order.sourceStoreName}</div>
          <div className="text-sm text-gray-500 mt-0.5">→ {order.destinationStoreName}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "left",
      render: (order) => (
        <span className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (order) => (
        <button
          onClick={() => navigate(`/inventory/transferorders/${order.transferOrderId}`)}
          className="inline-flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-[#E5E5EA] rounded-lg text-[#007AFF] font-medium hover:bg-blue-50 hover:border-blue-300 transition shadow-sm text-xs md:text-sm"
          title="View Details"
        >
          <FaEye className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden md:inline">View</span>
        </button>
      ),
    },
  ];

  const onPageChange = (event) => {

    console.log('event.page',event.page);
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
  };

  const loadTranferOrders = async (_searchValue = null, fromDate = null, toDate = null, resetSkipAndLimit = false) => {


      try {
        if (_searchValue !== null) {
          if (_searchValue.trim() === "") _searchValue = null;
        }
  
        if (fromDate !== null) {
          if (fromDate.trim() === "") fromDate = null;
        }
  
        if (toDate !== null) {
          if (toDate.trim() === "") toDate = null;
        }
  
        console.log("searchValue", _searchValue, "fromDate", fromDate, "toDate", toDate);
  
        setLoading(true);
        const skip = resetSkipAndLimit ? 0 : currentPage * rowsPerPage;
        const limit = rowsPerPage;
  
        const filteredData = {
        
          sourceStoreId: selectedFilterBy.value === 1 ? _searchValue : null,
          destinationStoreId: selectedFilterBy.value === 2 ? _searchValue : null,
          status: selectedFilterBy.value === 3 ? _searchValue : null,
          fromDate: fromDate,
          toDate: toDate,
          skip,
          limit,
        };
  
        const _result = await getTransferOrders(filteredData);


        const { totalRows } = _result.data.outputValues;
        setTotalRecords(totalRows);
        setOrders(_result.data.results[0] || []);
      } catch (err) {
        console.error("Error loading transfer orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }



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
            <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-700">
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
         
                 <div className="flex flex-col md:flex-row md:items-end gap-4 px-6 py-4 border-t border-gray-200">
            {/* Filter Dropdown */}
            <div className="w-full md:w-56">
              <select
                value={selectedFilterBy.value}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSelectedFilterBy((prev) => ({ ...prev, value: val }));
                  setCurrentPage(0);
                  setSearchValue({ ...searchValue, value: "" });
                  setSearchFromDate("");
                  setSearchToDate("");
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value={1}>Transfer Order No</option>
                <option value={5}>Order Date</option>
              </select>
            </div>

            {/* Search Field (text) */}
            {[1, 2, 3].includes(selectedFilterBy.value) && (
              <div className="flex-1 min-w-[180px] relative flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue.value}
                  onChange={(e) => {
                    setSearchValue((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }));

                    if (
                      e.target.value.trim() === "" &&
                      searchValue.value.trim() !== ""
                    ) {
                      setSearchFromDate("");
                      setSearchToDate("");
                      loadTranferOrders(null, null, null, true);
                    }
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && loadTranferOrders(searchValue.value);
                  }}
                  className="w-full py-3 pl-4 pr-10 text-base font-medium bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 shadow-sm"
                />
                {searchValue.value && (
                  <button
                    onClick={() => {
                      setSearchValue((prev) => ({ ...prev, value: "" }));
                      setSearchFromDate("");
                      setSearchToDate("");
                      loadTranferOrders(null, null, null, true);
                    }}
                    className="absolute right-2 p-1 text-gray-500 hover:text-red-600 transition"
                    tabIndex={-1}
                  >
                    <XIcon size={20} strokeWidth={3} />
                  </button>
                )}
              </div>
            )}

            {/* Date Range Fields */}
            {selectedFilterBy.value === 5 && (
              <div className="flex gap-3 flex-1 min-w-[180px]">
                <input
                  type="date"
                  value={
                    searchFromDate
                      ? moment(searchFromDate).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => setSearchFromDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300"
                />
                <input
                  type="date"
                  value={
                    searchToDate
                      ? moment(searchToDate).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) => setSearchToDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300"
                />
              </div>
            )}

            {/* Search Button */}
            <div className="w-full md:w-auto flex justify-end">
              <button
                onClick={() => {
                  if (
                    selectedFilterBy.value === 5 ||
                    (searchValue.value?.trim() !== "" &&
                      selectedFilterBy.value !== 5)
                  ) {
                    console.log("serchbalue", searchValue.value);
                    loadTranferOrders(
                      searchValue.value,
                      searchFromDate
                        ? moment(searchFromDate).format("YYYY-MM-DD")
                        : null,
                      searchToDate
                        ? moment(searchToDate).format("YYYY-MM-DD")
                        : null,
                      true,
                    );
                  }
                }}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition w-full md:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <ReusableTable
              columns={orderColumns}
              data={orders}
              loading={loading}
              emptyMessage="No transfer orders found • Create one to get started"
            />
          </div>
          <div className="p-4 md:p-5 border-t bg-gray-50/50 text-xs md:text-sm flex flex-col md:flex-row md:justify-between items-center gap-3">
            <div className=" text-gray-500 text-center">
              Showing {orders.length} of {totalRecords} Items
            </div>
            <DaisyUIPaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 20, 30, 50, 100]}
            />
          </div>
        </div>
      </div>
</div>
  );
};

export default TransferOrderList;