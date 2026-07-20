import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  FaBook, FaPause, FaUndo, FaTags, FaCoins, FaFileAlt, FaCalendarPlus, FaThLarge } from 'react-icons/fa';
import HoldOrder from './register/HoldOrder';
import ConfirmDialogCustom from './register/ConfirmDialogCustom';
import ApplyDiscount from './register/ApplyDiscount';
import { DISCOUNT_SCOPE } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  BookOpen,
  Pause,
  Undo2,
  Tag,
  Coins,
  FileText,
  CalendarPlus,
  LayoutGrid,
  HomeIcon,
  CalendarCheck,
} from "lucide-react";

const Rightsidebar = ({
  visible,
  onChangeVisibility,
  setIsReturnOrderPopupVisible,
  setIsSalesHistoryPopupVisible,
  setIsDayEndPopupVisible
}) => {
  const dispatch = useDispatch();
  const { voidOrderVisible } = useSelector((state) => state.popup);
  const navigate = useNavigate();

  const [holdOrderShow, setHoldOrderShow] = useState(false);
  const [isOrderVoidConfirmShow, setIsOrderVoidConfirmShow] = useState(false);
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);

const LeftSidebarMenu = ({
  onClick,
  label,
  icon: Icon,
  iconColor,
  bgColor,
  textColor,
}) => {
  return (
    <button
      className={`flex items-center flex-col gap-1 hover:bg-sky-700 py-3 shadow-sm transition-transform duration-150 active:scale-95 ${bgColor || ""}`}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 ${iconColor || "text-white"}`} />
      <span className={textColor || "text-white text-md"}>{label}</span>
    </button>
  );
};


  return (
    <div className='rounded-lg p-2'>
      <div className="flex flex-col gap-2 bg-sky-600 w-[6rem] shadow-lg">
        <LeftSidebarMenu
          label="Home"
          icon={HomeIcon}
          onClick={() => {
            navigate("/home");
          }}
        />
        <LeftSidebarMenu
          label="Sales History"
          icon={BookOpen}
          onClick={() => {
            setIsSalesHistoryPopupVisible(true);
          }}
        />
        {/* <LeftSidebarMenu
          label="Hold Order"
          icon={FaPause}
          onClick={() => {
            setHoldOrderShow(true);
          }}
        /> */}
        {/* <LeftSidebarMenu
          label="Return Order"
          icon={FaUndo}
          onClick={() => {
            setIsReturnOrderPopupVisible(true);
          }}
        /> */}
        {/* <LeftSidebarMenu
          label="Discount"
          icon={FaTags}
          onClick={() => {
            setIsDiscountPopupVisible(true);
          }}
        /> */}
        {/* <LeftSidebarMenu
          label="Manage Cash"
          icon={FaCoins}
          onClick={() => {
            // Add logic for Manage Cash if needed
          }}
        /> */}
        {/* <LeftSidebarMenu
          label="Quotation"
          icon={FaFileAlt}
          onClick={() => {
            // Add logic for Quotation if needed
          }}
        /> */}
        <LeftSidebarMenu
          label="Dayend"
          icon={CalendarCheck}
          onClick={() => {
            setIsDayEndPopupVisible(true);
           // navigate("/dayend");
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