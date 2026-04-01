
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getContacts } from "../../../functions/contacts";
import { setCustomer } from "../../../state/orderList/orderListSlice";
import CustomerSelectionModal from "./CustomerListPOS";
import { CONTACT_TYPE } from "../../../utils/constants";
import { UserIcon } from "lucide-react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const Customer = () => {
  const dispatch = useDispatch();
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  
  const { customer } = useSelector((state) => state.orderList);

  const label = customer
    ? `${customer.contactCode || ""} | ${customer.contactName || "Unknown Customer"}`
    : "Add customer (optional)";

  const loadCustomer = async (selectedCustomer) => {
    try {
      setIsCustomerLoading(true);
      const res = await getContacts({
        contactId: selectedCustomer.contactId,
        contactTypeIds: [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.CUSTOMER_SUPPLIER],
        contactCode: null,
        contactName: null,
        email: null,
        mobile: null,
        tel: null,
        whatsappNumber: null,
        searchByKeyword: false,
      });

      const fetchedCustomer = res.data.results[0]?.[0];
      if (fetchedCustomer) {
        dispatch(setCustomer({ customer: fetchedCustomer }));
      }
    } catch (err) {
      console.error("Error loading customer:", err);
    } finally {
      setIsCustomerLoading(false);
    }
  };

  const onAddCustomerHandler = () => setShowCustomerList(true);
  const onCustomerSelectHandler = (selectedCustomer) => {
    setShowCustomerList(false);
    loadCustomer(selectedCustomer);
  };
  const onRemoveCustomerHandler = () => {
    dispatch(setCustomer({ customer: null }));
  };

  return (
    <>
      <CustomerSelectionModal 
        showCustomerList={showCustomerList} 
        setShowCustomerList={setShowCustomerList} 
        onCustomerSelectHandler={onCustomerSelectHandler} 
      />

      {/* Customer Panel - Consistent with Product Search */}
      <div className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border-b border-[var(--lpos-border)] flex-shrink-0 bg-[var(--lpos-surface)]">
        <button 
          onClick={customer ? onRemoveCustomerHandler : onAddCustomerHandler}
          className="w-full flex items-center gap-3 xs:gap-4 px-3 xs:px-4 py-3 xs:py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer font-medium active:scale-[0.985]"
          style={{
            borderStyle: customer ? "solid" : "dashed",
            borderColor: customer ? "var(--lpos-accent)" : "var(--lpos-border)",
            background: customer ? "var(--lpos-accent-soft)" : "transparent",
            color: customer ? "var(--lpos-accent)" : "var(--lpos-text-secondary)",
          }}
        >
          {/* Icon */}
          <div className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: customer ? "var(--lpos-accent)" : "var(--lpos-bg)",
              color: customer ? "white" : "var(--lpos-text-secondary)",
            }}>
            <UserIcon size={20} strokeWidth={2.25} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm xs:text-base font-semibold truncate"
              style={{ color: customer ? "var(--lpos-text-primary)" : "var(--lpos-text-secondary)" }}>
              {label}
            </div>
            {customer && (
              <div className="text-xs xs:text-sm text-[var(--lpos-text-tertiary)] mt-0.5 truncate">
                Customer • {customer.mobile || customer.email || "No contact info"}
              </div>
            )}
          </div>

          {/* Action Icon */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: customer ? "rgba(255,59,48,0.1)" : "var(--lpos-bg)",
              color: customer ? "var(--lpos-red)" : "var(--lpos-accent)",
            }}>
            {customer ? <FaMinusCircle size={18} /> : <FaPlusCircle size={18} />}
          </div>
        </button>
      </div>
    </>
  );
};

export default Customer;

// import { useDispatch, useSelector } from "react-redux";
// import { useState } from "react";
// import { getContacts } from "../../../functions/contacts";
// import { setCustomer } from "../../../state/orderList/orderListSlice";
// import CustomerListPOS from "./CustomerListPOS";
// import { CONTACT_TYPE } from "../../../utils/constants";
// import { UserIcon } from "lucide-react";
// import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

// const Customer = () => {
//   const dispatch = useDispatch();
//   const [isCustomerLoading, setIsCustomerLoading] = useState(false);
//   const [showCustomerList, setShowCustomerList] = useState(false);
  
//   const { customer } = useSelector((state) => state.orderList);

//   const label = customer
//     ? `${customer.contactCode || ""} | ${customer.contactName || "Unknown Customer"}`
//     : "Add customer (optional)";

//   const imageUrl = customer?.imageUrl;

//   const loadCustomer = async (selectedCustomer) => {
//     try {
//       setIsCustomerLoading(true);
//       const ress = await getContacts({
//         contactId: selectedCustomer.contactId,
//         contactTypeIds: [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.CUSTOMER_SUPPLIER],
//         contactCode: null,
//         contactName: null,
//         email: null,
//         mobile: null,
//         tel: null,
//         whatsappNumber: null,
//         searchByKeyword: false,
//       });

//       const fetchedCustomer = ress.data.results[0]?.[0];
//       if (fetchedCustomer) {
//         dispatch(setCustomer({ customer: fetchedCustomer }));
//       }
//     } catch (err) {
//       console.error("Error loading customer:", err);
//     } finally {
//       setIsCustomerLoading(false);
//     }
//   };

//   const onAddCustomerHandler = () => {
//     setShowCustomerList(true);
//   };

//   const onCustomerSelectHandler = (selectedCustomer) => {
//     setShowCustomerList(false);
//     loadCustomer(selectedCustomer);
//   };

//   const onRemoveCustomerHandler = () => {
//     dispatch(setCustomer({ customer: null }));
//   };

//   return (
//     <>
//       <CustomerListPOS 
//         showCustomerList={showCustomerList} 
//         onCustomerSelectHandler={onCustomerSelectHandler}  
//         setShowCustomerList={setShowCustomerList} 
//       />

//       {/* Responsive Customer Panel */}
//       <div className="px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border-b border-[var(--lpos-border)] flex-shrink-0 bg-[var(--lpos-surface)]">
//         <button 
//           onClick={customer ? onRemoveCustomerHandler : onAddCustomerHandler}
//           className="w-full flex items-center gap-2.5 xs:gap-3 sm:gap-4 px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border-1.5 transition-all duration-150 cursor-pointer font-medium"
//           style={{
//             borderStyle: customer ? "solid" : "dashed",
//             borderColor: customer ? "var(--lpos-accent)" : "var(--lpos-border)",
//             background: customer ? "var(--lpos-accent-soft)" : "transparent",
//             color: customer ? "var(--lpos-accent)" : "var(--lpos-text-secondary)",
//           }}
//           onMouseEnter={(e) => {
//             if (!customer) {
//               e.currentTarget.style.borderColor = "var(--lpos-accent)";
//               e.currentTarget.style.color = "var(--lpos-accent)";
//               e.currentTarget.style.background = "var(--lpos-accent-soft)";
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!customer) {
//               e.currentTarget.style.borderColor = "var(--lpos-border)";
//               e.currentTarget.style.color = "var(--lpos-text-secondary)";
//               e.currentTarget.style.background = "transparent";
//             }
//           }}
//         >
//           {/* Icon - Responsive */}
//           <div className="w-7 xs:w-8 sm:w-9 h-7 xs:h-8 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
//             style={{
//               background: customer ? "var(--lpos-accent)" : "var(--lpos-bg)",
//               color: customer ? "white" : "var(--lpos-text-secondary)",
//             }}>
//             <UserIcon size={16} strokeWidth={2.2} className="xs:hidden" />
//             <UserIcon size={18} strokeWidth={2.2} className="hidden xs:block sm:hidden" />
//             <UserIcon size={20} strokeWidth={2.2} className="hidden sm:block" />
//           </div>

//           {/* Customer Info - Responsive */}
//           <div className="flex-1 min-w-0 text-left">
//             <div className="text-xs xs:text-sm sm:text-sm font-semibold truncate"
//               style={{
//                 color: customer ? "var(--lpos-text-primary)" : "var(--lpos-text-secondary)",
//               }}>
//               {label}
//             </div>
//             {customer && (
//               <div className="text-xs xs:text-xs sm:text-xs mt-0.5 xs:mt-1 truncate"
//                 style={{
//                   color: "var(--lpos-text-tertiary)",
//                 }}>
//                 Customer • {customer.mobile || customer.email || "No contact"}
//               </div>
//             )}
//           </div>

//           {/* Action Button - Responsive */}
//           <div className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150"
//             style={{
//               background: customer ? "rgba(255,59,48,0.1)" : "var(--lpos-bg)",
//               color: customer ? "var(--lpos-red)" : "var(--lpos-accent)",
//             }}>
//             {customer ? (
//               <FaMinusCircle size={14} className="xs:hidden" />
//             ) : (
//               <FaPlusCircle size={14} className="xs:hidden" />
//             )}
//             {customer ? (
//               <FaMinusCircle size={16} className="hidden xs:block" />
//             ) : (
//               <FaPlusCircle size={16} className="hidden xs:block" />
//             )}
//           </div>
//         </button>
//       </div>
//     </>
//   );
// };

// export default Customer;