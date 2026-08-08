import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { getOrders } from "../../functions/order";
import OrderVoidRemark from "../register/OrderVoidRemark";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import GhostButton from "../iconButtons/GhostButton";
import PaymentConfirm from "../../pages/paymentConfirm";
import DaisyUIPaginator from "../../components/DaisyUIPaginator";
import { XIcon } from "lucide-react";
import DialogModel2 from "../model/DialogModel2";
import ReusableTable from "../ReusableTable";

export default function OrderList({ isVisible, setIsVisible }) {
  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isPaymentConfirmShow, setIsPaymentConfirmShow] = useState(false);

const selectedTerminal=JSON.parse(localStorage.getItem('terminal'));

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

  const loadOrders = useCallback(async (_searchValue = null, fromDate = null, toDate = null, resetSkipAndLimit = false) => {
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

      setIsTableDataLoading(true);
      const skip = resetSkipAndLimit ? 0 : currentPage * rowsPerPage;
      const limit = rowsPerPage;

      //console.log('selectedTerminaId',selectedTerminaId)
      const filteredData = {
        terminalId:selectedTerminal.terminalId,
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
  }, [currentPage, rowsPerPage, selectedFilterBy.value]);

  useEffect(() => {
    if (isVisible) {
      loadOrders(searchValue.value, searchFromDate, searchToDate, false);
    }
  }, [isVisible, searchFromDate, searchToDate, loadOrders, searchValue.value]);

  const actionButtons = (o) => (
    <div className="flex space-x-2 justify-end">
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

const orderColumns = [
    { key: "orderNo", header: "Invoice No" },
    { key: "customerName", header: "Customer" },
    {
      key: "grossAmount_total",
      header: "Gross",
      headerClass: "text-right",
      cellClass: "text-right font-mono",
      render: (item) => formatCurrency(item.grossAmount_total, false),
    },
    {
      key: "all_DiscountAmount_total",
      header: "Discount",
      headerClass: "text-right",
      cellClass: "text-right font-mono",
      render: (item) => formatCurrency(item.all_DiscountAmount_total, false),
    },
    {
      key: "lineTaxAmount_total",
      header: "Tax",
      headerClass: "text-right",
      cellClass: "text-right font-mono",
      render: (item) => formatCurrency(item.lineTaxAmount_total, false),
    },
    {
      key: "grandTotal",
      header: "Total",
      headerClass: "text-right",
      cellClass: "text-right font-mono font-semibold text-sky-600",
      render: (item) => formatCurrency(item.grandTotal, false),
    },
    {
      key: "createdDate_UTC",
      header: "Date",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (item) => formatUtcToLocal(item.createdDate_UTC),
    },
  ];
  const updateOrderListHandler = (orderId) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, isVoided: true } : o));
    setIsVoidRemarkShow(false);
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
       {/* Body - Scrollable */}
          <div className="flex-1 p-4">
            <ReusableTable
              data={orders}
              isLoading={isTableDataLoading}
              columns={orderColumns}
              emptyMessage="No orders found"
              customActions={(item) => actionButtons(item)}
            />
       
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