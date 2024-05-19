import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { showToastBottomCenter } from "../popups/ToastPopup";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { voidOrder } from "../../functions/register";
import { useToast } from "../useToast";
import { getDrpdownOrderVoidingReason } from "../../functions/dropdowns";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getOrders } from "../../functions/order";

export default function OrderVoidRemark({ visible, onClose,orderId,onUpdateOrderList }) {
  const [value, setValue] = useState("");
  const [isShowRemark, setIsShowRemark] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResonId, setSelectedResonId] = useState(null);
  

  const showToast = useToast();

  const [voidingReasonOptions,setVoidingReasonOptions] =useState([]);

  const loadDrpOrderVoidingReason=async ()=>{
    const objArr=await getDrpdownOrderVoidingReason();
    setVoidingReasonOptions(objArr.data.results[0])
  }


  useEffect(()=>{
    loadDrpOrderVoidingReason();
  },[])

//   useEffect(()=>{
//     if(selectReason && selectReason.id===1)
//     setIsShowRemark(true);
// else
// setIsShowRemark(false);

//   },[selectReason])


const getOrderByorderId = async (orderId) => {
  try{

  const filteredData = {

    orderId:orderId,
    skip: null,
    limit: null,
  };
  const _result = await getOrders(filteredData);
  return _result;
}
catch(err){
  console.log('error:',err);
}
};


  const _voidOrder=async(orderId,reasonId,isConfirm)=>{
    const payload={
      orderId,reasonId, isConfirm
  }
 
   return await voidOrder(payload)
  }

  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const voidAcceptHandler = async (id) => {
    try {
    
      const result = await _voidOrder(id,selectedResonId, true);
      console.log("result :", result);
      const { data } = result;
      if (data.error) {
        showToast("error", "Exception", data.error.message);
        return;
      }

      onUpdateOrderList(id)

     // const order=await getOrderByorderId(id);
      //console.log("order  000", order)
    //  setCustomers(products.filter(p=>p.customerId!==customerId));
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.log("err :", err);
    }
  };
  const voidCancelHandler = () => {
    console.log("voided");
    setSelectedIdToDelete(null);
  };


  const confirm = (outputMessage, id) => {
    confirmDialog({
      message: outputMessage,
      header: "Void Confirmation",
      icon: "pi pi-info-circle",
      //defaultFocus: 'reject',
      acceptClassName: "p-button-danger",
      accept: () => voidAcceptHandler(id),
      reject: voidCancelHandler,
    });
  };

  const voidOrderHandler=async (e)=>{

    e.preventDefault();
            const result = await _voidOrder(orderId,selectedResonId, false);
           
            if(result.data.error){
              showToast("error", "Exception", result.data.error.message);
              
            }
            console.log('voidd',result);
          
           if(result)
           confirm(result.data.outputValues.outputMessage,orderId);
  }
  return (
    <div className="card flex justify-content-center">
          {/* <ConfirmDialog /> */}
   
      <Dialog header="Void Order"  style={{ width: '25vw' }} visible={visible} onHide={onClose}>
        <div className="field ">
          <label htmlFor="void-reason" className="col-fixed">
            Why do you want to void this order?
          </label>
          <div className="col">
            <Dropdown
              id="void-reason"
              value={selectedResonId}
              onChange={(e) => setSelectedResonId(e.value)}
              options={voidingReasonOptions}
              optionLabel="displayName"
              optionValue="id"
              placeholder="Select the reason"
              className="w-full"
            />
          </div>

       {isShowRemark &&   <div className="col">
            <InputTextarea
              placeholder="Enter the reason"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              cols={30}
              className="w-full"
            />
          </div>}
          <div className="col w-full">
            <Button
            className="w-full"
              label="Void Order"
              onClick={voidOrderHandler}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
