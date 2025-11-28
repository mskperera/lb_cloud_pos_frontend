import React, { useEffect, useState } from "react";
import { showToastBottomCenter } from "../popups/ToastPopup";
import { voidOrder } from "../../functions/register";
import { useToast } from "../useToast";
import { getDrpdownOrderVoidingReason } from "../../functions/dropdowns";
import { FaTimes } from "react-icons/fa";

export default function OrderVoidRemark({
  visible,
  onClose,
  orderId,
  onUpdateOrderList,
}) {
  const [value, setValue] = useState("");
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [voidingReasonOptions, setVoidingReasonOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const showToast = useToast();

  const loadDrpOrderVoidingReason = async () => {
    try {
      const objArr = await getDrpdownOrderVoidingReason();
      setVoidingReasonOptions(objArr.data.results[0] || []);
    } catch (err) {
      console.error("Error loading voiding reasons:", err);
    }
  };

  useEffect(() => {
    if (visible) {
      loadDrpOrderVoidingReason();
      setSelectedReasonId("");
      setValue("");
    }
  }, [visible]);

  const _voidOrder = async (orderId, reasonId, isConfirm) => {
    const payload = { orderId, reasonId, isConfirm };
    return await voidOrder(payload);
  };

  const handleVoidOrder = async (e) => {
    e.preventDefault();
    if (!selectedReasonId) {
      showToast("error", "Validation", "Please select a void reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await _voidOrder(orderId, selectedReasonId, false);
      if (result.data.error) {
        showToast("error", "Error", result.data.error.message);
        setIsSubmitting(false);
        return;
      }
      setShowConfirmDialog(true); // Show final confirmation
    } catch (err) {
      showToast("error", "Error", "Failed to process void request");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmVoid = async () => {
    setIsSubmitting(true);
    try {
      const result = await _voidOrder(orderId, selectedReasonId, true);
      if (result.data.error) {
        showToast("error", "Failed", result.data.error.message);
      } else {
        showToast("success", "Success", result.data.outputValues.outputMessage || "Order voided successfully");
        onUpdateOrderList(orderId);
        onClose();
      }
    } catch (err) {
      showToast("error", "Error", "Void failed");
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop + Popup Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-500 to-rose-600 text-white">
            <h3 className="text-xl font-bold">Void Order</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Close"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleVoidOrder} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you want to void this order?
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                value={selectedReasonId}
                onChange={(e) => setSelectedReasonId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a reason
                </option>
                {voidingReasonOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Remark Field - Show if reason requires it (you can add logic later) */}
            {selectedReasonId && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Remark (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition"
                  rows={4}
                  placeholder="Enter details if needed..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedReasonId}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Void Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Final Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmDialog(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.94 4h13.88a1.88 1.88 0 001.88-1.88V8.12a1.88 1.88 0 00-1.88-1.88H5.94a1.88 1.88 0 00-1.88 1.88v7.76a1.88 1.88 0 001.88 1.88z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Confirm Void Order?</h3>
                <p className="text-gray-600 mt-2">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVoid}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-70 transition"
                >
                  {isSubmitting ? "Voiding..." : "Yes, Void Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}