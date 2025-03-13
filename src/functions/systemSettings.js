import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const initializeSystemData = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`/initializeSystemData`, data, {
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

export const isSystemDataExists = async () => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/isSystemDataExists`, {
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
