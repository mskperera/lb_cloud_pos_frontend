import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthInfo, logout } from "../functions/auth";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../state/store/storeSlice";
import { FaUserCircle, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";

const userinfo = JSON.parse(localStorage.getItem('user'));

export default function ProfileMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    console.log("Logout clicked");
    logout();
    dispatch(setSelectedStore({ selectedStore: null }));
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        onClick={toggleMenu}
        aria-controls="profileMenu"
        aria-haspopup="true"
      >
        <FaUserCircle className="text-2xl" />
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-slide-in"
          id="profileMenu"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <FaUserCircle className="text-3xl text-gray-600" />
              <div>
                <div className="font-semibold text-gray-800">{userinfo.displayName}</div>
              </div>
            </div>
            <hr className="my-2 border-gray-200" />
            <button
              className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-gray-700"
              onClick={() => navigate('/settings')}
            >
              <FaCog className="text-lg" />
              <span>Settings</span>
            </button>
            <button
              className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-gray-700"
              onClick={() => navigate('/profile')}
            >
              <FaUser className="text-lg" />
              <span>Profile</span>
            </button>
            <hr className="my-2 border-gray-200" />
            <button
              className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-red-50 transition-colors duration-200 text-red-600"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuthInfo, logout } from "../functions/auth";
// import profilePic from "../assets/images/profilePic.png";
// import { useDispatch } from "react-redux";
// import { setSelectedStore } from "../state/store/storeSlice";
// import { FaUserCircle } from "react-icons/fa";

// const userinfo=JSON.parse(localStorage.getItem('user'));


// export default function ProfileMenu() {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

// const dispatch=useDispatch();

//   const handleLogout = () => {
//     console.log("Logout clicked");
//     logout();
//     dispatch(setSelectedStore({ selectedStore:null }));
//     navigate('/');
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <div className="relative inline-block text-left mt-2">
//       <button
//   className="btn btn-circle h-10 w-10 btn-sm btn-primary avatar m-0 p-0 text-white"
//   onClick={toggleMenu}
//   aria-controls="profileMenu"
//   aria-haspopup="true"
// >
//   <FaUserCircle className="text-3xl" />
//   {/* <img
//     className="w-10 h-10 rounded-full"
//     src={profilePic}
//     alt="Profile"
//   /> */}
// </button>


//       {menuOpen && (
//         <div
//           className="absolute right-0 w-56 bg-base-100 rounded-lg shadow-lg border border-base-300 z-10"
//           id="profileMenu"
//         >
//           {/* {JSON.stringify(userinfo)} */}
//           <div className="p-2">
//             <button className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center">
//               {/* <img
//                 className="w-10 h-10 rounded-full mr-2"
//                 src={profilePic}
//                 alt="Profile"
//               /> */}
//               <div>
//                 <div className="font-bold">{userinfo.displayName}</div>
//                 {/* <div className="text-sm text-base-content">Admin</div> */}
//               </div>
//             </button>

//             <div className="divider my-1"></div>
//             <button
//               className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center"
//               onClick={() => navigate('/settings')}
//             >
//               <i className="pi pi-cog mr-2"></i>Settings
//             </button>
//             <button
//               className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center"
//               onClick={() => navigate('/profile')}
//             >
//               <i className="pi pi-user mr-2"></i>Profile
//             </button>

//             <div className="divider my-1"></div>

//             <button
//               className="w-full text-left p-2 rounded-md hover:bg-base-200 flex items-center text-red-600"
//               onClick={handleLogout}
//             >
//               <i className="pi pi-power-off mr-2"></i>Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
