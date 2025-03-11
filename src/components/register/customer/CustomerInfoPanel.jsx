import { useDispatch, useSelector } from "react-redux";
import GhostButton from "../../iconButtons/GhostButton";
import { useState } from "react";
import { getContacts } from "../../../functions/contacts";
import { setCustomer } from "../../../state/orderList/orderListSlice";
import DialogModel from "../../model/DialogModel";
import CustomerListPOS from "./CustomerListPOS";
import { CONTACT_TYPE } from "../../../utils/constants";

const Customer = ({ }) => {
  const dispatch = useDispatch();
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);

  const { customer } = useSelector((state) => state.orderList);

  const label = customer
    ? `${customer.contactCode} | ${customer.contactName}`
    : "Walk-in Customer";

    const imageUrl=customer?.imageUrl;

  const loadCustomer = async (id) => {
    try {
      setIsCustomerLoading(true);
      const ress = await getContacts({
        contactId: id,
        contactTypeIds:[CONTACT_TYPE.CUSTOMER,CONTACT_TYPE.CUSTOMER_SUPPLIER],
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
    console.log('custmoerid',customerId);
    setShowCustomerList(false);
    loadCustomer(customerId);
  };

  const onRemoveCustomerHandler = () => {
    dispatch(setCustomer({ customer: null }));
  };

  return (
    <>
      <DialogModel
        header="Select Customer"
        visible={showCustomerList}
        maximizable
        maximized
        style={{ width: "50vw" }}
        onHide={() => setShowCustomerList(false)}
      >
        <CustomerListPOS selectingMode={true} onselect={onCustomerSelectHandler} />
      </DialogModel>

      <div className="flex m-0 gap-4 px-2 justify-between bg-gray-50
       rounded-lg shadow-sm">


<div className="flex gap-4 items-center">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Customer"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">
            <i className="pi pi-user text-lg"></i>
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {customer && <span className="text-xs text-gray-500">Customer Info</span>}
        </div>

</div>


        <div className="flex m-0 p-0 items-center">
          {customer ? (
            <GhostButton
              onClick={onRemoveCustomerHandler}
              iconClass="pi pi-user-minus"
              aria-label="Remove Customer"
             // tooltip="Remove Customer"
              color="text-red-500"
              hoverClass="hover:text-red-700 hover:bg-transparent"
            />
          ) : (
            <GhostButton
              onClick={onAddCustomerHandler}
              iconClass="pi pi-user-plus"
              aria-label="Add Customer"
            //  tooltip="Add Customer"
              color="text-sky-500"
              hoverClass="hover:text-blue-700 hover:bg-transparent"
            />
          )}
        </div>


      </div>
    </>
  );
};

export default Customer;
