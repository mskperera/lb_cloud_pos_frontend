import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

const Customer = ({ label, imageUrl, onAddCustomer }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {/* Replace Avatar with DaisyUI Avatar */}
        <div className="rounded-full overflow-hidden bg-gray-200 w-12 h-12 flex items-center justify-center">
       
        <FontAwesomeIcon className="text-xl" icon={faUser} />
        </div>
        {label ? (
          <span className="">{label}</span>
        ) : (
          <span className="">Select a customer</span>
        )}
      </div>
      <div className="flex items-center">
        {/* Replace Button with DaisyUI Button */}
        <button
         className="btn btn-ghost text-[#0284c7] font-bold"
         onClick={onAddCustomer}
          title="Add Customer"
            aria-label="Add Customer"
        >
          <FontAwesomeIcon className="text-xl" icon={faUserPlus} />
        </button>
      </div>
    </div>
  );
};

export default Customer;
