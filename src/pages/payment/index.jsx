import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { calculateBalance } from '../../state/orderList/orderListSlice';
import SettlePayment from '../../components/register/payment/Payment';

function Payment() {
  // State to manage which tab and payment method is selected
  const [selectedTab, setSelectedTab] = useState('Single');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [payAmount, setPayAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState('');

  // Handle quick pay button click
  const handleQuickPay = (amount) => {
    setPayAmount(amount);
  };

   


  return (
    <>

    <SettlePayment />

    </>
  );
}

export default Payment;
