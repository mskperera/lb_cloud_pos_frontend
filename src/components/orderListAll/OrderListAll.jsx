
import Customer from "../register/customer/CustomerInfoPanel";
import OrderSummary from "../register/orderSummary/OrderSummary";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addOrder, cancelOverallDiscount, clearOrderList, clearPayment, setCustomer } from "../../state/orderList/orderListSlice";
import { CONTACT_TYPE, DISCOUNT_SCOPE, DISCOUNT_TYPES } from "../../utils/constants";
import ProductOrderList from "../register/orderList/ProductOrderList";
import ApplyDiscount from "../register/ApplyDiscount";
import { FaTimesCircle } from 'react-icons/fa';
import DialogModel from "../model/DialogModel";
import Payment from "../register/payment/Payment";
import PaymentConfirm from "../../pages/paymentConfirm";
import AddCustomProduct from "../register/AddCustomProduct";

import { ShoppingCartIcon, UserIcon, Wallet } from "lucide-react";
import DialogModel2 from "../model/DialogModel2";

const OrderListAll = ({ isTraditionalMode = false, onOrderSubmit }) => {
  const navigate = useNavigate();
  let { terminalId } = useParams();
  const dispatch = useDispatch();

  const orderList=useSelector((state) => state.orderList.list);

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
  <>
      <ApplyDiscount
        orderListId={selectedOrderId}
        visible={isDiscountPopupVisible}
        onHide={() => setIsDiscountPopupVisible(false)}
        discountScope={DISCOUNT_SCOPE.PRODUCT_LEVEL}
        loadCount={loadCount}
      />

      <DialogModel
        header="Pay"
        visible={isPaymentShow}
        onHide={() => setIsPaymentShow(false)}
        style={{ width: "60vw", maxWidth: "800px" }}
      >
        <Payment
          key={paymentKey}
          showPaymentConfirm={(value) => {
            setIsPaymentShow(false);
            setIsPaymentConfirmShow(true);
            
            if(value){
                 onOrderSubmit();
            }
          }}
          setOrderId={setOrderId}
          handlePaymentClose={handlePaymentClose}
        />
      </DialogModel>

      <DialogModel2
        title="Payment Receipt"
        isVisible={isPaymentConfirmShow}
        onHide={() => setIsPaymentConfirmShow(false)}
      >

     <PaymentConfirm orderId={orderId} setIsPaymentConfirmShow={setIsPaymentConfirmShow} />

      </DialogModel2>

    <div style={{width: isTraditionalMode ? "100%" : "var(--lpos-cart-w)", background:"var(--lpos-surface)",borderLeft: isTraditionalMode ? "none" : "1px solid var(--lpos-border)",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0, margin: isTraditionalMode ? "0 auto" : "0", maxWidth: isTraditionalMode ? "1200px" : "none"}} className="lpos-cart">
   

       <Customer />

    <ProductOrderList showDiscountPopup={showDiscountPopupHandler} isTraditionalMode={isTraditionalMode} />
   

        {orderSummary.overallDiscounts > 0 && (
          <div className="flex justify-between items-center h-14 bg-white rounded-lg shadow-sm border border-gray-200 p-4" style={{ margin: isTraditionalMode ? "12px 16px 0" : "0" }}>
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



{
isTraditionalMode ? (

  // ==============================
  // Traditional POS Footer
  // ==============================

  <div
    className="
      flex
      items-center
      justify-end
      gap-3
      px-4
      py-3
      flex-shrink-0
      bg-white
      border-t
      border-slate-200
    "
  >

    <button
      onClick={newOrderHandler}

      className="
        w-28
        h-11
        rounded-lg
        border
        border-slate-300
        bg-white
        text-slate-700
        text-sm
        font-bold

        hover:bg-slate-50
        hover:border-slate-400

        transition-all
      "
    >
      New
    </button>



    <button
      onClick={() => setIsPaymentShow(true)}

      disabled={list.length === 0}

      className="
        relative

        w-40
        h-11

        rounded-lg

        bg-sky-600

        text-white

        text-sm

        font-bold

        flex
        items-center
        justify-center
        gap-2

        disabled:opacity-50
        disabled:cursor-not-allowed

        hover:bg-sky-700

        transition-all
      "
    >

      <Wallet size={17}/>

      PAY


      {
      totalItems > 0 &&
      <span
        className="
          absolute
          right-3

          bg-white/25

          px-2
          py-0.5

          rounded-full

          text-[11px]
        "
      >
        {totalItems}
      </span>
      }


    </button>


  </div>


) : (


  // ==============================
  // Card POS Footer
  // ==============================


<div
  className={`
    flex
    items-center
    gap-3
    flex-shrink-0
    ${
      isTraditionalMode
      ? "justify-end px-4 py-3"
      : "px-5 py-3"
    }
  `}
>


          <button 
            onClick={newOrderHandler}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: "var(--lpos-radius-sm)",
              border: "1.5px solid var(--lpos-border)",
              background: "var(--lpos-surface)",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--lpos-text-secondary)",
              cursor: "pointer",
              transition: "all .15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--lpos-text-secondary)";
              e.currentTarget.style.color = "var(--lpos-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--lpos-border)";
              e.currentTarget.style.color = "var(--lpos-text-secondary)";
            }}
          >
            New
          </button>

      <button 
  onClick={() => setIsPaymentShow(true)}
  disabled={list.length === 0}
  className="lpos-btn-proceed"
  style={{
    flex: 2,
    padding: 12,
    borderRadius: "var(--lpos-radius-sm)",
    border: "none",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 700,
    color: "white",
    cursor: list.length === 0 ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    opacity: list.length === 0 ? 0.7 : 1
  }}
>
  {/* Main button content */}
  <span
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8
    }}
  >
    <Wallet size={18} />
    PAY
  </span>

  {/* Item count badge */}
  {totalItems > 0 && (
    <span
      style={{
        position: "absolute",
        right: 12,
        background: "rgba(255,255,255,0.25)",
        color: "white",
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 20,
        lineHeight: "16px"
      }}
    >
      {totalItems} Items
    </span>
  )}
</button>
        </div>

)
}
      </div>
</>
  );
};

export default OrderListAll;

