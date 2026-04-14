import React from "react";
import { formatCurrency } from "../../../../utils/format";
import { PackageIcon } from "lucide-react";

const ProductCardButton = ({
  disabled,
  onClick,
  title,
  className = "",
  style = {},
  sku,
  hasImage,
  imageUrl,
  productName,
  unitPrice,
  isStockTracked,
  variationLabel,
  stockQty,
  children,
}) => {
  const renderDetailCard = variationLabel !== undefined || sku !== undefined || unitPrice !== undefined;

  return (
    <button
      type="button"
      className={`
        group relative overflow-hidden
        flex flex-col justify-between
        bg-white backdrop-blur-sm
        rounded-xl cursor-pointer
        p-4 border border-gray-200
        min-h-[140px] w-full min-w-[240px]
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        hover:bg-gradient-to-br hover:from-sky-50 hover:to-white
        hover:border-sky-400
        active:scale-95
        ${disabled ? "opacity-50 pointer-events-none" : ""}
        ${className}
      `}
      style={{ ...style }}
      onClick={onClick}
      title={title}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--lpos-accent)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--lpos-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {productName ? (
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {productName}
          </p>
        </div>
      ) : null}

      {renderDetailCard ? (
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-slate-50">
            {hasImage ? (
              <img
                src={`${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sky-600">
                <PackageIcon className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase tracking-[0.24em] text-gray-500">
                SKU
              </span>
              <span className="text-xs font-semibold text-gray-800 truncate">
                {sku || "N/A"}
              </span>
            </div>

            <div className="text-sm font-medium text-gray-700 truncate">
              {variationLabel}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-sky-600">
                {formatCurrency(unitPrice, true)}
              </span>
              {isStockTracked ? (
                stockQty > 0 ? (
                  <span className="text-xs font-semibold text-emerald-600">
                    Qty: {stockQty}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-600">
                    Out of Stock
                  </span>
                )
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ProductCardButton;
