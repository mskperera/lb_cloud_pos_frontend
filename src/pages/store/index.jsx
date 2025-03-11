import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faChevronDown,faCashRegister } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../../state/store/storeSlice";
import { useNavigate } from "react-router-dom";

const SelectStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = JSON.parse(localStorage.getItem("stores"));
  const [assignedStores, setAssignedStores] = useState(store);
  const [selectedStoreId, setSelectedStoreId] = useState(
    assignedStores[0]?.storeId
  );

    const [isSelectedStoreApplied, setIsSelectedStoreApplied] = useState(false);
  

  const handleStoreSelect = (e) => {
    setSelectedStoreId(e.target.value);
  };

    const storeSelectHandler = () => {
      setIsSelectedStoreApplied(selectedStoreId ? true : false);
      const store = assignedStores.find(
        (s) => s.storeId === parseInt(selectedStoreId)
      );
      if (store) {
        dispatch(setSelectedStore({ selectedStore: store }));
        localStorage.setItem("selectedStore", JSON.stringify(store));
        navigate('/home');
      } else {
        console.error(
          "No matching store found for the selectedStoreId:",
          selectedStoreId
        );
      }
    };

  return(
    <>
  
  <div className="flex flex-col gap-10 items-center justify-center mt-28">
    <div className="flex justify-start gap-1 items-center mb-6">
      <FontAwesomeIcon icon={faStore} style={{ fontSize: "2rem" }} />
      <h2 className="text-2xl font-bold pt-1">Select your store</h2>
    </div>
    <div className="flex flex-col justify-between gap-5 w-full max-w-xs">
      <select
        value={selectedStoreId}
        onChange={handleStoreSelect}
        className="select select-bordered w-full max-w-xs"
      >
        {assignedStores?.map((c) => (
          <option key={c.storeId} value={c.storeId}>
            {c.storeCode} | {c.storeName}
          </option>
        ))}
      </select>
      <button
        onClick={storeSelectHandler}
        type="button"
        className="btn shadow-none py-4 px-10 rounded-lg border-none bg-primaryColor text-base-100 mt-4"
      >
        Continue
      </button>
    </div>
  </div>

</>
)

}

export default SelectStore;
