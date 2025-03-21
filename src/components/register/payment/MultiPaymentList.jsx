
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillAlt,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { PAYMENT_METHODS } from "../../../utils/constants";

const PaymentMethodCard = ({ payment, onRemove }) => {
  let icon, title, details;

  switch (payment.methodId) {
    case PAYMENT_METHODS.CASH:
      icon = (
        <FontAwesomeIcon icon={faMoneyBillAlt} style={{ fontSize: "40px" }} />
      );
      title = "Cash";
      details = (
        <div>
          <div className="flex flex-row gap-2 justify-content-between mb-2">
            <p className="text-md font-semibold m-0">Pay Amount :</p>
            <p className="text-md font-normal m-0">{payment.amountPaid}</p>
          </div>

          
        </div>
      );
      break;
    case PAYMENT_METHODS.CARD:
      icon = (
        <FontAwesomeIcon icon={faCreditCard} style={{ fontSize: "40px" }} />
      );
      title = "Card";
      details = (
        <div>
          <div className="flex flex-row gap-2 justify-content-between mb-2">
            <p className="text-md font-semibold m-0">Card Type</p>
            <p className="text-md font-normal m-0">
              {payment.cardPayment.cardTypeId}
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-content-between mb-2">
            <p className="text-md font-semibold m-0">Card Number</p>
            <p className="text-md font-normal m-0">
              **** **** **** {payment.cardPayment.cardLastFourDigits}
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-content-between mb-2">
            <p
              className="text-md font-semibold
Save to grepper
m-0"
            >
              Amount
            </p>
            <p className="text-md font-normal m-0">{payment.amountPaid}</p>
          </div>
        </div>
      );
      break;
    // Add case for other payment methods like credit if needed
    default:
      return null;
  }

  return (
    <div
      className="flex flex-column card shadow-1 hover:shadow-4 surface-card border-round justify-content-center p-2"
      style={{ cursor: "pointer" }}
    >
      <div className="flex align-items-center justify-content-between">
        <div className="flex align-items-center">
          {icon}
          <p className="text-lg font-semibold ml-2">{title}</p>
        </div>
        <button
          icon="pi pi-times"
          className="p-button-rounded p-button-text p-button-danger p-button-sm"
          onClick={() => onRemove(payment.id)}
        />
      </div>
      {details}
    </div>
  );
};

const MultiPaymentList = ({ paymentList, onRemovePayment,orderSummary }) => {
  return (
    <div className="flex gap-4">
          {paymentList.map((payment) => (
            <PaymentMethodCard
              key={payment.id}
              payment={payment}
              onRemove={onRemovePayment}
            />
          ))}
    </div>
  );
};

export default MultiPaymentList;
