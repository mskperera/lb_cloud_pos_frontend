import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputMask } from 'primereact/inputmask';
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { validate } from "../../../utils/formValidation";
import FormElementMessage from "../../messges/FormElementMessage";
import { useDispatch } from "react-redux";
import { calculateBalance } from "../../../state/orderList/orderListSlice";




const CardType = ({ type, isSelected, onClick }) => {
  return (
    <div
      className="col flex "
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className={`shadow-1 hover:shadow-4  border-round p-2 ${isSelected ? 'bg-primary text-white' : ''}`}>
        <div className="flex justify-content-center flex-wrap p-3">
          <span className="font-bold">{type.name}</span>
        </div>
      </div>
    </div>
  );
};

const CardPayment=forwardRef((props, ref) => {

  const dispatch=useDispatch();
  const [selectedBank, setSelectedBank] = useState(null);


const banksOptions = [
  { name: "Sampath", id: 1 },
  { name: "Commercial Bank", id: 2 },
  { name: "NDB", id: 3 },
  { name: "BOC", id: 4 },
  { name: "DFCC", id: 5 },
];

const cardTypes = [{id:1,name:'VISA'},{id:2,name:'MASTER'},{id:3,name:'AMEX'}]; // Add more card types if needed
const [selectedCardTypeId, setSelectedCardTypeId] = useState(null);


const [receivedAmount,setReceivedAmount] = useState({
  label: "Amount",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "string" },
});

const [cardHolderName,setCardHolderName] = useState({
  label: "Card Holder Name",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "string" },
});

const [bank,setBank] = useState({
  label: "Bank",
  value:"1",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "string" },
});


const [cardType,setCardType] = useState({
  label: "Card Type",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "integer" },
});

const [cardNo,setCardNo] = useState({
  label: "Card Number",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "string" },
});
const [cardExpirationMonth,setCardExpirationMonth] = useState({
  label: "Expiration Month",
  value: "",
  isTouched: false,
  isValid: false,
  rules: { required: true, dataType: "cardExpiration" },
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
  console.log("Nlllll", value);
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
  const states = [cardType,bank,cardNo,cardHolderName,cardExpirationMonth,receivedAmount];
  const updatedStates = states.map((state) => {
    // Validate each state
    const validation = validate(state.value, state);
    // Return updated state
    return {
      ...state,
      isValid: validation.isValid,
      isTouched: true, // or based on some other logic
      validationMessages: validation.messages,
    };
  });

  // Now update all states
  setCardType(updatedStates[0]);
  setBank(updatedStates[1]);
  setCardNo(updatedStates[2]);
  setCardHolderName(updatedStates[3]);
  setCardExpirationMonth(updatedStates[4]);
  setReceivedAmount(updatedStates[5]);
  // Check if all states are valid
  const allValid = updatedStates.every((state) => state.isValid);
  return allValid;
};

// useImperativeHandle(ref, () => ({
//   getValidatedData
// }));

useEffect(()=>{
  const isRecevedAmountTouched=receivedAmount.isTouched;
  dispatch(calculateBalance({receivedAmountCard:receivedAmount.value,receivedAmountCash:0,isRecevedAmountTouched}));
},[receivedAmount])

useImperativeHandle(ref, () => ({
  getValidatedData: () => {
    return new Promise((resolve, reject) => {
      const allValid = validateAll();

      if (!allValid) {
        console.error("Validation errors", { cardType });
        resolve({ allValid, fields: null });  // Resolve with allValid false and no fields
        return;
      }

      resolve({ allValid, fields: {cardTypeId:cardType.value,bankId:bank.value.id,cardNo:cardNo.value,cardHolderName:cardHolderName.value,
        cardExpirationMonth:cardExpirationMonth.value,receivedAmount: receivedAmount.value} }); // Resolve with data
    });
  }
}));

// const getValidatedData = (callback) => {
//   const allValid = validateAll();

//   if (!allValid) {
//     // Handle validation errors
//     console.error("Validation errors", {
//       cardType,
//     });
//     callback(null);
//     return; 
//   }
// return callback({allValid,fields:{cardType:cardType.value}});
// };

    return (
      <>
        <div className="mb-4">
          <div className="flex flex-column">
            <div className="grid mb-2">
              <div className="col-6">
                <div className="flex align-items-center gap-2">
                  <span className=" pi pi-credit-card text-xl font-semibold"></span>{" "}
                  <span className="text-xl font-semibold">Card Payment</span>
                </div>
              </div>
              <div className="col-6 pr-4">
                {/* <div className="flex align-items-top justify-content-end">
                  <label
                    htmlFor="customAmount-single"
                    className="text-xl font-semibold mb-2 mr-5"
                  >
                    {" "}
                    Grand Total
                  </label>
                  <span className="text-xl font-normal">Rs 00.00</span>
                </div> */}
              </div>
            </div>
            <div className="grid mb-5">
              <div className="col-12 flex">
                <div className="flex flex-row gap-3 align-items-end">
                  {cardTypes.map((type) => (
                    <CardType
                      key={type.id}
                      type={type}
                      isSelected={cardType.value === type.id}
                      onClick={() => {
                        handleInputChange(setCardType, cardType, type.id);
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-12">{validationMessages(cardType)}</div>
            </div>

            <div className="grid mb-4">
              {/* <div className="col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      {" "}
                      Bank
                    </label>
                    <Dropdown
                      value={bank.value}
                      onChange={(e) => {
                        console.log("discount reason", bank);
                        handleInputChange(setBank, bank, e.value);
                      }}
                      options={banksOptions}
                      optionLabel="name"
                      placeholder="Select a Bank"
                      className="w-full p-inputtext-sm"
                    />
                  </div>
                </div>
                {validationMessages(bank)}
              </div> */}

              <div className="col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      {" "}
                      Card Number (Last 4 digits)
                    </label>
                    <InputMask
                      id="card-number"
                      mask="9999" // Mask for 4 digits
                      value={cardNo.value}
                      placeholder="Enter last 4 digits"
                      onChange={(e) =>
                        handleInputChange(setCardNo, cardNo, e.value)
                      }
                      unmask={true} // Optional: gets the raw value
                      className="p-inputtext-sm"
                    />
                  </div>
                </div>
                {validationMessages(cardNo)}
              </div>
              <div className="col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Card Holder Name
                    </label>
                    <InputText
                      id="card-number"
                      type="text"
                      className="p-inputtext-sm"
                      placeholder=""
                      onChange={(e) => {
                        handleInputChange(
                          setCardHolderName,
                          cardHolderName,
                          e.target.value
                        );
                      }}
                    />
                  </div>
                </div>
                {validationMessages(cardHolderName)}
              </div>
              <div className="col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      Expiration Month/Year
                    </label>
                    <InputMask
                      id="card-expiration"
                      value={cardExpirationMonth.value} // Make sure this state is defined and updated
                      className="p-inputtext-sm"
                      mask="99/99"
                      placeholder="MM/YY"
                      onChange={(e) => {
                        handleInputChange(
                          setCardExpirationMonth,
                          cardExpirationMonth,
                          e.value
                        );
                      }}
                    />
                  </div>
                </div>
                {validationMessages(cardExpirationMonth)}
              </div>
              <div className="col-4">
                <div className="flex">
                  <div className="flex-1 flex flex-column mr-3">
                    <label
                      htmlFor="card-number"
                      className="text-lg font-normal mb-2 mr-5"
                    >
                      {" "}
                      Amount
                    </label>
                    <InputText
                      type="text"
                      className="p-inputtext-sm"
                      placeholder=""
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
                {validationMessages(receivedAmount)}
              </div>
            </div>
            <div className="grid"></div>
          </div>
        </div>
      </>
    ); 
});
CardPayment.displayName='CardPayment';
 export default CardPayment;