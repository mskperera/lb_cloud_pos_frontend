import { TabView, TabPanel } from "primereact/tabview";
import { useEffect, useRef, useState } from "react";
import InputSwitchCustom from "../../InputSwitchCustom";
import CashPayment from "./CashPayment";
import CardPayment from "./CardPayment";
import CreditPayment from "./CreditPayment";
import MultiPaymentList from "./MultiPaymentList";
import { Button } from "primereact/button";
import printReceipt from "../printReceipt/PrintReceipt";
import ReceiptComponent from "../printReceipt/ReceiptComponent";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";



const PaymentConfirmation = ({ orderNo }) => {

  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [printReceiptToggle, setPrintReceiptToggle] = useState(false);
  const [sendEmailToggle, setSendEmailToggle] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    printReceipt(orderNo);
  };

  const navigate = useNavigate();


  return (
<div className="grid">
  <div className="col">
    <ReceiptComponent orderId={orderNo} />
  </div>
  <div className="col flex align-items-center justify-content-center" style={{ height: '80vh' }}>
    <div className="flex flex-column align-items-center justify-content-around" style={{ width: '100%' }}>
      <div className="flex align-items-center justify-content-around mb-5" style={{ width: '50%' }}>
        <label htmlFor="printReceipt" style={{marginRight: '1em'}}>Print Receipt</label>
        <InputSwitch checked={printReceiptToggle} onChange={(e) => setPrintReceiptToggle(e.value)} />
      </div>
            {/* <div className="flex align-items-center justify-content-center my-2">
            <label htmlFor="sendEmail">Send Email</label>
            <InputSwitch checked={sendEmailToggle} onChange={(e) => setSendEmailToggle(e.value)} />
          </div>
          <div className="flex align-items-center justify-content-center my-2">
            <label htmlFor="email" className="mr-2">Email:</label>
            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
          </div> */}
      {/* Commented sections remain unchanged */}
      <Button
        label={isPaymentSubmitting ? "Submitting..." : "Execute"}
        aria-label="Tender"
        className="p-button-rounded p-button-lg p-button-primary"
        onClick={onSubmit}
        style={{ width: "50%", marginTop: "1em" }} // Adjust spacing as needed
      />
        <Button
        label={"New Order"}
        aria-label="Tender"
        className="p-button-rounded p-button-lg p-button-primary"
        onClick={()=>{
          navigate('/register')
        }}
        style={{ width: "50%", marginTop: "1em" }} // Adjust spacing as needed
      />
    </div>
  </div>
</div>


  );
};

export default PaymentConfirmation;
