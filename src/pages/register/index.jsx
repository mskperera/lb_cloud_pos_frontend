import { Button } from "primereact/button";
import Rightsidebar from "../../components/LeftSidebar";
import { useEffect, useState } from "react";
import Customer from "../../components/register/customerInfoPanel/CustomerInfoPanel";
import ProductOrderList from "../../components/register/orderList/ProductOrderList";
import ProductList from "../../components/register/productList/ProductList";
import { useDispatch, useSelector } from "react-redux";
import ApplyDiscount from "../../components/register/ApplyDiscount";
import { DISCOUNT_SCOPE, DISCOUNT_TYPES } from "../../utils/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Payment from "../../components/register/payment/Payment";
import CustomerList from "../../components/customer/CustomerList";
import {
  addReturnedProduct,
  cancelOverallDiscount,
  clearOrderList,
  setCustomer,
} from "../../state/orderList/orderListSlice";
import { getCustomers } from "../../functions/customer";
import "./register.css";
import OrderSummary from "../../components/register/orderSummary/OrderSummary";
import DialogModel from "../../components/model/DialogModel";
import ReturnOrder from "../../components/returnOrder/ReturnOrderComp";
import HOCSession from "../../hocComponents/WrapperSession";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileText, faStickyNote, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();

  const dispatch = useDispatch();
  const { voidOrderVisible } = useSelector((state) => state.popup);
  const { list, orderSummary, customer } = useSelector(
    (state) => state.orderList
  ); // Adjust the path according to your actual state structure

  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadCount, setLoadCount] = useState(0);

  const [showCustomerList, setShowCustomerList] = useState(false);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);

  const [isReturnOrderPopupVisible, setIsReturnOrderPopupVisible] =
    useState(false);

   const overallDiscountData = [{
        type: orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "Percentage" : "Fixed Amount",
        value: orderSummary.overallDiscountValue,
        symbol: orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "%" : "$",
        amount: orderSummary.overallDiscounts, // The calculated discount amount
        //discountReason:orderSummary.overallDiscountReason,
        overallDiscountReasonId:orderSummary.overallDiscountReasonId,
        overallDiscountReasonName:orderSummary.overallDiscountReasonName,
        overallDiscountReasonRemark:orderSummary.overallDiscountReasonRemark,
      }];


  const showDiscountPopup = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDiscountPopupVisible(true);
  };
  const changeVisibilityHandler = (value) => {
    setIsRightSidebarVisible(value);
  };

  const [showPayment, setShowPayment] = useState(false);

  const showDiscountPopupHandler = (orderListId) => {
    setLoadCount(loadCount + 1);
    showDiscountPopup(orderListId);
  };

  const PaymentScreen = () => {
    return (
      <div className="flex flex-1 align-item-center justify-content-center m-5">
        <Payment
          onClickBack={() => {
            setShowPayment(false);
          }}
        />
      </div>
    );
  };

  const onCustomerSelectHandler = (customerId) => {
    setShowCustomerList(false);
    loadCustomer(customerId);
  };

  const loadCustomer = async (id) => {
    try {
      setIsCustomerLoading(true);
      const ress = await getCustomers({
        customerId: id,
        customerCode: null,
        customerName: null,
        email: null,
        mobile: null,
        tel: null,
        whatsappNumber: null,
        searchByKeyword: false,
      });

      const customer = ress.data.results[0][0];
      dispatch(setCustomer({ customer }));
      // setSelectedCustomer(`${customer?.customerCode} | ${customer?.customerName}`);
      setIsCustomerLoading(false);
    } catch (err) {
      setIsCustomerLoading(false);
      console.log(err);
    }
  };

  const addReturnedProductsHandler = (products) => {
    dispatch(addReturnedProduct({ returnedProducts: products }));
  };

  const onAddCustomerHandler = () => {
    setShowCustomerList(true);
  };

  
  return (
    <HOCSession terminalId={terminalId}>
      <ApplyDiscount
        orderListId={selectedOrderId}
        visible={isDiscountPopupVisible}
        onHide={() => setIsDiscountPopupVisible(false)}
        discountScope={DISCOUNT_SCOPE.PRODUCT_LEVEL}
        loadCount={loadCount}
      />

      <DialogModel
        header="Return Order"
        visible={isReturnOrderPopupVisible}
        maximizable
        maximized={true}
        style={{ width: "50vw" }}
        onHide={() => setIsReturnOrderPopupVisible(false)}
      >
        <ReturnOrder onAddReturnedProducts={addReturnedProductsHandler} />
      </DialogModel>

      <DialogModel
        header="Select Customer"
        visible={showCustomerList}
        maximizable
        maximized={true}
        style={{ width: "50vw" }}
        onHide={() => setShowCustomerList(false)}
      >
        <CustomerList selectingMode={true} onselect={onCustomerSelectHandler} />
      </DialogModel>
      <div className="bg-white px-7">
        <div className="flex items-start justify-between gap-2 py-3">
          {showPayment ? (
            <PaymentScreen />
          ) : (
            <>
              <div className="flex flex-[5] py-2 gap-2 w-full">
                <div className=" pr-2">
                  <Rightsidebar
                    // onChangeVisibility={changeVisibilityHandler}
                    //  visible={isRightSidebarVisible}
                    setIsReturnOrderPopupVisible={setIsReturnOrderPopupVisible}
                  />
                </div>
                <div className="flex flex-col h-[85vh] w-full">
                  <div className="flex-grow overflow-auto">
                    <div className="flex flex-col gap-2">
                      <div className="flex border-1  items-center">
                        <div className="flex flex-1">
                          {isCustomerLoading ? (
                            <p>loading...</p>
                          ) : (
                            <Customer
                              imageUrl=""
                              label={
                                customer ?
                                `${customer?.contactCode} | ${customer?.contactName}`:"walk-in customer"
                              }
                              onAddCustomer={onAddCustomerHandler}
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-row-reverse">
                          <div className="btn  flex px-2 items-center bg-transparent ">
                            <FontAwesomeIcon
                              icon={faFileText}
                              className=" text-lg text-gray-700"
                            />

                            <div className=" text-gray-700">Add Note</div>
                          </div>
                        </div>
                      </div>{" "}
                      <ProductOrderList
                        showDiscountPopup={showDiscountPopupHandler}
                      />
                    </div>
                  </div>

                  {orderSummary.overallDiscounts > 0 && (
                    <div className="flex justify-between gap-2 items-center h-10 bg-slate-200 rounded-md shadow-sm">
                      <div className="flex-2 px-4">{`Overall Discount : ${overallDiscountData[0].value} (${overallDiscountData[0].symbol})  ${overallDiscountData[0].overallDiscountReasonName}`}</div>
                      <div className="flex-1 flex justify-end">
                        <div
                          className="bg-transparent border-none p-2 cursor-pointer"
                          onClick={() => dispatch(cancelOverallDiscount())}
                          rounded
                        >
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className=" text-lg text-gray-700"
                          />
                        </div>
                      </div>
                      {/* {JSON.stringify(overallDiscountData[0])} */}
                    </div>
                  )}

                  <div className="flex-none h-[12rem]">
                    <div className=" flex flex-col justify-between gap-5 border-t-2 border-gray-200">
                      <OrderSummary />
                      <div className="flex gap-3 justify-end items-center px-2 ">
                        {/* <button
                          className="btn btn-lg h-auto shadow-none py-4 px-5 rounded-full border-none hover:bg-primaryColor hover:text-base-100"
                          onClick={() => {
                            changeVisibilityHandler(true);
                          }}
                          rounded
                        >
                          <i
                            className="pi pi-bars px-2"
                            style={{ fontSize: "25px" }}
                          ></i>
                          <span className="px-2">Menu</span>
                        </button> */}

<button
                          onClick={() => {
                            dispatch(clearOrderList({ }));
                            navigate(`/register/${terminalId}`)
                          }}
                          className="btn btn-lg h-auto shadow-none py-4 px-5 rounded-full border-none"
                        >
                      
                          <span className="px-2">New Order</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/payment");
                          }}
                          disabled={list.length === 0}
                          className="btn btn-lg h-auto shadow-none py-4 px-10 rounded-full border-none bg-primaryColor text-base-100"
                        >
                          <i
                            className="pi pi-shopping-cart px-2"
                            style={{ fontSize: "20px", fontWeight: "bold" }}
                          ></i>
                          <span className="px-2">Pay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-[6] ">
                <ProductList />
              </div>
            </>
          )}
        </div>
      </div>
    </HOCSession>
  );
};

export default Register;
