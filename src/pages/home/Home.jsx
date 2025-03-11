import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faChevronDown,faCashRegister } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/format";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../../state/store/storeSlice";
import Sidebar from "../../components/navBar/SideBar";
import { getTeminallByUserId } from "../../functions/dropdowns";


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

        {/* <i className={`${iconName} text-3xl text-gray-700`} /> */}
        <FontAwesomeIcon icon={iconName} className="text-xl" />
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [assignedTerminals, setAssignedTerminals] = useState([
    { terminalId: 1, terminalName: "Testing Terminal 1" },
  ]);
  const userinfo=JSON.parse(localStorage.getItem('user'));

  const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));


  useEffect(()=>{
console.log("selectStore",selectedStore)
    if(!selectedStore){
      navigate('/selectStore')
    }

  },[selectedStore])

  useEffect(()=>{
    loadTeminals();
    
      },[])

const [terminals,setTerminals]=useState(null);
const loadTeminals=async ()=>{
 const terminals= await getTeminallByUserId(userinfo.userId);
 setTerminals(terminals.data);
 localStorage.setItem('assignedTerminals', JSON.stringify(terminals.data));
}
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <div className="flex justify-between items-center gap-52">
            <div className="w-full my-24">
              {/* <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Registers
            </h3> */}

              <div className="flex gap-4">
                {/* Example for home buttons */}

                {terminals?.map((t) => (
                  <HomeMenuButton
                    label={t.displayName}
                    iconName={faCashRegister}
                    to={`/register/${t.id}`}
                  />
                ))}

                {/* <HomeMenuButton
                label="Terminal 2"
                iconName={faCashRegister}
                to="/register/2"
              /> */}
              </div>
            </div>

            <UserInfo />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
