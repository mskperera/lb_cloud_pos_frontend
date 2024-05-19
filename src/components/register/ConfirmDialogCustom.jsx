import React, { useEffect, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";

export default function ConfirmDialogCustom({visible,onClose,onAccept,onReject}) {

    return (
     <>
           <ConfirmDialog visible={visible} onHide={onClose} message="Are you sure you want to void this order?" 
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={onAccept} reject={onReject} />
    </>
    )
}