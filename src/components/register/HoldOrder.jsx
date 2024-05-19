import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import  { showToastBottomCenter } from "../popups/ToastPopup";

export default function HoldOrder({visible,onClose}) {

    return (
        <div className="card flex justify-content-center">
            <Dialog header="Hold Order" visible={visible} onHide={onClose}
                 breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                           <div className="field grid">
                           {/* <label htmlFor="firstname3" className="col-fixed" style={{width:'100px'}}>Firstname</label> */}
                           <div className="col">
                        <InputText id="firstname3" type="text" placeholder="Enter order name to save"/>
                        </div>
                        <Button label="Save Order" onClick={()=>{
                            showToastBottomCenter();
                        }}/>
                    </div>

            </Dialog>
        </div>
    )
}