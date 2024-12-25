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
      <button className={`flex items-center flex-col gap-1 rounded-lg w-[7rem] hover:bg-slate-200 py-3 shadow-sm ${bgColor? bgColor:'bg-slate-50'}`} onClick={onClick}>    
         <FontAwesomeIcon icon={icon} className={`text-lg ${iconColor ? iconColor: "text-gray-700"}`} />
       <span className={` ${textColor ? textColor: "text-gray-700 text-md"}`}>{label}</span> 
      </button>
    );
  };


  return (
    <div className=''>
          <div className="flex flex-col gap-2">
  
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
                {/* <LeftSidebarMenu
            label="Main Menu"
            icon={faThLarge}
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
