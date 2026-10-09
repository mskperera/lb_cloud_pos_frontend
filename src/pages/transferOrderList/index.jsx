
import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { FaPlus, FaSearch, FaTimes, FaStop } from "react-icons/fa";
import { ArrowLeftRight, FileText } from "lucide-react";

import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import { getTransferOrders } from "../../functions/transferOrder";
import { validate } from "../../utils/formValidation";

import ReusableTable from "../../components/ReusableTable";
import CreateTransferOrder from "../../components/tranferOrder/CreateTransferOrder";
import TransferOrderDetail from "../../components/tranferOrder/TransferOrderDetail";

export default function TransferOrderList() {
  const store = JSON.parse(localStorage.getItem("selectedStore") || "{}");

  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransferOrderId, setSelectedTransferOrderId] = useState(null);

  const searchInputRef = useRef(null);

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

  const filterByOptions = [
    { id: 1, displayName: "Transfer Ref No" },
    { id: 2, displayName: "Source Store" },
    { id: 3, displayName: "Destination Store" },
    { id: 5, displayName: "Transfer Date" },
  ];

  useEffect(() => {
    loadOrders(
      searchValue.value,
      searchFromDate ? moment(searchFromDate).format("YYYY-MM-DD HH:mm:ss") : null,
      searchToDate ? moment(searchToDate).format("YYYY-MM-DD HH:mm:ss") : null
    );
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    if ([1, 2, 3].includes(selectedFilterBy.value) && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [selectedFilterBy.value]);

  const loadOrders = async (_searchValue, fromDate, toDate) => {
    try {
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        storeId: store.storeId,
        transferRefNo: selectedFilterBy.value === 1 ? _searchValue : null,
        sourceStoreName: selectedFilterBy.value === 2 ? _searchValue : null,
        destinationStoreName: selectedFilterBy.value === 3 ? _searchValue : null,
        fromDate: selectedFilterBy.value === 5 ? fromDate : null,
        toDate: selectedFilterBy.value === 5 ? toDate : null,
        skip,
        limit,
      };

      const res = await getTransferOrders(filteredData);
      const { totalRows } = res?.data?.outputValues || {};
      setTotalRecords(totalRows || 0);
      setOrders(res?.data?.results?.[0] || []);
    } catch (err) {
      console.error("Error loading transfer orders:", err);
    } finally {
      setIsTableDataLoading(false);
    }
  };

  const handleInputChange = (setState, state, value) => {
    if (!state.rules) return;
    const validation = validate(value, state);
    setState({
      ...state,
      value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const handleFilterByChange = (e) => {
    const val = parseInt(e.target.value, 10);
    handleInputChange(setSelectedFilterBy, selectedFilterBy, val);
    setSearchValue({ ...searchValue, value: "" });
    setSearchFromDate("");
    setSearchToDate("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    setCurrentPage(0);
    loadOrders(
      searchValue.value,
      searchFromDate ? moment(searchFromDate).format("YYYY-MM-DD HH:mm:ss") : null,
      searchToDate ? moment(searchToDate).format("YYYY-MM-DD HH:mm:ss") : null
    );
  };

  const handleClearSearch = () => {
    setSearchValue({ ...searchValue, value: "" });
    setSearchFromDate("");
    setSearchToDate("");
    setCurrentPage(0);
    loadOrders(null, null, null);
  };

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
  };

  const handleSuccess = () => {
    loadOrders(null, null, null);
  };

  const transferOrderColumns = [
    {
      header: "Transfer Ref No",
      key: "transferRefNo",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-slate-800 shadow-2xs">
          {item.transferRefNo || "-"}
        </span>
      ),
    },
    {
      header: "Source Store",
      key: "sourceStoreName",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <span className="text-xs font-semibold text-slate-800">
          {item.sourceStoreName || "N/A"}
        </span>
      ),
    },
    {
      header: "Destination Store",
      key: "destinationStoreName",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <span className="text-xs font-semibold text-slate-800">
          {item.destinationStoreName || "N/A"}
        </span>
      ),
    },
    {
      header: "Total Value",
      key: "totalValue",
      headerClass: "text-right",
      cellClass: "text-right font-mono font-semibold text-sm text-slate-600",
      render: (item) => formatCurrency(item.totalValue || 0, false),
    },
    {
      header: "Transfer Date",
      key: "transferDate",
      headerClass: "text-center",
      cellClass: "text-center text-xs text-slate-600",
      render: (item) =>
        item.transferDate ? (
          <span className="inline-block bg-slate-50 text-slate-700 text-xs px-2 py-0.5 rounded border border-slate-200">
            {formatUtcToLocal(item.transferDate, true)}
          </span>
        ) : (
          <span className="text-slate-300 italic">-</span>
        ),
    },
    {
      header: "Created Date",
      key: "createdDate_UTC",
      headerClass: "text-center",
      cellClass: "text-center text-xs text-slate-500",
      render: (item) =>
        item.createdDate_UTC ? (
          <span className="inline-block bg-sky-50 text-sky-700 text-xs px-2 py-0.5 rounded-full border border-sky-200 font-medium">
            {formatUtcToLocal(item.createdDate_UTC)}
          </span>
        ) : (
          <span className="text-slate-300 italic">-</span>
        ),
    },
    {
      header: "Status",
      key: "isVoided",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (item) =>
        item.isVoided ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Voided
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        ),
    },
  ];

  const actionButtons = (item) => (
    <div className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          setSelectedTransferOrderId(item.transferOrderId);
          setIsDetailOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-lg transition-all shadow-2xs cursor-pointer"
        title="View Transfer Order Details"
      >
        <FileText className="w-4 h-4 text-sky-600" />
        <span>View</span>
      </button>

      {!item.isVoided ? (
        <button
          type="button"
          onClick={() => {
            /* Cancel or void action trigger */
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-all shadow-2xs cursor-pointer"
          title="Void Transfer Order"
        >
          <FaStop className="w-3.5 h-3.5 text-rose-600" />
          <span>Void</span>
        </button>
      ) : (
        <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200/80 rounded-lg uppercase tracking-wider select-none">
          Voided
        </span>
      )}
    </div>
  );

  const isSearchActive = Boolean(searchValue.value || searchFromDate || searchToDate);

  return (
    <div className="px-10 py-4">
      <CreateTransferOrder
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      <TransferOrderDetail
        transferOrderId={selectedTransferOrderId}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Page Header */}
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 text-slate-600 flex items-center justify-center">
            <ArrowLeftRight className="w-7 h-7 text-slate-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 tracking-tight">Transfer Order List</h2>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex text-sm items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:bg-emerald-700 transition ml-auto"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create Transfer Order</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 my-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 min-w-[240px]">
            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Filter By:</label>
            <select
              value={selectedFilterBy.value}
              onChange={handleFilterByChange}
              className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            >
              {filterByOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>

          {[1, 2, 3].includes(selectedFilterBy.value) && (
            <div className="flex items-center gap-2 flex-1 min-w-[280px]">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Search:</label>
              <input
                type="text"
                ref={searchInputRef}
                value={searchValue.value}
                onChange={(e) => handleInputChange(setSearchValue, searchValue, e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                placeholder="Enter search term..."
              />
            </div>
          )}

          {selectedFilterBy.value === 5 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-600">From:</label>
                <input
                  type="date"
                  value={searchFromDate ? moment(searchFromDate).format("YYYY-MM-DD") : ""}
                  onChange={(e) => setSearchFromDate(e.target.value ? new Date(e.target.value) : "")}
                  className="px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-600">To:</label>
                <input
                  type="date"
                  value={searchToDate ? moment(searchToDate).format("YYYY-MM-DD") : ""}
                  onChange={(e) => setSearchToDate(e.target.value ? new Date(e.target.value) : "")}
                  className="px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {isSearchActive && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                <FaTimes className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition"
            >
              <FaSearch className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      <ReusableTable
        data={orders}
        isLoading={isTableDataLoading}
        columns={transferOrderColumns}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 30, 50, 100]}
        paginationPosition="top"
        customActions={(item) => actionButtons(item)}
      />
    </div>
  );
}


// // src/pages/inventory/transferorders/TransferOrderList.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaPlus } from "react-icons/fa";

// import BackButton from "../../components/BackButton";
// import ReusableTable from "../../components/ReusableTable";
// import { getTransferOrders } from "../../functions/transferOrder";
// import moment from "moment";
// import { XIcon } from "lucide-react";

// import DaisyUIPaginator from "../../components/DaisyUIPaginator"

// const TransferOrderList = () => {
//   const navigate = useNavigate();

//   // In real app → fetch from API or localStorage
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//     const [currentPage, setCurrentPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(30);
//     const [totalRecords, setTotalRecords] = useState(0);

//   const [selectedFilterBy, setSelectedFilterBy] = useState({
//     label: "Filter by",
//     value: 1,
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });

//   const [searchValue, setSearchValue] = useState({
//     label: "Search Value",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });

//   const [searchFromDate, setSearchFromDate] = useState("");
//   const [searchToDate, setSearchToDate] = useState("");



//   useEffect(() => {
//     loadTranferOrders(searchValue.value, searchFromDate, searchToDate, false);
//   }, [currentPage, rowsPerPage]);


  
//   const getStatusStyle = (status) => {
//     switch (status.toLowerCase()) {
//       case "in transit":
//         return "bg-blue-100/70 text-blue-700 border border-blue-200";
//       case "received":
//         return "bg-green-100/70 text-green-700 border border-green-200";
//       case "sent":
//         return "bg-purple-100/70 text-purple-700 border border-purple-200";
//       case "draft":
//         return "bg-gray-100/70 text-gray-700 border border-gray-200";
//       case "deleted":
//       case "cancelled":
//         return "bg-red-100/70 text-red-700 border border-red-200";
//       default:
//         return "bg-gray-100 text-gray-700 border border-gray-200";
//     }
//   };


//   const orderColumns = [
//     {
//       key: "transferNo",
//       label: "Transfer Order No",
//       align: "left",
//     },
//     {
//       key: "createdDate_UTC",
//       label: "Date",
//       align: "left",
//       render: (order) => moment(order.createdDate_UTC).format("yyyy MMM DD hh:mm A"),
//     },
//     {
//       key: "route",
//       label: "Source → Destination",
//       align: "left",
//       render: (order) => (
//         <div>
//           <div className="font-medium">{order.sourceStoreName}</div>
//           <div className="text-sm text-gray-500 mt-0.5">→ {order.destinationStoreName}</div>
//         </div>
//       ),
//     },
//     {
//       key: "status",
//       label: "Status",
//       align: "left",
//       render: (order) => (
//         <span className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(order.status)}`}>
//           {order.status}
//         </span>
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       align: "right",
//       render: (order) => (
//         <button
//           onClick={() => navigate(`/inventory/transferorders/${order.transferOrderId}`)}
//           className="inline-flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-[#E5E5EA] rounded-lg text-[#007AFF] font-medium hover:bg-blue-50 hover:border-blue-300 transition shadow-sm text-xs md:text-sm"
//           title="View Details"
//         >
//           <FaEye className="w-3 h-3 md:w-4 md:h-4" />
//           <span className="hidden md:inline">View</span>
//         </button>
//       ),
//     },
//   ];

//   const onPageChange = (event) => {

//     console.log('event.page',event.page);
//     setCurrentPage(event.page);
//     setRowsPerPage(event.rows);
//   };

//   const loadTranferOrders = async (_searchValue = null, fromDate = null, toDate = null, resetSkipAndLimit = false) => {


//       try {
//         if (_searchValue !== null) {
//           if (_searchValue.trim() === "") _searchValue = null;
//         }
  
//         if (fromDate !== null) {
//           if (fromDate.trim() === "") fromDate = null;
//         }
  
//         if (toDate !== null) {
//           if (toDate.trim() === "") toDate = null;
//         }
  
//         console.log("searchValue", _searchValue, "fromDate", fromDate, "toDate", toDate);
  
//         setLoading(true);
//         const skip = resetSkipAndLimit ? 0 : currentPage * rowsPerPage;
//         const limit = rowsPerPage;
  
//         const filteredData = {
        
//           sourceStoreId: selectedFilterBy.value === 1 ? _searchValue : null,
//           destinationStoreId: selectedFilterBy.value === 2 ? _searchValue : null,
//           status: selectedFilterBy.value === 3 ? _searchValue : null,
//           fromDate: fromDate,
//           toDate: toDate,
//           skip,
//           limit,
//         };
  
//         const _result = await getTransferOrders(filteredData);


//         const { totalRows } = _result.data.outputValues;
//         setTotalRecords(totalRows);
//         setOrders(_result.data.results[0] || []);
//       } catch (err) {
//         console.error("Error loading transfer orders:", err);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }



// }






//   return (
//     <div className="min-h-screen bg-[#F2F2F7] p-4 md:p-6 lg:p-7 pb-20 font-sans">
//       <div className="max-w-[1200px] mx-auto flex flex-col gap-4 md:gap-6">

//         {/* Header */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-2 md:gap-4">
//             {/* <BackButton
//               onClick={() => navigate("/inventory/list")}
//               title="Back to Inventory"
//             /> */}
//             <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-700">
//               Transfer Orders
//             </h1>
//           </div>

//           <button
//             onClick={() => navigate("/inventory/transferorders/create")}
//             className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-green-700 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:bg-green-800 transition text-sm md:text-base"
//           >
//             <FaPlus className="w-4 h-4" />
//             <span>Create New Transfer</span>
//           </button>
//         </div>

//         {/* Table Card - Desktop View */}
//         <div className="hidden md:block bg-white rounded-xl md:rounded-2xl border border-[#E5E5EA] shadow-sm overflow-hidden">
         
//                  <div className="flex flex-col md:flex-row md:items-end gap-4 px-6 py-4 border-t border-gray-200">
//             {/* Filter Dropdown */}
//             <div className="w-full md:w-56">
//               <select
//                 value={selectedFilterBy.value}
//                 onChange={(e) => {
//                   const val = parseInt(e.target.value);
//                   setSelectedFilterBy((prev) => ({ ...prev, value: val }));
//                   setCurrentPage(0);
//                   setSearchValue({ ...searchValue, value: "" });
//                   setSearchFromDate("");
//                   setSearchToDate("");
//                 }}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
//               >
//                 <option value={1}>Transfer Order No</option>
//                 <option value={5}>Order Date</option>
//               </select>
//             </div>

//             {/* Search Field (text) */}
//             {[1, 2, 3].includes(selectedFilterBy.value) && (
//               <div className="flex-1 min-w-[180px] relative flex items-center">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchValue.value}
//                   onChange={(e) => {
//                     setSearchValue((prev) => ({
//                       ...prev,
//                       value: e.target.value,
//                     }));

//                     if (
//                       e.target.value.trim() === "" &&
//                       searchValue.value.trim() !== ""
//                     ) {
//                       setSearchFromDate("");
//                       setSearchToDate("");
//                       loadTranferOrders(null, null, null, true);
//                     }
//                   }}
//                   onKeyDown={(e) => {
//                     e.key === "Enter" && loadTranferOrders(searchValue.value);
//                   }}
//                   className="w-full py-3 pl-4 pr-10 text-base font-medium bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 shadow-sm"
//                 />
//                 {searchValue.value && (
//                   <button
//                     onClick={() => {
//                       setSearchValue((prev) => ({ ...prev, value: "" }));
//                       setSearchFromDate("");
//                       setSearchToDate("");
//                       loadTranferOrders(null, null, null, true);
//                     }}
//                     className="absolute right-2 p-1 text-gray-500 hover:text-red-600 transition"
//                     tabIndex={-1}
//                   >
//                     <XIcon size={20} strokeWidth={3} />
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Date Range Fields */}
//             {selectedFilterBy.value === 5 && (
//               <div className="flex gap-3 flex-1 min-w-[180px]">
//                 <input
//                   type="date"
//                   value={
//                     searchFromDate
//                       ? moment(searchFromDate).format("YYYY-MM-DD")
//                       : ""
//                   }
//                   onChange={(e) => setSearchFromDate(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300"
//                 />
//                 <input
//                   type="date"
//                   value={
//                     searchToDate
//                       ? moment(searchToDate).format("YYYY-MM-DD")
//                       : ""
//                   }
//                   onChange={(e) => setSearchToDate(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300"
//                 />
//               </div>
//             )}

//             {/* Search Button */}
//             <div className="w-full md:w-auto flex justify-end">
//               <button
//                 onClick={() => {
//                   if (
//                     selectedFilterBy.value === 5 ||
//                     (searchValue.value?.trim() !== "" &&
//                       selectedFilterBy.value !== 5)
//                   ) {
//                     console.log("serchbalue", searchValue.value);
//                     loadTranferOrders(
//                       searchValue.value,
//                       searchFromDate
//                         ? moment(searchFromDate).format("YYYY-MM-DD")
//                         : null,
//                       searchToDate
//                         ? moment(searchToDate).format("YYYY-MM-DD")
//                         : null,
//                       true,
//                     );
//                   }
//                 }}
//                 className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition w-full md:w-auto"
//               >
//                 Search
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <ReusableTable
//               columns={orderColumns}
//               data={orders}
//               loading={loading}
//               emptyMessage="No transfer orders found • Create one to get started"
//             />
//           </div>
//           <div className="p-4 md:p-5 border-t bg-gray-50/50 text-xs md:text-sm flex flex-col md:flex-row md:justify-between items-center gap-3">
//             <div className=" text-gray-500 text-center">
//               Showing {orders.length} of {totalRecords} Items
//             </div>
//             <DaisyUIPaginator
//               currentPage={currentPage}
//               rowsPerPage={rowsPerPage}
//               totalRecords={totalRecords}
//               onPageChange={onPageChange}
//               rowsPerPageOptions={[10, 20, 30, 50, 100]}
//             />
//           </div>
//         </div>
//       </div>
// </div>
//   );
// };

// export default TransferOrderList;