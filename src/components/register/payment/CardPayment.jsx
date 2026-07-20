
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { validate } from "../../../utils/formValidation";
import FormElementMessage from "../../messges/FormElementMessage";
import { useDispatch, useSelector } from "react-redux";
import { addSinglePayment, calculateBalance } from "../../../state/orderList/orderListSlice";
import ExpirationDateInput from "../../textInput/ExpirationDateInput";
import CardType from "./CardType";
import { CURRENCY_DISPLAY_TYPE, PAYMENT_METHODS } from "../../../utils/constants";
import { getCurrency } from "../../../utils/format";

const CardPayment = forwardRef((props, ref) => {
  const dispatch = useDispatch();

    const { orderSummary } = useSelector(
    (state) => state.orderList
  );

  const cardTypes = [
    { id: 1, name: "VISA" },
    { id: 2, name: "MASTER" },
    { id: 3, name: "AMEX" },
  ];
  const [receivedAmount, setReceivedAmount] = useState({
    label: "Amount",
    value: orderSummary?.grandTotal,
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  const [cardHolderName, setCardHolderName] = useState({
    label: "Card Holder Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  const [bank, setBank] = useState({
    label: "Bank",
    value: "1",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  const [cardType, setCardType] = useState({
    label: "Card Type",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });
  const [cardNo, setCardNo] = useState({
    label: "Card Number",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });
  const [cardExpirationMonth, setCardExpirationMonth] = useState({
    label: "Expiration Month",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "cardExpiration" },
  });



  const validationMessages = (state) => {
    if (!state.isValid && state.isTouched) {
      const messages =
        state.label === "Card Type"
          ? ["Please choose Visa, Mastercard, or AMEX before completing the payment."]
          : state.validationMessages?.length
          ? state.validationMessages
          : [`${state.label} is required`];

      return (
        <div>
          {messages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="mt-2"
              severity="error"
              text={message}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  const handleInputChange = (setState, state, value) => {
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
    const states = [cardType, bank, cardNo, cardHolderName, cardExpirationMonth, receivedAmount];
    const updatedStates = states.map((state) => {
      const validation = validate(state.value, state);
      return {
        ...state,
        isValid: validation.isValid,
        isTouched: true,
        validationMessages: validation.messages,
      };
    });
    setCardType(updatedStates[0]);
    setBank(updatedStates[1]);
    setCardNo(updatedStates[2]);
    setCardHolderName(updatedStates[3]);
    setCardExpirationMonth(updatedStates[4]);
    setReceivedAmount(updatedStates[5]);
    return updatedStates.every((state) => state.isValid);
  };

  useEffect(() => {
    const isRecevedAmountTouched = receivedAmount.isTouched;
    dispatch(calculateBalance({ receivedAmountCard: receivedAmount.value, receivedAmountCash: 0, isRecevedAmountTouched }));
  }, [receivedAmount, dispatch]);

  useImperativeHandle(ref, () => ({
    getValidatedData: () => {
      return new Promise((resolve) => {
        const allValid = validateAll();
        if (!allValid) {
          console.error("Validation errors", { cardType });
          resolve({ allValid, fields: null });
          return;
        }
        resolve({
          allValid,
          fields: {
            cardTypeId: cardType.value,
            bankId: bank.value,
            cardNo: cardNo.value,
            cardHolderName: cardHolderName.value,
            cardExpirationMonth: cardExpirationMonth.value,
            receivedAmount: receivedAmount.value,
          },
        });
      });
    },
  }));

  const onchangHandler = useCallback(async () => {
    const month = cardExpirationMonth.value.split("/")[0];
    const year = cardExpirationMonth.value.split("/")[1];
    const paymentData = {
      methodId: PAYMENT_METHODS.CARD,
      amountPaid: receivedAmount.value,
      cardPayment: {
        cardHolderName: cardHolderName.value,
        bankId: 0,
        cardTypeId: cardType.value,
        cardLastFourDigits: cardNo.value,
        cardExpirationMonth: month,
        cardExpirationYear: year,
      },
    };
    console.log("addSinglePayment", paymentData);
    dispatch(addSinglePayment({ paymentData }));
  }, [cardExpirationMonth.value, cardHolderName.value, cardNo.value, cardType.value, dispatch, receivedAmount.value]);

  useEffect(() => {
    if (receivedAmount.value) onchangHandler();
  }, [onchangHandler, receivedAmount.value]);

return (
  <div className="max-w-4xl mx-auto px-3">
    <div className="space-y-6">

      {/* Card Type + Last 4 Digits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Card Type */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Card Type
          </label>

          <div className="flex gap-3 flex-wrap">
            {cardTypes.map((type) => (
              <CardType
                key={type.id}
                type={type}
                isSelected={cardType.value === type.id}
                onClick={() =>
                  handleInputChange(
                    setCardType,
                    cardType,
                    type.id
                  )
                }
              />
            ))}
          </div>

          {validationMessages(cardType)}
        </div>


        {/* Last 4 Digits */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Last 4 Digits
          </label>

          <input
            type="text"
            maxLength={4}
            value={cardNo.value}
            placeholder="1234"
            onChange={(e) =>
              handleInputChange(
                setCardNo,
                cardNo,
                e.target.value
              )
            }
            className="
              w-full
              h-11
              rounded-lg
              border
              border-slate-300
              px-3
              text-center
              tracking-[0.5em]
              font-semibold
              focus:outline-none
              focus:ring-2
              focus:ring-sky-500
            "
          />

          {validationMessages(cardNo)}
        </div>

      </div>



      {/* Card Holder + Expiration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


        {/* Card Holder */}
        <div className="md:col-span-2 space-y-2">

          <label className="block text-sm font-semibold text-slate-700">
            Card Holder Name
          </label>


          <input
            type="text"
            value={cardHolderName.value}
            placeholder="Enter card holder name"
            onChange={(e) =>
              handleInputChange(
                setCardHolderName,
                cardHolderName,
                e.target.value
              )
            }
            className="
              w-full
              h-11
              rounded-lg
              border
              border-slate-300
              px-3
              focus:outline-none
              focus:ring-2
              focus:ring-sky-500
            "
          />

          {validationMessages(cardHolderName)}

        </div>



        {/* Expiration aligned under Last 4 Digits */}
        <div className="space-y-2">

          <label className="block text-sm font-semibold text-slate-700">
            Expiration (MM/YY)
          </label>


       <ExpirationDateInput
  value={cardExpirationMonth.value}
  onChange={(value) =>
    handleInputChange(
      setCardExpirationMonth,
      cardExpirationMonth,
      value
    )
  }
  className="
    w-full
    h-11
    rounded-lg
    border
    border-slate-300
    px-3
    text-center
    focus:outline-none
    focus:ring-2
    focus:ring-sky-500
  "
/>

          {validationMessages(cardExpirationMonth)}

        </div>


      </div>




      {/* Payment Summary */}
      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          px-6
          py-5
          flex
          items-center
          justify-between
        "
      >

        <div>
        

       <p className=" font-semibold text-slate-800">
  Payment Amount
</p>
        </div>



        <div className="text-right">

          {/* <p className="text-xs uppercase tracking-wide text-emerald-700">
            Amount To Charge
          </p> */}


          <p className="text-xl font-bold text-gray-700">
                      {getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}{" "}
            {Number(receivedAmount.value || 0).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

        </div>

      </div>


    </div>
  </div>
);

});

CardPayment.displayName = 'CardPayment';
export default CardPayment;
