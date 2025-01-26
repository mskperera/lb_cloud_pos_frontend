import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../../state/store/storeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faStore } from "@fortawesome/free-solid-svg-icons";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

      {/* Submenu Dropdown */}
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

const HomeMenuButton = ({
  to,
  label,
  iconName,
  submenuItems,
  isDisabled = false,
}) => {
  return (
    <Link
      className={`flex flex-col min-w-[150px] items-center justify-between
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
      <div className="text-lg font-semibold text-gray-800 truncate group-hover:overflow-visible group-hover:text-ellipsis group-hover:whitespace-normal">
        {label}
      </div>
    </Link>
  );
};

const UserInfo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("Susantha Perea"); // Replace with actual user name if available
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      <div className="text-2xl font-semibold text-gray-700 mb-4">
        Hi, {userName}!
      </div>
      <div className="text-xl text-gray-600 mb-2">
        Current Time: {formattedTime}
      </div>
      <div className="text-xl text-gray-500 mb-2">Date: {formattedDate}</div>
      <div className="text-lg text-gray-400">Timezone: {timezone}</div>
    </div>
  );
};

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
      ) : (
        <div
          className="flex flex-col gap-10 items-center justify-center mt-24 px-10 
       "
        >
          <div className="flex gap-4 justify-end w-full ">
            <PopupMenu
              label="Registers"
              iconName="pi pi-cog"
              submenuItems={[
                // { label: "General Settings", to: "/settings/general" },
                ...assignedTerminals.map((t) => ({
                  label: `${t.terminalName}`,
                  icon: "pi pi-calculator",
                  to: `/register/${t.terminalId}`,
                })),
              ]}
            />

            <PopupMenu
              label="Contacts"
              iconName="pi pi-users"
              submenuItems={[
                {
                  label: "Contacts",
                  to: "/customers/list",
                  icon: "pi pi-user",
                },
                {
                  label: "Add Contact",
                  to: "/customers/add",
                  icon: "pi pi-user-plus",
                },
              ]}
            />
            <PopupMenu
              label="Products"
              iconName="pi pi-tags"
              submenuItems={[
                { label: "Products", to: "/products/list" },
                { label: "Add Product", to: "/products/add" },
              ]}
            />
            <PopupMenu
              label="Inventory"
              iconName="pi pi-chart-bar"
              submenuItems={[
                { label: "Product Inventory", to: "/inventory/list" },
                { label: "Stock Entry", to: "/inventory/stockentry/add" },
                {
                  label: "View Stock Entries",
                  to: "/inventory/stockentry/list",
                },
              ]}
            />
            <PopupMenu
              label="Settings"
              iconName="pi pi-cog"
              submenuItems={[
                { label: "General Settings", to: "/settings/general" },
                { label: "Permissions", to: "/settings/permissions" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-6 mb-12 w-full">
            <div>
              <UserInfo />
            </div>
            <div>
              <div className="flex  flex-wrap gap-4">
                <HomeMenuButton
                  label="Dashboard"
                  iconName="pi pi-palette"
                  to="/dashboard"
                />

                <HomeMenuButton
                  label="Reports"
                  iconName="pi pi-chart-line"
                  to="/reports/reportViewer"
                />
              </div>
              <div className="w-full my-24">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                  Registers
                </h3>
                <div className="flex gap-4">
                  {assignedTerminals.map((t) => (
                    <HomeMenuButton
                      key={t.terminalId}
                      label={` ${t.terminalName}`}
                      iconName="pi pi-calculator"
                      to={`/register/${t.terminalId}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
