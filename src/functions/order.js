import customAxios from "../utils/axios";

const tenantId=localStorage.getItem('tenantId');
const token=localStorage.getItem('token');


  

  export const getOrders = async (data) => {
    try {
  
      return await customAxios
        .post(`/order/getOrders`, data, {
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


  export const getOrderFull = async (payload) => {
    try {
  
      return await customAxios
        .post(`/order/getOrderFull`,payload, {
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
  