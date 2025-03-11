import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";


 
export const stockAdd = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/stock/stockAdd`, data, {
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

export const getStockEntries = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/stock/stockEntries`, data, {
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

export const getStockEntryFull = async (stockEntryId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/stock/getStockEntryFull?stockEntryId=${stockEntryId}`, {
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

export const voidStockEntry = async (stockEntryId,voidingReasonId) => {
  try {
    
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/stock/stockEntry_void?stockEntryId=${stockEntryId}&voidingReasonId=${voidingReasonId}`, {
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


export const getStockInfo = async (inventoryId,showZeroStockQtyData) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/stock/getStockInfo?inventoryId=${inventoryId}&showZeroStockQtyData=${showZeroStockQtyData}`, {
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

export const stockAdjust = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/stock/stockAdjust`, data, {
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



export const getStockAdjustments = async (stockBatchId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/stock/getStockAdjustments?stockBatchId=${stockBatchId}`, {
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


export const updatePrice = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/stock/updatePriceCost`, data, {
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

export const getPriceChange = async (stockBatchId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/stock/getPriceChange?stockBatchId=${stockBatchId}`, {
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



export const releaseStockBatch = async (stockBatchId,stopRelease) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/stock/releaseStockBatch`, {stockBatchId,stopRelease}, {
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

export const getInventoryTransactionHistory = async (payload) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/stock/getInventoryTransactionHistory`, payload, {
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