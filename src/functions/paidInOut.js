import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

const getHeaders = () => ({
  "Content-Type": "application/json",
  authorization: `Bearer ${getToken()}`,
  tenantid: getTenantId(),
});

export const getPaidInOutLogs = async (data) => {
  try {
    return await customAxios.post(`/paid-in-out/get`, data, { headers: getHeaders() });
  } catch (err) { return err.response; }
};

export const addPaidInOutLog = async (data) => {
  try {
    return await customAxios.post(`/paid-in-out`, data, { headers: getHeaders() });
  } catch (err) { return err.response; }
};

export const updatePaidInOutLog = async (id, data) => {
  try {
    return await customAxios.put(`/paid-in-out/${id}`, data, { headers: getHeaders() });
  } catch (err) { return err.response; }
};

export const deletePaidInOutLog = async (id, isConfirm) => {
  try {
    return await customAxios.delete(`/paid-in-out?id=${id}&isConfirm=${isConfirm}`, { headers: getHeaders() });
  } catch (err) { return err.response; }
};