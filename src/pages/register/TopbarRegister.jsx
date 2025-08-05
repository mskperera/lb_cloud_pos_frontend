import { Outlet } from "react-router-dom";
import TopMenubar from "../../components/navBar/TopMenubar";

const TopbarRegister = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenubar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default TopbarRegister;