import customAxios from "../utils/axios";

//const tenantId='00001';
const tenantId=localStorage.getItem('tenantId');
const token=localStorage.getItem('token');


  

  export const getContacts = async (data) => {
    try {
  
      return await customAxios
        .post(`/contacts/getContacts`, data, {
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


  export const addContact = async (data) => {
    try {
  
      return await customAxios
        .post(`/contacts/add`, data, {
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

    export const updateCustomer = async (id,data) => {
      try {
   
        return await customAxios
          .put(`/contacts/update/${id}`, data, {
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
    

    export const deleteCustomer = async (id,isConfirm) => {
      try {
    
        return await customAxios
          .delete(`/contacts/delete?contactId=${id}&isConfirm=${isConfirm}`, {
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








    