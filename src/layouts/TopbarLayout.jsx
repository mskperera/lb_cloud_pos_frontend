import { Outlet } from "react-router-dom";
import TopMenubar from "../components/navBar/TopMenubar";

const TopbarLayout = () => {
  return (
    <div className="flex flex-col ">
      <TopMenubar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default TopbarLayout;