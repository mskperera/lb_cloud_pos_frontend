

import React, { useState } from "react";
import { Layers, Plus, Minus, ShoppingBag, RulerDimensionLine, PackageCheck, Layers3 } from "lucide-react";
import DialogModel from "./model/DialogModel";
import { formatCurrency, getCurrency } from "../utils/format";
import { CURRENCY_DISPLAY_TYPE } from "../utils/constants";

const UOMCard = ({ uom, previousUnitName, relativeQty, onUomSelect }) => {
  const isDecimalAllowed = Boolean(uom.allowDecimal || uom.isDecimalAllowed);
  const stepValue = isDecimalAllowed ? 0.01 : 1;

  const [qty, setQty] = useState(1);

  const handleQtyChange = (e) => {
    const val = parseFloat(e.target.value);

    if (isNaN(val) || val < 0) {
      setQty(1);
      return;
    }

    if (!isDecimalAllowed) {
      setQty(Math.floor(val));
    } else {
      setQty(val);
    }
  };

  const increment = (e) => {
    e.stopPropagation();
    setQty((prev) => Number((prev + stepValue).toFixed(2)));
  };

  const decrement = (e) => {
    e.stopPropagation();
    setQty((prev) => {
      const nextVal = prev - stepValue;
      return nextVal >= stepValue ? Number(nextVal.toFixed(2)) : prev;
    });
  };

  // Format conversion text based on previous unit in hierarchy
  const conversionText = Boolean(uom.isBaseUnit)
    ? "Base Unit"
    : `${relativeQty} x ${previousUnitName}`;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:border-sky-500 hover:shadow-md">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        {/* Left Column: Title & Badges */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3
              className="text-sm font-bold text-slate-800 truncate"
              title={uom.measurementUnitName}
            >
              {uom.measurementUnitName}
            </h3>

            <span
              className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                isDecimalAllowed
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isDecimalAllowed ? "Decimal" : "Whole"}
            </span>
          </div>

          <p className="text-[11px] font-medium text-sky-600 mt-0.5">
            {conversionText}
          </p>
        </div>

        {/* Right Column: Price Display */}
        <div className="text-right shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
            Unit Price
          </span>
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="text-xs font-bold text-sky-600">
              {getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.
            </span>
            <span className="text-base font-bold font-mono tracking-tight text-sky-600">
              {formatCurrency(uom.sellingPrice, false)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Row */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={decrement}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition shrink-0"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="number"
            value={qty}
            step={stepValue}
            onChange={handleQtyChange}
            onClick={(e) => e.target.select()}
            min={stepValue}
            className="
              w-16 h-7
              text-center font-bold text-xs text-slate-800
              bg-white rounded-md border border-slate-300
              shadow-inner px-1
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
              transition-all
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
          />

          <button
            type="button"
            onClick={increment}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition shrink-0"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          disabled={qty<=0}
          onClick={() => onUomSelect(uom, qty)}
          className="flex-1 flex items-center justify-center gap-1 bg-sky-600 hover:bg-sky-700 text-white h-7 px-2.5 
          rounded-md text-xs font-semibold shadow-sm transition active:scale-95 min-w-[60px] 
         disabled:bg-slate-200"
        >
          <ShoppingBag className="w-3 h-3" />
          Add
        </button>
      </div>
    </div>
  );
};

const UOMSelectionDialog = ({
  visible,
  onHide,
  selectedProduct,
  selectedVariationProduct,
  uomList = [],
  onUomSelect,
  selectedBatch
}) => {
  return (
    <DialogModel
      header={
        <div className="flex items-center gap-2">
          <RulerDimensionLine className="w-5 h-5" />
          <span className="font-semibold text-lg ">
            Select Unit - {selectedVariationProduct?.description || selectedProduct?.productName}
          </span>
        </div>
      }
      visible={visible}
      onHide={onHide}
      className="w-full max-w-4xl"
    >
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        {/* Available Batch Stock Banner */}
      {selectedBatch?.inventoryId ?  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                Available Batch Stock
              </p>
              {selectedBatch?.batchNo && (
                <p className="text-xs font-semibold text-slate-600">
                  Batch #: <span className="font-mono text-slate-800">{selectedBatch.batchNo}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200/60">
            <Layers3 className="w-4 h-4 text-slate-500" />
            <span className="font-mono font-bold text-sm text-slate-800">
              {selectedBatch?.formattedQty || "0"}
            </span>
          </div>
        </div> : null}

        {/* UOM Cards List */}
        {uomList && uomList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uomList.map((uom, index) => {
              // Get the unit immediately preceding this one in the list
              const previousUom = index > 0 ? uomList[index - 1] : null;
              
              // Calculate relative quantity between current UOM and previous UOM
              const currentConv = Number(uom.conversionQty) || 1;
              const prevConv = Number(previousUom?.conversionQty) || 1;
              const relativeQty = currentConv / prevConv;

              return (
                <UOMCard
                  key={uom.productUomId || index}
                  uom={uom}
                  previousUnitName={previousUom?.measurementUnitName || ""}
                  relativeQty={relativeQty}
                  onUomSelect={onUomSelect}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            <Layers className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-medium text-slate-500">No Unit of Measure (UOM) options found for this item.</p>
          </div>
        )}
      </div>
    </DialogModel>
  );
};

export default UOMSelectionDialog;


// const UOMCard = ({ uom, baseUnitName, onUomSelect }) => {
//   const isDecimalAllowed = Boolean(uom.allowDecimal || uom.isDecimalAllowed);
//   const stepValue = isDecimalAllowed ? 0.01 : 1;

//   const [qty, setQty] = useState(1);

//   const handleQtyChange = (e) => {
//     const val = parseFloat(e.target.value);

//     if (isNaN(val) || val <= 0) {
//       setQty(1);
//       return;
//     }

//     if (!isDecimalAllowed) {
//       setQty(Math.floor(val));
//     } else {
//       setQty(val);
//     }
//   };

//   const increment = (e) => {
//     e.stopPropagation();
//     setQty((prev) => Number((prev + stepValue).toFixed(2)));
//   };

//   const decrement = (e) => {
//     e.stopPropagation();
//     setQty((prev) => {
//       const nextVal = prev - stepValue;
//       return nextVal >= stepValue ? Number(nextVal.toFixed(2)) : prev;
//     });
//   };

//   const conversionText = Boolean(uom.isBaseUnit)
//     ? "(Base Unit)"
//     : `(${Number(uom.conversionQty)} ${baseUnitName})`;

//   return (
//     <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:border-sky-500 hover:shadow-md">
//       {/* Top Header Row */}
//       <div className="flex items-start justify-between gap-2">
//         {/* Left Column: Title & Badges */}
//         <div className="min-w-0 flex-1">
//           <div className="flex items-center gap-1.5 flex-wrap">
//             <h3
//               className="text-sm font-bold text-slate-800 truncate"
//               title={uom.measurementUnitName}
//             >
//               {uom.measurementUnitName || "Standard Unit"}
//             </h3>

//             <span
//               className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
//                 isDecimalAllowed
//                   ? "bg-blue-50 text-blue-600 border border-blue-100"
//                   : "bg-slate-100 text-slate-500"
//               }`}
//             >
//               {isDecimalAllowed ? "Decimal" : "Whole"}
//             </span>
//           </div>

//           <p className="text-[11px] font-medium text-sky-600 mt-0.5">
//             {conversionText}
//           </p>
//         </div>

//         {/* Right Column: Price Display */}
//         <div className="text-right shrink-0">
//           <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
//             Unit Price
//           </span>
//           <div className="flex items-baseline justify-end gap-0.5">
//             <span className="text-xs font-bold text-sky-600">
//               {getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.
//             </span>
//             <span className="text-base font-bold font-mono tracking-tight text-sky-600">
//               {formatCurrency(uom.sellingPrice, false)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Controls Row */}
//       <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
//         {/* Quantity Stepper with Wider Input Field */}
//         <div className="flex items-center gap-1 shrink-0">
//           <button
//             type="button"
//             onClick={decrement}
//             className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition shrink-0"
//           >
//             <Minus className="w-3 h-3" />
//           </button>

//           {/* Expanded input width (w-16 / 64px) for clear decimal input */}
//           <input
//             type="number"
//             value={qty}
//             step={stepValue}
//             onChange={handleQtyChange}
//             onClick={(e) => e.target.select()}
//             min={stepValue}
//             className="
//               w-16 h-7
//               text-center font-bold text-xs text-slate-800
//               bg-white rounded-md border border-slate-300
//               shadow-inner px-1
//               focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
//               transition-all
//               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
//             "
//           />

//           <button
//             type="button"
//             onClick={increment}
//             className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition shrink-0"
//           >
//             <Plus className="w-3 h-3" />
//           </button>
//         </div>

//         {/* Add Button */}
//         <button
//           type="button"
//           onClick={() => onUomSelect(uom, qty)}
//           className="flex-1 flex items-center justify-center gap-1 bg-sky-600 hover:bg-sky-700 text-white h-7 px-2.5 rounded-md text-xs font-semibold shadow-sm transition active:scale-95 min-w-[60px]"
//         >
//           <ShoppingBag className="w-3 h-3" />
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// const UOMCard = ({ uom, baseUnitName, onUomSelect }) => {
//   const isDecimalAllowed = Boolean(uom.allowDecimal || uom.isDecimalAllowed);
//   const stepValue = isDecimalAllowed ? 0.01 : 1;

//   const [qty, setQty] = useState(1);

//   const handleQtyChange = (e) => {
//     const val = parseFloat(e.target.value);

//     if (isNaN(val) || val <= 0) {
//       setQty(1);
//       return;
//     }

//     if (!isDecimalAllowed) {
//       setQty(Math.floor(val));
//     } else {
//       setQty(val);
//     }
//   };

//   const increment = (e) => {
//     e.stopPropagation();
//     setQty((prev) => Number((prev + stepValue).toFixed(2)));
//   };

//   const decrement = (e) => {
//     e.stopPropagation();
//     setQty((prev) => {
//       const nextVal = prev - stepValue;
//       return nextVal >= stepValue ? Number(nextVal.toFixed(2)) : prev;
//     });
//   };

//   const conversionText = Boolean(uom.isBaseUnit)
//     ? "(Base Unit)"
//     : `(${Number(uom.conversionQty)} ${baseUnitName})`;

//   return (
//     <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:border-sky-500 hover:shadow-md">
//       {/* Top Header Row: Split details across left & right */}
//       <div className="flex items-start justify-between gap-2">
//         {/* Left Column: Title & Subtitles */}
//         <div className="min-w-0 flex-1">
//           <div className="flex items-center gap-1.5 flex-wrap">
//             <h3
//               className="text-sm font-bold text-slate-800 truncate"
//               title={uom.measurementUnitName}
//             >
//               {uom.measurementUnitName || "Standard Unit"}
//             </h3>
            
//             {/* Decimal Badge */}
//             <span
//               className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
//                 isDecimalAllowed
//                   ? "bg-blue-50 text-blue-600 border border-blue-100"
//                   : "bg-slate-100 text-slate-500"
//               }`}
//             >
//               {isDecimalAllowed ? "Decimal" : "Whole"}
//             </span>
//           </div>

//           <p className="text-[11px] font-medium text-sky-600 mt-0.5">
//             {conversionText}
//           </p>
//         </div>

//         {/* Right Column: Price Display */}
//         <div className="text-right shrink-0">
//           <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
//             Unit Price
//           </span>
//           <div className="flex items-baseline justify-end gap-0.5">
//             <span className="text-xs font-bold text-sky-600">
//               {getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.
//             </span>
//             <span className="text-base font-bold font-mono tracking-tight text-sky-600">
//               {formatCurrency(uom.sellingPrice, false)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Controls Row: Compact Stepper & Action Button */}
//       <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
//         {/* Quantity Stepper */}
//         <div className="flex items-center gap-1 shrink-0">
//           <button
//             type="button"
//             onClick={decrement}
//             className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
//           >
//             <Minus className="w-3 h-3" />
//           </button>

//           <input
//             type="number"
//             value={qty}
//             step={stepValue}
//             onChange={handleQtyChange}
//             onClick={(e) => e.target.select()}
//             min={stepValue}
//             className="
//               w-12 h-7
//               text-center font-bold text-xs text-slate-800
//               bg-white rounded-md border border-slate-300
//               shadow-inner
//               focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
//               transition-all
//               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
//             "
//           />

//           <button
//             type="button"
//             onClick={increment}
//             className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
//           >
//             <Plus className="w-3 h-3" />
//           </button>
//         </div>

//         {/* Add Button */}
//         <button
//           type="button"
//           onClick={() => onUomSelect(uom, qty)}
//           className="flex-1 flex items-center justify-center gap-1 bg-sky-600 hover:bg-sky-700 text-white h-7 px-2.5 rounded-md text-xs font-semibold shadow-sm transition active:scale-95"
//         >
//           <ShoppingBag className="w-3 h-3" />
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };


// const UOMCard = ({ uom, baseUnitName, onUomSelect }) => {
//   const isDecimalAllowed = Boolean(uom.allowDecimal || uom.isDecimalAllowed);
//   const stepValue = isDecimalAllowed ? 0.01 : 1;

//   const [qty, setQty] = useState(1);

//   const handleQtyChange = (e) => {
//     const val = parseFloat(e.target.value);

//     if (isNaN(val) || val <= 0) {
//       setQty(1);
//       return;
//     }

//     if (!isDecimalAllowed) {
//       setQty(Math.floor(val));
//     } else {
//       setQty(val);
//     }
//   };

//   const increment = (e) => {
//     e.stopPropagation();
//     setQty((prev) => Number((prev + stepValue).toFixed(2)));
//   };

//   const decrement = (e) => {
//     e.stopPropagation();
//     setQty((prev) => {
//       const nextVal = prev - stepValue;
//       return nextVal >= stepValue ? Number(nextVal.toFixed(2)) : prev;
//     });
//   };

//   const conversionText = Boolean(uom.isBaseUnit)
//     ? "(Base Unit)"
//     : `(${Number(uom.conversionQty)} ${baseUnitName})`;

//   return (
//     <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-emerald-500 hover:shadow-md">
//       <div>
//         <div className="flex items-center justify-between">
//           <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//             Unit
//           </span>
//           <span
//             className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
//               isDecimalAllowed
//                 ? "bg-blue-50 text-blue-600 border border-blue-100"
//                 : "bg-slate-100 text-slate-500"
//             }`}
//           >
//             {isDecimalAllowed ? "Decimal Allowed" : "Whole Units"}
//           </span>
//         </div>

//         <h3
//           className="mt-1 text-base font-bold text-slate-800 truncate"
//           title={uom.measurementUnitName}
//         >
//           {uom.measurementUnitName || "Standard Unit"}
//         </h3>

//         <p className="text-xs font-semibold text-sky-600 mt-0.5">
//           {conversionText}
//         </p>

//         <div className="mt-3 flex items-baseline gap-1">
//           <span className="text-xs font-semibold text-sky-600">
//             {getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.
//           </span>
//           <span className="text-lg font-semibold font-mono tracking-tight text-sky-600">
//             {formatCurrency(uom.sellingPrice, false)}
//           </span>
//         </div>
//       </div>

//       <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
//         <div className="flex items-center gap-1">
//           <button
//             type="button"
//             onClick={decrement}
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
//           >
//             <Minus className="w-3.5 h-3.5" />
//           </button>

//           <input
//             type="number"
//             value={qty}
//             step={stepValue}
//             onChange={handleQtyChange}
//             onClick={(e) => e.target.select()}
//             min={stepValue}
//             className="
//               w-14 h-8
//               text-center font-bold text-sm text-slate-800
//               bg-white rounded-lg border border-slate-300
//               shadow-inner
//               focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
//               transition-all
//               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
//             "
//           />

//           <button
//             type="button"
//             onClick={increment}
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
//           >
//             <Plus className="w-3.5 h-3.5" />
//           </button>
//         </div>

//         <button
//           type="button"
//           onClick={() => onUomSelect(uom, qty)}
//           className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
//         >
//           <ShoppingBag className="w-3.5 h-3.5" />
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// const UOMSelectionDialog = ({
//   visible,
//   onHide,
//   selectedProduct,
//   selectedVariationProduct,
//   uomList = [],
//   onUomSelect,
//   selectedBatch
// }) => {
//   const baseUom = uomList.find((u) => u.isBaseUnit === 1);
//   const baseUnitName = baseUom ? baseUom.measurementUnitName : "";

//   return (
//     <DialogModel
//       header={
//         <div className="flex items-center gap-2">
//           <RulerDimensionLine className="w-5 h-5 text-white" />
//           <span className="font-semibold text-lg text-white">
//             Select Unit - {selectedVariationProduct?.description || selectedProduct?.productName}
//           </span>
//         </div>
//       }
//       visible={visible}
//       onHide={onHide}
//       className="w-full max-w-4xl"
//     >
//       <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
//         {/* --- UI/UX Enhanced Batch Stock Banner --- */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
//           <div className="flex items-center gap-2.5">
//             <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
//               <PackageCheck className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
//                 Available Batch Stock
//               </p>
//               {selectedBatch?.batchNo && (
//                 <p className="text-xs font-semibold text-slate-600">
//                   Batch No. : <span className="font-mono text-slate-800">{selectedBatch.batchNo}</span>
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200/60">
//             <Layers3 className="w-4 h-4 text-slate-500" />
//             <span className="font-mono font-bold text-sm text-slate-800">
//               {selectedBatch?.formattedQty || "0"}
//             </span>
//           </div>
//         </div>

//         {/* --- UOM List Grid --- */}
//         {uomList && uomList.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {uomList.map((uom, index) => (
//               <UOMCard
//                 key={uom.productUomId || index}
//                 uom={uom}
//                 baseUnitName={baseUnitName}
//                 onUomSelect={onUomSelect}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center p-8 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
//             <Layers className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
//             <p className="text-sm font-medium text-slate-500">No Unit of Measure (UOM) options found for this item.</p>
//           </div>
//         )}
//       </div>
//     </DialogModel>
//   );
// };

// export default UOMSelectionDialog;



// import React, { useState } from "react";
// import { Layers, Plus, Minus, ShoppingBag, RulerDimensionLine } from "lucide-react";
// import DialogModel from "./model/DialogModel";
// import { formatCurrency, getCurrency } from "../utils/format";
// import { CURRENCY_DISPLAY_TYPE } from "../utils/constants";

// // const UOMCard = ({ uom, onUomSelect }) => {
// //   // Check whether decimal quantities are allowed for this UOM
// //   const isDecimalAllowed = Boolean(uom.allowDecimal || uom.isDecimalAllowed);
// //   const stepValue = isDecimalAllowed ? 0.01 : 1;

// //   const [qty, setQty] = useState(1);

// //   const handleQtyChange = (e) => {
// //     const val = parseFloat(e.target.value);

// //     if (isNaN(val) || val <= 0) {
// //       setQty(1);
// //       return;
// //     }

// //     // Over the course of input validation, restrict to integers if decimal is not allowed
// //     if (!isDecimalAllowed) {
// //       setQty(Math.floor(val));
// //     } else {
// //       setQty(val);
// //     }
// //   };

// //   const increment = (e) => {
// //     e.stopPropagation();
// //     setQty((prev) => Number((prev + stepValue).toFixed(2)));
// //   };

// //   const decrement = (e) => {
// //     e.stopPropagation();
// //     setQty((prev) => {
// //       const nextVal = prev - stepValue;
// //       return nextVal >= stepValue ? Number(nextVal.toFixed(2)) : prev;
// //     });
// //   };

// //   return (
// //     <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-emerald-500 hover:shadow-md">
// //       {/* Essential Details: Unit Name, Decimal Indicator & Price */}
// //       <div>
// //         <div className="flex items-center justify-between">
// //           <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //             Unit
// //           </span>
// //           {/* Decimal Allowance Badge */}
// //           <span
// //             className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
// //               isDecimalAllowed
// //                 ? "bg-blue-50 text-blue-600 border border-blue-100"
// //                 : "bg-slate-100 text-slate-500"
// //             }`}
// //           >
// //             {isDecimalAllowed ? "Decimal Allowed" : "Whole Units"}
// //           </span>
// //         </div>

// //         <h3
// //           className="mt-1 text-base font-bold text-slate-800 truncate"
// //           title={uom.measurementUnitName}
// //         >
// //           {uom.measurementUnitName || "Standard Unit"}
// //         </h3>

// //         <div className="mt-3 flex items-baseline gap-1">
// //           <span className="text-xs font-semibold text-emerald-600">Rs.</span>
// //           <span className="text-xl font-extrabold tracking-tight text-emerald-600">
// //             {Number(uom.sellingPrice || 0).toLocaleString("en-US", {
// //               minimumFractionDigits: 2,
// //               maximumFractionDigits: 2,
// //             })}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Quantity Controls & Action Button */}
// //       <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
// //         {/* Stepper with Explicit Textbox Styling */}
// //         <div className="flex items-center gap-1">
// //           {/* Minus Button */}
// //           <button
// //             type="button"
// //             onClick={decrement}
// //             className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
// //           >
// //             <Minus className="w-3.5 h-3.5" />
// //           </button>

// //           {/* Proper Textbox for Editable Quantity */}
// //           <input
// //             type="number"
// //             value={qty}
// //             step={stepValue}
// //             onChange={handleQtyChange}
// //             onClick={(e) => e.target.select()}
// //             min={stepValue}
// //             className="
// //               w-14 h-8
// //               text-center font-bold text-sm text-slate-800
// //               bg-white rounded-lg border border-slate-300
// //               shadow-inner
// //               focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
// //               transition-all
// //               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
// //             "
// //           />

// //           {/* Plus Button */}
// //           <button
// //             type="button"
// //             onClick={increment}
// //             className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
// //           >
// //             <Plus className="w-3.5 h-3.5" />
// //           </button>
// //         </div>

// //         {/* Add Button */}
// //         <button
// //           type="button"
// //           onClick={() => onUomSelect(uom, qty)}
// //           className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
// //         >
// //           <ShoppingBag className="w-3.5 h-3.5" />
// //           Add
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };



// const UOMCard = ({ uom, baseUnitName, onUomSelect }) => {
//   // Check whether decimal quantities are allowed for this UOM
//   const isDecimalAllowed = Boolean(uom.allowDecimal || uom.isDecimalAllowed);
//   const stepValue = isDecimalAllowed ? 0.01 : 1;

//   const [qty, setQty] = useState(1);

//   const handleQtyChange = (e) => {
//     const val = parseFloat(e.target.value);

//     if (isNaN(val) || val <= 0) {
//       setQty(1);
//       return;
//     }

//     if (!isDecimalAllowed) {
//       setQty(Math.floor(val));
//     } else {
//       setQty(val);
//     }
//   };

//   const increment = (e) => {
//     e.stopPropagation();
//     setQty((prev) => Number((prev + stepValue).toFixed(2)));
//   };

//   const decrement = (e) => {
//     e.stopPropagation();
//     setQty((prev) => {
//       const nextVal = prev - stepValue;
//       return nextVal >= stepValue ? Number(nextVal.toFixed(2)) : prev;
//     });
//   };

  

//   // Format conversion ratio text (e.g., "(10 Tablets)" or "(Base Unit)")
//   const conversionText = Boolean(uom.isBaseUnit)
//     ? "(Base Unit)"
//     : `(${Number(uom.conversionQty)} ${baseUnitName})`;

//   return (
//     <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-emerald-500 hover:shadow-md">
//       {/* Essential Details: Unit Name, Base Unit Ratio & Price */}
//       <div>
//         <div className="flex items-center justify-between">
//           <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//             Unit
//           </span>
//           {/* Decimal Allowance Badge */}
//           <span
//             className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
//               isDecimalAllowed
//                 ? "bg-blue-50 text-blue-600 border border-blue-100"
//                 : "bg-slate-100 text-slate-500"
//             }`}
//           >
//             {isDecimalAllowed ? "Decimal Allowed" : "Whole Units"}
//           </span>
//         </div>

//         {/* Unit Name */}
//         <h3
//           className="mt-1 text-base font-bold text-slate-800 truncate"
//           title={uom.measurementUnitName}
//         >
//           {uom.measurementUnitName || "Standard Unit"}
//         </h3>

//         {/* Breakdown phenomenon / conversion badge */}
//         <p className="text-xs font-semibold text-sky-600 mt-0.5">
//           {conversionText}
//         </p>

//         {/* Price Display */}
//         <div className="mt-3 flex items-baseline gap-1">
//           <span className="text-xs font-semibold text-sky-600">{getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}.</span>
//           <span className="text-lg font-semibold font-mono tracking-tight text-sky-600">
//                       {formatCurrency(uom.sellingPrice,false)}
//           </span>
//         </div>
//       </div>

//       {/* Quantity Controls & Action Button */}
//       <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
//         {/* Stepper with Explicit Textbox Styling */}
//         <div className="flex items-center gap-1">
//           {/* Minus Button */}
//           <button
//             type="button"
//             onClick={decrement}
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
//           >
//             <Minus className="w-3.5 h-3.5" />
//           </button>

//           {/* Proper Textbox for Editable Quantity */}
//           <input
//             type="number"
//             value={qty}
//             step={stepValue}
//             onChange={handleQtyChange}
//             onClick={(e) => e.target.select()}
//             min={stepValue}
//             className="
//               w-14 h-8
//               text-center font-bold text-sm text-slate-800
//               bg-white rounded-lg border border-slate-300
//               shadow-inner
//               focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
//               transition-all
//               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
//             "
//           />

//           {/* Plus Button */}
//           <button
//             type="button"
//             onClick={increment}
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
//           >
//             <Plus className="w-3.5 h-3.5" />
//           </button>
//         </div>

//         {/* Add Button */}
//         <button
//           type="button"
//           onClick={() => onUomSelect(uom, qty)}
//           className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
//         >
//           <ShoppingBag className="w-3.5 h-3.5" />
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };


// const UOMSelectionDialog = ({
//   visible,
//   onHide,
//   selectedProduct,
//   selectedVariationProduct,
//   uomList = [],
//   onUomSelect,
//   selectedBatch
// }) => {
// console.log('uomList:',uomList)
//   const baseUom = uomList.find((u) => u.isBaseUnit === 1);
// const baseUnitName = baseUom ? baseUom.measurementUnitName : ""

//   return (
//     <DialogModel
//       header={
//         <div className="flex items-center gap-2">
//           <RulerDimensionLine className="w-5 h-5 text-white" />
//           <span className="font-semibold text-lg text-white">
//             Select Unit - {selectedVariationProduct?.description || selectedProduct?.productName}
//           </span>
//         </div>
//       }
//       visible={visible}
//       onHide={onHide}
//       className="w-full max-w-4xl"
//     >
//       <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
//        <div className="w-full bg-slate-200 p-2">{selectedBatch?.formattedQty}</div>
       
//         {
     
        
//         uomList && uomList.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {uomList.map((uom, index) => (
//               <UOMCard
//                 key={uom.productUomId || index}
//                 uom={uom}
//                 baseUnitName={baseUnitName}
//                 onUomSelect={onUomSelect}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center p-8 text-slate-400">
//             <Layers className="w-10 h-10 mb-2 opacity-40" />
//             <p className="text-sm font-medium">No Unit of Measure (UOM) options found for this item.</p>
//           </div>
//         )}
//       </div>
//     </DialogModel>
//   );
// };

// export default UOMSelectionDialog;