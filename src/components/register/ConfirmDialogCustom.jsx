import React from "react";

export default function ConfirmDialogCustom({
  visible,
  onClose,
  onAccept,
  onReject,
}) {
  if (!visible) return null; // Handle visibility toggle

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold">Confirmation</h2>
          <button
            className="btn btn-sm btn-circle btn-outline"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to void this order?
        </p>

        <div className="flex justify-end gap-4">
          <button
            className="btn btn-outline"
            onClick={() => {
              onReject();
              onClose(); // Close dialog after rejection
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onAccept();
              onClose(); // Close dialog after acceptance
            }}
          >
            Yes, Void
          </button>
        </div>
      </div>
    </div>
  );
}
