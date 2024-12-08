import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
import { formatCurrency } from '../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrderList } from '../../state/orderList/orderListSlice';
import { saveAs } from 'file-saver';
import { exPrintReceipt } from '../../functions/exPrint';
import { getTenantId } from '../../functions/authService';

function PaymentConfirm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const terminalId = JSON.parse(localStorage.getItem('terminalId'));

  let location = useLocation();
  let searchParams = new URLSearchParams(location.search);
  let orderId = searchParams.get('orderId');

  const [printOption, setPrintOption] = useState('quickPrint');
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [change, setChange] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [email, setEmail] = useState('');

  const printdeskId = localStorage.getItem('printdeskId');
  
  const { printerList } = useSelector((state) => state.printer);

  // Set default printer when printerList or printOption changes
  useEffect(() => {
    if (printOption === 'quickPrint' && printerList.length > 0) {
      const defaultPrinter = printerList.find((printer) => printer.IsDefault) || printerList[0];
      setSelectedPrinter(defaultPrinter.PrinterName);
    }
  }, [printOption, printerList]);

  const setCashPaymentChangeHandler = (value) => {
    setChange(value);
  };

  const onSubmit = async () => {

    const receiptData = [
      [
        {
          orderNo: "00234",
          isVoided: 0,
          storeId: 1,
          displayUserName: "UserA SP",
          symbol: "Rs",
          storeName: "Sri Jayawardenepura Kotte",
          storeCode: "001",
          address: "Br1 address",
          emailAddress: "swpmskpererea@gmail.com",
          tel1: "0011212",
          grossAmount_total: "1300.00",
          lineDiscountAmount_total: "0.00",
          overallDiscountAmount: "0.00",
          all_DiscountAmount_total: "0.00",
          subTotal: "1300.00",
          adjusted_subtotal: "1300.00",
          grandTotal: "140444.00",
          totalTaxAmount: "104.00",
          terminalName: "Testing Terminal 2",
          sessionName: "2024 Jul 16",
          companyName: "DAYARA STUDIO",
          createdDate_UTC: "2024-12-08T00:01:32.000Z",
          utcOffset: 330,
          customerName: null,
          changeAmount: "1100",
          noOfItems: "11.00",
          receiptAdDescription: ""
        }
      ],
      [
        {
          orderDetailId: 844,
          orderID: 234,
          qty: "2.0000",
          createdDate_ServerTime: "2024-11-30T17:50:09.000Z",
          createdDate_UTC: "2024-11-30T12:20:09.000Z",
          productId: 246,
          productName: "Whole Milk",
          productNo: "00246",
          unitPrice: "450.0000",
          isReturned: 0,
          snshot_allProductId: 11,
          grossAmount: "900.00",
          netAmount: "900.00",
          measurementUnitName: "Liter",
          discountValue: null,
          discountTypeName: null,
          discountAmount: null
        },
        {
          orderDetailId: 845,
          orderID: 234,
          qty: "1.0000",
          createdDate_ServerTime: "2024-11-30T17:50:09.000Z",
          createdDate_UTC: "2024-11-30T12:20:09.000Z",
          productId: 248,
          productName: "Organic Avocados",
          productNo: "00248",
          unitPrice: "400.0000",
          isReturned: 0,
          snshot_allProductId: 12,
          grossAmount: "400.00",
          netAmount: "400.00",
          measurementUnitName: "Kilogram",
          discountValue: null,
          discountTypeName: null,
          discountAmount: null
        }
      ],
      [
        {
          paymentId: 336,
          orderId: 236,
          methodId: 2,
          amountPaid: "500.0000",
          paymentDate_UTC: "2024-12-08T00:01:32.000Z",
          cardHolderName: "ssss",
          cardLastFourDigits: "1212",
          cardExpirationMonth: 12,
          cardExpirationYear: 54,
          balanceAmount: "0.0000",
          receivedAmount: "0.0000",
          methodName: "Card",
          cardTypeName: "Visa"
        },
        {
          paymentId: 337,
          orderId: 236,
          methodId: 1,
          amountPaid: "472.0000",
          paymentDate_UTC: "2024-12-08T00:01:32.000Z",
          cardHolderName: null,
          cardLastFourDigits: null,
          cardExpirationMonth: null,
          cardExpirationYear: null,
          balanceAmount: "0.0000",
          receivedAmount: "972.0000",
          methodName: "Cash",
          cardTypeName: null
        }
      ]
    ];

    if (printOption === 'browserPrint') {
      console.log('Browser Print selected');
      window.print();
    } else if (printOption === 'quickPrint') {
      const terminalId = JSON.parse(localStorage.getItem('terminalId'));
      const payload = {
        receiptInfo: { recriptsize: '80mm' },
        receiptData:receiptData,
        printer: selectedPrinter,
        printDeskId:printdeskId
      };
      console.log('Quick Print payload:', payload);
      exPrintReceipt(payload);
    }

    if (emailChecked && email) {
      console.log(`Send receipt to email: ${email}`);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center p-4">
        <div className="flex bg-white w-[70%] shadow-md rounded-lg">
          <div className="flex-[1] p-4">
            <ReceiptComponent orderId={orderId} setCashPaymentChage={setCashPaymentChangeHandler} />
          </div>

          <div className="flex-[2] flex flex-col p-20 bg-gray-50 border-l">
            <div className="text-center font-bold text-xl mb-4">Change</div>
            <div className="text-center text-4xl font-bold text-green-600 mb-4">
              {change && formatCurrency(change)}
            </div>
            <div className="text-center mb-4 mt-10 text-lg">Would you like a receipt?</div>

            <div className="mb-4">
              <label htmlFor="printOption" className="block mb-2 font-bold">
                Select Print Option:
              </label>
              <select
                id="printOption"
                className="select select-bordered w-full max-w-xs"
                value={printOption}
                onChange={(e) => setPrintOption(e.target.value)}
              >
                <option value="browserPrint">Browser Print</option>
                <option value="quickPrint">Quick Print</option>
              </select>
            </div>
{JSON.stringify(selectedPrinter)}
            {printOption === 'quickPrint' && (
              <div className="mb-4">
                <label htmlFor="printer" className="block mb-2 font-bold">
                  Select Printer:
                </label>
                <select
                  id="printer"
                  className="select select-bordered w-full max-w-xs"
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

            <div className="flex justify-center gap-5 mt-10">
              <button
                className="btn btn-lg"
                onClick={() => {
                  dispatch(clearOrderList({}));
                  navigate(`/register/${terminalId}`);
                }}
              >
                New Order
              </button>

              <button className="btn btn-lg btn-primary" onClick={onSubmit}>
                Print / Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirm;
