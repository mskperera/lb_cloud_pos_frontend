import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const getSessionEnd = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .post(`session/end/get`, data, {
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

export const endSession = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`session/end`, data, {
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

export const startSession = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`session/start`, data, {
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

export const getLatestSessionDetails = async (terminalId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`session/getLatestSessionDetails?terminalId=${terminalId}`, {
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
