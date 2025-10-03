import React, { forwardRef, useEffect } from 'react';
import moment from 'moment';
import './ReceiptComponent.css';
import { PAYMENT_METHODS } from '../../../utils/constants';

const ReceiptComponent = forwardRef(
  ({ orderHeader, orderDetails, payments, currency, setCashPaymentChage }, ref) => {
    useEffect(() => {
      const cashPayment = payments?.find((p) => p.methodId === PAYMENT_METHODS.CASH);
      setCashPaymentChage?.(cashPayment?.balanceAmount || 0);
    }, [payments, setCashPaymentChage]);

    const totals = {
      subtotal: parseFloat(orderHeader?.adjusted_subtotal) || 0,
      totalDiscount: parseFloat(orderHeader?.all_DiscountAmount_total) || 0,
      totalTax: parseFloat(orderHeader?.totalTaxAmount) || 0,
      grandTotal: parseFloat(orderHeader?.grandTotal) || 0,
    };

    return (
      <div className="receipt" ref={ref}>
        {/* Header */}
        <h1 className="company-name">{orderHeader?.companyName || 'Company Name'}</h1>
        {/* {JSON.stringify(orderHeader)} */}
        {/* <h2 className="store-name">{orderHeader?.storeName || 'Store Name'}</h2> */}
        <p className="address">{orderHeader?.address || 'No Address'}</p>
     <p className="tel">
  Tel: {orderHeader?.tel1}{orderHeader?.tel2 ? ` / ${orderHeader.tel2}` : ""}
</p>
        <p className="email">{orderHeader?.emailAddress || 'N/A'}</p>

        {/* Order Metadata */}
        <div className="details">
      <div>
     <p>Invoice #: {orderHeader?.orderNo || 'N/A'}</p>
          <p>Terminal: {orderHeader?.terminalName || 'N/A'}</p>
            {orderHeader?.customerName ?   <p>
            Customer:{' '}${orderHeader.customerName}
          </p>:null}
      </div>

           <div style={{textAlign:'right'}}>

              <p>
            Date:{' '}
            {orderHeader?.createdDate_UTC
              ? moment.utc(orderHeader.createdDate_UTC).local().format('YYYY-MMM-DD hh:mm A')
              : 'N/A'}
          </p>

                 <p>Cashier: {orderHeader?.displayUserName || 'N/A'}</p>
  
      </div>

        </div>
        <hr className="thin-border" />

        {/* Voided Indicator */}
        {orderHeader?.isVoided ? (
          <div className="voided-indicator">
            ***This invoice has been voided and is not valid anymore.***
          </div>
        ):null}

        {/* Items Header */}
        <div className="item-header">
          <div className="item-header-row">
            {/* <span className="item-number">#</span> */}
            <span className="item-description">Description</span>
          </div>
          <div className="item-header-row2">
            <span className="item-qty">Qty</span>
            <span className="item-price">Price({currency})</span>
            <span className="item-total">Total({currency})</span>
          </div>
        </div>
        <hr className="thin-border" />

        {/* Items */}
        <div className="items">
          {orderDetails?.length > 0 ? (
            orderDetails.map((item, index) => (
              <div key={index} className="item-row">
                <div className="receipt-item">
                  <div className="item-header-full">
                    {/* <span className="item-number">{index + 1}.</span> */}
                    <span className="item-description">
                     ({item.sku}) {item.productDescription}
                    </span>
                  </div>
                  
                    <div className="item-header-row2">
            <span className="item-qty">   {item.qty} {item.measurementUnitName}</span>
            <span className="item-price">       {(item.unitPrice || 0).toFixed(2)}</span>
            <span className="item-total">  {(item.netAmount || 0).toFixed(2)}</span>
          </div>
 
                </div>
              </div>
            ))
          ) : (
            <div className="item-row">No items available</div>
          )}
        </div>
        <hr className="thin-border" />

        {/* Totals */}
        <div className="totals">
          <div className="total-row">
            <div>Total :</div>
            <div>{totals.subtotal.toFixed(2)}</div>
          </div>
          <div className="total-row">
            <div>Discounts :</div>
            <div>{totals.totalDiscount.toFixed(2)}</div>
          </div>
          <div className="total-row">
            <div>Tax :</div>
            <div>{totals.totalTax.toFixed(2)}</div>
          </div>
          <hr className="thick-border" />
          <div className="total-row grand-total">
            <div>Grand Total ({currency}) :</div>
            <div>{totals.grandTotal.toFixed(2)}</div>
          </div>
        </div>

        {/* Payments */}
        <hr className="thin-border" />
        <div className="payments">
          {payments?.length > 0 ? (
            payments.map((p, index) => (
              <div key={index} className="payment-row">
                {p.methodId === PAYMENT_METHODS.CARD && (
                  <div className="card-details">
                    {p.cardHolderName || 'N/A'} | **** {p.cardLastFourDigits || 'N/A'} |{' '}
                    {p.CardTypeName || 'N/A'}
                  </div>
                )}
                {p.methodId === PAYMENT_METHODS.CASH && (
                  <div className=''>
                  <div className="cash-details">
                      
                 Cash:{(parseFloat(p.receivedAmount) || 0).toFixed(2)}

                  </div>

                   <div className="cash-details balance">
                        Balance: {(parseFloat(p.balanceAmount) || 0).toFixed(2)}
                    </div>
</div>
                )}
              </div>
            ))
          ) : (
            <div className="payment-row">No payments available</div>
          )}
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <div className="thank-you">*Thank you for choosing our services*</div>
          {orderHeader?.receiptAdDescription && (
            <div className="ad-text">{orderHeader.receiptAdDescription}</div>
          )}
          <p className="print-date">
            Print Date: {moment().format('YYYY-MMM-DD hh:mm:ss A')}
          </p>
          <p className="system-info">Powerd by Legendbyte - legendbyte.com</p>
        </div>
      </div>
    );
  }
);

export default ReceiptComponent;
