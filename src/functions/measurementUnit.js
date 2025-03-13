import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

//const tenantId='00001';
  
export const getMeasurementUnits = async (payload) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`measurementUnits/get`,payload, {
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

  export const addMeasurementUnit = async (payload) => {
    try {
     const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .post(`measurementUnits`,payload, {
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

  export const updateMeasurementUnit = async (categoryId,payload) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .put(`measurementUnits/${categoryId}`,payload, {
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

  export const deleteMeasurementUnit = async (categoryId) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .delete(`measurementUnits/${categoryId}`, {
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