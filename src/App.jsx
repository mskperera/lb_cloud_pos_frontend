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
import { useDispatch } from 'react-redux';
import StockEntry from './components/inventory/stockEntry/StockEntry';

const Register = React.lazy(() => import("./pages/register"));
const Home = React.lazy(() => import("./pages/home/Home"));
const DayEnd = React.lazy(() => import("./pages/dayend"));
const Payment = React.lazy(() => import("./pages/payment"));
const PaymentConfirm = React.lazy(() => import("./pages/paymentConfirm"));
const Products = React.lazy(() => import("./pages/products"));
const AddProduct = React.lazy(() => import("./pages/addProduct"));
const OrdersCompleted = React.lazy(() => import("./pages/ordersCompleted"));



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
                  <Route path="/register/:terminalId" element={<Register />} />
                  <Route path="/dayend" element={<DayEnd />} />
                  <Route path="/daystart/:terminalId" element={<DayOpen />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/addProduct/:saveType/:id" element={<AddProduct />} />
                  <Route path="/paymentConfirm" element={<PaymentConfirm />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/addCustomer/:saveType/:id" element={<AddCustomer />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/ordersCompleted" element={<OrdersCompleted />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/stockEntry" element={<StockEntry />} />
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
