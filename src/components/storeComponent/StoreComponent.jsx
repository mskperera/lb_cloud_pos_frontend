import { useEffect, useState } from "react";
import { getStoresDrp } from "../../functions/dropdowns";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const StoreItem=({onClick,store})=>{

  return (
  <div
    className="flex justify-between items-center p-3 border rounded-full gap-2 bg-gray-50"
  >
    <span className="text-gray-800 font-medium">{store.storeName}</span>
    <FontAwesomeIcon
      icon={faTrash}
      className="text-red-500 hover:text-red-700 cursor-pointer"
      onClick={onClick}
    />
  </div>
  
  )}
  

const StoresComponent = ({ stores, setStores }) => {
  const [selectedStoreId, setSelectedStoreId] = useState(0);
  const [storesOptions, setStoresOptions] = useState([]);

  // Load store options for the dropdown
  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions([...objArr.data.results[0]]);
  };

  useEffect(() => {
    loadDrpStores();
  }, []);

  // Handle adding a store to the list
  const handleAddStore = () => {
    if (selectedStoreId) {
      // Find the selected store object from storesOptions
      const selectedStore = storesOptions.find(store => store.id === selectedStoreId);
      
      // Add the store if it's not already in the list
      if (selectedStore && !stores.find(store => store.storeId === selectedStore.id)) {
        setStores([...stores, { storeId: selectedStore.id, storeName: selectedStore.displayName }]);
      }
      setSelectedStoreId(0); // Reset the dropdown after adding
    }
  };

  // Handle removing a store from the list
  const handleRemoveStore = (storeId) => {
    setStores(stores.filter((store) => store.storeId !== storeId));
  };

  return (
    <div className="flex justify-start gap-10 items-start rounded-md">
      {/* Dropdown and Add button */}
      <div className="flex justify-start gap-4 items-center">
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text text-lg">Store</span>
          </label>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(parseInt(e.target.value))}
            className="select select-bordered w-full"
          >
            <option value={0}>Select Store</option>
            {storesOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.displayName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="p-2 btn-primary text-white rounded-md mt-10"
          onClick={handleAddStore}
        >
          Add Store
        </button>
      </div>

      {/* Stores list with remove button */}
      <div className="flex flex-wrap gap-5 mt-10">
        {stores.map((item) => (
         
         <StoreItem  key={item.storeId} store={item} onClick={() => handleRemoveStore(item.storeId)} />
   
        ))}
      </div>
    </div>
  );
};

export default StoresComponent;
