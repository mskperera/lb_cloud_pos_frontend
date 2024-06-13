import { Button } from "primereact/button"
import Rightsidebar from "../../components/LeftSidebar"
import {useState } from "react"
import Customer from "../../components/register/customerInfoPanel/CustomerInfoPanel"
import ProductOrderList from "../../components/register/orderList/ProductOrderList"
import ProductList from "../../components/register/productList/ProductList"
import { useDispatch, useSelector } from "react-redux"
import ApplyDiscount from "../../components/register/ApplyDiscount"
import { DISCOUNT_SCOPE } from "../../utils/constants"
import { useNavigate } from "react-router-dom"
import Payment from "../../components/register/payment/Payment"
import CustomerList from "../../components/customer/CustomerList"
import { addReturnedProduct, setCustomer } from "../../state/orderList/orderListSlice"
import { getCustomers } from "../../functions/customer"
import './register.css';
import OrderSummary from "../../components/register/orderSummary/OrderSummary"
import DialogModel from "../../components/model/DialogModel"
import ReturnOrder from "../../components/returnOrder/ReturnOrderComp"
import OrderVoidRemark from "../../components/register/OrderVoidRemark"
import { setVoidOrderVisible } from "../../state/popup/popupSlice"

const Register=()=>{
 
  const navigate=useNavigate();

  const dispatch=useDispatch();
  const {voidOrderVisible}=useSelector(state=>state.popup);
  const {list,orderSummary,customer} = useSelector(state => state.orderList); // Adjust the path according to your actual state structure




    const [isRightSidebarVisible,setIsRightSidebarVisible]=useState(false);

    const [isDiscountPopupVisible, setIsDiscountPopupVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [loadCount, setLoadCount] = useState(0);

    const [showCustomerList,setShowCustomerList]=useState(false);
    const [isCustomerLoading,setIsCustomerLoading]=useState(false);

    const [isReturnOrderPopupVisible, setIsReturnOrderPopupVisible] = useState(false);


    const showDiscountPopup = (orderId) => {
      setSelectedOrderId(orderId);
      setIsDiscountPopupVisible(true);
  };
    const changeVisibilityHandler=(value)=>{
        setIsRightSidebarVisible(value);
    }


    
const [showPayment,setShowPayment]=useState(false);

const showDiscountPopupHandler=(orderListId)=>{
  setLoadCount(loadCount+1)
  showDiscountPopup(orderListId);
}


const PaymentScreen=()=>{
 return  <div  className="flex flex-1 align-item-center justify-content-center m-5"><Payment onClickBack={()=>{
  setShowPayment(false);
 }} /></div>
}

const onCustomerSelectHandler=(customerId)=>{
setShowCustomerList(false);
loadCustomer(customerId);
}





const loadCustomer=async(id)=>{
  try{
  setIsCustomerLoading(true);
  const ress=await  getCustomers({
    customerId:id,
    customerCode: null,
    customerName: null,
    email:null,
    mobile:null,
    tel:null,
    whatsappNumber:null,
    searchByKeyword:false
    });
    
    const customer=ress.data.results[0][0];
    dispatch(setCustomer({customer}));
   // setSelectedCustomer(`${customer?.customerCode} | ${customer?.customerName}`);
    setIsCustomerLoading(false);
  }
  catch(err){
    setIsCustomerLoading(false);
    console.log(err);
  }
}

const addReturnedProductsHandler=(products)=>{

  dispatch(addReturnedProduct({returnedProducts:products}))

}
const onAddCustomerHandler=()=>{
  setShowCustomerList(true)
}
    return (
      <>
        <Rightsidebar
          onChangeVisibility={changeVisibilityHandler}
          visible={isRightSidebarVisible}
          setIsReturnOrderPopupVisible={setIsReturnOrderPopupVisible}
        />
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
          <CustomerList
            selectingMode={true}
            onselect={onCustomerSelectHandler}
          />
        </DialogModel>

        <div className="flex items-start justify-between gap-2 py-2 px-4">
          {showPayment ? (
            <PaymentScreen />
          ) : (
            <>
              <div className="flex flex-col flex-[3] py-2 gap-2">
                <div className="flex flex-col h-[87vh]">
                <div className="flex-grow overflow-auto">
                    <div className="flex flex-col gap-2">
                      {isCustomerLoading ? (
                        <p>loading...</p>
                      ) : (
                        <Customer
                          imageUrl=""
                          label={
                            customer &&
                            `${customer?.customerCode} | ${customer?.customerName}`
                          }
                          onAddCustomer={onAddCustomerHandler}
                        />
                      )}

                      <ProductOrderList
                        showDiscountPopup={showDiscountPopupHandler}
                      />
                    </div>
                    </div>
                    <div className="flex-none h-[14rem]">
                    <div className=" flex flex-col justify-center gap-5">
                      <OrderSummary />
                      <div className="flex gap-3 justify-between items-center px-2 ">
                        <button
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
                        </button>

                        <button
                          onClick={() => {
                            navigate("/payment");
                          }}
                          className="btn btn-lg h-auto shadow-none py-4 px-5 rounded-full border-none bg-primaryColor text-base-100"
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

              <div className="flex-[5] ">
                <ProductList />
              </div>
            </>
          )}
        </div>
      </>
    );
}

export default Register;