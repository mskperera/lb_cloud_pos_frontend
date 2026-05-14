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
          localStorage.removeItem('selectedStore');
          localStorage.removeItem('systemInfo');

          localStorage.removeItem('assignedTerminals');
          localStorage.removeItem('stores');

          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    } catch (err) {
      return err;
    }
  };


  
  export const getAuthInfo = async () => {
    try {
  
      const userinfo=localStorage.getItem('user');
      return JSON.parse(userinfo);
     
    } catch (err) {
      return err;
    }
  };


  



   export const resetForgotPassword = async (data) => {
    try {
     
      //  resetForgotPassword is use to reset the account password by verifying the verification code
      // payload data={
//    "userName":"spmskperera@gmail.com", 
//    "password":"1234",
//    "verificationCode":"2ae706"

// }

      return await customAxiosMain
        .post(`/auth/reset-forgot-password`,data, {
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



     export const resetForgotPasswordVerify = async (data) => {
    try {
     
      //  resetForgotPassword is used to send a verification code to the users email
      //  payload data={
 //  "userName":"spmskperera@gmail.com"

//}

      return await customAxiosMain
        .post(`/auth/reset-forgot-password-verify`,data, {
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

