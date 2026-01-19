import customAxiosMain from "../utils/axiosMain";



   export const removeTenancySetup = async (data) => {
    try {

      return await customAxiosMain
        .post(`/operational/removeTenancySetup`,data, {
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
  