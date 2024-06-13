import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrinterConnetion from '../PrinterConnetion';
import ProfileMenu from '../ProfileMenu';
import Syncing from '../Syncing';
import Alert from '../Alert';


export default function TopMenubar() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Navbar Start */}
      <div className="flex justify-between items-center w-full">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <i className="pi pi-calculator text-2xl"></i>
          <h3 className="text-lg font-bold">LBPOS</h3>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Go to Main Menu Button */}
          <button
            className="btn btn-ghost text-primaryColor text-lg"
            onClick={() => navigate('/home')}
          >
            <i className="pi pi-th-large text-xl"></i>
            <span className="ml-2">Go to Main Menu</span>
          </button>

          {/* Other Components */}
          <div className="flex items-center gap-2">
            <PrinterConnetion printerConnected={false} />
            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
