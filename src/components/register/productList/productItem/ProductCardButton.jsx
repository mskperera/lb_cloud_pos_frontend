import { formatCurrency } from "../../../../utils/format";
import { PackageIcon } from "lucide-react";

const ProductCardButton = ({
  disabled,
  onClick,
  sku,
  hasImage,
  imageUrl,
  productName,
  unitPrice,
  isStockTracked,
  variationLabel,
  stockQty,
  measurementUnitName,
  loading,
  orderQty
}) => {
  return (
    <button
      className={`
        group relative overflow-hidden
        flex items-stretch
        bg-white backdrop-blur-sm
        rounded-xl cursor-pointer
        p-0 border border-gray-200
        min-h-[120px] w-full min-w-44
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        hover:bg-gradient-to-br hover:from-sky-50 hover:to-white
        hover:border-sky-400
        active:scale-95
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Waiting...
          </div>
        </div>
      )}

      <div className="flex w-full min-h-[120px]">
        <div className="w-[40%] bg-sky-600 flex items-center justify-center relative overflow-hidden rounded-l-xl">
          {/* Badge for order quantity */}
          {orderQty > 0 && (
            <div style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: '#2563eb',
              color: 'white',
              borderRadius: '50%',
              minWidth: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              zIndex: 10
            }}>
              {orderQty}
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center">
            {hasImage ? (
              <img
                src={`${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <PackageIcon className="w-10 h-10 text-sky-200" />
            )}
          </div>

          <div className="absolute bottom-2 left-2 bg-white text-white text-xs px-1 rounded font-mono font-semibold">
            {isStockTracked ? (
              <>
                {stockQty === 0 && (
                  <span style={{ color: "var(--lpos-red)" }}>
                    Out of Stock
                  </span>
                )}
                {stockQty > 0 && (
                  <p style={{ color: "var(--lpos-green)", marginTop: "auto" }}>
                    {stockQty} {measurementUnitName}
                  </p>
                )}
              </>
            ) : null}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pb-1">
          <p
            className="mt-auto px-1 text-sm text-gray-800 text-center mb-1 group-hover:text-sky-700 transition-colors font-semibold"
            title={productName}
          >
            {productName}
          </p>

<div    className="p-2 mb-2 bg-gray-100 rounded-lg text-sm font-semibold"
          >
  <span className="text-gray-600"  style={{
              fontFamily: "monospace",
            }}
            > SKU</span>
      <p className="text-gray-700"
           style={{
              fontFamily: "monospace",
            }}
          >
           {sku || "N/A"}
          </p>
</div>
      

          <p
            className="mb-2 text-xs text-gray-500 text-center font-mono"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--lpos-accent)",
              marginTop: "auto",
            }}
          >
            {formatCurrency(unitPrice, true)}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ProductCardButton;
