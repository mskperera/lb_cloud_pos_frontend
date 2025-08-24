import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelDiscount,
  removeOrder,
  increaseQty,
} from "../../../state/orderList/orderListSlice";
import { DISCOUNT_TYPES, CURRENCY_DISPLAY_TYPE } from "../../../utils/constants";
import { getCurrency } from '../../../utils/format';
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
        hoverClass="hover:text-sky-700 hover:bg-gray-100"
        aria-label="Discount"
      />
      <GhostButton
        onClick={() => dispatch(removeOrder({ orderListId: product.orderListId }))}
        iconClass="pi pi-trash"
        color="text-red-500"
        hoverClass="hover:text-red-600 hover:bg-gray-100"
        aria-label="Remove item"
      />
    </div>
  );

  const qty = (product) => {
    const handleChangeQty = (e) => {
      const newQty = parseFloat(e.target.value);
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
          className="w-20 py-2 px-3 text-center text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
          step="1"
          inputMode="decimal"
        />
        <span className="text-sm text-gray-600">{product.measurementUnitName}</span>
      </div>
    );
  };

  const netAmount = (product) => (
    <div className="text-right text-md font-medium text-gray-800">
      {product.netAmount.toFixed(2)}
    </div>
  );

  const descriptionBodyTemplate = (product) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{product.sku}</span>
      <span className="text-base font-medium text-gray-800">{product.description}</span>
    </div>
  );

  const handleCancelDiscount = (product) => {
    dispatch(cancelDiscount({ orderListId: product.orderListId }));
  };

  return (
    <div style={{ maxHeight: '300px', minHeight: '300px', overflowY: 'auto', border: '1px solid #ddd' }} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
    <table className="table-auto w-full" style={{ tableLayout: 'fixed' }}>
        <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
          <tr className="text-gray-700">
      <th className="py-3 px-4 text-left" style={{ width: '50%' }}>Description</th>
            <th className="py-3 px-4 text-center">Qty</th>
            <th className="py-3 px-4 text-right">Amount</th>
            <th className="py-3 px-4 text-right"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {products.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-8 text-center text-gray-500 text-base">
                No products added to the order list.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <React.Fragment key={product.orderListId}>
                <tr className={`${product?.discount ? "bg-teal-50" : "bg-white"} border-b border-gray-200 hover:bg-gray-50 transition duration-150`}>
                  <td className="py-4 px-4">{descriptionBodyTemplate(product)}</td>
                  <td className="py-4 px-4 text-center">{qty(product)}</td>
                  <td className="py-4 px-4">{netAmount(product)}</td>
                  <td className="py-4 px-4">{orderListItemMenu(product)}</td>
                </tr>
                {product?.discount && (
                  <tr className="bg-teal-100 text-gray-700 border-b border-gray-200">
                    <td colSpan={3} className="py-2 px-4">
                      {`Discount: ${product.discount.discountValue} ${
                        product.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE
                          ? "%"
                          : `${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`
                      } | ${product.discount.reasonName}`}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        className="text-red-500 hover:text-red-600 hover:bg-gray-100 p-2 rounded-full transition duration-200"
                        onClick={() => handleCancelDiscount(product)}
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