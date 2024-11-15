import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import printReceipt from '../../components/register/printReceipt/PrintReceipt';
import ReceiptComponent from '../../components/register/printReceipt/ReceiptComponent';
import { formatCurrency } from '../../utils/format';
import { useDispatch } from 'react-redux';
import { clearOrderList } from '../../state/orderList/orderListSlice';
import { saveAs } from 'file-saver';
import { exPrintReceipt } from '../../functions/exPrint';
import { getTenantId } from '../../functions/authService';

function PaymentConfirm() {
    
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const terminalId = JSON.parse(localStorage.getItem('terminalId'));

  let location = useLocation();
  let searchParams = new URLSearchParams(location.search);
  let orderId = searchParams.get('orderId');

  const [printOption, setPrintOption] = useState('quickPrint');
  const [change, setChange] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [printChecked, setPrintChecked] = useState(true);
  const [email, setEmail] = useState('');

  const setCashPaymentChangeHandler = (value) => {
    setChange(value);
  };


  const saveJsonFile = () => {
    const data = {
      name: "John Doe",
      age: 30,
      city: "New York"
    };
  
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'data.json');
  };

  
  const onSubmit = async () => {


  //  saveJsonFile();



    if (printChecked) {
      if (printOption === 'browserPrint') {
        console.log('Browser Print selected');
        window.print();
      } else if (printOption === 'quickPrint') {
       // printReceipt(orderNo);
       const terminalId = JSON.parse(localStorage.getItem('terminalId'));
       const payload={
        data:{recriptsize:"A5",orderId:orderId,message:"hi"},
        clientId:getTenantId()+"-"+terminalId
    };    
    console.log('printChecked:', payload);
    
       exPrintReceipt(payload)
    
      }
    }

    if (emailChecked && email) {
      // Implement email logic here
      console.log(`Send receipt to email: ${email}`);
    }
  };

  return (
    <div>
      {/* <PaymentConfirmation orderNo={orderNo} /> */}
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
            
           
           
         
            {/* <div className="flex items-center justify-between mb-4">
             <div className=''>
              <input
                type="checkbox"
                id="emailCheckbox"
                checked={emailChecked}
                onChange={(e) => setEmailChecked(e.target.checked)}
              />
              <label htmlFor="emailCheckbox" className="ml-2 cursor-pointer">
                Email
              </label>
              </div>
             
              <input
                type="email"
                placeholder="EMAIL"
                className="input input-bordered w-full max-w-xs ml-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!emailChecked}
              />
       
            </div> */}

            <div className="flex items-center justify-between mb-4">
            <div className=''>
              <input
                type="checkbox"
                id="printCheckbox"
                checked={printChecked}
                onChange={(e) => setPrintChecked(e.target.checked)}
              />
              <label htmlFor="printCheckbox" className="ml-2 cursor-pointer">
                Print Receipt
              </label>
            </div>
              <div className="flex justify-center items-center ml-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Browser Print</span>
                  <input
                    type="radio"
                    name="printOption"
                    value="browserPrint"
                    className="radio ml-2"
                    checked={printOption === 'browserPrint'}
                    onChange={() => setPrintOption('browserPrint')}
                    disabled={!printChecked}
                  />
                </label>
                <label className="label cursor-pointer ml-4">
                  <span className="label-text">Quick Print</span>
                  <input
                    type="radio"
                    name="printOption"
                    value="quickPrint"
                    className="radio ml-2"
                    checked={printOption === 'quickPrint'}
                    onChange={() => setPrintOption('quickPrint')}
                    disabled={!printChecked}
                  />
                </label>
              </div>
              {/* <button
                className="btn ml-4"
                onClick={onSubmit}
                disabled={!printChecked}
              >
                Print
              </button> */}
            </div>
           
        
            <div className="flex justify-center gap-5 mt-10">

            <button className="btn btn-lg"      onClick={()=>{
                
                dispatch(clearOrderList({ }));
                navigate(`/register/${terminalId}`)
                
              }}>New Order</button>
      
            
              <button className="btn btn-lg btn-primary"      onClick={onSubmit}>Print / Send</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirm;
