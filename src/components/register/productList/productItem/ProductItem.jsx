import { CopyIcon } from "lucide-react";
import ProductCardButton from "./ProductCardButton";

const ProductItem = ({ p, handleProductClick, loading, orderQty }) => {
  let variationProducts = [];
  let variationValueLevel = 0;
  try {
    variationProducts = JSON.parse(p.variationProducts || '[]');
    variationValueLevel = variationProducts[0]?.variationValueLevel ?? 0;
  } catch (e) {
    variationProducts = [];
    variationValueLevel = 0;
  }
  const hasImage = Boolean(p.imageUrl);
  const isDisabled = false;

  if (variationValueLevel) {
    return (
      <div
        className={`
          group relative flex flex-col
          bg-white
          rounded-xl cursor-pointer p-6 border border-gray-200
          min-h-[100px] w-full min-w-44
          transition-all duration-300 ease-out
         hover:shadow-md hover:border-sky-400
          active:scale-95
          ${isDisabled ? "opacity-50 pointer-events-none" : ""}
        `}
        onClick={() => !isDisabled && handleProductClick(p)}
        title={p.productName}
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Waiting...
            </div>
          </div>
        )}
        {/* Image (if exists) */}
        {/* {hasImage && (
          <div className={`w-24 h-24 rounded-lg overflow-hidden
             ${hasImage 
              ? "flex justify-center items-center w-14 h-14 mx-auto" 
              : ""
            }`}>
            <img
              src={`${process.env.REACT_APP_API_CDN}/${p.imageUrl}?width=200&height=200&quality=80`}
              alt={p.productName}
              className="w-full h-full object-cover"
            />
          </div>
        )} */}

     




     

        <div
          // className={`
          //   ${hasImage 
          //     ? "absolute top-2 right-2 w-8 h-8" 
          //     : "flex justify-center items-center w-12 h-12 mx-auto"
          //   }
          //   text-sky-600 group-hover:text-sky-700 transition-colors
          // `}

            className={`
            flex justify-center items-center w-12 h-12 mx-auto
            text-sky-600 group-hover:text-sky-700 transition-colors`}
        >
          <CopyIcon className="w-full h-full"  />
        </div>
        <div className="flex-1" />
        <p
          className="mt-4 text-sm font-bold text-gray-700 tracking-tight text-center
                     group-hover:text-sky-700 transition-colors"
          title={p.productName}
        >
          {p.productName}
        </p>
      </div>
    );
  }

  // === Regular Product ===
  return (
    <ProductCardButton
      productName={p.productName}
      imageUrl={p.imageUrl}
      hasImage={hasImage}
      unitPrice={variationProducts?.[0]?.unitPrice ?? p.unitPrice}
      isStockTracked={p.isStockTracked}
      stockQty={p.stockQty}
      sku={variationProducts?.[0]?.sku}
      variationProducts={variationProducts}
      onClick={() => !isDisabled && handleProductClick(p)}
      loading={loading}
      orderQty={orderQty}
    />
  );
  
};

export default ProductItem;