import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "../../components/navBar/SideBar";
import { getTeminallByUserId } from "../../functions/dropdowns";
import moment from "moment";
import { 
  Monitor, 
  ArrowRight, 
  PlayCircle, 
  HelpCircle, 
  Clock, 
  ChevronRight 
} from "lucide-react";

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

  useEffect(() => {
    if (!systemInfo) {
      setTimezone("Unknown Timezone");
      return;
    }
    setTimezone(getTimeZoneFromOffset(utcOffset));
  }, [systemInfo, utcOffset]);

  useEffect(() => {
    const interval = setInterval(() => {
      const adjustedTime = moment.utc().add(utcOffset, "minutes");
      setCurrentTime(adjustedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [utcOffset]);

  const formattedTime = currentTime ? currentTime.format("h:mm:ss A") : "Loading...";
  const formattedDate = currentTime ? currentTime.format("MMMM D, YYYY") : "Loading...";

  return (
    <div className="bg-white rounded-2xl  p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-sky-600" />
        Welcome, {userinfo?.displayName || "User"}
      </h3>
      <div className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">
        {formattedTime}
      </div>
      <div className="text-lg text-gray-600 mb-1">
        {formattedDate}
      </div>
      <div className="text-sm text-gray-500">
        Timezone: {timezone || "Loading..."}
      </div>
    </div>
  );
};

const HomeMenuButton = ({ to, label, icon: Icon }) => {
  return (
    <Link
      to={to}
      className="group relative flex flex-col items-center justify-center 
                 min-w-[180px] h-40 p-6 bg-white rounded-2xl border border-gray-200
                 hover:shadow-md hover:border-sky-500 hover:-translate-y-1 
                 transition-all duration-300 ease-out overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/0 to-sky-100/0 
                      group-hover:from-sky-50 group-hover:to-sky-100 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-sky-100 flex items-center justify-center 
                        group-hover:bg-sky-200 transition-colors duration-300">
          <Icon className="w-8 h-8 text-sky-600 group-hover:text-sky-700 transition-colors" />
        </div>
        <span className="text-base font-semibold text-gray-800 text-center leading-tight group-hover:text-sky-700 transition-colors">
          {label}
        </span>
      </div>

      {/* Arrow indicator */}
      <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 
                            group-hover:text-sky-600 group-hover:translate-x-1 transition-all duration-300" />
    </Link>
  );
};

const TutorialCard = ({ title, description, videoUrl, buttonText = "Watch Tutorial" }) => (
  <div className="bg-white rounded-2xl  border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
        <PlayCircle className="w-7 h-7 text-sky-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 mb-4">{description}</p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium"
        >
          {buttonText}
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [assignedTerminals, setAssignedTerminals] = useState([]);
  const userinfo = safeParse("user");
  const selectedStore = safeParse("selectedStore");

  useEffect(() => {
    if (!selectedStore) {
      navigate("/selectStore");
    }
  }, [selectedStore, navigate]);

  useEffect(() => {
    const loadTerminals = async () => {
      try {
        const terminals = await getTeminallByUserId(userinfo?.userId);
        if (terminals?.data) {
          setAssignedTerminals(terminals.data);
          localStorage.setItem("assignedTerminals", JSON.stringify(terminals.data));
        }
      } catch (err) {
        console.error("Failed to load terminals:", err);
      }
    };
    if (userinfo?.userId) loadTerminals();
  }, [userinfo?.userId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-10 p-6 md:p-8 lg:p-10">
        {/* Header Greeting & Time */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userinfo?.displayName || "User"}!
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your business from here — select a terminal to begin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: POS Terminals */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Monitor className="w-7 h-7 text-sky-600" />
              Your POS Terminals
            </h2>

            {assignedTerminals.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                <Monitor className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No terminals assigned yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Contact your administrator to assign a POS terminal
                </p>
                <button
                  onClick={() => navigate("/settings")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition"
                >
                  Go to Settings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedTerminals.map((t) => (
                  <HomeMenuButton
                    key={t.id}
                    label={t.displayName}
                    icon={Monitor}
                    to={`/register/${t.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: User Info & Quick Actions */}
          <div className="space-y-6">
            <UserInfo />

            {/* Quick Links */}
            <div className="bg-white rounded-2xl  p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/inventory/list"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span>View Inventory</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <Link
                  to="/reports/report-dashboard"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span>Check Reports</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How to Get Started Section */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <PlayCircle className="w-7 h-7 text-sky-600" />
            How to Get Started with Legend POS
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TutorialCard
              title="Quick Start Guide"
              description="Learn the basics: setting up your first terminal, adding products, and making sales."
              videoUrl="https://www.youtube.com/watch?v=your-quick-start-video-id"
            />

            <TutorialCard
              title="Adding Products & Inventory"
              description="Step-by-step: how to add items, set prices, manage stock, and use categories."
              videoUrl="https://www.youtube.com/watch?v=your-inventory-video-id"
            />

            <TutorialCard
              title="Processing Sales & Receipts"
              description="Master fast checkouts, printing receipts, and handling returns/refunds."
              videoUrl="https://www.youtube.com/watch?v=your-sales-video-id"
            />
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://legendpos.com/tutorials" // ← replace with your real tutorials page
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition shadow-md"
            >
              View All Video Tutorials
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaCashRegister } from "react-icons/fa";
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
//   iconName: Icon,
//   submenuItems,
//   isDisabled = false,
// }) => {
//   return (
//     <Link
//       className={`flex flex-col min-w-[150px] items-center h-auto
//       rounded-lg cursor-pointer py-4 px-3 bg-white shadow-sm border
//       hover:border-gray-300 hover:bg-slate-100
//       hover:shadow-lg transition duration-300 
//       ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
//       to={to}
//     >
//       <div className="flex items-center gap-3 mb-2">
//         <Icon className="text-xl" />
//       </div>
//       <div className="text-lg font-semibold text-gray-800 truncate group-hover:overflow-visible group-hover:text-ellipsis group-hover:whitespace-normal">
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
//   const userinfo = JSON.parse(localStorage.getItem('user'));

//   const selectedStore = localStorage.getItem("selectedStore") && JSON.parse(localStorage.getItem("selectedStore"));

//   useEffect(() => {
//     console.log("selectStore", selectedStore);
//     if (!selectedStore) {
//       navigate('/selectStore');
//     }
//   }, [selectedStore]);

//   useEffect(() => {
//     loadTeminals();
//   }, []);

//   const [terminals, setTerminals] = useState(null);
//   const loadTeminals = async () => {
//     const terminals = await getTeminallByUserId(userinfo.userId);
//     setTerminals(terminals.data);
//     localStorage.setItem('assignedTerminals', JSON.stringify(terminals.data));
//   };

//   return (
//     <>
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 ml-64">
//           <div className="flex justify-between items-center gap-52">
//             <div className="w-full my-24">
//               <div className="flex gap-4">
//                 {terminals?.map((t) => (
//                   <HomeMenuButton
//                     label={t.displayName}
//                     iconName={FaCashRegister}
//                     to={`/register/${t.id}`}
//                   />
//                 ))}
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
