import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaStop, FaSearch, FaTimes, FaReceipt } from "react-icons/fa";
import { Boxes, FileText } from "lucide-react";

import { getDrpSession } from "../../functions/dropdowns";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import { getStockEntries } from "../../functions/stockEntry";
import StockEntryVoid from "./StockEntryVoid";
import { validate } from "../../utils/formValidation";
import ReusableTable from "../ReusableTable";
import StockEntry from "./StockEntry";
import StockEntryFull from "./StockEntryFull";

export default function StockEntryList({ selectingMode }) {
  const store = JSON.parse(localStorage.getItem("selectedStore") || "{}");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
  
const [isStockEntryFullShow, setIsStockEntryFullShow] = useState(false);
  

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

  const [filterByOptions] = useState([
    { id: 1, displayName: "GRN No" },
    { id: 2, displayName: "Supplier Code" },
    { id: 3, displayName: "Supplier Name" },
    { id: 5, displayName: "Stock Entry Date" },
  ]);

  const [sessionsOptions, setSessionsOptions] = useState([]);

  const [selectedStockEntryId, setSelectedStockEntryId] = useState(null);

  useEffect(() => {
    loadDrpSession();
  }, []);

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

  const loadDrpSession = async () => {
    try {
      const objArr = await getDrpSession();
      if (objArr?.data?.results?.[0]) {
        setSessionsOptions(objArr.data.results[0]);
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
    }
  };

  const loadOrders = async (_searchValue, fromDate, toDate) => {
    try {
      console.log("_searchValue",_searchValue)
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        stockEntryId: null,
        storeId: store.storeId,
        stockEntryRefNo: selectedFilterBy.value === 1 ? _searchValue : null,
        supplierCode: selectedFilterBy.value === 2 ? _searchValue : null,
        suppliertName: selectedFilterBy.value === 3 ? _searchValue : null,
        fromDate: selectedFilterBy.value === 5 ? fromDate : null,
        toDate: selectedFilterBy.value === 5 ? toDate : null,
        skip: skip,
        limit: limit,
      };

      

      const _result = await getStockEntries(filteredData);
   console.log("Filtered Data:", filteredData);
   console.log("Result:", _result);

      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows || 0);
      setOrders(_result.data.results[0] || []);
    } catch (err) {
      console.error("Error loading stock entries:", err);
    } finally {
      setIsTableDataLoading(false);
    }
  };

  const handleInputChange = (setState, state, value) => {
    if (!state.rules) {
      console.error("No rules defined for validation in state", state);
      return;
    }
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const handleFilterByChange = (e) => {
    const val = parseInt(e.target.value);
    handleInputChange(setSelectedFilterBy, selectedFilterBy, val);
    setSearchValue({ ...searchValue, value: "" });
    setSearchFromDate("");
    setSearchToDate("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  const updateOrderListHandler = (stockEntryId) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.stockEntryId === stockEntryId ? { ...o, isVoided: true } : o
      )
    );
    setIsVoidRemarkShow(false);
  };

  // Table Columns Setup (Following ProductInventoryList pattern)
  const stockEntryColumns = [
    {
      header: "GRN No",
      key: "stockEntryRefNo",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-mono font-bold text-slate-800 shadow-2xs">
          {item.stockEntryRefNo || "-"}
        </span>
      ),
    },
    {
      header: "Supplier Bill No",
      key: "supplierBillNo",
      headerClass: "text-left",
      cellClass: "text-left font-mono text-xs text-slate-600",
      render: (item) => item.supplierBillNo || <span className="text-slate-300 italic">-</span>,
    },
    {
      header: "Supplier",
      key: "supplierName",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-slate-800">
            {item.supplierName || item.SuppliertName || "N/A"}
          </span>
          {item.SupplierCode && (
            <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded w-fit">
              {item.SupplierCode}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Total Price",
      key: "total",
      headerClass: "text-right",
      cellClass: "text-right font-mono font-semibold text-sm text-slate-600",
      render: (item) => formatCurrency ? formatCurrency(item.total || 0, false) : item.total,
    },
    {
      header: "Stock Received Date",
      key: "stockReceivedDate",
      headerClass: "text-center",
      cellClass: "text-center text-xs text-slate-600",
      render: (item) => (
        item.stockReceivedDate ? (
          <span className="inline-block bg-slate-50 text-slate-700 text-xs px-2 py-0.5 rounded border border-slate-200">
            {formatUtcToLocal(item.stockReceivedDate)}
          </span>
        ) : (
          <span className="text-slate-300 italic">-</span>
        )
      ),
    },
    {
      header: "Created Date",
      key: "CreatedDate_UTC",
      headerClass: "text-center",
      cellClass: "text-center text-xs text-slate-500",
      render: (item) => (
        item.CreatedDate_UTC ? (
          <span className="inline-block bg-sky-50 text-sky-700 text-xs px-2 py-0.5 rounded-full border border-sky-200 font-medium">
            {formatUtcToLocal(item.CreatedDate_UTC)}
          </span>
        ) : (
          <span className="text-slate-300 italic">-</span>
        )
      ),
    },
    {
      header: "Status",
      key: "isVoided",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (item) => (
        item.isVoided ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Voided
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        )
      ),
    },
  ];

  // Action Buttons Handler
  const actionButtons = (item) => (
<div className="flex items-center justify-center gap-1.5">
  {/* View Action */}
  <button
    type="button"
    onClick={() => {setSelectedStockEntryId(item.stockEntryId);
      setIsStockEntryFullShow(true);
    }}
  
    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer"
    title="View Stock Entry Receipt"
    aria-label="View Receipt"
  >
    <FileText className="w-4 h-4 text-sky-600" />
    <span>View</span>
  </button>

  {/* Void Action or Status */}
  {!item.isVoided ? (
    <button
      type="button"
      onClick={() => {
        setSelectedStockEntryId(item.stockEntryId);
        setIsVoidRemarkShow(true);
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer"
      title="Void Stock Entry"
      aria-label="Void Stock Entry"
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

  const [isStockEntryOpen, setIsStockEntryOpen] = useState(false);

  const isSearchActive = Boolean(searchValue.value || searchFromDate || searchToDate);
const handleSuccess = () => {
    // Optionally refresh or reload the list of stock entries here
  };

  return (
    <div className="px-10 py-4">
      {/* Void Dialog Modal */}
   <StockEntryVoid
        visible={isVoidRemarkShow}
        onClose={() => setIsVoidRemarkShow(false)}
        stockEntryId={selectedStockEntryId}
        onUpdateOrderList={updateOrderListHandler}
      />

      <StockEntry
        isOpen={isStockEntryOpen}
        onClose={() => setIsStockEntryOpen(false)}
        onSuccess={handleSuccess}
      />

 
        <StockEntryFull
          stockEntryId={selectedStockEntryId}
          onClose={() => setIsStockEntryFullShow(false)}
          isOpen={isStockEntryFullShow}
        />
    

      {/* Page Header */}
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 text-slate-600 flex items-center justify-center">
            <FaReceipt className="w-7 h-7 text-slate-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 tracking-tight">Stock Entry List</h2>
        </div>

        <button
          onClick={() => setIsStockEntryOpen(true)}
          className="flex text-sm items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold 
            rounded-lg md:rounded-xl shadow-md hover:bg-emerald-700 transition ml-auto"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create New Stock Entry</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 my-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Filter By Selection */}
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

          {/* Dynamic Text Input Search */}
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
                placeholder="Enter search value..."
              />
            </div>
          )}

          {/* Date Range Search */}
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

          {/* Search Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {isSearchActive && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none transition"
              >
                <FaTimes className="w-3.5 h-3.5" />
                <span>Clear Search</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none transition"
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
        columns={stockEntryColumns}
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



// import React, { useState, useEffect, useRef } from "react";
// import moment from "moment";
// import { getDrpSession } from "../../functions/dropdowns";
// import { formatCurrency, formatUtcToLocal } from "../../utils/format";
// import DaisyUIPaginator from "../../components/DaisyUIPaginator";
// import { getStockEntries } from "../../functions/stockEntry";
// import StockEntryVoid from "./StockEntryVoid";
// import { validate } from "../../utils/formValidation";
// import { FaEye, FaPlus, FaStop } from "react-icons/fa";
// import BackButton from "../BackButton";
// import { useNavigate } from "react-router-dom";

// export default function StockEntryList({ selectingMode }) {
//   const store = JSON.parse(localStorage.getItem("selectedStore"));

//   const [orders, setOrders] = useState([]);
//   const [isTableDataLoading, setIsTableDataLoading] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(30);
//   const [totalRecords, setTotalRecords] = useState(10);
//   const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
//   const [selectedStockEntryId, setSelectedOrderId] = useState("");


//   const navigate = useNavigate();


//   const onPageChange = (event) => {
//     setCurrentPage(event.page);
//     setRowsPerPage(event.rows);
//     loadOrders(selectedCategoryId, event.page, rowsPerPage);
//   };

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

//   const loadOrders = async (_searchValue, fromDate, toDate) => {
//     try {
//       setIsTableDataLoading(true);
//       const skip = currentPage * rowsPerPage;
//       const limit = rowsPerPage;

//       const filteredData = {
//         stockEntryId: null,
//         storeId: store.storeId,
//         stockEntryRefNo: selectedFilterBy.value === 1 ? _searchValue : null,
//         supplierCode: selectedFilterBy.value === 2 ? _searchValue : null,
//         suppliertName: selectedFilterBy.value === 3 ? _searchValue : null,
//         fromDate: selectedFilterBy.value === 5 ? fromDate : null,
//         toDate: selectedFilterBy.value === 5 ? toDate : null,
//         skip: skip,
//         limit: limit,
//       };
//       console.log("filteredData", filteredData);
//       const _result = await getStockEntries(filteredData);
//       console.log("ppppp", _result);
//       const { totalRows } = _result.data.outputValues;
//       setTotalRecords(totalRows);

//       setOrders(_result.data.results[0]);
//       setIsTableDataLoading(false);
//     } catch (err) {
//       setIsTableDataLoading(false);
//       console.log("error:", err);
//     }
//   };

//   useEffect(() => {
//     console.log("useEffect lo");
//     loadOrders(null, null, null);
//   }, [currentPage, rowsPerPage]);

//   const [filterByOptions, setFilterByOptions] = useState([
//     { id: 1, displayName: "GRN No" },
//     { id: 2, displayName: "Supplier Code" },
//     { id: 3, displayName: "Supplier Name" },
//     { id: 5, displayName: "Stock Entry Date" },
//   ]);

//   const [sessionsOptions, setSessionsOptions] = useState([]);

//   const loadDrpSession = async () => {
//     const objArr = await getDrpSession();
//     setSessionsOptions(objArr.data.results[0]);
//   };

//   useEffect(() => {
//     loadDrpSession();
//   }, []);

//   const actionButtons = (o) => (
//     <div className="flex space-x-2">
//       <button
//         className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-sky-600 border-none rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 transition duration-200"
//         onClick={() => {
//           window.open(`/inventory/stockEntryFull?stockEntryId=${o.stockEntryId}`, "_blank");
//         }}
//         title="View Receipt"
//         aria-label="View"
//       >
//           <FaEye className=""  />
//         {/* <FontAwesomeIcon icon={faEye} /> */}
//       </button>

//       {!o.isVoided ? (
//         <button
//           onClick={async () => {
//             setSelectedOrderId(o.stockEntryId);
//             setIsVoidRemarkShow(true);
//           }}
//           className="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-600 rounded-md
//           "
//           aria-label="Void"
//           title="Void Stock Entry"
//         >
//             <FaStop className="text-white" />
//           {/* <FontAwesomeIcon icon={faStop} /> */}
//         </button>
//       ) : (
//         <div className="text-sm text-gray-700">Voided</div>
//       )}
//     </div>
//   );

//   const modifiedDateBodyTemplate = (item) => {
//     const localFormattedDate = formatUtcToLocal(item.CreatedDate_UTC);
//     return isTableDataLoading ? <span>Loading...</span> : <span>{item.CreatedDate_UTC ? localFormattedDate : ''}</span>;
//   };

//   const stockReceivedDateBodyTemplate = (item) => {
//     const localFormattedDate = formatUtcToLocal(item.stockReceivedDate);
//     return <span>{item.stockReceivedDate ? localFormattedDate : ''}</span>;
//   };

//   const handleInputChange = (setState, state, value) => {
//     console.log("Nlllll", state);
//     if (!state.rules) {
//       console.error("No rules defined for validation in the state", state);
//       return;
//     }
//     const validation = validate(value, state);
//     setState({
//       ...state,
//       value: value,
//       isValid: validation.isValid,
//       isTouched: true,
//       validationMessages: validation.messages,
//     });
//   };

//   const [searchFromDate, setSearchFromDate] = useState("");
//   const [searchToDate, setSearchToDate] = useState("");

//   const updateOrderListHandler = (stockEntryId) => {
//     const existingOrderList = [...orders];
//     const index = orders.findIndex((o) => o.stockEntryId === stockEntryId);
//     existingOrderList[index].isVoided = true;
//     setOrders(existingOrderList);
//     setIsVoidRemarkShow(false);
//   };

//   return (
//     <>
//       <StockEntryVoid
//         visible={isVoidRemarkShow}
//         onClose={() => {
//           setIsVoidRemarkShow(false);
//         }}
//         stockEntryId={selectedStockEntryId}
//         onUpdateOrderList={updateOrderListHandler}
//       />

//       <div className="flex flex-col justify-between p-5 gap-2 px-10">

//         {/* Header */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-2 md:gap-4">
//             {/* <BackButton
//               onClick={() => navigate("/inventory/list")}
//               title="Back to Inventory"
//             /> */}
//             <h1 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-700">
//              Stock Entry List
//             </h1>
//           </div>

//           <button
//             onClick={() => navigate("/inventory/stockentry/add")}
//             className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-green-700 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:bg-green-800 transition text-sm md:text-base"
//           >
//             <FaPlus className="w-4 h-4" />
//             <span>Create New Stock Entry</span>
//           </button>
//         </div>



//         <div className="flex space-x-4 w-full">
//           <div className="flex flex-col space-y-2 w-1/5">
//             <label className="text-sm font-medium text-gray-700">Filter By</label>
//             <select
//               value={selectedFilterBy.value}
//               onChange={(e) => {
//                 handleInputChange(
//                   setSelectedFilterBy,
//                   selectedFilterBy,
//                   parseInt(e.target.value)
//                 );
//               }}
//               className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition duration-200"
//             >
//               {filterByOptions.map((option) => (
//                 <option key={option.id} value={option.id}>
//                   {option.displayName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {[1, 2, 3].includes(selectedFilterBy.value) && (
//             <div className="flex flex-col space-y-2 w-[35%]">
//               <label className="text-sm font-medium text-gray-700">Search Value</label>
//               <input
//                 type="text"
//                 value={searchValue.value}
//                 onChange={(e) =>
//                   handleInputChange(setSearchValue, searchValue, e.target.value)
//                 }
//                 className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition duration-200"
//               />
//             </div>
//           )}

//           {selectedFilterBy.value === 5 && (
//             <div className="flex gap-4">
//               <input
//                 type="date"
//                 value={
//                   searchFromDate
//                     ? moment(searchFromDate).format("YYYY-MM-DD")
//                     : ""
//                 }
//                 className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition duration-200"
//                 placeholder="From"
//                 onChange={(e) => {
//                   console.log("from date", e.target.value);
//                   setSearchFromDate(
//                     e.target.value ? new Date(e.target.value) : ""
//                   );
//                 }}
//               />

//               <input
//                 type="date"
//                 value={
//                   searchToDate
//                     ? moment(searchToDate).format("YYYY-MM-DD")
//                     : ""
//                 }
//                 className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 transition duration-200"
//                 placeholder="To"
//                 onChange={(e) => {
//                   setSearchToDate(
//                     e.target.value ? new Date(e.target.value) : ""
//                   );
//                 }}
//               />
//             </div>
//           )}

//           {(searchValue.value || searchFromDate || searchToDate) && (
//             <div className="flex items-center mt-7">
//               <button
//                 title="Clear Search"
//                 className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 transition duration-200 ml-3"
//                 onClick={() => {
//                   setSearchValue({ ...searchValue, value: "" });
//                   setSearchFromDate("");
//                   setSearchToDate("");
//                   loadOrders(null, null, null);
//                 }}
//               >
//                 <i className="pi pi-times mr-1"></i> Clear Search
//               </button>
//             </div>
//           )}

//           <div className="flex-1 flex items-center gap-4 mt-7">
//             <button
//               title="Click here to view"
//               className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 transition duration-200"
//               onClick={() => {
//                 loadOrders(
//                   searchValue.value,
//                   moment(searchFromDate).format("YYYY-MM-DD HH:mm:ss"),
//                   moment(searchToDate).format("YYYY-MM-DD HH:mm:ss")
//                 );
//               }}
//             >
//               <i className="pi pi-search mr-2"></i> View
//             </button>
//           </div>
//         </div>

//         {isTableDataLoading ? (
//           <div className="flex justify-between">
//             <p className="text-lg text-gray-700">Loading...</p>
//           </div>
//         ) : (
//           <>
//             <div className="flex flex-col h-[65vh] overflow-hidden">
//               <div className="flex-1 overflow-y-auto">
//                 <table className="w-full border-collapse">
//                   <thead className="sticky top-0 bg-gray-50 z-10 text-sm font-semibold text-gray-700 border-b border-gray-300">
//                     <tr>
//                       <th className="px-4 py-2 text-left">GRN No</th>
//                       <th className="px-4 py-2 text-left">Supplier Bill No</th>
//                       <th className="px-4 py-2 text-left">Supplier</th>
//                       <th className="px-4 py-2 text-left">Total</th>
//                       <th className="px-4 py-2 text-left">Stock Received Date</th>
//                       <th className="px-4 py-2 text-left">Created Date</th>
//                       <th className="px-4 py-2 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((item) => (
//                       <tr
//                         key={item.orderId}
//                         className="border-b border-gray-200 hover:bg-gray-100 bg-gray-50 text-sm text-gray-700"
//                       >
//                         <td className="px-4 py-2">{item.stockEntryRefNo}</td>
//                         <td className="px-4 py-2">{item.supplierBillNo}</td>
//                         <td className="px-4 py-2">{`${item.SupplierCode} | ${item.supplierName}`}</td>
//                         <td className="px-4 py-2">{item.total}</td>
//                         <td className="px-4 py-2">{stockReceivedDateBodyTemplate(item)}</td>
//                         <td className="px-4 py-2">{modifiedDateBodyTemplate(item)}</td>
//                         <td className="px-4 py-2">{actionButtons(item)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div className="flex justify-between w-full p-4">
//               <div className="pl-3">
//                 <span className="text-sm text-gray-500">{totalRecords} items found</span>
//               </div>
//               <DaisyUIPaginator
//                 currentPage={currentPage}
//                 rowsPerPage={rowsPerPage}
//                 totalRecords={totalRecords}
//                 onPageChange={onPageChange}
//                 rowsPerPageOptions={[10, 30, 50, 100]}
//               />
        
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }