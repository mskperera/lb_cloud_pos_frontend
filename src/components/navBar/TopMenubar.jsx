import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu';
import Syncing from '../Syncing';
import Alert from '../Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStore } from '../../state/store/storeSlice';
import io from "socket.io-client";
import PrinterConnection from '../PrinterConnetion';
import { getFrontendIdByTerminalId, getPrintdeskByTerminalId } from '../../functions/terminal';
import { setPrinterList } from '../../state/printer/printerSlice';
import { FaCompress, FaExpand, FaStore, FaTh } from 'react-icons/fa';

const Store=({store})=>(
  <div className='flex justify-start gap-1 items-center mb-1 text-white  rounded-lg px-2 cursor-pointer'>
    <FaStore className='text-lg' />
{/* <FontAwesomeIcon icon={faStore} style={{ fontSize: '1.5rem' }} /> */}
 {store && <div className='mt-1'>{`${store.storeName}`}</div>}
 </div>
)
export default function TopMenubar() {
  const navigate = useNavigate();

  const location = useLocation();
  const { id } = useParams(); 

  const dispatch = useDispatch();


  const [messages, setMessages] = useState([]);
  //onst [printerList, setPrinterList] = useState([]);
  const [printDeskInfo, setPrintDeskInfo] = useState(null); // Example ID

  const [leftTerminal,setLeftTerminal]=useState(false);
  // 3jkfsjl



  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error exiting fullscreen: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    // Sync state when Fullscreen API is used
    const handleChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);

    // Detect F11 fullscreen by comparing window & screen height
    const checkF11 = () => {
      if (window.innerHeight === window.screen.height) {
        setIsFullScreen(true); // Browser fullscreen (F11)
      } else if (!document.fullscreenElement) {
        setIsFullScreen(false); // Normal mode
      }
    };
    window.addEventListener("resize", checkF11);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      window.removeEventListener("resize", checkF11);
    };
  }, []);


  const { selectedStore } = useSelector((state) => state.store);
  const [socket, setSocket] = useState(null);
  const terminalId_l=localStorage.getItem('terminalId');

  const loadPrintdeskByTerminalId=async()=>{
    console.log("terminalId_l",terminalId_l);
    if(terminalId_l){
    const terminalId=terminalId_l ? JSON.parse(terminalId_l):null;
    const result=await getFrontendIdByTerminalId(terminalId);
    console.log("getFrontendIdByTerminalId:", result);
    localStorage.setItem("printdeskId",result.data.printdeskId);
    setPrintDeskInfo(result.data);
    }
  }
  useEffect(() => {
    loadPrintdeskByTerminalId();
  },[terminalId_l]);



  useEffect(() => {
    return () => {
      if (location.pathname.startsWith("/register/")) {
        console.log(`Leaving register page with ID: ${id}`);
     // localStorage.removeItem('terminalId');
      if(!terminalId_l)
      connectSocket();
      }
    };
  }, [location.pathname, id,terminalId_l]);


  const connectSocket=async()=>{
    console.log('llllllllllloooooooooooooooo')
    const newSocket = io(process.env.REACT_APP_SOCKET_IO_URL, {
      path: "/socket.io/",
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      
      connectFrontend(newSocket);
    });

      newSocket.on("printConnectionStatus", (data) => {
        setMessages(data);
      });

      newSocket.on("loadPrinterListToFrontend", (data) => {
       // setPrinterList(data.printerList);

        dispatch(setPrinterList({ printerList:data.printerList }));

      });

      newSocket.on("error", (error) => {
        console.error("Socket Error:", error);
      });


    newSocket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });


    newSocket.on("serverShutdown", ({ message }) => {
      console.log(message);
      setMessages({status:"serviceDisconnected"});
    });

    return () => {
      newSocket.disconnect();
    };
  }

  useEffect(() => {
    connectSocket();
   
  }, [printDeskInfo,terminalId_l,leftTerminal]);

  const connectFrontend = (socketInstance) => {
    console.log("Attempting to emit connectFrontendToTheService");
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit("connectFrontendToTheService", { frontendId:printDeskInfo?.frontendId });
    } else {
      console.error("Socket is not connected!");
    }
  };




  
 // const [selectedStore,setSelectedStore]=useState(null);
  // useEffect(() => {
  //   const fetchStore = async () => {
  //     const store = await getSelectedStore();
  //     setSelectedStore(store);
  //   };
  //   fetchStore();
  // }, []);

 // const store = JSON.parse(localStorage.getItem('selectedStore'));


   useEffect(() => {
    if(!selectedStore){

      const store = JSON.parse(localStorage.getItem('selectedStore'));
      dispatch(setSelectedStore({ selectedStore:store }));
      
    }
  }, []);






  // bg-slate-50 shadow-sm
  return (

    <nav className="navbar fixed top-0 left-0 w-full bg-sky-600 px-10 gap-2 pt-3  h-16 z-50">
      <div className="flex justify-between items-center w-full m-0 p-0">
      <div className="flex justify-start gap-4">
        <div className="flex items-center gap-4 m-0 p-0 w-[13rem]">
          {/* <i className="pi pi-calculator text-2xl"></i> */}
          <h3 className="text-xl text-white font-bold">Legend POS</h3>
     
        </div>

      
          </div>
        <div className="flex items-center gap-4 m-0 p-0">

      <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-white  hover:bg-sky-700"
      onClick={toggleFullScreen}
    >
      {isFullScreen ? (
        <>
          <FaCompress className="text-xl" />
          <span className="pl-1">Exit Full Screen</span>
        </>
      ) : (
        <>
          <FaExpand className="text-xl" />
          <span className="pl-1">Full Screen</span>
        </>
      )}
    </button>

    <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-white  hover:bg-sky-700"
      onClick={() => navigate('/home')}
    >
      <FaTh className="text-xl" />
      <span className="pl-1">Home</span>
    </button>


     {/* {JSON.stringify(printDeskInfo)} */}

          <div className="flex items-center gap-5 m-0 p-0">
             
          {selectedStore &&  <Store store={selectedStore}/>}
<PrinterConnection status={messages.status} />


            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
