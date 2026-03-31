import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
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
  HomeIcon,
  Monitor,
} from "lucide-react";

const MobileMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const assignedTerminals = JSON.parse(localStorage.getItem("assignedTerminals") || "[]");

  const handleNavigation = (to) => {
    navigate(to);
    onClose();
  };

  const menuItems = [
    { label: "Home", icon: HomeIcon, to: "/home" },
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    {
      label: "Registers",
      icon: Monitor,
      submenuItems: assignedTerminals?.map((t) => ({
        label: t.displayName,
        to: `/register/${t.id}`,
        icon: Monitor,
      })),
    },
    {
      label: "Contacts",
      icon: Users,
      submenuItems: [
        { label: "Contacts", to: "/customers/list", icon: Users },
        { label: "Add Contact", to: "/customers/add", icon: UserPlus },
      ],
    },
    {
      label: "Inventory",
      icon: Boxes,
      submenuItems: [
        { label: "Add Product", to: "/products/add", icon: PlusCircle },
        { label: "Product Inventory", to: "/inventory/list", icon: Boxes },
        { label: "Transfer Orders", to: "/inventory/transferorders/create", icon: List },
        { label: "Categories", to: "/categories", icon: List },
        { label: "Measurement Units", to: "/measurementUnits", icon: List },
      ],
    },
    {
      label: "Stock",
      icon: BarChart3,
      submenuItems: [
        { label: "Stock Entry", to: "/inventory/stockentry/add", icon: PlusCircle },
        { label: "Stock Entries", to: "/inventory/stockentry/list", icon: List },
      ],
    },
    { label: "Reports", icon: LineChart, to: "/reports/report-dashboard" },
    {
      label: "Settings",
      icon: Settings,
      submenuItems: [
        { label: "General Settings", to: "/settings/general", icon: Settings },
        { label: "Permissions", to: "/settings/permissions", icon: Shield },
      ],
    },
    { label: "About", icon: Info, to: "/about" },
  ];

  // Separate single items and items with submenus
  const singleMenuItems = menuItems.filter(item => !item.submenuItems);
  const nestedMenuItems = menuItems.filter(item => item.submenuItems);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm md:hidden">
      <div className="fixed inset-0 bg-[#1d5d90] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sky-700/30 bg-[#1d5d90]">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-sky-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Single Menu Items - Square Buttons at Top */}
          {singleMenuItems.length > 0 && (
            <div className="p-4 border-b border-sky-700/30">
              <div className="grid grid-cols-3 gap-3">
                {singleMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.to)}
                    className="aspect-square bg-sky-700/50 hover:bg-sky-700/80 rounded-lg flex flex-col items-center justify-center gap-2 p-3 transition-colors"
                  >
                    <item.icon className="w-6 h-6 text-white" />
                    <span className="text-xs text-white text-center font-medium leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nested Menu Items - Sections with Titles */}
          <div className="p-4 space-y-6">
            {nestedMenuItems.map((item, index) => (
              <div key={index} className="space-y-3">
                {/* Parent Title */}
                <div className="flex items-center gap-3 px-2">
                  <item.icon className="w-5 h-5 text-white/70" />
                  <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wide">
                    {item.label}
                  </h3>
                </div>

                {/* Submenu Items */}
                <div className="grid grid-cols-2 gap-2 ml-8">
                  {item.submenuItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => handleNavigation(subItem.to)}
                      className="bg-sky-700/30 hover:bg-sky-700/60 rounded-md flex items-center gap-3 p-3 transition-colors"
                    >
                      <subItem.icon className="w-4 h-4 text-white/90 flex-shrink-0" />
                      <span className="text-sm text-white/90 font-medium text-left">
                        {subItem.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sky-700/30 bg-[#1d5d90]">
          <Link
            to="/"
            onClick={onClose}
            className="block text-center text-white/70 hover:text-white transition-colors text-sm"
          >
            Powered by Legend POS
          </Link>
          <div className="text-center text-white/50 text-xs mt-1">
            © {new Date().getFullYear()} Legendbyte. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;




// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { X } from "lucide-react";
// import {
//   LayoutDashboard,
//   Users,
//   UserPlus,
//   Boxes,
//   PlusCircle,
//   List,
//   BarChart3,
//   LineChart,
//   Settings,
//   Shield,
//   Info,
//   HomeIcon,
//   Monitor,
// } from "lucide-react";

// const MobileMenu = ({ onClose }) => {
//   const navigate = useNavigate();
//   const assignedTerminals = JSON.parse(localStorage.getItem("assignedTerminals") || "[]");

//   const handleNavigation = (to) => {
//     navigate(to);
//     onClose();
//   };

//   const menuItems = [
//     { label: "Home", icon: HomeIcon, to: "/home" },
//     { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
//     {
//       label: "Registers",
//       icon: Monitor,
//       submenuItems: assignedTerminals?.map((t) => ({
//         label: t.displayName,
//         to: `/register/${t.id}`,
//         icon: Monitor,
//       })),
//     },
//     {
//       label: "Contacts",
//       icon: Users,
//       submenuItems: [
//         { label: "Contacts", to: "/customers/list", icon: Users },
//         { label: "Add Contact", to: "/customers/add", icon: UserPlus },
//       ],
//     },
//     {
//       label: "Inventory",
//       icon: Boxes,
//       submenuItems: [
//         { label: "Add Product", to: "/products/add", icon: PlusCircle },
//         { label: "Product Inventory", to: "/inventory/list", icon: Boxes },
//         { label: "Transfer Orders", to: "/inventory/transferorders/create", icon: List },
//         { label: "Categories", to: "/categories", icon: List },
//         { label: "Measurement Units", to: "/measurementUnits", icon: List },
//       ],
//     },
//     {
//       label: "Stock",
//       icon: BarChart3,
//       submenuItems: [
//         { label: "Stock Entry", to: "/inventory/stockentry/add", icon: PlusCircle },
//         { label: "Stock Entries", to: "/inventory/stockentry/list", icon: List },
//       ],
//     },
//     { label: "Reports", icon: LineChart, to: "/reports/report-dashboard" },
//     {
//       label: "Settings",
//       icon: Settings,
//       submenuItems: [
//         { label: "General Settings", to: "/settings/general", icon: Settings },
//         { label: "Permissions", to: "/settings/permissions", icon: Shield },
//       ],
//     },
//     { label: "About", icon: Info, to: "/about" },
//   ];

//   return (
//     <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm md:hidden">
//       <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#1d5d90] shadow-xl transform transition-transform duration-300 ease-in-out">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-sky-700/30">
//           <h2 className="text-lg font-semibold text-white">Menu</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-white hover:bg-sky-700 rounded-md transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Menu Items */}
//         <div className="flex-1 overflow-y-auto py-4">
//           <nav className="px-4 space-y-2">
//             {menuItems.map((item, index) => (
//               <div key={index}>
//                 {item.submenuItems ? (
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-3 px-3 py-2 text-white/70 text-sm font-medium uppercase tracking-wide">
//                       <item.icon className="w-4 h-4" />
//                       {item.label}
//                     </div>
//                     <div className="ml-7 space-y-1">
//                       {item.submenuItems.map((subItem, subIndex) => (
//                         <button
//                           key={subIndex}
//                           onClick={() => handleNavigation(subItem.to)}
//                           className="flex items-center gap-3 w-full px-3 py-2 text-white/90 hover:bg-sky-700/80 rounded-md transition-colors text-sm"
//                         >
//                           <subItem.icon className="w-4 h-4" />
//                           {subItem.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => handleNavigation(item.to)}
//                     className="flex items-center gap-3 w-full px-3 py-2 text-white hover:bg-sky-700/80 rounded-md transition-colors text-sm"
//                   >
//                     <item.icon className="w-5 h-5" />
//                     {item.label}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </nav>
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-sky-700/30">
//           <Link
//             to="/"
//             onClick={onClose}
//             className="block text-center text-white/70 hover:text-white transition-colors text-sm"
//           >
//             Powered by Legend POS
//           </Link>
//           <div className="text-center text-white/50 text-xs mt-1">
//             © {new Date().getFullYear()} Legendbyte. All rights reserved.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MobileMenu;