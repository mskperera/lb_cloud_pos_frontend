import { FaCompress, FaExpand, FaTh, FaHome, FaStore, FaChevronDown, FaCog, FaUsers, FaTags, FaChartBar, FaPalette, FaChartLine, FaCalculator, FaUserPlus, FaFileAlt, FaTable, FaList, FaPlusCircle, FaAsterisk, FaCashRegister, FaInfoCircle } from 'react-icons/fa';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './sidebar.css';

const SidebarMenu = ({ label, iconName: Icon, to, submenuItems, isDisabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClick = () => {
    if (submenuItems && submenuItems.length > 0) {
      toggleMenu();
    } else {
      navigate(to);
    }
  };

  return (
    <div className="sidebar-menu w-full">
      <button
     className={`flex w-full items-center gap-2 py-3 px-4 text-lg text-white bg-sky-600 
    hover:bg-sky-700 rounded-md transition-transform duration-150 
    active:scale-95 active:bg-sky-800 ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={handleClick}
      >
        <Icon className="text-xl" />
        <span className="font-semibold">{label}</span>
        {submenuItems && submenuItems.length > 0 && (
          <FaChevronDown className={`ml-auto ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {isOpen && submenuItems && submenuItems.length > 0 && (
        <ul className="submenu-list pl-6 mt-2 space-y-2">
          {submenuItems.map((item, index) => (
            <li key={index}>
              {item.submenuItems ? (
                <SidebarMenu
                  label={item.label}
                  iconName={item.icon}
                  submenuItems={item.submenuItems}
                  isDisabled={item.isDisabled}
                />
              ) : (
                <Link
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 text-white  hover:bg-sky-700 rounded-md transition-transform duration-150 
    active:scale-95 active:bg-sky-800 "
                >
                  <item.icon className="text-lg" />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Sidebar = () => {
  const assignedTerminals = JSON.parse(localStorage.getItem('assignedTerminals'));

  return (
    <div className="sidebar bg-sky-600 w-64 p-4 shadow-sm fixed top-0 left-0 h-screen overflow-y-auto">
      <div className="mb-8 flex items-center justify-center">
        <FaHome className="text-4xl text-white" />
      </div>

      <div className="space-y-4">
        <SidebarMenu
          label="Home"
          iconName={FaHome}
          to="/home"
        />
        <SidebarMenu
          label="Dashboard"
          iconName={FaPalette}
          to="/dashboard"
        />
        <SidebarMenu
          label="Registers"
          iconName={FaCashRegister}
          submenuItems={assignedTerminals?.map((t) => ({
            label: t.displayName,
            to: `/register/${t.id}`,
            icon: FaCashRegister,
          }))}
        />
        <SidebarMenu
          label="Contacts"
          iconName={FaUsers}
          submenuItems={[
            { label: "Contacts", to: "/customers/list", icon: FaUsers },
            { label: "Add Contact", to: "/customers/add", icon: FaUserPlus },
          ]}
        />
        <SidebarMenu
          label="Inventory"
          iconName={FaChartBar}
          submenuItems={[
            { label: "Add Product", to: "/products/add", icon: FaPlusCircle },
            { label: "Product Inventory", to: "/inventory/list", icon: FaChartBar },
            { label: "Categories", to: "/categories", icon: FaList },
            { label: "Measurement Units", to: "/measurementUnits", icon: FaList },
          ]}
        />
        <SidebarMenu
          label="Stock"
          iconName={FaChartBar}
          submenuItems={[
            { label: "Stock Entry", to: "/inventory/stockentry/add", icon: FaPlusCircle },
            { label: "Stock Entries", to: "/inventory/stockentry/list", icon: FaList },
          ]}
        />
        <SidebarMenu
          label="Reports"
          iconName={FaChartLine}
          to="/reports/reportViewer"
        />
        <SidebarMenu
          label="Settings"
          iconName={FaCog}
          submenuItems={[
            { label: "General Settings", to: "/settings/general", icon: FaCog },
            { label: "Permissions", to: "/settings/permissions", icon: FaCog },
          ]}
        />
        <SidebarMenu
          label="About"
          iconName={FaInfoCircle}
          to="/about"
        />
      </div>
    </div>
  );
};

export default Sidebar;

// import { faHome, faStore, faChevronDown, faCog, faUsers, faTags, faChartBar, faPalette, faChartLine, faCalculator, faUserPlus, faFileAlt, faTable, faList, faPlusCircle, faAsterisk, faCashRegister, faHomeAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import './sidebar.css';


//   const SidebarMenu = ({ label, iconName, to, submenuItems, isDisabled = false }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const navigate = useNavigate(); // useNavigate hook to handle navigation
  
//     const toggleMenu = () => setIsOpen(!isOpen);
  
//     const handleClick = () => {
//       if (submenuItems && submenuItems.length > 0) {
//         toggleMenu(); // Toggle submenu visibility
//       } else {
//         navigate(to); // Navigate to the given URL if no submenu
//       }
//     };
  
//     return (
//       <div className="sidebar-menu w-full">
//         <button
//           className={`flex w-full items-center gap-2 py-3 px-4 text-lg text-white hover:bg-sky-600 rounded-md ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//           onClick={handleClick} // Use the handleClick function to handle both submenu toggle and navigation
//         >
//           <FontAwesomeIcon icon={iconName} className="text-xl" />
//           <span className="font-semibold">{label}</span>
//           {submenuItems && submenuItems.length > 0 && (
//             <FontAwesomeIcon icon={faChevronDown} className={`ml-auto ${isOpen ? "rotate-180" : ""}`} />
//           )}
//         </button>
  
//         {/* Nested Submenu */}
//         {isOpen && submenuItems && submenuItems.length > 0 && (
//           <ul className="submenu-list pl-6 mt-2 space-y-2">
//             {submenuItems.map((item, index) => (
//               <li key={index}>
//                 {item.submenuItems ? (
//                   // Nested Submenu (recursive)
//                   <SidebarMenu
//                     label={item.label}
//                     iconName={item.icon}
//                     submenuItems={item.submenuItems}
//                     isDisabled={item.isDisabled}
//                   />
//                 ) : (
//                   <Link
//                     to={item.to}
//                     className="flex items-center gap-2 px-4 py-2 text-white hover:bg-sky-600 rounded-md"
//                   >
//                     <FontAwesomeIcon icon={item.icon} className="text-lg" />
//                     {item.label}
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   };

// const Sidebar = () => {


//   const assignedTerminals=JSON.parse(localStorage.getItem('assignedTerminals'));

//     return (
//       <div className="sidebar bg-sky-600 w-64 p-4 shadow-sm fixed top-0 left-0 h-screen overflow-y-auto">
//       <div className="mb-8 flex items-center justify-center">
//         <FontAwesomeIcon icon={faHome} className="text-4xl text-white" />
//       </div>
  
//         <div className="space-y-4">
//         <SidebarMenu
//             label="Home"
//             iconName={faHomeAlt}
//             to= "/home"
//           />
//           <SidebarMenu
//             label="Dashboard"
//             iconName={faPalette}
//             to= "/dashboard"
//           />
  
//           {/* <SidebarMenu
//             label="Registers"
//             iconName={faCashRegister}
//             submenuItems={[
//               { label: "Terminal 1", to: "/register/1", icon: faCashRegister },
//               { label: "Terminal 2", to: "/register/2", icon: faCashRegister },
      
//             ]}
//           /> */}

// <SidebarMenu
//   label="Registers"
//   iconName={faCashRegister}
//   submenuItems={assignedTerminals?.map((t) => ({
//     label: t.displayName,
//     to: `/register/${t.id}`,
//     icon: faCashRegister,
//   }))}
// />


//           <SidebarMenu
//             label="Contacts"
//             iconName={faUsers}
//             submenuItems={[
//               { label: "Contacts", to: "/customers/list", icon: faUsers },
//               { label: "Add Contact", to: "/customers/add", icon: faUserPlus },
//             ]}
//           />
    
//           <SidebarMenu
//             label="Inventory"
//             iconName={faChartBar}
//             submenuItems={[
//                   { label: "Add Product", to: "/products/add", icon: faPlusCircle },
//               { label: "Product Inventory", to: "/inventory/list", icon: faChartBar },
//                    { label: "Categories", to: "/categories", icon: faList },
//                   { label: "Measurement Units", to: "/measurementUnits", icon: faList },
             
//               // {
//               //   label: "Stock",
//               //   icon: faTable,
//               //   submenuItems: [
//               //     { label: "Stock Entry", to: "/inventory/stockentry/add", icon: faPlusCircle },
//               //     { label: "Stock Entries", to: "/inventory/stockentry/list", icon: faList },
//               //   ],
//               // },
//             ]}
//           />

//           <SidebarMenu
//             label="Stock"
//             iconName={faChartBar}
//             submenuItems={[
//                     { label: "Stock Entry", to: "/inventory/stockentry/add", icon: faPlusCircle },
//                   { label: "Stock Entries", to: "/inventory/stockentry/list", icon: faList },
//             ]}
//           />
  
//   <SidebarMenu
//     label="Reports"
//     iconName={faChartLine}
//     to="/reports/reportViewer"
//   />
  
//           <SidebarMenu
//             label="Settings"
//             iconName={faCog}
//             submenuItems={[
          
//               { label: "General Settings", to: "/settings/general", icon: faCog },
//               { label: "Permissions", to: "/settings/permissions", icon: faCog },
//             ]}
//           />


// <SidebarMenu
//     label="About"
//     iconName={faInfoCircle}
//     to="/about"
//   />
//         </div>
//       </div>
//     );
//   };

//   export default Sidebar;