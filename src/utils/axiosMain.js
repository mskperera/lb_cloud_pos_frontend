
import axios from 'axios';
import { getAppConfigValue } from './dotEnv';

const customAxiosMain = axios.create();

// Every request run aguvaga Base URL dynamic agi load agatte
customAxiosMain.interceptors.request.use(
  async (config) => {
    try {
      const dynamicUrl = await getAppConfigValue('REACT_APP_API_PATH_MAIN');
      config.baseURL = dynamicUrl;
    } catch (error) {
      console.error("Dynamic Base URL set maduvaga error bandide:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customAxiosMain;


// import axios from 'axios';

// const customAxiosMain = axios.create({
//   baseURL:process.env.REACT_APP_API_PATH_MAIN,
// });
// console.log('process.env customAxiosMain',process.env.REACT_APP_API_PATH_MAIN)

// export default customAxiosMain;