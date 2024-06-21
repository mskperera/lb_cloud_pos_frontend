import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import FormElementMessage from "../../messges/FormElementMessage";
import { validate } from "../../../utils/formValidation";
import { useSelector } from "react-redux";
import Decimal from "decimal.js";
import { PAYMENT_METHODS } from "../../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";

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
        <div className="flex flex-col gap-4 border-2 p-5 rounded-md">
          <div className="flex justify-center gap-2 items-center">
            <FontAwesomeIcon icon={faMoneyBill} className="text-2xl" />
            <span className="text-md font-semibold">New Cash Payment</span>
          </div>

          <div className="flex flex-col gap-4 items-center">
            {/* <div className='grid grid-cols-3 gap-2'>
                  {[1, 2, 5, 10, 20, 50, 100, 500, 1000, 5000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        handleInputChange(
                          setAmountReceived,
                          amountReceived,
                          amount
                        );
                      }}
          
                      className='btn  bg-primaryColor hover:bg-primaryColorHover text-white rounded-full'
                    >
                      Rs {amount}
                    </button>
                  ))}
                </div> */}
            <div className="flex justify-center items-center gap-2">
              <div className="">Pay amount</div>
              <input
                type="number"
                value={amountReceived && amountReceived.value}
                onChange={(e) => {
                  handleInputChange(
                    setAmountReceived,
                    amountReceived,
                    e.target.value
                  );
                }}
                className="border p-2 rounded"
              />
              {validationMessages(amountReceived)}
            </div>

            <button
              className="btn w-[40%] bg-primaryColor hover:bg-primaryColorHover text-white"
              onClick={splitPaymentHandler}
            >
              Add Payment
            </button>
          </div>
        </div>
      </>
    );

};

 export default CashPaymentMulti;