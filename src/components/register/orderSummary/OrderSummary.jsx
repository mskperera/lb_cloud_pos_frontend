import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../../utils/format';

const OrderSummary = () => {
  const orderSummary = useSelector((state) => state.orderList.orderSummary);
  const orderList = useSelector((state) => state.orderList.list || []);

  const subtotal = orderSummary?.subtotal || 0;
  const totalDiscounts = (orderSummary?.overallDiscounts || 0) + (orderSummary?.lineDiscounts || 0);
  const totalTax = orderSummary?.totalTax || 0;
  const grandTotal = orderSummary?.grandTotal || 0;

  const itemCount = orderList.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <div style={{
      padding: "12px 18px",
      borderTop: "1px solid var(--lpos-border)",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      flexShrink: 0,
      background: "var(--lpos-surface)"
    }}>
      {/* Summary Items */}
      {[
        { label: "Subtotal", val: formatCurrency(subtotal,false) },
        { 
          label: "Discount", 
          val: ` ${formatCurrency(totalDiscounts,false)}`, 
          color: "var(--lpos-green)" 
        },
        { label: "Tax", val: formatCurrency(totalTax,false) },
      ].map(({ label, val, color }) => (
        <div 
          key={label} 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
            color: "var(--lpos-text-secondary)"
          }}
        >
          <span style={{ fontWeight: 500 }}>{label}</span>
          <span style={{ 
            fontWeight: 600, 
            color: color || "var(--lpos-text-primary)" 
          }}>
            {val}
          </span>
        </div>
      ))}

      {/* Grand Total - Highlighted */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: 700,
        color: "var(--lpos-text-primary)",
        marginTop: 4,
        paddingTop: 10,
        borderTop: "1px solid var(--lpos-border)"
      }}>
        <span style={{ 
          fontSize: "17px" 
        }}>Grand Total</span>
        <span style={{ 
          fontSize: "17px" 
        }}>
          {formatCurrency(grandTotal)}
        </span>
      </div>

 
    </div>
  );
};

export default OrderSummary;