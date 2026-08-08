import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency, getCurrency } from "../../../utils/format";
import { CURRENCY_DISPLAY_TYPE } from "../../../utils/constants";

const OrderSummary = () => {
  const [expanded, setExpanded] = useState(false);

  const orderSummary = useSelector(
    (state) => state.orderList.orderSummary
  );

  const subtotal = orderSummary?.subtotal || 0;
  const totalDiscounts =
    (orderSummary?.overallDiscounts || 0) +
    (orderSummary?.lineDiscounts || 0);

  const totalTax = orderSummary?.totalTax || 0;
  const grandTotal = orderSummary?.grandTotal || 0;

  const rows = [
    {
      label: "Subtotal",
      value: subtotal,
    },
    {
      label: "Discount",
      value: totalDiscounts,
      valueClass: "text-emerald-600",
    },
    {
      label: "Tax",
      value: totalTax,
    },
  ];

  return (
    <div className="relative shrink-0 border-t border-slate-200 bg-white px-4 py-3">

      {/* Expand / Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          absolute
          -top-4
          left-1/2
          -translate-x-1/2
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          shadow-md
          transition-all
          hover:bg-slate-50
          hover:shadow-lg
        "
      >
        {expanded ? (
          <ChevronDown size={18} className="text-slate-600" />
        ) : (
          <ChevronUp size={18} className="text-slate-600" />
        )}
      </button>

      {/* Expandable Section */}
      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ${
            expanded
              ? "max-h-48 opacity-100 mb-3"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="space-y-2 pb-0">

          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium text-slate-500">
                {row.label}
              </span>

              <span
                className={`font-semibold ${
                  row.valueClass ?? "text-slate-800"
                }`}
              >
                {formatCurrency(row.value, false)}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* Grand Total */}
      <div
        className={`
          flex
          items-center
          justify-between
          ${
            expanded
              ? "border-t border-slate-200 pt-3"
              : ""
          }
        `}
      >
        <div>
          {/* <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Payable
          </p> */}

          <h2 className="text-base font-bold text-slate-500">
            Grand Total
          </h2>
        </div>

        
        
              <div
                className={` flex items-baseline gap-1`}
              >
                <span className="text-sm font-medium text-gray-500">{getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.</span>

        <span className="text-xl font-mono font-extrabold tracking-tight text-gray-600">
          {formatCurrency(grandTotal,false)}
        </span>
</div>

      </div>
    </div>
  );
};

export default OrderSummary;

// import React from 'react';
// import { useSelector } from 'react-redux';
// import { formatCurrency } from '../../../utils/format';

// const OrderSummary = () => {
//   const orderSummary = useSelector((state) => state.orderList.orderSummary);
//   const orderList = useSelector((state) => state.orderList.list || []);

//   const subtotal = orderSummary?.subtotal || 0;
//   const totalDiscounts = (orderSummary?.overallDiscounts || 0) + (orderSummary?.lineDiscounts || 0);
//   const totalTax = orderSummary?.totalTax || 0;
//   const grandTotal = orderSummary?.grandTotal || 0;

//   const itemCount = orderList.reduce((sum, item) => sum + (item.qty || 0), 0);

//   return (
//     <div style={{
//       padding: "12px 18px",
//       borderTop: "1px solid var(--lpos-border)",
//       display: "flex",
//       flexDirection: "column",
//       gap: 6,
//       flexShrink: 0,
//       background: "var(--lpos-surface)"
//     }}>
//       {/* Summary Items */}
//       {[
//         { label: "Subtotal", val: formatCurrency(subtotal,false) },
//         { 
//           label: "Discount", 
//           val: ` ${formatCurrency(totalDiscounts,false)}`, 
//           color: "var(--lpos-green)" 
//         },
//         { label: "Tax", val: formatCurrency(totalTax,false) },
//       ].map(({ label, val, color }) => (
//         <div 
//           key={label} 
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             fontSize: "13px",
//             color: "var(--lpos-text-secondary)"
//           }}
//         >
//           <span style={{ fontWeight: 500 }}>{label}</span>
//           <span style={{ 
//             fontWeight: 600, 
//             color: color || "var(--lpos-text-primary)" 
//           }}>
//             {val}
//           </span>
//         </div>
//       ))}

//       {/* Grand Total - Highlighted */}
//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         fontSize: "16px",
//         fontWeight: 700,
//         color: "var(--lpos-text-primary)",
//         marginTop: 4,
//         paddingTop: 10,
//         borderTop: "1px solid var(--lpos-border)"
//       }}>
//         <span style={{ 
//           fontSize: "17px" 
//         }}>Grand Total</span>
//         <span style={{ 
//           fontSize: "17px" 
//         }}>
//           {formatCurrency(grandTotal)}
//         </span>
//       </div>

 
//     </div>
//   );
// };

// export default OrderSummary;