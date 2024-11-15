import { useEffect, useState } from "react";
import { getStoresDrp } from "../../../functions/dropdowns";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            <span className="label-text">Store</span>
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
          className="p-2 bg-blue-500 text-white rounded-md mt-10"
          onClick={handleAddStore}
        >
          Add Store
        </button>
      </div>

      {/* Stores list with remove button */}
      <div className="flex flex-wrap gap-5 mt-10">
        {stores.map((item) => (
          <div
            key={item.storeId}
            className="flex justify-between items-center bg-slate-100 p-2 gap-3 h-10 rounded-md"
          >
            <div>{item.storeName}</div>
            <button
            type="button"
              className="btn btn-error btn-xs bg-[#f87171] text-base-100"
              onClick={() => handleRemoveStore(item.storeId)}
              aria-label="Delete"
              title="Remove Store"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoresComponent;
