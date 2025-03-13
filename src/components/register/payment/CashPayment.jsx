
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { validate } from "../../../utils/formValidation";
import FormElementMessage from "../../messges/FormElementMessage";
import { useDispatch, useSelector } from "react-redux";
import { addMultiPayment, addSinglePayment, calculateBalance } from "../../../state/orderList/orderListSlice";
import { PAYMENT_METHODS } from "../../../utils/constants";
import { formatCurrency } from "../../../utils/format";



const CashPayment = forwardRef((props, ref) =>{


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



  
  const onchangHandler=async(value)=>{

    
    const paymentData = {
      methodId: PAYMENT_METHODS.CASH,
      amountPaid: value,
      cashPayment: {
        receivedAmount: value,
        // balanceAmount: 0,
      },
    };
    console.log("addMultiPayment", paymentData);
    dispatch(addSinglePayment({ paymentData }));


  }


  useEffect(()=>{
    if(receivedAmount.value)
    onchangHandler(receivedAmount.value);
  },[receivedAmount])



    return (
        <div className="flex flex-col gap-4 w-full">
        
        <div className='grid grid-cols-3 gap-2'>
                  {[1, 2, 5, 10, 20, 50, 100, 500, 1000, 5000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        handleInputChange(
                          setReceivedAmount,
                          receivedAmount,
                          amount
                        );
                      }}
          
                      className='btn  bg-primaryColor hover:bg-primaryColorHover text-white rounded-full'
                    >
                     {formatCurrency(amount,true)}
                    </button>
                  ))}
                </div>
                <div className='flex justify-end items-center gap-2 mt-4'>
                  <div className='text-lg font-semibold'>Pay amount</div>
                  <input
                    type='number'
                    value={receivedAmount && receivedAmount.value}
                    onChange={(e) => {
                      handleInputChange(
                        setReceivedAmount,
                        receivedAmount,
                        e.target.value
                      );
                    }}
                    className='border p-4 rounded'
                  />
                </div>

          <div className="grid">
            <div className="col">
            {validationMessages(receivedAmount)}
            </div>
          </div>
        </div>
    );

});

CashPayment.displayName='CashPayment';

 export default CashPayment;