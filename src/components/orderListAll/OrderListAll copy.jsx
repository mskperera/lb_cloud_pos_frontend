
import Customer from "../register/customer/CustomerInfoPanel";
import OrderSummary from "../register/orderSummary/OrderSummary";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addOrder, cancelOverallDiscount, clearOrderList, clearPayment, setCustomer } from "../../state/orderList/orderListSlice";
import { CONTACT_TYPE, DISCOUNT_SCOPE, DISCOUNT_TYPES } from "../../utils/constants";
import ProductOrderList from "../register/orderList/ProductOrderList";
import ApplyDiscount from "../register/ApplyDiscount";
import ProductSearch from "../productSearch/ProductSearch";
import { FaCalendarCheck, FaHistory, FaPause, FaPlusCircle, FaSearch, FaShoppingCart, FaTags, FaTimesCircle, FaUserPlus } from 'react-icons/fa';
import DialogModel from "../model/DialogModel";
import Payment from "../register/payment/Payment";
import PaymentConfirm from "../../pages/paymentConfirm";
import AddCustomProduct from "../register/AddCustomProduct";

import ItemLookup from "../../components/productSearch/ItemLookup";


const OrderListAll = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();
  const dispatch = useDispatch();

  const [loadCount, setLoadCount] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isPaymentConfirmShow, setIsPaymentConfirmShow] = useState(false);

  const [isPaymentShow, setIsPaymentShow] = useState(false);
  const [paymentKey, setPaymentKey] = useState(0);
  const [isItemLookupShow, setIsItemLookupShow] = useState(false);

  
  const { list, orderSummary } = useSelector((state) => state.orderList);

  useEffect(() => {
    if (isPaymentShow) {
      dispatch(clearPayment());
      setPaymentKey((prevKey) => prevKey + 1);
    }
  }, [isPaymentShow, dispatch]);

  const showDiscountPopupHandler = (orderListId) => {
    setLoadCount(loadCount + 1);
    showDiscountPopup(orderListId);
  };

  const showDiscountPopup = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDiscountPopupVisible(true);
  };

  const changeVisibilityHandler = (value) => {
    setIsRightSidebarVisible(value);
  };

  const handleBarcodeEnter = (p) => {
    const description = `${p.productName}`;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

    const order = {
      productNo: p.productNo,
      description,
      productId: p.productTypeId === 2 ? p.variationProductId : p.productId,
      unitPrice,
      productTypeId: p.productTypeId,
      lineTaxRate: p.taxPerc,
      qty,
    };
    dispatch(addOrder(order));
  };

  const handleProductClick = (p) => {
    const description = `${p.productDescription}`;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

    const order = {
      productNo: p.productNo,
      description,
      productId: p.productTypeId === 2 ? p.variationProductId : p.productId,
      unitPrice,
      productTypeId: p.productTypeId,
      lineTaxRate: p.taxPerc,
      qty,
    };
    dispatch(addOrder(order));
  };





  const newOrderHandler = () => {
    dispatch(clearOrderList({}));
    dispatch(setCustomer({ customer: null }));
  };

  const handleCustomItem = async () => {
    const order = {
      productNo: "custom",
      sku: "",
      description: `item test`,
      productId: 0,
      productTypeId: 1,
      unitPrice: "1000",
      lineTaxRate: "0",
      qty: 1,
      measurementUnitName: "custom",
    };
    dispatch(addOrder(order));
  };

  const overallDiscountData = [
    {
      type: orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "Percentage" : "Fixed Amount",
      value: orderSummary.overallDiscountValue,
      symbol: orderSummary.overallDiscountTypeId === DISCOUNT_TYPES.PERCENTAGE ? "%" : "$",
      amount: orderSummary.overallDiscounts,
      overallDiscountReasonId: orderSummary.overallDiscountReasonId,
      overallDiscountReasonName: orderSummary.overallDiscountReasonName,
      overallDiscountReasonRemark: orderSummary.overallDiscountReasonRemark,
    },
  ];
  const totalItems = list.reduce((total, product) => total + product.qty, 0);

  const handlePaymentClose = () => {
    setIsPaymentShow(false);
  };

  return (
    <div className="flex flex-col w-full">
      <ApplyDiscount
        orderListId={selectedOrderId}
        visible={isDiscountPopupVisible}
        onHide={() => setIsDiscountPopupVisible(false)}
        discountScope={DISCOUNT_SCOPE.PRODUCT_LEVEL}
        loadCount={loadCount}
      />

      <DialogModel
        header="Payment"
        visible={isPaymentShow}
        onHide={() => setIsPaymentShow(false)}
        style={{ width: "60vw", maxWidth: "800px" }}
      >
        <Payment
          key={paymentKey}
          showPaymentConfirm={() => {
            setIsPaymentShow(false);
            setIsPaymentConfirmShow(true);
          }}
          setOrderId={setOrderId}
          handlePaymentClose={handlePaymentClose}
        />
      </DialogModel>

      <DialogModel
        header="Payment Confirm"
        visible={isPaymentConfirmShow}
        onHide={() => setIsPaymentConfirmShow(false)}
        fullWidth={true}
        fullHeight={true}
      >
        <PaymentConfirm orderId={orderId} setIsPaymentConfirmShow={setIsPaymentConfirmShow} />
      </DialogModel>






      <div className="flex flex-col gap-3 max-w-7xl mx-auto  overflow-auto ">

          <Customer />

        <div className="overflow-y-auto rounded-lg shadow-sm ">
          <ProductOrderList showDiscountPopup={showDiscountPopupHandler} />
        </div>

        {orderSummary.overallDiscounts > 0 && (
          <div className="flex justify-between items-center h-14 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-700">
              {`Overall Discount: ${overallDiscountData[0].value}${overallDiscountData[0].symbol} - ${overallDiscountData[0].overallDiscountReasonName}`}
            </div>
            <div className="flex justify-end">
              <button
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition duration-200"
                onClick={() => dispatch(cancelOverallDiscount())}
                aria-label="Cancel Overall Discount"
              >
                <FaTimesCircle  className="text-lg" />
                {/* <FontAwesomeIcon icon={faTimesCircle} className="text-lg" /> */}
              </button>
            </div>
          </div>
        )}

          <OrderSummary totalItems={totalItems} />



  <div className="flex flex-wrap gap-4 items-center justify-between">
    {/* Left Side: Secondary Actions */}
    <div className="flex gap-3">
      <button
        onClick={newOrderHandler}
        className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
      >
        New Order
      </button>


    </div>

    {/* Right Side: Primary Action */}
    <button
      onClick={() => setIsPaymentShow(true)}
      disabled={list.length === 0}
      className={`flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${
        list.length === 0
          ? "bg-gray-400 text-gray-200 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 "
      }`}
    >
      <FaShoppingCart className="text-2xl" />
      <span>Proceed to Payment</span>
      {list.length > 0 && (
        <span className="ml-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
          {totalItems} item{totalItems > 1 ? 's' : ''}
        </span>
      )}
    </button>
  </div>





        </div>
      
          </div>

  );
};

export default OrderListAll;

