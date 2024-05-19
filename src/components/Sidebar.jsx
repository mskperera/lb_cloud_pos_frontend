import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from "primereact/sidebar"
import { Button } from 'primereact/button';
import HoldOrder from './register/HoldOrder';
import OrderVoidRemark from './register/OrderVoidRemark';
import ConfirmDialogCustom from './register/ConfirmDialogCustom';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { Menu } from 'primereact/menu';

const SidebarMenu = ({ label, iconName, onClick }) => {
  return (
    <div className='custom-link-style' onClick={onClick}>
      <div className="card cursor-pointer">
        <div className="flex flex-column align-items-center p-3 justify-content-center">
          <i className={`${iconName} text-xl mb-2`}></i>
          <p className="m-0 text-normal" style={{ textAlign: 'center' }}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};


  
const CustomSidebar=({})=>{

const navigate=useNavigate();
const [holdOrderShow,setHoldOrderShow]=useState(false)
const [isVoidRemarkShow,setIsVoidRemarkShow]=useState(false);
const [isOrderVoidConfirmShow,setIsOrderVoidConfirmShow]=useState(false);



const menuLeft = useRef(null);
const items = [
  {
    label: 'Dayend',
    icon: 'pi pi-calendar-plus',
    command: () => {
      navigate('/dayend')
    }
},
{
    label: 'Delete',
    icon: 'pi pi-times',
    command: () => {
      //  toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
    }
}

];

    return <>

 <div className=" flex flex-row bg-primary align-items-center justify-content-center gap-5" style={{ 
 }}>

 {/* <div className='flex flex-column align-items-center pb-3'>
  <span  className="pi pi-th-large px-2 text-xl font-bold" />

  </div> */}
  
            <SidebarMenu label="Main Menu" iconName="pi pi-th-large" onClick={()=>{
  navigate('/')
}} />
<SidebarMenu label="Orders" iconName="pi pi-book" />
<SidebarMenu label="Hold" iconName="pi pi-pause" onClick={()=>{setHoldOrderShow(true);}} />
<SidebarMenu label="Return" iconName="pi pi-replay" />
<SidebarMenu label="Void" iconName="pi pi-stop-circle" onClick={()=>{
    setIsVoidRemarkShow(true);
}} />

<SidebarMenu label="Discount" iconName="pi pi-user" />
{/* <SidebarMenu label="Pay" iconName="pi pi-cart-plus" /> */}
{/* <SidebarMenu label="Dayend" iconName="pi pi-calendar-plus" to="/dayend" onClick={()=>{
  navigate('/dayend')
}} /> */}

   {/* <Button iconPos="top" label="More" icon="pi pi-align-left" className="mr-2" onClick={(event) => menuLeft.current.toggle(event)} 
   aria-controls="popup_menu_left" aria-haspopup /> */}

</div>
<HoldOrder visible={holdOrderShow} onClose={()=>{
    setHoldOrderShow(false);
}} />
<OrderVoidRemark visible={isVoidRemarkShow} onClose={()=>{
    setIsVoidRemarkShow(false);
}} />
<ConfirmDialogCustom visible={isOrderVoidConfirmShow} onClose={()=>{setIsOrderVoidConfirmShow(false)}} 
onAccept={()=>{setIsOrderVoidConfirmShow(false)}} onReject={()=>{setIsOrderVoidConfirmShow(false)}} />


<Menu model={items} popup ref={menuLeft} id="popup_menu_left" />


    </>
}

export default CustomSidebar;