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

  const loadOrders = async (_searchValue = null, fromDate = null, toDate = null) => {
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
      loadOrders(null, null, null);
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
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-50 text-gray-600">
            <h2 className="text-xl font-bold">Sales History</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="p-3 rounded-full hover:bg-slate-200 hover:text-red-500 transition-all duration-200"
              aria-label="Close"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              <div className="flex-1 max-w-xs">
                <select
                  value={selectedFilterBy.value}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSelectedFilterBy(prev => ({ ...prev, value: val }));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value={1}>Order Number</option>
                  <option value={5}>Order Date</option>
                </select>
              </div>

              {[1, 2, 3].includes(selectedFilterBy.value) && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue.value}
                  onChange={(e) => setSearchValue(prev => ({ ...prev, value: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && loadOrders(searchValue.value)}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              )}

              {selectedFilterBy.value === 5 && (
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={searchFromDate ? moment(searchFromDate).format("YYYY-MM-DD") : ""}
                    onChange={(e) => setSearchFromDate(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300"
                  />
                  <input
                    type="date"
                    value={searchToDate ? moment(searchToDate).format("YYYY-MM-DD") : ""}
                    onChange={(e) => setSearchToDate(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => loadOrders(
                    searchValue.value,
                    searchFromDate ? moment(searchFromDate).format("YYYY-MM-DD") : null,
                    searchToDate ? moment(searchToDate).format("YYYY-MM-DD") : null
                  )}
                  className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setSearchValue(prev => ({ ...prev, value: "" }));
                    setSearchFromDate("");
                    setSearchToDate("");
                    loadOrders();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            {isTableDataLoading ? (
              <div className="flex justify-center py-12">
                <LoadingPopup text="Loading orders..." />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order No</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tax</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-12 text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        orders.map((item) => (
                          <tr key={item.orderId} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium">{item.orderNo}</td>
                            <td className="px-6 py-4">{item.customerName || "-"}</td>
                            <td className="px-6 py-4">{formatCurrency(item.grossAmount_total, false)}</td>
                            <td className="px-6 py-4">{formatCurrency(item.all_DiscountAmount_total, false)}</td>
                            <td className="px-6 py-4">{formatCurrency(item.lineTaxAmount_total, false)}</td>
                            <td className="px-6 py-4 font-semibold text-sky-600">{formatCurrency(item.grandTotal, false)}</td>
                            <td className="px-6 py-4 text-sm">{formatUtcToLocal(item.createdDate_UTC)}</td>
                            <td className="px-6 py-4">{actionButtons(item)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {totalRecords} order{totalRecords !== 1 ? 's' : ''} found
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
            )}
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIsPaymentConfirmShow(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-50 text-gray-600">
               <h3 className="text-xl font-bold">Payment Receipt</h3>
              <button onClick={() => setIsPaymentConfirmShow(false)}    className="p-3 rounded-full  hover:text-red-500 transition-all duration-200">
                <FaTimes className="text-xl" />
              </button>
            </div>



            <div className="p-6 overflow-y-auto">
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