import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaPause, FaUndo, FaTags, FaCoins, FaFileAlt, FaCalendarPlus, FaThLarge } from 'react-icons/fa';
import HoldOrder from './register/HoldOrder';
import ConfirmDialogCustom from './register/ConfirmDialogCustom';
import ApplyDiscount from './register/ApplyDiscount';
import { DISCOUNT_SCOPE } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';

const Rightsidebar = ({
  visible,
  onChangeVisibility,
  setIsReturnOrderPopupVisible,
  setIsSalesHistoryPopupVisible
}) => {
  const dispatch = useDispatch();
  const { voidOrderVisible } = useSelector((state) => state.popup);
  const navigate = useNavigate();

  const [holdOrderShow, setHoldOrderShow] = useState(false);
  const [isOrderVoidConfirmShow, setIsOrderVoidConfirmShow] = useState(false);
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);

  const LeftSidebarMenu = ({ onClick, label, icon: Icon, iconColor, bgColor, textColor }) => {
    return (
      <button
        className={`flex items-center flex-col gap-1 hover:bg-sky-700 py-3 shadow-sm transition-transform duration-150 active:scale-95 ${bgColor || ''}`}
        onClick={onClick}
      >
        <Icon className={`text-lg ${iconColor ? iconColor : "text-white"}`} />
        <span className={`${textColor ? textColor : "text-white text-md"}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className='rounded-lg p-2'>
      <div className="flex flex-col gap-2 bg-sky-600 w-[6rem] shadow-lg">
        <LeftSidebarMenu
          label="Home"
          icon={FaHome}
          onClick={() => {
            navigate("/home");
          }}
        />
        <LeftSidebarMenu
          label="Sales History"
          icon={FaBook}
          onClick={() => {
            setIsSalesHistoryPopupVisible(true);
          }}
        />
        <LeftSidebarMenu
          label="Hold Order"
          icon={FaPause}
          onClick={() => {
            setHoldOrderShow(true);
          }}
        />
        <LeftSidebarMenu
          label="Return Order"
          icon={FaUndo}
          onClick={() => {
            setIsReturnOrderPopupVisible(true);
          }}
        />
        {/* <LeftSidebarMenu
          label="Discount"
          icon={FaTags}
          onClick={() => {
            setIsDiscountPopupVisible(true);
          }}
        /> */}
        <LeftSidebarMenu
          label="Manage Cash"
          icon={FaCoins}
          onClick={() => {
            // Add logic for Manage Cash if needed
          }}
        />
        <LeftSidebarMenu
          label="Quotation"
          icon={FaFileAlt}
          onClick={() => {
            // Add logic for Quotation if needed
          }}
        />
        <LeftSidebarMenu
          label="Dayend"
          icon={FaCalendarPlus}
          onClick={() => {
            navigate("/dayend");
          }}
        />
        {/* <LeftSidebarMenu
          label="Main Menu"
          icon={FaThLarge}
          bgColor={"bg-primaryColor"}
          textColor={'text-white'}
          iconColor={'text-white'}
          onClick={() => {
            navigate("/home");
          }}
        /> */}
      </div>

      <HoldOrder
        visible={holdOrderShow}
        onClose={() => {
          setHoldOrderShow(false);
        }}
      />

      <ConfirmDialogCustom
        visible={isOrderVoidConfirmShow}
        onClose={() => {
          setIsOrderVoidConfirmShow(false);
        }}
        onAccept={() => {
          setIsOrderVoidConfirmShow(false);
        }}
        onReject={() => {
          setIsOrderVoidConfirmShow(false);
        }}
      />

      <ApplyDiscount
        orderListId={null}
        visible={isDiscountPopupVisible}
        onHide={() => setIsDiscountPopupVisible(false)}
        discountScope={DISCOUNT_SCOPE.ORDER_LEVEL}
      />
    </div>
  );
};

export default Rightsidebar;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHome, faBook, faPause, faUndo, faTags, faCartPlus, faCalendarPlus, faTimes, faThLarge, faNoteSticky, faFileText, faCoins, faHomeAlt } from '@fortawesome/free-solid-svg-icons';
// import HoldOrder from './register/HoldOrder';
// import ConfirmDialogCustom from './register/ConfirmDialogCustom';
// import ApplyDiscount from './register/ApplyDiscount';
// import { DISCOUNT_SCOPE } from '../utils/constants';
// import { useDispatch, useSelector } from 'react-redux';

// const Rightsidebar = ({
//   visible,
//   onChangeVisibility,
//   setIsReturnOrderPopupVisible,
//   setIsSalesHistoryPopupVisible
// }) => {
//   const dispatch = useDispatch();
//   const { voidOrderVisible } = useSelector((state) => state.popup);
//   const navigate = useNavigate();

//   const [holdOrderShow, setHoldOrderShow] = useState(false);
//   const [isOrderVoidConfirmShow, setIsOrderVoidConfirmShow] = useState(false);
//   const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);

//   const LeftSidebarMenu = ({ onClick, label, icon,iconColor,bgColor,textColor }) => {
//     return (
//       <button className={`flex items-center flex-col gap-1  hover:bg-sky-700 py-3 shadow-sm  transition-transform duration-150 
//     active:scale-95 `} onClick={onClick}>    
//          <FontAwesomeIcon icon={icon} className={`text-lg ${iconColor ? iconColor: "text-white"}`} />
//        <span className={` ${textColor ? textColor: "text-white text-md"}`}>{label}</span> 
//       </button>
//     );
//   };


//   return (
//     <div className='rounded-lg p-2'>
//           <div className="flex flex-col gap-2 bg-sky-600 w-[6rem] shadow-lg">
//           <LeftSidebarMenu
//             label="Home"
//             icon={faHomeAlt}
//             onClick={() => {
//               navigate("/home");
//             }}
//           />
//           <LeftSidebarMenu
//             label="Sales History"
//             icon={faBook}
//             onClick={() => {
//              // onChangeVisibility(false);
//              setIsSalesHistoryPopupVisible(true)
//              // navigate("/OrdersCompleted");
//             }}
//           />
//           <LeftSidebarMenu
//             label="Hold Order"
//             icon={faPause}
//             onClick={() => {
//              // onChangeVisibility(false);
//               setHoldOrderShow(true);
//             }}
//           />
//           <LeftSidebarMenu
//             label="Return Order"
//             icon={faUndo}
//             onClick={() => {
//             //  onChangeVisibility(false);
//               setIsReturnOrderPopupVisible(true);
//             }}
//           />
//           {/* <LeftSidebarMenu
//             label="Discount"
//             icon={faTags}
//             onClick={() => {
//              // onChangeVisibility(false);
//               setIsDiscountPopupVisible(true);
//             }}
//           /> */}
//           <LeftSidebarMenu
//             label="Manage Cash"
//             icon={faCoins}
//             onClick={() => {
//              // onChangeVisibility(false);
//               // Add logic for Pay if needed
//             }}
//           />
//               <LeftSidebarMenu
//             label="Quotation"
//             icon={faFileText}
//             onClick={() => {
//             //  onChangeVisibility(false);
//               // Add logic for Pay if needed
//             }}
//           />
//           <LeftSidebarMenu
//             label="Dayend"
//             icon={faCalendarPlus}
//             onClick={() => {
//              // onChangeVisibility(false);
//               navigate("/dayend");
//             }}
//           />
//                 {/* <LeftSidebarMenu
//             label="Main Menu"
//             icon={faThLarge}
//             bgColor={"bg-primaryColor"}
//             textColor={'text-white'}
//             iconColor={'text-white'}
//             onClick={() => {
//               navigate("/home");
//             }}
//           /> */}
//           </div>

//       <HoldOrder
//         visible={holdOrderShow}
//         onClose={() => {
//           setHoldOrderShow(false);
//         }}
//       />

//       <ConfirmDialogCustom
//         visible={isOrderVoidConfirmShow}
//         onClose={() => {
//           setIsOrderVoidConfirmShow(false);
//         }}
//         onAccept={() => {
//           setIsOrderVoidConfirmShow(false);
//         }}
//         onReject={() => {
//           setIsOrderVoidConfirmShow(false);
//         }}
//       />

//       <ApplyDiscount
//         orderListId={null}
//         visible={isDiscountPopupVisible}
//         onHide={() => setIsDiscountPopupVisible(false)}
//         discountScope={DISCOUNT_SCOPE.ORDER_LEVEL}
//       />
//     </div>
//   );
// };

// export default Rightsidebar;
