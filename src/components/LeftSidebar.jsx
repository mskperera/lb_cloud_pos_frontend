import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from "primereact/sidebar"
import { Button } from 'primereact/button';
import HoldOrder from './register/HoldOrder';
import OrderVoidRemark from './register/OrderVoidRemark';
import ConfirmDialogCustom from './register/ConfirmDialogCustom';
import { Link, useNavigate } from 'react-router-dom';
import ApplyDiscount from './register/ApplyDiscount';
import { DISCOUNT_SCOPE } from '../utils/constants';
import {useDispatch,useSelector} from 'react-redux';
import { setVoidOrderVisible } from '../state/popup/popupSlice';

const Rightsidebar=({visible,onChangeVisibility,setIsReturnOrderPopupVisible})=>{

  const dispatch=useDispatch();
  const {voidOrderVisible}=useSelector(state=>state.popup);
    const navigate=useNavigate();

const [holdOrderShow,setHoldOrderShow]=useState(false)

const [isOrderVoidConfirmShow,setIsOrderVoidConfirmShow]=useState(false);

const LeftSidebarMenu = ({onClick, label, iconName }) => {

  
    const linkStyle = {
        color: 'black',
        textDecoration: 'none',
        transition: 'background-color 0.3s ease',
        width: '100%',
        display: 'block',
        backgroundColor: 'transparent',
      };



  
    return (
        <div onClick={onClick} style={linkStyle} >
      <div
        className="card p-4 cursor-pointer sidebar-button-link-style w-full"
      >
        <div className="flex justify-content-start">
          <div className="flex flex-row align-items-center justify-content-start gap-2">
            <i className={`${iconName} text-xl`}></i>
            <p className="m-0 text-normal" style={{ textAlign: 'center', width: '100%' }}>
              {label}
            </p>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);


    const footer = (
        <>
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
        </>
    )
    return <>
      <Sidebar visible={visible} position="left"   onHide={() => onChangeVisibility(false)}>
  

  <LeftSidebarMenu label="Go to Main Menu" iconName="pi pi-th-large"  onClick={()=>{
 navigate('/')
}} />
<LeftSidebarMenu label="Completed Orders" iconName="pi pi-book" onClick={()=>{
 navigate('/OrdersCompleted')
}}  />
<LeftSidebarMenu label="Hold Order" iconName="pi pi-pause" onClick={()=>{onChangeVisibility(false); setHoldOrderShow(true);}} />
<LeftSidebarMenu label="Return Order" iconName="pi pi-fast-backward" onClick={()=>{
  onChangeVisibility(false); 
  setIsReturnOrderPopupVisible(true);
}} />
{/* <LeftSidebarMenu label="Void Order" iconName="pi pi-stop-circle" onClick={()=>{
    onChangeVisibility(false); 

}} /> */}

<LeftSidebarMenu label="Discount" iconName="pi pi-user" onClick={() => {
   onChangeVisibility(false); 
  setIsDiscountPopupVisible(true);
  }} />
<LeftSidebarMenu label="Pay" iconName="pi pi-cart-plus" />
<LeftSidebarMenu label="Dayend" iconName="pi pi-calendar-plus"
 onClick={()=>{
 navigate('/dayend')
}} />

</Sidebar>

<HoldOrder visible={holdOrderShow} onClose={()=>{
    setHoldOrderShow(false);
}} />

<ConfirmDialogCustom visible={isOrderVoidConfirmShow} onClose={()=>{setIsOrderVoidConfirmShow(false)}} 
onAccept={()=>{setIsOrderVoidConfirmShow(false)}} onReject={()=>{setIsOrderVoidConfirmShow(false)}} />
     <ApplyDiscount
                orderListId={null}
                visible={isDiscountPopupVisible}
                onHide={() => setIsDiscountPopupVisible(false)}
                discountScope = {DISCOUNT_SCOPE.ORDER_LEVEL}
            />
    </>
}

export default Rightsidebar;