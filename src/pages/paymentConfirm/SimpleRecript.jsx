// lb_cloudpos_new/src/components/SimpleReceipt.js
import React, { forwardRef } from 'react';
import './SimpleReceipt.css';

const SimpleReceipt = forwardRef((props, ref) => {
  return (
    <div className="receipt" ref={ref}>
      <h1 className="company-name">Legendbit</h1>
      <h2 className="store-name">Main Store</h2>
      <p className="address">123 Main St, City, Country</p>
      <p className="tel">Tel: 555-1234</p>
      <p className="email">contact@legendbit.com</p>
      <div className="details">
        <p>Date: 2025-Sep-26 06:29 PM</p>
        <p>Invoice #: 1001</p>
        <p>Terminal: POS1</p>
        <p>Cashier: John Doe</p>
        <p>Customer: Jane Smith</p>
      </div>
      <hr className="thin-border" />
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
      <div className="items">
        <div className="item-row">
          <div className="receipt-item">
            <div className="item-header-full">
              <span className="item-number">1.</span>
              <span className="item-description">Coffee</span>
            </div>
            <div className="item-details">
              <span className="item-qty">2 unit</span>
              <span className="item-price">$5.00</span>
              <span className="item-total">$10.00</span>
            </div>
          </div>
        </div>
        <div className="item-row">
          <div className="receipt-item">
            <div className="item-header-full">
              <span className="item-number">2.</span>
              <span className="item-description">Pastry</span>
            </div>
            <div className="item-details">
              <span className="item-qty">1 unit</span>
              <span className="item-price">$3.00</span>
              <span className="item-total">$3.00</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="thin-border" />
      <div className="totals">
        <div className="total-row">
          <span>Total:</span>
          <span>$13.00</span>
        </div>
        <div className="total-row">
          <span>Discounts:</span>
          <span>$0.00</span>
        </div>
        <div className="total-row">
          <span>Tax:</span>
          <span>$0.00</span>
        </div>
        <hr className="thick-border" />
        <div className="total-row grand-total">
          <span>Grand Total:</span>
          <span>$13.00</span>
        </div>
      </div>
      <hr className="thin-border" />
      <div className="payments">
        <div className="payment-row">
          <span>Cash</span>
          <span>$13.00</span>
          <div className="cash-details">
            <div>
              <span>Cash Received: $20.00</span>
            </div>
            <div>
              <span>Balance: $7.00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="receipt-footer">
        <p className="thank-you">***Thank you for shopping with us!***</p>
        <p className="print-date">Print Date: 2025-Sep-26 06:29 PM</p>
        <p className="system-info">System by Legendbyte - clpos.legendbyte.com</p>
      </div>
    </div>
  );
});

export default SimpleReceipt;