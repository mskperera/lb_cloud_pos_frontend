import customAxios from "../utils/axios";
import customAxiosMain from "../utils/axiosMain";
import { getTenantId, getToken } from "./authService";


  export const signupForAccount = async (data) => {
    try {
     
      return await customAxiosMain
        .post(`/auth/verify-signup`,data, {
          headers: {
            'Content-Type': 'application/json',
         //  "authorization":`Bearer ${token}`,
         //  'tenantid':tenantId
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



  export const createAccount = async (data) => {
    try {
     
      return await customAxiosMain
        .post(`/operational/initializeDbAndConnection`,data, {
          headers: {
            'Content-Type': 'application/json',
         //  "authorization":`Bearer ${token}`,
         //  'tenantid':tenantId
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


    export const completeSignup = async (data) => {
    try {
     
      return await customAxiosMain
        .post(`/auth/complete-signup`,data, {
          headers: {
            'Content-Type': 'application/json',
         //  "authorization":`Bearer ${token}`,
         //  'tenantid':tenantId
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


      export const verifyEmail = async (data) => {
    try {
     
      return await customAxiosMain
        .post(`/auth/verify-email`,data, {
          headers: {
            'Content-Type': 'application/json',
         //  "authorization":`Bearer ${token}`,
         //  'tenantid':tenantId
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

 export const getSystemInfo = async () => {
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
  const sysInfo=systeminfo.data.results[0][0];
  console.log('loadSystemInfoToLocalStorage',sysInfo);
  if(sysInfo)
  localStorage.setItem('systemInfo',JSON.stringify(sysInfo));
}






export const getSystemInfoFromLocalStorageOpti = async () => {
  await loadSystemInfoToLocalStorage(); // wait for system info to load
  const systeminfo =localStorage.getItem('systemInfo') ? JSON.parse(localStorage.getItem('systemInfo')):null;
  return systeminfo;
};



export const getSystemInfoFromLocalStorage=()=>{
  
  const systeminfo=JSON.parse(localStorage.getItem('systemInfo'));
  return systeminfo;

}

