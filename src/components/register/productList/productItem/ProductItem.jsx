import { CopyIcon } from "lucide-react";
import ProductCardButton from "./ProductCardButton";

const ProductItem = ({ p, handleProductClick, loading }) => {
  //const isVariationProduct =JSON.parse(p.variationProducts).length > 1;
  let variationProducts = [];
  let variationValueLevel = 0;
  try {
    variationProducts = JSON.parse(p.variationProducts || "[]");
    variationValueLevel = variationProducts[0]?.variationValueLevel ?? 0;
  } catch (error) {
    variationProducts = [];
    variationValueLevel = 0;
  }

  const hasImage = Boolean(p.imageUrl);

  const isDisabled = false;
  // === Variation Product ===
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
        {hasImage && (
          <div className={`w-14 h-14 rounded-lg overflow-hidden ring-1 ring-gray-200 
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
        )}

 
        <div
          className={`
            ${hasImage 
              ? "absolute top-2 right-2 w-8 h-8" 
              : "flex justify-center items-center w-12 h-12 mx-auto"
            }
            text-sky-600 group-hover:text-sky-700 transition-colors
          `}
        >
          {/* <FaClone className="w-full h-full" /> */}
          <CopyIcon className="w-full h-full"  />
              {/* <PackageIcon className="w-full h-full" strokeWidth={1.2} /> */}
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
      sku={JSON.parse(p.variationProducts)[0].sku}
      variationProducts={variationProducts}
      onClick={() => !isDisabled && handleProductClick(p)}
      loading={loading}
    />  

//     <div
//       className={`
//         group relative overflow-hidden
//         flex flex-col justify-between
//         bg-white backdrop-blur-sm
//         rounded-xl cursor-pointer
//         p-3  border border-gray-200
//         min-h-[100px] w-full min-w-44
//         transition-all duration-300 ease-out
//         hover:scale-[1.02] hover:shadow-xl
//         hover:bg-gradient-to-br hover:from-sky-50 hover:to-white
//         hover:border-sky-400
//         active:scale-95
//         ${isDisabled ? "opacity-50 pointer-events-none" : ""}
//       `}
//       onClick={() => !isDisabled && handleProductClick(p)}
//     >

  
//       <div className={`flex items-center z-10 justify-center`}>
//         {/* Image or Empty Space */}
//         <div className="w-14 h-14">
//           {hasImage ? (
//             <img
//               src={`${process.env.REACT_APP_API_CDN}/${p.imageUrl}?width=200&height=200&quality=80`}
//               alt={p.productName}
//               className="w-full h-full rounded-lg object-cover shadow-sm ring-1 ring-gray-200"
//             />
//           ) : (
//                <PackageIcon className="w-10 h-10 text-sky-600"  />
//           )}
//         </div>

  
//       </div>

//       <div className="flex-1" />

//       <p
//         className="mt-auto px-1 text-sm  text-gray-800 text-center mb-1
//                    group-hover:text-sky-700 transition-colors"
//         title={p.productName}
//       >
//         {p.productName}
//       </p>

//         <p className="mt-1 text-xs text-gray-500 text-center font-mono">
//           SKU: {variationProducts?.[0]?.sku || p.sku || "N/A"}
//         </p>



//         <p className="mt-1 text-xs text-gray-500 text-center font-mono"
//                           style={{
//                             fontSize: 14,
//                             fontWeight: 700,
//                             color: "var(--lpos-accent)",
//                             marginTop: "auto",
//                           }}
//                         >
//                           {formatCurrency(variationProducts?.[0]?.unitPrice ?? p.unitPrice, true)}
//                         </p>


// <div>
//         {p?.isStockTracked ? (
//                           <>
//                             {p.stockQty === 0 && (
//                               <span
//                                 style={{
//                                   fontSize: 10,
//                                   color: "var(--lpos-red)",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 Out of Stock
//                               </span>
//                             )}

//                             {p.stockQty > 0 && (
//                               <p
//                                 style={{
//                                   fontSize: 12,
//                                   fontWeight: 700,
//                                   color: "var(--lpos-green)",
//                                   marginTop: "auto",
//                                 }}
//                               >
//                                 Qty: {p.stockQty}
//                               </p>
//                             )}
//                           </>
//                         ):null}
// </div>

//     </div>
  );
};

export default ProductItem;