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
        .get(`/dropdown/getCategories`, {
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
        .get(`/dropdown/getMeasurementUnits`, {
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


  export const getDrpSession = async () => {
    try {
      const tenantId = getTenantId();
      const token = getToken();
      return await customAxios
        .get(`/dropdown/getDrpSession`, {
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