
import customAxios from "../utils/axios";

//const tenantId='00001';
const tenantId=localStorage.getItem('tenantId');
const token=localStorage.getItem('token');



export const getSelectedStore = () => {
  try {
    const store = JSON.parse(localStorage.getItem('selectedStore'));
    if (store && store.storeCode && store.storeName) {
      return store; // Return the store if valid
    }
    console.warn('Invalid store format in localStorage');
    return null; // Return null if properties are missing
  } catch (err) {
    console.error('Error retrieving store from localStorage:', err);
    return null;
  }
};

export const setUserAssignedStores=async(userId)=>{

  const userAssignedStores=await getUserAssignedStores(userId);
  localStorage.setItem('stores',JSON.stringify(userAssignedStores.data));

}

 const getUserAssignedStores = async (userId) => {
  try {

    return await customAxios
      .get(`/stores/getUserAssignedStores?userId=${userId}`, {
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