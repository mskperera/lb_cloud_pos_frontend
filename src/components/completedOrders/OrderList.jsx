import React, { useState, useEffect } from "react";
import moment from "moment";
import { getOrders } from "../../functions/order";
import OrderVoidRemark from "../register/OrderVoidRemark";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import GhostButton from "../iconButtons/GhostButton";
import PaymentConfirm from "../../pages/paymentConfirm";
import DaisyUIPaginator from "../../components/DaisyUIPaginator";
import { FaTimes } from "react-icons/fa";
import { XIcon } from "lucide-react";
import CloseButton from "../buttons/CloseButton";
import DialogModel2 from "../model/DialogModel2";

export default function OrderList({ isVisible, setIsVisible }) {
  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isPaymentConfirmShow, setIsPaymentConfirmShow] = useState(false);

const selectedTerminaId=JSON.parse(localStorage.getItem('terminalId'));

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

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
  };

  const loadOrders = async (_searchValue = null, fromDate = null, toDate = null,resetSkipAndLimit=false) => {
    try {

    if(_searchValue!==null )
      {
      if(_searchValue.trim()==="")
        _searchValue=null;
    }

    if(fromDate!==null){
      if(fromDate.trim()==="")
        fromDate=null;
    }

      if(toDate!==null){
      if(toDate.trim()==="")
        toDate=null;
    }

      console.log("searchValue",_searchValue,"fromDate",fromDate,"toDate",toDate);

      setIsTableDataLoading(true);
      const skip =resetSkipAndLimit ? 0 : currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        terminalId:selectedTerminaId,
        orderId: null,
        orderNo: selectedFilterBy.value === 1 ? _searchValue : null,
        customerCode: selectedFilterBy.value === 2 ? _searchValue : null,
        customerName: selectedFilterBy.value === 3 ? _searchValue : null,
        orderFromDate: selectedFilterBy.value === 5 ? fromDate : null,
        orderToDate: selectedFilterBy.value === 5 ? toDate : null,
        skip,
        limit,
      };

      const _result = await getOrders(filteredData);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      setOrders(_result.data.results[0] || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      setOrders([]);
    } finally {
      setIsTableDataLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadOrders(searchValue.value, searchFromDate, searchToDate, false);
    }
  }, [isVisible, currentPage, rowsPerPage]);

  const actionButtons = (o) => (
    <div className="flex space-x-2">
      <GhostButton
        onClick={() => {
          setSelectedOrderId(o.orderId);
          setIsPaymentConfirmShow(true);
        }}
        iconClass="pi pi-copy"
        color="text-blue-500"
        hoverClass="hover:text-blue-700"
        aria-label="View Receipt"
        tooltip="View Receipt"
      />
      {!o.isVoided ? (
        <GhostButton
          onClick={() => {
            setSelectedOrderId(o.orderId);
            setIsVoidRemarkShow(true);
          }}
          iconClass="pi pi-stop"
          color="text-red-500"
          hoverClass="hover:text-red-700"
          aria-label="Void Order"
          tooltip="Void Order"
        />
      ) : (
        <span className="text-red-600 font-medium text-xs">Voided</span>
      )}
    </div>
  );

  const updateOrderListHandler = (orderId) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, isVoided: true } : o));
    setIsVoidRemarkShow(false);
  };

  // Close panel when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
    }
  };

  return (
    <>
 
    <DialogModel2 onHide={() => setIsVisible(false)} title="Sales History"   isVisible={isVisible}>

   

          {/* Improved Filter/Search Panel Layout */}
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
                  loadOrders(
                    searchValue.value,
                    searchFromDate,
                    searchToDate,
                    false,
                  );
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value={1}>Invoice No</option>
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
                      loadOrders(null, null, null, true);
                    }
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && loadOrders(searchValue.value);
                  }}
                  className="w-full py-3 pl-4 pr-10 text-base font-medium bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 shadow-sm"
                />
                {searchValue.value && (
                  <button
                    onClick={() => {
                      setSearchValue((prev) => ({ ...prev, value: "" }));
                      setSearchFromDate("");
                      setSearchToDate("");
                      loadOrders(null, null, null, true);
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
                    loadOrders(
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

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
      
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Invoice No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Gross
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tax
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!isTableDataLoading ? (
                      orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-12 text-gray-500"
                          >
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((item) => (
                          <tr
                            key={item.orderId}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 font-medium">
                              {item.orderNo}
                            </td>
                            <td className="px-6 py-4">
                              {item.customerName || "-"}
                            </td>
                            <td className="px-6 py-4">
                              {formatCurrency(item.grossAmount_total, false)}
                            </td>
                            <td className="px-6 py-4">
                              {formatCurrency(
                                item.all_DiscountAmount_total,
                                false,
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {formatCurrency(item.lineTaxAmount_total, false)}
                            </td>
                            <td className="px-6 py-4 font-semibold">
                              {formatCurrency(item.grandTotal, false)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {formatUtcToLocal(item.createdDate_UTC)}
                            </td>
                            <td className="px-6 py-4">{actionButtons(item)}</td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-12">
                          <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200">
                              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Waiting...
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tablet Card View (md to lg) */}
            <div className="hidden md:block lg:hidden space-y-2">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm font-medium">No orders found</div>
                  <div className="text-xs mt-1">Try adjusting your search filters</div>
                </div>
              ) : isTableDataLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                  <div className="text-xs text-gray-600 mt-2">Loading orders...</div>
                </div>
              ) : (
                orders.map((item) => (
                  <div
                    key={item.orderId}
                    className="bg-white rounded-lg border border-gray-200 p-3 transition-all hover:bg-gray-50 active:bg-gray-100 text-sm"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm mb-1">
                          {item.orderNo}
                        </div>
                        <div className="text-xs text-gray-500">
                          Customer: {item.customerName || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Date: {formatUtcToLocal(item.createdDate_UTC)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sky-600 text-sm">
                          {formatCurrency(item.grandTotal)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Gross: {formatCurrency(item.grossAmount_total)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tax: {formatCurrency(item.lineTaxAmount_total)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-end">
                      {actionButtons(item)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2 xs:space-y-2.5">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-xs xs:text-sm font-medium">No orders found</div>
                  <div className="text-xs mt-0.5">Try adjusting filters</div>
                </div>
              ) : isTableDataLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin w-7 h-7 border-3 border-sky-500 border-t-transparent rounded-full"></div>
                  <div className="text-xs text-gray-600 mt-2">Loading...</div>
                </div>
              ) : (
                orders.map((item) => (
                  <div
                    key={item.orderId}
                    className="p-2.5 xs:p-3 transition-all active:bg-gray-100 bg-gray-50 text-xs xs:text-sm"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 line-clamp-2">
                          {item.orderNo}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Customer: {item.customerName || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Date: {formatUtcToLocal(item.createdDate_UTC)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-1">
                        <div className="font-bold text-sky-600">
                          {formatCurrency(item.grandTotal)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Gross: {formatCurrency(item.grossAmount_total)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-end">
                      {actionButtons(item)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Pagination - fixed at bottom, outside scroll */}
          <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                {totalRecords} order{totalRecords !== 1 ? "s" : ""} found
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

      </DialogModel2>

      {/* Reusable Modals */}
      <OrderVoidRemark
        visible={isVoidRemarkShow}
        onClose={() => setIsVoidRemarkShow(false)}
        orderId={selectedOrderId}
        onUpdateOrderList={updateOrderListHandler}
      />

      {isPaymentConfirmShow && (


    <DialogModel2 onHide={() => setIsPaymentConfirmShow(false)} title="Payment Receipt"   isVisible={isPaymentConfirmShow}>

            <div className="p-4 overflow-y-auto">
              <PaymentConfirm
                orderId={selectedOrderId}
                setIsPaymentConfirmShow={setIsPaymentConfirmShow}
                openBy="SalesHistory"
              />
            </div>
</DialogModel2>



          
      )}
    </>
  );
}