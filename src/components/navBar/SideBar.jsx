import { faHome, faStore, faChevronDown, faCog, faUsers, faTags, faChartBar, faPalette, faChartLine, faCalculator, faUserPlus, faFileAlt, faTable, faList, faPlusCircle, faAsterisk, faCashRegister, faHomeAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './sidebar.css';


  const SidebarMenu = ({ label, iconName, to, submenuItems, isDisabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // useNavigate hook to handle navigation
  
    const toggleMenu = () => setIsOpen(!isOpen);
  
    const handleClick = () => {
      if (submenuItems && submenuItems.length > 0) {
        toggleMenu(); // Toggle submenu visibility
      } else {
        navigate(to); // Navigate to the given URL if no submenu
      }
    };
  
    return (
      <div className="sidebar-menu w-full">
        <button
          className={`flex w-full items-center gap-2 py-3 px-4 text-lg text-white hover:bg-sky-600 rounded-md ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
          onClick={handleClick} // Use the handleClick function to handle both submenu toggle and navigation
        >
          <FontAwesomeIcon icon={iconName} className="text-xl" />
          <span className="font-semibold">{label}</span>
          {submenuItems && submenuItems.length > 0 && (
            <FontAwesomeIcon icon={faChevronDown} className={`ml-auto ${isOpen ? "rotate-180" : ""}`} />
          )}
        </button>
  
        {/* Nested Submenu */}
        {isOpen && submenuItems && submenuItems.length > 0 && (
          <ul className="submenu-list pl-6 mt-2 space-y-2">
            {submenuItems.map((item, index) => (
              <li key={index}>
                {item.submenuItems ? (
                  // Nested Submenu (recursive)
                  <SidebarMenu
                    label={item.label}
                    iconName={item.icon}
                    submenuItems={item.submenuItems}
                    isDisabled={item.isDisabled}
                  />
                ) : (
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-sky-600 rounded-md"
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
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


  const assignedTerminals=JSON.parse(localStorage.getItem('assignedTerminals'));

    return (
      <div className="sidebar bg-sky-600 w-64 p-4 shadow-sm fixed top-0 left-0 h-screen overflow-y-auto">
      <div className="mb-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faHome} className="text-4xl text-white" />
      </div>
  
        <div className="space-y-4">
        <SidebarMenu
            label="Home"
            iconName={faHomeAlt}
            to= "/home"
          />
          <SidebarMenu
            label="Dashboard"
            iconName={faPalette}
            to= "/dashboard"
          />
  
          {/* <SidebarMenu
            label="Registers"
            iconName={faCashRegister}
            submenuItems={[
              { label: "Terminal 1", to: "/register/1", icon: faCashRegister },
              { label: "Terminal 2", to: "/register/2", icon: faCashRegister },
      
            ]}
          /> */}

<SidebarMenu
  label="Registers"
  iconName={faCashRegister}
  submenuItems={assignedTerminals?.map((t) => ({
    label: t.displayName,
    to: `/register/${t.id}`,
    icon: faCashRegister,
  }))}
/>


          <SidebarMenu
            label="Contacts"
            iconName={faUsers}
            submenuItems={[
              { label: "Contacts", to: "/customers/list", icon: faUsers },
              { label: "Add Contact", to: "/customers/add", icon: faUserPlus },
            ]}
          />
          <SidebarMenu
            label="Products"
            iconName={faTags}
            submenuItems={[
              { label: "Add Product", to: "/products/add", icon: faPlusCircle },
            ]}
          />
          <SidebarMenu
            label="Inventory"
            iconName={faChartBar}
            submenuItems={[
              { label: "Product Inventory", to: "/inventory/list", icon: faChartBar },
              {
                label: "Stock",
                icon: faTable,
                submenuItems: [
                  { label: "Stock Entry", to: "/inventory/stockentry/add", icon: faPlusCircle },
                  { label: "Stock Entries", to: "/inventory/stockentry/list", icon: faList },
                ],
              },
            ]}
          />
  
  <SidebarMenu
    label="Reports"
    iconName={faChartLine}
    to="/reports/reportViewer"
  />
  
          <SidebarMenu
            label="Settings"
            iconName={faCog}
            submenuItems={[
              {
                label: "Master Data",
                icon: faAsterisk,
                submenuItems: [
                  { label: "Categories", to: "/categories", icon: faList },
                  { label: "Measurement Units", to: "/measurementUnits", icon: faList },
                ],
              },
              { label: "General Settings", to: "/settings/general", icon: faCog },
              { label: "Permissions", to: "/settings/permissions", icon: faCog },
            ]}
          />


<SidebarMenu
    label="About"
    iconName={faInfoCircle}
    to="/about"
  />
        </div>
      </div>
    );
  };

  export default Sidebar;