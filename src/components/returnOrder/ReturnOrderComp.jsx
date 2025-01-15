import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useToast } from "../useToast";
import moment from 'moment';
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import { validate } from "../../utils/formValidation";
import { getOrderFull } from "../../functions/order";
import  './module.returnOrder.css';

export default function ReturnOrderComp({onAddReturnedProducts }) {
  const showToast = useToast();

  const [isTableDataLoading, setIsTableDataLoading] = useState(false);

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
  const [returnQty,setReturnQty] =useState({
    label: "Enter Return Qty",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  


  const [isOrderLoading,setIsOrderLoading]=useState(false);
  const [orderHeader,setOrderHeader]=useState(null);
  const [orderDetails,setOrderDetails]=useState([]);
  const [selectedOrder,setSelectedOrder]=useState('');
  const [orderDetailsReturn,setOrderDetailsReturn]=useState([]);

  const loadOrder=async(value)=>{
    try{

   
    setIsOrderLoading(true);

    const payload={orderId:null,orderNo:value}
    const ress=await getOrderFull(payload);
      
      const orderHeader=ress.data.results[0][0];
      const orderDetails=ress.data.results[1];
      setOrderHeader(orderHeader);
      const modifiedOrderDetails=[...orderDetails];
      modifiedOrderDetails.map(o=>(
        o.returnQty=0,
        o.remainingQty=o.qty
      ));
      setOrderDetails(modifiedOrderDetails);

      console.log('orderHeader',orderHeader)
      console.log('orderDetails',orderDetails)
      //dispatch(setCompletedOrder({orderHeader,orderDetails}));
   setIsOrderLoading(false);
    }
    catch(err){
      showToast("error", "Exception", err.message);
      setIsOrderLoading(false);
      console.log(err);
    }
  }


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


  const onOrderSelectHandler=()=>{

    console.log('onOrderSelectHandler',searchValue.value)
    loadOrder(searchValue.value);
    }
  
    
    const modifiedDateBodyTemplate = (customer) => {
      const utcOffsetMinutes = moment().utcOffset();
      const localFormattedDate = moment(customer.createdDate_UTC).add(utcOffsetMinutes,'minutes').format('YYYY-MMM-DD hh:mm:ss A');
      
      return isTableDataLoading ? <Skeleton /> : <span>{customer.createdDate_UTC ? localFormattedDate:''}</span>;
    };
  
    const product = (o) => {
   
      return <span>{`${o.productNo} | ${o.productName}`}</span>;
    };

    const qty=(o)=>{
      return <span>{`${o.qty} ${o.measurementUnitName}`}</span>;
      
    }
    const remainingQty=(o)=>{
      return <span>{`${o.remainingQty} ${o.measurementUnitName}`}</span>;
      
    }
    

    const returnItems = (o) => {
      return (
        <div className="action-button-container">
               <InputText
                id="searchValue"
               placeholder="Enter Return Qty"
                value={o.returnQty}
                onChange={(e) => {

           console.log('actionButtons',o)
                 const index=orderDetails.findIndex(i=>i.orderDetailId===o.orderDetailId);

                 if(index!==-1){
                  const updatedOrderDetails=[...orderDetails];
                  updatedOrderDetails[index]={...updatedOrderDetails[index],returnQty:e.target.value};
                  setOrderDetails(updatedOrderDetails);
                 }
         
                }}
            
              />

        </div>
      );
    };
    

  return (
    <>
      <ConfirmDialog />
      <div className="return-order">
        {JSON.stringify(orderDetails)}
        <div className="order-number-input-container">
          <div className="order-number-input">
            <div className="flex-1 flex flex-column mr-3">
              <label
                htmlFor="card-number"
                className="text-lg font-normal mb-2 mr-5"
              >
                Enter Order Number Here
              </label>
              <InputText
                id="searchValue"
                // placeholder="Search here"
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
            </div>
          </div>

          <Button
            tooltip="Click to submit"
            tooltipOptions={{ position: "left" }}
            size="large"
            rounded
            label="Submit"
            // outlined
            onClick={onOrderSelectHandler}
          />
        </div>

<>
        {isTableDataLoading ? (
          <div className="flex justify-content-center">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <>
            <DataTable
              value={orderDetails}
              scrollable
              scrollHeight="500px"
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single" // or "multiple" for multiple row selection
              selection={selectedOrder}
              onSelectionChange={(e) => setSelectedOrder(e.value)}
            >
              {/* Columns */}
              <Column field="orderDetailId" header="orderDetailID"></Column>

              <Column field="" header="Product" body={product}></Column>
              <Column field="" header="Qty" body={qty}></Column>
              <Column field="unitPrice" header="UnitPrice"></Column>
              <Column field="grossAmount" header="grossAmount"></Column>
              <Column field="netAmount" header="netAmount"></Column>
              <Column field="remainingQty" header="remainingQty" body={remainingQty}></Column>
              <Column header="Retrun" body={returnItems}></Column>
              {/* <Column header="" body={actionButtons}></Column> */}
            </DataTable>
          </>
        )}
</>


<Button
            icon="pi pi-angle-left"
            onClick={()=>{
              const returnedProducts=[...orderDetails.filter(i=>i.returnQty!==null)];      
              onAddReturnedProducts({returnedProducts,orderNo:searchValue.value})}}
            rounded
            className="order-button-return"
            label="Add to List"
            text
            size="large"
            severity="info"
            tooltip="Return Qty"
            aria-label="Select"
          />
      </div>
    </>
  );
}
