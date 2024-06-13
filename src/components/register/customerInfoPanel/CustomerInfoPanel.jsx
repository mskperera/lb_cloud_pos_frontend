import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";


const Customer = ({ label, imageUrl, onAddCustomer }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar image={imageUrl} shape="circle" size="large" className="p-mb-2" />
        {label ? (
          <span className="p-text-bold">{label}</span>
        ) : (
          <span className="p-text-bold">Select a customer</span>
        )}
      </div>
      <div className="p-card-footer p-d-flex p-jc-center">
        <Button
          icon="pi pi-plus"
          onClick={onAddCustomer}
          className="p-button-rounded p-button-text"
          aria-label="Add Customer"
        />
      </div>
    </div>
  );
};

export default Customer;
