import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="flex justify-between gap-5 items-center  rounded-2xl  border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-sky-600" />
        Welcome, {userinfo?.displayName || "User"}
      </h3>
      <div>
      <div className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
        {formattedTime}
      </div>
      <div className="text-lg text-gray-600 mb-1">
        {formattedDate}
      </div>
      </div>
      {/* <div className="text-sm text-gray-500">
        Timezone: {timezone || "Loading..."}
      </div> */}
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
const [isLoading,setIsLoading]=useState(false);

  useEffect(() => {

    console.log("selectedStore in Home.jsx useEffect:", selectedStore);
    if (!selectedStore) {
      navigate("/selectStore");
    }
  }, [selectedStore, navigate]);

  useEffect(() => {
    const loadTerminals = async () => {
      try {
      setIsLoading(true);
        const terminals = await getTeminallByUserId(userinfo?.userId,selectedStore.storeId);
        if (terminals?.data) {
          setAssignedTerminals(terminals.data);
          localStorage.setItem("assignedTerminals", JSON.stringify(terminals.data));
        }
           setIsLoading(false);
      } catch (err) {
         setIsLoading(false);
        console.error("Failed to load terminals:", err);
      }
    };
    if (userinfo?.userId) loadTerminals();
  }, [userinfo?.userId]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 ml-10 p-6 md:p-8 lg:p-10">

{!isLoading ? <div>

        {/* Header Greeting & Time */}
        <div className="mb-10">
                 <UserInfo />
          {/* <p className="text-gray-600 text-lg">
            Manage your business from here — select a terminal to begin
          </p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: POS Terminals */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
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

</div>:
<div className="flex min-h-[60vh] flex-col items-center justify-center">
    {/* Modern loading spinner + text */}
    <div className="relative flex flex-col items-center gap-6">
      {/* Spinner */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />

      {/* Loading text */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  </div>

}

      </div>
    </div>
  );
};

export default Home;