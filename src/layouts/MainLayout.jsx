import { Outlet, useNavigate } from "react-router-dom";
import TopMenubar from "../components/navBar/TopMenubar";
import Sidebar from "../components/navBar/SideBar";
import MobileMenu from "../components/navBar/MobileMenu";
import { useEffect, useState } from "react";
import { isSystemDataExists } from "../functions/systemSettings";

const MainLayout = () => {
  const navigate = useNavigate();
  const userinfo=JSON.parse(localStorage.getItem('user'));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleSidebar = (collapsed) => {
    console.log('MainLayout: Setting sidebar collapsed to:', collapsed);
    setIsSidebarCollapsed(collapsed);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(()=>{
    loadSystemData();
  },[])

const loadSystemData=async()=>{
  const result=await isSystemDataExists();

  const {isExists}=result.data.outputValues;
  if(userinfo!==null){
    console.log('kkkkk',isExists);
    if(isExists===0){
      const systemInit_SystemInfoData=result.data.results[0][0];
      const systemInit_Company=result.data.results[1][0];
      console.log('systemInfoData',result.data.results[0][0]);
      console.log('systemInit_Company',systemInit_Company);
     
      if(systemInit_SystemInfoData)
   localStorage.setItem('systemInit_SystemInfoData',JSON.stringify(systemInit_SystemInfoData));
   
   if(systemInit_Company)
   localStorage.setItem('systemInit_Company',JSON.stringify(systemInit_Company));

    navigate('/systemDataInitialization');   

    }
  }

}

  
  return (
    <div className="flex flex-col">
      <TopMenubar
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleMobileMenu={handleToggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />
        </div>
        <main className={`flex-1 mt-16 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} transition-all duration-300`}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Fullscreen Menu */}
      {isMobileMenuOpen && (
        <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default MainLayout;
