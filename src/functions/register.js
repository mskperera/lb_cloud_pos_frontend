import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

// const tenantId=localStorage.getItem('tenantId');
// const token=localStorage.getItem('token');

//const API = 'http://localhost:8000/api';
// export const getTicketStatusByTicketMasterId = async (categoryId) => {
//     try {
  
//       return await axios
//         .get(`${API}/getProducts`, {
//           headers: {
//             'Content-Type': 'application/json',
//             // "authorization":`Bearer ${token}`
//           },
//         })
//         .then((res) => {
//           return res.data;
//         })
//         .catch((err) => {
//           return err.response;
//         });
//     } catch (err) {
//       return err;
//     }
//   };

  export const getOrderReceipt = async (orderId) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();

      return await customAxios
        .get(`/order/getReceipt/${orderId}`, {
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


  export const getCategoryMenu = async (data) => {
    try {
     const tenantId = getTenantId();
    const token = getToken();
      return await customAxios
        .post(`/register/menu/category`, data, {
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

  
  export const addOrder = async (data) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .post(`/order/orderAdd`, data, {
          headers: {
            'Content-Type': 'application/json',
           // "authorization":`Bearer ${token}`
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
  

  export const getProducts = async (data) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .post(`/product/products`, data, {
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


  //products
  export const addProduct = async (data) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .post(`/product/add`, data, {
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

    export const updateProduct = async (id,data) => {
      try {
        const tenantId = getTenantId();
        const token = getToken();
        return await customAxios
          .put(`/product/update/${id}`, data, {
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
    

    export const deleteProduct = async (productId,isConfirm) => {
      try {
        const tenantId = getTenantId();
        const token = getToken();
        return await customAxios
          .delete(`/product/delete?productId=${productId}&isConfirm=${isConfirm}`, {
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

    export const voidOrder = async (data) => {
      try {
        const tenantId = getTenantId();
        const token = getToken();
        return await customAxios
          .post(`/order/voidOrder`, data, {
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