import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './home.css'
import { Button } from 'primereact/button';
import WebSocketClient from '../../components/WebSocketClient';


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


  const [assignedTerminals,setAssignedTerminals]=useState( 
    [
    {
        terminalId: 1,
        terminalName: "Testing Terminal 1"
    }
]
)

    return (

      <div className='home-container'>
  <h2 className='text-4xl'>Home Menu</h2>
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
<WebSocketClient clientId="00001-1" />

      </div>
 
    )
  }

export default Home