import React, { useEffect } from "react";
import "./ReceiptComponent.css";
import moment from "moment";
import { PAYMENT_METHODS } from "../../../utils/constants";

const ReceiptComponent = ({
  orderHeader,
  orderDetails,
  payments,
  currency,
  setCashPaymentChage,
}) => {
  useEffect(() => {
    const cashPayment = payments.find(
      (p) => p.methodId === PAYMENT_METHODS.CASH
    );
    setCashPaymentChage(cashPayment?.balanceAmount);
  }, [payments, setCashPaymentChage]);

  const totals = {
    subtotal: parseFloat(orderHeader?.adjusted_subtotal) || 0,
    totalDiscount: parseFloat(orderHeader?.all_DiscountAmount_total) || 0,
    totalTax: parseFloat(orderHeader?.totalTaxAmount) || 0,
    grandTotal: parseFloat(orderHeader?.grandTotal) || 0,
  };

  return (
    <div className="receipt">
      {/* Header */}
      <h1 className="company-name">
        {orderHeader?.companyName || "Company Name"}
      </h1>
      <h2 className="store-name">{orderHeader?.storeName}</h2>
      <p className="address">{orderHeader?.address}</p>
      <p className="tel">Tel: {orderHeader?.tel1}</p>
      <p className="email">{orderHeader?.emailAddress}</p>
      {/* <hr className="thick-border" /> */}
      {/* <h3 className="invoice-label">Invoice</h3> */}
      {/* <hr className="thick-border" /> */}

      {/* Order Metadata */}
      <div className="details">
        <p>
          Date:{" "}
          {moment
            .utc(orderHeader?.createdDate_UTC)
            .local()
            .format("YYYY-MMM-DD hh:mm A")}
        </p>
        <p>Invoice #: {orderHeader?.orderNo}</p>
        <p>Terminal: {orderHeader?.terminalName}</p>
        <p>Cashier: {orderHeader?.displayUserName}</p>
        <p>
          Customer:{" "}
          {orderHeader?.customerCode
            ? `${orderHeader.customerCode} | ${orderHeader.customerName}`
            : "walk-in customer"}
        </p>
      </div>
      <hr className="thin-border" />

      {/* Voided Indicator */}
      {orderHeader?.isVoided ? (
        <div className="voided-indicator">
          ***This invoice has been voided and is not valid anymore.***
        </div>
      ) : null}

      {/* Items Header */}
      <div className="item-header">
   
        <div className="item-header-row">
                  <span>#</span> 
          <span>Description</span>
        </div>
        <div className="item-header-row2">
          <span>Qty</span>
          <span>Price</span>
          <span>Total</span>
        </div>
      </div>

      <hr className="thin-border" />
      {/* Items */}
      <div className="items">
        <div className="items">
          {orderDetails?.map((item, index) => (
            <div key={index} className="item-row">
              <div className="receipt-item">
                 <div className="item-header-full">
                  <span className="item-number">{index + 1}.</span>
                {item.sku ? <span className="sku">
                    {item.sku}
                  </span>:  <span className="item-description">
                    {item.productDescription}
                  </span>
                  }
                </div>
               {item.sku && <div className="item-header-full">
                  <span className="item-description">
                    {item.productDescription}
                  </span>
                </div>}
                <div className="item-details">
                  <span className="item-qty">
                    {item.qty} {item.measurementUnitName}
                  </span>
                  <span className="item-price">{item.unitPrice}</span>
                  <span className="item-total">
                    {item.netAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr className="thin-border" />

      {/* Totals */}
      <div className="totals">
        <div className="total-row">
          <span>Total:</span>
          <span>
            {currency} {totals.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="total-row">
          <span>Discounts:</span>
          <span>
            {currency} {totals.totalDiscount.toFixed(2)}
          </span>
        </div>
        <div className="total-row">
          <span>Tax:</span>
          <span>
            {currency} {totals.totalTax.toFixed(2)}
          </span>
        </div>
        <hr className="thick-border" />
        <div className="total-row grand-total">
          <span>Grand Total:</span>
          <span>
            {currency} {totals.grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payments */}
      <hr className="thin-border" />
      <div className="payments">
        {payments.map((p, index) => (
          <div key={index} className="payment-row">
            <span>
              {p.methodId === PAYMENT_METHODS.CASH ? "Cash" : p.CardTypeName}
            </span>
            <span>
              {currency}{" "}
              {parseFloat(p.amountPaid || p.receivedAmount).toFixed(2)}
            </span>
            {p.methodId === PAYMENT_METHODS.CARD && (
              <div className="card-details">
                {p.cardHolderName} | **** {p.cardLastFourDigits} |{" "}
                {p.CardTypeName}
              </div>
            )}
         
            {p.methodId === PAYMENT_METHODS.CASH && (
              <div className="cash-details">
                <div>
                <span>
                  Cash Received: {currency} {parseFloat(p.receivedAmount)}
                </span>
                </div>
                <div>
                <span>
                  Change: {currency} {parseFloat(p.balanceAmount)}
                </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="receipt-footer">
        <div>
          <p className="thank-you">***Thank you for shopping with us!***</p>
        </div>
        <div>
          {orderHeader?.receiptAdDescription && (
            <div className="ad-text">{orderHeader.receiptAdDescription}</div>
          )}
        </div>

        <div>
          <p className="print-date">
            Print Date: {moment().format("YYYY-MMM-DD hh:mm:ss A")}
          </p>
        </div>
        <div>
          <p className="system-info">
          System by Legendbyte - clpos.legendbyte.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptComponent;
