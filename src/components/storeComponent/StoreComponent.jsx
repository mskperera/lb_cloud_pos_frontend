import { useEffect, useState } from "react";
import { getStoresDrp } from "../../functions/dropdowns";
import DialogModel from "../model/DialogModel";
import GhostButton from "../iconButtons/GhostButton";
import { FaTrash } from "react-icons/fa";



const StoreItem=({onClick,store})=>{

  return (
  <div
    className="flex justify-between items-center p-3 border rounded-full gap-2 bg-gray-50"
  >
    <span className="text-gray-800 font-medium">{store.storeName}</span>
  <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer"    onClick={onClick} />

    {/* <FontAwesomeIcon
      icon={faTrash}
      className="text-red-500 hover:text-red-700 cursor-pointer"
      onClick={onClick}
    /> */}
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


  const handleAddStore = () => {
    if (selectedStoreId) {
      const selectedStore = storesOptions.find(store => store.id === selectedStoreId);

      if (selectedStore && !stores.find(store => store.storeId === selectedStore.id)) {
        setStores([...stores, { storeId: selectedStore.id, storeName: selectedStore.displayName }]);
      }
      setSelectedStoreId(0);
      setIsManageModalOpen(false);
    }
  };

  const handleRemoveStore = (storeId) => {
    setStores(stores.filter((store) => store.storeId !== storeId));
  };
  const [isManageModalOpen,setIsManageModalOpen]=useState(false);


  return (
    <div className="flex justify-start gap-10 items-start rounded-md">
      

      <DialogModel
                header={'Add Store'}
                visible={isManageModalOpen}
                maximizable
                onHide={() => {
                  setIsManageModalOpen(false);
                }}
            >
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
          </DialogModel>


          <div className="flex justify-between gap-4 items-center mt-10">

    <GhostButton
        onClick={() =>
         
          setIsManageModalOpen(true)
         
        }
        
        iconClass="pi pi-plus-circle text-lg"
          labelClass="text-md font-normal"
          label="Add Store"
        color="text-blue-500"
        hoverClass="hover:text-blue-700 hover:bg-transparent"
      />

      <div className="flex flex-wrap gap-5">
        {stores.map((item) => (
         
         <StoreItem  key={item.storeId} store={item} onClick={() => handleRemoveStore(item.storeId)} />
   
        ))}
      </div>
      </div>
    </div>
  );
};

export default StoresComponent;
