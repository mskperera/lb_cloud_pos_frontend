import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";


export const getProducts = async (storeId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
    .get(`/reports/getProducts?storeId=${storeId}`,{
        headers: {
          'Content-Type': 'application/json',
          "authorization":`Bearer ${token}`,
         'tenantid':tenantId
        },
      })
      .then((res) => {
        console.log('getProducts axios',res)
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};




export const getDailySalesDetails = async (storeId,sessionId,utcOffset) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
    .get(`/reports/getDailySalesDetails?storeId=${storeId}&sessionId=${sessionId}&utcOffset=${utcOffset}`,{
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


export const getMonthlySalesDetails = async (storeId,year,month) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
    .get(`/reports/getMonthlySalesDetails?storeId=${storeId}&year=${year}&month=${month}`,{
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

    

export const getDailySalesSummary = async (storeId,startDate,endDate) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
    .get(`/reports/getDailySalesSummary?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`,{
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



export const getInventoryOnHand = async (storeId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
    .get(`/reports/getInventoryOnHand?storeId=${storeId}`,{
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



export const getLowStockReport = async (storeId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
    .get(`/reports/getLowStockReport?storeId=${storeId}`,{
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