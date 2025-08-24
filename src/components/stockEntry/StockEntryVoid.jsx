import React, { useEffect, useState } from "react";
import { useToast } from "../useToast";
import { voidStockEntry } from "../../functions/stockEntry";
import { getDrpdownStockEntryVoidingReason } from "../../functions/dropdowns";

export default function StockEntryVoid({ visible, onClose, stockEntryId, onUpdateOrderList }) {
  const [value, setValue] = useState("");
  const [isShowRemark, setIsShowRemark] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState(null);
  const [voidingReasonOptions, setVoidingReasonOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const voidStockEntryHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedReasonId) {
      showToast("error", "Validation", "Please select a reason.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await voidStockEntry(stockEntryId, selectedReasonId, value);
      const { data } = result;

      if (data.error) {
        showToast("error", "Exception", data.error.message);
      } else {
        showToast("success", "Successful", data.outputValues.outputMessage);
        onUpdateOrderList(stockEntryId);
        onClose();
      }
    } catch (err) {
      console.error("Error in voidStockEntry:", err);
      showToast("error", "Exception", "Failed to void the stock entry.");
    } finally {
      setIsSubmitting(false);
      setSelectedReasonId(null);
      setValue("");
    }
  };

  return (
    visible && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" ></div>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-50">
          <h3 className="text-lg font-bold text-gray-700">Void Stock Entry</h3>
          <form onSubmit={voidStockEntryHandler}>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="void-reason" className="text-sm font-medium text-gray-700">
                Why do you want to void this stock entry?
              </label>
              <select
                id="void-reason"
                className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                value={selectedReasonId || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedReasonId(selectedId);
                  setIsShowRemark(selectedId !== "1");
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
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="remark" className="text-sm font-medium text-gray-700">
                  Enter additional details
                </label>
                <textarea
                  id="remark"
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
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
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Void Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}