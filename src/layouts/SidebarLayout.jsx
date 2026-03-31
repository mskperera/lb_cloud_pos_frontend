import { Outlet } from "react-router-dom";
import Sidebar from "../components/navBar/SideBar";
import { useState } from "react";

const SidebarLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} />
      <main className={`flex-1 p-4 ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
