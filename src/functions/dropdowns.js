import customAxios from "../utils/axios";

const tenantId=localStorage.getItem('tenantId');
//const API = 'http://localhost:8000/api';
const token=localStorage.getItem('token');

  export const getDrpdownCategory = async () => {
    try {
  
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