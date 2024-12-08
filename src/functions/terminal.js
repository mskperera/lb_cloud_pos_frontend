import customAxios from "../utils/axios";

//const tenantId='00001';
const tenantId=localStorage.getItem('tenantId');
const token=localStorage.getItem('token');

  
  export const getTerminalDetailslByTerminalId = async (terminalId) => {
    try {
  
      return await customAxios
        .get(`terminal/getTerminalDetailslByTerminalId?terminalId=${terminalId}`, {
          headers: {
            'Content-Type': 'application/json',
            "authorization":`Bearer ${token}`,
           'tenantid':tenantId
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


  export const getFrontendIdByTerminalId = async (terminalId) => {
    try {
  
      return await customAxios
        .get(`terminal/getFrontendIdByTerminalId?terminalId=${terminalId}`, {
          headers: {
            'Content-Type': 'application/json',
            "authorization":`Bearer ${token}`,
           'tenantid':tenantId
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