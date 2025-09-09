import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderList } from '../../state/orderList/orderListSlice';
import { saveAs } from 'file-saver';
import { exPrintReceipt } from '../../functions/exPrint';
import { getTenantId } from '../../functions/authService';
import { getOrderReceipt } from '../../functions/register';
import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
import { formatCurrency } from '../../utils/format';
import { FaPrint, FaEnvelope, FaSms, FaGlobe, FaPrinter } from 'react-icons/fa';

function PaymentConfirm({ orderId, setIsPaymentConfirmShow, openBy }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { printerList } = useSelector((state) => state.printer);
  const terminalId = JSON.parse(localStorage.getItem('terminalId'));
  const printdeskId = localStorage.getItem('printdeskId');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [actionOption, setActionOption] = useState('print'); // 'print', 'email', or 'sms'
  const [printOption, setPrintOption] = useState('printdesk'); // 'browserPrint' or 'printdesk'
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [change, setChange] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderHeader, setOrderHeader] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderReceipt();
    }
  }, [orderId]);

  useEffect(() => {
    if (actionOption === 'print' && printOption === 'printdesk' && printerList?.length > 0) {
      const defaultPrinter = printerList.find((printer) => printer.IsDefault) || printerList[0];
      setSelectedPrinter(defaultPrinter?.PrinterName || '');
    } else {
      setSelectedPrinter('');
    }
  }, [actionOption, printOption, printerList]);

  const loadOrderReceipt = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getOrderReceipt(orderId);
      const oh = result.data.results[0]?.[0];
      if (!oh) throw new Error('Order header not found');
      setCurrency(oh.symbol || '$');
      setOrderHeader(oh);
      setEmail(oh.customerEmail || ''); // Pre-fill email if available
      setPhone(oh.customerPhone || ''); // Pre-fill phone if available
      const od = result.data.results[1] || [];
      const orderDetals = od.map((o) => ({
        o,
        line: o.orderDetailId,
        unitPrice: parseFloat(o.unitPrice) || 0,
        sku: o.sku ? `${o.sku}` : '',
        productDescription: o.productDescription || '',
        productName: o.productName || '',
        qty: parseFloat(o.qty) || 0,
        netAmount: parseFloat(o.netAmount) || 0,
        measurementUnitName: o.measurementUnitName || '',
      }));
      setOrderDetails(orderDetals);
      setPayments(result.data.results[2] || []);
    } catch (error) {
      console.error('Error loading order receipt:', error);
      setError('Failed to load receipt data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleAction = async () => {
    setError('');
    setEmailError('');
    setPhoneError('');

    if (actionOption === 'print') {
      if (printOption === 'browserPrint') {
        window.print();
      } else if (printOption === 'printdesk' && selectedPrinter) {
        const payload = {
          receiptData: [[orderHeader], orderDetails, payments],
          printerName: selectedPrinter,
          receiptSize: '80mm',
          printDeskId: printdeskId,
        };
        try {
          await exPrintReceipt(payload);
        } catch (error) {
          console.error('Error printing receipt:', error);
          setError('Failed to print receipt. Please check printer settings.');
        }
      } else {
        setError('Please select a printer for Printdesk.');
        return;
      }
    } else if (actionOption === 'email') {
      if (!email) {
        setEmailError('Please enter an email address.');
        return;
      }
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }
      console.log(`Sending receipt to email: ${email}`);
      // Implement sendReceiptEmail(email, receiptData) here
    } else if (actionOption === 'sms') {
      if (!phone) {
        setPhoneError('Please enter a phone number.');
        return;
      }
      if (!validatePhone(phone)) {
        setPhoneError('Please enter a valid phone number (10-15 digits).');
        return;
      }
      console.log(`Sending receipt to phone: ${phone}`);
      // Implement sendReceiptSMS(phone, receiptData) here
    }
  };

  const handleNewOrder = () => {
    dispatch(clearOrderList({}));
    setIsPaymentConfirmShow(false);
  };

  const handleClose = () => {
    setIsPaymentConfirmShow(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receipt Preview Section */}
        <div className="p-6 bg-gray-50 rounded-l-xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-lg font-semibold text-gray-600">Loading receipt...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-600 font-medium">{error}</div>
            </div>
          ) : (
            <ReceiptComponent
              orderHeader={orderHeader}
              orderDetails={orderDetails}
              payments={payments}
              currency={currency}
              setCashPaymentChage={setChange}
            />
          )}
        </div>

        {/* Control Panel Section */}
        <div className="p-8 flex flex-col justify-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Payment Confirmation</h2>
            <div className="text-center mb-6">
              <label className="text-2xl font-semibold text-sky-700">Balance</label>
              <div className="text-3xl font-semibold text-sky-700 mt-1">
                {change ? formatCurrency(change) : 'No change'}
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-700 text-center mb-6">
              How would you like to share the receipt?
            </h3>

            {/* Action Options */}
            <div className="flex justify-center gap-6 mb-6">
              <button
                className={`p-4 rounded-full ${actionOption === 'print' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
                onClick={() => setActionOption('print')}
                title="Print Receipt"
              >
                <FaPrint className="h-8 w-8" />
              </button>
              <button
                className={`p-4 rounded-full ${actionOption === 'email' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
                onClick={() => setActionOption('email')}
                title="Send via Email"
              >
                <FaEnvelope className="h-8 w-8" />
              </button>
              <button
                className={`p-4 rounded-full ${actionOption === 'sms' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
                onClick={() => setActionOption('sms')}
                title="Send via SMS"
              >
                <FaSms className="h-8 w-8" />
              </button>
            </div>

            {/* Conditional Inputs */}
            {actionOption === 'print' && (
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-center gap-4">
                  <button
                    className={`p-3 rounded-full ${printOption === 'browserPrint' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
                    onClick={() => setPrintOption('browserPrint')}
                    title="Browser Print"
                  >
                    <FaGlobe className="h-6 w-6" />
                  </button>
                  <button
                    className={`p-3 rounded-full ${printOption === 'printdesk' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
                    onClick={() => setPrintOption('printdesk')}
                    title="Printdesk"
                  >
                    <FaPrint className="h-6 w-6" />
                  </button>
                </div>
                {printOption === 'printdesk' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="printer" className="font-semibold text-gray-700">
                      Select Printer
                    </label>
                    <select
                      id="printer"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200"
                      value={selectedPrinter}
                      onChange={(e) => setSelectedPrinter(e.target.value)}
                      disabled={!printerList?.length}
                    >
                      {printerList?.length > 0 ? (
                        printerList.map((printer, index) => (
                          <option key={index} value={printer.PrinterName}>
                            {printer.PrinterName} {printer.IsDefault ? '(Default)' : ''}{' '}
                            {printer.IsOnline ? '(Online)' : '(Offline)'}
                          </option>
                        ))
                      ) : (
                        <option value="">No printers available</option>
                      )}
                    </select>
                  </div>
                )}
              </div>
            )}

            {actionOption === 'email' && (
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="email" className="font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full p-2.5 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder={orderHeader?.customerEmail ? `e.g., ${orderHeader.customerEmail}` : 'Enter email address'}
                  autoComplete="email"
                />
                {emailError && <p className="text-sm text-red-600">{emailError}</p>}
              </div>
            )}

            {actionOption === 'sms' && (
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="phone" className="font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full p-2.5 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200`}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  placeholder={orderHeader?.customerPhone ? `e.g., ${orderHeader.customerPhone}` : 'Enter phone number'}
                  autoComplete="tel"
                />
                {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
            {openBy !== 'SalesHistory' ? (
              <button
                className="py-3 px-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg flex items-center gap-2"
                onClick={handleNewOrder}
              >
                <FaPrint className="h-6 w-6" />
                New Order
              </button>
            ) : (
              <button
                className="py-3 px-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg flex items-center gap-2"
                onClick={handleClose}
              >
                <FaPrint className="h-6 w-6" />
                Close
              </button>
            )}
            <button
              className="py-3 px-8 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-lg flex items-center gap-2 disabled:opacity-50"
              onClick={handleAction}
              disabled={isLoading || (actionOption === 'print' && printOption === 'printdesk' && !selectedPrinter && printerList?.length > 0) || (actionOption === 'email' && !email) || (actionOption === 'sms' && !phone)}
            >
              {actionOption === 'print' ? <FaPrint className="h-6 w-6" /> : actionOption === 'email' ? <FaEnvelope className="h-6 w-6" /> : <FaSms className="h-6 w-6" />}
              {actionOption === 'print' ? 'Print Receipt' : actionOption === 'email' ? 'Send Email' : 'Send SMS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirm;
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
// import { formatCurrency } from '../../utils/format';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearOrderList } from '../../state/orderList/orderListSlice';
// import { saveAs } from 'file-saver';
// import { exPrintReceipt } from '../../functions/exPrint';
// import { getTenantId } from '../../functions/authService';
// import { getOrderReceipt } from '../../functions/register';

// function PaymentConfirm({orderId,setIsPaymentConfirmShow,openBy}) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const terminalId = JSON.parse(localStorage.getItem('terminalId'));
//   let location = useLocation();
//   let searchParams = new URLSearchParams(location.search);
//  // let orderId = searchParams.get('orderId');

//   const [printOption, setPrintOption] = useState('printdesk');
//   const [selectedPrinter, setSelectedPrinter] = useState('');
//   const [change, setChange] = useState('');
//   const [emailChecked, setEmailChecked] = useState(false);
//   const [email, setEmail] = useState('');
//   const printdeskId = localStorage.getItem('printdeskId');
//   const { printerList } = useSelector((state) => state.printer);

//   const [orderHeader, setOrderHeader] = useState(null);
//   const [orderDetails, setOrderDetails] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [currency, setCurrency] = useState(null);

//   useEffect(() => {
//     if(orderId){
//     loadOrderReceipt();
//     }
//     console.log('ReceiptComponent', orderId);
//   }, [orderId]);

//   const loadOrderReceipt = async () => {
//     const result = await getOrderReceipt(orderId);
//     const oh = result.data.results[0][0];
//     setCurrency(oh.symbol);
//     setOrderHeader(result.data.results[0][0]);
//     const od = result.data.results[1];
//     console.log('oooo', od);
//     const orderDetals = [];
//     od.map(o => {
//       const sku=o.sku ? `${o.sku}`:'';

//       const netAmount = parseFloat(o.netAmount) || 0;
//       const qty = parseFloat(o.qty) || 0;
//       const measurementUnitName = o.measurementUnitName;
//       const obj = {
//         o,
//         line: o.orderDetailId,
//         unitPrice: o.unitPrice,
//         sku:sku,
//         productDescription: o.productDescription,
//         productName: o.productName,
//         qty: qty,
//         netAmount: netAmount,
//         measurementUnitName,
//       };
//       orderDetals.push(obj);
//     });
//     setOrderDetails(orderDetals);
//     setPayments(result.data.results[2]);
//   };

//   useEffect(() => {
//     if (printOption === 'printdesk' && printerList.length > 0) {
//       const defaultPrinter = printerList.find((printer) => printer.IsDefault) || printerList[0];
//       setSelectedPrinter(defaultPrinter.PrinterName);
//     }
//   }, [printOption, printerList]);

//   const setCashPaymentChangeHandler = (value) => {
//     setChange(value);
//   };

//   const onSubmit = async () => {
//     if (printOption === 'browserPrint') {
//       console.log('Browser Print selected');
//       window.print();
//     } else if (printOption === 'printdesk') {
//       const payload = {
//         receiptData: [[orderHeader], orderDetails, payments],
//         printerName: selectedPrinter,
//         receiptSize: "80mm",
//         printDeskId: printdeskId,
//       };
//       console.log('Quick Print payload:', payload);
//       exPrintReceipt(payload);
//     }

//     if (emailChecked && email) {
//       console.log(`Send receipt to email: ${email}`);
//     }
//   };

//   return (
    
//       <div className="grid grid-cols-2  bg-white rounded-lg">
//         <div className=" p-6 bg-gray-50">
//           <ReceiptComponent
//             orderHeader={orderHeader}
//             orderDetails={orderDetails}
//             payments={payments}
//             currency={currency}
//             setCashPaymentChage={setCashPaymentChangeHandler}
//           />
//         </div>
//         <div className=" p-8 flex flex-col justify-center bg-white">
//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Balance</h2>
//           <div className="text-center text-4xl font-semibold text-green-600 mb-6">
//             {change && formatCurrency(change)}
//           </div>
//           <h3 className="text-center text-lg font-medium text-gray-700 mb-6">
//             Would you like a receipt?
//           </h3>
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-2">
//               <label htmlFor="printOption" className="font-semibold text-gray-700">
//                 Select Print Option:
//               </label>
//               <select
//                 id="printOption"
//                 className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 bg-white"
//                 value={printOption}
//                 onChange={(e) => setPrintOption(e.target.value)}
//               >
//                 <option value="browserPrint">Browser Print</option>
//                 <option value="printdesk">Printdesk</option>
//               </select>
//             </div>
//             {printOption === 'printdesk' && (
//               <div className="flex flex-col gap-2">
//                 <label htmlFor="printer" className="font-semibold text-gray-700">
//                   Select Printer:
//                 </label>
//                 <select
//                   id="printer"
//                   className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 bg-white"
//                   value={selectedPrinter}
//                   onChange={(e) => setSelectedPrinter(e.target.value)}
//                 >
//                   {printerList.map((printer, index) => (
//                     <option key={index} value={printer.PrinterName}>
//                       {printer.PrinterName} {printer.IsDefault ? '(Default)' : ''} {printer.IsOnline ? '(Online)' : '(Offline)'}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
         
//            {openBy!=='SalesHistory' &&   <button
//                 className="py-3 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
//                 onClick={() => {
//                   dispatch(clearOrderList({}));
// setIsPaymentConfirmShow(false);
//                   //navigate(`/register/${terminalId}`);
//                 }}
//               >
//                 New Order
//               </button>}
//        {openBy==='SalesHistory' &&   <button
//                 className="py-3 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
//                 onClick={() => {
// setIsPaymentConfirmShow(false);
//                   //navigate(`/register/${terminalId}`);
//                 }}
//               >
//               Close
//               </button>}
//               <button
//                 className="py-3 px-6 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors font-semibold"
//                 onClick={onSubmit}
//               >
//                 Print
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//   );
// }

// export default PaymentConfirm;