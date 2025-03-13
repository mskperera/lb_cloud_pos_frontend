import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

//const tenantId='00001';

  export const exPrintReceipt = async (payload) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();

      return await customAxios
        .post(`socket/sendPrint`,payload, {
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

