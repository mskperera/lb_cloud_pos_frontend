import React, { useEffect, useState } from 'react';
import { DISCOUNT_TYPES } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/format';
import { useDispatch, useSelector } from 'react-redux';

const OrderSummary = ({ totalItems }) => {
  const orderList = useSelector((state) => state.orderList);
  const orderSummary = useSelector((state) => state.orderList.orderSummary);
  const subtotal = formatCurrency(orderSummary?.subtotal || 0);
  const totalDiscounts = orderSummary.overallDiscounts + orderSummary.lineDiscounts;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsWithLineNumber = orderList.list.map((product, index) => ({
      ...product,
      originalLineNumber: index + 1,
    }));
    setProducts(productsWithLineNumber);
  }, [orderList]);

  return (  
    <div className="px-6 py-4 bg-[#f0faff] rounded-lg shadow-sm border ">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col w-full gap-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Sub Total</span>
            <span className="font-medium text-gray-800">{subtotal}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Discounts</span>
            <span className="font-medium text-gray-800">{formatCurrency(totalDiscounts)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Tax</span>
            <span className="font-medium text-gray-800">{formatCurrency(orderSummary.totalTax)}</span>
          </div>
        </div>
        <div className="flex flex-col w-full justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">Total Items</span>
            <span className="font-medium text-gray-800">{totalItems}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xl text-sky-600">Grand Total</span>
            <span className="font-bold text-xl text-sky-600">{formatCurrency(orderSummary.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;