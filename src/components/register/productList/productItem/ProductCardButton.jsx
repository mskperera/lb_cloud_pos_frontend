import React from "react";
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
  measurementUnitName
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


       onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--lpos-accent)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.1)";
                          }}


    >
<div className="flex w-full min-h-[120px]">
  
  <div className="w-[40%] bg-sky-100 p-3 flex items-center justify-center relative">
    <div className="w-full h-full rounded-l-xl overflow-hidden flex items-center justify-center">
      {hasImage ? (
        <img
          src={`${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`}
          alt={productName}
          className="w-full h-full object-cover"
        />
      ) : (
        <PackageIcon className="w-10 h-10 text-sky-600" />
      )}
    </div>

<div className="absolute bottom-2 left-2 bg-white text-white text-xs px-1 rounded font-mono font-semibold">
     {isStockTracked ? (
                          <>
                            {stockQty === 0 && (
                              <span
                                style={{
                                  color: "var(--lpos-red)",
                                }}
                              >
                                Out of Stock
                              </span>
                            )}

                            {stockQty > 0 && (
                              <p
                                style={{
                                  color: "var(--lpos-green)",
                                  marginTop: "auto",
                                }}
                              >
                              {stockQty} {measurementUnitName}
                              </p>
                            )}
                          </>
                        ):null}

       </div>
  </div>


<div className="flex-1 flex flex-col items-center justify-center pb-1">

      <p
        className="mt-auto px-1 text-sm  text-gray-800 text-center mb-1
                   group-hover:text-sky-700 transition-colors font-semibold"
        title={productName}
      >
        {productName}
      </p>

             <p
                            className="p-2 mb-2 bg-gray-700 w-min text-white rounded-lg text-sm font-semibold" 
                            style={{
                              color: "var(--lpos-text-tertiary)",
                              fontFamily: "monospace",
                            }}
                          >
                            SKU:{sku || "N/A"}
                          </p>
  



        <p className="mb-2 text-xs text-gray-500 text-center font-mono"
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--lpos-accent)",
                            marginTop: "auto",
                          }}
                        >
                          {formatCurrency(unitPrice, true)}
                        </p>


<div>
       
</div>
</div>

</div>

    </button>



  );
};

export default ProductCardButton;
