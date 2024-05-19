
import React, { useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import Rightsidebar from '../LeftSidebar';
import { Menu } from 'primereact/menu';
import ProfileMenu from '../ProfileMenu';
import Syncing from '../Syncing';
import Alert from '../Alert';
import ProductSearch from '../ProductSearch';
import { useNavigate } from 'react-router-dom';
import CustomSidebar from '../Sidebar';
import { useSelector } from 'react-redux';
import PrinterConnetion from '../PrinterConnetion';

export default function TopMenubar() {

    //const navbar=useSelector(state=>state.navbar)
    const menuRight = useRef(null);
 
const navigation=useNavigate();

    const items = [
        {
           
        },

   
    ];
  

    const start = <div className='flex gap-5 justify-content-between'>
        <div className='flex align-items-center '>
    <span className='pi pi-calculator' style={{ fontSize: "25px",paddingRight:'5px' }} />
    {/* <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img> */}
<h3>LBPOS</h3>
</div>

</div>

    const end = <div className='flex gap-5 align-items-center justify-content-between'>
 

 
 
  <Button
              className="p-3 text-color-primary"
              aria-label="Main Menu"
              onClick={() => {
                navigation('/home')
                //changeVisibilityHandler(true);
              }}
              text 
              rounded   
            >
              <i
                className="pi pi-th-large px-1"
                style={{ fontSize: "20px" }}
              ></i>
              <span className="px-2">Go to Main Menu</span>
            </Button>

      
<div className='flex gap-2 justify-content-between'>
    <PrinterConnetion printerConnected={false} />
        <Alert />
    <Syncing />
<ProfileMenu />
</div>
    </div>

    return (
        <div className="nav-bar">
            <Menubar className='border-0 nav-bar' model={items}  start={start}  end={end} />
            {/* <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" /> */}
       
      
        </div>
    )
}
        
        