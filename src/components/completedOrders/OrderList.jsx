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
import LoadingPopup from "../LoadingPopup";
import DaisyUIPaginator from "../../components/DaisyUIPaginator";


export default function OrderList({ isVisible,setIsVisible }) {
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
   
               console.log(' event.page', event);
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
      console.log('currentpage',currentPage);
           console.log('rowsPerPage',rowsPerPage);
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
    if(isVisible){
    console.log("useEffect lo");
    loadOrders(null, null, null);
    }
  }, [currentPage, rowsPerPage,isVisible]);

  const [filterByOptions, setFilterByOptions] = useState([
    { id: 1, displayName: "Order Number" },
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
    <div className="">
      <OrderVoidRemark
        visible={isVoidRemarkShow}
        onClose={() => {
          setIsVoidRemarkShow(false);
        }}
        orderId={selectedOrderId}
        onUpdateOrderList={updateOrderListHandler}
      />


      <div className="flex flex-col p-6 gap-4 bg-gray-50 rounded-lg shadow-sm">


      
        {isTableDataLoading ? 
  <div className="w-1/2">
  <LoadingPopup text="Opening Sales History Panel…" />
  </ div>:

          <DialogModel
        header="Sales History"
        visible={true}
        maximizable
        maximized={true}
        fullHeight={true} fullWidth={true}
        onHide={() => setIsVisible(false)}
      >
<>


 


        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 mb-5">
         
          <DialogModel
        header={"Payment Receipt"}
        visible={isPaymentConfirmShow}
        onHide={() => setIsPaymentConfirmShow(false)}
        fullWidth={true}
  fullHeight={true}
      >
    <PaymentConfirm orderId={selectedOrderId} setIsPaymentConfirmShow={setIsPaymentConfirmShow} openBy="SalesHistory" />
      </DialogModel>
         
          <div className="flex flex-col ">
            {/* <label className=" font-medium text-gray-700">Filter By</label> */}
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
              {/* <label className="font-medium text-gray-700">Search Value</label> */}
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
                  <thead className="sticky top-0 bg-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Order No</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Gross Amount</th>
                      <th className="px-4 py-3 text-left">Discounts</th>
                      <th className="px-4 py-3 text-left">Tax</th>
                      <th className="px-4 py-3 text-left">Grand Total</th>
                      <th className="px-4 py-3 text-left">Created Date</th>
                      <th className="px-4 py-3 text-left"></th>
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


              <DaisyUIPaginator
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                        rowsPerPageOptions={[10, 20, 30, 50, 100]}
                      /> 

            </div>
          </>
        )}

</>
</DialogModel>
      }

      </div>
    </div>
  );
}