import React, { useEffect, useState } from "react";
import { useToast } from "../useToast";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { voidStockEntry } from "../../functions/stockEntry";
import { getDrpdownStockEntryVoidingReason } from "../../functions/dropdowns";


export default function StockEntryVoid({ visible, onClose, stockEntryId, onUpdateOrderList }) {
  const [value, setValue] = useState("");
  const [isShowRemark, setIsShowRemark] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState(null);
  const [voidingReasonOptions, setVoidingReasonOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const showToast = useToast();

  // Load voiding reasons
  const loadDrpOrderVoidingReason = async () => {
    try {
      const objArr = await getDrpdownStockEntryVoidingReason();
      setVoidingReasonOptions(objArr.data.results[0] || []);
    } catch (err) {
      console.error("Error loading dropdown order voiding reasons:", err);
      showToast("error", "Exception", "Failed to load reasons for voiding.");
    }
  };

  useEffect(() => {
    if (visible) {
      loadDrpOrderVoidingReason();
    }
  }, [visible]);

  // Void order API call
  const _voidStockEntry = async (stockEntryId, reasonId, remark) => {
    try {
    
      const result = await voidStockEntry(stockEntryId, reasonId, remark);
      return result;
    } catch (err) {
      console.error("Error in _voidStockEntry:", err);
      throw err;
    }
  };

  const voidAcceptHandler = async () => {
    try {
      const result = await _voidStockEntry(stockEntryId, selectedReasonId, value);
      const { data } = result;

      if (data.error) {
        showToast("error", "Exception", data.error.message);
      } else {
        showToast("success", "Successful", data.outputValues.outputMessage);
        onUpdateOrderList(stockEntryId);
      }
    } catch (err) {
      showToast("error", "Exception", "Failed to void the stock entry.");
    } finally {
      setIsSubmitting(false);
      setShowDialog(false);
      onClose();
    }
  };

  const voidCancelHandler = () => {
    setShowDialog(false);
    setIsSubmitting(false);
    setSelectedReasonId(null);
    setValue("");
  };

  const confirmVoid = () => {
    setShowDialog(true);
  };

  const voidOrderHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedReasonId) {
      showToast("error", "Validation", "Please select a reason.");
      setIsSubmitting(false);
      return;
    }

    confirmVoid();
  };

  return (
    visible && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {showDialog && (
          <ConfirmDialog
            isVisible={true}
            message="Are you sure you want to void this stock entry?"
            onConfirm={voidAcceptHandler}
            onCancel={voidCancelHandler}
            title="Confirm Void"
            severity="danger"
          />
        )}
        <div className="modal modal-open">
          <div className="modal-box relative">
            <h3 className="text-lg font-bold">Void Stock Entry</h3>
            <form onSubmit={voidOrderHandler}>
              <div className="form-control mb-4">
                <label htmlFor="void-reason" className="label">
                  Why do you want to void this stock entry?
                </label>
                <select
                  id="void-reason"
                  className="select select-bordered w-full"
                  value={selectedReasonId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedReasonId(selectedId);
                    setIsShowRemark(selectedId !== "1"); // Show remark if not "None"
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
                  <label htmlFor="remark" className="label">Enter additional details</label>
                  <textarea
                    id="remark"
                    className="textarea textarea-bordered w-full"
                    placeholder="Enter remarks (if required)"
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Void Entry"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={onClose}></div>
        </div>
      </div>
    )
  );
}
