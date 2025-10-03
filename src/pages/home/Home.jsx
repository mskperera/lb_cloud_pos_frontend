
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCashRegister } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Sidebar from "../../components/navBar/SideBar";
import { getTeminallByUserId } from "../../functions/dropdowns";
import moment from "moment";

const safeParse = (item) => {
  const value = localStorage.getItem(item);
  if (!value || value === "undefined") return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error(`Failed to parse ${item} from localStorage:`, e);
    return null;
  }
};

const UserInfo = () => {
  const [currentTime, setCurrentTime] = useState(moment.utc());
  const [timezone, setTimezone] = useState(null);

  const userinfo = safeParse("user");
  const systemInfo = safeParse("systemInfo");
  const utcOffset = systemInfo?.utcOffset || 0;

  const getTimeZoneFromOffset = (utcOffset) => {
    const hours = Math.floor(Math.abs(utcOffset) / 60);
    const minutes = Math.abs(utcOffset) % 60;
    const sign = utcOffset >= 0 ? "+" : "-";
    return `GMT${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ""}`;
  };

  const loadTimeZone = () => {
    if (!systemInfo) {
      setTimezone("Unknown Timezone");
      return;
    }
    const timeZne = getTimeZoneFromOffset(utcOffset);
    setTimezone(timeZne);
  };

  const loadTime = () => {
    const adjustedTime = moment.utc().add(utcOffset, "minutes");
    setCurrentTime(adjustedTime);
  };

  useEffect(() => {
    loadTimeZone();
    loadTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const adjustedTime = moment.utc().add(utcOffset, "minutes");
      setCurrentTime(adjustedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [utcOffset]);

  const formattedTime = currentTime ? currentTime.format("h:mm:ss A") : "Loading...";
  const formattedDate = currentTime
    ? currentTime.format("MMMM D, YYYY")
    : "Loading...";

  return (
    <div className="flex flex-col items-right justify-center p-6 w-full">
      <div className="text-2xl font-semibold text-gray-700 mb-4 ml-3">
        Hi, {userinfo?.displayName || "Guest"}!
      </div>
      <div className="text-5xl text-gray-600 mb-2">{formattedTime}</div>
      <div className="text-xl text-gray-500 mb-2 ml-2">Date: {formattedDate}</div>
      <div className="text-lg text-gray-400 ml-2">Timezone: {timezone || "Loading..."}</div>
    </div>
  );
};

const HomeMenuButton = ({
  to,
  label,
  iconName: Icon,
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
        <Icon className="text-xl" />
      </div>
      <div className="text-lg font-semibold text-gray-800 truncate group-hover:overflow-visible group-hover:text-ellipsis group-hover:whitespace-normal">
        {label}
      </div>
    </Link>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [assignedTerminals, setAssignedTerminals] = useState([
    { terminalId: 1, terminalName: "Testing Terminal 1" },
  ]);
  const userinfo = JSON.parse(localStorage.getItem('user'));

  const selectedStore = localStorage.getItem("selectedStore") && JSON.parse(localStorage.getItem("selectedStore"));

  useEffect(() => {
    console.log("selectStore", selectedStore);
    if (!selectedStore) {
      navigate('/selectStore');
    }
  }, [selectedStore]);

  useEffect(() => {
    loadTeminals();
  }, []);

  const [terminals, setTerminals] = useState(null);
  const loadTeminals = async () => {
    const terminals = await getTeminallByUserId(userinfo.userId);
    setTerminals(terminals.data);
    localStorage.setItem('assignedTerminals', JSON.stringify(terminals.data));
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <div className="flex justify-between items-center gap-52">
            <div className="w-full my-24">
              <div className="flex gap-4">
                {terminals?.map((t) => (
                  <HomeMenuButton
                    label={t.displayName}
                    iconName={FaCashRegister}
                    to={`/register/${t.id}`}
                  />
                ))}
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

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
// import { useDispatch } from "react-redux";
// import Sidebar from "../../components/navBar/SideBar";
// import { getTeminallByUserId } from "../../functions/dropdowns";
// import moment from "moment";

// const safeParse = (item) => {
//   const value = localStorage.getItem(item);
//   if (!value || value === "undefined") return null;
//   try {
//     return JSON.parse(value);
//   } catch (e) {
//     console.error(`Failed to parse ${item} from localStorage:`, e);
//     return null;
//   }
// };

// const UserInfo = () => {
//   const [currentTime, setCurrentTime] = useState(moment.utc());
//   const [timezone, setTimezone] = useState(null);

//   const userinfo = safeParse("user");
//   const systemInfo = safeParse("systemInfo");
//   const utcOffset = systemInfo?.utcOffset || 0;

//   const getTimeZoneFromOffset = (utcOffset) => {
//     const hours = Math.floor(Math.abs(utcOffset) / 60);
//     const minutes = Math.abs(utcOffset) % 60;
//     const sign = utcOffset >= 0 ? "+" : "-";
//     return `GMT${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ""}`;
//   };

//   const loadTimeZone = () => {
//     if (!systemInfo) {
//       setTimezone("Unknown Timezone");
//       return;
//     }
//     const timeZne = getTimeZoneFromOffset(utcOffset);
//     setTimezone(timeZne);
//   };

//   const loadTime = () => {
//     const adjustedTime = moment.utc().add(utcOffset, "minutes");
//     setCurrentTime(adjustedTime);
//   };

//   useEffect(() => {
//     loadTimeZone();
//     loadTime();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const adjustedTime = moment.utc().add(utcOffset, "minutes");
//       setCurrentTime(adjustedTime);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [utcOffset]);

//   const formattedTime = currentTime ? currentTime.format("h:mm:ss A") : "Loading...";
//   const formattedDate = currentTime
//     ? currentTime.format("MMMM D, YYYY")
//     : "Loading...";

//   return (
//     <div className="flex flex-col items-right justify-center p-6 w-full">
//       <div className="text-2xl font-semibold text-gray-700 mb-4 ml-3">
//         Hi, {userinfo?.displayName || "Guest"}!
//       </div>
//       <div className="text-5xl text-gray-600 mb-2">{formattedTime}</div>
//       <div className="text-xl text-gray-500 mb-2 ml-2">Date: {formattedDate}</div>
//       <div className="text-lg text-gray-400 ml-2">Timezone: {timezone || "Loading..."}</div>
//     </div>
//   );
// };



// const HomeMenuButton = ({
//   to,
//   label,
//   iconName,
//   submenuItems,
//   isDisabled = false,
// }) => {
//   return (
//     <Link
//       className={`flex flex-col min-w-[150px] items-center h-auto
//       rounded-lg cursor-pointer py-4 px-3 bg-white shadow-sm border
//       hover:border-gray-300 hover:bg-slate-100
//       hover:shadow-lg transition duration-300 
//        ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//       to={to}
//     >
//       <div className="flex items-center gap-3 mb-2">
//         {/* <img
//             src={``}
//             //alt={p.productName}
//             className="w-[80px] h-[80px] rounded-lg object-cover"
//           /> */}

//         {/* <i className={`${iconName} text-3xl text-gray-700`} /> */}

//         <FontAwesomeIcon icon={iconName} className="text-xl" />
//       </div>
//       <div className="text-lg  font-semibold text-gray-800 truncate group-hover:overflow-visible group-hover:text-ellipsis group-hover:whitespace-normal">
//         {label}
//       </div>
//     </Link>
//   );
// };


// const Home = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [assignedTerminals, setAssignedTerminals] = useState([
//     { terminalId: 1, terminalName: "Testing Terminal 1" },
//   ]);
//   const userinfo=JSON.parse(localStorage.getItem('user'));

//   const selectedStore = localStorage.getItem("selectedStore") && JSON.parse(localStorage.getItem("selectedStore"));


//   useEffect(()=>{
// console.log("selectStore",selectedStore)
//     if(!selectedStore){
//       navigate('/selectStore')
//     }

//   },[selectedStore])

//   useEffect(()=>{
//     loadTeminals();
    
//       },[])

// const [terminals,setTerminals]=useState(null);
// const loadTeminals=async ()=>{
//  const terminals= await getTeminallByUserId(userinfo.userId);
//  setTerminals(terminals.data);
//  localStorage.setItem('assignedTerminals', JSON.stringify(terminals.data));
// }
//   return (
//     <>
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 ml-64">
//           <div className="flex justify-between items-center gap-52">
//             <div className="w-full my-24">
//               {/* <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
//               Registers
//             </h3> */}

//               <div className="flex gap-4">
//                 {/* Example for home buttons */}

//                 {terminals?.map((t) => (
//                   <HomeMenuButton
//                     label={t.displayName}
//                     iconName={faCashRegister}
//                     to={`/register/${t.id}`}
//                   />
//                 ))}

//                 {/* <HomeMenuButton
//                 label="Terminal 2"
//                 iconName={faCashRegister}
//                 to="/register/2"
//               /> */}
//               </div>
//             </div>

//             <UserInfo />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
