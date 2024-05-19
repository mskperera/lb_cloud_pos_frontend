import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import TablePaginator from "../TablePaginator";
import { useNavigate, useRouteError } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../useToast";
import moment from 'moment';
import { Skeleton } from "primereact/skeleton";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { validate } from "../../utils/formValidation";
import { deleteCustomer, getCustomers } from "../../functions/customer";
import { getOrders } from "../../functions/order";
import { getDrpSession } from "../../functions/dropdowns";
import { Calendar } from "primereact/calendar";
import  './module.orderList.css';
import { voidOrder } from "../../functions/register";
import {useDispatch} from 'react-redux'
import { setVoidOrderVisible } from "../../state/popup/popupSlice";
import OrderVoidRemark from "../register/OrderVoidRemark";

export default function OrderList({selectingMode }) {

  const dispatch=useDispatch();
  const [orders, setOrders] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);
  const [isVoidRemarkShow,setIsVoidRemarkShow]=useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    loadOrders(selectedCategoryId, event.page, rowsPerPage);
  };

  const [selectedFilterBy,setSelectedFilterBy] =useState({
    label: "Filter by",
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue,setSearchValue] =useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });





  const loadOrders = async (_searchValue,fromDate,toDate) => {
    try{
    setIsTableDataLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;

   // const frmoUtc=moment(searchFromDate);

   // const _searchValue=searchValue.value===''?null:searchValue.value;
    const filteredData = {

      orderId:null,
      orderNo: selectedFilterBy.value===1 ? _searchValue:null,
      customerCode: selectedFilterBy.value===2 ? _searchValue:null,
      customerName: selectedFilterBy.value===3 ? _searchValue:null,
      mobileNo: selectedFilterBy.value===4 ? _searchValue:null,
      orderFromDate: selectedFilterBy.value===5 ? fromDate:null,
      orderToDate: selectedFilterBy.value===5 ? toDate:null,
      skip: skip,
      limit: limit,
    };
    console.log('filteredData',filteredData)
    const _result = await getOrders(filteredData);
    const { totalRows } = _result.data.outputValues;
    setTotalRecords(totalRows);
    console.log("ppppp", _result.data);

    setOrders(_result.data.results[0]);
    setIsTableDataLoading(false);
  }
  catch(err){
    setIsTableDataLoading(false);
    console.log('error:',err);
  }
  };

  useEffect(() => {
    console.log("useEffect lo");
    loadOrders(null,null,null);
  }, [currentPage, rowsPerPage]);

//   useEffect(() => {
//     console.log("useEffect search by value");
//     if(searchValue.value){
//     const delayedLoadCustomers = setTimeout(() => {
//         loadOrders(selectedCategoryId);
//     }, 1000);

//     return () => clearTimeout(delayedLoadCustomers);
//   }
  
// }, [searchValue.value]);



  const [filterByOptions,setFilterByOptions] =useState([
    {id:1,displayName:'Order Number'},
    {id:2,displayName:'Customer Code'},
    {id:3,displayName:'Customer Name'},
    {id:4,displayName:'Mobile No'},
    {id:5,displayName:'Order Date'}]);



    const [sessionsOptions,setSessionsOptions] =useState([]);
    const [date, setDate] = useState(null);

    const [showDateRange,setShowDateRange] =useState(false);
    const [showSearchField,setShowSearchField] =useState(false);



    const loadDrpSession=async ()=>{
      const objArr=await getDrpSession();
      setSessionsOptions(objArr.data.results[0])
    }
  


   useEffect(() => {
     loadDrpSession();
   }, []);




  const actionButtons = (o) => {
    return (
      <div className="action-button-container">
        <Button
          icon="pi pi-eye"
          onClick={() => {
            window.open(`/paymentConfirm?orderNo=${o.orderNo}`, '_blank');
           // navigate(`/paymentConfirm?orderNo=${o.orderNo}`);
            // onselect(customer.customerId);
          }}
          rounded
          className="order-button-print"
          text
          size="large"
          severity="info"
          tooltip="View Order"
          aria-label="Select"
        />

{!o.isVoided ?
        <Button
          icon="pi pi-ban"
          onClick={async() => {
      
            setSelectedOrderId(o.orderId);
            setIsVoidRemarkShow(true);

          }}
          rounded
          className="order-button-void"
          text
          size="large"
          severity="info"
          tooltip="Void Order"
          aria-label="Select"
        /> :<div >Voided</div>}

      </div>
    );
  };



  const modifiedDateBodyTemplate = (customer) => {
    const utcOffsetMinutes = moment().utcOffset();
    const localFormattedDate = moment(customer.createdDate_UTC).add(utcOffsetMinutes,'minutes').format('YYYY-MMM-DD hh:mm:ss A');
    
    return isTableDataLoading ? <Skeleton /> : <span>{customer.createdDate_UTC ? localFormattedDate:''}</span>;
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

  const [searchFromDate, setSearchFromDate] = useState('');
  const [searchToDate, setSearchToDate] = useState('');


  const updateOrderListHandler=(orderId)=>{

    const existingOrderList=[...orders]
    const index=orders.findIndex(o=>o.orderId===orderId);
    existingOrderList[index].isVoided=true;
    setOrders(existingOrderList);
    setIsVoidRemarkShow(false);
  }
  return (
    <>
      <ConfirmDialog />
      <OrderVoidRemark visible={isVoidRemarkShow} onClose={()=>{
  setIsVoidRemarkShow(false);
  }} orderId={selectedOrderId} onUpdateOrderList={updateOrderListHandler} />
  
      <div style={{ height: "40vh" }}>
        <div className="flex justify-content-between align-items-center px-2 gap-2">
          <div className="flex-1 flex align-items-center gap-5 mb-3">
            <div className="flex align-items-center">
              <label
                htmlFor="card-number"
                style={{width:'57px'}}
                className="text-lg font-normal mb-2 mr-5"
              >
                Filter By
              </label>
              <Dropdown
                id="void-reason"
                value={selectedFilterBy.value}
                onChange={(e) => {
                  handleInputChange(
                    setSelectedFilterBy,
                    selectedFilterBy,
                    e.value
                  );
                }}
                options={filterByOptions}
                optionLabel="displayName" // Property to use as the label
                optionValue="id" // Property to use as the value
                //  placeholder="Filter by"
           
              />
            </div>

      
            <div className="flex flex-1 align-items-center">
              {[1, 2, 3, 4].includes(selectedFilterBy.value) && (
                      
                <InputText
                  id="searchValue"
                   placeholder="Search here"
                  value={searchValue.value}
                  onChange={(e) => {
                    handleInputChange(
                      setSearchValue,
                      searchValue,
                      e.target.value
                    );
                  }}
                  className="w-full"
                />
               
              )}
              {selectedFilterBy.value === 5 && (
                <>
                {/* {JSON.stringify(searchFromDate)} */}
                <div   className="date-search-container">
                    <Calendar
                      value={searchFromDate}
                      style={{color:'black'}}
                      className="w-full"
                      placeholder="From"
                      tooltipOptions={{position:'top'}}
                      tooltip="Select From Date"
                      onChange={(e) => {
                        console.log('from date',e.value)
                      setSearchFromDate(e.value)
                      }
                      }
                      showIcon
                    />
        
                    <Calendar
                      value={searchToDate}
                      className="w-full"
                      placeholder="To"
                      tooltipOptions={{position:'top'}}
                      tooltip="Select To Date"
                      onChange={(e) => setSearchToDate(e.value)}
                      showIcon
                    />
                  </div>
             
                </>
              )}
            
           {(searchValue.value || searchFromDate || searchToDate) && <Button
                tooltip="Clear Search"
                className="p-3 pl-5 pr-5 ml-3 clear-search-button"
               // severity="info"
        
                tooltipOptions={{ position: "top" }}
                rounded
              
                // outlined
                onClick={() => {
                  setSearchValue({...searchValue,value:''});
                  setSearchFromDate('');
                  setSearchToDate('');
                  loadOrders(null,null,null);
                }}
                 icon="pi pi-times"
              />}
</div>
            <div className="flex-1 flex align-items-center gap-4">
              <Button
                tooltip="Click here to view"
                className="p-3 pl-5 pr-5"
                label="View"
                tooltipOptions={{ position: "top" }}
                rounded
                // outlined
                onClick={() => {
                  loadOrders(searchValue.value, moment(searchFromDate).format('YYYY-MM-DD HH:mm:ss'),moment(searchToDate).format('YYYY-MM-DD HH:mm:ss'));
                }}
                 icon="pi pi-search"
              />
 
            </div>
          </div>

          <div className="flex align-items-end gap-4">
            <Button
              tooltip="Select Order"
              disabled={!selectedCustomer}
              tooltipOptions={{ position: "left" }}
              rounded
              // outlined
              onClick={() => {
                onselect(selectedCustomer.customerId);
              }}
              icon="pi pi-play"
            />

          </div>
        </div>

        {isTableDataLoading ? (
          <div className="flex justify-content-center">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <>
            {" "}
            <DataTable
              value={orders}
              scrollable
              scrollHeight="500px"
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single" // or "multiple" for multiple row selection
              selection={selectedCustomer}
              onSelectionChange={(e) => setSelectedCustomer(e.value)}
            >
              {/* Columns */}
              <Column field="orderId" hidden header="orderId"></Column>
              <Column field="orderNo" header="orderNo"></Column>
              {/* <Column field="isVoided" header="isVoided"></Column> */}

              <Column field="" header="Customer" body={customer}></Column>
              <Column field="grossAmount_total" header="Gross Amount"></Column>
              <Column
                field="all_DiscountAmount_total"
                header="Discounts"
              ></Column>
              <Column field="overall_TaxAmount" header="Tax"></Column>
              <Column field="grandTotal" header="Grand Total"></Column>

              <Column
                field="createdDate_UTC"
                body={modifiedDateBodyTemplate}
                header="Created Date"
              ></Column>
              <Column header="" body={actionButtons}></Column>
            </DataTable>
            <TablePaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </>
  );
}
