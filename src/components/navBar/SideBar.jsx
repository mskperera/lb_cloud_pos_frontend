// src/components/Sidebar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './sidebar.css';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Boxes,
  PlusCircle,
  List,
  BarChart3,
  LineChart,
  Settings,
  Shield,
  Info,
  ChevronDown,
  HomeIcon,
  Monitor,
} from "lucide-react";

const SidebarMenu = ({ label, iconName: Icon, to, submenuItems, isDisabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (submenuItems?.length) {
      setIsOpen(!isOpen);
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <div className="sidebar-menu w-full">
      <button
        className={`flex w-full items-center gap-3 py-3 px-4 text-white bg-[#1f649d]
        hover:bg-sky-700 rounded-md transition-transform duration-150
        active:scale-95 active:bg-sky-800
        ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
        onClick={handleClick}
      >
        <Icon className="w-6 h-6" />
        <span className="font-semibold text-sm">{label}</span>

        {submenuItems?.length > 0 && (
          <ChevronDown
            className={`ml-auto w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && submenuItems?.length > 0 && (
        <ul className="submenu-list pl-6 mt-2 space-y-2">
          {submenuItems.map((item, index) => (
            <li key={index}>
              {item.submenuItems ? (
                <SidebarMenu {...item} />
              ) : (
                <Link
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 text-white
                  hover:bg-sky-700 rounded-md transition-transform duration-150
                  active:scale-95 active:bg-sky-800"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
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
  const assignedTerminals = JSON.parse(localStorage.getItem("assignedTerminals"));
  const navigate = useNavigate();

  return (
    <div className="sidebar bg-[#1d5d90] w-64 p-4 fixed top-0 left-0 h-screen overflow-y-auto flex flex-col">
      {/* Logo / Header */}
      <div className="mb-8 flex items-center justify-center">
        <HomeIcon className="w-10 h-10 text-white" />
      </div>

      {/* Main Menu Items */}
      <div className="space-y-3 flex-grow">
        <SidebarMenu label="Home" iconName={HomeIcon} to="/home" />
        <SidebarMenu label="Dashboard" iconName={LayoutDashboard} to="/dashboard" />

        <SidebarMenu
          label="Registers"
          iconName={Monitor}
          submenuItems={assignedTerminals?.map((t) => ({
            label: t.displayName,
            to: `/register/${t.id}`,
            icon: Monitor,
          }))}
        />

        <SidebarMenu
          label="Contacts"
          iconName={Users}
          submenuItems={[
            { label: "Contacts", to: "/customers/list", icon: Users },
            { label: "Add Contact", to: "/customers/add", icon: UserPlus },
          ]}
        />

        <SidebarMenu
          label="Inventory"
          iconName={Boxes}
          submenuItems={[
            { label: "Add Product", to: "/products/add", icon: PlusCircle },
            { label: "Product Inventory", to: "/inventory/list", icon: Boxes },
            { label: "Categories", to: "/categories", icon: List },
            { label: "Measurement Units", to: "/measurementUnits", icon: List },
          ]}
        />

        <SidebarMenu
          label="Stock"
          iconName={BarChart3}
          submenuItems={[
            { label: "Stock Entry", to: "/inventory/stockentry/add", icon: PlusCircle },
            { label: "Stock Entries", to: "/inventory/stockentry/list", icon: List },
          ]}
        />

        <SidebarMenu
          label="Reports"
          iconName={LineChart}
          to="/reports/report-dashboard"
        />

        <SidebarMenu
          label="Settings"
          iconName={Settings}
          submenuItems={[
            { label: "General Settings", to: "/settings/general", icon: Settings },
            { label: "Permissions", to: "/settings/permissions", icon: Shield },
          ]}
        />

        <SidebarMenu
          label="About"
          iconName={Info}
          to="/about"
        />
      </div>

      {/* Bottom Section: Powered by + Copyright */}
      <div className="mt-auto pt-6 border-t border-sky-700/30 text-center text-sm text-sky-200/90">
        <Link
          to="/"  // ← change to your landing page URL, e.g. "https://legendpos.com" if external
          className="hover:text-white transition-colors font-medium"
        >
          Powered by Legend POS
        </Link>
        <div className="mt-1 opacity-80">
          © {new Date().getFullYear()} Legendbyte. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


//</div> const SidebarMenu = ({ label, iconName: Icon, to, submenuItems, isDisabled = false }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => setIsOpen(!isOpen);

//   const handleClick = () => {
//     if (submenuItems && submenuItems.length > 0) {
//       toggleMenu();
//     } else {
//       navigate(to);
//     }
//   };

//   return (
//     <div className="sidebar-menu w-full">
//       <button
//      className={`flex w-full items-center gap-2 py-3 px-4 text-lg text-white bg-[#1f649d]  
//     hover:bg-sky-700 rounded-md transition-transform duration-150 
//     active:scale-95 active:bg-sky-800 ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//       onClick={handleClick}
//       >
//         <Icon className="text-xl" />
//         <span className="font-semibold">{label}</span>
//         {submenuItems && submenuItems.length > 0 && (
//           <FaChevronDown className={`ml-auto ${isOpen ? "rotate-180" : ""}`} />
//         )}
//       </button>

//       {isOpen && submenuItems && submenuItems.length > 0 && (
//         <ul className="submenu-list pl-6 mt-2 space-y-2">
//           {submenuItems.map((item, index) => (
//             <li key={index}>
//               {item.submenuItems ? (
//                 <SidebarMenu
//                   label={item.label}
//                   iconName={item.icon}
//                   submenuItems={item.submenuItems}
//                   isDisabled={item.isDisabled}
//                 />
//               ) : (
//                 <Link
//                   to={item.to}
//                   className="flex items-center gap-2 px-4 py-2 text-white  hover:bg-sky-700 rounded-md transition-transform duration-150 
//     active:scale-95 active:bg-sky-800 "
//                 >
//                   <item.icon className="text-lg" />
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



// const Sidebar = () => {
//   const assignedTerminals = JSON.parse(localStorage.getItem('assignedTerminals'));

//   return (
//     <div className="sidebar bg-[#1d5d90] w-64 p-4 shadow-sm fixed top-0 left-0 h-screen overflow-y-auto">
//       <div className="mb-8 flex items-center justify-center">
//         <HomeIcon className="text-4xl text-[#f6f6f6]" />
//       </div>

//       <div className="space-y-4">
//         <SidebarMenu
//           label="Home"
//           iconName={HomeIcon}
//           to="/home"
//         />
//         <SidebarMenu
//           label="Dashboard"
//           iconName={FaPalette}
//           to="/dashboard"
//         />
//         <SidebarMenu
//           label="Registers"
//           iconName={FaCashRegister}
//           submenuItems={assignedTerminals?.map((t) => ({
//             label: t.displayName,
//             to: `/register/${t.id}`,
//             icon: FaCashRegister,
//           }))}
//         />
//         <SidebarMenu
//           label="Contacts"
//           iconName={FaUsers}
//           submenuItems={[
//             { label: "Contacts", to: "/customers/list", icon: FaUsers },
//             { label: "Add Contact", to: "/customers/add", icon: FaUserPlus },
//           ]}
//         />
//         <SidebarMenu
//           label="Inventory"
//           iconName={FaChartBar}
//           submenuItems={[
//             { label: "Add Product", to: "/products/add", icon: FaPlusCircle },
//             { label: "Product Inventory", to: "/inventory/list", icon: FaChartBar },
//             { label: "Categories", to: "/categories", icon: FaList },
//             { label: "Measurement Units", to: "/measurementUnits", icon: FaList },
//           ]}
//         />
//         <SidebarMenu
//           label="Stock"
//           iconName={FaChartBar}
//           submenuItems={[
//             { label: "Stock Entry", to: "/inventory/stockentry/add", icon: FaPlusCircle },
//             { label: "Stock Entries", to: "/inventory/stockentry/list", icon: FaList },
//           ]}
//         />
//         <SidebarMenu
//           label="Reports"
//           iconName={FaChartLine}
//           to="/reports/report-dashboard"
//         />
//         <SidebarMenu
//           label="Settings"
//           iconName={FaCog}
//           submenuItems={[
//             { label: "General Settings", to: "/settings/general", icon: FaCog },
//             { label: "Permissions", to: "/settings/permissions", icon: FaCog },
//           ]}
//         />
//         <SidebarMenu
//           label="About"
//           iconName={FaInfoCircle}
//           to="/about"
//         />
//       </div>
//     </div>
//   );
// };