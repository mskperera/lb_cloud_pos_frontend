
import Rightsidebar from "../../components/LeftSidebar";
import { useEffect, useState } from "react";
import ProductList from "../../components/register/productList/ProductList";
import { useDispatch, useSelector } from "react-redux";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import Payment from "../../components/register/payment/Payment";
import {
  addOrder,
  addReturnedProduct,
} from "../../state/orderList/orderListSlice";

import DialogModel from "../../components/model/DialogModel";
import ReturnOrder from "../../components/returnOrder/ReturnOrderComp";
import HOCSession from "../../hocComponents/WrapperSession";
import OrderListAll from "../../components/orderListAll/OrderListAll";
import OrderList from "../../components/completedOrders/OrderList";
import { FaCompress, FaExpand, FaStore, FaTh } from "react-icons/fa";
import { setSelectedStore } from "../../state/store/storeSlice";
import PrinterConnection from "../../components/PrinterConnetion";
import ProfileMenu from "../../components/ProfileMenu";
import Barcode from "../../components/productSearch/Barcode";


const Store=({store})=>(
  <div className='flex justify-start gap-1 items-center mb-1 text-gray-700 font-bold rounded-lg px-2'>
    <FaStore className='text-lg' />
{/* <FontAwesomeIcon icon={faStore} style={{ fontSize: '1.5rem' }} /> */}
 {store && <div className='mt-1'>{`${store.storeName}`}</div>}
 </div>
)
const TopMenubar=() =>{
  const navigate = useNavigate();

  const location = useLocation();
  const { id } = useParams(); 

  const dispatch = useDispatch();


  const [messages, setMessages] = useState([]);
  //onst [printerList, setPrinterList] = useState([]);
  const [printDeskInfo, setPrintDeskInfo] = useState(null); // Example ID

  const [leftTerminal,setLeftTerminal]=useState(false);
  // 3jkfsjl



  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error exiting fullscreen: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    // Sync state when Fullscreen API is used
    const handleChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);

    // Detect F11 fullscreen by comparing window & screen height
    const checkF11 = () => {
      if (window.innerHeight === window.screen.height) {
        setIsFullScreen(true); // Browser fullscreen (F11)
      } else if (!document.fullscreenElement) {
        setIsFullScreen(false); // Normal mode
      }
    };
    window.addEventListener("resize", checkF11);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      window.removeEventListener("resize", checkF11);
    };
  }, []);


  const { selectedStore } = useSelector((state) => state.store);
  const terminalId_l=localStorage.getItem('terminalId');






  
 // const [selectedStore,setSelectedStore]=useState(null);
  // useEffect(() => {
  //   const fetchStore = async () => {
  //     const store = await getSelectedStore();
  //     setSelectedStore(store);
  //   };
  //   fetchStore();
  // }, []);

 // const store = JSON.parse(localStorage.getItem('selectedStore'));


   useEffect(() => {
    if(!selectedStore){

      const store = JSON.parse(localStorage.getItem('selectedStore'));
      dispatch(setSelectedStore({ selectedStore:store }));
      
    }
  }, []);



const Alert=()=>{
    return <i className="pi pi-bell text-gray-700 font-bold" style={{ fontSize: '1.5rem' }}></i>
}


const Syncing=()=>{
    return <i className="pi pi-sync text-gray-700 font-bold" style={{ fontSize: '1.5rem' }}></i>
}

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
  
  // bg-slate-50 shadow-sm
  return (

    <nav className="navbar fixed top-0 left-0 w-full bg-[#f0f9ff] px-10 gap-2 pt-3  h-16 z-50">
      <div className="flex justify-between items-center w-full m-0 p-0">
      <div className="flex justify-start gap-4 flex-1">
        <div className="flex items-center gap-4 m-0 p-0 w-[13rem]">
          {/* <i className="pi pi-calculator text-2xl"></i> */}
          <h3 className="text-xl font-bold text-gray-700">Legend POS</h3>
     
        </div>

<div className="w-1/2">
            <Barcode onProductSelect={handleProductClick} onBarcodeEnter={handleBarcodeEnter} />
</div>
    
          </div>
        <div className="flex items-center gap-4 m-0 p-0">

      <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-gray-700 font-bold hover:text-[#0284C7]"
      onClick={toggleFullScreen}
    >
      {isFullScreen ? (
        <>
          <FaCompress className="text-xl" />
          <span className="pl-1">Exit Full Screen</span>
        </>
      ) : (
        <>
          <FaExpand className="text-xl" />
          <span className="pl-1">Full Screen</span>
        </>
      )}
    </button>

    <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-gray-700 hover:text-[#0284C7]"
      onClick={() => navigate('/home')}
    >
      <FaTh className="text-xl " />
      <span className="pl-1 font-bold">Home</span>
    </button>


     {/* {JSON.stringify(printDeskInfo)} */}

          <div className="flex items-center gap-5 m-0 p-0">
             
          {selectedStore &&  <Store store={selectedStore}/>}
<PrinterConnection status={messages.status} />


            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}


const Register = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();

  const dispatch = useDispatch();


  useEffect(()=>{
    const selectedStore = localStorage.getItem("selectedStore");
    if(!selectedStore){
      navigate('/home');
    }
  },[])
 

  const [isReturnOrderPopupVisible, setIsReturnOrderPopupVisible] = useState(false);

  const [isSalesHistoryPopupVisible, setIsSalesHistoryPopupVisible] = useState(false);
    

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


      <DialogModel
        header="Sales History"
        visible={isSalesHistoryPopupVisible}
        maximizable
        maximized={true}
        style={{ width: "50vw" }}
        onHide={() => setIsSalesHistoryPopupVisible(false)}
      >
               <OrderList selectingMode={false} reload={()=>{
                Math.random()
               }}  />
      </DialogModel>

        <div className="flex items-start justify-between gap-2 py-2 bg-[#f0f9ff] ">
         

         
         
          {showPayment ? (
            <PaymentScreen />
          ) : (
            <div className="grid grid-cols-12 w-full pt-16">
        <TopMenubar/> 
              <div className="flex gap-1 col-span-6 m-0 p-0">
                <div className="p-1">
                  <Rightsidebar
                    setIsReturnOrderPopupVisible={setIsReturnOrderPopupVisible}
                    setIsSalesHistoryPopupVisible={setIsSalesHistoryPopupVisible}
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
