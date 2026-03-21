// src/components/Sidebar.jsx
import { useState, useEffect, useRef } from "react";
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
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
} from "lucide-react";

// const SidebarMenu = ({ label, iconName: Icon, to, submenuItems, isDisabled = false, isCollapsed = false }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   // Close submenu when sidebar collapses
//   useEffect(() => {
//     if (isCollapsed && isOpen) {
//       setIsOpen(false);
//     }
//   }, [isCollapsed, isOpen]);

//   const handleClick = () => {
//     // Don't allow submenu expansion when sidebar is collapsed
//     if (isCollapsed) {
//       if (to) {
//         navigate(to);
//       }
//       return;
//     }

//     if (submenuItems?.length) {
//       setIsOpen(!isOpen);
//     } else if (to) {
//       navigate(to);
//     }
//   };

//   return (
//     <div className="sidebar-menu w-full">
//       <button
//         className={`flex w-full items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 text-white 
//         hover:bg-sky-700 rounded-md transition-transform duration-150
//         active:scale-95 active:bg-sky-800
//         ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//         onClick={handleClick}
//         title={isCollapsed ? label : undefined}
//       >
//         <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-6 h-6'}`} />
//         {!isCollapsed && <span className="font-semibold text-sm">{label}</span>}

//         {!isCollapsed && submenuItems?.length > 0 && (
//           <ChevronDown
//             className={`ml-auto w-6 h-6 transition-transform ${
//               isOpen ? "rotate-180" : ""
//             }`}
//           />
//         )}
//       </button>

//       {isOpen && submenuItems?.length > 0 && (
//         <ul className={`submenu-list mt-2 space-y-2 ${isCollapsed ? 'pl-2' : 'pl-6'}`}>
//           {submenuItems.map((item, index) => (
//             <li key={index}>
//               {item.submenuItems ? (
//                 <SidebarMenu {...item} isCollapsed={isCollapsed} />
//               ) : (
//                 <Link
//                   to={item.to}
//                   className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-2 px-4'} py-2 text-white
//                   hover:bg-sky-700 rounded-md transition-transform duration-150
//                   active:scale-95 active:bg-sky-800`}
//                   title={isCollapsed ? item.label : undefined}
//                 >
//                   <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-6 h-6'}`} />
//                   {!isCollapsed && <span className="text-sm">{item.label}</span>}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };






const SidebarMenu = ({
  label,
  iconName: Icon,
  to,
  submenuItems,
  isDisabled = false,
  isCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close when clicking outside (only for flyout)
  useEffect(() => {
    if (!isCollapsed || !isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed, isOpen]);

  // Auto-close submenus when collapsing sidebar
  useEffect(() => {
    if (isCollapsed && isOpen) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const handleClick = (e) => {
    if (isDisabled) return;

    if (isCollapsed) {
      // Collapsed mode → toggle flyout
      if (submenuItems?.length > 0) {
        setIsOpen((prev) => !prev);
      } else if (to) {
        navigate(to);
        setIsOpen(false);
      }
    } else {
      // Expanded mode → normal accordion or navigation
      if (submenuItems?.length > 0) {
        setIsOpen((prev) => !prev);
      } else if (to) {
        navigate(to);
      }
    }
  };

  const handleSubItemClick = () => {
    if (isCollapsed) {
      setIsOpen(false); // close flyout after navigation
    }
  };

  return (
    <div className="sidebar-menu relative w-full" ref={menuRef}>
      {/* Parent menu button */}
      <button
        className={`
          group flex w-full items-center
          ${isCollapsed ? "justify-center px-2" : "gap-3 px-4"}
          py-3 text-white
          hover:bg-sky-700/80 rounded-md transition-all duration-150
          active:scale-[0.98] active:bg-sky-800/90
          ${isDisabled ? "opacity-50 pointer-events-none" : ""}
        `}
        onClick={handleClick}
        title={isCollapsed ? label : undefined}
      >
        <Icon
          className={`${isCollapsed ? "w-6 h-6" : "w-6 h-6"} shrink-0`}
        />

        {!isCollapsed && (
          <>
            <span className="font-medium text-sm truncate">{label}</span>

            {submenuItems?.length > 0 && (
              <ChevronDown
                className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </>
        )}

        {/* Small arrow hint when collapsed & has children */}
        {isCollapsed && submenuItems?.length > 0 && (
          <ChevronRight
            className={`absolute right-0.5 w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity ${
              isOpen ? "opacity-100" : ""
            }`}
          />
        )}
      </button>

      {/* ──────────────────────────────────────────────── */}
      {/* Expanded mode → inline dropdown (accordion)       */}
      {/* ──────────────────────────────────────────────── */}
      {!isCollapsed && isOpen && submenuItems?.length > 0 && (
        <ul className="submenu-list mt-1.5 space-y-1 pl-11">
          {submenuItems.map((item, idx) => (
            <li key={idx}>
              {item.submenuItems ? (
                <SidebarMenu {...item} isCollapsed={false} />
              ) : (
                <Link
                  to={item.to}
                  onClick={handleSubItemClick}
                  className={`
                    flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/90
                    hover:bg-sky-600/60 rounded-md transition-colors
                  `}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* Collapsed mode → flyout panel to the right       */}
      {/* ──────────────────────────────────────────────── */}
      {isCollapsed && isOpen && submenuItems?.length > 0 && (
       <div className="fixed inset-0 pointer-events-none z-50">
    <div 
      style={{ 
        position: 'absolute',
        top: menuRef.current?.getBoundingClientRect().top ?? 0,
        left: menuRef.current?.getBoundingClientRect().right ?? 0,
      }}
      className="pointer-events-auto w-64 bg-[#1d5d90] border ... rounded-lg shadow-xl ..."
    >
            <div className="px-3 py-2 text-xs font-semibold text-sky-200/90 uppercase tracking-wide">
              {label}
            </div>

            {submenuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={handleSubItemClick}
                className={`
                  flex items-center gap-3 px-4 py-2.5 text-sm text-white/90
                  hover:bg-sky-700/80 rounded-md transition-colors
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};




const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const assignedTerminals = JSON.parse(localStorage.getItem("assignedTerminals"));
  const navigate = useNavigate();

  console.log('Sidebar: isCollapsed =', isCollapsed);

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!isCollapsed);
    }
  };

  return (
    <div className={`sidebar bg-[#1d5d90] ${isCollapsed ? 'w-16 p-2' : 'w-64 p-4'} pt-20 fixed top-0 left-0 h-screen overflow-y-auto flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Logo / Header */}
        
        {/* <div className="mt-20 flex justify-between items-center px-4">
          <h3>Menu</h3>
     <button
       onClick={handleToggle}
        className=" transform -translate-y-1/2 translate-x-1/2 z-10  hover:bg-sky-700
         text-white p-2  transition-all duration-200 "
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <PanelLeftClose className="w-4 h-4" />
        ) : (
          <PanelLeft className="w-4 h-4" />
        )}
      </button>
      </div> */}
      {/* Main Menu Items */}
      <div className="space-y-3 flex-grow">
        <SidebarMenu label="Home" iconName={HomeIcon} to="/home" isCollapsed={isCollapsed} />
        <SidebarMenu label="Dashboard" iconName={LayoutDashboard} to="/dashboard" isCollapsed={isCollapsed} />

        <SidebarMenu
          label="Registers"
          iconName={Monitor}
          submenuItems={assignedTerminals?.map((t) => ({
            label: t.displayName,
            to: `/register/${t.id}`,
            icon: Monitor,
          }))}
          isCollapsed={isCollapsed}
        />

        <SidebarMenu
          label="Contacts"
          iconName={Users}
          submenuItems={[
            { label: "Contacts", to: "/customers/list", icon: Users },
            { label: "Add Contact", to: "/customers/add", icon: UserPlus },
          ]}
          isCollapsed={isCollapsed}
        />

        <SidebarMenu
          label="Inventory"
          iconName={Boxes}
          submenuItems={[
            { label: "Add Product", to: "/products/add", icon: PlusCircle },
            { label: "Product Inventory", to: "/inventory/list", icon: Boxes },
            { label: "Transfer Orders", to: "/inventory/transferorders/create", icon: List },
            { label: "Categories", to: "/categories", icon: List },
            { label: "Measurement Units", to: "/measurementUnits", icon: List },
          ]}
          isCollapsed={isCollapsed}
        />


         <SidebarMenu
          label="Stock"
          iconName={BarChart3}
          submenuItems={[
            { label: "Stock Entry", to: "/inventory/stockentry/add", icon: PlusCircle },
            { label: "Stock Entries", to: "/inventory/stockentry/list", icon: List },
          ]}
          isCollapsed={isCollapsed}
        />

        <SidebarMenu
          label="Reports"
          iconName={LineChart}
          to="/reports/report-dashboard"
          isCollapsed={isCollapsed}
        />

        <SidebarMenu
          label="Settings"
          iconName={Settings}
          submenuItems={[
            { label: "General Settings", to: "/settings/general", icon: Settings },
            { label: "Permissions", to: "/settings/permissions", icon: Shield },
          ]}
          isCollapsed={isCollapsed}
        />

        <SidebarMenu
          label="About"
          iconName={Info}
          to="/about"
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Bottom Section: Powered by + Copyright */}
      <div className={`mt-auto pt-6 border-t border-sky-700/30 ${isCollapsed ? 'text-center' : 'text-center'} text-sm text-sky-200/90`}>
        {!isCollapsed && (
          <>
            <Link
              to="/"  // ← change to your landing page URL, e.g. "https://legendpos.com" if external
              className="hover:text-white transition-colors font-medium"
            >
              Powered by Legend POS
            </Link>
            <div className="mt-1 opacity-80">
              © {new Date().getFullYear()} Legendbyte. All rights reserved.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
