import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faStore, faChevronDown, faCog, faUsers, faTags, faChartBar, faPalette, faChartLine, faCalculator, faUserPlus, faFileAlt, faTable, faList, faPlusCircle, faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/format";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../../state/store/storeSlice";
import Sidebar from "../../components/navBar/SideBar";




const PopupMenu = ({ label, iconName, submenuItems, isDisabled = false }) => {
  return (
    <div className="dropdown">
      {/* Main Button */}
      <button
        tabIndex={0}
        className={`flex items-center gap-2 py-4 px-4 bg-white shadow-sm border rounded-lg 
          hover:border-gray-300 hover:bg-slate-100 hover:shadow-lg transition duration-300 
          ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <i className={`${iconName} text-xl`} />
        <span className="text-lg font-semibold">{label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="ml-auto text-gray-500"
        />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content mt-2 p-2 shadow bg-white rounded-md w-52 border"
      >
        {submenuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-md"
            >
              <i className={`${item.icon} text-lg`} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};



const UserInfo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const userinfo=JSON.parse(localStorage.getItem('user'));

  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate =formatDate(currentTime,true);

  return (
    <div className="flex flex-col items-right justify-center p-6 w-full">
      <div className="text-2xl font-semibold text-gray-700 mb-4 ml-3">
        Hi, {userinfo.displayName}!
      </div>
      <div className="text-5xl text-gray-600 mb-2">
       {formattedTime}
      </div>
      <div className="text-xl text-gray-500 mb-2 ml-2">Date: {formattedDate}</div>
      <div className="text-lg text-gray-400 ml-2">Timezone: {timezone}</div>
    </div>
  );
};
const HomeMenuButton = ({
  to,
  label,
  iconName,
  submenuItems,
  isDisabled = false,
}) => {
  return (
    <Link
      className={`flex flex-col min-w-[150px] items-center h-auto
      rounded-lg cursor-pointer py-4 px-3 bg-white shadow-sm border
      hover:border-gray-300 hover:bg-slate-100
      hover:shadow-lg transition duration-300 
       ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
      to={to}
    >
      <div className="flex items-center gap-3 mb-2">
        {/* <img
            src={``}
            //alt={p.productName}
            className="w-[80px] h-[80px] rounded-lg object-cover"
          /> */}

        <i className={`${iconName} text-3xl text-gray-700`} />
      </div>
      <div className="text-lg  font-semibold text-gray-800 truncate group-hover:overflow-visible group-hover:text-ellipsis group-hover:whitespace-normal">
        {label}
      </div>
    </Link>
  );
};
// const SidebarMenu = ({ label, iconName, submenuItems, isDisabled = false }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <div className="sidebar-menu w-full">
//      <button
//         className={`flex w-full items-center gap-2 py-3 px-4 text-lg text-gray-800 hover:bg-gray-200 rounded-md ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//         onClick={submenuItems && submenuItems.length > 0 ? toggleMenu : undefined} // Only toggle if there are submenus
//       >
//         <FontAwesomeIcon icon={iconName} className="text-xl" />
//         <span className="font-semibold">{label}</span>
//         {submenuItems && submenuItems.length > 0 && (
//           <FontAwesomeIcon icon={faChevronDown} className={`ml-auto ${isOpen ? "rotate-180" : ""}`} />
//         )}
//       </button>

//       {/* Nested Submenu */}
//       {isOpen && submenuItems && submenuItems.length > 0 && (
//         <ul className="submenu-list pl-6 mt-2 space-y-2">
//           {submenuItems.map((item, index) => (
//             <li key={index}>
//               {item.submenuItems ? (
//                 // Nested Submenu (recursive)
//                 <SidebarMenu
//                   label={item.label}
//                   iconName={item.icon}
//                   submenuItems={item.submenuItems}
//                   isDisabled={item.isDisabled}
//                 />
//               ) : (
//                 <Link
//                   to={item.to}
//                   className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md"
//                 >
//                   <FontAwesomeIcon icon={item.icon} className="text-lg" />
//                   {item.label}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };


// const SidebarMenu = ({ label, iconName, submenuItems, isDisabled = false }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <div className="sidebar-menu w-full">
//       <button
//         className={`flex w-full items-center gap-2 py-3 px-4 text-lg text-gray-800 hover:bg-gray-200 rounded-md ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//         onClick={toggleMenu}
//       >
//         <FontAwesomeIcon icon={iconName} className="text-xl" />
//         <span className="font-semibold">{label}</span>
//         <FontAwesomeIcon icon={faChevronDown} className={`ml-auto ${isOpen ? "rotate-180" : ""}`} />
//       </button>
//       {isOpen && (
//         <ul className="submenu-list pl-6 mt-2 space-y-2">
//           {submenuItems.map((item, index) => (
//             <li key={index}>
//               <Link to={item.to} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md">
//                 <FontAwesomeIcon icon={item.icon} className="text-lg" />
//                 {item.label}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// const Sidebar = () => {
//   return (
//     <div className="sidebar bg-white w-64 p-4 shadow-sm fixed top-0 left-0 h-full">
//       <div className="mb-8 flex items-center justify-center">
//         <FontAwesomeIcon icon={faHome} className="text-4xl text-primaryColor" />
//       </div>

//       <div className="space-y-4">
//       <SidebarMenu
//           label="Dashboards"
//           iconName={faPalette}
//           submenuItems={[
//             { label: "Overall", to: "/dashboard", icon: faPalette },
//           ]}
//         />

//         <SidebarMenu
//           label="Registers"
//           iconName={faCalculator}
//           submenuItems={[
//             { label: "Terminal 1", to: "/register/1", icon: faCalculator },
//             { label: "Terminal 2", to: "/register/2", icon: faCalculator },
//           ]}
//         />
//         <SidebarMenu
//           label="Contacts"
//           iconName={faUsers}
//           submenuItems={[
//             { label: "Contacts", to: "/customers/list", icon: faUsers },
//             { label: "Add Contact", to: "/customers/add", icon: faUserPlus },
//           ]}
//         />
//         <SidebarMenu
//           label="Products"
//           iconName={faTags}
//           submenuItems={[
//             { label: "Add Product", to: "/products/add", icon: faTags },
//           ]}
//         />
//         <SidebarMenu
//           label="Inventory"
//           iconName={faChartBar}
//           submenuItems={[
//             { label: "Product Inventory", to: "/inventory/list", icon: faChartBar },
//             { label: "Stock Entry", to: "/inventory/stockentry/add", icon: faChartBar },
//             { label: "View Stock Entries", to: "/inventory/stockentry/list", icon: faChartBar },
//           ]}
//         />
        
//         <SidebarMenu
//           label="Settings"
//           iconName={faCog}
//           submenuItems={[
//             { label: "General Settings", to: "/settings/general", icon: faCog },
//             { label: "Permissions", to: "/settings/permissions", icon: faCog },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };




const Home = () => {

  const dispatch = useDispatch();
  const [assignedTerminals, setAssignedTerminals] = useState([
    { terminalId: 1, terminalName: "Testing Terminal 1" },
  ]);

  const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
  const store = JSON.parse(localStorage.getItem("stores"))[0];
  const [assignedStores, setAssignedStores] = useState([store]);
  const [selectedStoreId, setSelectedStoreId] = useState(
    assignedStores[0].storeId
  );
  const [isSelectedStoreApplied, setIsSelectedStoreApplied] = useState(false);

  const handleStoreSelect = (e) => {
    setSelectedStoreId(e.target.value);
  };

  const storeSelectHandler = () => {
    setIsSelectedStoreApplied(selectedStoreId ? true : false);
    const store = assignedStores.find(
      (s) => s.storeId === parseInt(selectedStoreId)
    );
    if (store) {
      dispatch(setSelectedStore({ selectedStore: store }));
      localStorage.setItem("selectedStore", JSON.stringify(store));
    } else {
      console.error(
        "No matching store found for the selectedStoreId:",
        selectedStoreId
      );
    }
  };


  const Stores = () => (
    <div className="flex flex-col gap-10 items-center justify-center mt-28">
      <div className="flex justify-start gap-1 items-center mb-6">
        <FontAwesomeIcon icon={faStore} style={{ fontSize: "2rem" }} />
        <h2 className="text-2xl font-bold pt-1">Select your store</h2>
      </div>
      <div className="flex flex-col justify-between gap-5 w-full max-w-xs">
        <select
          value={selectedStoreId}
          onChange={handleStoreSelect}
          className="select select-bordered w-full max-w-xs"
        >
          {assignedStores.map((c) => (
            <option key={c.storeId} value={c.storeId}>
              {c.storeCode} | {c.storeName}
            </option>
          ))}
        </select>
        <button
          onClick={storeSelectHandler}
          type="button"
          className="btn shadow-none py-4 px-10 rounded-lg border-none bg-primaryColor text-base-100 mt-4"
        >
          Continue
        </button>
      </div>
    </div>
  );
  

  return (
    <>
        {!selectedStore ? (
      <Stores />
    ) :
    
  
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-10">
    
        <div className="flex gap-4 justify-center w-full">
        <UserInfo />
    
        </div>
      
        <div className="w-full my-24">
            {/* <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Registers
            </h3> */}
            <div className="flex gap-4">
              
              {/* Example for home buttons */}
              <HomeMenuButton
                label="Terminal 1"
                iconName="pi pi-calculator"
                to="/register/1"
              />
              <HomeMenuButton
                label="Terminal 2"
                iconName="pi pi-calculator"
                to="/register/2"
              />
            </div>
            </div>

      </div>
    </div>}
      </>
  );
};

export default Home;
