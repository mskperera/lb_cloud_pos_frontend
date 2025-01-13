import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Customer from "../register/customerInfoPanel/CustomerInfoPanel";
import OrderSummary from "../register/orderSummary/OrderSummary";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import DialogModel from "../model/DialogModel";
import CustomerList from "../customer/CustomerList";
import { getCustomers } from "../../functions/customer";
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

  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);

  const [loadCount, setLoadCount] = useState(0);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);

  const { list, orderSummary, customer } = useSelector(
    (state) => state.orderList
  ); // Adjust the path according to your actual state structure

  const onAddCustomerHandler = () => {
    setShowCustomerList(true);
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
      setIsCustomerLoading(false);
    } catch (err) {
      setIsCustomerLoading(false);
      console.log(err);
    }
  };

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
      lineTaxRate: p.taxRate_perc,
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
      lineTaxRate: p.taxRate_perc,
      qty,
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

  return (
    <div className="flex flex-col bg-slate-50 rounded-xl shadow-sm w-full mt-4 min-h-[80vh]">
      {/* Customer Dialog */}
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

      {/* Apply Discount Popup */}
      <ApplyDiscount
        orderListId={selectedOrderId}
        visible={isDiscountPopupVisible}
        onHide={() => setIsDiscountPopupVisible(false)}
        discountScope={DISCOUNT_SCOPE.PRODUCT_LEVEL}
        loadCount={loadCount}
      />

      {/* Order Section */}
      <div className="flex flex-col gap-2 py-4 flex-grow">
        <div className="flex justify-start gap-4 px-4">
          <ProductSearch onProductSelect={handleProductClick} onBarcodeEnter={handleBarcodeEnter} />
        </div>

        {/* Customer Info */}
        <div className="px-6 mt-2">
          {isCustomerLoading ? (
            <span className="p-2 font-semibold text-gray-500">Loading...</span>
          ) : (
            <Customer
              imageUrl=""
              label={customer ? `${customer?.contactCode} | ${customer?.contactName}` : "Walk-in Customer"}
              onAddCustomer={onAddCustomerHandler}
            />
          )}
        </div>

        {/* Product Order List */}
        <div className="overflow-y-auto max-h-[60vh]">
          <ProductOrderList showDiscountPopup={showDiscountPopupHandler} />
        </div>

        {/* Discount Info */}
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

        {/* Order Summary and Payment */}
        <div className="flex flex-col gap-3 mt-4">
          <OrderSummary />

          <div className="flex gap-3 justify-end items-center px-4">
            <button
              onClick={() => {
                dispatch(clearOrderList({}));
                navigate(`/register/${terminalId}`);
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
  );
};

export default OrderListAll;
