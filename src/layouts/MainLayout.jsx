import { Outlet, useNavigate } from "react-router-dom";
import TopMenubar from "../components/navBar/TopMenubar";
import Sidebar from "../components/navBar/SideBar";
import { useEffect, useState } from "react";
import { isSystemDataExists } from "../functions/systemSettings";

const MainLayout = () => {
  const navigate = useNavigate();
  const userinfo=JSON.parse(localStorage.getItem('user'));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleToggleSidebar = (collapsed) => {
    console.log('MainLayout: Setting sidebar collapsed to:', collapsed);
    setIsSidebarCollapsed(collapsed);
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
      <TopMenubar onToggleSidebar={handleToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      <div className="flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />
        <main className={`flex-1 mt-16 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
