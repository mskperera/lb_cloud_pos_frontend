import { AlertCircle, Calendar, CheckCircle2, Clock, Layers } from "lucide-react";
import {  formatDate } from "../utils/format";
import DialogModel from "./model/DialogModel";

const BatchSelectionDialog = ({
  visible,
  onHide,
  selectedProduct,
  selectedVariationProduct,
  batchedItemList,
  onBatchSelect
}) => {
  return (
    <DialogModel
      header={
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">
           Select Batch - {selectedVariationProduct?.description}
          </span>
        </div>
      }
      visible={visible}
      onHide={onHide}
      className="w-full max-w-5xl"
    >
 
<div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">

    {batchedItemList.map((p, index) => {

      const isExpired =
        p.expDate && new Date(p.expDate) < new Date();

      return (
        <div
          key={index}
          onClick={() => onBatchSelect(p)}
          className={`
            group
            relative
            cursor-pointer
            rounded-2xl
            border
            bg-white
            p-5
            transition-all
            duration-200
            hover:-translate-y-1
            hover:shadow-xl
            hover:scale-[1.02]

            ${
              isExpired
                ? "border-red-300 bg-red-50/40 hover:border-red-500"
                : "border-slate-200 hover:border-emerald-500"
            }
          `}
        >
          {/* Header */}

          <div className="flex justify-between items-start">

            <div>

              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Batch
              </p>

              <h2
                className={`text-xl font-bold tracking-wide mt-1 ${
                  isExpired ? "text-red-700" : "text-slate-800"
                }`}
              >
                {p.batchNo}
              </h2>

            </div>

            <div className="text-right">

              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Qty:
              </p>

              <div
                className={`text-2xl font-bold ${
                  isExpired ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {p.qty}
              </div>

              <div className="text-xs text-slate-500">
                {p.measurementUnitName}
              </div>

            </div>

          </div>

          {/* Status */}

          <div className="mt-4">

            {isExpired ? (

              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1">

                <AlertCircle className="w-4 h-4 text-red-600" />

                <span className="text-sm font-semibold text-red-700">
                  Expired
                </span>

              </div>

            ) : (
<></>
              // <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">

              //   <CheckCircle2 className="w-4 h-4 text-emerald-600" />

              //   <span className="text-sm font-semibold text-emerald-700">
              //     Available
              //   </span>

              // </div>

            )}

          </div>

          {/* Description */}

          {p.batchDescription && (

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">

              <p className="text-sm text-slate-600 line-clamp-2">
                {p.batchDescription}
              </p>

            </div>

          )}

          {/* Divider */}

          <div className="my-5 border-t border-slate-200"></div>

          {/* Dates */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-400">
                Manufactured
              </p>

              <p className="font-semibold text-slate-700 mt-1">
                {p.prodDate
                  ? formatDate(p.prodDate, true)
                  : "N/A"}
              </p>

            </div>

            <div className="text-right">

              <p
                className={`text-xs uppercase tracking-wide ${
                  isExpired
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              >
                Expiry
              </p>

              <p
                className={`font-semibold mt-1 ${
                  isExpired
                    ? "text-red-600"
                    : "text-slate-700"
                }`}
              >
                {p.expDate
                  ? formatDate(p.expDate, true)
                  : "N/A"}
              </p>

            </div>

          </div>

          {/* Hover Overlay */}

          <div
            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition duration-200 pointer-events-none ${
              isExpired
                ? "bg-red-500"
                : "bg-emerald-500"
            }`}
          />

        </div>
      );
    })}
  </div>
</div>
    </DialogModel>
  );
};

export default BatchSelectionDialog;