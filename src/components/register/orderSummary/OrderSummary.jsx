

import React, { useEffect, useState } from 'react'
import { DISCOUNT_TYPES } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/format';
import { useDispatch, useSelector } from 'react-redux';


const OrderSummary=()=> {

    const [products, setProducts] = useState([]);
    const orderList = useSelector((state) => state.orderList);
      const orderSummary = useSelector((state) => state.orderList.orderSummary);
      const subtotal = formatCurrency(orderSummary?.subtotal || 0);
     const totalDiscounts= orderSummary.overallDiscounts+orderSummary.lineDiscounts;

      useEffect(() => {
        const productsWithLineNumber = orderList.list.map((product, index) => ({
          ...product,
          originalLineNumber: index + 1,
        }));
        setProducts(productsWithLineNumber);
      }, [orderList]);

  return (
      <div className="px-4">
        <div className="flex justify-between gap-10">
          <div className="flex justify-between items-center flex-1">
            <span className="font-semibold m-1">Sub Total</span>
            <span className="font-semibold">{subtotal}</span>
          </div>

          <div className="flex justify-between items-center flex-1">
            <span className="font-semibold m-1">Discounts</span>
            <span className="font-semibold">{formatCurrency(totalDiscounts)}</span>
          </div>
        </div>
        <div className="flex justify-between gap-10">
          <div className="flex justify-between items-center flex-1">
            <span className="font-semibold m-1">Tax</span>
            <span className="font-semibold">{formatCurrency(orderSummary.totalTax)}</span>
          </div>

          <div className="flex justify-between items-center flex-1">
            <span className="font-semibold m-1">Grand Total</span>
            <span className="font-semibold">{formatCurrency(orderSummary.grandTotal)}</span>
          </div>

        </div>
      </div>
   
  );
}

export default OrderSummary