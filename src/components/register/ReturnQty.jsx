import React, { useEffect, useState } from "react";

import  { showToastBottomCenter } from "../popups/ToastPopup";

export default function ReturnQty({visible,onClose}) {

    return (
        <div className="card flex justify-content-center">
            <div header="Return Qty" visible={visible} onHide={onClose}
                 breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                           <div className="field grid">
                           {/* <label htmlFor="firstname3" className="col-fixed" style={{width:'100px'}}>Firstname</label> */}
                           <div className="col">
                        <input id="firstname3" type="text" placeholder="Enter return Qty"/>
                        </div>
                        <button label="Save Order" onClick={()=>{
                            showToastBottomCenter();
                        }}/>
                    </div>

            </div>
        </div>
    )
}