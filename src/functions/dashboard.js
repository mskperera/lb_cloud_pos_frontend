import customAxios from "../utils/axios";

//const tenantId='00001';
const tenantId=localStorage.getItem('tenantId');
const token=localStorage.getItem('token');

  
export const getDashboardDetails = async (payload) => {
  try {

    return await customAxios
      .post(`dashboard`,payload, {
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