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
import MainLayout from './layouts/MainLayout';
import SidebarLayout from './layouts/SidebarLayout';
import TopbarLayout from './layouts/TopbarLayout';

const Register = React.lazy(() => import("./pages/register"));
const Home = React.lazy(() => import("./pages/home/Home"));
const DayEnd = React.lazy(() => import("./pages/dayend"));
const Payment = React.lazy(() => import("./pages/payment"));
const PaymentConfirm = React.lazy(() => import("./pages/paymentConfirm"));
const Products = React.lazy(() => import("./pages/products"));
const AddProduct = React.lazy(() => import("./pages/products/addProduct"));
const EditProduct = React.lazy(() => import("./pages/products/editProduct"));
const OrdersCompleted = React.lazy(() => import("./pages/ordersCompleted"));
const StockEntryFull = React.lazy(() => import("./pages/stockEntryFull"));
const ProductInventoryList  = React.lazy(() => import("./pages/inventory/productInventoryList"));
const StockEntry  = React.lazy(() => import("./pages/stockEntry/stockAdd"));
const StockEntryList  = React.lazy(() => import("./pages/stockEntry/stockList"));
const StockAdjustment  = React.lazy(() => import("./pages/inventory/stockAdjustment"));
const InventoryTransactionHistory  = React.lazy(() => import("./pages/inventoryTransactionHistory"));
const Categories  = React.lazy(() => import("./pages/categories"));
const MeasurementUnits= React.lazy(() => import("./pages/measurementUnits"));


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
        {/* {shouldShowNavBar && <TopMenubar />} */}

        {/* <div className="flex flex-col h-[92vh] overflow-hidden"> */}
        {/* <div className="flex-1 overflow-y-auto"> */}

        <React.Suspense fallback={<>Loading...</>}>
          <Routes>
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/" element={<Login />} />
            {/* <Route path="/" element={<Login />} /> */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/customers/list" element={<Customers />} />

              <Route path="/products/list" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit" element={<EditProduct />} />

              <Route path="/categories" element={<Categories />} />
              <Route path="/measurementUnits" element={<MeasurementUnits />} />

              <Route
                path="/inventory/stockentry/add"
                element={<StockEntry />}
              />
              <Route
                path="/inventory/stockentry/list"
                element={<StockEntryList />}
              />
              <Route
                path="/inventory/list"
                element={<ProductInventoryList />}
              />

              <Route
                path="/inventory/stockEntryFull"
                element={<StockEntryFull />}
              />
              <Route
                path="/inventory/stockAdjustment"
                element={<StockAdjustment />}
              />
              <Route
                path="/inventory/transactionHistory"
                element={<InventoryTransactionHistory />}
              />

         
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports/reportViewer" element={<ReportViewer />} />
            </Route>

            {/* Only TopMenubar */}
            <Route element={<TopbarLayout />}>
              <Route path="/register/:terminalId" element={<Register />} />
              <Route path="/dayend" element={<DayEnd />} />
              <Route path="/daystart/:terminalId" element={<DayOpen />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ordersCompleted" element={<OrdersCompleted />} />

              <Route path="/paymentConfirm" element={<PaymentConfirm />} />
            </Route>

            {/*Only Sidebar */}
            <Route element={<SidebarLayout />}>
              <Route
                path="/inventory/stockentry/list"
                element={<Customers />}
              />
            </Route>
          </Routes>
        </React.Suspense>
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
