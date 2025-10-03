import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderList } from '../../state/orderList/orderListSlice';
import { saveAs } from 'file-saver';
import { exPrintReceipt } from '../../functions/exPrint';
import { getTenantId } from '../../functions/authService';
import { getOrderReceipt } from '../../functions/register';
import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
import { formatCurrency } from '../../utils/format';
import { FaPrint, FaEnvelope, FaSms, FaGlobe, FaPrayingHands } from 'react-icons/fa';
import html2canvas from 'html2canvas';

import { invoke } from "@tauri-apps/api/core";
import { getPrinters } from "tauri-plugin-printer-v2";
import EscPosEncoder from "@manhnd/esc-pos-encoder";

function PaymentConfirm({ orderId, setIsPaymentConfirmShow, openBy }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { printerList } = useSelector((state) => state.printer);
  const terminalId = JSON.parse(localStorage.getItem('terminalId'));
  const printdeskId = localStorage.getItem('printdeskId');
  const location = useLocation();
  const [actionOption, setActionOption] = useState('print');
  const [printOption, setPrintOption] = useState('printdesk');
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
  const receiptRef = useRef(null);

  const [isPrintButtonLoading,setIsPrintButtonLoading]=useState(false);
const isTauriApp = 'isTauri' in window && !!window.isTauri;

const [tauriPrinterList,setTauriPrinterList]=useState([]);


useEffect(()=>{
  if(isTauriApp){
  loadTauriPrinters();

  }
},[])



const loadTauriPrinters=async()=>{
                         const printers = JSON.parse(await getPrinters());
    console.log('getPrinters:',printers);
      // set selected printer to the first one if available
      setTauriPrinterList(printers);
      if (printers?.length > 0) {
        setSelectedPrinter(printers[0].Name);
      }



}
  useEffect(() => {
    if (orderId) {
      loadOrderReceipt();
    }
  }, [orderId]);


  useEffect(() => {
    if (actionOption === 'print' && printOption !== 'browserPrint' && printerList?.length > 0) {
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
      console.log('API Response:', result); // Debug
      const oh = result.data.results[0]?.[0];
      if (!oh) throw new Error('Order header not found');
      setCurrency(oh.symbol || '$');
      setOrderHeader(oh);
      setEmail(oh.customerEmail || '');
      setPhone(oh.customerPhone || '');
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


async function printText() {

   const encoder = new EscPosEncoder();
    const result = encoder.initialize()
      .align("center")
      .text("My Store")
      .newline()
      .align("left")
      .text("Item 1     $5.00")
      .newline()
      .text("Item 2     $3.50")
      .newline()
      .newline()
      .align("center")
      .text("Thank you!")
      .newline()
      .cut()
      .encode();

    // Send to Tauri backend
    await invoke("print_receipt", {
      printerName: "XP-80C", // Replace with your printer name
      bytes: Array.from(result)
    });

}




function resultToPng(result, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  let byteIndex = 0;
  let pixelY = 0;

  // Skip initialization commands
  while (
    byteIndex < result.length &&
    !(
      result[byteIndex] === 0x1D &&
      result[byteIndex + 1] === 0x76 &&
      result[byteIndex + 2] === 0x30 &&
      result[byteIndex + 3] === 0x00
    )
  ) {
    byteIndex++;
  }

  // Process raster data
  while (byteIndex < result.length && pixelY < height) {
    if (
      result[byteIndex] === 0x1D &&
      result[byteIndex + 1] === 0x76 &&
      result[byteIndex + 2] === 0x30 &&
      result[byteIndex + 3] === 0x00
    ) {
      const xL = result[byteIndex + 4];
      const xH = result[byteIndex + 5];
      const yL = result[byteIndex + 6];
      const yH = result[byteIndex + 7];
      const sliceWidthBytes = xL + (xH << 8);
      const sliceHeight = yL + (yH << 8);
      byteIndex += 8;

      for (let y = 0; y < sliceHeight && pixelY < height; y++) {
        for (let x = 0; x < sliceWidthBytes * 8 && x < width; x += 8) {
          const byte = result[byteIndex] || 0;
          byteIndex++;
          for (let bit = 0; bit < 8; bit++) {
            const pixelX = x + bit;
            if (pixelX < width) {
              const pixelIndex = ((pixelY + y) * width + pixelX) * 4;
              const isBlack = (byte & (1 << (7 - bit))) !== 0;
              data[pixelIndex] = isBlack ? 0 : 255; // R
              data[pixelIndex + 1] = isBlack ? 0 : 255; // G
              data[pixelIndex + 2] = isBlack ? 0 : 255; // B
              data[pixelIndex + 3] = 255; // A
            }
          }
        }
      }
      pixelY += sliceHeight;

      // Skip ESC J 4 (0x1B, 0x4A, 0x04) if present
      if (
        byteIndex < result.length &&
        result[byteIndex] === 0x1B &&
        result[byteIndex + 1] === 0x4A &&
        result[byteIndex + 2] === 0x04
      ) {
        byteIndex += 3;
      }
    } else {
      byteIndex++; // Skip non-raster commands (e.g., finalCommands)
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'result_receipt.png';
  link.click();
}



function floydSteinbergDither(imageData, width, height) {
  const pixels = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const oldPixel = pixels[i]; // just use Red channel (grayscale assumption)
      const newPixel = oldPixel < 128 ? 0 : 255;
      const error = oldPixel - newPixel;

      // Apply newPixel to all channels (black or white)
      pixels[i] = pixels[i + 1] = pixels[i + 2] = newPixel;

      // Distribute the error (grayscale only → apply to R channel, G, B equally)
      function distributeError(idx, factor) {
        if (idx >= 0 && idx < pixels.length) {
          pixels[idx] = Math.min(255, Math.max(0, pixels[idx] + (error * factor) / 16));
          pixels[idx + 1] = pixels[idx]; // keep G same
          pixels[idx + 2] = pixels[idx]; // keep B same
        }
      }

      // Right pixel
      if (x + 1 < width) distributeError(i + 4, 7);

      // Bottom row
      if (y + 1 < height) {
        if (x > 0) distributeError(i + (width - 1) * 4, 3); // bottom-left
        distributeError(i + width * 4, 5); // bottom
        if (x + 1 < width) distributeError(i + (width + 1) * 4, 1); // bottom-right
      }
    }
  }

  return imageData;
}


// Convert dithered image into raster bytes for ESC/POS
function imageToRasterBytes(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  let imageData = ctx.getImageData(0, 0, width, height);

  // Apply dithering
  imageData = floydSteinbergDither(imageData, width, height);

  const pixels = imageData.data;
  const bytes = [];
  const maxSliceHeight = 64;

  for (let sliceStart = 0; sliceStart < height; sliceStart += maxSliceHeight) {
    const sliceHeight = Math.min(maxSliceHeight, height - sliceStart);

    // GS v 0 raster command
    bytes.push(0x1D, 0x76, 0x30, 0x00);
    bytes.push(Math.floor(width / 8) & 0xFF, (width / 8) >> 8);
    bytes.push(sliceHeight & 0xFF, (sliceHeight >> 8) & 0xFF);

    for (let y = 0; y < sliceHeight; y++) {
      for (let x = 0; x < width; x += 8) {
        let byte = 0;
        for (let bit = 0; bit < 8; bit++) {
          const pixelX = x + bit;
          if (pixelX < width) {
            const i = ((sliceStart + y) * width + pixelX) * 4;
            const isBlack = pixels[i] < 128; // already dithered
            if (isBlack) byte |= 1 << (7 - bit);
          }
        }
        bytes.push(byte);
      }
    }

    // Line feed for alignment
    bytes.push(0x1B, 0x4A, 0x02);
  }

  return bytes;
}


async function printImage() {
  const receiptElement = receiptRef.current;
  if (!receiptElement) throw new Error('Receipt element not found');

  // Printer width for 80mm at 203 DPI (8 dots/mm) = 576 pixels
  const printerWidthPx = 576;

  // Calculate scale to map receipt element to printer width
  const scale = printerWidthPx / receiptElement.offsetWidth;

  // Capture the receipt element with html2canvas
  const canvas = await html2canvas(receiptElement, {
    scale, // Scale to match printer width
    backgroundColor: '#fff', // White background
    logging: true,
    useCORS: true,
    width: receiptElement.offsetWidth,
    height: receiptElement.offsetHeight, // Ensure full height
    scrollX: 0,
    scrollY: 0, // Reset scroll to capture top
  });

  // Debug: Save canvas as PNG to verify rendering
  // const link = document.createElement('a');
  // link.href = canvas.toDataURL('image/png');
  // link.download = 'receipt.png';
  // link.click();

  // ESC/POS initialization and alignment commands
  const initCommands = [
    0x1B, 0x40, // ESC @ (Initialize printer)
    0x1B, 0x61, 0x00, // ESC a 0 (Left alignment)
    0x1B, 0x33, 0x00, // ESC 3 n (Set line spacing to 0 for tight raster printing)
  ];


  const rasterBytes = imageToRasterBytes(canvas);

  // Add line feed and cut commands
  const finalCommands = [
    0x1B, 0x4A, 0xFF, // ESC J n (Feed paper 16/203 inches)
        // 0x1B, 0x4A, 0x97, // ESC J n (Feed paper 151/203 inches, ~0.744 inches)
    0x1D, 0x56, 0x00, // GS v 0 (Cut paper)
  ];
  
  const result = new Uint8Array([
    ...initCommands,
    ...rasterBytes,
    ...finalCommands,
  ]);

    // Debug: Convert result to PNG
  //resultToPng(result, canvas.width, canvas.height);

  //console.log('Raster bytes length:', rasterBytes.length);
 // console.log('Total bytes to send:', result.length);

  await invoke('print_receipt', {
    printerName: selectedPrinter,
    // printerName: 'XP-80C',
    bytes: Array.from(result),
  });

}




const handleTauriPrint = async () => {

// Usage
//printText();
setIsPrintButtonLoading(true);
 await printImage();//option 1
 setIsPrintButtonLoading(false);
};



  const handleAction = async () => {
    setError('');
    setEmailError('');
    setPhoneError('');

    if (actionOption === 'print') {
      if (!isTauriApp) {
        window.print();
      }
       else if (isTauriApp) {
        await handleTauriPrint();
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
{/* <ReceiptTestComp /> */}

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
            <>
               <ReceiptComponent
                orderHeader={orderHeader}
                orderDetails={orderDetails}
                payments={payments}
                currency={currency}
                setCashPaymentChage={setChange}
                 ref={receiptRef} 
              /> 
               {/* <div style={{ position: 'absolute', left: '-9999px' }}> */}
                {/* <SimpleReceipt ref={receiptRef} /> */}
              {/* </div>  */}
            </>
          )}
        </div>
        <div className="p-8 flex flex-col justify-start">
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
          <div className="flex justify-center gap-6 mb-6">
            <button
              className={`p-4 rounded-full ${actionOption === 'print' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
              onClick={() => setActionOption('print')}
              title={isPrintButtonLoading?"Printing...":"Print Receipt"} 
              disabled={isPrintButtonLoading}
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
          {actionOption === 'print' && (
            <div className="flex flex-col gap-4 mb-4">    
              {isTauriApp && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="printer" className="font-semibold text-gray-700">
                    Select Printer
                  </label>
                  <select
                    id="printer"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200"
                    value={selectedPrinter}
                    onChange={(e) => setSelectedPrinter(e.target.value)}
                    disabled={!tauriPrinterList?.length}
                  >
                    {tauriPrinterList?.length > 0 ? (
                      tauriPrinterList.map((printer, index) => (
                        <option key={index} value={printer.Name}>
                          {printer.Name}
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
  className="py-3 px-8 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all duration-150 ease-in-out 
             active:scale-95 active:shadow-inner font-medium text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={handleAction}
  disabled={isPrintButtonLoading}
>
  {actionOption === 'print' ? <FaPrint className="h-6 w-6" /> : actionOption === 'email' ? <FaEnvelope className="h-6 w-6" /> : <FaSms className="h-6 w-6" />}

  {actionOption === 'print' && 'Print Receipt'}
  {actionOption === 'email' && 'Send Email'}
  {actionOption === 'sms' && 'Send SMS'}
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
// import { useDispatch, useSelector } from 'react-redux';
// import { clearOrderList } from '../../state/orderList/orderListSlice';
// import { saveAs } from 'file-saver';
// import { exPrintReceipt } from '../../functions/exPrint';
// import { getTenantId } from '../../functions/authService';
// import { getOrderReceipt } from '../../functions/register';
// import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
// import { formatCurrency } from '../../utils/format';
// import { FaPrint, FaEnvelope, FaSms, FaGlobe, FaPrinter } from 'react-icons/fa';

// function PaymentConfirm({ orderId, setIsPaymentConfirmShow, openBy }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { printerList } = useSelector((state) => state.printer);
//   const terminalId = JSON.parse(localStorage.getItem('terminalId'));
//   const printdeskId = localStorage.getItem('printdeskId');
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);

//   const [actionOption, setActionOption] = useState('print'); // 'print', 'email', or 'sms'
//   const [printOption, setPrintOption] = useState('printdesk'); // 'browserPrint' or 'printdesk'
//   const [selectedPrinter, setSelectedPrinter] = useState('');
//   const [change, setChange] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [orderHeader, setOrderHeader] = useState(null);
//   const [orderDetails, setOrderDetails] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [currency, setCurrency] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [emailError, setEmailError] = useState('');
//   const [phoneError, setPhoneError] = useState('');

//   useEffect(() => {
//     if (orderId) {
//       loadOrderReceipt();
//     }
//   }, [orderId]);

//   useEffect(() => {
//     if (actionOption === 'print' && printOption === 'printdesk' && printerList?.length > 0) {
//       const defaultPrinter = printerList.find((printer) => printer.IsDefault) || printerList[0];
//       setSelectedPrinter(defaultPrinter?.PrinterName || '');
//     } else {
//       setSelectedPrinter('');
//     }
//   }, [actionOption, printOption, printerList]);

//   const loadOrderReceipt = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const result = await getOrderReceipt(orderId);
//       const oh = result.data.results[0]?.[0];
//       if (!oh) throw new Error('Order header not found');
//       setCurrency(oh.symbol || '$');
//       setOrderHeader(oh);
//       setEmail(oh.customerEmail || ''); // Pre-fill email if available
//       setPhone(oh.customerPhone || ''); // Pre-fill phone if available
//       const od = result.data.results[1] || [];
//       const orderDetals = od.map((o) => ({
//         o,
//         line: o.orderDetailId,
//         unitPrice: parseFloat(o.unitPrice) || 0,
//         sku: o.sku ? `${o.sku}` : '',
//         productDescription: o.productDescription || '',
//         productName: o.productName || '',
//         qty: parseFloat(o.qty) || 0,
//         netAmount: parseFloat(o.netAmount) || 0,
//         measurementUnitName: o.measurementUnitName || '',
//       }));
//       setOrderDetails(orderDetals);
//       setPayments(result.data.results[2] || []);
//     } catch (error) {
//       console.error('Error loading order receipt:', error);
//       setError('Failed to load receipt data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePhone = (phone) => {
//     const phoneRegex = /^\+?\d{10,15}$/;
//     return phoneRegex.test(phone);
//   };

//   const handleAction = async () => {
//     setError('');
//     setEmailError('');
//     setPhoneError('');

//     if (actionOption === 'print') {
//       if (printOption === 'browserPrint') {
//         window.print();
//       } else if (printOption === 'printdesk' && selectedPrinter) {
//         const payload = {
//           receiptData: [[orderHeader], orderDetails, payments],
//           printerName: selectedPrinter,
//           receiptSize: '80mm',
//           printDeskId: printdeskId,
//         };
//         try {
//           await exPrintReceipt(payload);
//         } catch (error) {
//           console.error('Error printing receipt:', error);
//           setError('Failed to print receipt. Please check printer settings.');
//         }
//       } else {
//         setError('Please select a printer for Printdesk.');
//         return;
//       }
//     } else if (actionOption === 'email') {
//       if (!email) {
//         setEmailError('Please enter an email address.');
//         return;
//       }
//       if (!validateEmail(email)) {
//         setEmailError('Please enter a valid email address.');
//         return;
//       }
//       console.log(`Sending receipt to email: ${email}`);
//       // Implement sendReceiptEmail(email, receiptData) here
//     } else if (actionOption === 'sms') {
//       if (!phone) {
//         setPhoneError('Please enter a phone number.');
//         return;
//       }
//       if (!validatePhone(phone)) {
//         setPhoneError('Please enter a valid phone number (10-15 digits).');
//         return;
//       }
//       console.log(`Sending receipt to phone: ${phone}`);
//       // Implement sendReceiptSMS(phone, receiptData) here
//     }
//   };

//   const handleNewOrder = () => {
//     dispatch(clearOrderList({}));
//     setIsPaymentConfirmShow(false);
//   };

//   const handleClose = () => {
//     setIsPaymentConfirmShow(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Receipt Preview Section */}
//         <div className="p-6 bg-gray-50 rounded-l-xl">
//           {isLoading ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-lg font-semibold text-gray-600">Loading receipt...</div>
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-red-600 font-medium">{error}</div>
//             </div>
//           ) : (
//             <ReceiptComponent
//               orderHeader={orderHeader}
//               orderDetails={orderDetails}
//               payments={payments}
//               currency={currency}
//               setCashPaymentChage={setChange}
//             />
//           )}
//         </div>

//         {/* Control Panel Section */}
//         <div className="p-8 flex flex-col justify-start">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Payment Confirmation</h2>
//             <div className="text-center mb-6">
//               <label className="text-2xl font-semibold text-sky-700">Balance</label>
//               <div className="text-3xl font-semibold text-sky-700 mt-1">
//                 {change ? formatCurrency(change) : 'No change'}
//               </div>
//             </div>
//             <h3 className="text-xl font-medium text-gray-700 text-center mb-6">
//               How would you like to share the receipt?
//             </h3>

//             {/* Action Options */}
//             <div className="flex justify-center gap-6 mb-6">
//               <button
//                 className={`p-4 rounded-full ${actionOption === 'print' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
//                 onClick={() => setActionOption('print')}
//                 title="Print Receipt"
//               >
//                 <FaPrint className="h-8 w-8" />
//               </button>
//               <button
//                 className={`p-4 rounded-full ${actionOption === 'email' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
//                 onClick={() => setActionOption('email')}
//                 title="Send via Email"
//               >
//                 <FaEnvelope className="h-8 w-8" />
//               </button>
//               <button
//                 className={`p-4 rounded-full ${actionOption === 'sms' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
//                 onClick={() => setActionOption('sms')}
//                 title="Send via SMS"
//               >
//                 <FaSms className="h-8 w-8" />
//               </button>
//             </div>

//             {/* Conditional Inputs */}
//             {actionOption === 'print' && (
//               <div className="flex flex-col gap-4 mb-4">
//                 <div className="flex justify-center gap-4">
//                   <button
//                     className={`p-3 rounded-full ${printOption === 'browserPrint' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
//                     onClick={() => setPrintOption('browserPrint')}
//                     title="Browser Print"
//                   >
//                     <FaGlobe className="h-6 w-6" />
//                   </button>
//                   <button
//                     className={`p-3 rounded-full ${printOption === 'printdesk' ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-sky-500 hover:text-white transition-colors`}
//                     onClick={() => setPrintOption('printdesk')}
//                     title="Printdesk"
//                   >
//                     <FaPrint className="h-6 w-6" />
//                   </button>
//                 </div>
//                 {printOption === 'printdesk' && (
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="printer" className="font-semibold text-gray-700">
//                       Select Printer
//                     </label>
//                     <select
//                       id="printer"
//                       className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200"
//                       value={selectedPrinter}
//                       onChange={(e) => setSelectedPrinter(e.target.value)}
//                       disabled={!printerList?.length}
//                     >
//                       {printerList?.length > 0 ? (
//                         printerList.map((printer, index) => (
//                           <option key={index} value={printer.PrinterName}>
//                             {printer.PrinterName} {printer.IsDefault ? '(Default)' : ''}{' '}
//                             {printer.IsOnline ? '(Online)' : '(Offline)'}
//                           </option>
//                         ))
//                       ) : (
//                         <option value="">No printers available</option>
//                       )}
//                     </select>
//                   </div>
//                 )}
//               </div>
//             )}

//             {actionOption === 'email' && (
//               <div className="flex flex-col gap-2 mb-4">
//                 <label htmlFor="email" className="font-semibold text-gray-700">
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   className={`w-full p-2.5 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200`}
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     setEmailError('');
//                   }}
//                   placeholder={orderHeader?.customerEmail ? `e.g., ${orderHeader.customerEmail}` : 'Enter email address'}
//                   autoComplete="email"
//                 />
//                 {emailError && <p className="text-sm text-red-600">{emailError}</p>}
//               </div>
//             )}

//             {actionOption === 'sms' && (
//               <div className="flex flex-col gap-2 mb-4">
//                 <label htmlFor="phone" className="font-semibold text-gray-700">
//                   Phone Number
//                 </label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   className={`w-full p-2.5 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-700 transition duration-200`}
//                   value={phone}
//                   onChange={(e) => {
//                     setPhone(e.target.value);
//                     setPhoneError('');
//                   }}
//                   placeholder={orderHeader?.customerPhone ? `e.g., ${orderHeader.customerPhone}` : 'Enter phone number'}
//                   autoComplete="tel"
//                 />
//                 {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
//             {openBy !== 'SalesHistory' ? (
//               <button
//                 className="py-3 px-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg flex items-center gap-2"
//                 onClick={handleNewOrder}
//               >
//                 <FaPrint className="h-6 w-6" />
//                 New Order
//               </button>
//             ) : (
//               <button
//                 className="py-3 px-8 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg flex items-center gap-2"
//                 onClick={handleClose}
//               >
//                 <FaPrint className="h-6 w-6" />
//                 Close
//               </button>
//             )}
//             <button
//               className="py-3 px-8 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-lg flex items-center gap-2 disabled:opacity-50"
//               onClick={handleAction}
//               disabled={isLoading || (actionOption === 'print' && printOption === 'printdesk' && !selectedPrinter && printerList?.length > 0) || (actionOption === 'email' && !email) || (actionOption === 'sms' && !phone)}
//             >
//               {actionOption === 'print' ? <FaPrint className="h-6 w-6" /> : actionOption === 'email' ? <FaEnvelope className="h-6 w-6" /> : <FaSms className="h-6 w-6" />}
//               {actionOption === 'print' ? 'Print Receipt' : actionOption === 'email' ? 'Send Email' : 'Send SMS'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentConfirm;