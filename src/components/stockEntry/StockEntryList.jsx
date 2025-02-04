import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { getDrpSession } from "../../functions/dropdowns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faStop } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import DaisyUIPaginator from "../../components/DaisyUIPaginator";
import { getStockEntries } from "../../functions/stockEntry";
import StockEntryVoid from "./StockEntryVoid";
import { validate } from "../../utils/formValidation";

export default function StockEntryList({ selectingMode }) {

  const store = JSON.parse(localStorage.getItem("stores"))[0];

  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);
  const [isVoidRemarkShow, setIsVoidRemarkShow] = useState(false);
  const [selectedStockEntryId, setSelectedOrderId] = useState("");

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

      // const _searchValue=searchValue.value===''?null:searchValue.value;
      const filteredData = {
        stockEntryId: null,
        storeId:store.storeId,
        stockEntryRefNo: selectedFilterBy.value === 1 ? _searchValue : null,
        supplierCode: selectedFilterBy.value === 2 ? _searchValue : null,
        suppliertName: selectedFilterBy.value === 3 ? _searchValue : null,
        fromDate: selectedFilterBy.value === 5 ? fromDate : null,
        toDate: selectedFilterBy.value === 5 ? toDate : null,
        skip: skip,
        limit: limit,
      };
      console.log("filteredData", filteredData);
      const _result = await getStockEntries(filteredData);
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
  }, [currentPage, rowsPerPage]);

  const [filterByOptions, setFilterByOptions] = useState([
    { id: 1, displayName: "GRN No" },
    { id: 2, displayName: "Supplier Code" },
    { id: 3, displayName: "Supplier Name" },
    { id: 5, displayName: "Stock Entry Date" },
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
      <button
        className="btn btn-primary btn-xs bg-primaryColor border-none text-base-100 "
        onClick={() => {
          window.open(`/inventory/stockEntryFull?stockEntryId=${o.stockEntryId}`, "_blank");
          // navigate(`/paymentConfirm?orderNo=${o.orderNo}`);
          // onselect(customer.customerId);
        }}
        tooltip="View Receipt"
        aria-label="Delete"
      >
        <FontAwesomeIcon icon={faEye} />
      </button>

      {!o.isVoided ? (
        <button
          onClick={async () => {
            setSelectedOrderId(o.stockEntryId);
            setIsVoidRemarkShow(true);
          }}
          className="btn btn-warning btn-xs bg-[#f87171] border-none text-base-100"
          aria-label="Select"
          tooltip="Void Stock Entry"
        >
          <FontAwesomeIcon icon={faStop} />
        </button>
      ) : (
        <div>Voided</div>
      )}
    </div>
  );

  const modifiedDateBodyTemplate = (item) => {
    const localFormattedDate =formatUtcToLocal(item.CreatedDate_UTC);
    return isTableDataLoading ? <span>Loading...</span> : <span>{item.CreatedDate_UTC ? localFormattedDate : ''}</span>;
  };

  const stockReceivedDateBodyTemplate = (item) => {
    const localFormattedDate =formatUtcToLocal(item.stockReceivedDate);
    return  <span>{item.stockReceivedDate ? localFormattedDate : ''}</span>;
  };

  const customer = (customer) => {
    return <span>{`${customer.customerCode} | ${customer.customerName}`}</span>;
  };

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

  const updateOrderListHandler = (stockEntryId) => {
    const existingOrderList = [...orders];
    const index = orders.findIndex((o) => o.stockEntryId === stockEntryId);
    existingOrderList[index].isVoided = true;
    setOrders(existingOrderList);
    setIsVoidRemarkShow(false);
  };

  return (
    <>
   
      <StockEntryVoid
        visible={isVoidRemarkShow}
        onClose={() => {
          setIsVoidRemarkShow(false);
        }}
        stockEntryId={selectedStockEntryId}
        onUpdateOrderList={updateOrderListHandler}
      />

      <div className="flex flex-col justify-between  p-5 gap-2">
      <div className="col-span-2">
<h3 className="text-center font-bold text-xl">Stock Entry List</h3>       
</div>
        <div className="flex space-x-4 w-full">
          <div className="flex flex-col space-y-2 w-1/5">
            <label className="text-[1rem]">Filter By</label>
            <select
              value={selectedFilterBy.value}
              onChange={(e) => {
                handleInputChange(
                  setSelectedFilterBy,
                  selectedFilterBy,
                  parseInt(e.target.value)
                );
              }}
              className="select select-bordered w-full"
            >
              {filterByOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>

          {[1, 2, 3].includes(selectedFilterBy.value) && (
            <div className="flex flex-col space-y-2 w-[35%]">
              <label className="text-[1rem]">Search Value</label>
              <input
                type="text"
                value={searchValue.value}
                onChange={(e) =>
                  handleInputChange(setSearchValue, searchValue, e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>
          )}

          {selectedFilterBy.value === 5 && (
            <>
              {/* {JSON.stringify(searchFromDate)} */}
              <div className="flex gap-4">
                <input
                  type="date"
                  value={
                    searchFromDate
                      ? moment(searchFromDate).format("YYYY-MM-DD")
                      : ""
                  }
                  className="input input-bordered w-full"
                  placeholder="From"
                  onChange={(e) => {
                    console.log("from date", e.target.value);
                    setSearchFromDate(
                      e.target.value ? new Date(e.target.value) : ""
                    );
                  }}
                />

                <input
                  type="date"
                  value={
                    searchToDate
                      ? moment(searchToDate).format("YYYY-MM-DD")
                      : ""
                  }
                  className="input input-bordered w-full"
                  placeholder="To"
                  onChange={(e) => {
                    setSearchToDate(
                      e.target.value ? new Date(e.target.value) : ""
                    );
                  }}
                />
              </div>
            </>
          )}

          {/* Clear Search Button */}
          {(searchValue.value || searchFromDate || searchToDate) && (
                 <div className="flex items-center mt-7">
          <button
              title="Clear Search"
              className="btn btn-ghost btn-sm ml-3"
              onClick={() => {
                setSearchValue({ ...searchValue, value: "" });
                setSearchFromDate("");
                setSearchToDate("");
                loadOrders(null, null, null);
              }}
            >
            <i className="pi pi-times"></i> Clear Search 
            </button>
            </div>
          )}

          {/* View Button */}
          <div className="flex-1 flex items-center gap-4 mt-7">
            <button
              title="Click here to view"
              className="btn btn-primary"
              onClick={() => {
                loadOrders(
                  searchValue.value,
                  moment(searchFromDate).format("YYYY-MM-DD HH:mm:ss"),
                  moment(searchToDate).format("YYYY-MM-DD HH:mm:ss")
                );
              }}
            >
              <i className="pi pi-search"></i> View
            </button>
          </div>

          {/* Select Order Button */}
          {/* <div className="flex items-end gap-4">
            <button
              title="Select Order"
              className={`btn btn-success btn-sm ${
                !selectedCustomer ? "btn-disabled" : ""
              }`}
              onClick={() => {
                if (selectedCustomer) onselect(selectedCustomer.customerId);
              }}
            >
              <i className="pi pi-play"></i>
            </button>
          </div> */}
        </div>
        {isTableDataLoading ? (
          <div className="flex justify-between">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <>
          <div className="flex flex-col h-[65vh] overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <table className="table w-full border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10 text-[1rem] border-b border-gray-300">
                  <tr>
                    {/* <th className="px-4 py-2">stockEntryId</th> */}
                    <th className="px-4 py-2">GRN No</th>
                    <th className="px-4 py-2">Supplier Bill No</th>
                    <th className="px-4 py-2">Supplier</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Stock Received Date</th>
                    <th className="px-4 py-2">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => (
                    <tr
                      key={item.orderId}
                      className="border-b border-gray-200 hover:bg-gray-100 bg-slate-50 text-[1rem]"
                    >
                      {/* {JSON.stringify(item.stockReceivedDate)} */}
                      {/* <td className="px-4 py-2">{item.productId}</td> */}
                      <td className="px-4 py-2">
                      {item.stockEntryRefNo}
                      </td>
                      <td className="px-4 py-2">
                      {item.supplierBillNo}
                      </td>
                      <td className="px-4 py-2">
                      {item.SupplierCode} | {item.supplierName}
                      </td>
                      <td className="px-4 py-2">
                      {item.total}
                      </td>
                      <td className="px-4 py-2">
                      {stockReceivedDateBodyTemplate(item)}
                      </td>
<td>{modifiedDateBodyTemplate(item)}</td>
                      <td className="px-4 py-2">{actionButtons(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
    
 
            </div>
          </div>
              <div className="flex justify-between w-full  p-4">
              {/* Items count display */}
              <div className="pl-3">
                <span className=" text-gray-500">{totalRecords} items found</span>
              </div>
      
              {/* DaisyUIPaginator component */}
              <DaisyUIPaginator
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                rowsPerPageOptions={[10, 30, 50, 100]}
              />
            </div>
            </>
        )}

      </div>
    </>
  );
}
