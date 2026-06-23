import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";


 
export const transferOrderAdd = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/transferOrder`, data, {
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

export const getTransferOrders = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/get/transferOrder`, data, {
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


export const getTransferOrderById = async (transferOrderId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/transferOrder/getById?transferOrderId=${transferOrderId}`, {
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


export const transferOrderReceive = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/transferOrder/receive`, data, {
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

