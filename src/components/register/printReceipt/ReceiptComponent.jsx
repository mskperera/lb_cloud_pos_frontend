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
        <h1 className="company-name">
          {orderHeader?.companyName || "Company Name"}
        </h1>
        {/* {JSON.stringify(orderHeader)} */}
        {/* <h2 className="store-name">{orderHeader?.storeName || 'Store Name'}</h2> */}
        <p className="address">{orderHeader?.address || "No Address"}</p>
        <p className="tel">
          Tel: {orderHeader?.tel1}
          {orderHeader?.tel2 ? ` / ${orderHeader.tel2}` : ""}
        </p>
        <p className="email">{orderHeader?.emailAddress || "N/A"}</p>

        {/* Order Metadata */}
  <div className="receipt-details">

  <div className="detail-row">
    <span>Invoice No.</span>
    <span>{orderHeader?.orderNo || "N/A"}</span>
  </div>

  <div className="detail-row">
    <span>Date</span>
    <span>
      {orderHeader?.createdDate_UTC
        ? moment
            .utc(orderHeader.createdDate_UTC)
            .local()
            .format("YYYY-MMM-DD hh:mm A")
        : "N/A"}
    </span>
  </div>

  <div className="detail-row">
    <span>Session</span>
    <span>{orderHeader?.sessionName+' | '+orderHeader?.sessionId+''}</span>
  </div>

  <div className="detail-row">
    <span>Terminal</span>
    <span>{orderHeader?.terminalName || "N/A"}</span>
  </div>

  <div className="detail-row">
    <span>Cashier</span>
    <span>{orderHeader?.displayUserName || "N/A"}</span>
  </div>

  {orderHeader?.customerName && (
    <div className="detail-row">
      <span>Customer</span>
      <span>{orderHeader.customerName}</span>
    </div>
  )}

</div>




      {/* <div className="details">
          <div>
            <p>Invoice #: {orderHeader?.orderNo || "N/A"}</p>
            <p>Terminal: {orderHeader?.terminalName || "N/A"}</p>
            {orderHeader?.customerName ? (
              <p>Customer: ${orderHeader.customerName}</p>
            ) : null}
          </div>

          <div style={{ textAlign: "right" }}>
            <p>
              Date:{" "}
              {orderHeader?.createdDate_UTC
                ? moment
                    .utc(orderHeader.createdDate_UTC)
                    .local()
                    .format("YYYY-MMM-DD hh:mm A")
                : "N/A"}
            </p>

            <p>Cashier: {orderHeader?.displayUserName || "N/A"}</p>
          </div>
        </div> */}



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
            {/* <span className="item-number">#</span> */}
            <span className="item-description">Description</span>
          </div>
          <div className="item-header-row2">
            <span className="item-qty">Qty</span>
            <span className="item-price">Price</span>
            <span className="item-total">Total</span>
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
                    <span className="item-qty">
                      {" "}
                      {item.qty} {item.measurementUnitName}
                    </span>
                    <span className="item-price">
                      {" "}
                      {(item.unitPrice || 0).toFixed(2)}
                    </span>
                    <span className="item-total">
                      {" "}
                      {(item.netAmount || 0).toFixed(2)}
                    </span>
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

{(() => {
  const sortedPayments = [...(payments || [])].sort((a, b) => {
    // Always place Cash at the bottom
    if (a.methodId === PAYMENT_METHODS.CASH && b.methodId !== PAYMENT_METHODS.CASH)
      return 1;

    if (b.methodId === PAYMENT_METHODS.CASH && a.methodId !== PAYMENT_METHODS.CASH)
      return -1;

    return 0;
  });

  return (
    <div className="payments">
      <div className="payments-title">PAYMENT DETAILS</div>

      {sortedPayments.map((p, index) => {


        console.log('sortedpay;',p)

        return (
          <div key={index} className="payment-block">
            {/* Payment Method */}
            <div className="payment-header">
              <span className="payment-method">
                {p.methodName ||
                  (p.methodId === PAYMENT_METHODS.CASH
                    ? "Cash"
                    : p.methodId === PAYMENT_METHODS.CARD
                      ? "Card"
                      : "Payment")}
              </span>

              <span className="payment-amount">{parseFloat(p.amountPaid).toFixed(2)}</span>
            </div>

            {/* Cash */}
            {p.methodId === PAYMENT_METHODS.CASH ? (
              <>
                <div className="payment-detail">
                  <span>Received</span>
                  <span>{parseFloat( p.receivedAmount).toFixed(2)}</span>
                </div>

                <div className="payment-detail">
                  <span>Change</span>
                  <span>{(parseFloat(p.balanceAmount) || 0).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                {p.CardTypeName && (
                  <div className="payment-info">
                    Card Type : {p.CardTypeName}
                  </div>
                )}

                {p.cardLastFourDigits && (
                  <div className="payment-info">
                    Card No : **** {p.cardLastFourDigits}
                  </div>
                )}

                {p.cardHolderName && (
                  <div className="payment-info">
                    Card Holder : {p.cardHolderName}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
})()}

        {/* Footer */}
        <div className="receipt-footer">
          <div className="thank-you">*Thank you for choosing our services*</div>
          {orderHeader?.receiptAdDescription && (
            <div className="ad-text">{orderHeader.receiptAdDescription}</div>
          )}
          <p className="print-date">
            Print Date: {moment().format("YYYY-MMM-DD hh:mm:ss A")}
          </p>
          <p className="system-info">System by legendbyte.com - 0771147484</p>
        </div>
      </div>
    );
  }
);

export default ReceiptComponent;
