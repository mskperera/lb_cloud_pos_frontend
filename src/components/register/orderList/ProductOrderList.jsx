import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelDiscount,
  removeOrder,
  increaseQty,
} from "../../../state/orderList/orderListSlice";
import { DISCOUNT_TYPES, CURRENCY_DISPLAY_TYPE } from "../../../utils/constants";
import { formatCurrency, getCurrency } from '../../../utils/format';
import { ArrowLeftRight, PackageIcon, PercentCircle,Trash2 } from "lucide-react";
import OrderProductActionMenu from "./OrderProductActionMenu";

export default function ProductOrderList({ showDiscountPopup, isTraditionalMode = false }) {
  const orderList = useSelector((state) => state.orderList);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const menuRef = useRef(null);

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


useEffect(() => {

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setOpenMenuId(null);
    }
  };


  document.addEventListener(
    "mousedown",
    handleClickOutside
  );


  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };

}, []);



const handleChangeUnit=()=>{
  
}

  
const [openMenuId, setOpenMenuId] = useState(null);

  const handleDiscountClick = (product) => {
    showDiscountPopup(product.orderListId);
  };

  const handleCancelDiscount = (product) => {
    dispatch(cancelDiscount({ orderListId: product.orderListId }));
  };

if (isTraditionalMode) {
  return (
    <div
      className="lpos-scroll"
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#F8FAFC",
      }}
    >

      {products.length === 0 ? (

        <div
          style={{
            flex:1,
            minHeight:220,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"center",
            gap:12,
            color:"#94A3B8"
          }}
        >

          <PackageIcon 
            size={52}
            strokeWidth={1.2}
            opacity={0.4}
          />

          <div
            style={{
              fontSize:15,
              fontWeight:600
            }}
          >
            No products added
          </div>

          <div
            style={{
              fontSize:13
            }}
          >
            Add items to get started
          </div>

        </div>

      ) : (

        <div>

          {/* HEADER */}

          <div
            style={{
              display:"grid",
              gridTemplateColumns:
              "45px 90px minmax(250px,1fr) 110px 160px 110px 90px",

              gap:12,

              padding:"14px 18px",

              background:"#E2E8F0",

              borderBottom:
              "1px solid #CBD5E1",

              position:"sticky",
              top:0,
              zIndex:20,

              fontSize:11,
              fontWeight:700,

              letterSpacing:"0.6px",

              color:"#475569",

              textTransform:"uppercase"
            }}
          >

            <div>#</div>

            <div>SKU</div>

            <div>Item</div>

            <div style={{textAlign:"right"}}>
              Price
            </div>

            <div style={{textAlign:"center"}}>
              Quantity
            </div>

            <div style={{textAlign:"right"}}>
              Total
            </div>

            <div style={{textAlign:"center"}}>
              Action
            </div>

          </div>



          {
          products.map((product,idx)=>{


            const hasDiscount =
              Boolean(product?.discount);


            const lineTotal =
              product.netAmount ||
              (product.unitPrice * product.qty);


            const discountAmount =
              product.discount?.discountAmount || 0;



            return (
              <div key={product.orderListId}>
                {/* MAIN ROW */}

                <div
                  className={`
    grid
    grid-cols-[45px_90px_minmax(250px,1fr)_110px_160px_110px_90px]
    gap-3
    items-center
    px-[18px]
    py-[14px]
    min-h-[72px]
    border-b
    border-slate-200
    transition-colors
    duration-150
    hover:bg-blue-50
    ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
  `}
                >
                  {/* NUMBER */}

                  <div
                    className="
      text-[13px]
      font-semibold
      text-slate-500
    "
                  >
                    {product.originalLineNumber}
                  </div>

                  {/* SKU */}

                  <div
                    title={product.sku}
                    className="
      text-xs
      font-medium
      text-slate-500
      truncate
    "
                  >
                    {product.sku || "-"}
                  </div>

                  {/* ITEM */}

                  <div title={product.description}>
                    <div
                      className="
        text-sm
        font-semibold
        text-slate-900
        truncate
      "
                    >
                      {product.description}
                    </div>

                    {product.batchNo && (
                      <div
                        className="
          inline-flex
          mt-1
          px-2
          py-0.5
          rounded-md
          bg-slate-100
          text-slate-500
          text-[11px]
          font-mono
        "
                      >
                        Batch: {product.batchNo}
                      </div>
                    )}
                  </div>

                  {/* PRICE */}

                  <div
                    className="
      text-right
    font-mono
      text-sm
      text-slate-700
    "
                  >
                    {formatCurrency(product.unitPrice || 0, true)}
                  </div>

                  {/* QTY */}

                  <div
                    className="
      flex
      items-center
      justify-center
      gap-2
    "
                  >
                    <button
                      className="
        lpos-qty-btn

        w-[34px]
        h-[34px]

        rounded-lg

        border
        border-slate-300

        bg-white

        text-slate-700

        text-lg
        font-bold

        flex
        items-center
        justify-center

        transition-all
        duration-150

        hover:bg-slate-100
        hover:border-slate-400

        active:scale-95
      "
                      onClick={() => handleQtyChange(product, product.qty - 1)}
                    >
                      −
                    </button>

                    <span
                      className=" min-w-[35px]
        text-center
        text-sm
        text-slate-900"
                    >
                      {product.qty}
                    </span>

                    <button
                      className="
        lpos-qty-btn

        w-[34px]
        h-[34px]

        rounded-lg

        border
        border-slate-300

        bg-white

        text-slate-700

        text-lg
        font-bold

        flex
        items-center
        justify-center

        transition-all
        duration-150

        hover:bg-slate-100
        hover:border-slate-400

        active:scale-95
      "
                      onClick={() => handleQtyChange(product, product.qty + 1)}
                    >
                      +
                    </button>

                    <span
                      className="
        ml-1
        text-xs
        text-slate-500
      "
                    >
                      {product.measurementUnitName}
                    </span>
                  </div>

                  {/* TOTAL */}

                  <div
                    className={`
      text-right
      text-[15px]
      font-bold
      font-mono
      ${hasDiscount ? "text-green-600" : "text-slate-900"}
    `}
                  >
                    {formatCurrency(lineTotal, true)}
                  </div>

                  {/* ACTION MENU */}

                  <OrderProductActionMenu
                    product={product}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    handleDiscountClick={handleDiscountClick}
                    handleRemove={handleRemove}
                    handleQtyChange={handleQtyChange}
                  />
                </div>

                {/* DISCOUNT DETAIL ROW */}

                {hasDiscount && (
                  <div
                    style={{
                      display: "grid",

                      gridTemplateColumns:
                        "45px 90px minmax(250px,1fr) 110px 160px 110px 90px",

                      gap: 12,

                      alignItems: "center",

                      padding: "8px 18px",

                      background: "#F0FDF4",

                      borderBottom: "1px solid #DCFCE7",

                      fontSize: 12,
                    }}
                  >
                    <div></div>

                    <div></div>

                    <div
                      style={{
                        color: "#15803D",

                        fontWeight: 600,
                      }}
                    >
                      <span>
                        Discount: {product.discount.discountValue}
                        {product.discount.discountTypeId ===
                        DISCOUNT_TYPES.PERCENTAGE
                          ? "%"
                          : ` ${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`}
                      </span>

                      {product.discount.reasonName && (
                        <span
                          style={{
                            marginLeft: 6,
                            color: "#166534",
                          }}
                        >
                          • {product.discount.reasonName}
                        </span>
                      )}
                    </div>

                    <div></div>

                    <div></div>

                    <div
                      style={{
                        textAlign: "right",

                        fontWeight: 700,

                        color: "#16A34A",
                      }}
                    >
                      -{formatCurrency(discountAmount, true)}
                    </div>

                    <div></div>
                  </div>
                )}
              </div>
            );

          })

          }


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

//         return (
//           <div
//             key={product.orderListId}
//             className="lpos-cart-item bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-200 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-5 relative"
//            style={{
//               background: "var(--lpos-bg)",
//               borderRadius: "var(--lpos-radius-md)",
//               padding: "14px 16px",
//               border: "1px solid transparent",
//               transition: "all 0.2s",
//             }}
       
//        >
//             {/* Top Section */}
//             <div className="flex gap-3 sm:gap-4">
//               {/* Product Image */}
//               <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-[52px] lg:h-[52px] rounded-xl bg-white flex-shrink-0 shadow-sm overflow-hidden">
//                 {product.imageUrl ? (
//                   <img
//                     src={`${process.env.REACT_APP_API_CDN}/${product.imageUrl}?width=200&height=200&quality=80`}
//                     alt={product.description}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <PackageIcon size={24} strokeWidth={1.6} className="text-gray-400" />
//                   </div>
//                 )}
//               </div>

//               {/* Product Info */}
//               <div className="flex-1 min-w-0">
//                 <div className="font-semibold text-sm sm:text-base lg:text-sm leading-tight line-clamp-2 mb-2 text-gray-700">
//                   {product.description}
//                 </div>

//                 <div className="flex items-center gap-3 flex-wrap">
//                   {product.sku && (
//                     <div className="text-sm sm:text-xs font-mono text-gray-200 bg-gray-700 px-1.5 py-0.5 rounded">
//                       {product.sku}
//                     </div>

                 
//                   )}
// <div
//   className="
//     inline-flex
//     items-baseline
//     gap-1
//     px-2.5
//     py-1
//     rounded-full
//     bg-emerald-100
//   "
// >
//   <span
//     className="
//       text-[10px]
//       font-medium
//       text-emerald-600
//     "
//   >
//     Rs.
//   </span>

//   <span
//     className="
//       text-xs
//       font-bold
//       text-emerald-700
//       tracking-tight
//     "
//   >
//     {formatCurrency(unitPrice, false)}
//   </span>
// </div>

//                      {product.batchNo ? (
//                       <div className="text-[10px] sm:text-xs font-mono text-gray-200 bg-blue-700 px-1.5 py-0.5 rounded">
//                         Batch: {product.batchNo}
//                       </div>
//                     ):''}

//                 </div>
//               </div>

//               {/* Dropdown Menu Button */}
//     <div className="relative" ref={openMenuId === product.orderListId ? menuRef : null}>

//                 <button
//                   onClick={() => setOpenMenuId(openMenuId === product.orderListId ? null : product.orderListId)}
//                   className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-all"
//                 >
//                   <span className="text-2xl leading-none">⋯</span>
//                 </button>

//                 {/* Dropdown Menu */}
//             {openMenuId === product.orderListId && (
//   <div className="
//       absolute
//       right-0
//       top-10
//       bg-white
//       shadow-xl
//       border
//       border-gray-200
//       rounded-xl
//       py-1
//       z-20
//       w-52
//       text-sm
//   ">
    
//     {/* Change Unit */}
//     <button
//       onClick={() => {
//         handleChangeUnit(product);
//         setOpenMenuId(null);
//       }}
//       className="
//         w-full
//         text-sm
//         text-left
//         px-4
//         py-2.5
//         hover:bg-gray-50
//         flex
//         items-center
//         gap-3
//         text-gray-700
//       "
//     >
//       <ArrowLeftRight 
//         size={18}
//         className="text-blue-600"
//       />
//       Change Unit
//     </button>


//     {/* Discount */}
//     <button
//       onClick={() => {
//         hasDiscount 
//           ? handleCancelDiscount(product) 
//           : handleDiscountClick(product);

//         setOpenMenuId(null);
//       }}
//       className={`
//         w-full
//         text-sm
//         text-left
//         px-4
//         py-2.5
//         hover:bg-gray-50
//         flex
//         items-center
//         gap-3
//         ${hasDiscount 
//           ? "text-red-600" 
//           : "text-gray-700"
//         }
//       `}
//     >
//       <PercentCircle size={18} />
//       {hasDiscount ? "Remove Discount" : "Apply Discount"}
//     </button>


//     {/* Remove */}
//     <button
//       onClick={() => {
//         handleRemove(product);
//         setOpenMenuId(null);
//       }}
//       className="
//         w-full
//         text-sm
//         text-left
//         px-4
//         py-2.5
//         hover:bg-red-50
//         flex
//         items-center
//         gap-3
//         text-red-600
//       "
//     >
//       <Trash2 size={18} />
//       Remove Item
//     </button>

//   </div>
// )}
//               </div>
//             </div>

//             {/* Bottom Bar - Quantity & Total */}
//             <div className="flex items-center justify-between mt-5">
//               {/* Quantity Controls */}
//           <div className="flex items-center gap-2">
//   <button
//     className="w-6 h-6 rounded-md border-none bg-white text-[var(--lpos-text-secondary)] cursor-pointer text-[15px] font-medium flex items-center justify-center transition-all duration-150 shadow-[var(--lpos-shadow-sm)] leading-none hover:bg-[var(--lpos-accent)] hover:text-white"
//     onClick={() => handleQtyChange(product, product.qty - 1)}
//   >
//     −
//   </button>
//   <span className="font-semibold text-sm w-8 text-center">
//     {product.qty}
//   </span>
//   <button
//     className="w-6 h-6 rounded-md border-none bg-white text-[var(--lpos-text-secondary)] cursor-pointer text-[15px] font-medium flex items-center justify-center transition-all duration-150 shadow-[var(--lpos-shadow-sm)] leading-none hover:bg-[var(--lpos-accent)] hover:text-white"
//     onClick={() => handleQtyChange(product, product.qty + 1)}
//   >
//     +
//   </button>

//   {product.measurementUnitName && (
//     <span className="text-xs sm:text-sm text-gray-500 ml-2">
//       {product.measurementUnitName}
//     </span>
//   )}
// </div>

//         <div
//   className={`
//     flex
//     items-baseline
//     gap-1
//     ${hasDiscount ? "text-green-600" : "text-gray-700"}
//   `}
// >
//   <span className="text-xs font-medium text-gray-500">
//     Rs.
//   </span>

//   <span className="text-base font-bold tracking-tight">
//     {formatCurrency(lineTotal, false)}
//   </span>
// </div>
//             </div>




//                        {/* Discount Info Row - Shown only when discount is applied */}
//             {hasDiscount && (
//               <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-green-50/70 rounded-xl px-4 py-2.5">
//                 <div className="text-sm font-medium text-green-700">
//                   Discount: {product.discount.discountValue}
//                   {product.discount.discountTypeId === 1 ? "%" : ` ${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`}
//                   {product.discount.reasonName && ` • ${product.discount.reasonName}`}
//                 </div>
                
//            <button
//                   onClick={() => hasDiscount 
//                     ? handleCancelDiscount(product) 
//                     : handleDiscountClick(product)
//                   }
//                   className={`w-8 h-8 sm:w-9 sm:h-9 bg-white border rounded-xl flex items-center justify-center transition-all active:scale-95 ${
//                     hasDiscount 
//                       ? "border-red-400 text-red-500 hover:bg-red-50" 
//                       : "border-gray-200 hover:border-green-400 hover:text-green-500"
//                   }`}
//                   title={hasDiscount ? "Remove Discount" : "Apply Discount"}
//                 >
//                   <PercentCircle 
//                     size={18} 
//                     strokeWidth={hasDiscount ? 3 : 2.5} 
//                   />
//                 </button>
//               </div>
//             )}


//           </div>
//         );
      
            return (
          <div
            key={product.orderListId}
            className="lpos-cart-item  bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-200 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-5 relative"
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
          
               <div
        className="
          absolute
          left-0
          top-0
          w-16
          h-16
          rounded-tl-2xl
          rounded-br-xl
          bg-white
          shadow-sm
          overflow-hidden
        "
      >
               {product.imageUrl ? (
                  <img
                    src={`${process.env.REACT_APP_API_CDN}/${product.imageUrl}?width=200&height=200&quality=80`}
                    alt={product.description}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PackageIcon
                      size={24}
                      strokeWidth={1.6}
                      className="text-gray-400"
                    />
                  </div>
                )}
              </div>





              {/* Product Info */}
              <div className="flex-1 min-w-0 ml-14">
                <div className="font-semibold text-sm sm:text-base lg:text-sm leading-tight line-clamp-2 mb-2 text-gray-700">
                  {product.description}
                </div>

                <div className="flex items-center gap-3 justify-between">
                  {product.sku && (
                    <div className="text-sm sm:text-xs font-mono text-gray-200 bg-gray-700 px-1.5 py-0.5 rounded">
                      {product.sku}
                    </div>
                  )}
                 
                 
            

                  {product.batchNo ? (
                    <div className="text-[10px] sm:text-xs font-mono text-gray-200 bg-blue-700 px-1.5 py-0.5 rounded">
                      Batch: {product.batchNo}
                    </div>
                  ) : (
                    ""
                  )}

      <div
                    className="
    inline-flex
    items-baseline
    gap-1
    py-1
    rounded-full
  "
                  >
                    {/* <span
                      className="
      text-[10px]
      font-medium
      text-gray-500
    "
                    >
                      Rs.
                    </span> */}

                    <span
                      className=" text-sm font-mono
      font-medium
      text-gray-700
    "
                    >
                      {formatCurrency(unitPrice, false)}
                    </span>
                  </div>


                </div>
              </div>

              {/* Dropdown Menu Button */}
              <div
        className="
          absolute
          right-3
          top-2
        "
        ref={
          openMenuId === product.orderListId
            ? menuRef
            : null
        }
      >


<OrderProductActionMenu
  product={product}
  openMenuId={openMenuId}
  setOpenMenuId={setOpenMenuId}
  handleDiscountClick={handleDiscountClick}
  handleRemove={handleRemove}
  handleChangeUnitClick={handleQtyChange}
/>



        {/* <button
          onClick={() =>
            setOpenMenuId(
              openMenuId === product.orderListId
                ? null
                : product.orderListId
            )
          }
          className="
            w-8
            h-8
            flex
            items-center
            justify-center
            text-gray-500
            hover:text-gray-700
            hover:bg-gray-200
            rounded-xl
            transition-all
          "
        >
          <span className="text-2xl leading-none">
            ⋯
          </span>

        </button> */}


                {/* Dropdown Menu */}
                {/* {openMenuId === product.orderListId && (
                  <div
                    className="
      absolute
      right-0
      top-10
      bg-white
      shadow-xl
      border
      border-gray-200
      rounded-xl
      py-1
      z-20
      w-52
      text-sm
  "
                  >
                  
                    <button
                      onClick={() => {
                        handleChangeUnit(product);
                        setOpenMenuId(null);
                      }}
                      className="
        w-full
        text-sm
        text-left
        px-4
        py-2.5
        hover:bg-gray-50
        flex
        items-center
        gap-3
        text-gray-700
      "
                    >
                      <ArrowLeftRight size={18} className="text-blue-600" />
                      Change Unit
                    </button>

             
                    <button
                      onClick={() => {
                        hasDiscount
                          ? handleCancelDiscount(product)
                          : handleDiscountClick(product);

                        setOpenMenuId(null);
                      }}
                      className={`
        w-full
        text-sm
        text-left
        px-4
        py-2.5
        hover:bg-gray-50
        flex
        items-center
        gap-3
        ${hasDiscount ? "text-red-600" : "text-gray-700"}
      `}
                    >
                      <PercentCircle size={18} />
                      {hasDiscount ? "Remove Discount" : "Apply Discount"}
                    </button>

               
                    <button
                      onClick={() => {
                        handleRemove(product);
                        setOpenMenuId(null);
                      }}
                      className="
        w-full
        text-sm
        text-left
        px-4
        py-2.5
        hover:bg-red-50
        flex
        items-center
        gap-3
        text-red-600
      "
                    >
                      <Trash2 size={18} />
                      Remove Item
                    </button>
                  </div>
                )} */}

                
              </div>
           
           
           
            </div>

            {/* Bottom Bar - Quantity & Total */}
            <div className="flex items-center justify-between mt-5">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  className="w-6 h-6 rounded-md border-none bg-white text-[var(--lpos-text-secondary)] cursor-pointer text-[15px] font-medium flex items-center justify-center transition-all duration-150 shadow-[var(--lpos-shadow-sm)] leading-none hover:bg-[var(--lpos-accent)] hover:text-white"
                  onClick={() => handleQtyChange(product, product.qty - 1)}
                >
                  −
                </button>
                <span className="font-semibold text-sm w-8 text-center">
                  {product.qty}
                </span>
                <button
                  className="w-6 h-6 rounded-md border-none bg-white text-[var(--lpos-text-secondary)] cursor-pointer text-[15px] font-medium flex items-center justify-center transition-all duration-150 shadow-[var(--lpos-shadow-sm)] leading-none hover:bg-[var(--lpos-accent)] hover:text-white"
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

              <div
                className={`
    flex
    items-baseline
    gap-1
    ${hasDiscount ? "text-green-600" : "text-gray-700"}
  `}
              >
                <span className="text-xs font-medium text-gray-500">{getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.</span>

                <span className="text-base font-mono font-semibold">
                  {formatCurrency(lineTotal, false)}
                </span>
              </div>
            </div>

            {/* Discount Info Row - Shown only when discount is applied */}
            {hasDiscount && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between bg-green-50/70 rounded-xl px-4 py-2.5">
                <div className="text-sm font-medium text-green-700">
                  Discount: {product.discount.discountValue}
                  {product.discount.discountTypeId === 1
                    ? "%"
                    : ` ${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}`}
                  {product.discount.reasonName &&
                    ` • ${product.discount.reasonName}`}
                </div>

                <button
                  onClick={() =>
                    hasDiscount
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