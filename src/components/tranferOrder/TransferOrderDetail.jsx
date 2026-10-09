import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { X, FileText, Download, AlertTriangle, Ban } from "lucide-react";


import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import { getTransferOrderById } from "../../functions/transferOrder";

const TransferOrderDetail = ({ transferOrderId, onClose, isOpen }) => {
  const [header, setHeader] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transferOrderId && isOpen) {
      loadTransferOrder();
    }
  }, [transferOrderId, isOpen]);

  const loadTransferOrder = async () => {
    setLoading(true);
    try {
      const result = await getTransferOrderById(transferOrderId);
      console.log("Transfer Order Detail Result:", result.data.result.results);
      setHeader(result?.data?.result.results[0][0]);
      setDetails(result?.data?.result.results[1]);
    } catch (error) {
      console.error("Failed to load transfer order detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const isVoided = header?.isVoided || header?.voided;

  const exportToPDF = () => {
    const doc = new jsPDF();

    if (header) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");

      if (isVoided) {
        doc.setTextColor(225, 29, 72);
        doc.text("Transfer Order Receipt [VOIDED]", 20, 20);
      } else {
        doc.setTextColor(0, 0, 0);
        doc.text("Transfer Order Receipt", 20, 20);
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const labelX = 20;
      const valueX = 65;

      doc.text("Transfer Ref No:", labelX, 30);
      doc.text(header.transferRefNo || "-", valueX, 30);

      doc.text("Transfer Date:", labelX, 40);
      doc.text(formatUtcToLocal(header.transferDate, true) || "-", valueX, 40);

      doc.text("Created Date:", labelX, 50);
      doc.text(formatUtcToLocal(header.createdDate_UTC) || "-", valueX, 50);

      const rightLabelX = 120;
      const rightValueX = 165;
      doc.text("Source Store:", rightLabelX, 30);
      doc.text(header.sourceStoreName || "-", rightValueX, 30);

      doc.text("Destination Store:", rightLabelX, 40);
      doc.text(header.destinationStoreName || "-", rightValueX, 40);
    }

    let lastYPosition = 60;

    if (details.length > 0) {
      const tableData = details.map((detail) => [
        detail.sku || "-",
        detail.productName || "-",
        `${detail.qty} ${detail.measurementUnitName || ""}`,
        formatCurrency(detail.unitCost, false),
        formatCurrency(detail.qty * detail.unitCost, false),
      ]);

      doc.autoTable({
        startY: lastYPosition,
        head: [["SKU", "Product Name", "Qty Transferred", "Unit Cost", "Subtotal"]],
        body: tableData,
        headStyles: {
          fillColor: isVoided ? [225, 29, 72] : [14, 165, 233],
          textColor: [255, 255, 255],
        },
        theme: "grid",
        styles: { fontSize: 9 },
        didDrawPage: function (data) {
          lastYPosition = data.cursor.y;
        },
      });
    }

    if (header) {
      const totalText = `Total: ${formatCurrency(header.totalValue, false)}`;
      const pageWidth = doc.internal.pageSize.width;
      const totalTextWidth = doc.getTextWidth(totalText);

      doc.setFont("helvetica", "bold");
      doc.text(totalText, pageWidth - totalTextWidth - 20, lastYPosition + 12);
    }

    doc.save(`TransferOrder_${header?.transferRefNo || transferOrderId}${isVoided ? "_VOIDED" : ""}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 relative">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isVoided ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600"}`}>
              {isVoided ? <Ban className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Transfer Order Receipt</h3>
              <p className="text-xs text-slate-500">
  View complete details, item breakdown, and status of this stock transfer.
</p>
              </div>

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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-xs font-semibold text-slate-500">Loading transfer order details...</p>
            </div>
          ) : (
            <>
              {isVoided && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-sm text-rose-900 uppercase tracking-wide">
                      This Transfer Order Has Been Voided
                    </span>
                  </div>
                </div>
              )}
              {header && (
                <div className={`bg-slate-50 border rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 ${isVoided ? "border-rose-200/60 bg-rose-50/20" : "border-slate-200"}`}>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Transfer Ref No</span>
                    <span className="text-sm font-bold text-slate-800">{header.transferNo}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Source Store</span>
                    <span className="text-sm font-bold text-slate-800">{header.sourceStoreName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Destination Store</span>
                    <span className="text-sm font-bold text-slate-800">{header.destinationStoreName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Transfer Date</span>
                    <span className="text-sm font-medium text-slate-700">
                      {formatUtcToLocal(header.transferDate, true)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">Created Date</span>
                    <span className="text-sm font-medium text-slate-700">
                      {formatUtcToLocal(header.createdDate_UTC)}
                    </span>
                  </div>
                </div>
              )}

              {details.length > 0 && (
                <div className={`border rounded-xl overflow-hidden shadow-xs ${isVoided ? "border-rose-200 opacity-80" : "border-slate-200"}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-xs font-bold uppercase ${isVoided ? "bg-rose-100/70 border-rose-200 text-rose-800" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right whitespace-nowrap">Unit Cost</th>
                        <th className="p-3 text-right whitespace-nowrap">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {details.map((detail, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono text-xs text-slate-500">{detail.sku}</td>
                          <td className="p-3 font-semibold text-slate-700">{detail.productName}</td>
                          <td className="p-3 text-right font-medium">
                            {detail.qty} {detail.measurementUnitName}
                          </td>
                          <td className="p-3 text-right">{formatCurrency(detail.unitCost, false)}</td>
                          <td className="p-3 text-right font-bold text-slate-800">
                            {formatCurrency(detail.qty * detail.unitCost, false)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className={`font-bold border-t ${isVoided ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"}`}>
                        <td colSpan="4" className="p-3 text-right text-slate-600 uppercase text-xs">
                          Grand Total:
                        </td>
                        <td className={`p-3 text-right text-base whitespace-nowrap ${isVoided ? "text-rose-700 line-through" : "text-sky-700"}`}>
                          {formatCurrency(header?.totalValue, false)}
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
            disabled={loading || !header}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition cursor-pointer ${
              isVoided ? "bg-rose-600 hover:bg-rose-700" : "bg-sky-600 hover:bg-sky-700"
            } disabled:bg-slate-300`}
          >
            <Download className="w-4 h-4" />
            <span>Export as PDF {isVoided ? "(Voided)" : ""}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferOrderDetail;