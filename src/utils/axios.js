// utils/axios.js
import axios from 'axios';

const customAxios = axios.create({
  baseURL:process.env.REACT_APP_API_PATH, // Your base URL
});

 console.log('process.env REACT_APP_API_PATH',process.env.REACT_APP_API_PATH)
customAxios.interceptors.request.use(
    function (config) {

    const token=localStorage.getItem('token');
      config.headers.Authorization =`Bearer ${token}`;
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
  
  customAxios.interceptors.response.use(
    function (response) {
        console.log('custom axios res',response)
      return response;
    },
    function (error) {
      console.log('axios.interceptors.resl** staus', error.request.status);
    
    
      if (error.request.status ===401) {
    //    window.location.href = '/login';
       }
      
    
       if (error.response.data.name === 'JsonWebTokenError') {
      //  window.location.href = '/login';
       }
    
       if (error.response.data.name === 'TokenExpiredError') {
        console.log('axios.interceptors.resl**', error.response.data);
       // refreshAccessToken();
       //  window.location.href = '/login';
       }
      return Promise.reject(error);
    }
  );

export default customAxios;