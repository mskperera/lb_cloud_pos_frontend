import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu';
import Syncing from '../Syncing';
import Alert from '../Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStore } from '../../state/store/storeSlice';
import io from "socket.io-client";
import PrinterConnection from '../PrinterConnetion';
import { getFrontendIdByTerminalId, getPrintdeskByTerminalId } from '../../functions/terminal';
import { setPrinterList } from '../../state/printer/printerSlice';

const Store=({store})=>(
  <div className='flex justify-start gap-1 items-center mb-1 hover:bg-slate-100 rounded-lg px-2 cursor-pointer'>
<FontAwesomeIcon icon={faStore} style={{ fontSize: '1.5rem' }} />
 {store && <div className='mt-1'>{`${store.storeName}`}</div>}
 </div>
)
export default function TopMenubar() {
  const navigate = useNavigate();

  const dispatch = useDispatch();


  const [messages, setMessages] = useState([]);
  //onst [printerList, setPrinterList] = useState([]);
  const [printDeskInfo, setPrintDeskInfo] = useState(null); // Example ID

  // 3jkfsjl

  const { selectedStore } = useSelector((state) => state.store);
  const [socket, setSocket] = useState(null);

  const loadPrintdeskByTerminalId=async()=>{

    const terminalId=JSON.parse(localStorage.getItem('terminalId'));
    const result=await getFrontendIdByTerminalId(terminalId);
    localStorage.setItem("printdeskId",result.data.printdeskId);
    setPrintDeskInfo(result.data);
  }
  useEffect(() => {
    loadPrintdeskByTerminalId();
  },[]);

  useEffect(() => {
    const newSocket = io("http://localhost:5112", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Log connection status
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      // Emit 'connectFrontendToTheService' when the socket connects
      connectFrontend(newSocket);
    });

      // Handle incoming messages
      newSocket.on("printConnectionStatus", (data) => {
        setMessages(data);
      });

      newSocket.on("loadPrinterListToFrontend", (data) => {
       // setPrinterList(data.printerList);

        //setPrinterList
       // console.log("loadPrinterListToFrontend:", data.printerList);

        dispatch(setPrinterList({ printerList:data.printerList }));

      });

      
      // Handle error events
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

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [printDeskInfo]);

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







  return (
    <div className="navbar fixed top-0 left-0 w-full bg-slate-50 shadow-sm z-10 px-4 gap-2 m-0 p-0">
      <div className="flex justify-between items-center w-full m-0 p-0">
        <div className="flex items-center gap-4 m-0 p-0">
          <i className="pi pi-calculator text-2xl"></i>
          <h3 className="text-lg font-bold">LBPOS</h3>
        </div>
       
        <div className="flex items-center gap-4 m-0 p-0">
       
     {/* {JSON.stringify(printDeskInfo)} */}

          <div className="flex items-center gap-5 m-0 p-0">
         
      {selectedStore &&  <Store store={selectedStore}/>}
          <button
            className=" flex items-center btn btn-ghost text-gray-600 p-0 m-0 hover:bg-transparent hover:text-primaryColorHover"
            onClick={() => navigate('/home')}
          >
            <i className="pi pi-th-large text-xl"></i>
            {/* <span className="">Main Menu</span> */}
          </button>

<PrinterConnection status={messages.status} />


            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
