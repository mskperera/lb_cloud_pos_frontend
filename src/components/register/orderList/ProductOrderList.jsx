import React, { useState, useEffect } from "react";
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
import { DISCOUNT_TYPES } from "../../../utils/constants";
import './productOrderList.css';

export default function ProductOrderList({ showDiscountPopup }) {
  const orderList = useSelector((state) => state.orderList);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);

  // Initialize products with original line numbers when the component mounts or orderList changes
  useEffect(() => {
    const productsWithLineNumber = orderList.list.map((product, index) => ({
      ...product,
      originalLineNumber: index + 1, // Assigning a unique line number based on index
    }));
    setProducts(productsWithLineNumber);
  }, [orderList]);

  const orderListItemMenu = (product) => {
    const removeOrderHandler = () => {
      dispatch(removeOrder({ orderListId: product.orderListId }));
    };

    const addLineDiscountHandler = () => {
      showDiscountPopup(product.orderListId);
    };

    return (
      <div className="flex gap-2">
        <button
          className="btn btn-success btn-xs text-base-100"
          onClick={addLineDiscountHandler}
          aria-label="Discount"
        >
          <i className="pi pi-percentage "></i>
        </button>
        <button
          className="btn btn-danger btn-xs bg-red-400 text-base-100"
          onClick={removeOrderHandler}
          aria-label="Cancel"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>
    );
  };

  const qty = (product) => {
    const handleDecrease = () => {
      dispatch(decreaseQty({ orderListId: product.orderListId, decrement: 1 }));
    };
  
    const handleIncrease = () => {
      dispatch(increaseQty({ orderListId: product.orderListId, increment: 1 }));
    };
  
    const handleChangeQty = (e) => {
      const newQty = parseInt(e.target.value, 10);
      if (!isNaN(newQty) && newQty >= 0) {
        dispatch(increaseQty({ orderListId: product.orderListId, increment: newQty - product.qty }));
      }
    };
  
    return (
      <div className="flex items-center gap-2">
        <button
          className="btn btn-outline btn-sm text-lg hover:bg-primaryColor border-none bg-base-300"
          onClick={handleDecrease}
        >
          -
        </button>
  
        <input
          type="number"
          value={product.qty}
          onChange={handleChangeQty}
          className="input input-bordered input-sm text-center w-20"
          min="1"
        />
  
        <button
          className="btn btn-outline btn-sm text-lg hover:bg-primaryColor border-none bg-base-300"
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    );
  };
  

  const grossAmount = (rowData) => (
    <div className="flex justify-end">
      {rowData.grossAmount.toFixed(2)}
    </div>
  );

  const netAmount = (rowData) => (
    <div className="flex justify-end">
      {rowData.netAmount.toFixed(2)}
    </div>
  );

  const unitPrice = (rowData) => (
    <div className="flex justify-end">
      {rowData.unitPrice.toFixed(2)}
    </div>
  );

  const descriptionBodyTemplate = (rowData) => (
    <div className="flex flex-col gap-1 w-[12rem]">
      <div>
        <div>{rowData.productNo}</div>
        <div>{rowData.description}</div>
      </div>
      {rowData?.discount && (
        <div className="flex items-center">
          <div>
            {`Discount: ${rowData.discount.discountValue} ${rowData.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "%" : "Rs"} | ${rowData.discount.reasonName}`}
          </div>
          <button
            className="btn btn-danger btn-xs"
            onClick={() => handleCancelDiscount(rowData.orderListId)}
            aria-label="Cancel Discount"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>
      )}
    </div>
  );

  const handleCancelDiscount = (orderListId) => {
    dispatch(cancelDiscount({ orderListId }));
  };

  const lineNumberBodyTemplate = (rowData) => (
    <React.Fragment>{rowData.originalLineNumber}</React.Fragment>
  );

  return (
    <div className="productOrderContainer">
      <table className="table w-full">
      <thead className="text-lg text-defalutTextColor">
  <tr>
    <th>#</th>
    <th>Description</th>
    <th className="text-center">Qty</th>
    <th className="text-right">Amount</th>
    <th></th>
  </tr>
</thead>

        <tbody className=" text-[1rem] text-defalutTextColor">
          {products.map((product) => (
            <tr key={product.orderListId} className=" bg-white">
              <td>{lineNumberBodyTemplate(product)}</td>
              <td>{descriptionBodyTemplate(product)}</td>
              <td>{qty(product)}</td>
              <td>{netAmount(product)}</td>
              <td>{orderListItemMenu(product)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

