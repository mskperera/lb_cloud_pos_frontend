import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const initializeSystemData = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`/initializeSystemData`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const isSystemDataExists = async () => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/isSystemDataExists`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

 const getSystemInfo = async () => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/systemInfo/getSystemInfo`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};


export const loadSystemInfoToLocalStorage=async()=>{
  
  const systeminfo=await getSystemInfo();
  console.log('systeminfo',systeminfo.data.results[0][0]);
  localStorage.setItem('systemInfo',JSON.stringify(systeminfo.data.results[0][0]));
}



export const getSystemInfoFromLocalStorage=()=>{
  
  const systeminfo=JSON.parse(localStorage.getItem('systemInfo'));
  return systeminfo;

}

