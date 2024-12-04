import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Customer = ({ label, imageUrl, onAddCustomer }) => {
  return (
      <div className="flex items-center gap-1 m-0 p-0">
        <button
         className="btn btn-ghost m-0 p-0 text-[#0284c7] font-bold hover:bg-transparent hover:text-primaryColorHover"
         onClick={onAddCustomer}
          title="Add Customer"
            aria-label="Add Customer"
        >
          <FontAwesomeIcon className="text-xl" icon={faUserPlus} />
        </button>
      
        {label ? (
          <span className="">{label}</span>
        ) : (
          <span className="">Select a customer</span>
        )}
      </div>
  );
};

export default Customer;
