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