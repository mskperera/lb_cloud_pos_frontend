import customAxiosMain from "../utils/axiosMain";


    export const getTimezones = async () => {
    try {

      return await customAxiosMain
        .get(`/dropdown/timezones`, {
          headers: {
            'Content-Type': 'application/json',
          // "authorization":`Bearer ${token}`,
        //   'tenantid':tenantId
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


  export const getCountries = async () => {
    try {
     
      return await customAxiosMain
        .get(`/dropdown/countries`, {
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


    export const getLanguages = async () => {
    try {
     
      return await customAxiosMain
        .get(`/dropdown/languages`, {
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
