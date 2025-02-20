import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Customer from "../register/customer/CustomerInfoPanel";
import OrderSummary from "../register/orderSummary/OrderSummary";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addOrder, cancelOverallDiscount, clearOrderList, setCustomer } from "../../state/orderList/orderListSlice";
import { DISCOUNT_SCOPE, DISCOUNT_TYPES } from "../../utils/constants";
import ProductOrderList from "../register/orderList/ProductOrderList";
import ApplyDiscount from "../register/ApplyDiscount";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ProductSearch from "../productSearch/ProductSearch";

const OrderListAll = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();
  const dispatch = useDispatch();


  const [loadCount, setLoadCount] = useState(0);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const { list, orderSummary } = useSelector((state) => state.orderList);



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

  const newOrderHandler=()=>{
  
      dispatch(clearOrderList({}));
      dispatch(setCustomer({ customer: null }));
      navigate(`/register/${terminalId}`);
    
  }
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
  const totalItems = list.reduce((total, product) => total + product.qty, 0); // Calculate the total number of items

  return (
    <div className="flex flex-col w-full">
    

      <ApplyDiscount
        orderListId={selectedOrderId}
        visible={isDiscountPopupVisible}
        onHide={() => setIsDiscountPopupVisible(false)}
        discountScope={DISCOUNT_SCOPE.PRODUCT_LEVEL}
        loadCount={loadCount}
      />

      <div className="flex flex-col gap-2 flex-grow">
        <div className="">
          <ProductSearch onProductSelect={handleProductClick} onBarcodeEnter={handleBarcodeEnter} />
        </div>

        <div className="">
            <Customer />
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <ProductOrderList showDiscountPopup={showDiscountPopupHandler} />
        </div>

        {orderSummary.overallDiscounts > 0 && (
          <div className="flex justify-between gap-2 items-center h-12 bg-gray-50 rounded-md shadow-md mt-4">
            <div className="flex-2 px-4 text-sm text-gray-800">
              {`Overall Discount: ${overallDiscountData[0].value} (${overallDiscountData[0].symbol})  ${overallDiscountData[0].overallDiscountReasonName}`}
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className="bg-transparent border-none p-2 cursor-pointer hover:bg-gray-200 rounded"
                onClick={() => dispatch(cancelOverallDiscount())}
              >
                <FontAwesomeIcon icon={faTimesCircle} className="text-lg text-gray-700" />
              </div>
            </div>
          </div>
        )}


        <div className="flex flex-col gap-3 mt-2">
        
          <OrderSummary totalItems={totalItems} />

          <div className="flex gap-3 justify-end items-center px-4">
           
           
            <button
              onClick={newOrderHandler}
              className="btn bg-white shadow-sm border-gray-200 btn-lg h-auto py-4 px-5 rounded-full"
            >
              <span className="px-2">New Order</span>
            </button>
            <button
              onClick={() => {
                navigate("/payment");
              }}
              disabled={list.length === 0}
              className="btn flex justify-center text-white hover:bg-sky-600 bg-sky-500 shadow-sm btn-lg h-auto py-4 px-5 rounded-full"
              >
              <i
                className="pi text-xl pi-shopping-cart"
              ></i>
              <span className="">Proceed to Payment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListAll;
