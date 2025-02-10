import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelDiscount,
  removeOrder,
  increaseQty,
} from "../../../state/orderList/orderListSlice";
import { DISCOUNT_TYPES } from "../../../utils/constants";
import GhostButton from "../../iconButtons/GhostButton";
import './productOrderList.css';

export default function ProductOrderList({ showDiscountPopup }) {
  const orderList = useSelector((state) => state.orderList);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsWithLineNumber = orderList.list.map((product, index) => ({
      ...product,
      originalLineNumber: index + 1,
    }));
    setProducts(productsWithLineNumber);
  }, [orderList]);

  const orderListItemMenu = (product) => (
    <div className="flex gap-2 justify-end">
      <GhostButton
        onClick={() => showDiscountPopup(product.orderListId)}
        iconClass="pi pi-percentage"
        color="text-sky-500"
        hoverClass="hover:text-sky-700 hover:bg-transparent"
        aria-label="Discount"
      />
      <GhostButton
        onClick={() => dispatch(removeOrder({ orderListId: product.orderListId }))}
        iconClass="pi pi-trash"
        color="text-red-500"
        hoverClass="hover:text-red-700 hover:bg-transparent"
        aria-label="Remove item"
      />
    </div>
  );

  const qty = (product) => {
    const handleChangeQty = (e) => {
      const newQty = parseInt(e.target.value, 10);
      if (!isNaN(newQty) && newQty >= 0) {
        dispatch(
          increaseQty({
            orderListId: product.orderListId,
            increment: newQty - product.qty,
          })
        );
      }
    };

    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={product.qty}
          onChange={handleChangeQty}
          className="input input-bordered text-center w-20 rounded-md "
          min="1"
        />
        <span className="text-sm text-gray-500">{product.measurementUnitName}</span>
      </div>
    );
  };

  const netAmount = (product) => (
    <div className="text-right text-sm font-medium text-gray-700">
      {product.netAmount.toFixed(2)}
    </div>
  );

  const descriptionBodyTemplate = (product) => (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-[1rem] text-gray-800">{product.sku}</span>
      <span className="text-gray-600 text-sm">{product.description}</span>
    </div>
  );

  const handleCancelDiscount = (orderListId) => {
    dispatch(cancelDiscount({ orderListId }));
  };

  return (
    <div style={{ maxHeight: '300px', minHeight: '300px', overflowY: 'auto', border: '1px solid #ddd' }} className="orderList">
      <table className="table-auto w-full" style={{ tableLayout: 'fixed' }}>
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-sm text-gray-700">
            <th className="py-3 px-4 text-left" style={{ width: '50%' }}>Description</th>
            <th className="py-3 px-4 text-center">Qty</th>
            <th className="py-3 px-4 text-right">Amount</th>
            <th className="py-3 px-4 text-right"></th>
          </tr>
        </thead>
        <tbody className={`${products.length !== 0 ? 'bg-white': ''}  `}>
          {products.length === 0 ? (
            <tr>
               <td colSpan="4" className="py-4 text-center pt-24 text-gray-500">
                No products added to the order list.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <React.Fragment key={product.orderListId}>
                <tr
                  className={`${product?.discount ? "bg-gray-100" : ""} border-b last:border-none`}
                >
                  <td className="py-3 px-4">{descriptionBodyTemplate(product)}</td>
                  <td className="py-3 px-4 text-center">{qty(product)}</td>
                  <td className="py-3 px-4">{netAmount(product)}</td>
                  <td className="py-3 px-4 text-right">{orderListItemMenu(product)}</td>
                </tr>
                {product?.discount && (
                  <tr className="bg-gray-50 text-sm text-gray-600 border-b last:border-none">
                    <td colSpan={3} className="py-2 px-4">
                      {`Discount: ${product.discount.discountValue} ${
                        product.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE
                          ? "%"
                          : "Rs"
                      } | ${product.discount.reasonName}`}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        className="text-red-400 hover:text-red-500"
                        onClick={() => handleCancelDiscount(product.orderListId)}
                        aria-label="Cancel Discount"
                      >
                        <i className="pi pi-times text-sm"></i>
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
