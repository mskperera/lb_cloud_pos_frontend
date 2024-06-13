import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './home.css'
import { Button } from 'primereact/button';


  const HomeMenuButton = ({ to, label, iconName }) => {
    const navigate=useNavigate();

    return (
      <button onClick={()=>{
        navigate(to);
      }} className='btn btn-lg bg-base-100 h-auto shadow-none p-1 border-none hover:bg-primaryColor hover:text-base-100' >
   
          <div className="flex flex-col align-middle p-4 text-lg ">
            <i className={`${iconName} text-2xl`}></i>
            <p >
              {label}
            </p>
      
        </div>

      </button>
    );
  };
  
  
const Home=()=>{


    return (

      <div className='home-container'>
  <h2 className='text-4xl'>Home Menu</h2>
  <div className='home-menu-container'>
  <HomeMenuButton  label="Register" iconName="pi pi-calculator" to="/register" />
  <HomeMenuButton  label="Customers" iconName="pi pi-users" to="/customers" />
  <HomeMenuButton  label="Products" iconName="pi pi-tags" to="/products" />
  <HomeMenuButton  label="Inventory" iconName="pi pi-chart-bar" />
  <HomeMenuButton  label="Settings" iconName="pi pi-cog" />
  <HomeMenuButton  label="Orders" iconName="pi pi-book" to="/ordersCompleted" />

  </div>


      </div>
 
    )
  }

export default Home