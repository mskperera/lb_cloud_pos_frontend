
import Rightsidebar from "../../components/LeftSidebar";
import { useEffect, useState } from "react";
import ProductList from "../../components/register/productList/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Payment from "../../components/register/payment/Payment";
import {
  addReturnedProduct,
} from "../../state/orderList/orderListSlice";

import DialogModel from "../../components/model/DialogModel";
import ReturnOrder from "../../components/returnOrder/ReturnOrderComp";
import HOCSession from "../../hocComponents/WrapperSession";
import OrderListAll from "../../components/orderListAll/OrderListAll";
import TopbarRegister from "./TopbarRegister";

const Register = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();

  const dispatch = useDispatch();
  const { voidOrderVisible } = useSelector((state) => state.popup);


  useEffect(()=>{
    const selectedStore = localStorage.getItem("selectedStore");
    if(!selectedStore){
      navigate('/home');
    }
  },[])
 

  const [isReturnOrderPopupVisible, setIsReturnOrderPopupVisible] =
    useState(false);

  const [showPayment, setShowPayment] = useState(false);

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

  const addReturnedProductsHandler = (products) => {
    dispatch(addReturnedProduct({ returnedProducts: products }));
  };
  
  return (
    <HOCSession terminalId={terminalId}>
      
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


  
        <div className="flex items-start justify-between gap-2 py-2 ">
          {showPayment ? (
            <PaymentScreen />
          ) : (
            <div className="grid grid-cols-12 w-full">
 
              <div className="flex gap-1 col-span-6 m-0 p-0">
                <div className="p-1">
                  <Rightsidebar
                    setIsReturnOrderPopupVisible={setIsReturnOrderPopupVisible}
                  />
                </div>
             
                <OrderListAll />
              </div>

              <div className=" col-span-6">
                <ProductList />
              </div>
            </div>
          )}
        </div>

    </HOCSession>
  );
};

export default Register;
