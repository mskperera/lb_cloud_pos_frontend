import React, { useEffect, useState } from "react";
import { getStockEntryFull } from "../../functions/stockEntry";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import { X, FileText, Download, AlertTriangle, Ban } from "lucide-react";

const StockEntryFull = ({ stockEntryId, onClose, isOpen }) => {
  const [stockEntryHeader, setStockEntryHeader] = useState(null);
  const [stockEntryDetails, setStockEntryDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stockEntryId && isOpen) {
      loadstockEntry();
    }
  }, [stockEntryId, isOpen]);

  const loadstockEntry = async () => {
    setLoading(true);
    try {
      const result = await getStockEntryFull(stockEntryId);
      const header = result?.data?.results[0]?.[0];
      setStockEntryHeader(header || null);

      const details = result?.data?.results[1] || [];
      setStockEntryDetails(details);
    } catch (error) {
      console.error("Failed to load stock entry full detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const isVoided = stockEntryHeader?.isVoided || stockEntryHeader?.voided;

  const exportToPDF = () => {
    const doc = new jsPDF();

    if (stockEntryHeader) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      
      if (isVoided) {
        doc.setTextColor(225, 29, 72); // Rose red color for voided
        doc.text("Stock Entry Receipt [VOIDED]", 20, 20);
      } else {
        doc.setTextColor(0, 0, 0);
        doc.text("Stock Entry Receipt", 20, 20);
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const labelX = 20;
      const valueX = 60;

      doc.text("GRN No:", labelX, 30);
      doc.text(stockEntryHeader.stockEntryRefNo || "-", valueX, 30);

      doc.text("Stock Received Date:", labelX, 40);
      doc.text(formatUtcToLocal(stockEntryHeader.stockReceivedDate, true) || "-", valueX, 40);

      doc.text("Created Date:", labelX, 50);
      doc.text(formatUtcToLocal(stockEntryHeader.CreatedDate_UTC) || "-", valueX, 50);

      const rightLabelX = 120;
      const rightValueX = 160;
      doc.text("Supplier Name:", rightLabelX, 30);
      doc.text(stockEntryHeader.supplierName || "-", rightValueX, 30);

      doc.text("User:", rightLabelX, 40);
      doc.text(stockEntryHeader.displayName || "-", rightValueX, 40);

      if (isVoided && stockEntryHeader.voidRemark) {
        doc.setTextColor(225, 29, 72);
        doc.text(`Void Remark: ${stockEntryHeader.voidRemark}`, labelX, 60);
        doc.setTextColor(0, 0, 0);
      }
    }

    let lastYPosition = isVoided ? 70 : 60;

    if (stockEntryDetails.length > 0) {
      const tableData = stockEntryDetails.map((detail) => [
        detail.batchNo || "-",
        detail.productName || "-",
        detail.sku || "-",
        `${detail.qtyAdded} ${detail.measurementUnitName || ""}`,
        formatCurrency(detail.unitCost, false),
        formatCurrency(detail.unitPrice, false),
        formatCurrency(detail.qtyAdded * detail.unitCost, false),
      ]);

      doc.autoTable({
        startY: lastYPosition,
        head: [["Batch No", "Product Name", "SKU", "Qty Added", "Unit Cost", "Unit Price", "Total Cost"]],
        body: tableData,
        headStyles: {
          fillColor: isVoided ? [225, 29, 72] : [14, 165, 233], // Red head header if voided
          textColor: [255, 255, 255],
        },
        theme: "grid",
        styles: { fontSize: 9 },
        didDrawPage: function (data) {
          lastYPosition = data.cursor.y;
        },
      });
    }

    if (stockEntryHeader) {
      const totalText = `Total: ${formatCurrency(stockEntryHeader.total, false)}`;
      const pageWidth = doc.internal.pageSize.width;
      const totalTextWidth = doc.getTextWidth(totalText);
      const margin = 20;

      doc.setFont("helvetica", "bold");
      doc.text(totalText, pageWidth - totalTextWidth - margin, lastYPosition + 12);
    }

    doc.save(`StockEntry_${stockEntryHeader?.stockEntryRefNo || stockEntryId}${isVoided ? '_VOIDED' : ''}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isVoided ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'}`}>
              {isVoided ? <Ban className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Stock Entry Receipt</h3>
                <p className="text-xs text-slate-500">
                  {stockEntryHeader?.stockEntryRefNo ? `Ref: ${stockEntryHeader.stockEntryRefNo}` : `ID: ${stockEntryId}`}
                </p>
              </div>

              {/* Header Status Badge */}
              {isVoided && (
                <span className="ml-2 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase rounded-full bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                  Voided
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-xs font-semibold text-slate-500">Loading stock entry details...</p>
            </div>
          ) : (
            <>
              {/* Eye-catching Voided Alert Banner */}
              {isVoided && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-rose-900 uppercase tracking-wide">
                        This Stock Entry Has Been Voided
                      </span>
                      {stockEntryHeader?.voidedDate && (
                        <span className="text-rose-600 font-medium">
                          {formatUtcToLocal(stockEntryHeader.voidedDate)}
                        </span>
                      )}
                    </div>
                    {stockEntryHeader?.voidRemark && (
                      <p className="mt-1 text-rose-700 font-medium bg-rose-100/60 p-2 rounded-lg border border-rose-200/60">
                        <span className="font-bold">Reason:</span> {stockEntryHeader.voidRemark}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Header Info Cards */}
              {stockEntryHeader && (
                <div className={`bg-slate-50 border rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 ${isVoided ? 'border-rose-200/60 bg-rose-50/20' : 'border-slate-200'}`}>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Stock Entry ID</span>
                    <span className="text-sm font-bold text-slate-800">{stockEntryHeader.stockEntryId}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">GRN No</span>
                    <span className="text-sm font-bold text-slate-800">{stockEntryHeader.stockEntryRefNo || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Supplier Name</span>
                    <span className="text-sm font-bold text-slate-800">{stockEntryHeader.supplierName || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Stock Received Date</span>
                    <span className="text-sm font-medium text-slate-700">
                      {formatUtcToLocal(stockEntryHeader.stockReceivedDate, true)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">User</span>
                    <span className="text-sm font-medium text-slate-700">{stockEntryHeader.displayName || "-"}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Created Date</span>
                    <span className="text-sm font-medium text-slate-700">
                      {formatUtcToLocal(stockEntryHeader.CreatedDate_UTC)}
                    </span>
                  </div>
                </div>
              )}

              {/* Items Details Table */}
              {stockEntryDetails.length > 0 && (
                <div className={`border rounded-xl overflow-hidden shadow-xs ${isVoided ? 'border-rose-200 opacity-80' : 'border-slate-200'}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-xs font-bold uppercase ${isVoided ? 'bg-rose-100/70 border-rose-200 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        <th className="p-3">Batch No</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Expiration Date</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right whitespace-nowrap">Unit Cost</th>
                        <th className="p-3 text-right whitespace-nowrap">Unit Price</th>
                        <th className="p-3 text-right whitespace-nowrap">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {stockEntryDetails.map((detail) => (
                        <tr key={detail.stockEntryDetailsId} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono text-xs">{detail.batchNo || "-"}</td>
                          <td className="p-3 font-semibold text-slate-700">{detail.productName}</td>
                          <td className="p-3 font-mono text-xs text-slate-500">{detail.sku}</td>
                          <td className="p-3 text-xs text-slate-600">
                            {detail.expirationDate ? formatUtcToLocal(detail.expirationDate, true) : "-"}
                          </td>
                          <td className="p-3 text-right font-medium">
                            {detail.qtyAdded} {detail.measurementUnitName}
                          </td>
                          <td className="p-3 text-right">{formatCurrency(detail.unitCost, false)}</td>
                          <td className="p-3 text-right">{formatCurrency(detail.unitPrice, false)}</td>
                          <td className="p-3 text-right font-bold text-slate-800">
                            {formatCurrency(detail.qtyAdded * detail.unitCost, false)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className={`font-bold border-t ${isVoided ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                        <td colSpan="7" className="p-3 text-right text-slate-600 uppercase text-xs">
                          Grand Total:
                        </td>
                        <td className={`p-3 text-right text-base whitespace-nowrap ${isVoided ? 'text-rose-700 line-through' : 'text-sky-700'}`}>
                          {formatCurrency(stockEntryHeader?.total, false)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            disabled={loading || !stockEntryHeader}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition cursor-pointer ${
              isVoided ? 'bg-rose-600 hover:bg-rose-700' : 'bg-sky-600 hover:bg-sky-700'
            } disabled:bg-slate-300`}
          >
            <Download className="w-4 h-4" />
            <span>Export as PDF {isVoided ? '(Voided)' : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockEntryFull;

// import React, { useEffect, useState } from "react";
// import { getStockEntryFull } from "../../functions/stockEntry";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { formatCurrency, formatUtcToLocal } from "../../utils/format";
// import { X, FileText, Download } from "lucide-react";

// const StockEntryFull = ({ stockEntryId, onClose,isOpen }) => {
//   const [stockEntryHeader, setStockEntryHeader] = useState(null);
//   const [stockEntryDetails, setStockEntryDetails] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (stockEntryId) {
//       loadstockEntry();
//     }
//   }, [stockEntryId]);

//   const loadstockEntry = async () => {
//     setLoading(true);
//     try {
//       const result = await getStockEntryFull(stockEntryId);
//       const header = result?.data?.results[0]?.[0];
//       setStockEntryHeader(header || null);

//       const details = result?.data?.results[1] || [];
//       setStockEntryDetails(details);
//     } catch (error) {
//       console.error("Failed to load stock entry full detail:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();

//     if (stockEntryHeader) {
//       doc.setFontSize(16);
//       doc.setFont("helvetica", "bold");
//       doc.text("Stock Entry Receipt", 20, 20);

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);

//       const labelX = 20;
//       const valueX = 60;

//       doc.text("GRN No:", labelX, 30);
//       doc.text(stockEntryHeader.stockEntryRefNo || "-", valueX, 30);

//       doc.text("Stock Received Date:", labelX, 40);
//       doc.text(formatUtcToLocal(stockEntryHeader.stockReceivedDate, true) || "-", valueX, 40);

//       doc.text("Created Date:", labelX, 50);
//       doc.text(formatUtcToLocal(stockEntryHeader.CreatedDate_UTC) || "-", valueX, 50);

//       const rightLabelX = 120;
//       const rightValueX = 160;
//       doc.text("Supplier Name:", rightLabelX, 30);
//       doc.text(stockEntryHeader.supplierName || "-", rightValueX, 30);

//       doc.text("User:", rightLabelX, 40);
//       doc.text(stockEntryHeader.displayName || "-", rightValueX, 40);
//     }

//     let lastYPosition = 60;

//     if (stockEntryDetails.length > 0) {
//       const tableData = stockEntryDetails.map((detail) => [
//         detail.batchNo || "-",
//         detail.productName || "-",
//         detail.sku || "-",
//         `${detail.qtyAdded} ${detail.measurementUnitName || ""}`,
//         formatCurrency(detail.unitCost),
//         formatCurrency(detail.unitPrice),
//         formatCurrency(detail.qtyAdded * detail.unitCost),
//       ]);

//       doc.autoTable({
//         startY: lastYPosition,
//         head: [["Batch No", "Product Name", "SKU", "Qty Added", "Unit Cost", "Unit Price", "Total Cost"]],
//         body: tableData,
//         headStyles: {
//           fillColor: [14, 165, 233], // Sky theme color
//           textColor: [255, 255, 255],
//         },
//         theme: "grid",
//         styles: { fontSize: 9 },
//         didDrawPage: function (data) {
//           lastYPosition = data.cursor.y;
//         },
//       });
//     }

//     if (stockEntryHeader) {
//       const totalText = `Total: ${formatCurrency(stockEntryHeader.total)}`;
//       const pageWidth = doc.internal.pageSize.width;
//       const totalTextWidth = doc.getTextWidth(totalText);
//       const margin = 20;

//       doc.setFont("helvetica", "bold");
//       doc.text(totalText, pageWidth - totalTextWidth - margin, lastYPosition + 12);
//     }

//     doc.save(`StockEntry_${stockEntryHeader?.stockEntryRefNo || stockEntryId}.pdf`);
//   };

//     if (!isOpen) return null;


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
//       <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
//         {/* Modal Header */}
//         <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
//               <FileText className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-base font-bold text-slate-800">Stock Entry Receipt</h3>
//               <p className="text-xs text-slate-500">
//                 {stockEntryHeader?.stockEntryRefNo ? `Ref: ${stockEntryHeader.stockEntryRefNo}` : `ID: ${stockEntryId}`}
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6 overflow-y-auto space-y-6 flex-1">
//           {loading ? (
//             <div className="py-20 text-center">
//               <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
//               <p className="mt-2 text-xs font-semibold text-slate-500">Loading stock entry details...</p>
//             </div>
//           ) : (
//             <>
//               {/* Header Info Cards */}
//               {stockEntryHeader && (
//                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
//                   <div>
//                     <span className="text-xs font-semibold text-slate-500 block">Stock Entry ID</span>
//                     <span className="text-sm font-bold text-slate-800">{stockEntryHeader.stockEntryId}</span>
//                   </div>
//                   <div>
//                     <span className="text-xs font-semibold text-slate-500 block">GRN No</span>
//                     <span className="text-sm font-bold text-slate-800">{stockEntryHeader.stockEntryRefNo || "-"}</span>
//                   </div>
//                   <div>
//                     <span className="text-xs font-semibold text-slate-500 block">Supplier Name</span>
//                     <span className="text-sm font-bold text-slate-800">{stockEntryHeader.supplierName || "-"}</span>
//                   </div>
//                   <div>
//                     <span className="text-xs font-semibold text-slate-500 block">Stock Received Date</span>
//                     <span className="text-sm font-medium text-slate-700">
//                       {formatUtcToLocal(stockEntryHeader.stockReceivedDate, true)}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-xs font-semibold text-slate-500 block">User</span>
//                     <span className="text-sm font-medium text-slate-700">{stockEntryHeader.displayName || "-"}</span>
//                   </div>
//                   <div>
//                     <span className="text-xs font-semibold text-slate-500 block">Created Date</span>
//                     <span className="text-sm font-medium text-slate-700">
//                       {formatUtcToLocal(stockEntryHeader.CreatedDate_UTC)}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Items Details Table */}
//               {stockEntryDetails.length > 0 && (
//                 <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
//                   <table className="w-full text-left border-collapse">
//                     <thead>
//                       <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
//                         <th className="p-3">Batch No</th>
//                         <th className="p-3">Product Name</th>
//                         <th className="p-3">SKU</th>
//                         <th className="p-3">Expiration Date</th>
//                         <th className="p-3 text-right">Qty</th>
//                         <th className="p-3 text-right whitespace-nowrap">Unit Cost</th>
//                         <th className="p-3 text-right whitespace-nowrap">Unit Price</th>
//                         <th className="p-3 text-right whitespace-nowrap">Total Cost</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-200 text-sm">
//                       {stockEntryDetails.map((detail) => (
//                         <tr key={detail.stockEntryDetailsId} className="hover:bg-slate-50/80 transition">
//                           <td className="p-3 font-mono text-xs">{detail.batchNo || "-"}</td>
//                           <td className="p-3 font-semibold text-slate-700">{detail.productName}</td>
//                           <td className="p-3 font-mono text-xs text-slate-500">{detail.sku}</td>
//                           <td className="p-3 text-xs text-slate-600">
//                             {detail.expirationDate ? formatUtcToLocal(detail.expirationDate, true) : "-"}
//                           </td>
//                           <td className="p-3 text-right font-medium">
//                             {detail.qtyAdded} {detail.measurementUnitName}
//                           </td>
//                           <td className="p-3 text-right">{formatCurrency(detail.unitCost,false)}</td>
//                           <td className="p-3 text-right">{formatCurrency(detail.unitPrice,false)}</td>
//                           <td className="p-3 text-right font-bold text-slate-800">
//                             {formatCurrency(detail.qtyAdded * detail.unitCost,false)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot>
//                       <tr className="bg-slate-50 font-bold border-t border-slate-200">
//                         <td colSpan="7" className="p-3 text-right text-slate-600 uppercase text-xs">
//                           Grand Total:
//                         </td>
//                         <td className="p-3 text-right text-sky-700 text-base whitespace-nowrap">
//                           {formatCurrency(stockEntryHeader?.total,false)}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Modal Footer */}
//         <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
//           >
//             Close
//           </button>
//           <button
//             type="button"
//             onClick={exportToPDF}
//             disabled={loading || !stockEntryHeader}
//             className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-lg shadow-xs transition"
//           >
//             <Download className="w-4 h-4" />
//             <span>Export as PDF</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockEntryFull;