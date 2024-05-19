import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useRef, useState } from "react";
import InputSwitchCustom from "../../InputSwitchCustom";
import CashPayment from "./CashPayment";
import CardPayment from "./CardPayment";
import CreditPayment from "./CreditPayment";
import MultiPaymentList from "./MultiPaymentList";
import { Button } from "primereact/button";
import CashPaymentMulti from "./CashPaymentMulti";
import CardPaymentMulti from "./CardPaymentMulti";
import CreditPaymentMulti from "./CreditPaymentMulti";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { PAYMENT_METHODS } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addMultiPayment,
  addSinglePayment,
  clearOrderList,
  clearPayment,
  removePayment,
  setMultiPayment,
} from "../../../state/orderList/orderListSlice";
import FormElementMessage from "../../messges/FormElementMessage";
import { validate } from "../../../utils/formValidation";
import { addOrder } from "../../../functions/register";
import { useToast } from "../../useToast";
import { formatCurrency } from "../../../utils/format";
import Decimal from "decimal.js";
import printReceipt from "../printReceipt/PrintReceipt";
import ReceiptComponent from "../printReceipt/ReceiptComponent";

const PaymentType = ({ paymentTypeName, isSelected, onClick }) => {
  return (
    <div
      className={`col-12 md:col-4 sm:col-4 lg:col-4 xl:col-2 p-1`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className={`shadow-1 hover:shadow-4 surface-card border-round `}>
        <div
          className={`flex justify-content-center flex-wrap p-3 border-round ${
            isSelected ? "bg-primary" : ""
          }`}
        >
          <span className="font-bold">{paymentTypeName}</span>
        </div>
      </div>
    </div>
  );
};

const Payment = ({  }) => {
  const showToast = useToast();

  const [activeIndex, setActiveIndex] = useState(0); // 0 for Single Payment tab
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);

  const { paymentList, isMultiPayment, list, orderSummary,customer } = useSelector(
    (state) => state.orderList
  );
  
  const navigate = useNavigate();

  
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState({
    label: "Payment Method",
    value: PAYMENT_METHODS.CASH,
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  // Handle tab change
  const onTabChange = (e) => {
    setActiveIndex(e.index);
    const isMulti = e.index !== 0; // Assuming 0 is the index for Single Payment
    dispatch(setMultiPayment(isMulti));
  };

  useEffect(() => {
    dispatch(clearPayment());
  }, [isMultiPayment, dispatch]);

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

  const addSinglePaymentToReducer = async () => {
    let paymentData = null;

    let cashPaymentRes = null;
    if (paymentMethod.value === PAYMENT_METHODS.CASH) {
      cashPaymentRes = await cashPaymentRef.current.getValidatedData();
      console.log("Result from child:", cashPaymentRes);
      if (!cashPaymentRes?.allValid) return;

      const { receivedAmount } = cashPaymentRes.fields;

      paymentData = {
        methodId: PAYMENT_METHODS.CASH,
        amountPaid: receivedAmount,
        cashPayment: {
         // receivedAmount: receivedAmount,
          // balanceAmount: 0,
        },
      };
    }

    let cardPaymentRes = null;
    if (paymentMethod.value === PAYMENT_METHODS.CARD) {
      cardPaymentRes = await cardPaymentRef.current.getValidatedData();
      console.log("Result from child:", cardPaymentRes);
      if (!cardPaymentRes?.allValid) return;

      const {
        bankId,
        cardExpirationMonth,
        cardHolderName,
        cardNo,
        cardTypeId,
        receivedAmount,
      } = cardPaymentRes.fields;

      const month = cardExpirationMonth.split("/")[0];
      const year = cardExpirationMonth.split("/")[1];
      paymentData = {
        methodId: PAYMENT_METHODS.CARD,
        amountPaid: receivedAmount,
        cardPayment: {
          cardHolderName: cardHolderName,
          bankId: bankId,
          cardTypeId: cardTypeId,
          cardLastFourDigits: cardNo,
          cardExpirationMonth: month,
          cardExpirationYear: year,
        },
      };
    }
    //   console.log('addMultiPayment', paymentData);
    return paymentData;
  };
  const addMultiPaymentToReducer = async (obj) => {
    let paymentData = null;

    let cashPaymentRes = null;
    if (paymentMethod.value === PAYMENT_METHODS.CASH) {
      cashPaymentRes = obj;
      console.log("Result from child:", cashPaymentRes);
      if (!cashPaymentRes?.allValid) return;

      const { payAmount } = cashPaymentRes.fields;

      paymentData = {
        methodId: PAYMENT_METHODS.CASH,
        amountPaid: payAmount,
        cashPayment: {
          receivedAmount: payAmount,
          // balanceAmount: 0,
        },
      };
    }

    let cardPaymentRes = null;
    if (paymentMethod.value === PAYMENT_METHODS.CARD) {
      cardPaymentRes = obj;
      console.log("Result from child:", cardPaymentRes);
      if (!cardPaymentRes?.allValid) return;

      const {
        bankId,
        cardExpirationMonth,
        cardHolderName,
        cardNo,
        cardTypeId,
        payAmount,
      } = cardPaymentRes.fields;

      const month = cardExpirationMonth.split("/")[0];
      const year = cardExpirationMonth.split("/")[1];
      paymentData = {
        methodId: PAYMENT_METHODS.CARD,
        amountPaid: payAmount,
        cardPayment: {
          cardHolderName: cardHolderName,
          bankId: bankId,
          cardTypeId: cardTypeId,
          cardLastFourDigits: cardNo,
          cardExpirationMonth: month,
          cardExpirationYear: year,
        },
      };
    }
    //   console.log('addMultiPayment', paymentData);
    return paymentData;
  };

  const onSubmit = async () => {
    //const {grandTotal}=orderList.orderSummary;
    setIsPaymentSubmitting(true);

    const {
      overallDiscountTypeId,
      overallDiscountValue,
      overallDiscountReasonId,
      overallDiscountReasonRemark,
    } = orderSummary;

    const payLoad = {
      customerId: customer?.customerId,
      terminalId: 1,
      sessionId: 1,

      orderList: list,
      //paymentList:[paymentList]
      isConfirm: true,
    };
    console.log("listt", list);
    if (orderSummary.overallDiscounts) {
      payLoad.overallDiscounts = {
        overallDiscountTypeId: overallDiscountTypeId,
        overallDiscountValue: overallDiscountValue,
        overallDiscountReasonId: overallDiscountReasonId,
        overallDiscountRemark: overallDiscountReasonRemark,
      };
    }

    if (!isMultiPayment) {
      const paymentData = await addSinglePaymentToReducer();
      console.log("paymentData", paymentData);
      // console.log('addSinglePaymentToReducer', paymentData);
      if (!paymentData) {
        setIsPaymentSubmitting(false);
        return;
      }

      dispatch(addSinglePayment({ paymentData }));
      //console.log('onSubmit:paymentList',paymentData);

      payLoad.paymentList = [paymentData];
    } else {
      //console.log('onSubmit:multi_paymentList',paymentList);
      payLoad.paymentList = paymentList;
    }

 console.log('onSubmit:payLoad',payLoad);
    const res = await addOrder(payLoad, "");
    if (res.data.error) {
      setIsPaymentSubmitting(false);
      const { error } = res.data;
      showToast("error", "Exception", error.message);
    }

    const { orderNo, outputMessage, responseStatus } = res.data.outputValues;
    console.log("addOrder", orderNo);
    setIsPaymentSubmitting(false);
    
    dispatch(clearOrderList({ }));
    navigate(`/paymentConfirm?orderNo=${orderNo}`)
    showToast("success", "Success", outputMessage);
  };

  const cashPaymentRef = useRef();
  const cardPaymentRef = useRef();

  const onSplitPaymentHandler = async (obj) => {
    console.log("onaddpayment", obj);
    const paymentData = await addMultiPaymentToReducer(obj);
    console.log("addMultiPayment", paymentData);
    dispatch(addMultiPayment({ paymentData }));

    // setIsMultiplePayment({...MultiPaymentList})
  };

  const onRemovePaymentHandler = (value) => {
    console.log("onRemovePaymentHandler", value);
    dispatch(removePayment({ id: value }));
  };



  return (
    <div className="grid">
      {/* <div className="col">
        <ReceiptComponent orderId={29} />
      </div> */}
      <div className="col-6 col-offset-3">
        <Tooltip target=".custom-target-icon" />

        <div className="flex align-items-center justify-content-between p-0 gap-5 pr-4 mb-3">
          <Button
            icon="pi pi-chevron-left custom-target-icon"
            rounded
            text
            aria-label="Back"
            tooltip="Back to Home"
            tooltipOptions={{
              position: "bottom",
              mouseTrack: true,
              mouseTrackTop: 15,
            }}
            onClick={()=>{
              navigate('/register')
            }}
            className="p-button-text p-button-plain"
          />
          <h2>Settle Payment</h2>
          <div></div> {/* Placeholder for alignment purposes */}
        </div>

        <div className="flex align-items-center justify-content-between p-0 gap-5 pr-4 mb-3">
          <div className="flex align-items-top justify-content-left mb-3">
            <label
              htmlFor="customAmount-single"
              className="text-xl font-semibold mr-5"
            >
              Grand Total
            </label>
            <span className="text-xl font-normal">
              {" "}
              {formatCurrency(orderSummary.grandTotal)}
            </span>
          </div>
          <div className="flex flex-column">
          <div className="flex align-items-top justify-content-left mb-3">
            <label
              htmlFor="customAmount-single"
              className="text-xl font-semibold mr-5"
            >
              Balance Amount
            </label>
            <span className="text-xl font-normal">
              {orderSummary.cashBalance && formatCurrency(orderSummary.cashBalance)}
            </span>
          </div>

         {orderSummary.shortfall && <div className="flex align-items-top justify-content-left mb-3">
            <label
              htmlFor="customAmount-single"
              className="text-xl font-semibold mr-5"
            >
              Due Amount
            </label>
            <span className="text-xl font-normal">
              {formatCurrency(orderSummary.shortfall)}
            </span>
          </div>}

          </div>
     
      
        </div>
        {orderSummary.cashBalanceException && orderSummary.isRecevedAmountTouched && (
          <FormElementMessage
            className="mt-2 w-full"
            severity="error"
            text={orderSummary.cashBalanceException}
          />
        )}
        <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
          <TabPanel header="Single Payment" leftIcon="">
            <div className="grid">
              <div className="col-12 mb-4">
                <div className="flex flex-wrap">
                  <PaymentType
                    paymentTypeName="Cash"
                    isSelected={paymentMethod.value === PAYMENT_METHODS.CASH}
                    onClick={() => {
                      handleInputChange(
                        setPaymentMethod,
                        paymentMethod,
                        PAYMENT_METHODS.CASH
                      );
                    }}
                  />
                  <PaymentType
                    paymentTypeName="Card"
                    isSelected={paymentMethod.value === PAYMENT_METHODS.CARD}
                    onClick={() => {
                      handleInputChange(
                        setPaymentMethod,
                        paymentMethod,
                        PAYMENT_METHODS.CARD
                      );
                    }}
                  />
                  {/* <PaymentType
                  paymentTypeName="Credit"
                  isSelected={paymentMethod.value === PAYMENT_METHODS.CREDIT}
                  onClick={() => {
                    handleInputChange(
                      setPaymentMethod,
                      paymentMethod,
                      PAYMENT_METHODS.CREDIT
                    );
                  }}
                /> */}
                </div>
                {validationMessages(paymentMethod)}
              </div>
              <div className="col-12 p-2">
                {paymentMethod.value === PAYMENT_METHODS.CASH && (
                  <CashPayment ref={cashPaymentRef} />
                )}

                {paymentMethod.value === PAYMENT_METHODS.CARD && (
                  <CardPayment ref={cardPaymentRef} />
                )}
                {/* {paymentMethod.value === PAYMENT_METHODS.CREDIT && (
                <CreditPayment
                  onClick={(p) => {
                    handleInputChange(
                      setPaymentMethod,
                      amountReceived,
                      p.amount
                    );
                  }}
                />
              )} */}
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Multiple Payments">
            <div className="grid">
              <div className="col-12 mb-4">
                <div className="flex flex-wrap">
                  <PaymentType
                    paymentTypeName="Cash"
                    isSelected={paymentMethod.value === PAYMENT_METHODS.CASH}
                    onClick={() => {
                      handleInputChange(
                        setPaymentMethod,
                        paymentMethod,
                        PAYMENT_METHODS.CASH
                      );
                    }}
                  />
                  <PaymentType
                    paymentTypeName="Card"
                    isSelected={paymentMethod.value === PAYMENT_METHODS.CARD}
                    onClick={() => {
                      handleInputChange(
                        setPaymentMethod,
                        paymentMethod,
                        PAYMENT_METHODS.CARD
                      );
                    }}
                  />
                  {/* <PaymentType
                  paymentTypeName="Credit"
                  isSelected={paymentMethod.value === PAYMENT_METHODS.CREDIT}
                  onClick={() => {
                    handleInputChange(
                      setPaymentMethod,
                      paymentMethod,
                      PAYMENT_METHODS.CREDIT
                    );
                  }}
                /> */}
                </div>
                {validationMessages(paymentMethod)}
              </div>

              <div className="col-12 p-2">
                {paymentMethod.value === PAYMENT_METHODS.CASH && (
                  <CashPaymentMulti
                    onAddPayment={onSplitPaymentHandler}
                    onClick={(p) => {
                      console.log("cashpayment", p.amount);
                      handleInputChange(
                        setAmountReceived,
                        amountReceived,
                        p.amount
                      );
                    }}
                  />
                )}
                {paymentMethod.value === PAYMENT_METHODS.CARD && (
                  <CardPaymentMulti
                    onAddPayment={onSplitPaymentHandler}
                    onClick={(p) => {
                      handleInputChange(
                        setPaymentMethod,
                        amountReceived,
                        p.amount
                      );
                    }}
                  />
                )}
                {/* {paymentMethod.value === PAYMENT_METHODS.CREDIT && (
                <CreditPaymentMulti />
              )} */}
                <MultiPaymentList
                  paymentList={paymentList}
                  onRemovePayment={onRemovePaymentHandler}
                />
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div className="flex justify-content-center">
          {/* <Button
            label="test"
            onClick={() => {
              // Trigger print
              printReceipt(29);
            }}
          /> */}

          <Button
            label={isPaymentSubmitting ? "Submitting..." : "Tender"}
            aria-label="Tender"
            className="p-button-rounded p-button-lg p-button-primary"
            onClick={onSubmit}
            style={{ width: "50%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
