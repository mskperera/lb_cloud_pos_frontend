import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const getContacts = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`/contacts/get`, data, {
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

export const addContact = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`/contacts`, data, {
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

export const updateCustomer = async (id, data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .put(`/contacts/${id}`, data, {
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

export const deleteCustomer = async (id, isConfirm) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .delete(`/contacts?contactId=${id}&isConfirm=${isConfirm}`, {
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
