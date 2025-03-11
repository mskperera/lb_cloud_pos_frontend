import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthInfo, logout } from "../functions/auth";
import profilePic from "../assets/images/profilePic.png";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../state/store/storeSlice";

const userinfo=JSON.parse(localStorage.getItem('user'));


export default function ProfileMenu() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

const dispatch=useDispatch();

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
    dispatch(setSelectedStore({ selectedStore:null }));
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative inline-block text-left mt-2">
      <button
  className="btn btn-circle h-10 w-10 btn-sm btn-primary avatar m-0 p-0"
  onClick={toggleMenu}
  aria-controls="profileMenu"
  aria-haspopup="true"
>
  <img
    className="w-10 h-10 rounded-full"
    src={profilePic}
    alt="Profile"
  />
</button>


      {menuOpen && (
        <div
          className="absolute right-0 w-56 bg-base-100 rounded-lg shadow-lg border border-base-300 z-10"
          id="profileMenu"
        >
          {/* {JSON.stringify(userinfo)} */}
          <div className="p-2">
            <button className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center">
              {/* <img
                className="w-10 h-10 rounded-full mr-2"
                src={profilePic}
                alt="Profile"
              /> */}
              <div>
                <div className="font-bold">{userinfo.displayName}</div>
                {/* <div className="text-sm text-base-content">Admin</div> */}
              </div>
            </button>

            <div className="divider my-1"></div>
            <button
              className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center"
              onClick={() => navigate('/settings')}
            >
              <i className="pi pi-cog mr-2"></i>Settings
            </button>
            <button
              className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center"
              onClick={() => navigate('/profile')}
            >
              <i className="pi pi-user mr-2"></i>Profile
            </button>

            <div className="divider my-1"></div>

            <button
              className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center text-red-600"
              onClick={handleLogout}
            >
              <i className="pi pi-power-off mr-2"></i>Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
