import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getContacts } from "../../../functions/contacts";
import { setCustomer } from "../../../state/orderList/orderListSlice";
import CustomerListPOS from "./CustomerListPOS";
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

  const imageUrl = customer?.imageUrl;

  const loadCustomer = async (selectedCustomer) => {
    try {
      setIsCustomerLoading(true);
      const ress = await getContacts({
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

      const fetchedCustomer = ress.data.results[0]?.[0];
      if (fetchedCustomer) {
        dispatch(setCustomer({ customer: fetchedCustomer }));
      }
    } catch (err) {
      console.error("Error loading customer:", err);
    } finally {
      setIsCustomerLoading(false);
    }
  };

  const onAddCustomerHandler = () => {
    setShowCustomerList(true);
  };

  const onCustomerSelectHandler = (selectedCustomer) => {
    setShowCustomerList(false);
    loadCustomer(selectedCustomer);
  };

  const onRemoveCustomerHandler = () => {
    dispatch(setCustomer({ customer: null }));
  };

  return (
    <>
      <CustomerListPOS 
        showCustomerList={showCustomerList} 
        onCustomerSelectHandler={onCustomerSelectHandler}  
        setShowCustomerList={setShowCustomerList} 
      />

      {/* Legend POS Styled Customer Section */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--lpos-border)",
        flexShrink: 0,
        background: "var(--lpos-surface)"
      }}>
        <button 
          onClick={customer ? onRemoveCustomerHandler : onAddCustomerHandler}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: "var(--lpos-radius-sm)",
            border: customer 
              ? "1.5px solid var(--lpos-accent)" 
              : "1.5px dashed var(--lpos-border)",
            background: customer ? "var(--lpos-accent-soft)" : "transparent",
            fontFamily: "inherit",
            fontSize: "13.5px",
            fontWeight: 500,
            color: customer ? "var(--lpos-accent)" : "var(--lpos-text-secondary)",
            cursor: "pointer",
            transition: "all .15s",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            if (!customer) {
              e.currentTarget.style.borderColor = "var(--lpos-accent)";
              e.currentTarget.style.color = "var(--lpos-accent)";
              e.currentTarget.style.background = "var(--lpos-accent-soft)";
            }
          }}
          onMouseLeave={(e) => {
            if (!customer) {
              e.currentTarget.style.borderColor = "var(--lpos-border)";
              e.currentTarget.style.color = "var(--lpos-text-secondary)";
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {/* Icon */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: customer ? "var(--lpos-accent)" : "var(--lpos-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: customer ? "white" : "var(--lpos-text-secondary)",
            flexShrink: 0,
            transition: "all .2s"
          }}>
            <UserIcon size={18} strokeWidth={2.2} />
          </div>

          {/* Customer Info */}
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <div style={{
              fontSize: "13.8px",
              fontWeight: 600,
              color: customer ? "var(--lpos-text-primary)" : "var(--lpos-text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {label}
            </div>
            {customer && (
              <div style={{
                fontSize: "11.5px",
                color: "var(--lpos-text-tertiary)",
                marginTop: 1
              }}>
                Customer • {customer.mobile || customer.email || "No contact info"}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: customer ? "rgba(255,59,48,0.1)" : "var(--lpos-bg)",
            color: customer ? "var(--lpos-red)" : "var(--lpos-accent)",
            flexShrink: 0,
            transition: "all .15s"
          }}>
            {customer ? (
              <FaMinusCircle size={16} />
            ) : (
              <FaPlusCircle size={16} />
            )}
          </div>
        </button>
      </div>
    </>
  );
};

export default Customer;