import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import FormElementMessage from "../../messges/FormElementMessage";
import { validate } from "../../../utils/formValidation";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";
import { PAYMENT_METHODS } from "../../../utils/constants";

const CashDemomination = ({ currency, amount, isSelected, onClick }) => {
  return (
    <div
      className="col-12 md:col-4 sm:col-4 lg:col-4 xl:col-2 p-1"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className={`shadow-1 hover:shadow-4 border-round ${isSelected ? 'bg-primary text-white' : ''}`}>
        <div className="flex justify-content-center flex-wrap p-3">
          <span className="font-bold">{`${currency}${amount}`}</span>
        </div>
      </div>
    </div>
  );
};

const CashPaymentMulti = ({onAddPayment}) => {

  const {paymentList,orderSummary} = useSelector((state) => state.orderList);

  const [cashDenominations,setCashDenominations]=useState([{currency:'Rs',amount:10},
  {currency:'Rs',amount:20},
  {currency:'Rs',amount:50},
  {currency:'Rs',amount:100},{currency:'Rs',amount:500},
  {currency:'Rs',amount:1000},{currency:'Rs',amount:5000},
]);


const [amountReceived,setAmountReceived] = useState({
  label: "Received Amount",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "decimal" },
});




  const validationMessages = (state) => {
    // Ensure that the function returns JSX or null
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="mt-2 w-full"
              severity="error"
              text={`Validation: ${message}`}
            />
          ))}
        </div>
      )
    );
  };

  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", state);
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
      return;
    }
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };
  
  const validateAll = () => {
    // List of all states to validate
    const states = [amountReceived];
    const updatedStates = states.map((state) => {
      // Validate each state
      const validation = validate(state.value, state);
console.log('run validation',validation)
      // Return updated state
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true, // or based on some other logic
        validationMessages: validation.messages,
      };
    });

    // Now update all states
    setAmountReceived(updatedStates[0]);
    //setDiscountType(updatedStates[1]);
    //setDiscount(updatedStates[2]);
    //setOtherReasonRemark(updatedStates[3]);

    // Check if all states are valid
    const allValid = updatedStates.every((state) => state.isValid);
    return allValid;
  };


  const splitPaymentHandler = () => {
    const allValid = validateAll();
  
    if (!allValid) {
      // Handle validation errors
      console.error("Validation errors", {
        amountReceived,
      });

      return; 
    }

  onAddPayment({ allValid, fields: { payAmount: amountReceived.value } });
  };

 
    return (
      <>
        <div className="flex flex-column mb-4">
          <div className="grid mb-2">
            <div className="col-6">
              <div className="flex align-items-center gap-2">
                <span className=" pi pi-money-bill text-xl font-semibold"></span>{" "}
                <span className="text-xl font-semibold">Cash Payment</span>
              </div>
            </div>
          </div>

          <div className="grid mb-5">
            <div className="col">
              <div className="flex flex-wrap">
                {cashDenominations.map((p, index) => (
                  <CashDemomination
                    key={index}
                    currency={p.currency}
                    amount={p.amount}
                    isSelected={amountReceived?.value === p.amount}
                    //onClick={() => handleDenominationClick(p)}
                    onClick={() => {
                      handleInputChange(
                        setAmountReceived,
                        amountReceived,
                        p.amount
                      );
                    }}
                  />
                ))}
              </div>
              <div className="col">
                <div className="flex flex-row align-items-center justify-content-center">
                  {/* <label htmlFor="customAmount-single"  className="font-normal text-lg mr-2">Custom Amount</label> */}
                  <InputText
                    id="customAmount-single"
                    type="text"
                    value={amountReceived && amountReceived.value}
                    className="p-inputtext-normal"
                    placeholder="Enter Custom Amount"
                    onChange={(e) => {
                      handleInputChange(
                        setAmountReceived,
                        amountReceived,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
       

            </div>
     
          </div>

          <div className="grid">
          <div className="col-4 col-offset-4 flex align-items-end">
                <div className="flex w-full">
                  <Button
                    className="p-3"
                    aria-label="Pay"
                    severity="primary"
                    onClick={splitPaymentHandler}
                    style={{ width: "100%", display: "block" }}
                    size="normal"
                    rounded
                  >
                           <span className="px-2">Split Amount</span>
                  </Button>
                </div>
              </div>
            <div className="col">
            {validationMessages(amountReceived)}
            </div>
          </div>
        </div>
      </>
    );

};

 export default CashPaymentMulti;