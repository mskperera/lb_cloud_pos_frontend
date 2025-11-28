import { formatCurrency } from "../../../../utils/format";
import { FaClone } from "react-icons/fa";

const ProductItem = ({ p, handleProductClick }) => {
  const isVariationProduct =JSON.parse(p.allProductId).length > 1;
  const hasImage = Boolean(p.imageUrl);
  const stockText =
    !!p.isStockTracked &&
    (p.stockQty > 0 ? `${p.stockQty} ${p.measurementUnitName}` : "");

  const isDisabled = false;

  const variationProducts=JSON.parse(p.variationProducts);
  console.log('p,,,,',variationProducts)
  // === Variation Product ===
  if (isVariationProduct) {
  
    return (
      <div
        className={`
          group relative flex flex-col
          bg-gradient-to-br from-sky-50 to-white
          rounded-xl cursor-pointer p-6 shadow-md border-2 border-sky-200
          min-h-[100px] w-full min-w-44
          transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-xl hover:border-sky-400
          active:scale-95
          ${isDisabled ? "opacity-50 pointer-events-none" : ""}
        `}
        onClick={() => !isDisabled && handleProductClick(p)}
        title={p.productName}
      >
        {/* Image (if exists) */}
        {hasImage && (
          <div className="absolute top-2 left-2 w-14 h-14 rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-200">
            <img
              src={`${process.env.REACT_APP_API_CDN}/${p.imageUrl}?width=200&height=200&quality=80`}
              alt={p.productName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* FaClone Icon */}
        <div
          className={`
            ${hasImage 
              ? "absolute top-2 right-2 w-8 h-8" 
              : "flex justify-center items-center w-12 h-12 mx-auto"
            }
            text-sky-600 group-hover:text-sky-700 transition-colors
          `}
        >
          <FaClone className="w-full h-full" />
        </div>

        {/* Spacer to push productName to bottom */}
        <div className="flex-1" />

        {/* Product Name at bottom */}
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
    <div
      className={`
        group relative overflow-hidden
        flex flex-col justify-between
        bg-white/90 backdrop-blur-sm
        rounded-xl cursor-pointer
        p-3 shadow-md border border-gray-200
        min-h-[100px] w-full min-w-44
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        hover:bg-gradient-to-br hover:from-sky-50 hover:to-white
        hover:border-sky-400
        active:scale-95
        ${isDisabled ? "opacity-50 pointer-events-none" : ""}
      `}
      onClick={() => !isDisabled && handleProductClick(p)}
    >
      {/* Top Row: Image + Stock + Price */}
      <div className={`flex items-center z-10 justify-center`}>
        {/* Image or Empty Space */}
        <div className="w-14 h-14">
          {hasImage ? (
            <img
              src={`${process.env.REACT_APP_API_CDN}/${p.imageUrl}?width=200&height=200&quality=80`}
              alt={p.productName}
              className="w-full h-full rounded-lg object-cover shadow-sm ring-1 ring-gray-200"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>

  
      </div>

      <div className="flex-1" />

      <p
        className="mt-auto px-1 text-sm  text-gray-800 text-center mb-0
                   group-hover:text-sky-700 transition-colors"
        title={p.productName}
      >
        {p.productName}
      </p>

        <p className="mt-1 text-xs text-gray-500 text-center font-mono">
          {variationProducts[0].sku}
        </p>


        <div className={`flex flex-1 min-w-0 items-center ${stockText ? 'justify-between' : 'justify-center'}`}>
          <p className="text-sm font-bold text-gray-700">
            {formatCurrency(variationProducts[0].unitPrice, true)}
          </p>

               {stockText ? (
            <p className="text-xs font-medium text-green-600 truncate leading-tight">
              {stockText}
            </p>
          ) : (
            <div className="h-4" />
          )}

        </div>

    </div>
  );
};

export default ProductItem;


// import React from 'react'

// const ProductItem = ({ p,handleProductClick }) => {


//     return (
//       <>
//       {/* {JSON.stringify(p)} */}
//      {p.imageUrl ?   <button
//       className='flex flex-col btn h-auto border-none  md:w-[188px] items-center justify-between 
//       rounded-lg cursor-pointer py-2 px-2 gap-4 hover:bg-base-300 bg-slate-50'
//          onClick={() => handleProductClick(p)}
//       >   
//       <div className='flex gap-1 h-[55px] w-full justify-between items-center flex-1'>
//     <img
//               src={`${process.env.REACT_APP_API_CDN}/${p.imageUrl}?width=200&height=200&quality=80`}
//               alt={p.productName}
//               className='w-[50px] h-[50px] rounded-badge object-cover flex-1'
//             />
//           <div className='flex flex-col gap-2 flex-1 pt-2'>
//             <p className='text-md font-semibold text-center text-gray-600'>
//              Rs {p.unitPrice}
//             </p> 
//             <p className='text-[0.9rem] font-normal text-centet text-gray-600'>
//            {p.productNo}
//             </p> 
//             {p.isStockTracked===1 && <p className='text-[0.9rem] font-normal  text-center text-gray-600'>
//              {`${p.stockQty} ${p.measurementUnitName}`}
//             </p> }
//             </div>
//       </div>
//         <p className='text-md font-bold text-center text-gray-600'>{p.productName}</p>
//       </button>
// :
//       <button
//       className='flex flex-col btn h-auto border-none  md:w-[188px] items-center justify-between 
//       rounded-lg cursor-pointer py-2 px-2 gap-4 hover:bg-base-300 bg-slate-50'
//          onClick={() => handleProductClick(p)}
//       >   
//       <div className='flex gap-1 h-[55px] w-full justify-between items-center flex-1'>
  
//           <div className='flex flex-col gap-2 flex-1 pt-2'>
//             <p className='text-md font-semibold text-center text-gray-600'>
//              Rs {p.unitPrice}
//             </p> 
//             <p className='text-[0.9rem] font-normal text-centet text-gray-600'>
//            {p.productNo}
//             </p> 
//                  {p.isStockTracked===1 && <p className='text-[0.9rem] font-normal  text-center text-gray-600'>
//              {`${p.stockQty} ${p.measurementUnitName}`}
//             </p> }
//             </div>
//       </div>
//         <p className='text-md font-bold text-center text-gray-600'>{p.productName}</p>
//       </button>
// }
//       </>
//     );
//   };

// export default ProductItem