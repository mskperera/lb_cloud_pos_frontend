import { useDispatch, useSelector } from "react-redux";
import GhostButton from "../../iconButtons/GhostButton";
import { useState } from "react";
import { getContacts } from "../../../functions/contacts";
import { setCustomer } from "../../../state/orderList/orderListSlice";
import DialogModel from "../../model/DialogModel";
import CustomerListPOS from "./CustomerListPOS";
import { CONTACT_TYPE } from "../../../utils/constants";
import { FaAd, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const Customer = () => {
  const dispatch = useDispatch();
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const { customer } = useSelector((state) => state.orderList);

  const label = customer
    ? `${customer.contactCode} | ${customer.contactName}`
    : "Add customer";
  const imageUrl = customer?.imageUrl;

  const loadCustomer = async (id) => {
    try {
      setIsCustomerLoading(true);
      const ress = await getContacts({
        contactId: id,
        contactTypeIds: [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.CUSTOMER_SUPPLIER],
        contactCode: null,
        contactName: null,
        email: null,
        mobile: null,
        tel: null,
        whatsappNumber: null,
        searchByKeyword: false,
      });
      const fetchedCustomer = ress.data.results[0][0];
      dispatch(setCustomer({ customer: fetchedCustomer }));
    } catch (err) {
      console.error("Error loading customer:", err);
    } finally {
      setIsCustomerLoading(false);
    }
  };

  const onAddCustomerHandler = () => {
    setShowCustomerList(true);
  };

  const onCustomerSelectHandler = (customerId) => {
    console.log('customerid:',customerId)
    setShowCustomerList(false);
    loadCustomer(customerId.contactId);
  };

  const onRemoveCustomerHandler = () => {
    dispatch(setCustomer({ customer: null }));
  };

  return (
    <>

        <CustomerListPOS showCustomerList={showCustomerList} onCustomerSelectHandler={onCustomerSelectHandler}  setShowCustomerList={setShowCustomerList} />
 

  
      <div className="flex justify-between items-center gap-4 px-4 py-3 bg-white rounded-lg  border border-gray-200">
        <div className="flex gap-4 items-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Customer"
              className="w-10 h-10 rounded-full border-2 border-sky-200 object-cover"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-sky-100 rounded-full text-sky-600">
              <i className="pi pi-user text-xl"></i>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-base  text-gray-800">{label}</span>
            {customer && <span className="text-sm text-gray-600">Customer Info</span>}
          </div>
        </div>
        <div className="flex items-center">
          {customer ? (

               <button
        type="button"
 
            onClick={onRemoveCustomerHandler}
            aria-label="Remove Customer"
                className="flex items-center m-0 p-2 rounded-full text-red-600 hover:text-red-700"
                  hoverClass="hover:text-red-600 hover:bg-gray-100"
      >
        
        <FaMinusCircle className="text-xl" />
      </button>

     
          ) : (


               <button
        type="button"
 
            onClick={onAddCustomerHandler}
            aria-label="Remove Customer"
                className="flex items-center rounded-full text-sky-600 hover:text-sky-700"
                  hoverClass="hover:text-red-600 hover:bg-gray-100"
      >
      
        <FaPlusCircle className="text-xl" />
      </button>

          )}
        </div>
      </div>
    </>
  );
};

export default Customer;