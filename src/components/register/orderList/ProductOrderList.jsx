import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelDiscount,
  decreaseQty,
  increaseQty,
  removeOrder,
} from "../../../state/orderList/orderListSlice";
import { DISCOUNT_TYPES } from "../../../utils/constants";

export default function ProductOrderList({ showDiscountPopup }) {
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

  const orderListItemMenu = (product) => (
    <div className="flex gap-2 justify-end">
      <button
        className="text-primaryColor hover:text-primaryColorHover"
        onClick={() => showDiscountPopup(product.orderListId)}
        aria-label="Discount"
      >
        <i className="pi pi-percentage text-xl"></i>
      </button>
      <button
        className="text-red-400 hover:text-red-500"
        onClick={() => dispatch(removeOrder({ orderListId: product.orderListId }))}
        aria-label="Cancel"
      >
        <i className="pi pi-times text-xl"></i>
      </button>
    </div>
  );

  const qty = (product) => {
    const handleChangeQty = (e) => {
      const newQty = parseInt(e.target.value, 10);
      if (!isNaN(newQty) && newQty >= 0) {
        dispatch(
          increaseQty({
            orderListId: product.orderListId,
            increment: newQty - product.qty,
          })
        );
      }
    };

    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={product.qty}
          onChange={handleChangeQty}
          className="input input-bordered text-center w-16 rounded-md"
          min="1"
        />
        <span className="text-sm text-gray-500">{product.measurementUnitName}</span>
      </div>
    );
  };

  const netAmount = (product) => (
    <div className="text-right text-sm font-medium text-gray-700">
      {product.netAmount.toFixed(2)}
    </div>
  );

  const descriptionBodyTemplate = (product) => (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-gray-800">{product.productNo}</span>
      <span className="text-gray-600 text-sm">{product.description}</span>
    </div>
  );

  const handleCancelDiscount = (orderListId) => {
    dispatch(cancelDiscount({ orderListId }));
  };

  return (
    <table className="table-auto w-full border border-gray-300 rounded-md shadow-lg">
      <thead className="bg-gray-200">
        <tr className="text-sm text-gray-700">
          <th className="py-3 px-4 text-left">Description</th>
          <th className="py-3 px-4 text-center">Qty</th>
          <th className="py-3 px-4 text-right">Amount</th>
          <th className="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {products.map((product) => (
          <React.Fragment key={product.orderListId}>
            <tr
              className={`${
                product?.discount ? "bg-gray-100" : ""
              } border-b last:border-none`}
            >
              <td className="py-3 px-4">{descriptionBodyTemplate(product)}</td>
              <td className="py-3 px-4 text-center">{qty(product)}</td>
              <td className="py-3 px-4">{netAmount(product)}</td>
              <td className="py-3 px-4 text-right">{orderListItemMenu(product)}</td>
            </tr>
            {product?.discount && (
              <tr className="bg-gray-50 text-sm text-gray-600 border-b last:border-none">
                <td colSpan={3} className="py-2 px-4">
                  {`Discount: ${product.discount.discountValue} ${
                    product.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE
                      ? "%"
                      : "Rs"
                  } | ${product.discount.reasonName}`}
                </td>
                <td className="py-2 px-4 text-right">
                  <button
                    className="text-red-400 hover:text-red-500"
                    onClick={() => handleCancelDiscount(product.orderListId)}
                    aria-label="Cancel Discount"
                  >
                    <i className="pi pi-times text-sm"></i>
                  </button>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}


// previous original
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   cancelDiscount,
//   decreaseQty,
//   increaseQty,
//   removeOrder,
// } from "../../../state/orderList/orderListSlice";
// import { DISCOUNT_TYPES } from "../../../utils/constants";

// export default function ProductOrderList({ showDiscountPopup }) {
//   const orderList = useSelector((state) => state.orderList);
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState([]);

//   // Initialize products with original line numbers when the component mounts or orderList changes
//   useEffect(() => {
//     const productsWithLineNumber = orderList.list.map((product, index) => ({
//       ...product,
//       originalLineNumber: index + 1, // Assigning a unique line number based on index
//     }));
//     setProducts(productsWithLineNumber);
//   }, [orderList]);

//   const orderListItemMenu = (product) => {
//     const removeOrderHandler = () => {
//       dispatch(removeOrder({ orderListId: product.orderListId }));
//     };

//     const addLineDiscountHandler = () => {
//       showDiscountPopup(product.orderListId);
//     };

//     return (
//       <div className="flex gap-2 justify-end">
//         <button
//           className="btn btn-success btn-xs m-0 p-0 bg-transparent text-primaryColor border-none hover:bg-transparent hover:text-primaryColorHover font-extrabold"
//           onClick={addLineDiscountHandler}
//           aria-label="Discount"
//         >
//           <i className="pi pi-percentage "></i>
//         </button>
//         <button
//           className="btn btn-danger btn-xs m-0 p-0 bg-transparent text-red-400 border-none  hover:bg-transparent hover:text-red-500 font-extrabold"
//           onClick={removeOrderHandler}
//           aria-label="Cancel"
//         >
//           <i className="pi pi-times"></i>
//         </button>
//       </div>
//     );
//   };

//   const qty = (product) => {
//     const handleDecrease = () => {
//       dispatch(decreaseQty({ orderListId: product.orderListId, decrement: 1 }));
//     };
  
//     const handleIncrease = () => {
//       dispatch(increaseQty({ orderListId: product.orderListId, increment: 1 }));
//     };
  
//     const handleChangeQty = (e) => {
//       const newQty = parseInt(e.target.value, 10);
//       if (!isNaN(newQty) && newQty >= 0) {
//         dispatch(increaseQty({ orderListId: product.orderListId, increment: newQty - product.qty }));
//       }
//     };
  
//     return (
//       <div className="flex items-center gap-0">
//         {/* <button
//           className="btn btn-outline m-0 p-0 btn-sm text-lg hover:text-primaryColorHover hover:bg-transparent bg-transparent font-bold border-none bg-base-300 rounded-r-none"
//           onClick={handleDecrease}
//         >
//             <FontAwesomeIcon icon={faMinus} className="text-sm" />
//         </button> */}
//   {/* {JSON.stringify(product)} */}
//         <input
//           type="number"
//           value={product.qty}
//           onChange={handleChangeQty}
//           className="input input-bordered input-sm text-center w-20 rounded-xl p-0 mt-3"
//           min="1"
//         />
//         <span className="pt-3 ml-1">{product.measurementUnitName}</span>
  
//         {/* <button
//           className="btn btn-outline btn-sm text-lg hover:text-primaryColorHover hover:bg-transparent bg-transparent border-none bg-base-300 rounded-l-none"
//           onClick={handleIncrease}
//         >
//           <FontAwesomeIcon icon={faPlus} className="text-sm"/>
//         </button> */}
//       </div>
//     );
//   };

//   const netAmount = (rowData) => (
//     <div className="flex justify-end">
//       {rowData.netAmount.toFixed(2)}
//     </div>
//   );

//   const descriptionBodyTemplate = (rowData) => (
    
//       <div className="flex gap-2 items-center p-0 m-0">
//         <span className="">{rowData.productNo}</span>|
//         <span>{rowData.description}</span>
//       </div>
    
//   );

//   const handleCancelDiscount = (orderListId) => {
//     dispatch(cancelDiscount({ orderListId }));
//   };

//   const lineNumberBodyTemplate = (rowData) => (
//     <React.Fragment>{rowData.originalLineNumber}</React.Fragment>
//   );

//   return (
//   <table className="table-auto w-full m-0 p-0">
//     <thead className="sticky top-0 text-lg bg-gray-100">
//       <tr className="text-gray-700">
//         {/* <th className="text-[1rem] text-center py-2">#</th> */}
//         <th className="text-[1rem] text-left px-4 py-2">Description</th>
//         <th className="text-[1rem] text-center py-2">Qty</th>
//         <th className="text-[1rem] text-center py-2">Amount</th>
//         <th className="text-[1rem] text-center py-2">Actions</th>
//       </tr>
//     </thead>
//     <tbody className="text-gray-800">
//       {products.map((product) => (
//         <React.Fragment key={product.orderListId}>
//           {/* Main Product Row */}
//           <tr
//             className={`${
//               product?.discount ? "bg-gray-200" : "bg-white"
//             } rounded-lg shadow-md border-b`}
//           >
//             <td className="py-2 px-4">
//               <div className="flex flex-col justify-center text-center">
//                 {descriptionBodyTemplate(product)}
//               </div>
//             </td>
//             <td className="py-0 px-0 text-center align-middle">{qty(product)}</td>
//             <td className="py-0 px-0 text-center align-middle">
//               {netAmount(product)}
//             </td>
//             <td className="py-0 px-4 text-right align-middle rounded-r-lg">
//               {orderListItemMenu(product)}
//             </td>
//           </tr>

//           {/* Discount Row (if applicable) */}
//           {product?.discount && (
//             <tr className="bg-gray-100 border-b">
//               <td colSpan={3} className="py-2 px-4 text-gray-600 text-sm">
//                 {`Discount: ${product.discount.discountValue} ${
//                   product.discount.discountTypeId === DISCOUNT_TYPES.PERCENTAGE
//                     ? "%"
//                     : "Rs"
//                 } | ${product.discount.reasonName}`}
//               </td>
//               <td className="py-2 px-4 text-right">
//                 <button
//                   className="btn p-0 m-0 bg-transparent text-red-400 btn-xs text-sm"
//                   onClick={() => handleCancelDiscount(product.orderListId)}
//                   aria-label="Cancel Discount"
//                 >
//                   <i className="pi pi-times"></i>
//                 </button>
//               </td>
//             </tr>
//           )}
//         </React.Fragment>
//       ))}
//     </tbody>
//   </table>
  
//   );
// }




