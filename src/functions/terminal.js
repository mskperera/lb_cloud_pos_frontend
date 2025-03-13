import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const getTerminalDetailslByTerminalId = async (terminalId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .get(
        `terminal/getTerminalDetailslByTerminalId?terminalId=${terminalId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            tenantid: tenantId,
          },
        }
      )
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
