import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { PrimeReactProvider } from 'primereact/api';
import './App.css' 



import TopMenubar from './components/navBar/TopMenubar';

import NotFound from './pages/NotFound';
import { ToastProvider } from './components/useToast';
import Customers from './pages/customers';
import AddCustomer from './pages/addCustomer';
import Login from './pages/login';

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

  const shouldShowNavBar = location.pathname !== '/login';

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
    <PrimeReactProvider value={value}>
      <>
        <ToastProvider>
          <div className='app-container'>
            {shouldShowNavBar && <TopMenubar />}
            <div style={appStyle}>
              <React.Suspense fallback={<>Loading...</>}>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dayend" element={<DayEnd />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/addProduct/:saveType/:id" element={<AddProduct />} />
                  <Route path="/paymentConfirm" element={<PaymentConfirm />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/addCustomer/:saveType/:id" element={<AddCustomer />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/ordersCompleted" element={<OrdersCompleted />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Login />} />
                </Routes>
              </React.Suspense>
            </div>
          </div>
        </ToastProvider>
      </>
    </PrimeReactProvider>
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
