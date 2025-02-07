import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

// const tenantId=localStorage.getItem('tenantId');
// const token=localStorage.getItem('token');
//const API = 'http://localhost:8000/api';


  export const getDrpdownCategory = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/categories/dropdown`, {
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
  
  export const getDropdownMeasurementUnit = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/measurementUnits/dropdown`, {
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


  export const getDropdownDepartments = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getDepartments`, {
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

  export const getDropdownBrands = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getBrands`, {
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

  export const getDrpdownOrderVoidingReason = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getOrderVoidingReason_dropdown`, {
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

  export const getDrpdownStockEntryVoidingReason = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getDrpdownStockEntryVoidingReason`, {
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
  

  export const getDrpSession = async (descOrder='asc',storeId=null) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getDrpSession?descOrder=${descOrder}&storeId=${storeId}`, {
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

  export const getTeminallByUserId = async (userId) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getTeminallByUserId?userId=${userId}`, {
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


  export const getProductTypesDrp = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getProductTypes`, {
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

  export const getVariationTypesDrp = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getVariationTypes`, {
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



  export const getStoresDrp = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getStores`, {
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


  export const getContactTypes = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getContactTypes`, {
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


  export const getSuppliers = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/suppliers`, {
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

  export const getCustomers = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/customers`, {
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

  export const getAdjustmentReasons = async (adjustmentTypeId) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getAdjustmentReasons?adjustmentTypeId=${adjustmentTypeId}`, {
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

