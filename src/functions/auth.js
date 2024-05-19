import customAxiosMain from "../utils/axiosMain";



  export const userLogin = async (data) => {
    try {
  
      return await customAxiosMain
        .post(`/auth/login`, data, {
          headers: {
            'Content-Type': 'application/json',
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


  export const logout = async (data) => {
    try {
  
      return await customAxiosMain
        .post(`/auth/logout`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
        
          localStorage.removeItem('token');
          localStorage.removeItem('tenantId');
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    } catch (err) {
      return err;
    }
  };


  