import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrinterConnetion from '../PrinterConnetion';
import ProfileMenu from '../ProfileMenu';
import Syncing from '../Syncing';
import Alert from '../Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { getSelectedStore } from '../../functions/store';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStore } from '../../state/store/storeSlice';
import io from "socket.io-client";

const Store=({store})=>(
  <div className='flex justify-start gap-1 items-center mb-1 hover:bg-slate-100 rounded-lg px-2 cursor-pointer'>
<FontAwesomeIcon icon={faStore} style={{ fontSize: '1.5rem' }} />
 {store && <div className='mt-4'>{`${store.storeCode} | ${store.storeName}`}</div>}
 </div>
)
export default function TopMenubar() {
  const navigate = useNavigate();


  const [messages, setMessages] = useState([]);
  const [frontendId, setFrontendId] = useState("3jkfsjl"); // Example ID

  const { selectedStore } = useSelector((state) => state.store);


  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish socket connection
    const newSocket = io("http://localhost:5112", {
      transports: ["websocket"], // Use WebSocket transport
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

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const connectFrontend = (socketInstance) => {
    console.log("Attempting to emit connectFrontendToTheService");
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit("connectFrontendToTheService", { frontendId });
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


 const dispatch = useDispatch();

   useEffect(() => {
    if(!selectedStore){

      const store = JSON.parse(localStorage.getItem('selectedStore'));
      dispatch(setSelectedStore({ selectedStore:store }));
      
    }
  }, []);




  return (
    <div className="navbar fixed top-0 left-0 w-full bg-base-100 shadow-md z-10 px-4 gap-2 m-0 p-0">
      <div className="flex justify-between items-center w-full m-0 p-0">
        <div className="flex items-center gap-4 m-0 p-0">
          <i className="pi pi-calculator text-2xl"></i>
          <h3 className="text-lg font-bold">LBPOS</h3>
        </div>
        <button
          onClick={connectFrontend}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Connect Frontend
        </button>
        <div className="flex items-center gap-4 m-0 p-0">
       
     {JSON.stringify(messages)}

          <div className="flex items-center gap-5 m-0 p-0">
         
      {selectedStore &&  <Store store={selectedStore}/>}
          <button
            className=" flex items-center btn btn-ghost text-gray-600 p-0 m-0 hover:bg-transparent hover:text-primaryColorHover"
            onClick={() => navigate('/home')}
          >
            <i className="pi pi-th-large text-xl"></i>
            {/* <span className="">Main Menu</span> */}
          </button>
            <PrinterConnetion printerConnected={false} />
            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
