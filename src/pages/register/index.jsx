import { useEffect, useState } from "react";
import ProductList from "../../components/register/productList/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Payment from "../../components/register/payment/Payment";
import {
  addOrder,
  addReturnedProduct,
  clearOrderList,
  setCustomer,
  updateOrderBatchId,
} from "../../state/orderList/orderListSlice";

import DialogModel from "../../components/model/DialogModel";
import BatchSelectionDialog from "../../components/BatchSelectionDialog";
import ReturnOrder from "../../components/returnOrder/ReturnOrderComp";
import HOCSession from "../../hocComponents/WrapperSession";
import OrderListAll from "../../components/orderListAll/OrderListAll";
import OrderList from "../../components/completedOrders/OrderList";
import {
  FaCalendarCheck,
  FaCompressAlt,
  FaHistory,
  FaPalette,
  FaPlusCircle,
  FaSearch,
  FaTh,
  FaTimes,
} from "react-icons/fa";
import { setSelectedStore } from "../../state/store/storeSlice";
import ProfileMenu from "../../components/ProfileMenu";
import Barcode from "../../components/productSearch/Barcode";
import posLogo from "../../assets/pos_logo_long.png";
import DayEnd from "../dayend/DayEnd";
import AddCustomProduct from "../../components/register/AddCustomProduct";
import {
  BellIcon,
  CalendarIcon,
  ExpandIcon,
  GripIcon,
  HistoryIcon,
  HomeIcon,
  MenuIcon,
  MenuSquareIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchXIcon,
  ShoppingCartIcon,
  SquareMenuIcon,
  StoreIcon,
  TableIcon,
  ToiletIcon,
} from "lucide-react";
import AdvancedProductSearch from "../../components/AdvancedProductSearch";
import { getBatchedItems } from "../../functions/register";
import { formatCurrency, formatDate } from "../../utils/format";

const Sidebar = ({
  expanded,
  onNavigate,
  onAction,
  storeName,
  isMobOpen,
  onMobClose,
  hideProductList,
  setHideProductList,
  isMobile,
}) => {
  const navItems = [
      { id: "home", icon: <HomeIcon />, label: "Home" },
    { id: "new", icon: <ShoppingCartIcon />, label: "New Sale" },
    { id: "lookup", icon: <SearchXIcon />, label: "Item Lookup" },
    { id: "history", icon: <HistoryIcon />, label: "Sales History" },
    { id: "custom", icon: <PlusIcon />, label: "Add Custom Item" },
    { id: "dayend", icon: <CalendarIcon />, label: "Day End" },
  
  ];

  const cls = `lpos-sidebar${expanded ? " expanded" : ""}${isMobOpen ? " mob-open" : ""}`;

  return (
    <>
      {isMobOpen && (
        <div
          onClick={onMobClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 490,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      <aside
        className={cls}
        style={{
          background: "var(--lpos-surface)",
          borderRight: "1px solid var(--lpos-border)",
          display: "flex",
          flexDirection: "column",
          padding: "10px 8px",
          gap: 4,
          overflowX: "visible",
          flexShrink: 0,
        }}
      >

        {isMobile && (
          <div style={{display: "flex",  justifyContent: "center", alignItems: "center", padding: "8px 0", marginBottom: 4}}>
            <img src={posLogo} alt="Legend POS" className=" w-auto h-6" />
          </div>
        )}

        {navItems.map((item) => (
          <div key={item.id} className="lpos-si-wrap relative">
            <div
              onClick={() => onAction(item.id)}
              className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer text-[13.5px] font-medium text-[var(--lpos-text-secondary)] hover:bg-[var(--lpos-bg)] hover:text-[var(--lpos-text-primary)] transition-all duration-150"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {item.icon}
              </span>
              <span className="lpos-si-label">{item.label}</span>
            </div>

            {/* Improved Tooltip - Only shows when NOT expanded */}
            {!expanded && <div className="lpos-si-tooltip">{item.label}</div>}
          </div>
        ))}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "var(--lpos-border)",
            margin: "8px 4px",
          }}
        />

        <div
          className="lpos-sidebar-label"
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            color: "var(--lpos-text-tertiary)",
            padding: "6px 8px 2px",
          }}
        >
          Settings
        </div>

        {/* Toggle Products Settings Item */}
        {!isMobile && (
          <div className="lpos-si-wrap relative">
            <div
              onClick={() => onAction("toggleProducts")}
              className="flex items-center gap-4 px-3 py-2.5 rounded-xl cursor-pointer text-[13.5px] font-medium text-[var(--lpos-text-secondary)] hover:bg-[var(--lpos-bg)] hover:text-[var(--lpos-text-primary)] transition-all duration-150"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {hideProductList ? <GripIcon /> : <TableIcon />}
              </span>
              <span className="lpos-si-label">
                {hideProductList ? "Menu View" : "Traditional View"}
              </span>
            </div>
            {!expanded && (
              <div className="lpos-si-tooltip">
                {hideProductList ? "Menu View" : "Traditional View"}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

const Register = () => {
  const navigate = useNavigate();
  let { terminalId } = useParams();

  const dispatch = useDispatch();
  const isTauriApp = "isTauri" in window && !!window.isTauri;

  useEffect(() => {
    const selectedStore = localStorage.getItem("selectedStore");
    if (!selectedStore) {
      navigate("/home");
    }
  }, []);

  const [isReturnOrderPopupVisible, setIsReturnOrderPopupVisible] =
    useState(false);

  const [isSalesHistoryPopupVisible, setIsSalesHistoryPopupVisible] =
    useState(false);

  const [isDayEndPopupVisible, setIsDayEndPopupVisible] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const [isAddCustomProductShow, setIsAddCustomProductShow] = useState(false);

  const [showPayment, setShowPayment] = useState(false);

  const store = JSON.parse(localStorage.getItem("selectedStore"));
    const [addOrderTemp, setAddOrderTemp] = useState(null);
  
    const [batchedItemList, setBatchedItemList] = useState([]);
  
    const [isBatchedItemsModalOpen, setIsBatchedItemsModalOpen] = useState(false);
const existingOrders=useSelector((state) => state.orderList.list);

const [selectedProduct, setSelectedProduct] = useState(null);

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
    {
      label: "Sales History",
      icon: <FaHistory className="text-teal-600 text-xl" />,
      onClick: () => setIsSalesHistoryPopupVisible(true),
    },

    {
      label: "Add Custom Item",
      icon: <FaPlusCircle className="text-orange-500 text-xl" />,
      onClick: () => setIsAddCustomProductShow(true),
    },
    {
      label: "Day End",
      icon: <FaCalendarCheck className="text-rose-600 text-xl" />,
      onClick: () => setIsDayEndPopupVisible(true),
    },
  ];

  const handleProductClick = async (p) => {
    const description = `${p.productDescription}`;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

    setSelectedProduct(p);
    const batchedItemsRes = await getBatchedItems(
      p.allProductId,
      store.storeId,
    );
    const batchedItems = batchedItemsRes.data.results[0];
    console.log("batchedItems", batchedItems);

    
    const order = {
       allProductId:p.allProductId,
      storeId:store.storeId,
      productNo: p.productNo,
      description,
      productId: p.productTypeId === 2 ? p.variationProductId : p.productId,
      unitPrice,
      productTypeId: p.productTypeId,
      lineTaxRate: p.taxPerc,
      qty,
    };

    if (batchedItems.length > 0) {
      setBatchedItemList(batchedItems);
      setIsBatchedItemsModalOpen(true);
      setAddOrderTemp(order);
      return;
    } else {
      order.stockBatchId = batchedItems[0]?.stockBatchId
        ? batchedItems[0].stockBatchId
        : null;
      dispatch(addOrder(order));
    }
  };


   const addItemstoOrderListFinal=(stockBatchId,order)=>{
  
      const isOrderExtist=existingOrders.find(o=>o.allProductId===order.allProductId && o.storeId===order.storeId);
   console.log('stockBatchId,order',stockBatchId,order);
      console.log('isOrderExtist',isOrderExtist);
      if(isOrderExtist){
       dispatch(updateOrderBatchId({ allProductId: order.allProductId, storeId: order.storeId, stockBatchId }));
      }
  
      const orderFinal={...addOrderTemp,stockBatchId};
  
       dispatch(addOrder(orderFinal));
  
       setAddOrderTemp(null);
                
        setIsBatchedItemsModalOpen(false);
  
    }

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const ActionButtonsPopup = () => {
    return (
      <>
        {showMoreMenu && (
          <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8">
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
                {buttons &&
                  buttons.map((btn, index) => {
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
                        <span className="font-semibold text-gray-800">
                          {btn.label}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleBarcodeEnter =async (p) => {
    const description = `${p.productName}`;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

        const batchedItemsRes = await getBatchedItems(
      p.allProductId,
      store.storeId,
    );
    const batchedItems = batchedItemsRes.data.results[0];
    console.log("batchedItems", batchedItems);


    const order = {
       allProductId:p.allProductId,
      storeId:store.storeId,
      productNo: p.productNo,
      description,
      productId: p.productTypeId === 2 ? p.variationProductId : p.productId,
      unitPrice,
      productTypeId: p.productTypeId,
      lineTaxRate: p.taxPerc,
      qty,
    };

    if (batchedItems.length > 0) {
      setBatchedItemList(batchedItems);
      setIsBatchedItemsModalOpen(true);
      setAddOrderTemp(order);
      return;
    } else {
      order.stockBatchId = batchedItems[0]?.stockBatchId
        ? batchedItems[0].stockBatchId
        : null;
      dispatch(addOrder(order));
    }
    
  };

  const [isFullScreen, setIsFullScreen] = useState(false);
  const { selectedStore } = useSelector((state) => state.store);

  useEffect(() => {
    if (!selectedStore) {
      const store = JSON.parse(localStorage.getItem("selectedStore"));
      dispatch(setSelectedStore({ selectedStore: store }));
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

  const [expanded, setExpanded] = useState(false);

  const [mobSidebarOpen, setMobSidebarOpen] = useState(false);
  const [mobProductsOpen, setMobProductsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const storeName = selectedStore?.storeName || null;
  const [hideProductList, setHideProductList] = useState(false);

  // Better resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      // Critical Fix: Close mobile sidebar when switching to desktop
      if (!mobile && mobSidebarOpen) {
        setMobSidebarOpen(false);
      }

      if(mobile){
        setHideProductList(false); // Always show product list on mobile for better UX
      }

    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobSidebarOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  };

  const handleAction = (id) => {
    setMobSidebarOpen(false);
    if (id === "new") {
      dispatch(clearOrderList({}));
      dispatch(setCustomer({ customer: null }));
    }
    if (id === "home") {
      navigate("/home");
    }
    if (id === "history") {
      setIsSalesHistoryPopupVisible(true);
    }
    if (id === "dayend") {
      setIsDayEndPopupVisible(true);
    }
    if (id === "custom") {
      setIsAddCustomProductShow(true);
    }
    if (id === "lookup") {
      setShowAdvancedSearch(Math.random());
    }
    if (id === "toggleProducts") {
      setHideProductList((prev) => !prev);
    }
  };


  const Topbar = () => (
    <header className="lpos-topbar">
      <div className="lpos-topbar-left">
        <button
          onClick={() => {
            if (isMobile) {
              setMobSidebarOpen((v) => !v);
            } else {
              setExpanded((v) => !v);
            }
          }}
          className="lpos-menu-btn"
        >
          <MenuIcon />
        </button>

        {!isMobile && (
          <img src={posLogo} alt="Legend POS" className="lpos-logo h-8" />
        )}
      </div>

      {/* Search */}
      <div className="lpos-search-container">
        <Barcode
          onProductSelect={handleProductClick}
          onBarcodeEnter={handleBarcodeEnter}
          isMobile={isMobile}
        />
      </div>

      {/* Right Side Controls */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >


        {[<BellIcon />, <RefreshCwIcon />].map((ic, i) => (
          <button
            key={i}
            className="lpos-icon-btn"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--lpos-border)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--lpos-bg)")
            }
          >
            {ic}
          </button>
        ))}

        {storeName && (
          <div className="lpos-store-name">
            <StoreIcon />
            {storeName}
          </div>
        )}

        <button
          onClick={toggleFullscreen}
          className="lpos-icon-btn"
          title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        >
          {isFullScreen ? <FaCompressAlt /> : <ExpandIcon />}
        </button>

        <ProfileMenu />
      </div>
    </header>
  );

  return (
    <HOCSession terminalId={terminalId}>
      <AdvancedProductSearch
        visible={showAdvancedSearch}
        onHide={() => setShowAdvancedSearch(false)}
        onProductSelect={(product) => {
          handleProductClick(product);
          setShowAdvancedSearch(false);
        }}
        showOnlyProductItems={false}
      />

      <ActionButtonsPopup />



    <BatchSelectionDialog
      visible={isBatchedItemsModalOpen}
      onHide={() => setIsBatchedItemsModalOpen(false)}
      selectedProduct={selectedProduct}
      batchedItemList={batchedItemList}
      onBatchSelect={(stockBatchId) => addItemstoOrderListFinal(stockBatchId, addOrderTemp)}
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
        header="Add Custom Product"
        visible={isAddCustomProductShow}
        onHide={() => setIsAddCustomProductShow(false)}
      >
        <AddCustomProduct
          visible={isAddCustomProductShow}
          onClose={() => {
            setIsAddCustomProductShow(false);
          }}
        />
      </DialogModel>

      {isSalesHistoryPopupVisible && (
        <OrderList
          isVisible={isSalesHistoryPopupVisible}
          setIsVisible={setIsSalesHistoryPopupVisible}
        />
      )}

      {isDayEndPopupVisible && (
        <DayEnd
          isVisible={isDayEndPopupVisible}
          setIsVisible={setIsDayEndPopupVisible}
        />
      )}

      {showPayment ? (
        <PaymentScreen />
      ) : (
        <>
          <div id="lpos-toast" />
          <div
            className="lpos-app"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Topbar />

            <div 
              style={{
                display: "flex",
                flex: 1,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Sidebar
                expanded={expanded}
                onAction={handleAction}
                storeName={storeName}
                isMobOpen={mobSidebarOpen}
                onMobClose={() => setMobSidebarOpen(false)}
                hideProductList={hideProductList}
           isMobile={isMobile}
              />

              {isMobile && mobSidebarOpen && (
                <div
                  className="lpos-mobile-backdrop show"
                  onClick={() => setMobSidebarOpen(false)}
                />
              )}


{!hideProductList ?  <>
 <ProductList
                selectedCategoryId={selectedCategoryId}
                onProductClick={handleProductClick}
                onMobClose={() => setMobProductsOpen(false)}
              />

     <OrderListAll />
</>
             :
             

             <OrderListAll isTraditionalMode={hideProductList} />

             }

             



            </div>
          </div>
        </>
      )}
    </HOCSession>
  );
};

export default Register;
