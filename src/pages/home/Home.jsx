import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import WebSocketClient from '../../components/WebSocketClient';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStore } from '../../state/store/storeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faStore } from '@fortawesome/free-solid-svg-icons';

  const HomeMenuButton = ({ to, label,label2, iconName }) => {


    const navigate=useNavigate();

    return (
      <button onClick={()=>{
        navigate(to);
      }} className='btn btn-lg bg-base-100 h-auto shadow-none p-1 border-none hover:bg-primaryColor hover:text-base-100' >
   
          <div className="flex flex-col align-middle p-4 text-lg ">
            <i className={`${iconName} text-2xl`}></i>
            <span >
              {label}
            </span>
          {label2 &&  <span >
              {label2}
            </span>}
      
        </div>

      </button>
    );
  };
  
  



  
const Home=()=>{

  const dispatch = useDispatch();

  const [assignedTerminals, setAssignedTerminals] = useState([
    {
      terminalId: 1,
      terminalName: "Testing Terminal 1",
    },
  ]);

  const selctedStore=JSON.parse(localStorage.getItem('selectedStore'));
  const store = JSON.parse(localStorage.getItem('stores'))[0];
  const [assignedStores,setAssignedStores]=useState([store]);
  const [selectedStoreId, setSelectedStoreId] = useState(assignedStores[0].storeId);

  const [isSelectedStoreApplied, setIsSelectedStoreApplied] = useState(false);

  const handleStoreSelect = (e) => {
    setSelectedStoreId(e.target.value);
  };

const storeSelectHandler=()=>{
  setIsSelectedStoreApplied(selectedStoreId?true:false);
  const store = assignedStores.find(s => s.storeId ===parseInt(selectedStoreId));
  if (store) {
    dispatch(setSelectedStore({ selectedStore:store }));
    localStorage.setItem('selectedStore', JSON.stringify(store));
  } else {
    console.error('No matching store found for the selectedStoreId:', selectedStoreId);
  }

}

const Stores = () => {
  return (
    <div
      className="flex flex-col gap-10 items-center justify-center mt-28"
    >
    <div className="flex justify-start gap-1 items-center">
          <FontAwesomeIcon icon={faStore} style={{ fontSize: "2rem" }} />
          <h2 className="text-2xl font-bold pt-1">Select your store</h2>
        </div>

      <div className="flex flex-col justify-between gap-5">
        <select
          value={selectedStoreId}
          style={{ margin: 0 }}
          onChange={handleStoreSelect}
          className="select select-bordered w-full max-w-xs"
        >
          {assignedStores.map((c) => (
            <option key={c.storeId} value={c.storeId}>
              {c.storeCode} | {c.storeName}
            </option>
          ))}
        </select>

        <button
          onClick={storeSelectHandler}
          type="button"
          className="btn shadow-none py-4 px-10 rounded-lg border-none bg-primaryColor text-base-100"
        >
          <span className="px-2">Continue</span>
        </button>
      </div>
    </div>
  );
};




    return (
<>
{!selctedStore ? Stores() :

<div className="flex flex-col gap-10 items-center justify-center mt-28">
<div className="flex justify-start gap-1 items-center">
          <FontAwesomeIcon icon={faHome} style={{ fontSize: "2rem" }} />
          <h2 className="text-2xl font-bold pt-1">Home Menu</h2>
        </div>
  <div className='home-menu-container'>
  <HomeMenuButton  label="Customers" iconName="pi pi-users" to="/customers" />
  <HomeMenuButton  label="Products" iconName="pi pi-tags" to="/products" />
  <HomeMenuButton  label="Inventory" iconName="pi pi-chart-bar" />
  <HomeMenuButton  label="Settings" iconName="pi pi-cog" />
  <HomeMenuButton  label="Orders" iconName="pi pi-book" to="/ordersCompleted" />

  </div>


  <div className='home-menu-container'>
{assignedTerminals.map(t=>(
  <HomeMenuButton  label={`Register`} label2={`${t.terminalName} `} iconName="pi pi-calculator" to={`/register/${t.terminalId}`} />
))}

  </div>
{/* <WebSocketClient clientId="00001-1" /> */}

      </div>}
      </>
    )
  }

export default Home