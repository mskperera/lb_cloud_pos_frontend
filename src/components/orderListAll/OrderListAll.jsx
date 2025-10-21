
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
import { FaShoppingCart, FaTimesCircle } from 'react-icons/fa';
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
   const [isAddCustomProductShow, setIsAddCustomProductShow] = useState(false);
  const [isPaymentShow, setIsPaymentShow] = useState(false);
  const [paymentKey, setPaymentKey] = useState(0);

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
    <div className="flex flex-col w-full min-h-screen p-6">
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

      <div className="flex flex-col gap-4 max-w-7xl mx-auto">


 <DialogModel
        header="Add Custom Product"
        visible={isAddCustomProductShow}
        onHide={() => setIsAddCustomProductShow(false)}
      >
        <AddCustomProduct visible={isAddCustomProductShow} onClose={()=>{
          setIsAddCustomProductShow(false);
        }}  />
      </DialogModel>

        <div>
          <Customer />
        </div>

        <div className="overflow-y-auto max-h-[60vh] rounded-lg shadow-sm">
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

        <div className="flex flex-col gap-4 mt-4">
          <OrderSummary totalItems={totalItems} />
          <div className="flex gap-4 justify-between">
        
          <ItemLookup hideSearchBox={true} onProductSelect={handleProductClick} onBarcodeEnter={handleBarcodeEnter} />
              <button
          type="button"
          onClick={()=>{
            setIsAddCustomProductShow(true);
          }}
           className="flex items-center px-4 font-bold py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
        >
          Custom Item
     
        </button>
   

            <button
              onClick={newOrderHandler}
              className="btn bg-gradient-to-r from-sky-600 to-sky-600 text-white font-semibold border-none h-auto py-4 px-6 rounded-md shadow-sm hover:shadow-lg hover:from-sky-700 hover:to-sky-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform"
            >
              <span className="px-2 text-md">New Order</span>
            </button>
            <button
              onClick={() => setIsPaymentShow(true)}
              disabled={list.length === 0}
              className={`btn flex justify-center items-center gap-3 bg-[#008a5d] text-white font-semibold h-auto py-5 px-4 rounded-lg shadow-sm transition-all duration-200 transform ${
                list.length === 0
                  ? "text-white opacity-80 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r  hover:to-sky-800 hover:shadow-lg hover:scale-105"
              }`}
            >
              <FaShoppingCart className="text-2xl" />
              <span className="text-md">Proceed to Payment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListAll;

