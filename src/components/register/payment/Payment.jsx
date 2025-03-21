
import { useEffect, useRef, useState } from "react";
import CashPayment from "./CashPayment";
import CardPayment from "./CardPayment";
import MultiPaymentList from "./MultiPaymentList";
import CashPaymentMulti from "./CashPaymentMulti";
import CardPaymentMulti from "./CardPaymentMulti";
import { useNavigate } from "react-router-dom";
import { PAYMENT_METHODS } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addMultiPayment,
  clearOrderList,
  clearPayment,
  removePayment,
} from "../../../state/orderList/orderListSlice";
import FormElementMessage from "../../messges/FormElementMessage";
import { validate } from "../../../utils/formValidation";
import { addOrder } from "../../../functions/register";
import { useToast } from "../../useToast";
import { formatCurrency } from "../../../utils/format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import ConfirmDialog from "../../dialog/ConfirmDialog";


const Payment = ({}) => {
  const showToast = useToast();

  const terminalId = JSON.parse(localStorage.getItem('terminalId'));
  const sessionDetails=JSON.parse(localStorage.getItem('sessionDetails'));
  
  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0); // 0 for Single Payment tab


  const { paymentList, isMultiPayment, list, orderSummary,customer } = useSelector(
    (state) => state.orderList
  );
  
  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log('orderSummary',orderSummary)
  },[])

  const [paymentMethod, setPaymentMethod] = useState({
    label: "Payment Method",
    value: "Cash",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [paymentMethodSplit, setPaymentMethodSplit] = useState({
    label: "Payment Method Split",
    value: "Cash",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });




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
    if (paymentMethod.value === "Cash") {
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
    if (paymentMethod.value === "Card") {
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
    if (paymentMethodSplit.value ==="Cash") {
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

      setPaymentMethodSplit({...paymentMethodSplit,value:''})
    }

    let cardPaymentRes = null;
    if (paymentMethodSplit.value ==="Card") {
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

      setPaymentMethodSplit({...paymentMethodSplit,value:''})
    }
    //   console.log('addMultiPayment', paymentData);
    return paymentData;
  };

  const onSubmit = async (isPayConfirmed) => {

    if(!customer && !isPayConfirmed){
    setShowDialog(true);

    return;
    }

    //const {grandTotal}=orderList.orderSummary;
    setIsSubmitting(true);

    const {
      overallDiscountTypeId,
      overallDiscountValue,
      overallDiscountReasonId,
      overallDiscountReasonRemark,
    } = orderSummary;

    const payLoad = {
      customerId: customer?.contactId,
      terminalId: terminalId,
      sessionId: sessionDetails.sessionId,
      storeId:store.storeId,
      orderList: list,
      //paymentList:[paymentList]
      isConfirm: true,
    };
    console.log("payLoad payment", payLoad);
    if (orderSummary.overallDiscounts) {
      payLoad.overallDiscounts = {
        overallDiscountTypeId: overallDiscountTypeId,
        overallDiscountValue: overallDiscountValue,
        overallDiscountReasonId: overallDiscountReasonId,
        overallDiscountRemark: overallDiscountReasonRemark,
      };
    }

      payLoad.paymentList = paymentList;


 console.log('onSubmit:payLoad',payLoad);
    const res = await addOrder(payLoad, "");
    console.log('onSubmit:addOrder', res.data);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      showToast("danger", "Exception", error.message);
      return;
    }

    const { orderId, outputMessage, responseStatus } = res.data.outputValues;
    console.log("addOrder", orderId);

    
    dispatch(clearOrderList({ }));
    navigate(`/paymentConfirm?orderId=${orderId}`)
    showToast("success", "Success", outputMessage);
    setIsSubmitting(false);
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

  const [selectedTab, setSelectedTab] = useState('Single');
  

  useEffect(() => {
    dispatch(clearPayment());
  }, [selectedTab,dispatch]);

  // useEffect(() => {
  //   dispatch(clearPayment());
  // }, [isMultiPayment, dispatch]);


  const [amountReceived,setAmountReceived]=useState(0);

  useEffect(()=>{
    const sum = paymentList.reduce((acc, current) => acc + Number(current.amountPaid), 0);
    setAmountReceived(sum);
  },[paymentList])

  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    setShowDialog(false);

    onSubmit(true);
  };


  const handleCancel = () => {
    setShowDialog(false);

  };

  return (
    <>
    {showDialog && (
        <ConfirmDialog
          isVisible={true}
          message="No customer selected. Continue order as a walk-in customer?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Confirmation"
          severity="info"
        />
      )}

    <div className="flex flex-col gap-1 justify-center items-center py-10">

      <div className="flex justify-center">
        <div
          onClick={() => setSelectedTab("Single")}
          className={`py-2 px-10 rounded-lg cursor-pointer transition-all duration-300 ${
            selectedTab === "Single"
              ? "bg-primaryColor text-white shadow-md"
              : "bg-gray-200 text-primaryColor"
          }`}
        >
          <p className="font-bold">Single</p>
        </div>
        <div
          onClick={() => setSelectedTab("Split")}
          className={`py-2 px-10 rounded-lg cursor-pointer transition-all duration-300 ${
            selectedTab === "Split"
              ? "bg-primaryColor text-white hover:bg-primaryColorHover"
              : "bg-gray-200 text-primaryColor "
          }`}
        >
          <p className="font-bold">Split</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 bg-primary rounded-lg shadow-md w-[60%] text-white">
        <div className="flex flex-row justify-between items-center">
          <div className="flex-[1]">
            <button
              className="btn rounded-full btn-sm"
              onClick={() => {
                navigate(-1);
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Back
            </button>
          </div>
          <div className="justify-center">
            <h2 className="text-2xl font-bold">Payment</h2>
          </div>
          <div className="flex-[1]"></div>
        </div>


        <div className="flex justify-around gap-4">

          <div className="flex flex-col gap-2 items-center font-semibold">
            <p>Amount Due</p>
            <p> {formatCurrency(orderSummary.grandTotal)}</p>
            {/* The total amount that the customer needs to pay for the purchase */}
          </div>

          <div className="flex flex-col gap-2 items-center font-semibold">
            <p>Amount Received</p>
            <p> {formatCurrency(amountReceived)}</p>
            {/* Description: The amount of money received from the customer. */}
          </div>

          <div className="flex flex-col gap-2 items-center font-semibold">
            <p>Change Due</p>
            <p>
              {orderSummary.cashBalance &&
                formatCurrency(orderSummary.cashBalance)}
            </p>
            {/* Description: The amount to be returned to the customer if they pay more than the amount due. */}
          </div>

          <div className="flex flex-col gap-2 items-center font-semibold">
            <p>Remaining Balance</p>
            <p> {formatCurrency(orderSummary.shortfall)}</p>
            {/* Description: The outstanding amount if the received payment is less than the total payable. */}
          </div>
        </div>
      </div>

      <div className="w-[60%] shadow-md border-t border-gray-200 pb-5 pt-5">
        <div className=" p-6 bg-gray-50  rounded-b-lg ">
          {selectedTab === "Single" && (
            <div>
              <div className="flex items-center gap-10">
                {/* Vertical Tabs */}
                <div className="flex flex-col gap-2 flex-1">
                  {["Cash", "Card", "Credit"].map((method) => (
                    <div
                      key={method}
                      onClick={() =>
                        setPaymentMethod({ ...paymentMethod, value: method })
                      }
                      className={`py-4 px-10 font-bold cursor-pointer transition-all duration-300 rounded-lg
                         ${
                           paymentMethod.value === method
                             ? "bg-primaryColor text-white hover:bg-primaryColorHover"
                             : "bg-gray-200 text-primaryColor "
                         }`}
                    >
                      {method}
                    </div>
                  ))}
                </div>
                <div className="flex-[3] ml-4 flex justify-center">
                  {paymentMethod.value === "Cash" && (
                    <CashPayment ref={cashPaymentRef} />
                  )}
                  {paymentMethod.value === "Card" && (
                    <CardPayment ref={cardPaymentRef} />
                  )}
                </div>
              </div>

              {validationMessages(paymentMethod)}
              {orderSummary.cashBalanceException &&
                orderSummary.isRecevedAmountTouched && (
                  <FormElementMessage
                    className="mt-2 w-full"
                    severity="error"
                    text={orderSummary.cashBalanceException}
                  />
                )}
            </div>
          )}

          {selectedTab === "Split" && (
            <div className="flex flex-col gap-10">
              <div className="flex justify-center gap-5">
                <div className="flex items-center gap-4">
   
                  <label className="font-bold">Payment method</label>
                  {/* {JSON.stringify(paymentMethodSplit)} */}
                  <select className="border p-2 rounded" onChange={(e)=>{
                    setPaymentMethodSplit({...paymentMethodSplit,value:e.target.value})
                  }} value={paymentMethodSplit.value}>
                    <option value="">Select a Payment method</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Credit</option>
                  </select>
                </div>
        

                {/* <button className="btn btn-md  bg-primaryColor hover:bg-primaryColorHover text-white" 
              onClick={()=>{
                if(paymentMethodSplit.value==="Cash"){
                  handleInputChange(
                    setPaymentMethod,
                    paymentMethodSplit,
                  "Cash"
                  );
                }
   
              else if(paymentMethodSplit.value==="Card")
                {      
                   handleInputChange(
                  setPaymentMethod,
                  paymentMethodSplit,
                  "Card"
                );
                }
      
              }}>
                  Add New Payment
                </button> */}
              </div>

              {validationMessages(paymentMethodSplit)}


              <div className="">
                  {paymentMethodSplit.value === "Cash" && (
                    <CashPaymentMulti onAddPayment={onSplitPaymentHandler} />
                  )}
                  {paymentMethodSplit.value === "Card" && (
                    <CardPaymentMulti onAddPayment={onSplitPaymentHandler} />
                  )}
            
                  <MultiPaymentList
                    paymentList={paymentList}
                    onRemovePayment={onRemovePaymentHandler}
                  />
             
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            className="btn btn-lg py-4 px-10 bg-primaryColor hover:bg-primaryColorHover font-bold
 text-white rounded-lg"
            onClick={()=>onSubmit(false)}
            disabled={isSubmitting}
            label={isSubmitting ? "Submitting..." : "Tender"}
          >
            Tender
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Payment;
