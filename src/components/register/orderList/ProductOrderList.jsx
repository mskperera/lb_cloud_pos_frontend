import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Menu } from "primereact/menu";
//import { ProductService } from './service/ProductService';
import { useDispatch, useSelector } from "react-redux";
import {
  applyDiscount,
  calculateOrderSummary,
  cancelDiscount,
  cancelOverallDiscount,
  decreaseQty,
  increaseQty,
  removeOrder,
} from "../../../state/orderList/orderListSlice";
import { InputText } from "primereact/inputtext";
import { formatCurrency } from "../../../utils/format";
import { DISCOUNT_TYPES } from "../../../utils/constants";
import  './productOrderList.css'

export default function ProductOrderList({ showDiscountPopup }) {
  const orderList = useSelector((state) => state.orderList);

  const [discount, setDiscount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  // Initialize products with original line numbers when the component mounts or orderList changes
  useEffect(() => {
    const productsWithLineNumber = orderList.list.map((product, index) => ({
      ...product,
      originalLineNumber: index + 1, // Assigning a unique line number based on index
    }));
    setProducts(productsWithLineNumber);
  }, [orderList]);

  // {description:'product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk',unitPrice:'$100.30',qty:2,amount:'$200.60'},
  // {description:'product1',unitPrice:'$50.00',qty:8,amount:'$400.00'},

  // useEffect(() => {
  //   dispatch(calculateOrderSummary());
  // }, [products, dispatch]);

  const menuLeft = useRef(null);

  const discountedProducts = products.filter(
    (product) => product.discount
  );

  const orderListItemMenu = (product) => {
    const removeOrderHandler = () => {
      dispatch(removeOrder({ orderListId: product.orderListId }));
    };

    const addLineDiscountHandler = () => {
      showDiscountPopup(product.orderListId);
    };
    return (
      <div className="action-button-group">
             <Button
          icon="pi pi-percentage"
          onClick={addLineDiscountHandler}
          rounded
          text
          severity="success"
          aria-label="Discount"
        />
        <Button
          icon="pi pi-times"
          onClick={removeOrderHandler}
          rounded
          text
          severity="danger"
          aria-label="Cancel"
        />
        {/* <InputText
                  id="percentage"
                  type="number"
                  aria-describedby="percentage-help"
                  className="p-inputtext w-full"
                  onChange={(e) => setDiscount(e.target.value)}
                /> */}
  
      </div>
    );
  };

  const qty = (product) => {
    // Define the functions for handling clicks
    const handleDecrease = () => {
      // Logic to decrease quantity
      console.log("Decrease qty for", product);
      dispatch(decreaseQty({ orderListId: product.orderListId, decrement: 1 }));
    };

    const handleIncrease = () => {
      // Logic to increase quantity
      console.log("Increase qty for", product);
      dispatch(increaseQty({ orderListId: product.orderListId, increment: 1 }));
    };

    return (
      <>
        <div className="flex flex-row align-items-center justify-content-between gap-2">
          <button
            className="orderlist-qty-button"
            style={{
              fontSize: "0.5rem",
              borderRadius: 40,
              cursor: "pointer",
              border: "none",
              fontWeight:'bold'
            }}
            onClick={handleDecrease}
          >
            <i className="pi pi-minus text-xs"></i>
          </button>
          <p>{product.qty}</p>
          <button
            className="orderlist-qty-button"
            style={{
              fontSize: "0.5rem",
              borderRadius: 40,
              cursor: "pointer",
              border: "none",
              fontWeight:'bold'
            }}
            onClick={handleIncrease}
          >
            <i className="pi pi-plus text-xs"></i>
          </button>
 
        </div>
      </>
    );
  };


  const grossAmount = (rowData) => {
    return (
      <div className="flex flex-column justify-content-end">
        {rowData.grossAmount.toFixed(2)}
      </div>
    );
  };
  const netAmount = (rowData) => {
    return (
      <div className="flex flex-column justify-content-end">
        {rowData.netAmount.toFixed(2)}
      </div>
    );
  };
  const unitPrice = (rowData) => {
    return (
      <div className="flex flex-column justify-content-end">
        {rowData.unitPrice.toFixed(2)}
      </div>
    );
  };

  // const lineNumberBodyTemplate = (rowData, props) => {
  //   return <React.Fragment>{props.rowIndex + 1}</React.Fragment>;
  // };

  const descriptionBodyTemplate = (rowData) => {
  
    return (
      <React.Fragment>
        <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
        <div>
        <div>{rowData.productNo}</div>
        <div>{rowData.description}</div>
        </div>
        {rowData?.discount &&   <div style={{display:'flex',alignItems:'center'}}>
      <div>{`Discount: ${rowData.discount.discountValue} ${rowData.discount.discountTypeId===DISCOUNT_TYPES.PERCENTAGE?"%":"Rs"} | ${rowData.discount.reasonName}`}</div>
      <Button
        icon="pi pi-times"
        rounded
        text
        severity="danger"
        onClick={() => handleCancelDiscount(rowData.orderListId)}
        aria-label="Cancel Discount"
      />
      </div>}
                
      </div>
      </React.Fragment>
    );
  };
  // const discountReasonTemplate = (rowData) => {
  //   console.log("rowww dis", rowData);
  //   return (
  //     <React.Fragment>
  //       <div>{rowData.discountReason.name}</div>
  //     </React.Fragment>
  //   );
  // };

  const handleCancelDiscount = (orderListId) => {
    dispatch(cancelDiscount({ orderListId }));
    // Additional logic to update the UI or state as necessary
    // You may need to refetch or update the product list to reflect the changes
  };

  const [expandedRows, setExpandedRows] = useState(null);
  // const rowExpansionTemplate = (data) => {
  //   return (
  //     <div
  //       className="p-grid p-dir-col"
  //       style={{ padding: "2em 1em 1em 1em", textAlign: "left" }}
  //     >
  //       <div>
  //         <b>Discount Reason:</b> {data.discountReason || "No reason specified"}
  //       </div>
  //     </div>
  //   );
  // };

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


 
  return (
    <div className="productOrderContainer">
      <div >
        <DataTable
          value={products}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
         // rowExpansionTemplate={rowExpansionTemplate}
          scrollable
         // scrollHeight="300px" // Set the desired height for scrolling
          // rowExpansionTemplate={cardBodyTemplate}
          className="orderlist-datatable"

          tableStyle={{ minWidth: "10rem" }}
          selectionMode="single" // or "multiple" for multiple row selection
          selection={selectedProducts}
          onSelectionChange={e => setSelectedProducts(e.value)}
        >
          <Column header="#" body={lineNumberBodyTemplate}></Column>

          {/* Columns */}
          <Column
            field="description"
            header="Description"
            body={descriptionBodyTemplate}
          ></Column>
          <Column field="qty" header="Qty" body={qty}  ></Column>
          {/* <Column
            field="unitPrice"
            alignHeader="right"
            align="right"
            body={unitPrice}
            header="Unit Price"
          ></Column> */}

          {/* <Column
            field="grossAmount"
            alignHeader="right"
            align="right"
            body={grossAmount}
            header="Amount"
          ></Column> */}
            <Column
            field="netAmount"
            alignHeader="right"
            align="right"
            body={netAmount}
            header="Amount"
          ></Column>
          <Column
            field="amount"
            alignHeader="right"
            align="right"
            body={orderListItemMenu}
            header=""
          ></Column>
        </DataTable>
      </div>


      <div>


    </div>
    </div>
  );
}
