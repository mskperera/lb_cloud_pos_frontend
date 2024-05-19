
import React, { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function ToastPopup({summary,detail,severity}) {

   
    const toast = useRef(null);

    toast.current.show({ severity, summary, detail, sticky:true});
  
    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
       
        </div>
    )
}

export const showToastBottomCenter=()=>{

    return (
        <ToastPopup summary="summary" detail="detail" severity="error" />
    )
}