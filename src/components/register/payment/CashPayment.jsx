import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { validate } from "../../../utils/formValidation";
import FormElementMessage from "../../messges/FormElementMessage";
import { useDispatch, useSelector } from "react-redux";
import { calculateBalance } from "../../../state/orderList/orderListSlice";

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

const CashPayment = forwardRef((props, ref) =>{

  const [cashDenominations,setCashDenominations]=useState([{currency:'Rs',amount:10},
  {currency:'Rs',amount:20},
  {currency:'Rs',amount:50},
  {currency:'Rs',amount:100},{currency:'Rs',amount:500},
  {currency:'Rs',amount:1000},{currency:'Rs',amount:5000},
]);


const [receivedAmount,setReceivedAmount] = useState({
  label: "Received Amount",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "decimal" },
});

const dispatch=useDispatch();

useEffect(()=>{
  const isRecevedAmountTouched=receivedAmount.isTouched;
  dispatch(calculateBalance({receivedAmountCard:0,receivedAmountCash:receivedAmount.value,isRecevedAmountTouched}));
},[receivedAmount])

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
    const states = [receivedAmount];
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
    setReceivedAmount(updatedStates[0]);
    //setDiscountType(updatedStates[1]);
    //setDiscount(updatedStates[2]);
    //setOtherReasonRemark(updatedStates[3]);

    // Check if all states are valid
    const allValid = updatedStates.every((state) => state.isValid);
    return allValid;
  };


  
  useImperativeHandle(ref, () => ({
    getValidatedData: () => {
      return new Promise((resolve, reject) => {
        const allValid = validateAll();
  
        if (!allValid) {
          console.error("Validation errors", { receivedAmount });
          resolve({ allValid, fields: null });  // Resolve with allValid false and no fields
          return;
        }
  
        resolve({ allValid, fields: { receivedAmount:receivedAmount.value } }); // Resolve with data
      });
    }
  }));


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
                    isSelected={receivedAmount?.value === p.amount}
                    //onClick={() => handleDenominationClick(p)}
                    onClick={() => {
                      handleInputChange(
                        setReceivedAmount,
                        receivedAmount,
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
                    value={receivedAmount && receivedAmount.value}
                    className="p-inputtext-normal"
                    placeholder="Enter Custom Amount"
                    onChange={(e) => {
                      handleInputChange(
                        setReceivedAmount,
                        receivedAmount,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          
          </div>

          <div className="grid">
            <div className="col">
            {validationMessages(receivedAmount)}
            </div>
          </div>
        </div>
      </>
    );

});

CashPayment.displayName='CashPayment';

 export default CashPayment;