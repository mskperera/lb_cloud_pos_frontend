// src/functions/axiosClient.js
import axios from 'axios';
import { loadAppConfig } from '../utils/tauri/appConfig';


const axiosInstance = axios.create();

// Attach the dynamic base URL before every request
axiosInstance.interceptors.request.use(async (config) => {
  const appConfig = await loadAppConfig();
  config.baseURL = appConfig.REACT_APP_API_PATH;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;