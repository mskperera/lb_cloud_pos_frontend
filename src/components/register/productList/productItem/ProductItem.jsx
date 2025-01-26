const ProductItem = ({ p, handleProductClick }) => {
  const hasImage = Boolean(p.imageUrl);
  const stockClass = p.stockQty > 0 ? "text-green-600" : "text-red-600";
  const stockText = p.stockQty > 0 ? `${p.stockQty} ${p.measurementUnitName}` : "Out of stock";

  const isNewStock = p.hasUnreleasedStock; // Assuming `isNewStock` is a flag for newly released stock
  
  // Determine if the card should be disabled
  const isDisabled = p.stockQty == 0;

  return (
    <div
    className={`flex flex-col w-full md:w-[220px] items-center justify-between
      rounded-lg cursor-pointer py-2 px-0 bg-white shadow-sm border border-[#dddddd]
      ${p.stockQty > 0 ? "hover:border-green-500" : "hover:border-red-500"}
      hover:shadow-xl transition duration-300 
       ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={() => !isDisabled && handleProductClick(p)} // Prevent click if disabled
  >

      <div className="flex items-center gap-3">
        {hasImage && (
          <img
            src={`${process.env.REACT_APP_API_CDN}/${p.imageUrl}?width=200&height=200&quality=80`}
            alt={p.productName}
            className="w-[60px] h-[60px] rounded-lg object-cover"
          />
        )}
        <div className="flex flex-col">
          <p className={`text-sm ${stockClass} mb-1`}>
            {stockText}
          </p>
          <p className="text-sm text-gray-600 font-medium">
            Rs {p.unitPrice}
          </p>
        </div>
      </div>
      <div className="text-[1rem] font-semibold text-gray-800 truncate group-hover:overflow-visible group-hover:text-ellipsis group-hover:whitespace-normal">
        {p.productName}
      </div>
      <p className="text-sm text-gray-600">SKU: {p.sku || "N/A"}</p>

      {/* Display message for new stock if available */}
      {isNewStock ? (
        <p className="text-sm text-yellow-600 mt-2">
          New unreleased stock available!
        </p>
      ):''}
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