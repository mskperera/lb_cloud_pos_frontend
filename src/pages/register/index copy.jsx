import { Button } from "primereact/button"
import Rightsidebar from "../../components/LeftSidebar"
import {useState } from "react"
import Customer from "../../components/register/customer/CustomerInfoPanel"
import ProductOrderList from "../../components/register/orderList/ProductOrderList"
import ProductList from "../../components/register/productList/ProductList"
import { useDispatch, useSelector } from "react-redux"
import ApplyDiscount from "../../components/register/ApplyDiscount"
import { DISCOUNT_SCOPE } from "../../utils/constants"
import { useNavigate } from "react-router-dom"
import Payment from "../../components/register/payment/Payment"
import CustomerList from "../../components/customer/CustomerList"
import { addReturnedProduct, setCustomer } from "../../state/orderList/orderListSlice"
import './register.css';
import OrderSummary from "../../components/register/orderSummary/OrderSummary"
import DialogModel from "../../components/model/DialogModel"
import ReturnOrder from "../../components/returnOrder/ReturnOrderComp"
import OrderVoidRemark from "../../components/register/OrderVoidRemark"
import { setVoidOrderVisible } from "../../state/popup/popupSlice"
import { getContacts } from "../../functions/contacts"

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
  const ress=await  getContacts({
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
          <ReturnOrder onAddReturnedProducts={addReturnedProductsHandler}/>
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

        <div className="flex items-center justify-between gap-2 py-2 px-4 h-700 bg-blue-950">
          {showPayment ? (
            <PaymentScreen />
          ) : (
            <>



              <div className="flex-5 h-500 bg-blue-600">
            

            
                {/* <div className="productOrderList">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >

                    <div style={{marginTop:'15px'}}>
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
                    </div>

                   <ProductOrderList
                      showDiscountPopup={showDiscountPopupHandler}
                    /> 
                  </div>
                </div>

                <div className="productOrderBottom">
                  <OrderSummary />
                  <div
                    style={{ display: "flex", gap: "20px", alignItems: "end" }}
                  >
                    <div style={{ flex: 1 }}>
                      <Button
                        aria-label="Menu"
                        className="text-color-primary"
                        onClick={() => {
                          changeVisibilityHandler(true);
                        }}
                        text
                        rounded
                      >
                        <i
                          className="pi pi-bars px-2"
                          style={{ fontSize: "25px" }}
                        ></i>
                        <span className="px-2">Menu</span>
                      </Button>
                    </div>

                    <div style={{ flex: 1 }}>
                      <Button
                        aria-label="Pay"
                      className="button-primary"
                        disabled={!list.length > 0}
                        onClick={() => {
                          navigate("/payment");
                        }}

                        style={{
                          width: "100%",
                          padding: "15px",
                          display: "block",
                        }}
                        size="large"
                        rounded
                      >
                        <i
                          className="pi pi-shopping-cart px-2"
                          style={{ fontSize: "20px", fontWeight: "bold" }}
                        ></i>
                        <span className="px-2">Pay</span>
                      </Button>
                    </div>
                  </div>
                </div> */}
          
              </div>

              <div className="flex-5 bg-blue-900 ">
                {/* <ProductList /> */}
              </div>
            </>
          )}
        </div>
      </>
    );
}

export default Register;