import React, { useState } from "react";
import { showToastBottomCenter } from "../popups/ToastPopup";

export default function HoldOrder({ visible, onClose }) {
  if (!visible) return null; // Handle visibility toggle

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 max-w-lg rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold">Hold Order</h2>
          <button
            className="btn btn-sm btn-circle btn-outline"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <input
            id="orderName"
            type="text"
            placeholder="Enter order name to save"
            className="input input-bordered w-full"
          />

          <button
            className="btn btn-primary w-full"
            onClick={() => {
              showToastBottomCenter();
              onClose(); // Close the modal after saving
            }}
          >
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}
