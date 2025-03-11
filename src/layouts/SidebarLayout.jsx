import { Outlet } from "react-router-dom";
import Sidebar from "../components/navBar/SideBar";

const SidebarLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
