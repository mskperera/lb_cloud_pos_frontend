import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { setTitle } from '../../state/navBar/navBarSlice';
import { useDispatch } from 'react-redux';
import './home.css'
import { Button } from 'primereact/button';


  const HomeMenuButton = ({ to, label, iconName }) => {
    const navigate=useNavigate();

    return (
      <Button onClick={()=>{
        navigate(to);
      }} text  rounded >
   
          <div className="home-menu-button">
            <i className={`${iconName}`}></i>
            <p >
              {label}
            </p>
      
        </div>
      </Button>
    );
  };
  
  
const Home=()=>{

 // const dispatch=useDispatch();
  useEffect(()=>{

 // dispatch(setTitle(null))
  },[])

    return (

      <div className='home-container'>
  <h1 className='home-title'>Home Menu</h1>
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