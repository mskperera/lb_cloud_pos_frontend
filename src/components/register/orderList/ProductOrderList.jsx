import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelDiscount,
  removeOrder,
  increaseQty,
} from "../../../state/orderList/orderListSlice";
import { DISCOUNT_TYPES, CURRENCY_DISPLAY_TYPE } from "../../../utils/constants";
import { formatCurrency, getCurrency } from '../../../utils/format';
import { PackageIcon, PercentCircle, PercentCircleIcon, XIcon, Trash2 } from "lucide-react";

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
    if (!isNaN(increment)) {
      dispatch(
        increaseQty({
          orderListId: product.orderListId,
          increment,
        })
      );
    }
  };

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
                          title="Remove Item"
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
  return (
    <div className="lpos-scroll" style={{
      flex: 1,
      overflowY: "auto",
      padding: "10px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
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
              className="lpos-cart-item"
              style={{
                background: "var(--lpos-bg)",
                borderRadius: "var(--lpos-radius-sm)",
                padding: "12px 14px",
                border: "1px solid transparent",
                transition: "border-color .15s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--lpos-border)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
            >
              {/* Top Row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {/* Image */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "var(--lpos-shadow-sm)",
                  overflow: "hidden"
                }}>
                  {product.imageUrl ? (
                    <img
                      src={`${process.env.REACT_APP_API_CDN}/${product.imageUrl}?width=200&height=200&quality=80`}
                      alt={product.description}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <PackageIcon size={22} strokeWidth={1.8} color="var(--lpos-text-tertiary)" />
                  )}
                </div>

                {/* Product Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    lineHeight: 1.35,
                    marginBottom: 3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {product.description}
                  </div>

                 
                 <div className="flex items-center justify-between gap-6">
                  {product.sku && (
                    <div className="text-gray-200 bg-gray-700 py-[1px] px-[6px]" style={{


                      fontFamily: "monospace",
                      borderRadius: 4,
                      display: "inline-block",
                      marginBottom: 4
                    }}>
                      {product.sku}
                    </div>
                  )}


                                   {/* Discount Button */}
                <button
                  onClick={() => handleDiscountClick(product)}
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: hasDiscount ? "1px solid var(--lpos-green)" : "1px solid var(--lpos-border)",
                    background: hasDiscount ? "rgba(52,199,89,.1)" : "white",
                    fontSize: 12,
                    fontWeight: 600,
                    color: hasDiscount ? "var(--lpos-green)" : "var(--lpos-text-secondary)",
                    cursor: "pointer",
                    boxShadow: "var(--lpos-shadow-sm)",
                    whiteSpace: "nowrap"
                  }}
                >
                  <PercentCircle size={18} />
                  {hasDiscount ? `${product.discount.discountValue}% off` : ""}
                </button>
</div>

{/* <div className="flex items-center justify-between gap-6">
                  <div style={{ fontSize: 12, color: "var(--lpos-text-secondary)", fontWeight: 500 }}>
                   {formatCurrency(unitPrice,false)}
                  </div>

                  
       
                </div> */}

                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "none",
                    background: "none",
                    color: "var(--lpos-text-tertiary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .15s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,59,48,.1)";
                    e.currentTarget.style.color = "var(--lpos-red)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "var(--lpos-text-tertiary)";
                  }}
                >
                  <XIcon size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Bottom Row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                {/* Quantity Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    className="lpos-qty-btn"
                    onClick={() => handleQtyChange(product, product.qty - 1)}
                    style={{ width: 28, height: 28 }}
                  >
                    −
                  </button>
                  <span style={{ 
                    fontSize: 15, 
                    fontWeight: 700, 
                    minWidth: 28, 
                    textAlign: "center" 
                  }}>
                    {product.qty}
                  </span>
                  <button
                    className="lpos-qty-btn"
                    onClick={() => handleQtyChange(product, product.qty + 1)}
                    style={{ width: 28, height: 28 }}
                  >
                    +
                  </button>
                  {product.measurementUnitName && (
                    <span style={{ fontSize: 12, color: "var(--lpos-text-tertiary)", marginLeft: 4 }}>
                      {product.measurementUnitName}
                    </span>
                  )}
                </div>

        

                {/* Net Amount */}
                <div style={{
                  marginLeft: "auto",
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: hasDiscount ? "var(--lpos-accent)" : "var(--lpos-text-primary)"
                }}>
                  {lineTotal.toFixed(2)}
                </div>
              </div>

              {/* Discount Info Row */}
              {hasDiscount && (
                <div style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  background: "rgba(52,199,89,.08)",
                  borderRadius: 8,
                  border: "1px solid rgba(52,199,89,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 13
                }}>
                  <div style={{ color: "var(--lpos-green)", fontWeight: 500 }}>
                    Discount: {product.discount.discountValue}
                    {product.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "%" : ` ${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`}
                    {" • "}{product.discount.reasonName}
                  </div>
                  <button
                    onClick={() => handleCancelDiscount(product)}
                    style={{
                      color: "var(--lpos-red)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 6px",
                      borderRadius: 4
                    }}
                  >
                    Remove
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