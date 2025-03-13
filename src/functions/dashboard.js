import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";
  
export const getDashboardDetails = async (payload) => {
  try {
     const tenantId = getTenantId();
      const token = getToken();

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