import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import PrintFeature from '../../components/receipt/features/PrintFeature';
import EmailFeature from '../../components/receipt/features/EmailFeature';
import SmsFeature from '../../components/receipt/features/SmsFeature';

import { invoke } from "@tauri-apps/api/core";
import { getPrinters } from "tauri-plugin-printer-v2";
import ZReportComponent from '../../components/register/zReport/ZReportComponent';
import { getSessionEndZReport } from '../../functions/session';
import { useNavigate } from 'react-router-dom';

function ZReportIndex({ sessionId,setIsZReportVisible, reload,opendBy }) {
   const navigate = useNavigate();
 
  const { printerList } = useSelector((state) => state.printer);
  const [actionOption, setActionOption] = useState('print');
  const [printOption, setPrintOption] = useState('printdesk');
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [cashDenominationTotal] = useState(0);


const zReportRef = useRef(null);



  const [isPrintButtonLoading,setIsPrintButtonLoading]=useState(false);
const isTauriApp = 'isTauri' in window && !!window.isTauri;

const [tauriPrinterList,setTauriPrinterList]=useState([]);

const [dayendDetails, setDayendDetails] = useState(null);

const [sessionDetails, setSessionDetails] = useState(null);

  const terminal =  JSON.parse(localStorage.getItem('terminal'));


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
    if (sessionId) {
      loadOrderReceipt();
    }
  }, [sessionId,reload]);


  useEffect(() => {
    if (actionOption === 'print' && printOption !== 'browserPrint' && printerList?.length > 0) {
      const defaultPrinter = printerList.find((printer) => printer.IsDefault) || printerList[0];
      setSelectedPrinter(defaultPrinter?.PrinterName || '');
    } else {
      setSelectedPrinter('');
    }
  }, [actionOption, printOption, printerList]);

  const loadOrderReceipt = async () => {

      setIsLoading(true);
      setError(null);
    
  try {
  
      if (!sessionId) return;
      setIsLoading(true);
   
      const result = await getSessionEndZReport(sessionId);
      console.log("Z-report details:", result.data.results[0][0]);
      setDayendDetails(result.data.results[0][0]);
    } catch (err) {
      console.error(err);
           console.error("Failed to fetch Z-report details:", err);
        setError("Something went wrong while fetching data.");
    } finally {
      setIsLoading(false);
    }
   
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value) => /^\+?\d{10,15}$/.test(value);




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
  const receiptElement = zReportRef.current;
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



  const handleClose = () => {

      setIsZReportVisible(false);

      if(opendBy==="dayendClose"){
        navigate("/home")
      }
    
  };

  const handleAction = async () => {
    setError('');
    setEmailError('');
    setPhoneError('');

    if (actionOption === 'print') {
      if (!isTauriApp) {
        window.print();
      } else if (isTauriApp) {
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
      console.log(`Sending Z report to email: ${email}`);
    } else if (actionOption === 'sms' || actionOption === 'whatsapp') {
      if (!phone) {
        setPhoneError('Please enter a phone number.');
        return;
      }
      if (!validatePhone(phone)) {
        setPhoneError('Please enter a valid phone number (10-15 digits).');
        return;
      }
      console.log(`Sending Z report via ${actionOption}: ${phone}`);
    }
   // handleClose();
  };


  return (
    <div className="bg-white flex items-center justify-center z-50">
      <div className="rounded-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="relative p-6 flex flex-col justify-between bg-white">
          <div className="rounded-2xl p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Share Z Report</p>
                <p className="text-sm text-slate-500">Choose how to send the Z report</p>
              </div>
            </div>

            <div className="space-y-3">
              <PrintFeature
                isSelected={actionOption === 'print'}
                onSelect={() => setActionOption('print')}
                itemName="Z Report"
              />

              <EmailFeature
                isSelected={actionOption === 'email'}
                onSelect={() => setActionOption('email')}
                email={email}
                setEmail={setEmail}
                emailError={emailError}
                setEmailError={setEmailError}
                placeholder="Enter email address"
              />

              {/* <SmsFeature
                isSelected={actionOption === 'sms'}
                onSelect={() => setActionOption('sms')}
                phone={phone}
                setPhone={setPhone}
                phoneError={phoneError}
                setPhoneError={setPhoneError}
                placeholder="Enter phone number"
              /> */}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={handleClose}
            >
              <span className="flex items-center justify-center gap-2">
                <FaTimes className="h-4 w-4" />
                Close
              </span>
            </button>

            <button
              className="flex-1 rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-sky-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleAction}
              disabled={isPrintButtonLoading}
            >
              {actionOption === 'print' ? 'Print Z Report' : actionOption === 'email' ? 'Send Email' : actionOption === 'sms' ? 'Send SMS' : 'Send Receipt'}
            </button>
          </div>
        </div>

     <div className="p-6 rounded-xl bg-white border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-lg font-semibold text-gray-600">Loading receipt...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-600 font-medium">{error}</div>
            </div>
          ) : (
              
            <div 
              style={{
                maxHeight: '70vh', // Adjust as needed for your popup
                overflowY: 'auto',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
           <ZReportComponent
                sessionDetails={sessionDetails}
                dayendDetails={dayendDetails}
                cashDenominationTotal={cashDenominationTotal}
                ref={zReportRef}
              />
            </div>
       
          )}
        </div>


      </div>
    </div>
  );
}

export default ZReportIndex;