
import React, { useRef, useState } from 'react';

import ProfileMenu from '../ProfileMenu';
import Syncing from '../Syncing';
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';
import PrinterConnetion from '../PrinterConnetion';

export default function Navbar() {

    //const navbar=useSelector(state=>state.navbar)
    const menuRight = useRef(null);
 
const navigation=useNavigate();

    const start = <div className='flex gap-5 justify-content-between'>
        <div className='flex align-items-center '>
    <span className='pi pi-calculator' style={{ fontSize: "25px",paddingRight:'5px' }} />
    {/* <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img> */}
<h3>LBPOS</h3>
</div>

</div>

    const end = <div className='flex gap-5 align-items-center justify-content-between'>
 

 
 
  <button
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
            </button>

      
<div className='flex gap-2 justify-content-between'>
    <PrinterConnetion printerConnected={false} />
        <Alert />
    <Syncing />
<ProfileMenu />
</div>
    </div>

    return (
        <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="badge badge-sm indicator-item">8</span>
              </div>
            </div>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">8 Items</span>
                <span className="text-info">Subtotal: $999</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">View cart</button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
}
        
        