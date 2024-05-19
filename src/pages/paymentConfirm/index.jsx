import React from 'react';
import PaymentConfirmation from '../../components/register/payment/PaymentConfirmation';
import { useLocation } from 'react-router-dom';

function PaymentConfirm() {
  let location = useLocation();
  let searchParams = new URLSearchParams(location.search);
  let orderNo = searchParams.get('orderNo');
 
  return (
    <div>
      <PaymentConfirmation orderNo={orderNo} />
    </div>
  );
}

export default PaymentConfirm;