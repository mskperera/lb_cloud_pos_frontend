import React, { useState, useEffect } from "react";
import moment from "moment";
import { validate } from "../../utils/formValidation";
import { getOrders } from "../../functions/order";
import { getDrpSession } from "../../functions/dropdowns";
import OrderVoidRemark from "../register/OrderVoidRemark";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import GhostButton from "../iconButtons/GhostButton";
import DialogModel from "../model/DialogModel";
import PaymentConfirm from "../../pages/paymentConfirm";

const Paginator = ({ currentPage, rowsPerPage, totalRecords, onPageChange, rowsPerPageOptions = [] }) => {
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handlePageChange = (page) => {
    onPageChange({ page, rows: rowsPerPage });
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number(event.target.value);
    onPageChange({ page: 0, rows: newRowsPerPage });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          &laquo;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-200 ${
              index === currentPage
                ? 'bg-sky-600 text-white'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800'
            }`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          &raquo;
        </button>
      </div>
      {rowsPerPageOptions.length > 0 && (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default function OrderList({ selectingMode,reload }) {
  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);
  const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const [isPaymentConfirmShow,setIsPaymentConfirmShow]=useState(false);


  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    loadOrders(selectedCategoryId, event.page, rowsPerPage);
  };

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

  const loadOrders = async (_searchValue, fromDate, toDate) => {
    try {
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        orderId: null,
        orderNo: selectedFilterBy.value === 1 ? _searchValue : null,
        customerCode: selectedFilterBy.value === 2 ? _searchValue : null,
        customerName: selectedFilterBy.value === 3 ? _searchValue : null,
        orderFromDate: selectedFilterBy.value === 5 ? fromDate : null,
        orderToDate: selectedFilterBy.value === 5 ? toDate : null,
        skip: skip,
        limit: limit,
      };
      console.log("filteredData", filteredData);
      const _result = await getOrders(filteredData);
      console.log("ppppp", _result);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);

      setOrders(_result.data.results[0]);
      setIsTableDataLoading(false);
    } catch (err) {
      setIsTableDataLoading(false);
      console.log("error:", err);
    }
  };

  useEffect(() => {
    console.log("useEffect lo");
    loadOrders(null, null, null);
  }, [currentPage, rowsPerPage,reload]);

  const [filterByOptions, setFilterByOptions] = useState([
    { id: 1, displayName: "Order Number" },
    { id: 2, displayName: "Customer Code" },
    { id: 3, displayName: "Customer Name" },
    { id: 5, displayName: "Order Date" },
  ]);

  const [sessionsOptions, setSessionsOptions] = useState([]);

  const loadDrpSession = async () => {
    const objArr = await getDrpSession();
    setSessionsOptions(objArr.data.results[0]);
  };

  useEffect(() => {
    loadDrpSession();
  }, []);

  const actionButtons = (o) => (
    <div className="flex space-x-2">
      <GhostButton
        onClick={() => {
setIsPaymentConfirmShow(true);
setSelectedOrderId(o.orderId);
         // window.open(`/paymentConfirm?orderId=${o.orderId}`, "_blank");
        }}
        iconClass="pi pi-copy"
        color="text-blue-500"
        hoverClass="hover:text-blue-700 hover:bg-transparent"
        aria-label="View Receipt"
      />
      {!o.isVoided ? (
        <GhostButton
          onClick={async () => {
            setSelectedOrderId(o.orderId);
            setIsVoidRemarkShow(true);
          }}
          iconClass="pi pi-stop"
          color="text-red-500"
          hoverClass="hover:text-red-700 hover:bg-transparent"
          aria-label="Void Order"
        />
      ) : (
        <div className="text-red-600 font-medium">Voided</div>
      )}
    </div>
  );

  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", state);
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
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

  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");

  const updateOrderListHandler = (orderId) => {
    const existingOrderList = [...orders];
    const index = orders.findIndex((o) => o.orderId === orderId);
    existingOrderList[index].isVoided = true;
    setOrders(existingOrderList);
    setIsVoidRemarkShow(false);
  };

  const orderNoBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.orderNo}</span>
  );

  const customerBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : (
      rowData.customerName
    )
  );

  const grossAmountBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.grossAmount_total, false)}</span>
  );

  const discountBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.all_DiscountAmount_total, false)}</span>
  );

  const taxBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.lineTaxAmount_total, false)}</span>
  );

  const grandTotalBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.grandTotal, false)}</span>
  );

  const modifiedDateBodyTemplate = (item) => {
    const localFormattedDate = formatUtcToLocal(item.createdDate_UTC);
    return isTableDataLoading ? <span>Loading...</span> : <span>{item.createdDate_UTC ? localFormattedDate : ''}</span>;
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(0);
  };

  return (
    <>
      <OrderVoidRemark
        visible={isVoidRemarkShow}
        onClose={() => {
          setIsVoidRemarkShow(false);
        }}
        orderId={selectedOrderId}
        onUpdateOrderList={updateOrderListHandler}
      />
  <DialogModel
        header={"Payment Receipt"}
        visible={isPaymentConfirmShow}
        onHide={() => setIsPaymentConfirmShow(false)}
        fullWidth={true}
  fullHeight={true}
      >
    <PaymentConfirm orderId={selectedOrderId} setIsPaymentConfirmShow={setIsPaymentConfirmShow} openBy="SalesHistory" />
      </DialogModel>

      <div className="flex flex-col p-6 gap-4 bg-gray-50 rounded-lg shadow-sm">
        {/* <div>
          <h3 className="text-center text-2xl font-bold text-gray-900">Sales History</h3>
        </div> */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 w-full">
          <div className="flex flex-col space-y-2 w-full sm:w-1/5">
            <label className="text-sm font-medium text-gray-700">Filter By</label>
            <select
              value={selectedFilterBy.value}
              onChange={(e) => {
                handleInputChange(
                  setSelectedFilterBy,
                  selectedFilterBy,
                  parseInt(e.target.value)
                );
              }}
              className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
            >
              {filterByOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>


          {[1, 2, 3].includes(selectedFilterBy.value) && (
            <div className="flex flex-col space-y-2 w-full sm:w-1/3 mt-4 sm:mt-0">
              <label className="text-sm font-medium text-gray-700">Search Value</label>
              <input
                type="text"
                value={searchValue.value}
                onChange={(e) =>
                  handleInputChange(setSearchValue, searchValue, e.target.value)
                }
                className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                placeholder="Enter search term"
              />
            </div>
          )}

          {selectedFilterBy.value === 5 && (
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-1/3 mt-4 sm:mt-0">
              <div className="flex flex-col space-y-2 w-full">
                <label className="text-sm font-medium text-gray-700">From Date</label>
                <input
                  type="date"
                  value={searchFromDate ? moment(searchFromDate).format("YYYY-MM-DD") : ""}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                  placeholder="From"
                  onChange={(e) => {
                    setSearchFromDate(e.target.value ? new Date(e.target.value) : "");
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2 w-full mt-4 sm:mt-0">
                <label className="text-sm font-medium text-gray-700">To Date</label>
                <input
                  type="date"
                  value={searchToDate ? moment(searchToDate).format("YYYY-MM-DD") : ""}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                  placeholder="To"
                  onChange={(e) => {
                    setSearchToDate(e.target.value ? new Date(e.target.value) : "");
                  }}
                />
              </div>
            </div>
          )}

          {(searchValue.value || searchFromDate || searchToDate) && (
            <div className="flex items-end mt-4 sm:mt-0">
              <button
                title="Clear Search"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition duration-200"
                onClick={() => {
                  setSearchValue({ ...searchValue, value: "" });
                  setSearchFromDate("");
                  setSearchToDate("");
                  loadOrders(null, null, null);
                }}
              >
                <i className="pi pi-times mr-2"></i> Clear Search
              </button>
            </div>
          )}

          <div className="flex-1 flex items-end gap-4 mt-4 sm:mt-0">
            <button
              title="Click here to view"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200"
              onClick={() => {
                loadOrders(
                  searchValue.value,
                  moment(searchFromDate).format("YYYY-MM-DD HH:mm:ss"),
                  moment(searchToDate).format("YYYY-MM-DD HH:mm:ss")
                );
              }}
            >
              <i className="pi pi-search mr-2"></i> View
            </button>
          </div>
        </div>

        {isTableDataLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col h-[65vh] overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-100 z-10 text-sm font-semibold text-gray-700 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Order No</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Gross Amount</th>
                      <th className="px-4 py-3 text-left">Discounts</th>
                      <th className="px-4 py-3 text-left">Tax</th>
                      <th className="px-4 py-3 text-left">Grand Total</th>
                      <th className="px-4 py-3 text-left">Created Date</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((item) => (
                      <tr
                        key={item.orderId}
                        className="border-b border-gray-200 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <td className="px-4 py-3">{orderNoBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{customerBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{grossAmountBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{discountBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{taxBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{grandTotalBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{modifiedDateBodyTemplate(item)}</td>
                        <td className="px-4 py-3">{actionButtons(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center p-4">
              <div className="text-sm text-gray-500">{totalRecords} items found</div>
              <Paginator
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPageOptions={[10, 20, 30, 50, 100]}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import moment from "moment";
// import { validate } from "../../utils/formValidation";
// import { getOrders } from "../../functions/order";
// import { getDrpSession } from "../../functions/dropdowns";
// import OrderVoidRemark from "../register/OrderVoidRemark";
// import { formatCurrency, formatUtcToLocal } from "../../utils/format";
// import GhostButton from "../iconButtons/GhostButton";
// import Pagination from "../pagination/Pagination";

// export default function OrderList({ selectingMode }) {
//   const [orders, setOrders] = useState([]);
//   const [isTableDataLoading, setIsTableDataLoading] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
//   const [currentPage, setCurrentPage] = useState(0);

//   const [rowsPerPage, setRowsPerPage] = useState(30);
//   const [totalRecords, setTotalRecords] = useState(10);
//   const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState("");



//   const totalPages = Math.ceil(totalRecords / rowsPerPage);

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

//       // const frmoUtc=moment(searchFromDate);

//       // const _searchValue=searchValue.value===''?null:searchValue.value;
//       const filteredData = {
//         orderId: null,
//         orderNo: selectedFilterBy.value === 1 ? _searchValue : null,
//         customerCode: selectedFilterBy.value === 2 ? _searchValue : null,
//         customerName: selectedFilterBy.value === 3 ? _searchValue : null,
//         orderFromDate: selectedFilterBy.value === 5 ? fromDate : null,
//         orderToDate: selectedFilterBy.value === 5 ? toDate : null,
//         skip: skip,
//         limit: limit,
//       };
//       console.log("filteredData", filteredData);
//       const _result = await getOrders(filteredData);
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

//   //   useEffect(() => {
//   //     console.log("useEffect search by value");
//   //     if(searchValue.value){
//   //     const delayedLoadCustomers = setTimeout(() => {
//   //         loadOrders(selectedCategoryId);
//   //     }, 1000);

//   //     return () => clearTimeout(delayedLoadCustomers);
//   //   }

//   // }, [searchValue.value]);

//   const [filterByOptions, setFilterByOptions] = useState([
//     { id: 1, displayName: "Order Number" },
//     { id: 2, displayName: "Customer Code" },
//     { id: 3, displayName: "Customer Name" },
//     { id: 5, displayName: "Order Date" },
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
//           <GhostButton
//            onClick={() => {
//             window.open(`/paymentConfirm?orderId=${o.orderId}`, "_blank");
//           }}
//           iconClass="pi pi-copy"
//             //tooltip="View Receipt"
//           color="text-blue-500"
//           hoverClass="hover:text-blue-700 hover:bg-transparent"
//          aria-label="Delete"
//         />

// {!o.isVoided ? (<GhostButton
//           onClick={async () => {
//             setSelectedOrderId(o.orderId);
//             setIsVoidRemarkShow(true);
//           }}
//           iconClass="pi pi-stop"
//            // tooltip="Void Order"
//           color="text-red-500"
//           hoverClass="hover:text-red-700 hover:bg-transparent"
//          aria-label="Void Order"
//         />
//       ) : (
//         <div>Voided</div>
//       )}
     

    
//     </div>
//   );

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

//   const updateOrderListHandler = (orderId) => {
//     const existingOrderList = [...orders];
//     const index = orders.findIndex((o) => o.orderId === orderId);
//     existingOrderList[index].isVoided = true;
//     setOrders(existingOrderList);
//     setIsVoidRemarkShow(false);
//   };





//   const orderNoBodyTemplate = (rowData) => (
//     isTableDataLoading ? <span>Loading...</span> : <span>{rowData.orderNo}</span>
//   );

//   const customerBodyTemplate = (rowData) => (
//     isTableDataLoading ? <span>Loading...</span> :<>{rowData.customerCode ?  <span>{`${rowData.customerCode} | ${rowData.customerName}`}</span>:'walk-in cutomer'}</>
//   );

//   const grossAmountBodyTemplate = (rowData) => (
//     isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.grossAmount_total,false)}</span>
//   );

//   const discountBodyTemplate = (rowData) => (
//     isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.all_DiscountAmount_total,false)}</span>
//   );

//   const taxBodyTemplate = (rowData) => (
//     isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.lineTaxAmount_total,false)}</span>
//   );

//   const grandTotalBodyTemplate = (rowData) => (
//     isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.grandTotal,false)}</span>
//   );

//   const modifiedDateBodyTemplate = (item) => {
//     const localFormattedDate =formatUtcToLocal(item.createdDate_UTC);
//     return isTableDataLoading ? <span>Loading...</span> : <span>{item.createdDate_UTC ? localFormattedDate : ''}</span>;
//   };

//   const handleRowsPerPageChange = (rows) => {
//     setRowsPerPage(rows);
//     setCurrentPage(1);
//   };

//   return (
//     <>
   
//       <OrderVoidRemark
//         visible={isVoidRemarkShow}
//         onClose={() => {
//           setIsVoidRemarkShow(false);
//         }}
//         orderId={selectedOrderId}
//         onUpdateOrderList={updateOrderListHandler}
//       />

//       <div className="flex flex-col justify-between  p-5 gap-2">
//       <div className="pt-0">
//         <h3 className="text-center font-bold text-2xl">Sales History</h3>
//       </div>
      
//         <div className="flex space-x-4 w-full">
//           <div className="flex flex-col space-y-2 w-1/5">
//             <label className="text-[1rem]">Filter By</label>
//             <select
//               value={selectedFilterBy.value}
//               onChange={(e) => {
//                 handleInputChange(
//                   setSelectedFilterBy,
//                   selectedFilterBy,
//                   parseInt(e.target.value)
//                 );
//               }}
//               className="select select-bordered w-full"
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
//               <label className="text-[1rem]">Search Value</label>
//               <input
//                 type="text"
//                 value={searchValue.value}
//                 onChange={(e) =>
//                   handleInputChange(setSearchValue, searchValue, e.target.value)
//                 }
//                 className="input input-bordered w-full"
//               />
//             </div>
//           )}

//           {selectedFilterBy.value === 5 && (
//             <>
//               {/* {JSON.stringify(searchFromDate)} */}
//               <div className="flex gap-4">
//                 <input
//                   type="date"
//                   value={
//                     searchFromDate
//                       ? moment(searchFromDate).format("YYYY-MM-DD")
//                       : ""
//                   }
//                   className="input input-bordered w-full"
//                   placeholder="From"
//                   onChange={(e) => {
//                     console.log("from date", e.target.value);
//                     setSearchFromDate(
//                       e.target.value ? new Date(e.target.value) : ""
//                     );
//                   }}
//                 />

//                 <input
//                   type="date"
//                   value={
//                     searchToDate
//                       ? moment(searchToDate).format("YYYY-MM-DD")
//                       : ""
//                   }
//                   className="input input-bordered w-full"
//                   placeholder="To"
//                   onChange={(e) => {
//                     setSearchToDate(
//                       e.target.value ? new Date(e.target.value) : ""
//                     );
//                   }}
//                 />
//               </div>
//             </>
//           )}

//           {/* Clear Search Button */}
//           {(searchValue.value || searchFromDate || searchToDate) && (
//                  <div className="flex items-center mt-7">
//           <button
//               title="Clear Search"
//               className="btn btn-ghost btn-sm ml-3"
//               onClick={() => {
//                 setSearchValue({ ...searchValue, value: "" });
//                 setSearchFromDate("");
//                 setSearchToDate("");
//                 loadOrders(null, null, null);
//               }}
//             >
//               <i className="pi pi-times"></i> Clear Search 
//             </button>
//             </div>
//           )}

//           {/* View Button */}
//           <div className="flex-1 flex items-center gap-4 mt-7">
//             <button
//               title="Click here to view"
//               className="btn btn-primary"
//               onClick={() => {
//                 loadOrders(
//                   searchValue.value,
//                   moment(searchFromDate).format("YYYY-MM-DD HH:mm:ss"),
//                   moment(searchToDate).format("YYYY-MM-DD HH:mm:ss")
//                 );
//               }}
//             >
//               <i className="pi pi-search"></i> View
//             </button>
//           </div>

//           {/* Select Order Button */}
//           {/* <div className="flex items-end gap-4">
//             <button
//               title="Select Order"
//               className={`btn btn-success btn-sm ${
//                 !selectedCustomer ? "btn-disabled" : ""
//               }`}
//               onClick={() => {
//                 if (selectedCustomer) onselect(selectedCustomer.customerId);
//               }}
//             >
//               <i className="pi pi-play"></i>
//             </button>
//           </div> */}
//         </div>

//         {isTableDataLoading ? (
//           <div className="flex justify-between">
//             <p className="text-lg">Loading...</p>
//           </div>
//         ) : (
//           <>
//           <div className="flex flex-col h-[65vh] overflow-hidden">
//             <div className="flex-1 overflow-y-auto">
//               <table className="table w-full border-collapse">
//                 <thead className="sticky top-0 bg-slate-50 z-10 text-[1rem] border-b border-gray-300">
//                   <tr>
//                     {/* <th className="px-4 py-2">orderId</th> */}
//                     <th className="px-4 py-2">order No</th>
//                     <th className="px-4 py-2">Customer</th>
//                     <th className="px-4 py-2">Gross Amount</th>
//                     <th className="px-4 py-2">Discounts</th>
//                     <th className="px-4 py-2">Tax</th>
//                     <th className="px-4 py-2">Grand Total</th>
//                     <th className="px-4 py-2">Created Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((item) => (
//                     <tr
//                       key={item.orderId}
//                       className="border-b border-gray-200 hover:bg-gray-100 bg-slate-50 text-[1rem]"
//                     >
//                       {/* {JSON.stringify(item)} */}
//                       {/* <td className="px-4 py-2">{item.productId}</td> */}
//                       <td className="px-4 py-2">
//                         {orderNoBodyTemplate(item)}
//                       </td>
//                       <td className="px-4 py-2">
//                         {customerBodyTemplate(item)}
//                       </td>
//                       <td className="px-4 py-2">
//                         {grossAmountBodyTemplate(item)}
//                       </td>
//                       <td className="px-4 py-2">
//                         {discountBodyTemplate(item)}
//                       </td>
//                       <td className="px-4 py-2">{taxBodyTemplate(item)}</td>

//                       <td className="px-4 py-2">
//                         {grandTotalBodyTemplate(item)}
//                       </td>
//                       <td className="px-4 py-2">
//                         {modifiedDateBodyTemplate(item)}
//                       </td>
//                       <td className="px-4 py-2">{actionButtons(item)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
    
 
//             </div>
//           </div>
//               <div className="flex justify-between w-full  p-4">
//               {/* Items count display */}
//               <div className="pl-3">
//                 <span className=" text-gray-500">{totalRecords} items found</span>
//               </div>
      
//          <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     rowsPerPageOptions={[10, 20, 30, 50, 100]}
//                     rowsPerPage={rowsPerPage}
//                     onPageChange={onPageChange}
//                     onRowsPerPageChange={handleRowsPerPageChange}
//                   />
         

//               {/* <DaisyUIPaginator
//                 currentPage={currentPage}
//                rowsPerPage={rowsPerPage}
//                 totalRecords={totalRecords}
//                 onPageChange={onPageChange}
//                 rowsPerPageOptions={[10, 30, 50, 100]}
//               /> */}
//             </div>
//             </>
//         )}

//       </div>
//     </>
//   );
// }
