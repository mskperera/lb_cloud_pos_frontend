
// TopMenubar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStore } from '../../state/store/storeSlice';
import { FaCompress, FaExpand, FaStore } from 'react-icons/fa';
import { Menu } from 'lucide-react';
import logoFull from '../../assets/pos_logo_long_inv.png';   // full horizontal logo
import logoShort from '../../assets/pos_logo_long_inv.png';    // ← add this: small square/icon version

import ProfileMenu from '../ProfileMenu';
// import PrinterConnection from '../PrinterConnection';
import Alert from '../Alert';
import Syncing from '../Syncing';

const StoreButton = ({ store, navigate }) => (
  <button
    className="flex items-center gap-1.5 text-white hover:bg-sky-700/50 rounded px-2.5 py-1.5 transition"
    onClick={() => navigate('/selectStore')}
    title="Change Store"
  >
    <FaStore className="text-lg" />
    {store && (
      <span className="text-sm font-medium ">
        {store.storeName}
      </span>
    )}
  </button>
);

export default function TopMenubar({ onToggleSidebar, isSidebarCollapsed, onToggleMobileMenu, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedStore } = useSelector((state) => state.store);

  const [isFullScreen, setIsFullScreen] = useState(false);


const [store, setStore] = useState(selectedStore);


  // Fullscreen toggle + detection
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) =>
        console.error("Fullscreen error:", err)
      );
    } else {
      document.exitFullscreen().catch((err) =>
        console.error("Exit fullscreen error:", err)
      );
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);

    // Fallback for F11 / browser fullscreen
    const checkF11 = () => {
      setIsFullScreen(window.innerHeight === window.screen.height);
    };
    window.addEventListener("resize", checkF11);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      window.removeEventListener("resize", checkF11);
    };
  }, []);

  // Load selected store from localStorage if not in Redux
  useEffect(() => {


    if (!selectedStore) {
      const stored = JSON.parse(localStorage.getItem('selectedStore'));
      if (stored) {
        dispatch(setSelectedStore({ selectedStore: stored }));
      }
    }
    else{
          const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
           setStore(selectedStore);
    }
  }, [selectedStore, dispatch]);

  const toggleSidebar = () => {
    onToggleSidebar(!isSidebarCollapsed);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1f649d] shadow-md h-14 md:h-16 flex items-center px-3 md:px-4 transition-all">
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">

        {/* Left section: Sidebar toggle (desktop) or Mobile menu (mobile) + Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-2 text-white hover:bg-sky-700/70 rounded-lg transition"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-white hover:bg-sky-700/70 rounded-lg transition"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo - full on md+, short/icon on smaller */}
          <div className="flex items-center">
            <img
              src={logoFull}
              alt="Legend POS"
              className="h-7 md:h-8 hidden md:block"
            />
            {/* <img
              src={logoShort}           // ← prepare this asset (32×32 or similar)
              alt="LP"
              className="h-8 w-8 md:hidden object-contain"
            /> */}
          </div>
        </div>

        {/* Right section: Controls + User */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">

          {/* Fullscreen toggle – icon only on mobile */}
          <button
            onClick={toggleFullScreen}
            className="p-2 text-white hover:bg-sky-700/70 rounded-lg transition flex items-center gap-1.5"
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? (
              <FaCompress className="text-xl" />
            ) : (
              <FaExpand className="text-xl" />
            )}
            <span className="text-sm font-medium hidden sm:inline">
              {isFullScreen ? "Exit" : "Full Screen"}
            </span>
          </button>

          {/* Store selector – name hidden on very small screens */}
          {store && (
            <StoreButton store={store} navigate={navigate} />
          )}

          {/* Status indicators & Profile – keep compact */}
          <div className="flex items-center gap-2 md:gap-5 sm:gap-10">
            {/* <PrinterConnection status={yourStatus} /> */}
            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
















// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import ProfileMenu from '../ProfileMenu';
// import Syncing from '../Syncing';
// import Alert from '../Alert';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSelectedStore } from '../../state/store/storeSlice';
// // import io from "socket.io-client";
// import PrinterConnection from '../PrinterConnetion';
// import { getFrontendIdByTerminalId, getPrintdeskByTerminalId } from '../../functions/terminal';
// import { setPrinterList } from '../../state/printer/printerSlice';
// import { FaCompress, FaExpand, FaStore, FaTh } from 'react-icons/fa';
// import { HomeIcon, Menu, PanelLeft, PanelLeftClose } from 'lucide-react';
// import logo from '../../assets/pos_logo_long_inv.png';

// const Store=({store,navigate})=>(
//   <button className='flex justify-start gap-1 items-center mb-1 text-white  rounded-lg px-2 cursor-pointer' 
//   onClick={()=>{
//     navigate('/selectStore')
//   }}>
//     <FaStore className='text-lg' />
// {/* <FontAwesomeIcon icon={faStore} style={{ fontSize: '1.5rem' }} /> */}
//  {store && <div className='mt-1'>{`${store.storeName}`}</div>}
//  </button>
// )
// export default function TopMenubar({ onToggleSidebar, isSidebarCollapsed }) {
//   const navigate = useNavigate();

//   const location = useLocation();
//   const { id } = useParams(); 

//   const dispatch = useDispatch();


//   const [messages, setMessages] = useState([]);
//   //onst [printerList, setPrinterList] = useState([]);
//   const [printDeskInfo, setPrintDeskInfo] = useState(null); // Example ID

//   const [leftTerminal,setLeftTerminal]=useState(false);
//   // 3jkfsjl

//   const [isFullScreen, setIsFullScreen] = useState(false);

//   const toggleFullScreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().catch(err => {
//         console.error(`Error enabling fullscreen: ${err.message}`);
//       });
//     } else {
//       document.exitFullscreen().catch(err => {
//         console.error(`Error exiting fullscreen: ${err.message}`);
//       });
//     }
//   };

//   const toggleSidebar = () => {
//     console.log('Toggle sidebar clicked, current state:', isSidebarCollapsed);
//     onToggleSidebar(!isSidebarCollapsed);
//   };

//   useEffect(() => {
//     // Sync state when Fullscreen API is used
//     const handleChange = () => setIsFullScreen(!!document.fullscreenElement);
//     document.addEventListener("fullscreenchange", handleChange);

//     // Detect F11 fullscreen by comparing window & screen height
//     const checkF11 = () => {
//       if (window.innerHeight === window.screen.height) {
//         setIsFullScreen(true); // Browser fullscreen (F11)
//       } else if (!document.fullscreenElement) {
//         setIsFullScreen(false); // Normal mode
//       }
//     };
//     window.addEventListener("resize", checkF11);

//     return () => {
//       document.removeEventListener("fullscreenchange", handleChange);
//       window.removeEventListener("resize", checkF11);
//     };
//   }, []);


//   const { selectedStore } = useSelector((state) => state.store);
//   const [socket, setSocket] = useState(null);
//   const terminalId_l=localStorage.getItem('terminalId');


//   // const loadPrintdeskByTerminalId=async()=>{
//   //   console.log("terminalId_l",terminalId_l);
//   //   if(terminalId_l){
//   //   const terminalId=terminalId_l ? JSON.parse(terminalId_l):null;
//   //   const result=await getFrontendIdByTerminalId(terminalId);
//   //   console.log("getFrontendIdByTerminalId:", result);
//   //   localStorage.setItem("printdeskId",result.data.printdeskId);
//   //   setPrintDeskInfo(result.data);
//   //   }
//   // }
//   // useEffect(() => {
//   //   loadPrintdeskByTerminalId();
//   // },[terminalId_l]);



//   // useEffect(() => {
//   //   return () => {
//   //     if (location.pathname.startsWith("/register/")) {
//   //       console.log(`Leaving register page with ID: ${id}`);
//   //    // localStorage.removeItem('terminalId');
//   //     if(!terminalId_l)
//   //     connectSocket();
//   //     }
//   //   };
//   // }, [location.pathname, id,terminalId_l]);


//   // const connectSocket=async()=>{
//   //   console.log('llllllllllloooooooooooooooo')
//   //   const newSocket = io(process.env.REACT_APP_SOCKET_IO_URL, {
//   //     path: "/socket.io/",
//   //     transports: ["websocket"],
//   //   });

//   //   setSocket(newSocket);

//   //   newSocket.on("connect", () => {
//   //     console.log("Socket connected:", newSocket.id);
      
//   //     connectFrontend(newSocket);
//   //   });

//   //     newSocket.on("printConnectionStatus", (data) => {
//   //       setMessages(data);
//   //     });

//   //     newSocket.on("loadPrinterListToFrontend", (data) => {
//   //      // setPrinterList(data.printerList);

//   //       dispatch(setPrinterList({ printerList:data.printerList }));

//   //     });

//   //     newSocket.on("error", (error) => {
//   //       console.error("Socket Error:", error);
//   //     });


//   //   newSocket.on("disconnect", () => {
//   //     console.log("Socket disconnected.");
//   //   });

//   //   newSocket.on("connect_error", (err) => {
//   //     console.error("Connection error:", err.message);
//   //   });


//   //   newSocket.on("serverShutdown", ({ message }) => {
//   //     console.log(message);
//   //     setMessages({status:"serviceDisconnected"});
//   //   });

//   //   return () => {
//   //     newSocket.disconnect();
//   //   };
//   // }

//   // useEffect(() => {
//   //   connectSocket();
   
//   // }, [printDeskInfo,terminalId_l,leftTerminal]);

//   // const connectFrontend = (socketInstance) => {
//   //   console.log("Attempting to emit connectFrontendToTheService");
//   //   if (socketInstance && socketInstance.connected) {
//   //     socketInstance.emit("connectFrontendToTheService", { frontendId:printDeskInfo?.frontendId });
//   //   } else {
//   //     console.error("Socket is not connected!");
//   //   }
//   // };




  
//  // const [selectedStore,setSelectedStore]=useState(null);
//   // useEffect(() => {
//   //   const fetchStore = async () => {
//   //     const store = await getSelectedStore();
//   //     setSelectedStore(store);
//   //   };
//   //   fetchStore();
//   // }, []);

//  // const store = JSON.parse(localStorage.getItem('selectedStore'));


//    useEffect(() => {
//     if(!selectedStore){

//       const store = JSON.parse(localStorage.getItem('selectedStore'));
//       dispatch(setSelectedStore({ selectedStore:store }));
      
//     }
//   }, []);






//   // bg-slate-50 shadow-sm
//   return (

//     <nav className="navbar fixed top-0 left-0 w-full bg-[#1f649d]  gap-2 pt-3  h-16 z-50">
//       <div className="flex justify-between items-center w-full m-0 p-0 pr-5 pl-3">
//       <div className="flex justify-start gap-4">
//         <div className="flex justify-start items-center gap-2 m-0 p-0 ">
//           {/* <i className="pi pi-calculator text-2xl"></i> */}
//           {/* <h3 className="text-xl text-white font-bold">Legend POS</h3> */}
          
//              <button
//        onClick={toggleSidebar}
//        className={`p-2 text-white hover:bg-sky-700 rounded-md transition-colors duration-200 ${isSidebarCollapsed ? 'bg-transparent' : 'bg-transparent'}`}
//        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
//      >
//        <Menu className="w-6 h-6" />
//      </button>
     
//    <img src={logo} className='h-8' />

  
//         </div>

      
//           </div>
//         <div className="flex items-center gap-4 m-0 p-0">

//       <button
//       className="flex items-center ml-0 p-2 m-0 rounded-md text-white  hover:bg-sky-700"
//       onClick={toggleFullScreen}
//     >
//       {isFullScreen ? (
//         <>
//           <FaCompress className="text-xl" />
//           <span className="pl-1">Exit Full Screen</span>
//         </>
//       ) : (
//         <>
//           <FaExpand className="text-xl" />
//           <span className="pl-1">Full Screen</span>
//         </>
//       )}
//     </button>

//     {/* <button
//       className="flex items-center ml-0 p-2 m-0 rounded-md text-white  hover:bg-sky-700"
//       onClick={() => navigate('/home')}
//     >
//       <FaTh className="text-xl" />
//       <span className="pl-1">Home</span>
//     </button> */}


//      {/* {JSON.stringify(printDeskInfo)} */}

//           <div className="flex items-center gap-5 m-0 p-0">
             
//           {selectedStore &&  <Store store={selectedStore} navigate={navigate} />}
// <PrinterConnection status={messages.status} />


//             <Alert />
//             <Syncing />
//             <ProfileMenu />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
