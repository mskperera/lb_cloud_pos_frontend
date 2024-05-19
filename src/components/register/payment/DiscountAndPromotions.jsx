
import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from 'react';
import InputSwitchCustom from '../../InputSwitchCustom';
import CashPayment from './CashPayment';
import CardPayment from './CardPayment';
import CreditPayment from './CreditPayment';
import MultiPaymentList from './MultiPaymentList';
import { Button } from 'primereact/button';
import CashPaymentMulti from './CashPaymentMulti';
import CardPaymentMulti from './CardPaymentMulti';
import CreditPaymentMulti from './CreditPaymentMulti';
import { Tooltip } from 'primereact/tooltip';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ApplyLineDiscount from '../ApplyLineDiscount';

const  Promotion= ({promotionName}) => {
  return (
    <div
      className="col-12 md:col-4 sm:col-4 lg:col-4 xl:col-2 p-1"
      style={{ cursor: "pointer" }}
    >
        <div className="shadow-1 hover:shadow-4 surface-card border-round">
        <div className="flex justify-content-center flex-wrap p-3">
       
          <span className="font-bold">{`${promotionName}`}</span>
        
      </div>
    </div>
    </div>
  );
};

 const DiscountAndPromotions=()=> {

  const [retunQty, setReturnQty] = useState(null);
  const [isShowRetunQty, setIsShowRetunQty] = useState(null);
  const [isLineDiscountShow, setIsLineDiscountShow] = useState(null);
  const [products, setProducts] = useState([
    {
      description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
      unitPrice: "$100.30",
      qty: 2,
      amount: "$200.60",
    },
    { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
    {
      description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
      unitPrice: "$100.30",
      qty: 2,
      amount: "$200.60",
    },
    { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
    {
      description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
      unitPrice: "$100.30",
      qty: 2,
      amount: "$200.60",
    },
    { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
    {
      description: "product1lllljjjjjlllllllllllllllllllllllljlkjjjjjk",
      unitPrice: "$100.30",
      qty: 2,
      amount: "$200.60",
    },
    { description: "product1", unitPrice: "$50.00", qty: 8, amount: "$400.00" },
  ]);

  const actions = (product) => {
    return (
      <>
        <Button
          icon="pi pi-percentage"
          label="Apply Discount"
          onClick={() => {
            setIsLineDiscountShow(true);
          }}
          rounded
          severity="primary"
          aria-label="User"
          text
        />
      </>
    );
  };

  const qty = (product) => {
    return (
      <>
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
          {/* <Button icon="pi pi-minus" rounded severity="primary" aria-label="User" /> */}
          <p>{product.qty}</p>
          {/* <Button icon="pi pi-plus" rounded severity="primary" aria-label="User" /> */}
        </div>
      </>
    );
  };

  const [selectedPaymentType, setSelectedPaymentType] = useState('Cash');

  const onPaymentTypeHandler=(value)=>{
    setSelectedPaymentType(value);
  }
    return (
      <div className="card m-2">
        <Tooltip target=".custom-target-icon" />

        <div className='flex flex-row align-items-center justify-content-start p-0 gap-5 pr-4'>
    <Button icon="pi pi-chevron-left custom-target-icon" 
    rounded text aria-label="Filter" size='large' tooltip="Back to Home" 
    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
        <div className="flex align-items-center gap-2">
          <span className=" pi pi-percentage text-xl font-semibold"></span>{" "}
          <span className="text-xl font-semibold">Discounts</span>
        </div>
    {/* <div className='flex flex-row gap-5 justify-content-end'>
        <InputSwitchCustom label="Print Receipt" />
        <InputSwitchCustom label="Send Email" />
    </div> */}
</div>


<div className='flex flex-row align-items-center justify-content-start p-0 gap-2 pr-4'>
<Promotion promotionName="Black friday" />
<Promotion promotionName="Clearance Sales" />
</div>

<div className="grid">
  <ApplyLineDiscount visible={isLineDiscountShow} onClose={()=>{
    setIsLineDiscountShow(false);
  }}  />
        <div className="col-12">
          <div className="flex flex-column justify-content-center">
            <div className="card border-round">
              <DataTable
                value={products}
                scrollable
                scrollHeight="340px" // Set the desired height for scrolling
                // rowExpansionTemplate={cardBodyTemplate}
                className="orderlist-datatable"
              >
                {/* Columns */}
           
                <Column field="description" header="Description"></Column>
                <Column field="qty" header="Qty" body={qty}></Column>
                <Column
                  field="amount"
                  alignHeader="left"
                  align="left"
                  header="Amount"
                ></Column>
                     <Column field="action" header="" body={actions}></Column>
              </DataTable>
            </div>
          </div>
        </div>
        <div className="col-12">
    
                <div className="grid p-3">
                  <div className="col-12 lg:col-6 p-2">
                    <div className="flex justify-content-between flex-wrap">
                      <div className="flex align-items-top">
                        <span className="text-md font-semibold">Total</span>
                      </div>
                      <div className="flex align-items-top">
                        <span className="text-md font-semibold">0.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 lg:col-6  p-2">
                    <div className="flex justify-content-between flex-wrap">
                      <div className="flex align-items-top">
                        <span className="text-md font-semibold">Discount</span>
                      </div>
                      <div className="flex align-items-top">
                        <span className="text-md font-semibold">0.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 lg:col-6  p-2">
                    <div className="flex justify-content-between flex-wrap">
                      <div className="flex align-items-top">
                        <span className="text-md font-semibold">Tax</span>
                      </div>
                      <div className="flex align-items-top">
                        <span className="text-md font-semibold">0.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 lg:col-6  p-2">
                    <div className="flex justify-content-between flex-wrap">
                      <div className="flex align-items-top">
                        <span className="text-xl font-semibold">
                          Grand Total
                        </span>
                      </div>
                      <div className="flex align-items-top">
                        <span className="text-xl font-semibold">0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
      </div>

      </div>
    );
}
        
export default DiscountAndPromotions;