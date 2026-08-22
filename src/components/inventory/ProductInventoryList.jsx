
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatUtcToLocal, getCurrency } from "../../utils/format";
import {
  deleteProduct,
  getBatchedItems,
  getProductExtraDetails,
  getProducts,
  getProductUomList,
} from "../../functions/register";
import { useToast } from "../useToast";
import {
  getDropdownMeasurementUnit,
  getDrpdownCategory,
  getStoresDrp,
} from "../../functions/dropdowns";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../messges/FormElementMessage";
import DaisyUIPaginator from "../DaisyUIPaginator";
import ConfirmDialog from "../dialog/ConfirmDialog";
import TriStateSelect from "../inputField/TriStateSelect";
import DialogModel from "../model/DialogModel";

import { FaPlus, FaBoxes, FaTags, FaLayerGroup, FaBarcode, FaInfoCircle, FaEye } from "react-icons/fa";
import ProductInventoryActionMenu from "./ProductInventoryActionMenu";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
import { Eye, Boxes } from "lucide-react";
import ReusableTable from "../ReusableTable";
import moment from "moment";

// const ProductDetails = ({ selectedProduct }) => {
//   const [extraDetails, setExtraDetails] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [uoms, setUoms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uomLoading, setUomLoading] = useState(false);

//   // 1. Primary Data Fetching Effect
//   useEffect(() => {
//     let isMounted = true;

//     const fetchAllDetails = async () => {
//       setLoading(true);
//       try {
//         if (!selectedProduct?.productId && !selectedProduct?.allProductId) return;

//         // Fetch Variations & Assembly
//         const extraRes = await getProductExtraDetails(selectedProduct.productId);
//         if (isMounted && extraRes?.data?.results) {
//           setExtraDetails(extraRes.data.results);
//         }

//         let fetchedBatches = [];
//         let initialBatch = null;

//         // Fetch Batches if Batch Tracked
//         if (selectedProduct?.isBatchTracked) {
//           const batchRes = await getBatchedItems(selectedProduct.allProductId, selectedProduct.storeId);
//           if (isMounted && batchRes?.data?.results?.[0]) {
//             fetchedBatches = batchRes.data.results[0] || [];
//             setBatches(fetchedBatches);

//             // Select initial active batch
//             if (fetchedBatches.length > 0) {
//               const defaultBatchId = selectedProduct?.stockBatchId;
//               initialBatch = fetchedBatches.find(b => b.stockBatchId === defaultBatchId) || fetchedBatches[0];
//               setSelectedBatch(initialBatch);
//             }
//           }
//         }

//         // Fetch Initial UOM Rates (If Not Batch Tracked)
//         if (selectedProduct?.isMultiUom && !selectedProduct?.isBatchTracked) {
//           const uomRes = await getProductUomList(selectedProduct.allProductId, selectedProduct.storeId, null);
//           if (isMounted && uomRes?.data?.results?.[0]) {
//             setUoms(uomRes.data.results[0]);
//           }
//         }

//       } catch (err) {
//         console.error("Error fetching product details phenomenon:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchAllDetails();

//     return () => {
//       isMounted = false;
//     };
//   }, [selectedProduct]);

//   // 2. Fetch UOM list dynamically when active Batch changes
//   useEffect(() => {
//     if (!selectedProduct?.isMultiUom || !selectedProduct?.isBatchTracked || !selectedBatch) return;

//     let isMounted = true;
//     const fetchBatchUoms = async () => {
//       setUomLoading(true);
//       try {
//         const uomRes = await getProductUomList(
//           selectedProduct.allProductId,
//           selectedProduct.storeId,
//           selectedBatch.stockBatchId
//         );
//         if (isMounted && uomRes?.data?.results?.[0]) {
//           setUoms(uomRes.data.results[0]);
//         }
//       } catch (err) {
//         console.error("Error fetching batch UOM details:", err);
//       } finally {
//         if (isMounted) setUomLoading(false);
//       }
//     };

//     fetchBatchUoms();

//     return () => {
//       isMounted = false;
//     };
//   }, [selectedBatch, selectedProduct]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-6 text-slate-500 text-sm gap-2">
//         <svg className="animate-spin h-4 w-4 text-sky-600" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//         </svg>
//         <span>Loading extra product details...</span>
//       </div>
//     );
//   }

//   const categories = selectedProduct?.categories ? JSON.parse(selectedProduct?.categories) : [];
//   const variations = Array.isArray(extraDetails?.[0]) ? extraDetails[0] : [];
//   const assemblyProducts = extraDetails?.assemblyProducts || selectedProduct?.assemblyProducts || [];

//   return (
//     <div className="p-4 space-y-4">
//       {/* Top Meta info */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-3.5 rounded-lg border border-slate-200 text-sm">
//         <div>
//           <span className="text-xs text-slate-500 block font-medium">Categories</span>
//           <div className="flex flex-wrap gap-1 mt-1">
//             {categories?.length > 0 ? (
//               categories.map((c) => (
//                 <span
//                   key={c.id}
//                   className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded border border-emerald-200"
//                 >
//                   {c.displayName}
//                 </span>
//               ))
//             ) : (
//               <span className="text-slate-400 text-xs">Uncategorized</span>
//             )}
//           </div>
//         </div>

//         <div>
//           <span className="text-xs text-slate-500 block font-medium">Created Date</span>
//           <span className="inline-block mt-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-200">
//             {selectedProduct.createdDate_utc ? formatUtcToLocal(selectedProduct.createdDate_utc) : "N/A"}
//           </span>
//         </div>

//         <div>
//           <span className="text-xs text-slate-500 block font-medium">Last Modified</span>
//           <span className="inline-block mt-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-200">
//             {selectedProduct.modifiedDate_utc ? formatUtcToLocal(selectedProduct.modifiedDate_utc) : "N/A"}
//           </span>
//         </div>
//       </div>

//       {/* Main Details Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
//         {/* Variations Card */}
//         <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
//           <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm border-b pb-2">
//             <FaBarcode className="text-blue-600" />
//             <span>Extra Details & Variations</span>
//           </div>
//           {variations.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs text-left text-slate-600">
//                 <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
//                   <tr>
//                     <th className="py-2 px-2">SKU</th>
//                     <th className="py-2 px-2 text-center">Barcode</th>
//                     <th className="py-2 px-2 text-right">Cost</th>
//                     <th className="py-2 px-2 text-right">Price</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {variations.map((v, idx) => {
//                     let parsedDetails = [];
//                     try {
//                       parsedDetails = v.variationDetails ? JSON.parse(v.variationDetails) : [];
//                     } catch (e) {
//                       parsedDetails = [];
//                     }

//                     return (
//                       <tr key={v.variationProductId || idx} className="hover:bg-slate-50">
//                         <td className="py-2 px-2">
//                           <div className="font-mono font-medium text-slate-800">{v.sku}</div>
//                           {parsedDetails.length > 0 && (
//                             <div className="flex flex-wrap gap-1 mt-0.5">
//                               {parsedDetails.map((det, dIdx) => (
//                                 <span
//                                   key={dIdx}
//                                   className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200"
//                                 >
//                                   {det.variationTypeName}: <strong>{det.variationValue}</strong>
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </td>
//                         <td className="py-2 px-2 text-center">
//                           {v.barcode ? (
//                             <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
//                               {v.barcode}
//                             </span>
//                           ) : (
//                             <span className="text-slate-300 italic text-[11px]">-</span>
//                           )}
//                         </td>
//                         <td className="py-2 px-2 text-right font-mono text-slate-600">
//                           {formatCurrency ? formatCurrency(v.unitCost || 0, false) : v.unitCost}
//                         </td>
//                         <td className="py-2 px-2 text-right font-mono font-semibold text-emerald-600">
//                           {formatCurrency ? formatCurrency(v.unitPrice || 0, false) : v.unitPrice}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-xs text-slate-400 py-2">No variation details found.</p>
//           )}
//         </div>

//         {/* Batches Table (If Batch Tracked) */}
//         {Boolean(selectedProduct.isBatchTracked) && (
//           <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
//             <div className="flex items-center justify-between mb-3 border-b pb-2">
//               <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
//                 <FaBoxes className="text-sky-600" />
//                 <span>Available Batches</span>
//               </div>
//               {selectedProduct.isMultiUom ? (
//                 <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium border border-amber-200">
//                   Click batch to view UOM rates
//                 </span>
//               ):null}
//             </div>

//             {batches.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-xs text-left text-slate-600">
//                   <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
//                     <tr>
//                       <th className="py-2 px-2">Batch No</th>
//                        {/* <th className="py-2 px-2">Barcode</th> */}
//                       <th className="py-2 px-2 text-right">Qty</th>
//                       <th className="py-2 px-2 text-right">Unit Cost</th>
//                       {!selectedProduct.isMultiUom && (
//                         <>
//                           <th className="py-2 px-2 text-right">Unit Price</th>
//                         </>
//                       )}


                      
//    {selectedProduct.isExpiringProduct ? (
//                         <>
//                     <th className="py-2 px-2 text-right">Expiry Date</th>
//                         </>
//                       ):null}


                
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {batches.map((batch, idx) => {
//                       const isSelected = selectedBatch?.stockBatchId === batch.stockBatchId;
//                       return (
//                         <tr 
//                           key={batch.stockBatchId || idx} 
//                           onClick={() => selectedProduct.isMultiUom && setSelectedBatch(batch)}
//                           className={`hover:bg-slate-50 transition-colors ${
//                             selectedProduct.isMultiUom ? "cursor-pointer" : ""
//                           } ${isSelected && selectedProduct.isMultiUom ? "bg-sky-50/80 font-medium" : ""}`}
//                         >
//                           <td className="py-2 px-2 font-mono text-sky-700">
//                             <div className="flex items-center gap-1.5">
//                               {isSelected && selectedProduct.isMultiUom ? (
//                                 <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
//                               ):""}
//                               <span>{batch.batchNo}</span>
//                               {batch.batchQueueNumber && (
//                                 <span className="text-[10px] text-slate-400">#{batch.batchQueueNumber}</span>
//                               )}
//                             </div>
//                           </td>
//                                {/* <td className="py-2 px-2">
//                     {batch.barcode ? (
//                       <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
//                         {batch.barcode}
//                       </span>
//                     ) : (
//                       <span className="text-slate-300 italic text-[11px]">-</span>
//                     )}
//                   </td> */}

//                           <td className="py-2 px-2 text-right">
//                             <div className="font-semibold font-mono text-slate-800">
//                               {batch.formattedQty || `${batch.qty} ${batch.measurementUnitName || ''}`}
//                             </div>
//                           </td>
//                             <td className="py-2 px-2 text-right font-mono text-slate-600">
//                                 {formatCurrency ? formatCurrency(batch.unitCost || 0, false) : batch.unitCost}
//                               </td>
//                           {!selectedProduct.isMultiUom && (
//                             <>
                            
//                               <td className="py-2 px-2 text-right font-mono font-semibold text-emerald-600">
//                                 {formatCurrency ? formatCurrency(batch.unitPrice || 0, false) : batch.unitPrice}
//                               </td>
//                             </>
//                           )}
// {selectedProduct.isExpiringProduct ? (
//   <td className="py-2 px-2 text-right text-slate-500">
//     {batch.expDate ? (() => {
//       // Calculate day difference between expiration date and today over the course of execution
//       const today = moment().startOf('day');
//       const expDate = moment(batch.expDate).startOf('day');
//       const diffInDays = expDate.diff(today, 'days');

//       // Expired: Today or past (Danger)
//       if (diffInDays <= 0) {
//         return (
//           <span className="text-xs font-semibold text-rose-600">
//             {formatUtcToLocal(batch.expDate)} (Expired)
//           </span>
//         );
//       }

//       // Warning: Expiring tomorrow / 1 day before
//       if (diffInDays === 1) {
//         return (
//           <span className="text-xs font-semibold text-amber-600">
//             {formatUtcToLocal(batch.expDate)} (Expiring Soon)
//           </span>
//         );
//       }

//       // Active & Healthy Date (Emerald)
//       return (
//         <span className="text-xs font-medium text-emerald-600">
//           {formatUtcToLocal(batch.expDate)}
//         </span>
//       );
//     })() : "N/A"}
//   </td>
// ) : null}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-xs text-slate-400 py-2">No active batches available.</p>
//             )}
//           </div>
//         )}

//   {/* Multi-UOM Configuration */}
// {Boolean(selectedProduct.isMultiUom) && (
//   <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
//     <div className="flex items-center justify-between mb-3 border-b pb-2">
//       <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
//         <FaTags className="text-amber-600" />
//         <span>Multi-UOM Configuration</span>
//       </div>
//       {selectedBatch && selectedProduct.isBatchTracked && (
//         <span className="text-[11px] font-mono font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
//           Batch: {selectedBatch.batchNo}
//         </span>
//       )}
//     </div>

//     {selectedProduct.isBatchTracked && !selectedBatch ? (
//       <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
//         <FaBoxes className="mx-auto text-slate-300 text-2xl mb-2" />
//         <p className="text-xs font-medium text-slate-600">Select a Batch</p>
//         <p className="text-[11px] text-slate-400 mt-0.5">
//           Click on any batch from the Available Batches table to view its specific UOM rates and barcodes.
//         </p>
//       </div>
//     ) : uomLoading ? (
//       <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
//         Fetching UOM rates...
//       </div>
//     ) : uoms.length > 0 ? (
//       <div className="overflow-x-auto">
//         <table className="w-full text-xs text-left text-slate-600">
//           <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
//             <tr>
//               <th className="py-2 px-2">UOM</th>
//               <th className="py-2 px-2 text-center">Barcode</th>
//               <th className="py-2 px-2 text-center">Conv. Ratio</th>
//               <th className="py-2 px-2 text-center">Unit Type</th>
//               <th className="py-2 px-2 text-right">Selling Price</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {uoms.map((uom, idx) => {
//               // Find the base unit record
//               const baseUom = uoms.find((u) => u.isBaseUnit) || uoms[0];
//               const prevUom = idx > 0 ? uoms[idx - 1] : null;

//               // Compute calculated ratio dynamically relative to the previous tier
//               let calculatedQty = uom.conversionQty;
//               let relativeUnitName = "";

//               if (uom.isBaseUnit) {
//                 calculatedQty = 1;
//                 relativeUnitName = uom.measurementUnitName;
//               } else if (prevUom) {
//                 const prevQty = prevUom.conversionQty || 1;
//                 calculatedQty = uom.conversionQty / prevQty;
//                 relativeUnitName = prevUom.measurementUnitName;
//               }

//               return (
//                 <tr key={uom.productUomId || idx} className="hover:bg-slate-50">
//                   {/* UOM Name & Defaults */}
//                   <td className="py-2 px-2">
//                     <div className="flex items-center gap-1.5 flex-wrap">
//                       <span className="font-medium text-slate-800">{uom.measurementUnitName}</span>
//                       {Boolean(uom.isBaseUnit) && (
//                         <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.2 rounded border border-blue-200 font-semibold">
//                           Base
//                         </span>
//                       )}
//                       {Boolean(uom.isDefaultSalesUom) && (
//                         <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200 font-semibold">
//                           Sales
//                         </span>
//                       )}
//                       {Boolean(uom.isDefaultPurchaseUom) && (
//                         <span className="text-[9px] bg-purple-50 text-purple-700 px-1 py-0.2 rounded border border-purple-200 font-semibold">
//                           Purchase
//                         </span>
//                       )}
//                       {Boolean(uom.isDefaultStockUom) && (
//                         <span className="text-[9px] bg-amber-50 text-amber-700 px-1 py-0.2 rounded border border-amber-200 font-semibold">
//                           Stock
//                         </span>
//                       )}
//                     </div>
//                   </td>

//                   {/* Barcode */}
//                   <td className="py-2 px-2">
//                     {uom.barcode ? (
//                       <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
//                         {uom.barcode}
//                       </span>
//                     ) : (
//                       <span className="text-slate-300 italic text-[11px]">-</span>
//                     )}
//                   </td>

//                {/* Conv. Ratio */}
// <td className="py-2 px-2 text-center font-mono text-slate-600 font-medium">
//   {Boolean(uom.isBaseUnit) ? (
//     <span className="text-sm">1 {uom.measurementUnitName}</span>
//   ) : (
//     <span className="text-sm">
//       {uom.relativeConversionQty} × {uom.relativeMeasurementUnitName}
//     </span>
//   )}
// </td>

//                   {/* Whole Unit / Decimal Allowed */}
//                   <td className="py-2 px-2 text-center">
//                     {Boolean(uom.isDecimalAllowed) ? (
//                       <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
//                         Decimal
//                       </span>
//                     ) : (
//                       <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
//                         Whole
//                       </span>
//                     )}
//                   </td>

//                   {/* Selling Price */}
//                   <td className="py-2 px-2 text-right font-mono font-semibold text-emerald-600">
//                     {formatCurrency ? formatCurrency(uom.sellingPrice || 0, false) : uom.sellingPrice}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     ) : (
//       <p className="text-xs text-slate-400 py-2">No UOM configurations found for this context.</p>
//     )}
//   </div>
// )}

//         {/* Assembly Components Card */}
//         {Boolean(selectedProduct.isAssemblyProduct) && (
//           <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
//             <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm border-b pb-2">
//               <FaLayerGroup className="text-purple-600" />
//               <span>Assembly Components</span>
//             </div>
//             {assemblyProducts.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-xs text-left text-slate-600">
//                   <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
//                     <tr>
//                       <th className="py-2 px-2">Item</th>
//                       <th className="py-2 px-2 text-center">Qty</th>
//                       <th className="py-2 px-2">SKU</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {assemblyProducts.map((item, idx) => (
//                       <tr key={item.productId || idx} className="hover:bg-slate-50">
//                         <td className="py-2 px-2 font-medium text-slate-800">{item.productName}</td>
//                         <td className="py-2 px-2 text-center font-mono">
//                           {item.qty} {item.measurementUnitName}
//                         </td>
//                         <td className="py-2 px-2 font-mono text-slate-500">{item.sku || "-"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-xs text-slate-400 py-2">No assembly products configured.</p>
//             )}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

const ProductDetails = ({ selectedProduct }) => {
  const [extraDetails, setExtraDetails] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);
  const [uomLoading, setUomLoading] = useState(false);

  // 1. Initial Fetch for Variations & Assembly
  useEffect(() => {
    let isMounted = true;

    const fetchExtraDetails = async () => {
      setLoading(true);
      try {
        if (!selectedProduct?.productId) return;

        const extraRes = await getProductExtraDetails(selectedProduct.productId);
        if (isMounted && extraRes?.data?.results) {
          const results = extraRes.data.results;
          setExtraDetails(results);

          // Default select the first variation if available
          const variationList = Array.isArray(results?.[0]) ? results[0] : [];
          if (variationList.length > 0) {
            setSelectedVariation(variationList[0]);
          } else {
            setSelectedVariation(null);
          }
        }
      } catch (err) {
        console.error("Error fetching product extra details phenomenon:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExtraDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedProduct]);

  // 2. Fetch Batches dynamically when selectedVariation or selectedProduct changes
  useEffect(() => {
    if (!selectedProduct?.isBatchTracked) return;

    let isMounted = true;
    const fetchBatches = async () => {
      setBatchLoading(true);
      try {
        // Use variation allProductId if available, fallback to product allProductId
        const activeAllProductId = selectedVariation?.allProductId;
        if (!activeAllProductId) return;

        const batchRes = await getBatchedItems(activeAllProductId, selectedProduct.storeId);
        if (isMounted && batchRes?.data?.results?.[0]) {
          const fetchedBatches = batchRes.data.results[0] || [];
          setBatches(fetchedBatches);

          // Select initial active batch
          if (fetchedBatches.length > 0) {
            const defaultBatchId = selectedProduct?.stockBatchId;
            const initialBatch = fetchedBatches.find(b => b.stockBatchId === defaultBatchId) || fetchedBatches[0];
            setSelectedBatch(initialBatch);
          } else {
            setSelectedBatch(null);
          }
        } else if (isMounted) {
          setBatches([]);
          setSelectedBatch(null);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
      } finally {
        if (isMounted) setBatchLoading(false);
      }
    };

    fetchBatches();

    return () => {
      isMounted = false;
    };
  }, [selectedVariation, selectedProduct]);

  // 3. Fetch Non-Batch UOM Rates
  useEffect(() => {
    if (!selectedProduct?.isMultiUom || selectedProduct?.isBatchTracked) return;

    let isMounted = true;
    const fetchNonBatchUoms = async () => {
      try {
        const activeAllProductId = selectedVariation?.allProductId || selectedProduct?.allProductId;
        const uomRes = await getProductUomList(activeAllProductId, selectedProduct.storeId, null);
        if (isMounted && uomRes?.data?.results?.[0]) {
          setUoms(uomRes.data.results[0]);
        }
      } catch (err) {
        console.error("Error fetching UOM details:", err);
      }
    };

    fetchNonBatchUoms();

    return () => {
      isMounted = false;
    };
  }, [selectedVariation, selectedProduct]);

  // 4. Fetch UOM list dynamically when active Batch changes
  useEffect(() => {
    if (!selectedProduct?.isMultiUom || !selectedProduct?.isBatchTracked || !selectedBatch) return;

    let isMounted = true;
    const fetchBatchUoms = async () => {
      setUomLoading(true);
      try {
        const activeAllProductId = selectedVariation?.allProductId || selectedProduct?.allProductId;
        const uomRes = await getProductUomList(
          activeAllProductId,
          selectedProduct.storeId,
          selectedBatch.stockBatchId
        );
        if (isMounted && uomRes?.data?.results?.[0]) {
          setUoms(uomRes.data.results[0]);
        }
      } catch (err) {
        console.error("Error fetching batch UOM details:", err);
      } finally {
        if (isMounted) setUomLoading(false);
      }
    };

    fetchBatchUoms();

    return () => {
      isMounted = false;
    };
  }, [selectedBatch, selectedVariation, selectedProduct]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-slate-500 text-sm gap-2">
        <svg className="animate-spin h-4 w-4 text-sky-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading extra product details...</span>
      </div>
    );
  }

  const categories = selectedProduct?.categories ? JSON.parse(selectedProduct?.categories) : [];
  const variations = Array.isArray(extraDetails?.[0]) ? extraDetails[0] : [];
  const assemblyProducts = extraDetails?.assemblyProducts || selectedProduct?.assemblyProducts || [];

  return (
    <div className="p-4 space-y-4">
      {/* Top Meta info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-3.5 rounded-lg border border-slate-200 text-sm">
        <div>
          <span className="text-xs text-slate-500 block font-medium">Categories</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {categories?.length > 0 ? (
              categories.map((c) => (
                <span
                  key={c.id}
                  className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded border border-emerald-200"
                >
                  {c.displayName}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs">Uncategorized</span>
            )}
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-500 block font-medium">Created Date</span>
          <span className="inline-block mt-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-200">
            {selectedProduct.createdDate_utc ? formatUtcToLocal(selectedProduct.createdDate_utc) : "N/A"}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-500 block font-medium">Last Modified</span>
          <span className="inline-block mt-1 bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-200">
            {selectedProduct.modifiedDate_utc ? formatUtcToLocal(selectedProduct.modifiedDate_utc) : "N/A"}
          </span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Variations Card */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <FaBarcode className="text-blue-600" />
              <span>Extra Details</span>
            </div>
            {variations.length > 1 && selectedProduct.isBatchTracked && (
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-200">
                Click row to view batches
              </span>
            )}
          </div>

{variations.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="w-full text-xs text-left text-slate-600">
      <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
        <tr>
          <th className="py-2 px-2">SKU / Variation</th>
          <th className="py-2 px-2 text-center">Barcode</th>

          {/* Hide Cost header if batchTracked */}
          {!selectedProduct?.isBatchTracked && (
            <th className="py-2 px-2 text-right">Cost</th>
          )}

          {/* Hide Price header if batchTracked OR multiUom */}
          {!selectedProduct?.isBatchTracked && !selectedProduct?.isMultiUom && (
            <th className="py-2 px-2 text-right">Price</th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {variations.map((v, idx) => {
          let parsedDetails = [];
          try {
            parsedDetails = Array.isArray(v.variationDetails)
              ? v.variationDetails
              : v.variationDetails
              ? JSON.parse(v.variationDetails)
              : [];
          } catch (e) {
            parsedDetails = [];
          }

          const isVarSelected =
            selectedVariation?.variationProductId === v.variationProductId ||
            (!selectedVariation && idx === 0);

          return (
            <tr
              key={v.variationProductId || idx}
              onClick={() => setSelectedVariation(v)}
              className={`transition-colors cursor-pointer ${
                isVarSelected
                  ? "bg-blue-50/80 font-medium"
                  : "hover:bg-slate-50"
              }`}
            >
              {/* SKU & Variation Badges */}
              <td className="py-2.5 px-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    {isVarSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                    )}
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {v.sku}
                    </span>
                  </div>

                  {/* Variation Pills */}
                  {parsedDetails.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {parsedDetails.map((det, dIdx) => (
                        <span
                          key={dIdx}
                          className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200"
                        >
                          {det.variationTypeName && (
                            <span className="text-slate-400 text-xs font-normal">
                              {det.variationTypeName}:
                            </span>
                          )}
                          <span className="font-semibold text-xs text-slate-800">
                            {det.variationValue}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </td>

              {/* Barcode */}
              <td className="py-2.5 px-2 text-center">
                {v.barcode ? (
                  <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {v.barcode}
                  </span>
                ) : (
                  <span className="text-slate-300 italic text-[11px]">-</span>
                )}
              </td>

              {/* Cost Cell */}
              {!selectedProduct?.isBatchTracked && (
                <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                  {v.unitCost != null
                    ? formatCurrency
                      ? formatCurrency(v.unitCost, false)
                      : v.unitCost
                    : "-"}
                </td>
              )}

              {/* Price Cell */}
              {!selectedProduct?.isBatchTracked && !selectedProduct?.isMultiUom && (
                <td className="py-2.5 px-2 text-right font-mono font-semibold text-emerald-600">
                  {v.unitPrice != null
                    ? formatCurrency
                      ? formatCurrency(v.unitPrice, false)
                      : v.unitPrice
                    : "-"}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-xs text-slate-400 py-2">
    No variation details found.
  </p>
)}
        </div>

        {/* Batches Table (If Batch Tracked) */}
        {Boolean(selectedProduct.isBatchTracked) && (
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <FaBoxes className="text-sky-600" />
                <span>Available Batches</span>
              </div>
              {selectedProduct.isMultiUom ? (
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium border border-amber-200">
                  Click batch to view UOM rates
                </span>
              ) : null}
            </div>

            {batchLoading ? (
              <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
                Fetching batches for selected item...
              </div>
            ) : batches.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
                    <tr>
                      <th className="py-2 px-2">Batch No</th>
                      <th className="py-2 px-2 text-right">Qty</th>
                      <th className="py-2 px-2 text-right">Unit Cost</th>
                      {!selectedProduct.isMultiUom && (
                        <th className="py-2 px-2 text-right">Unit Price</th>
                      )}
                      {selectedProduct.isExpiringProduct ? (
                        <th className="py-2 px-2 text-right">Expiry Date</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.map((batch, idx) => {
                      const isSelected = selectedBatch?.stockBatchId === batch.stockBatchId;
                      return (
                        <tr 
                          key={batch.stockBatchId || idx} 
                          onClick={() => selectedProduct.isMultiUom && setSelectedBatch(batch)}
                          className={`hover:bg-slate-50 transition-colors ${
                            selectedProduct.isMultiUom ? "cursor-pointer" : ""
                          } ${isSelected && selectedProduct.isMultiUom ? "bg-sky-50/80 font-medium" : ""}`}
                        >
                          <td className="py-2 px-2 font-mono text-sky-700">
                            <div className="flex items-center gap-1.5">
                              {isSelected && selectedProduct.isMultiUom ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
                              ) : ""}
                              <span>{batch.batchNo}</span>
                              {batch.batchQueueNumber && (
                                <span className="text-[10px] text-slate-400">#{batch.batchQueueNumber}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-right">
                            <div className="font-semibold font-mono text-slate-800">
                              {batch.formattedQty || `${batch.qty} ${batch.measurementUnitName || ''}`}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-slate-600">
                            {formatCurrency ? formatCurrency(batch.unitCost || 0, false) : batch.unitCost}
                          </td>
                          {!selectedProduct.isMultiUom && (
                            <td className="py-2 px-2 text-right font-mono font-semibold text-emerald-600">
                              {formatCurrency ? formatCurrency(batch.unitPrice || 0, false) : batch.unitPrice}
                            </td>
                          )}
                          {selectedProduct.isExpiringProduct ? (
                            <td className="py-2 px-2 text-right text-slate-500">
                              {batch.expDate ? (() => {
                                const today = moment().startOf('day');
                                const expDate = moment(batch.expDate).startOf('day');
                                const diffInDays = expDate.diff(today, 'days');

                                if (diffInDays <= 0) {
                                  return (
                                    <span className="text-xs font-semibold text-rose-600">
                                      {formatUtcToLocal(batch.expDate)} (Expired)
                                    </span>
                                  );
                                }

                                if (diffInDays === 1) {
                                  return (
                                    <span className="text-xs font-semibold text-amber-600">
                                      {formatUtcToLocal(batch.expDate)} (Expiring Soon)
                                    </span>
                                  );
                                }

                                return (
                                  <span className="text-xs font-medium text-emerald-600">
                                    {formatUtcToLocal(batch.expDate)}
                                  </span>
                                );
                              })() : "N/A"}
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">No active batches available for this variation.</p>
            )}
          </div>
        )}

        {/* Multi-UOM Configuration */}
     {Boolean(selectedProduct.isMultiUom) && (
  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
    <div className="flex items-center justify-between mb-3 border-b pb-2">
      <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
        <FaTags className="text-amber-600" />
        <span>Multi-UOM Configuration</span>
      </div>
      {selectedBatch && selectedProduct.isBatchTracked && (
        <span className="text-[11px] font-mono font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
          Batch: {selectedBatch.batchNo}
        </span>
      )}
    </div>

    {selectedProduct.isBatchTracked && !selectedBatch ? (
      <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
        <FaBoxes className="mx-auto text-slate-300 text-2xl mb-2" />
        <p className="text-xs font-medium text-slate-600">Select a Batch</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Click on any batch from the Available Batches table to view its specific UOM rates and barcodes.
        </p>
      </div>
    ) : uomLoading ? (
      <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
        Fetching UOM rates...
      </div>
    ) : uoms.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
            <tr>
              <th className="py-2 px-2">UOM</th>
              <th className="py-2 px-2 text-center">Barcode</th>
              <th className="py-2 px-2 text-center">Conv. Ratio</th>
              <th className="py-2 px-2 text-center">Unit Type</th>
              <th className="py-2 px-2 text-right">Selling Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {uoms.map((uom, idx) => {
              return (
                <tr key={uom.productUomId || idx} className="hover:bg-slate-50">
                  {/* UOM Name & Defaults with Tooltips */}
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-800">
                        {uom.measurementUnitName}
                      </span>

                      {/* Base Unit Badge */}
                      {Boolean(uom.isBaseUnit) && (
                        <span
                          title="Base Unit: The primary unit used as the lowest common denominator for inventory calculations."
                          className="cursor-help text-[9px] bg-blue-50 text-blue-600 px-1 py-0.2 rounded border border-blue-200 font-semibold"
                        >
                          Base
                        </span>
                      )}

                      {/* Sales Default Badge */}
                      {Boolean(uom.isDefaultSalesUom) && (
                        <span
                          title="Default Sales Unit: Automatically pre-selected when creating invoices or sales orders."
                          className="cursor-help text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200 font-semibold"
                        >
                          Sales
                        </span>
                      )}

                      {/* Purchase Default Badge */}
                      {Boolean(uom.isDefaultPurchaseUom) && (
                        <span
                          title="Default Purchase Unit: Automatically pre-selected when creating purchase orders or bills."
                          className="cursor-help text-[9px] bg-purple-50 text-purple-700 px-1 py-0.2 rounded border border-purple-200 font-semibold"
                        >
                          Purchase
                        </span>
                      )}

                      {/* Stock Default Badge */}
                      {Boolean(uom.isDefaultStockUom) && (
                        <span
                          title="Default Stock Unit: The primary unit used for displaying stock levels and inventory counts."
                          className="cursor-help text-[9px] bg-amber-50 text-amber-700 px-1 py-0.2 rounded border border-amber-200 font-semibold"
                        >
                          Stock
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Barcode */}
                  <td className="py-2 px-2 text-center">
                    {uom.barcode ? (
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {uom.barcode}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic text-[11px]">-</span>
                    )}
                  </td>

                  {/* Conv. Ratio */}
                  <td className="py-2 px-2 text-center font-mono text-slate-600 font-medium">
                    {Boolean(uom.isBaseUnit) ? (
                      <span className="text-sm">1 {uom.measurementUnitName}</span>
                    ) : (
                      <span className="text-sm">
                        {uom.relativeConversionQty} × {uom.relativeMeasurementUnitName}
                      </span>
                    )}
                  </td>

                  {/* Whole Unit / Decimal Allowed */}
                  <td className="py-2 px-2 text-center">
                    {Boolean(uom.isDecimalAllowed) ? (
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        Decimal
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                        Whole
                      </span>
                    )}
                  </td>

                  {/* Selling Price */}
                  <td className="py-2 px-2 text-right font-mono font-semibold text-emerald-600">
                    {formatCurrency ? formatCurrency(uom.sellingPrice || 0, false) : uom.sellingPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-xs text-slate-400 py-2">
        No UOM configurations found for this context.
      </p>
    )}
  </div>
)}

        {/* Assembly Components Card */}
        {Boolean(selectedProduct.isAssemblyProduct) && (
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm col-span-1">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm border-b pb-2">
              <FaLayerGroup className="text-purple-600" />
              <span>Assembly Components</span>
            </div>
            {assemblyProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b">
                    <tr>
                      <th className="py-2 px-2">Item</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2">SKU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assemblyProducts.map((item, idx) => (
                      <tr key={item.productId || idx} className="hover:bg-slate-50">
                        <td className="py-2 px-2 font-medium text-slate-800">{item.productName}</td>
                        <td className="py-2 px-2 text-center font-mono">
                          {item.qty} {item.measurementUnitName}
                        </td>
                        <td className="py-2 px-2 font-mono text-slate-500">{item.sku || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">No assembly products configured.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default function ProductInventoryList({}) {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] = useState(-1);
  const [storesOptions, setStoresOptions] = useState([]);

  const selectedStore = JSON.parse(localStorage.getItem("selectedStore") || "{}");
  const [selectedStoreId, setSelectedStoreId] = useState(selectedStore.storeId || -1);

  const searchInputRef = useRef(null);

  const [isSingleProductChecked, setIsSingleProductChecked] = useState(false);
  const [isVariationProductChecked, setIsVariationProductChecked] = useState(false);
  const [isComboProductChecked, setIsComboProductChecked] = useState(false);
  const [isStockTrackedFilter, setIsStockTrackedFilter] = useState(null);
  const [isExpiringProductFilter, setIsExpiringProductFilter] = useState(null);
  const [isBatchTrackedFilter, setIsBatchTrackedFilter] = useState(null);
  const [isProductItemFilter, setIsProductItemFilter] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);

  const [openMenuId, setOpenMenuId] = useState(null);

  // Modal State for Product Details
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  const handleOpenProductDetails = (product) => {
    setSelectedProductDetails(product);
    setShowDetailsDialog(true);
  };

  const handleCloseProductDetails = () => {
    setShowDetailsDialog(false);
    setSelectedProductDetails(null);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleHistory = (item) => {
    navigate(
      `/inventory/transactionHistory?inventoryId=${item.inventoryId}&prodN=${item.productName}&qty=${item.stockQty}&measU=${item.measurementUnitName}&sku=${item.sku}&prodNo=${item.productNo}`
    );
  };

  const handleEdit = (item) => {
    navigate(`/products/edit?saveType=update&id=${item.productId}`);
  };

  const handleManage = (item) => {
    navigate(`/inventory/stockAdjustment?inventoryId=${item.inventoryId}`);
  };

  const handleDelete = async (item) => {
    const result = await deleteProduct(item.allProductId, false);
    const { outputMessage } = result.data.outputValues;
    confirmDelete(outputMessage, item.allProductId);
  };

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
  };

  const [selectedFilterBy, setSelectedFilterBy] = useState({
    label: "Filter by",
    value: 7,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue, setSearchValue] = useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const loadProducts = async () => {
    try {
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const productTypeIds = [];
      if (isSingleProductChecked) productTypeIds.push(1);
      if (isVariationProductChecked) productTypeIds.push(2);
      if (isComboProductChecked) productTypeIds.push(3);

      const filteredData = {
        productId: null,
        sku: selectedFilterBy.value === 6 ? searchValue.value : null,
        productNo: selectedFilterBy.value === 1 ? searchValue.value : null,
        productName: selectedFilterBy.value === 2 ? searchValue.value : null,
        productDescription: selectedFilterBy.value === 7 ? searchValue.value : null,
        barcode: selectedFilterBy.value === 3 ? searchValue.value : null,
        categoryId: selectedCategoryId,
        measurementUnitId: selectedMeasurementUnitId,
        storeId: selectedStoreId === -1 ? null : selectedStoreId,
        productTypeIds: productTypeIds.length > 0 ? productTypeIds : null,
        isProductItem: isProductItemFilter,
        isStockTracked: isStockTrackedFilter,
        isExpiringProduct: isExpiringProductFilter,
        isBatchTracked: isBatchTrackedFilter,
        searchByKeyword: false,
        uomType: "PURCHASE",
        skip: skip,
        limit: limit,
      };

      const _result = await getProducts(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      setProducts(_result.data.results[0] || []);
      setIsTableDataLoading(false);
    } catch (err) {
      setIsTableDataLoading(false);
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [
    selectedStoreId,
    selectedCategoryId,
    selectedMeasurementUnitId,
    isSingleProductChecked,
    isVariationProductChecked,
    isComboProductChecked,
    isStockTrackedFilter,
    isExpiringProductFilter,
    isBatchTrackedFilter,
    isProductItemFilter,
    currentPage,
    rowsPerPage,
  ]);

  useEffect(() => {
    if ([1, 2, 3, 6, 7].includes(selectedFilterBy.value)) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [selectedFilterBy.value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loadProducts();
    }
  };

  useEffect(() => {
    if ([1, 2, 3].includes(selectedFilterBy.value)) {
      setSelectedCategoryId(-1);
      setSelectedMeasurementUnitId(-1);
    } else {
      setSearchValue({ ...searchValue, value: "" });
    }
  }, [selectedFilterBy.value]);

  const [filterByOptions] = useState([
    { id: 2, displayName: "Product Name" },
    { id: 7, displayName: "Product Description" },
    { id: 3, displayName: "Barcode" },
    { id: 4, displayName: "Category" },
    { id: 5, displayName: "Measurement Unit" },
    { id: 6, displayName: "SKU" },
  ]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);

  useEffect(() => {
    loadDrpStores();
    loadDrpCategory();
    loadDrpMeasurementUnit();
  }, []);

  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions([...objArr.data.results[0]]);
  };

  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions([{ id: -1, displayName: "All" }, ...objArr.data.results[0]]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions([{ id: -1, displayName: "All" }, ...objArr.data.results[0]]);
  };

  const handleInputChange = (setState, state, value) => {
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const [showDialog, setShowDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const confirmDelete = (outputMessage, productId) => {
    setProductIdToDelete(productId);
    setShowDialog(true);
  };

  const deleteAcceptHandler = async (allProductId) => {
    try {
      setProductIdToDelete("");
      const result = await deleteProduct(allProductId, true);
      const { data } = result;

      if (data.error) {
        showToast("danger", "Exception", data.error.message);
        return;
      }

      const { outputMessage, responseStatus } = result.data.outputValues;
      if (responseStatus === "failed") {
        showToast("danger", "Exception", outputMessage);
      }

      setProducts(products.filter((p) => p.allProductId !== allProductId));
      setTotalRecords(totalRecords - 1);
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleConfirm = () => {
    deleteAcceptHandler(productIdToDelete);
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setProductIdToDelete("");
  };


  // Define table columns configuration
  const productColumns = [
    {
      header: "Product Information",
      key: "productInformation",
      render: (item) => {
        const isPhysicalProduct = item.isProductItem === 1;
        return (
          <>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {item.sku || "NO-SKU"}
              </span>
              {!isPhysicalProduct && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Service / Non-Product
                </span>
              )}
              {item.isAssemblyProduct === 1 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Assembly
                </span>
              )}
              {item.isMultiUom === 1 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Multi-UOM
                </span>
              )}
              {item.barcodeSource === "UOM" && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  UOM Scan
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-gray-900 mt-1 line-clamp-1">
              {item.productDescription || item.productName}
            </div>
          </>
        );
      },
    },
    {
      header: "Stock Qty",
      key: "stockQty",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (item) => {
        const isPhysicalProduct = item.isProductItem === 1;
        const stockVal = Number(item.stockQty ?? 0);
        const reorderVal = item.reorderLevel ? Number(item.reorderLevel) : null;
        const isOutOfStock = item.isStockTracked && stockVal <= 0;
        const isReorderWarning = item.isStockTracked && reorderVal !== null && stockVal <= reorderVal;

        const getStockBadgeStyle = () => {
          if (isOutOfStock) return "bg-rose-100 text-rose-700 border-rose-300 font-bold animate-pulse";
          if (isReorderWarning) return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        };

        if (item.isStockTracked) {
          return (
            <span
              className={`text-xs font-mono px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${getStockBadgeStyle()}`}
              title={
                isOutOfStock
                  ? "Out of stock!"
                  : isReorderWarning
                  ? "Stock is at or below reorder level!"
                  : "Stock healthy"
              }
            >
              {item.formattedQty}
            </span>
          );
        }

        return (
          <span className="text-xs font-medium text-gray-400 italic">
            {!isPhysicalProduct ? "N/A (Service)" : "Non-Tracked"}
          </span>
        );
      },
    },
    {
      header: "Reorder Level",
      key: "reorderLevel",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (item) => {
        const stockVal = Number(item.stockQty ?? 0);
        const reorderVal = item.reorderLevel ? Number(item.reorderLevel) : null;
        const isReorderWarning = item.isStockTracked && reorderVal !== null && stockVal <= reorderVal;

        if (reorderVal !== null) {
          return (
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                isReorderWarning
                  ? "bg-amber-50 text-amber-800 border-amber-300 font-bold"
                  : "bg-slate-50 text-slate-600 border-slate-200 font-medium"
              }`}
              title={isReorderWarning ? "Stock is at or below reorder level!" : "Reorder Level"}
            >
              {isReorderWarning && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
              {reorderVal.toFixed(2)}
            </span>
          );
        }

        return <span className="text-xs text-slate-300 italic">-</span>;
      },
    },
    {
      header: "Cost Price",
      key: "unitCost",
      headerClass: "text-right",
      cellClass: "text-right font-mono text-slate-700",
      render: (item) => formatCurrency(item.unitCost, false),
    },
    {
      header: `Unit Price (${getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})`,
      key: "unitPrice",
      headerClass: "text-right",
      cellClass: "text-right font-mono font-semibold text-sm text-sky-600",
      render: (item) => (
        <>
          {formatCurrency(item.unitPrice, false)}
          {item.measurementUnitName && (
            <span className="text-xs font-normal text-gray-500 ml-1">
              / {item.measurementUnitName}
            </span>
          )}
        </>
      ),
    },
    {
      header: "Tax (%)",
      key: "taxPerc",
      headerClass: "text-center",
      cellClass: "text-center text-slate-600 font-mono",
      render: (item) => (item.taxPerc ? `${item.taxPerc}%` : "0%"),
    },
    {
      header: "View",
      key: "viewAction",
      headerClass: "w-10 text-center",
      cellClass: "text-center",
      render: (item) => (
        <button
          onClick={() => handleOpenProductDetails(item)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-200/60 transition"
          title="View product details"
        >
          <Eye className="w-5 h-5 text-sky-600" />
        </button>
      ),
    },
  ];


  return (
    <div className="px-10 py-4">
      {showDialog && (
        <ConfirmDialog
          isVisible={true}
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Confirm Delete"
          severity="danger"
        />
      )}

      {/* Product Details Modal Dialog */}
      {showDetailsDialog && selectedProductDetails && (
        <DialogModel
          header={`Product Details: ${selectedProductDetails.productDescription || selectedProductDetails.productName}`}
          visible={showDetailsDialog}
          onHide={handleCloseProductDetails}
        >
          <ProductDetails selectedProduct={selectedProductDetails} />
        </DialogModel>
      )}

         <div className="px-6  flex items-center justify-between">
         <div className="flex items-center gap-2.5">
  {/* Icon with styled background badge */}
  <div className="p-2 text-gray-600  flex items-center justify-center">
    <Boxes className="w-7 h-7" />
  </div>
        <h2 className="text-xl font-bold text-gray-600 tracking-tight">Product Inventory</h2>
     </div>

        <button
                onClick={() => navigate("/products/add")}
                className="flex text-sm items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold 
                rounded-lg md:rounded-xl shadow-md hover:bg-emerald-700 transition ml-auto"
              >
                <FaPlus className="w-4 h-4" />
                <span>Create New Product</span>
              </button>
     </div>
      

      {/* Filter Section */}
      {/* <div className="flex flex-col md:flex-row justify-between items-end py-4 mb-4 gap-4 bg-white rounded-xl border p-6 mt-4 shadow-sm">
        <div className="flex flex-col md:flex-row w-full gap-6 items-center">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-6 w-full items-center">
              <div className="w-full sm:w-[180px]">
                <TriStateSelect
                  id="isProductItemFilter"
                  label="Product Item"
                  value={isProductItemFilter}
                  onChange={setIsProductItemFilter}
                  allLabel="All"
                  trueLabel="Product Item"
                  falseLabel="Non-Product Item"
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-[180px]">
                <TriStateSelect
                  id="isStockTrackedFilter"
                  label="Stock Tracked"
                  value={isStockTrackedFilter}
                  onChange={setIsStockTrackedFilter}
                  allLabel="All"
                  trueLabel="Stock Tracked"
                  falseLabel="Non-Stock Tracked"
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-[180px]">
                <TriStateSelect
                  id="isExpiringProductFilter"
                  label="Expiring Product"
                  value={isExpiringProductFilter}
                  onChange={setIsExpiringProductFilter}
                  allLabel="All"
                  trueLabel="Expiring Product"
                  falseLabel="Non-Expiring Product"
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-[180px]">
                <TriStateSelect
                  id="isBatchTrackedFilter"
                  label="Batch Tracked"
                  value={isBatchTrackedFilter}
                  onChange={setIsBatchTrackedFilter}
                  allLabel="All"
                  trueLabel="Batch Tracked"
                  falseLabel="Non-Batch Tracked"
                  className="w-full"
                />
              </div>

           
            </div>

            <div className="flex flex-wrap gap-4 w-full items-end">
              <div className="w-full sm:w-[260px]">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Filter By</label>
                <select
                  value={selectedFilterBy.value}
                  onChange={(e) => handleInputChange(setSelectedFilterBy, selectedFilterBy, parseInt(e.target.value))}
                  className="w-full px-2 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                >
                  <option value="" disabled>Select Filter</option>
                  {filterByOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {[1, 2, 3, 6, 7].includes(selectedFilterBy.value) && (
                <div className="flex flex-1 flex-wrap gap-2 min-w-[220px]">
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                    <input
                      type="text"
                      ref={searchInputRef}
                      value={searchValue.value}
                      onChange={(e) => handleInputChange(setSearchValue, searchValue, e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                      placeholder="Enter search value"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={loadProducts}
                      className="h-[40px] px-4 py-2 mt-6 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200"
                    >
                      Search
                    </button>
                  </div>
                </div>
              )}

              {selectedFilterBy.value === 4 && (
                <div className="w-full sm:w-[220px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                  >
                    <option value="" disabled>Select Category</option>
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedFilterBy.value === 5 && (
                <div className="w-full sm:w-[220px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Measurement Unit</label>
                  <select
                    value={selectedMeasurementUnitId}
                    onChange={(e) => setSelectedMeasurementUnitId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                  >
                    <option value="" disabled>Select Measurement Unit</option>
                    {measurementUnitOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}



<div className="bg-white rounded-xl border border-slate-200 p-4 my-4 shadow-sm">
  <div className="flex flex-col gap-3">
    
    {/* Row 1: TriState Selects Grid */}
    <div className="flex justify-between gap-4 flex-wrap">
      <TriStateSelect
        id="isProductItemFilter"
        label="Product Item"
        value={isProductItemFilter}
        onChange={setIsProductItemFilter}
        allLabel="All"
        trueLabel="Product Item"
        falseLabel="Non-Product Item"
      />
      <TriStateSelect
        id="isStockTrackedFilter"
        label="Stock Tracked"
        value={isStockTrackedFilter}
        onChange={setIsStockTrackedFilter}
        allLabel="All"
        trueLabel="Stock Tracked"
        falseLabel="Non-Stock Tracked"
      />
      <TriStateSelect
        id="isExpiringProductFilter"
        label="Expiring Product"
        value={isExpiringProductFilter}
        onChange={setIsExpiringProductFilter}
        allLabel="All"
        trueLabel="Expiring Product"
        falseLabel="Non-Expiring Product"
      />
      <TriStateSelect
        id="isBatchTrackedFilter"
        label="Batch Tracked"
        value={isBatchTrackedFilter}
        onChange={setIsBatchTrackedFilter}
        allLabel="All"
        trueLabel="Batch Tracked"
        falseLabel="Non-Batch Tracked"
      />
    </div>

    {/* Row 2: Dynamic Search & Dropdowns */}
    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
      
      {/* Filter By Selection */}
      <div className="flex items-center gap-2 min-w-[240px]">
        <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Filter By:</label>
        <select
          value={selectedFilterBy.value}
          onChange={(e) => handleInputChange(setSelectedFilterBy, selectedFilterBy, parseInt(e.target.value))}
          className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
        >
          <option value="" disabled>Select Filter</option>
          {filterByOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Text Search */}
      {[1, 2, 3, 6, 7].includes(selectedFilterBy.value) && (
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Search:</label>
          <input
            type="text"
            ref={searchInputRef}
            value={searchValue.value}
            onChange={(e) => handleInputChange(setSearchValue, searchValue, e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            placeholder="Enter search value..."
          />
          <button
            type="button"
            onClick={loadProducts}
            className="px-4 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none transition whitespace-nowrap"
          >
            Search
          </button>
        </div>
      )}

      {/* Category Dropdown */}
      {selectedFilterBy.value === 4 && (
        <div className="flex items-center gap-2 min-w-[240px]">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Category:</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
            className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          >
            <option value="" disabled>Select Category</option>
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.displayName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Unit Dropdown */}
      {selectedFilterBy.value === 5 && (
        <div className="flex items-center gap-2 min-w-[240px]">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Unit:</label>
          <select
            value={selectedMeasurementUnitId}
            onChange={(e) => setSelectedMeasurementUnitId(parseInt(e.target.value))}
            className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          >
            <option value="" disabled>Select Unit</option>
            {measurementUnitOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.displayName}
              </option>
            ))}
          </select>
        </div>
      )}

    </div>
  </div>
</div>


      {/* Main Table Structure */}
      <ReusableTable
        data={products}
        isLoading={isTableDataLoading}
        columns={productColumns}

  currentPage={currentPage}
  rowsPerPage={rowsPerPage}
  totalRecords={totalRecords}
  onPageChange={onPageChange}
  rowsPerPageOptions={[10, 30, 50, 100]}
  paginationPosition="top"


        customActions={(item) => (
          <ProductInventoryActionMenu
            item={item}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            onViewClick={handleOpenProductDetails}
            onHistoryClick={handleHistory}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
            onManageClick={handleManage}
          />
        )}
      />
   
    </div>
  );
}