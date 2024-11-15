import React from 'react';
import { createRoot } from 'react-dom/client';
import ReceiptComponent from './ReceiptComponent';


const printReceipt = (orderId) => {
    const printArea = document.createElement('div');
    document.body.appendChild(printArea);

    const setCashPaymentChageHander=(value)=>{
        //setChange(value);
        console.log('setCashPaymentChangeHandler',value)
      }

    // Create a root
    const root = createRoot(printArea);

    // Render the component using the new root
    root.render(<ReceiptComponent orderId={orderId} setCashPaymentChage={setCashPaymentChageHander}  />);

    // Delay printing to ensure the component is rendered
    setTimeout(() => {
        window.print();
        // Clean up: unmount the component and remove the print area
        root.unmount();
        document.body.removeChild(printArea);
    }, 500); // Adjust the delay as needed
};

export default printReceipt;
