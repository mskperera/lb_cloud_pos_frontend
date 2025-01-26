// DiscountPopup.jsx
import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import ApplyLineDiscount from './ApplyLineDiscount';

const DiscountPopup = ({ orderListId, visible, onHide }) => {
    const [discount, setDiscount] = useState('');
    const dispatch = useDispatch();

    const handleApplyDiscount = () => {
        console.log('test discount',discount);
         if (discount) {
             dispatch(ApplyLineDiscount({ orderListId: orderListId, discountPercentage: parseFloat(discount) }));
        //    // onHide(); // Hide the popup after applying the discount
         }
    };

    return (
        <div className="card flex justify-content-center">
                    {JSON.stringify(orderListId)}
            <Dialog header="Apply Discount" visible={visible} onHide={onHide}
                 breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                           <div className="field grid">
                           {/* <label htmlFor="firstname3" className="col-fixed" style={{width:'100px'}}>Firstname</label> */}
                           <div className="col">
                        <InputText type='number' value={discount} id="firstname3" onChange={(e) => setDiscount(e.target.value)} placeholder="Enter Discount Percentage" />
                        </div>
                        <button label="Apply" onClick={()=>handleApplyDiscount()} />
                    </div>

            </Dialog>
        </div>
    )

};

export default DiscountPopup;
