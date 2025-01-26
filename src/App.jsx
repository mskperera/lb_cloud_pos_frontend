import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css' 



import TopMenubar from './components/navBar/TopMenubar';

import NotFound from './pages/NotFound';
import { ToastProvider } from './components/useToast';
import Customers from './pages/customers';
import AddCustomer from './pages/addCustomer';
import Login from './pages/login';
import DayOpen from './pages/dayopen';
import Dashboard from './pages/dashboard';
import ReportViewer from './pages/reports/ReportViewer';

const Register = React.lazy(() => import("./pages/register"));
const Home = React.lazy(() => import("./pages/home/Home"));
const DayEnd = React.lazy(() => import("./pages/dayend"));
const Payment = React.lazy(() => import("./pages/payment"));
const PaymentConfirm = React.lazy(() => import("./pages/paymentConfirm"));
const Products = React.lazy(() => import("./pages/products"));
const AddProduct = React.lazy(() => import("./pages/addProduct"));
const OrdersCompleted = React.lazy(() => import("./pages/ordersCompleted"));
const StockEntryFull = React.lazy(() => import("./pages/stockEntryFull"));
const ProductInventoryList  = React.lazy(() => import("./pages/inventory/productInventoryList"));
const StockEntry  = React.lazy(() => import("./pages/stockEntry/stockAdd"));
const StockEntryList  = React.lazy(() => import("./pages/stockEntry/stockList"));
const StockAdjustment  = React.lazy(() => import("./pages/inventory/stockAdjustment"));
const InventoryTransactionHistory  = React.lazy(() => import("./pages/inventoryTransactionHistory"));

function AppContent() {
  const location = useLocation();

  const shouldShowNavBar = location.pathname !== '/login' && location.pathname !== '/';

  const value = {
    appendTo: 'self',
    ripple: false
  };

  const appStyle = {
    // display: 'flex',
    // flexDirection: 'column',
    // minHeight: '86vh',
  };



  return (

      <>
        <ToastProvider>
          <div className=''>
            {shouldShowNavBar && <TopMenubar />}

            {/* <div className="flex flex-col h-[92vh] overflow-hidden"> */}
            {/* <div className="flex-1 overflow-y-auto"> */}
       
            <div className='mt-16'>
              <React.Suspense fallback={<>Loading...</>}>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/customers/add" element={<AddCustomer />} />
                  <Route path="/customers/list" element={<Customers />} />
                 
                  <Route path="/products/list" element={<Products />} />
                  <Route path="/products/add" element={<AddProduct />} />

                  <Route path="/inventory/stockentry/add" element={<StockEntry />} />
                  <Route path="/inventory/stockentry/list" element={<StockEntryList />} />
                  <Route path="/inventory/list" element={<ProductInventoryList />} />

                  <Route path="/inventory/stockEntryFull" element={<StockEntryFull />} />
                  <Route path="/inventory/stockAdjustment" element={<StockAdjustment />} />
                  <Route path="/inventory/transactionHistory" element={<InventoryTransactionHistory />} />
                 
                  <Route path="/ordersCompleted" element={<OrdersCompleted />} />


                  <Route path="/register/:terminalId" element={<Register />} />
                  <Route path="/dayend" element={<DayEnd />} />
                  <Route path="/daystart/:terminalId" element={<DayOpen />} />
                  <Route path="/payment" element={<Payment />} />
              
                  <Route path="/paymentConfirm" element={<PaymentConfirm />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/reports/reportViewer" element={<ReportViewer />} />
                  <Route path="/login" element={<Login />} />
         
                  <Route path="/" element={<Login />} />
                </Routes>
              </React.Suspense>
        
              </div>
          </div>
        </ToastProvider>
      </>

  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
