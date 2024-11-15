import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faPause, faUndo, faTags, faCartPlus, faCalendarPlus, faTimes, faThLarge, faNoteSticky, faFileText, faCoins } from '@fortawesome/free-solid-svg-icons';
import HoldOrder from './register/HoldOrder';
import ConfirmDialogCustom from './register/ConfirmDialogCustom';
import ApplyDiscount from './register/ApplyDiscount';
import { DISCOUNT_SCOPE } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';

const Rightsidebar = ({
  visible,
  onChangeVisibility,
  setIsReturnOrderPopupVisible,
}) => {
  const dispatch = useDispatch();
  const { voidOrderVisible } = useSelector((state) => state.popup);
  const navigate = useNavigate();

  const [holdOrderShow, setHoldOrderShow] = useState(false);
  const [isOrderVoidConfirmShow, setIsOrderVoidConfirmShow] = useState(false);
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);

  const LeftSidebarMenu = ({ onClick, label, icon,iconColor,bgColor,textColor }) => {
    return (
      <div className={`btn mb-2 flex flex-col px-2 py-9 w-[7rem] min-h-15 ${bgColor? bgColor:'bg-transparent'}`} onClick={onClick}>
      <div className='flex flex-col gap-2'>     
         <FontAwesomeIcon icon={icon} className={`text-lg ${iconColor ? iconColor: "text-gray-700"}`} />
  
       <div className={` ${textColor ? textColor: "text-gray-700"}`}>{label}</div> 
       </div>
      </div>
    );
  };


  return (
    <div className=''>
      {/* <div className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transform ${visible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}> */}
        {/* <div className="flex flex-col p-4 relative"> */}
          {/* Close Button */}
          {/* <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => onChangeVisibility(false)}
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button> */}
          <div className="flex flex-col ">
          {/* <LeftSidebarMenu
            label="Go to Main Menu"
            icon={faHome}
            onClick={() => {
              onChangeVisibility(false);
              navigate("/");
            }}
          /> */}
          <LeftSidebarMenu
            label="Orders"
            icon={faBook}
            onClick={() => {
             // onChangeVisibility(false);
              navigate("/OrdersCompleted");
            }}
          />
          <LeftSidebarMenu
            label="Hold Order"
            icon={faPause}
            onClick={() => {
             // onChangeVisibility(false);
              setHoldOrderShow(true);
            }}
          />
          <LeftSidebarMenu
            label="Return Order"
            icon={faUndo}
            onClick={() => {
            //  onChangeVisibility(false);
              setIsReturnOrderPopupVisible(true);
            }}
          />
          <LeftSidebarMenu
            label="Discount"
            icon={faTags}
            onClick={() => {
             // onChangeVisibility(false);
              setIsDiscountPopupVisible(true);
            }}
          />
          <LeftSidebarMenu
            label="Manage Cash"
            icon={faCoins}
            onClick={() => {
             // onChangeVisibility(false);
              // Add logic for Pay if needed
            }}
          />
              <LeftSidebarMenu
            label="Quotation"
            icon={faFileText}
            onClick={() => {
            //  onChangeVisibility(false);
              // Add logic for Pay if needed
            }}
          />
          <LeftSidebarMenu
            label="Dayend"
            icon={faCalendarPlus}
            onClick={() => {
             // onChangeVisibility(false);
              navigate("/dayend");
            }}
          />
                <LeftSidebarMenu
            label="Main Menu"
            icon={faThLarge}
            bgColor={"bg-primaryColor"}
            textColor={'text-white'}
            iconColor={'text-white'}
            onClick={() => {
              navigate("/home");
            }}
          />
          </div>
        {/* </div> */}
      {/* </div> */}

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
