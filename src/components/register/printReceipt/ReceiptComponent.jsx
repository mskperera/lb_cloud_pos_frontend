import React, { useEffect, useState } from 'react';
import './ReceiptComponent.css'; // Ensure you have the CSS file
import { getOrderReceipt } from '../../../functions/register';
import moment from 'moment';
import { PAYMENT_METHODS } from '../../../utils/constants';
import './module.printReceipt.css';

const ReceiptComponent = ({ orderId,setCashPaymentChage }) => {
  // The order details could be passed in as a prop, for example:
  // const orderDetails = [
  //   { line: '0010', description: '12 RULER CLR', qty: 2, price: 60 },
  //   { line: '0030', description: '120MM *25M CLR', qty: 1, price: 25 },
  //   // ... other items
  // ];

  const [orderHeader,setOrderHeader]=useState(null);
  const [orderDetails,setOrderDetails]=useState([]);
  const [payments,setPayments]=useState([]);
  const [currency,setCurrency]=useState(null);

useEffect(()=>{
  loadOrderReceipt();
  console.log('ReceiptComponent',orderId)
},[orderId])


useEffect(()=>{
const cashPayment=payments.find(p=>p.methodId === PAYMENT_METHODS.CASH);
  setCashPaymentChage(cashPayment?.balanceAmount)
},[payments])



  const loadOrderReceipt=async()=>{
   const result=await getOrderReceipt(orderId);
   const oh=result.data.results[0][0];
   setCurrency(oh.symbol);
   setOrderHeader(result.data.results[0][0]);

   const od=result.data.results[1];
   console.log('oooo',od);
   //setOrderDetails2(orderDetails);
   const orderDetals=[];
   od.map(o=>{
    const descr=`${o.productNo} | ${o.productName}`
    const netAmount = parseFloat(o.netAmount) || 0;
    const qty = parseFloat(o.qty) || 0;
    const  obj ={ line: o.orderDetailId, description:descr, qty:qty, netAmount:netAmount }
    orderDetals.push(obj);
   })
   setOrderDetails(orderDetals);
   setPayments(result.data.results[2]);
  }

  // const orderDetails=[
  //   {  description: '004341 | Colour Pencil and Apark', qty: 2, netAmount: 10 },
  //   {  description: '3459143 | Hot matt 2', qty: 1, netAmount: 15 },
  //   // ... other items
  // ];

  const totals = {
    subtotal: parseFloat(orderHeader?.adjusted_subtotal) || 0 ,
    totalDiscount:parseFloat(orderHeader?.all_DiscountAmount_total) || 0 ,
    totalTax: parseFloat(orderHeader?.totalTaxAmount) || 0 ,
    grandTotal:parseFloat(orderHeader?.grandTotal) || 0 ,
  };

  return (
    <div className="receipt">
 

      <h2 className="text-center">{orderHeader?.storeName}</h2>
      <p className="text-center address">{orderHeader?.address}</p>
      <p className="text-center email">{orderHeader?.emailAddress}</p>
      <div className="details">
        <p>
          {moment
            .utc(orderHeader?.createdDate_UTC)
            .local()
            .format("YYYY-MM-DD hh:mm:ss A")}
        </p>
        <p>{`Receipt #: ${orderHeader?.orderNo}`}</p>
        <p>{`User : ${orderHeader?.displayUserName}`}</p>
       {orderHeader?.customerCode &&  <p>{`Customer : ${orderHeader?.customerCode} | ${orderHeader?.customerName}`}</p>}
 
      </div>
      {orderHeader?.isVoided ? 
        <div className="voided-indicator">***This invoice has been voided and is not valid anymore.***</div>:""
      }
      <div className="item-header">
        <div className="line-header">Line</div>
        <div className="description-header">Description</div>
        <div className="quantity-header">Qty</div>
        <div className="price-header">Price</div>
      </div>
      <div className="items">
        {orderDetails.map((item, index) => (
          <div key={index} className="item-row">
            {/* <div className="line">{item.line}</div> */}
            <div className="description">{item.description}</div>
            <div className="quantity">{item.qty}</div>
            <div className="price">{item.netAmount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="totals">
        
        <div className="total-row">
          <p>Subtotal</p>
          <p>
            {" "}
            <span className="mr-1">{currency}</span>
            {totals.subtotal.toFixed(2)}
          </p>
        </div>
        <div className="total-row">
          <p>Total Discount</p>
          <p>
            {" "}
            <span className="mr-1">{currency}</span>
            {totals.totalDiscount.toFixed(2)}
          </p>
        </div>
        <div className="total-row">
          <p>Total Tax</p>
          <p>
            {" "}
            <span className="mr-1">{currency}</span>
            {totals.totalTax.toFixed(2)}
          </p>
        </div>
        <div className="total-row">
          <p>Grand Total</p>
          <p>
            {" "}
            <span className="mr-1">{currency}</span>
            {totals.grandTotal.toFixed(2)}
          </p>
        </div>
       
        

        {payments.map((p, index) => {
          return (
            <div key={index}>
              {p.methodId === PAYMENT_METHODS.CASH && (
                <>
                  <div className="total-row">
                    <p>Cash Received </p>
                    <p>
                      {" "}
                      <span className="mr-1">{currency}</span>
                      {parseFloat(p.receivedAmount).toFixed(2)}
                    </p>
                  </div>
                  <div className="total-row">
                    <p>Balance </p>
                    <p>
                      {" "}
                      <span className="mr-1">{currency}</span>
                      {parseFloat(p.balanceAmount).toFixed(2)}
                    </p>
                  </div>
                </>
              )}

              {p.methodId === PAYMENT_METHODS.CARD && (
               <>
               <div className="total-row">
                  <p>{p.CardTypeName} (xxxx-{p.cardLastFourDigits})</p>
                  <p>
                    {" "}
                    <span className="mr-1">{currency}</span>
                    {parseFloat(p.amountPaid).toFixed(2)}
               
                  </p>
                </div>
                <div className="total-row">
                <p>Card Holder </p>
                <p>
              {  p.cardHolderName}
                </p>
              </div>
              </>
              )}
            </div>
          );
        })}
      </div>
      <div className="footer text-center">
        <p>Thank You Come Again</p>
      </div>
    </div>
  );
};

export default ReceiptComponent;
