import { Outlet } from "react-router-dom";
import TopMenubar from "../components/navBar/TopMenubar";
import Sidebar from "../components/navBar/SideBar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenubar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pt-16 ml-60">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
