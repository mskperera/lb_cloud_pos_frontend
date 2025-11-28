
import Rightsidebar from "../../components/LeftSidebar";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { FaArrowCircleLeft, FaArrowCircleRight, FaCalendarCheck, FaCompress, FaEllipsisV, FaExpand, FaHistory, FaPlusCircle, FaSearch, FaStore, FaTh, FaThList, FaTimes } from "react-icons/fa";
import { setSelectedStore } from "../../state/store/storeSlice";
import PrinterConnection from "../../components/PrinterConnetion";
import ProfileMenu from "../../components/ProfileMenu";
import Barcode from "../../components/productSearch/Barcode";
import posLogo from '../../assets/pos_logo_long.png';
import DayEnd from "../dayend/DayEnd";
import ProductSearch from "../../components/productSearch/ProductSearch";
import AddCustomProduct from "../../components/register/AddCustomProduct";

const Store=({store})=>(
  <div className='flex justify-start items-center gap-1 text-gray-700 font-bold rounded-lg px-2'>
    <FaStore className='text-xl' />
{/* <FontAwesomeIcon icon={faStore} style={{ fontSize: '1.5rem' }} /> */}
 {store && <div className='text-lg'>{`${store.storeName}`}</div>}
 </div>
)







const Register = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();

  const dispatch = useDispatch();
 const isTauriApp = 'isTauri' in window && !!window.isTauri;

  useEffect(()=>{
    const selectedStore = localStorage.getItem("selectedStore");
    if(!selectedStore){
      navigate('/home');
    }
  },[])
 

  const [isReturnOrderPopupVisible, setIsReturnOrderPopupVisible] = useState(false);

  const [isSalesHistoryPopupVisible, setIsSalesHistoryPopupVisible] = useState(false);
      
  const [isDayEndPopupVisible, setIsDayEndPopupVisible] = useState(false);
  const [isDayendLoading, setIsDayendLoading] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
   const [isAddCustomProductShow, setIsAddCustomProductShow] = useState(false);

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
  
  const buttons = [

     {
  label: "Item Lookup",
  icon: <FaSearch className="text-sky-600 text-xl" />,
  onClick: () => setShowAdvancedSearch(Math.random()),
},
    { label: "Sales History",     icon: <FaHistory className="text-teal-600 text-xl" />,      onClick: () => setIsSalesHistoryPopupVisible(true) },
 
  
 { label: "Add Custom Item",   icon: <FaPlusCircle className="text-orange-500 text-xl" />, onClick: () => setIsAddCustomProductShow(true) },
     { label: "Day End",           icon: <FaCalendarCheck className="text-rose-600 text-xl" />, onClick: () => setIsDayEndPopupVisible(true) },
 
  ];

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


const ActionButtonsRow = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [hiddenIndices, setHiddenIndices] = useState([]);

  const containerRef = useRef(null);
  const hiddenContainerRef = useRef(null);


  const measureVisibleButtons = useCallback(() => {
    if (!containerRef.current || !hiddenContainerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const hiddenButtons = hiddenContainerRef.current.children;
    let totalWidth = 0;
    const visibleCount = buttons.length;

    // Measure real rendered buttons (only visible ones affect layout)
    for (let i = 0; i < visibleCount; i++) {
      const btn = hiddenButtons[i];
      if (!btn) continue;

      const width = btn.offsetWidth + 20; // + gap
      if (totalWidth + width < containerWidth - 120) { // reserve space for "More"
        totalWidth += width;
      } else {
        // From this index onward → hide
        setHiddenIndices(buttons.map((_, idx) => idx).slice(i));
        return;
      }
    }

    // All fit
    setHiddenIndices([]);
  }, [buttons]);

  // Measure after paint, on resize, and when buttons change
  useEffect(() => {
    const runMeasure = () => {
      requestAnimationFrame(() => {
        measureVisibleButtons();
      });
    };

    runMeasure();

    const observer = new ResizeObserver(runMeasure);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener('resize', runMeasure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', runMeasure);
    };
  }, [measureVisibleButtons]);




  return (
    <>
      {/* Main Button Row */}
      <div className="relative">
        <div ref={containerRef} className="flex items-center justify-start gap-5 flex-wrap">
         
      {buttons.map((btn, index) => {
            const isHidden = hiddenIndices.includes(index);
            return (
              <button
                key={index}
                type="button"
                onClick={btn.onClick}
                className={`flex items-center gap-3 px-7 py-4 bg-white border text-gray-700 rounded-xl font-semibold hover:bg-gray-200 hover:shadow-lg transition-all duration-200 shadow-sm hover:-translate-y-0.5 whitespace-nowrap ${
                  isHidden ? 'hidden' : 'flex'
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            );
          })}


          {/* More Button */}
          {hiddenIndices.length > 0 && (
            <button
              onClick={() => setShowMoreMenu(true)}
              className="flex items-center gap-3 px-7 py-4 bg-white  border text-gray-700 rounded-xl font-semibold hover:bg-gray-200 hover:shadow-lg transition-all duration-200 shadow-sm hover:-translate-y-0.5"
            >
              {/* <FaEllipsisV className="text-gray-600 text-xl" /> */}
              <FaThList className="text-gray-600 text-xl" />
              <span>More</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden Clone Container - For Accurate Measurement Only */}
      <div
        ref={hiddenContainerRef}
        className="fixed top-96 left-0 opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        {buttons.map((btn, index) => (
          <button
            key={index}
            className="flex items-center gap-3 px-7 py-4 bg-white font-semibold hover:bg-orange-50 border text-gray-700 rounded-xl whitespace-nowrap"
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Beautiful Popup Menu */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">More Actions</h3>
              {hiddenIndices.map(index => {
                const btn = buttons[index];
                return (
                  <button
                    key={index}
                    onClick={() => {
                      btn.onClick();
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl hover:bg-gray-100 transition-all group"
                  >
                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition">
                      {btn.icon}
                    </div>
                    <span className="font-semibold text-gray-800">{btn.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-gray-200 px-6 py-5">
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full py-3 text-gray-600 font-medium hover:text-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

  const [showMoreMenu, setShowMoreMenu] = useState(false);

const ActionButtonsPopup = () => {

  const [hiddenIndices, setHiddenIndices] = useState([]);


  return (
    <>
 
       {showMoreMenu &&  <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-50 text-gray-600">
  {/* Title with icon inline */}
  <h2 className="flex items-center gap-3">
    <FaTh className="text-xl" />
    <span className="text-xl font-bold">Menu</span>
  </h2>

  <button
    onClick={() => setShowMoreMenu(false)}
    className="p-3 rounded-full hover:bg-slate-200 hover:text-red-500 transition-all duration-200"
  >
    <FaTimes className="text-2xl" />
  </button>
</div>

            <div className="p-6 space-y-2">
              {buttons && buttons.map((btn,index) => {
  
                return (
                  <button
                    key={index}
                    onClick={() => {
                      btn.onClick();
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl hover:bg-gray-100 transition-all group"
                  >
                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition">
                      {btn.icon}
                    </div>
                    <span className="font-semibold text-gray-800">{btn.label}</span>
                  </button>
                );
              })}
            </div>
   
          </div>
        </div>
}
    </>
  );
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


  const Alert=()=>{
    return <i className="pi pi-bell text-gray-700 font-bold" style={{ fontSize: '1.5rem' }}></i>
}


const Syncing=()=>{
    return <i className="pi pi-sync text-gray-700 font-bold" style={{ fontSize: '1.5rem' }}></i>
}

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

  const [isFullScreen, setIsFullScreen] = useState(false);
  const { selectedStore } = useSelector((state) => state.store);
  const [messages, setMessages] = useState([]);

   useEffect(() => {
    if(!selectedStore){

      const store = JSON.parse(localStorage.getItem('selectedStore'));
      dispatch(setSelectedStore({ selectedStore:store }));
      
    }
  }, []);


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

  const location = useLocation();
  const { id } = useParams(); 



  //onst [printerList, setPrinterList] = useState([]);
  const [printDeskInfo, setPrintDeskInfo] = useState(null); // Example ID

  const [leftTerminal,setLeftTerminal]=useState(false);
  // 3jkfsjl




 

 

  const terminalId_l=localStorage.getItem('terminalId');







  return (
    <HOCSession terminalId={terminalId}>
           <ProductSearch hideSearchBox={true} hideButton={true}  onProductSelect={handleProductClick} showAdvancedSearcho={showAdvancedSearch} />
       
       <ActionButtonsPopup />
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
        header="Add Custom Product"
        visible={isAddCustomProductShow}
        onHide={() => setIsAddCustomProductShow(false)}
      >
        <AddCustomProduct visible={isAddCustomProductShow} onClose={()=>{
          setIsAddCustomProductShow(false);
        }}  />
      </DialogModel>


           {isSalesHistoryPopupVisible && 

            <OrderList isVisible={isSalesHistoryPopupVisible} 
           setIsVisible={setIsSalesHistoryPopupVisible} 
           />

           }
            
  
             {isDayEndPopupVisible &&

              <DayEnd isVisible={isDayEndPopupVisible} setIsVisible={setIsDayEndPopupVisible} />
              }

         
          {showPayment ? (
            <PaymentScreen />
          ) : (

            <div className=" ">
                    {/* <TopMenubar/>  */}
            
            <div className="pt-2">
              <div className="grid grid-cols-12 w-full ">
    {/* <div className="p-1">
                  <Rightsidebar
                    setIsReturnOrderPopupVisible={setIsReturnOrderPopupVisible}
                    setIsSalesHistoryPopupVisible={setIsSalesHistoryPopupVisible}
                      setIsDayEndPopupVisible={setIsDayEndPopupVisible}
                    
                  />
                </div> */}


              <div className="flex flex-col gap-1 col-span-7  pt-4">
      
         
        <div className="flex  items-center justify-between m-0 pl-10 gap-20">

      <img src={posLogo} alt="Legend POS" className="h-10" />
 
       
   <div className="w-full">
{/* <ActionButtonsRow /> */}
    </div>
 </div>
 
<div className=" ">

      <div className="grid grid-cols-12 mt-5">
        <div className="col-span-3 w-full ">  
          <div className="flex justify-between px-4 ">

          <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-gray-700 hover:text-[#0284C7]"
      onClick={() => navigate('/home')}
    >
      <FaArrowCircleLeft className="text-2xl " />
      <span className="pl-1 font-bold text-lg">Home</span>
    </button>

           <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-gray-700 hover:text-[#0284C7]"
      onClick={() => setShowMoreMenu(true)}
    >
      <FaTh className="text-2xl " />
      <span className="pl-1 font-bold text-lg">Menu</span>
    </button>

                   {/* <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-gray-700 hover:text-[#0284C7]"
      onClick={() => navigate('/home')}
    >
      <FaTh className="text-xl " />
      <span className="pl-1 font-bold">Barcode</span>
    </button> */}



          </div>
  

    
</div>
           <div className="col-span-9 px-4 ">
       <Barcode onProductSelect={handleProductClick} onBarcodeEnter={handleBarcodeEnter} />
</div>
</div>
    
                <ProductList />

             

               </div>
              </div>

         <div className="col-span-5 pb-5 flex flex-col gap-5  p-4">

         <div className="flex items-center gap-4 justify-end">
    

    {!isTauriApp && <button
      className="flex items-center ml-0 p-2 m-0 rounded-md text-gray-700 font-bold hover:text-[#0284C7]"
      onClick={toggleFullScreen}
    >
      {isFullScreen ? (
      <div className="flex items-center">
          <FaCompress className="text-xl " />
          <span className="pl-1 font-bold text-lg">Exit Full Screen</span>
      </div>
      ) : (
        <div className="flex items-center">
          <FaExpand className="text-xl " />
          <span className="pl-1 font-bold text-lg">Full Screen</span>
        </div>
      )}
    </button>}



     {/* {JSON.stringify(printDeskInfo)} */}

          <div className="flex items-center gap-7 m-0 p-0">
             
          {selectedStore &&  <Store store={selectedStore}/>}
{/* <PrinterConnection status={messages.status} /> */}


            <Alert />
            <Syncing />
            <ProfileMenu />
          </div>
     
        </div>

              <OrderListAll />


              
                 
              </div>
              
            </div></div>
            </div>
          )}
   

    </HOCSession>
  );
};

export default Register;
