

import React, { useEffect, useState } from 'react'
import { DISCOUNT_TYPES } from '../../../utils/constants';
import { Button } from 'primereact/button';
import { formatCurrency } from '../../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { cancelDiscount, cancelOverallDiscount } from '../../../state/orderList/orderListSlice';
import './orderSummary.css';



const OrderSummary=()=> {

    const dispatch=useDispatch();
    const [products, setProducts] = useState([]);
    const orderList = useSelector((state) => state.orderList);
    const [discount, setDiscount] = useState(null);




    const lineNumberBodyTemplate = (rowData) => {
        return <React.Fragment>{rowData.originalLineNumber}</React.Fragment>; // Use the original line number here
      };
    
      const discountTypeSymbols = {
        [DISCOUNT_TYPES.PERCENTAGE]: "%", // Symbol for percentage discounts
        [DISCOUNT_TYPES.FIXED_AMOUNT]: "$", // Symbol for amount discounts, assuming Rs symbol for illustration
      };
    
    
      // const lineNumberBodyTemplate = (rowData, props) => {
      //   return <React.Fragment>{rowData.originalLineNumber || props.rowIndex + 1}</React.Fragment>;
      // };
    
      const descriptionDiscountsBodyTemplate = (rowData) => {
        // Determine the symbol based on the discountTypeId
        const symbol = discountTypeSymbols[rowData.discount.discountTypeId] || ""; // Fallback to empty string if no match
      
        // Rest of the logic remains similar
        return (
          <React.Fragment>
            <>
            <div>
      {`${symbol}${rowData.discount.discountValue} off ${rowData.productNo} | ${rowData.description} (${rowData.discount.reasonName}${rowData.discount.reasonRemark ? ` -> ${rowData.discount.reasonRemark}` : ''}) `}
    </div>
      </>
          </React.Fragment>
        );
      };
      
    
      const discountAmount = (rowData) => {
        return (
          <div className="flex justify-content-end">
            {`-${rowData.discount.discountAmount.toFixed(2)}`}
          </div>
        );
      };
    
      const handleCancelDiscount = (orderListId) => {
        dispatch(cancelDiscount({ orderListId }));
        // Additional logic to update the UI or state as necessary
        // You may need to refetch or update the product list to reflect the changes
      };
    
      const cancelDiscountButtonTemplate = (rowData) => {
        return (
          <Button
            icon="pi pi-times"
            rounded
            text
            severity="danger"
            onClick={() => handleCancelDiscount(rowData.orderListId)}
            aria-label="Cancel Discount"
          />
        );
      };
    
    
        // Overall discount details template
        const overallDiscountDetailsTemplate = (rowData) => {
          console.log('overallDiscountDetailsTemplate',rowData)
          return <React.Fragment>
            <div>{`${rowData.value}${rowData.symbol} applied for Order. (${rowData.overallDiscountReasonName}${rowData.overallDiscountReasonRemark ? ` -> ${rowData.overallDiscountReasonRemark}` : ''}) )`}</div>
          </React.Fragment>;
        };
      
        const overallDiscountAmountTemplate = (rowData) => {
          return <React.Fragment>
            <div className="flex justify-content-end">
              {`-${formatCurrency(rowData.amount)}`}
            </div>
          </React.Fragment>;
        };
      
      const orderSummary = useSelector((state) => state.orderList.orderSummary); // Adjust the path according to your actual state structure
      const overallDiscountData = [{
        type: orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "Percentage" : "Fixed Amount",
        value: orderSummary.overallDiscountValue,
        symbol: orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "%" : "$",
        amount: orderSummary.overallDiscounts, // The calculated discount amount
        //discountReason:orderSummary.overallDiscountReason,
        overallDiscountReasonId:orderSummary.overallDiscountReasonId,
        overallDiscountReasonName:orderSummary.overallDiscountReasonName,
        overallDiscountReasonRemark:orderSummary.overallDiscountReasonRemark,
      }];
    
      const subtotal = formatCurrency(orderSummary?.subtotal || 0);

     const totalDiscounts= orderSummary.overallDiscounts+orderSummary.lineDiscounts;

      useEffect(() => {
        const productsWithLineNumber = orderList.list.map((product, index) => ({
          ...product,
          originalLineNumber: index + 1, // Assigning a unique line number based on index
        }));
        setProducts(productsWithLineNumber);
      }, [orderList]);

      const discountedProducts = products.filter(
        (product) => product.discount
      );


      const unitPrice = (rowData) => {
        return (
          <div className="flex flex-column justify-content-end">
            {rowData.unitPrice.toFixed(2)}
          </div>
        );
      };

      const grossAmount = (rowData) => {
        return (
          <div className="flex flex-column justify-content-end">
            {rowData.grossAmount.toFixed(2)}
          </div>
        );
      };



  return (
    <div>
  
 
    {/* Overall Discount Details */}
    {orderSummary.overallDiscounts > 0 && (
        <div className="mt-2">
          {/* <h4>Overall Discount</h4> */}
          <DataTable id="overall-discount-table" value={overallDiscountData}>
            <Column header="Type" body={overallDiscountDetailsTemplate}></Column>
            <Column header="Discount Amount" body={overallDiscountAmountTemplate}></Column>
            <Column body={() => (
              <Button
                icon="pi pi-times"
                rounded
                text
                severity="danger"
                onClick={() => dispatch(cancelOverallDiscount())}
                aria-label="Cancel Overall Discount"
              />
            )} header="Cancel" />
          </DataTable>
        </div>
      )}
   
{/* Displaying Order Summary */}
<div className="orderSummaryContainer">
<div className="orderSummaryRow">
      <div className="orderSummaryItem">
    <p className="">Sub Total</p>
    <p className="">{subtotal}</p>
</div>

<div className="orderSummaryItem">
            <p className="">Line Discounts</p>
            <p className="">
              {formatCurrency(totalDiscounts)}
          </p>
      </div>

</div>
<div className="orderSummaryRow">
      <div className="orderSummaryItem">
            <p className="">Tax</p>
            <p className="">
            {formatCurrency(orderSummary.totalTax)}
          </p>
      </div>

      <div className="orderSummaryItem">
            <p className="">Grand Total</p>
            <p className="">
            {formatCurrency(orderSummary.grandTotal)}
          </p>
      </div>


      {/* <div className="">
        <div className="flex justify-content-between">
          <span className="text-md font-semibold">Tax:</span>
          <span className="text-md font-semibold">
            {formatCurrency(orderSummary.totalTax)}
          </span>
        </div>
      </div>
      <div className="">
        <div className="flex justify-content-between">
          <span className="text-xl font-semibold">Grand Total:</span>
          <span className="text-xl font-semibold">
            {formatCurrency(orderSummary.grandTotal)}
          </span>
        </div>
      </div> */}
  
    </div>
  </div>
  </div>
  )
}

export default OrderSummary