import React, { useEffect, useState } from "react";
import { showToastBottomCenter } from "../popups/ToastPopup";
import { voidOrder } from "../../functions/register";
import { useToast } from "../useToast";
import { getDrpdownOrderVoidingReason } from "../../functions/dropdowns";
import { getOrders } from "../../functions/order";
import ConfirmDialog from "../dialog/ConfirmDialog";
import DialogModel from "../model/DialogModel";


export default function OrderVoidRemark({
  visible,
  onClose,
  orderId,
  onUpdateOrderList,
}) {
  const [value, setValue] = useState("");
  const [isShowRemark, setIsShowRemark] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState(null);
  const [voidingReasonOptions, setVoidingReasonOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const showToast = useToast();

  const loadDrpOrderVoidingReason = async () => {
    try {
      const objArr = await getDrpdownOrderVoidingReason();
      setVoidingReasonOptions(objArr.data.results[0]);
    } catch (err) {
      console.error("Error loading dropdown order voiding reasons:", err);
    }
  };

  useEffect(() => {
    loadDrpOrderVoidingReason();
  }, []);

  const _voidOrder = async (orderId, reasonId, isConfirm) => {
    const payload = { orderId, reasonId, isConfirm };
    return await voidOrder(payload);
  };

  const voidAcceptHandler = async () => {
    try {
      const result = await _voidOrder(orderId, selectedReasonId, true);
      const { data } = result;
      if (data.error) {
        setIsSubmitting(false);
        showToast("error", "Exception", data.error.message);
        return;
      }
      onUpdateOrderList(orderId);
      setIsSubmitting(false);
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.error("Error in voidAcceptHandler:", err);
    }
  };

  const voidCancelHandler = () => {
    setSelectedReasonId(null);
    setShowDialog(false);
    setIsSubmitting(false);
  };

  const handleConfirm = () => {
    voidAcceptHandler();
    setShowDialog(false);
  };

  const confirmVoid = (outputMessage, orderId) => {
    setShowDialog(true);
  };

  const voidOrderHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await _voidOrder(orderId, selectedReasonId, false);
      if (result.data.error) {
        showToast("danger", "Exception", result.data.error.message);
        setIsSubmitting(false);
        return;
      }
      confirmVoid();
    } catch (err) {
      console.error("Error in voidOrderHandler:", err);
      setIsSubmitting(false);
    }
  };

  return (
    visible && (
      <DialogModel
        header="Void Order"
        visible={visible}
        onHide={onClose}
   
        height="fit-content"
      >
        {showDialog && (
          <ConfirmDialog
            isVisible={true}
            message="Are you sure you want to delete this item?"
            onConfirm={handleConfirm}
            onCancel={voidCancelHandler}
            title="Confirm Delete"
            severity="danger"
          />
        )}

        <form onSubmit={voidOrderHandler}>
          <div className="form-control mb-4">
            <label htmlFor="void-reason" className="label">
              Why do you want to void this order?
            </label>
            <select
              id="void-reason"
              className="select select-bordered w-full"
              value={selectedReasonId}
              onChange={(e) => {
                setSelectedReasonId(e.target.value);
                // Logic to show remark field based on selected reason, if needed
                setIsShowRemark(true); // Example condition
              }}
            >
              <option value="" disabled>
                Select the reason
              </option>
              {voidingReasonOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>

          {isShowRemark && (
            <div className="form-control mb-4">
              <label htmlFor="remark" className="label">Enter the reason</label>
              <textarea
                id="remark"
                className="textarea textarea-bordered w-full"
                placeholder="Enter the reason"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
              ></textarea>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Voiding..." : "Void Order"}
            </button>
          </div>
        </form>
      </DialogModel>
    )
  );
}
