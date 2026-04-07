import React from "react";
import { formatCurrency, formatDate } from "../utils/format";
import { FaPalette } from "react-icons/fa";
import DialogModel from "./model/DialogModel";

const BatchSelectionDialog = ({
  visible,
  onHide,
  selectedProduct,
  batchedItemList,
  onBatchSelect
}) => {
  return (
    <DialogModel
      header={
        <div className="flex items-center gap-2">
       
          <span className="font-semibold text-lg">
            {selectedProduct?.productName} - Select Batch
          </span>
        </div>
      }
      visible={visible}
      onHide={onHide}
      className="w-full max-w-5xl"
    >
      <div className="p-5 bg-gray-50 rounded-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

          {batchedItemList.map((p, index) => (
            <div
              key={index}
              onClick={() => onBatchSelect(p.stockBatchId)}
              className="
                group cursor-pointer bg-white rounded-xl p-4
                border border-gray-200
                hover:border-sky-500 hover:shadow-md
                transition-all duration-200 active:scale-95
              "
            >
              {/* Batch Number */}
              <p className="text-xs text-gray-400 mb-1">Batch No</p>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {p.batchNo || "-"}
              </p>

              {/* Description */}
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {p.batchDescription || "-"}
              </p>

              {/* Price */}
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-lg font-bold text-sky-600 mb-2">
                {formatCurrency(p.unitPrice, true)}
              </p>

              {/* Quantity */}
              <p className="text-xs text-gray-400">Available Qty</p>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {p.qty} {p.measurementUnitName}
              </p>

              {/* Expiry Date */}
              {p.expDate && (
                <>
                  <p className="text-xs text-gray-400">Expiry Date</p>
                  <p className="text-sm font-medium text-red-500 mb-2">
                    {formatDate(p.expDate, true)}
                  </p>
                </>
              )}

              {/* Created Date */}
              <p className="text-xs text-gray-400">Created</p>
              <p className="text-xs text-gray-500">
                {formatDate(p.createdDate_utc, true)}
              </p>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-xl bg-sky-500 opacity-0 group-hover:opacity-5 transition pointer-events-none" />
            </div>
          ))}

        </div>
      </div>
    </DialogModel>
  );
};

export default BatchSelectionDialog;