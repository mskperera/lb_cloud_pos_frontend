import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const getUserRegistrations = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/userRegistrations/get`, data, {
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

export const addUserRegistrations = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/userRegistrations`, data, {
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

export const updateUserRegistrations = async (id, data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .put(`/userRegistrations/${id}`, data, {
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

export const deleteUserRegistrations = async (id) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .delete(`/userRegistrations?userId=${id}`, {
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