import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setSelectedStore } from "../../state/store/storeSlice";
import { useNavigate } from "react-router-dom";

const SelectStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = JSON.parse(localStorage.getItem("stores")) || [];
  const [assignedStores, setAssignedStores] = useState(store);
  const [selectedStoreId, setSelectedStoreId] = useState(
    store[0]?.storeId || ""
  );
  const [isSelectedStoreApplied, setIsSelectedStoreApplied] = useState(false);

  const handleStoreSelect = (e) => {
    setSelectedStoreId(e.target.value);
  };

  const storeSelectHandler = () => {
    if (!selectedStoreId) {
      console.error("No store selected");
      return;
    }
    setIsSelectedStoreApplied(true);
    const store = assignedStores.find((s) => s.storeId === parseInt(selectedStoreId));
    if (store) {
      dispatch(setSelectedStore({ selectedStore: store }));
      localStorage.setItem("selectedStore", JSON.stringify(store));
      navigate("/home");
    } else {
      console.error("No matching store found for storeId:", selectedStoreId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <FontAwesomeIcon icon={faStore} className="text-sky-600 text-3xl" />
          <h2 className="text-2xl font-bold text-gray-800">Choose Your Store</h2>
        </div>
        <div className="flex flex-col gap-5">
          {assignedStores.length > 0 ? (
            <select
              value={selectedStoreId}
              onChange={handleStoreSelect}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 bg-white text-sm font-medium text-gray-700"
            >
              <option value="" disabled>Select a store</option>
              {assignedStores.map((store) => (
                <option key={store.storeId} value={store.storeId}>
                  {store.storeCode} | {store.storeName}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-500 text-center">No stores available</p>
          )}
          <button
            onClick={storeSelectHandler}
            disabled={!selectedStoreId || isSelectedStoreApplied}
            className="w-full py-3 px-6 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectStore;

// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStore, faChevronDown,faCashRegister } from "@fortawesome/free-solid-svg-icons";
// import { useDispatch } from "react-redux";
// import { setSelectedStore } from "../../state/store/storeSlice";
// import { useNavigate } from "react-router-dom";

// const SelectStore = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const store = JSON.parse(localStorage.getItem("stores"));
//   const [assignedStores, setAssignedStores] = useState(store);
//   const [selectedStoreId, setSelectedStoreId] = useState(
//     assignedStores[0]?.storeId
//   );

//     const [isSelectedStoreApplied, setIsSelectedStoreApplied] = useState(false);
  

//   const handleStoreSelect = (e) => {
//     setSelectedStoreId(e.target.value);
//   };

//     const storeSelectHandler = () => {
//       setIsSelectedStoreApplied(selectedStoreId ? true : false);
//       const store = assignedStores.find(
//         (s) => s.storeId === parseInt(selectedStoreId)
//       );
//       if (store) {
//         dispatch(setSelectedStore({ selectedStore: store }));
//         localStorage.setItem("selectedStore", JSON.stringify(store));
//         navigate('/home');
//       } else {
//         console.error(
//           "No matching store found for the selectedStoreId:",
//           selectedStoreId
//         );
//       }
//     };

//   return(
//     <>
  
//   <div className="flex flex-col gap-10 items-center justify-center mt-28">
//     <div className="flex justify-start gap-1 items-center mb-6">
//       <FontAwesomeIcon icon={faStore} style={{ fontSize: "2rem" }} />
//       <h2 className="text-2xl font-bold pt-1">Select your store</h2>
//     </div>
//     <div className="flex flex-col justify-between gap-5 w-full max-w-xs">
//       <select
//         value={selectedStoreId}
//         onChange={handleStoreSelect}
//         className="select select-bordered w-full max-w-xs"
//       >
//         {assignedStores?.map((c) => (
//           <option key={c.storeId} value={c.storeId}>
//             {c.storeCode} | {c.storeName}
//           </option>
//         ))}
//       </select>
//       <button
//         onClick={storeSelectHandler}
//         type="button"
//         className="btn shadow-none py-4 px-10 rounded-lg border-none bg-primaryColor text-base-100 mt-4"
//       >
//         Continue
//       </button>
//     </div>
//   </div>

// </>
// )

// }

// export default SelectStore;
