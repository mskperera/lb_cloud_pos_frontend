import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";
  
export const getCategories = async (payload) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`categories/get`,payload, {
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

  export const addCategory = async (payload) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();

      return await customAxios
        .post(`categories`,payload, {
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

  export const updateCategory = async (categoryId,payload) => {
    try {
   const tenantId = getTenantId();
      const token = getToken();

      return await customAxios
        .put(`categories/${categoryId}`,payload, {
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

  export const deleteCategory = async (categoryId) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();

      return await customAxios
        .delete(`categories/${categoryId}`, {
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

  export const getFrontendIdByTerminalId = async (terminalId) => {
    try {
      const tenantId = getTenantId();
      const token = getToken();

      return await customAxios
        .get(`terminal/getFrontendIdByTerminalId?terminalId=${terminalId}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            tenantid: tenantId,
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