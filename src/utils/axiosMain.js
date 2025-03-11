import axios from 'axios';

const customAxiosMain = axios.create({
  baseURL:process.env.REACT_APP_API_PATH_MAIN,
});
console.log('process.env customAxiosMain',process.env.REACT_APP_API_PATH_MAIN)

export default customAxiosMain;