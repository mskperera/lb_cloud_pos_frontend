import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css'

import NotFound from './pages/NotFound';
import { ToastProvider } from './components/useToast';
import Customers from './pages/customers';
import Login from './pages/login';
import DayOpen from './pages/dayopen';
import Dashboard from './pages/dashboard';
import SalesByProductMonthlyReport from './pages/reports/SalesByProductMonthlyReport';
import MainLayout from './layouts/MainLayout';
import SidebarLayout from './layouts/SidebarLayout';
import TopbarLayout from './layouts/TopbarLayout';
import EditCustomer from './pages/customers/editCustomer';
import AddCustomer from './pages/customers/addCustomer';
import AddUserReg from './components/userRegistration/AddUserReg';
import EditUserReg from './pages/userRegistration/editUserReg';
import UserRegList from './pages/userRegistration';
import SystemDataSetup from './pages/systemDataInitialization';
import SelectStore from './pages/store';
import About from './pages/about';
import InventoryOnHandReport from './pages/reports/InventoryOnHandReport';
import DailySalesSummaryReport from './pages/reports/DailySalesSummaryReport';
import LowStockReport from './pages/reports/LowStockReport';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import ForgotPassword from './pages/forgotPassword';
import CookieConsentBanner from './components/CookieConsentBanner';
import PublicRoutes from './routes/PublicRoutes';
import ScrollToHash from './pages/landing/ScrollToHash';
import TransferOrderDetail from './pages/transferOrderDetail';
import RegisterPage from './pages/register/register_redesigned';
import DayendListAll from './components/dayendList/DayendListAll';
import { useEffect } from 'react';
import { loadAppConfig } from './utils/tauri/appConfig';
import { invoke } from '@tauri-apps/api/core';
import Database from '@tauri-apps/plugin-sql';

const Register = React.lazy(() => import("./pages/register"));
const Home = React.lazy(() => import("./pages/home/Home"));
const Payment = React.lazy(() => import("./pages/payment"));
const PaymentConfirm = React.lazy(() => import("./pages/paymentConfirm"));
// const Products = React.lazy(() => import("./pages/products"));
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
const ReportsDashboard= React.lazy(() => import("./pages/reports/ReportsDashboard"));
const TransferOrder= React.lazy(() => import("./pages/tranferOrder"));
const TransferOrderList= React.lazy(() => import("./pages/transferOrderList"));

function AppContent() {
  const location = useLocation();

  const shouldShowNavBar = location.pathname !== '/login' && location.pathname !== '/';


useEffect(() => {
    // Generates config.json on first launch
    
    loadAppConfig().then(config => {
      console.log('App initialized with runtime config:', config);
      //verifyDeviceLicense();
    });
  }, []);


//  const verifyDeviceLicense = async () => {
//   if (!('isTauri' in window && !!window.isTauri)) return true;

//   try {
//     // 1. Get current physical hardware identifier
//     const currentMachineId = await invoke('get_machine_id');

//     // 2. Read saved activation token from SQLite
//     const db = await Database.load('sqlite:credentials.db');
//     await db.execute(`
//       CREATE TABLE IF NOT EXISTS settings (
//         key TEXT PRIMARY KEY,
//         value TEXT
//       )
//     `);

//     const result = await db.select(
//       "SELECT value FROM settings WHERE key = 'license_token' LIMIT 1"
//     );

//     const savedToken = result?.length > 0 ? result[0].value : null;

//     if (!savedToken) {
//       return { status: 'UNREGISTERED', machineId: currentMachineId };
//     }

//     // 3. Decode or decrypt token to compare Machine IDs
//     const payload = parseJwt(savedToken);

//     if (payload.machineId !== currentMachineId) {
//       console.error('License Mismatch: Application files were copied to an unauthorized computer.');
//       return { status: 'INVALID_HARDWARE', machineId: currentMachineId };
//     }

//     return { status: 'VALID', machineId: currentMachineId };
//   } catch (error) {
//     console.error('Failed device license verification:', error);
//     return { status: 'ERROR', error };
//   }
// };



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
    <CookieConsentBanner />
      <ToastProvider>
        {/* {shouldShowNavBar && <TopMenubar />} */}

        {/* <div className="flex flex-col h-[92vh] overflow-hidden"> */}
        {/* <div className="flex-1 overflow-y-auto"> */}
<ScrollToHash />
        <React.Suspense fallback={<>Loading...</>}>
          <Routes>
            <Route path="/*" element={<PublicRoutes />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="*" element={<NotFound />} />
            {/* <Route path="/" element={<LandingPage />} /> */}
                      <Route path="/signin" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />



     {/* <Route path="/signup" element={<SignUpPage />} /> */}


            {/* <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/pricing" element={<PricingPage />} /> */}


            <Route path="/systemDataInitialization" element={<SystemDataSetup />} />
            <Route path="/selectStore" element={<SelectStore />} />

     
            {/* <Route path="/" element={<Login />} /> */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
   
              
       
              <Route path="/customers/add" element={<AddCustomer />} />
              <Route path="/customers/edit" element={<EditCustomer />} />
              <Route path="/customers/list" element={<Customers />} />

              <Route path="/userReg/add" element={<AddUserReg />} />
              <Route path="/userReg/edit" element={<EditUserReg />} />
              <Route path="/userReg/list" element={<UserRegList />} />

              {/* <Route path="/products/list" element={<Products />} /> */}
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


    
    <Route path="/inventory/transferorders/create" element={<TransferOrder />} />
<Route path="/inventory/transferorders/:id" element={<TransferOrderDetail />} />
<Route path="/inventory/transferorders/list" element={<TransferOrderList />} />

         
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports/salesByProductMonthlyReport" element={<SalesByProductMonthlyReport />} />
    <Route path="/reports/dailySalesSummaryReport" element={<DailySalesSummaryReport />} />
   <Route path="/reports/low-stock" element={<LowStockReport />} />
   <Route path="/reports/zReportHistory" element={<DayendListAll />} />
   <Route path="/reports/zReport" element={<DayendListAll />} />


              <Route
                path="/about"
                element={<About />}
              />

<Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
              />

<Route
                path="/reports/report-dashboard"
                element={<ReportsDashboard />}
              />

<Route
                path="/reports/InventoryOnHandReport"
                element={<InventoryOnHandReport />}
              />


              

            </Route>

            {/* Only TopMenubar */}
            <Route element={<TopbarLayout />}>
              {/* <Route path="/register/:terminalId" element={<Register />} /> */}
              <Route path="/register/:terminalId" element={<Register />} />

               <Route path="/registerr/:terminalId" element={<RegisterPage />} />

              {/* <Route path="/dayend" element={<DayEnd />} /> */}
              <Route path="/daystart/:terminalId" element={<DayOpen />} />
              {/* <Route path="/payment" element={<Payment />} /> */}
              {/* <Route path="/ordersCompleted" element={<OrdersCompleted />} />
              <Route path="/paymentConfirm" element={<PaymentConfirm />} /> */}
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
