import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelDiscount,
  removeOrder,
  increaseQty,
} from "../../../state/orderList/orderListSlice";
import { DISCOUNT_TYPES, CURRENCY_DISPLAY_TYPE } from "../../../utils/constants";
import { formatCurrency, getCurrency } from '../../../utils/format';
import { PackageIcon, PercentCircle,Trash2 } from "lucide-react";

export default function ProductOrderList({ showDiscountPopup, isTraditionalMode = false }) {
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

  const handleRemove = (product) => {
    dispatch(removeOrder({ orderListId: product.orderListId }));
  };

  const handleQtyChange = (product, newQty) => {
    const increment = newQty - product.qty;
    if (!isNaN(increment) && increment !== 0 && product.qty + increment > 0) {
      dispatch(
        increaseQty({
          orderListId: product.orderListId,
          increment,
        })
      );
    }
  };
  
const [openMenuId, setOpenMenuId] = useState(null);

  const handleDiscountClick = (product) => {
    showDiscountPopup(product.orderListId);
  };

  const handleCancelDiscount = (product) => {
    dispatch(cancelDiscount({ orderListId: product.orderListId }));
  };

  if (isTraditionalMode) {
    // Traditional POS Table Mode
    return (
      <div className="lpos-scroll" style={{
        flex: 1,
        overflowY: "auto",
        background: "var(--lpos-surface)"
      }}>
        {products.length === 0 ? (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "var(--lpos-text-tertiary)",
            fontSize: 14,
            fontWeight: 500,
            minHeight: 180,
            opacity: 0.6
          }}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>
              <PackageIcon size={48} strokeWidth={1.2} />
            </div>
            <span>No products added</span>
            <span style={{ fontSize: 13 }}>Add items to get started</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Table Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "50px 80px 1fr 90px 120px 90px 80px",
              gap: "12px",
              padding: "12px 16px",
              background: "var(--lpos-bg)",
              borderBottom: "2px solid var(--lpos-border)",
              position: "sticky",
              top: 0,
              zIndex: 10,
              fontSize: 12,
              fontWeight: 700,
              color: "var(--lpos-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              <div>#</div>
              <div>SKU</div>
              <div>Description</div>
              <div style={{ textAlign: "right" }}>Unit Price</div>
              <div style={{ textAlign: "center" }}>Qty + Unit</div>
              <div style={{ textAlign: "right" }}>Total</div>
              <div style={{ textAlign: "center" }}>Actions</div>
            </div>

            {/* Table Rows */}
            <div>
              {products.map((product, idx) => {
                const hasDiscount = Boolean(product?.discount);
                const lineTotal = product.netAmount || (product.unitPrice * product.qty);
                const unitPrice = product.unitPrice || 0;
                const discountAmount = product.discount?.discountAmount || 0;

                return (
                  <div key={product.orderListId}>
                    {/* Main Row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "50px 80px 1fr 90px 120px 90px 80px",
                        gap: "12px",
                        padding: "12px 16px",
                        alignItems: "center",
                        borderBottom: "1px solid var(--lpos-border)",
                        background: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)";
                      }}
                    >
                      {/* Line Number */}
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--lpos-text-secondary)"
                      }}>
                        {product.originalLineNumber}
                      </div>

                      {/* SKU */}
                      <div style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--lpos-text-tertiary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }} title={product.sku}>
                        {product.sku || "—"}
                      </div>


                      {/* Description */}
                      <div style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--lpos-text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }} title={product.description}>
                        {product.description}

                           {product.batchNo ? (
                      <div className="text-[10px] sm:text-xs font-mono text-gray-200 w-fit bg-blue-700 px-1.5 py-0.5 rounded">
                        Batch: {product.batchNo}
                      </div>
                    ):''}

                      </div>

                      {/* Unit Price */}
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "right",
                        color: "var(--lpos-text-primary)"
                      }}>
                        {formatCurrency(unitPrice, true)}
                      </div>

                      {/* Qty + Unit */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6
                      }}>
                        <button
                          className="lpos-qty-btn"
                          onClick={() => handleQtyChange(product, product.qty - 1)}
                          style={{
                            width: 24,
                            height: 24,
                            padding: 0,
                            fontSize: 12,
                            minWidth: "auto"
                          }}
                        >
                          −
                        </button>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          minWidth: 30,
                          textAlign: "center"
                        }}>
                          {product.qty}
                        </span>
                        <button
                          className="lpos-qty-btn"
                          onClick={() => handleQtyChange(product, product.qty + 1)}
                          style={{
                            width: 24,
                            height: 24,
                            padding: 0,
                            fontSize: 12,
                            minWidth: "auto"
                          }}
                        >
                          +
                        </button>
                        <span style={{
                          fontSize: 11,
                          color: "var(--lpos-text-tertiary)",
                          minWidth: 35,
                          textAlign: "right"
                        }}>
                          {product.measurementUnitName || ""}
                        </span>
                      </div>

                      {/* Total */}
                      <div style={{
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: "right",
                        color: hasDiscount ? "var(--lpos-green)" : "var(--lpos-text-primary)"
                      }}>
                        {formatCurrency(lineTotal, true)}
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6
                      }}>
                        <button
                          onClick={() => handleDiscountClick(product)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: hasDiscount ? "1px solid var(--lpos-green)" : "1px solid var(--lpos-border)",
                            background: hasDiscount ? "rgba(52,199,89,.15)" : "white",
                            color: hasDiscount ? "var(--lpos-green)" : "var(--lpos-text-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            padding: 0,
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--lpos-green)";
                            e.currentTarget.style.background = "rgba(52,199,89,.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = hasDiscount ? "var(--lpos-green)" : "var(--lpos-border)";
                            e.currentTarget.style.background = hasDiscount ? "rgba(52,199,89,.15)" : "white";
                          }}
                          title="Apply Discount"
                        >
                          <PercentCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRemove(product)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: "1px solid var(--lpos-border)",
                            background: "white",
                            color: "var(--lpos-text-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--lpos-red)";
                            e.currentTarget.style.background = "rgba(255,59,48,.1)";
                            e.currentTarget.style.color = "var(--lpos-red)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--lpos-border)";
                            e.currentTarget.style.background = "white";
                            e.currentTarget.style.color = "var(--lpos-text-secondary)";
                          }}
                          title="Remove"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    {/* Discount Row - if applicable */}
                    {hasDiscount && (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "50px 80px 1fr 90px 120px 90px 80px",
                        gap: "12px",
                        padding: "8px 16px",
                        background: "rgba(52,199,89,.08)",
                        borderBottom: "1px solid rgba(52,199,89,.2)",
                        alignItems: "center",
                        fontSize: 12
                      }}>
                        <div></div>
                        <div></div>
                        <div style={{ color: "var(--lpos-green)", fontWeight: 500 }}>
                          <span>Discount: {product.discount.discountValue}{product.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "%" : ` ${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`}</span>
                          {product.discount.reasonName && <span> • {product.discount.reasonName}</span>}
                        </div>
                        <div style={{
                          textAlign: "right",
                          color: "var(--lpos-green)",
                          fontWeight: 600
                        }}>
                          -{formatCurrency(discountAmount, true)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original Card Mode (default)
// ==================== IMPROVED CARD MODE (Default) ====================
return (
  <div className="lpos-scroll" style={{
    flex: 1,
    overflowY: "auto",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "var(--lpos-surface)"
  }}>
    {products.length === 0 ? (
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "var(--lpos-text-tertiary)",
        fontSize: 14,
        fontWeight: 500,
        minHeight: 200,
        opacity: 0.6
      }}>
        <PackageIcon size={48} strokeWidth={1.2} />
        <span>No products added</span>
        <span style={{ fontSize: 13 }}>Add items from the product grid</span>
      </div>
    ) : (
      products.map((product) => {
        const hasDiscount = Boolean(product?.discount);
        const lineTotal = product.netAmount || (product.unitPrice * product.qty);
        const unitPrice = product.unitPrice || 0;

        return (
          <div
            key={product.orderListId}
            className="lpos-cart-item bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-200 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-5 relative"
           style={{
              background: "var(--lpos-bg)",
              borderRadius: "var(--lpos-radius-md)",
              padding: "14px 16px",
              border: "1px solid transparent",
              transition: "all 0.2s",
            }}
       
       >
            {/* Top Section */}
            <div className="flex gap-3 sm:gap-4">
              {/* Product Image */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[52px] lg:h-[52px] rounded-xl bg-white flex-shrink-0 shadow-sm overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={`${process.env.REACT_APP_API_CDN}/${product.imageUrl}?width=200&height=200&quality=80`}
                    alt={product.description}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon size={24} strokeWidth={1.6} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base lg:text-[15px] leading-tight line-clamp-2 mb-2 text-gray-900">
                  {product.description}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {product.sku && (
                    <div className="text-[10px] sm:text-xs font-mono text-gray-200 bg-gray-700 px-1.5 py-0.5 rounded">
                      {product.sku}
                    </div>

                 
                  )}
                  <div className="text-sm sm:text-base font-medium text-gray-700">
                    {formatCurrency(unitPrice)}
                  </div>

                     {product.batchNo ? (
                      <div className="text-[10px] sm:text-xs font-mono text-gray-200 bg-blue-700 px-1.5 py-0.5 rounded">
                        Batch: {product.batchNo}
                      </div>
                    ):''}

                </div>
              </div>

              {/* Dropdown Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === product.orderListId ? null : product.orderListId)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <span className="text-2xl leading-none">⋯</span>
                </button>

                {/* Dropdown Menu */}
                {openMenuId === product.orderListId && (
                  <div className="absolute right-0 top-10 bg-white shadow-xl border border-gray-200 rounded-xl py-1 z-20 w-48 text-sm">
                    <button
                      onClick={() => {
                        hasDiscount ? handleCancelDiscount(product) : handleDiscountClick(product);
                        setOpenMenuId(null);
                      }}

                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 ${
                        hasDiscount ? "text-red-600" : "text-gray-700"
                      }`}
                    >
                      <PercentCircle size={18} />
                      {hasDiscount ? "Remove Discount" : "Apply Discount"}
                    </button>

                    <button
                      onClick={() => {
                        handleRemove(product);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-sm text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-red-600"
                    >
                      <Trash2 size={18} />
                      Remove Item
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Bar - Quantity & Total */}
            <div className="flex items-center justify-between mt-5">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  className="lpos-qty-btn w-8 h-8 sm:w-9 sm:h-9 text-lg flex items-center justify-center"
                  onClick={() => handleQtyChange(product, product.qty - 1)}
                >
                  −
                </button>
                <span className="font-bold text-base sm:text-lg w-8 text-center">
                  {product.qty}
                </span>
                <button
                  className="lpos-qty-btn w-8 h-8 sm:w-9 sm:h-9 text-lg flex items-center justify-center"
                  onClick={() => handleQtyChange(product, product.qty + 1)}
                >
                  +
                </button>

                {product.measurementUnitName && (
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">
                    {product.measurementUnitName}
                  </span>
                )}
              </div>

              {/* Line Total */}
              <div className={`font-bold text-base sm:text-lg lg:text-xl ${
                hasDiscount ? "text-green-600" : "text-gray-900"
              }`}>
                {formatCurrency(lineTotal,true)}
              </div>
            </div>




                       {/* Discount Info Row - Shown only when discount is applied */}
            {hasDiscount && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-green-50/70 rounded-xl px-4 py-2.5">
                <div className="text-sm font-medium text-green-700">
                  Discount: {product.discount.discountValue}
                  {product.discount.discountTypeId === 1 ? "%" : ` ${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`}
                  {product.discount.reasonName && ` • ${product.discount.reasonName}`}
                </div>
                
           <button
                  onClick={() => hasDiscount 
                    ? handleCancelDiscount(product) 
                    : handleDiscountClick(product)
                  }
                  className={`w-8 h-8 sm:w-9 sm:h-9 bg-white border rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                    hasDiscount 
                      ? "border-red-400 text-red-500 hover:bg-red-50" 
                      : "border-gray-200 hover:border-green-400 hover:text-green-500"
                  }`}
                  title={hasDiscount ? "Remove Discount" : "Apply Discount"}
                >
                  <PercentCircle 
                    size={18} 
                    strokeWidth={hasDiscount ? 3 : 2.5} 
                  />
                </button>
              </div>
            )}


          </div>
        );
      })
    )}
  </div>
);
}