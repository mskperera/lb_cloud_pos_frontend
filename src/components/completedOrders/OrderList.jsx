import React, { useState, useEffect } from "react";
import moment from "moment";
import { validate } from "../../utils/formValidation";
import { getOrders } from "../../functions/order";
import { getDrpSession } from "../../functions/dropdowns";
import OrderVoidRemark from "../register/OrderVoidRemark";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import GhostButton from "../iconButtons/GhostButton";
import PaymentConfirm from "../../pages/paymentConfirm";
import LoadingPopup from "../LoadingPopup";
import DaisyUIPaginator from "../../components/DaisyUIPaginator";
import { FaTimes } from "react-icons/fa";
import { XIcon } from "lucide-react";

export default function OrderList({ isVisible, setIsVisible }) {
  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
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

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop + Panel */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Panel */}
        <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between py-2 pl-6 pr-2 border-b border-gray-300 bg-gray-200 text-gray-600">
            <h2 className="text-xl font-bold">Sales History</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="p-3 rounded-full hover:bg-slate-200 hover:text-red-500 transition-all duration-200"
              aria-label="Close"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Filters */}

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
      
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
        </div>
      </div>

      {/* Reusable Modals */}
      <OrderVoidRemark
        visible={isVoidRemarkShow}
        onClose={() => setIsVoidRemarkShow(false)}
        orderId={selectedOrderId}
        onUpdateOrderList={updateOrderListHandler}
      />

      {isPaymentConfirmShow && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsPaymentConfirmShow(false)
          }
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between py-2 pl-6 pr-2 border-b border-gray-200 bg-gradient-to-r from-slate-200 to-slate-200 text-gray-600">
              <h3 className="text-xl font-bold">Payment Receipt</h3>
              <button
                onClick={() => setIsPaymentConfirmShow(false)}
                className="p-3 rounded-full  hover:text-red-500 transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <PaymentConfirm
                orderId={selectedOrderId}
                setIsPaymentConfirmShow={setIsPaymentConfirmShow}
                openBy="SalesHistory"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}