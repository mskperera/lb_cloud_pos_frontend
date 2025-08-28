import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
import { formatCurrency } from '../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderList } from '../../state/orderList/orderListSlice';
import { saveAs } from 'file-saver';
import { exPrintReceipt } from '../../functions/exPrint';
import { getTenantId } from '../../functions/authService';
import { getOrderReceipt } from '../../functions/register';

function PaymentConfirm({orderId,setIsPaymentConfirmShow,openBy}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const terminalId = JSON.parse(localStorage.getItem('terminalId'));
  let location = useLocation();
  let searchParams = new URLSearchParams(location.search);
 // let orderId = searchParams.get('orderId');

  const [printOption, setPrintOption] = useState('printdesk');
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [change, setChange] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [email, setEmail] = useState('');
  const printdeskId = localStorage.getItem('printdeskId');
  const { printerList } = useSelector((state) => state.printer);

  const [orderHeader, setOrderHeader] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    if(orderId){
    loadOrderReceipt();
    }
    console.log('ReceiptComponent', orderId);
  }, [orderId]);

  const loadOrderReceipt = async () => {
    const result = await getOrderReceipt(orderId);
    const oh = result.data.results[0][0];
    setCurrency(oh.symbol);
    setOrderHeader(result.data.results[0][0]);
    const od = result.data.results[1];
    console.log('oooo', od);
    const orderDetals = [];
    od.map(o => {
      const sku=o.sku ? `${o.sku}`:'';

      const netAmount = parseFloat(o.netAmount) || 0;
      const qty = parseFloat(o.qty) || 0;
      const measurementUnitName = o.measurementUnitName;
      const obj = {
        o,
        line: o.orderDetailId,
        unitPrice: o.unitPrice,
        sku:sku,
        productDescription: o.productDescription,
        productName: o.productName,
        qty: qty,
        netAmount: netAmount,
        measurementUnitName,
      };
      orderDetals.push(obj);
    });
    setOrderDetails(orderDetals);
    setPayments(result.data.results[2]);
  };

  useEffect(() => {
    if (printOption === 'printdesk' && printerList.length > 0) {
      const defaultPrinter = printerList.find((printer) => printer.IsDefault) || printerList[0];
      setSelectedPrinter(defaultPrinter.PrinterName);
    }
  }, [printOption, printerList]);

  const setCashPaymentChangeHandler = (value) => {
    setChange(value);
  };

  const onSubmit = async () => {
    if (printOption === 'browserPrint') {
      console.log('Browser Print selected');
      window.print();
    } else if (printOption === 'printdesk') {
      const payload = {
        receiptData: [[orderHeader], orderDetails, payments],
        printerName: selectedPrinter,
        receiptSize: "80mm",
        printDeskId: printdeskId,
      };
      console.log('Quick Print payload:', payload);
      exPrintReceipt(payload);
    }

    if (emailChecked && email) {
      console.log(`Send receipt to email: ${email}`);
    }
  };

  return (
    
      <div className="grid grid-cols-2  bg-white rounded-lg">
        <div className=" p-6 bg-gray-50">
          <ReceiptComponent
            orderHeader={orderHeader}
            orderDetails={orderDetails}
            payments={payments}
            currency={currency}
            setCashPaymentChage={setCashPaymentChangeHandler}
          />
        </div>
        <div className=" p-8 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Change</h2>
          <div className="text-center text-4xl font-semibold text-green-600 mb-6">
            {change && formatCurrency(change)}
          </div>
          <h3 className="text-center text-lg font-medium text-gray-700 mb-6">
            Would you like a receipt?
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="printOption" className="font-semibold text-gray-700">
                Select Print Option:
              </label>
              <select
                id="printOption"
                className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 bg-white"
                value={printOption}
                onChange={(e) => setPrintOption(e.target.value)}
              >
                <option value="browserPrint">Browser Print</option>
                <option value="printdesk">Printdesk</option>
              </select>
            </div>
            {printOption === 'printdesk' && (
              <div className="flex flex-col gap-2">
                <label htmlFor="printer" className="font-semibold text-gray-700">
                  Select Printer:
                </label>
                <select
                  id="printer"
                  className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 bg-white"
                  value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                >
                  {printerList.map((printer, index) => (
                    <option key={index} value={printer.PrinterName}>
                      {printer.PrinterName} {printer.IsDefault ? '(Default)' : ''} {printer.IsOnline ? '(Online)' : '(Offline)'}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
         
           {openBy!=='SalesHistory' &&   <button
                className="py-3 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
                onClick={() => {
                  dispatch(clearOrderList({}));
setIsPaymentConfirmShow(false);
                  //navigate(`/register/${terminalId}`);
                }}
              >
                New Order
              </button>}
       {openBy==='SalesHistory' &&   <button
                className="py-3 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
                onClick={() => {
setIsPaymentConfirmShow(false);
                  //navigate(`/register/${terminalId}`);
                }}
              >
              Close
              </button>}
              <button
                className="py-3 px-6 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors font-semibold"
                onClick={onSubmit}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

  );
}

export default PaymentConfirm;