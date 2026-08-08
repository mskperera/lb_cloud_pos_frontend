import { AlertCircle, Calendar, CheckCircle2, Clock, Layers } from "lucide-react";
import {  formatCurrency, formatDate } from "../utils/format";
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
     className="w-full max-w-4xl"
    >
 
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">

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
      rounded-xl
      border
      bg-white
      p-4
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:shadow-lg

      ${
        isExpired
          ? "border-red-300 bg-red-50/40 hover:border-red-500"
          : "border-slate-200 hover:border-emerald-500"
      }
    `}
  >

    {/* Header */}
    <div className="flex justify-between items-start">

      <div className="mr-5">
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          Batch
        </p>

        <h2
          className={`
            text-base
            font-semibold
            mt-0.5
            ${
              isExpired
                ? "text-red-700"
                : "text-slate-800"
            }
          `}
        >
          {p.batchNo}
        </h2>
      </div>


<div className="text-right">
  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
   Stock Qty
  </p>

  <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 border border-emerald-200/60 shadow-sm">
    {/* Package / Inventory Icon */}
    <svg
      className={`w-3.5 h-3.5 ${isExpired ? "text-red-500" : "text-emerald-600"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>

<span
  className={`text-xs font-bold tracking-tight ${
    isExpired ? "text-red-700" : "text-emerald-800"
  }`}
>
  {p.formattedQty}
</span>
  </div>
</div>

    </div>



    { selectedProduct.isExpiringProduct && isExpired ? (
      <div className="mt-3">

        <div className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-red-100
          px-2.5
          py-1
        ">

          <AlertCircle className="w-3.5 h-3.5 text-red-600" />

          <span className="
            text-xs
            font-medium
            text-red-700
          ">
            Expired
          </span>

        </div>

      </div>
    ):null
    }


    {/* Description */}
    {p.batchDescription && (

      <div className="
        mt-3
        rounded-lg
        bg-slate-50
        border
        border-slate-100
        p-2.5
      ">

        <p className="
          text-xs
          text-slate-600
          line-clamp-2
        ">
          {p.batchDescription}
        </p>

      </div>

    )}
{/* {JSON.stringify(p)} */}
        <p
                className="mb-2 text-sky-600 text-center font-mono text-base font-semibold"
                style={{
                  marginTop: "auto",
                }}
              >
                {p?.isMultiUom ? null : formatCurrency(p.unitPrice, true)}
              </p>



 {selectedProduct.isExpiringProduct ? <>
    <div className="my-4 border-t border-slate-200" />

  <div className="grid grid-cols-2 gap-3">
  <div>
    <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
      MFD
    </p>

    <p className="text-xs font-semibold text-slate-700 mt-0.5">
      {p.prodDate ? formatDate(p.prodDate, true) : "N/A"}
    </p>
  </div>

  <div className="text-right">
    <p
      className={`text-[10px] uppercase font-semibold tracking-wider ${
        isExpired ? "text-red-400" : "text-slate-400"
      }`}
    >
      EXP
    </p>

    <p
      className={`text-xs font-semibold mt-0.5 ${
        isExpired ? "text-red-600 font-bold" : "text-slate-700"
      }`}
    >
      {p.expDate ? formatDate(p.expDate, true) : "N/A"}
    </p>
  </div>
</div>
    </>:null}


    {/* Hover */}
    <div
      className={`
        absolute
        inset-0
        rounded-xl
        opacity-0
        group-hover:opacity-5
        transition
        pointer-events-none
        ${
          isExpired
            ? "bg-red-500"
            : "bg-emerald-500"
        }
      `}
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