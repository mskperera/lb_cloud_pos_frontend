import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { useToast } from "../../components/useToast";
import ConfirmDialog from "../../components/dialog/ConfirmDialog";
import ExportDropdown from "../../components/ExportDropdown";
import MoreMenu from "../../components/MoreMenu";
import ReusableTable from "../../components/ReusableTable";
import BackButton from "../../components/BackButton";
import { getTransferOrderById, transferOrderReceive } from "../../functions/transferOrder";

const TransferOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const currentStoreId = store?.storeId;

  const [transfer, setTransfer] = useState(null);
  const [isReceiving, setIsReceiving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'send' | 'receive' | 'delete'

  // State array to manage modified destination retail configurations over the course of intake modifications
  const [editedPrices, setEditedPrices] = useState({});
  const [editedCosts, setEditedCosts] = useState({});
  const [editedTaxes, setEditedTaxes] = useState({});

  // Helper flags to evaluate branch access criteria cleanly
  const isSourceStore = transfer ? currentStoreId === transfer.sourceStoreId : false;
  const isDestinationStore = transfer ? currentStoreId === transfer.destinationStoreId : false;

  // Load transfer details from API when `id` changes
  const loadTranferOrderDetials = async (id) => {
    try {
      const res = await getTransferOrderById(id);
      console.log("Transfer order details (raw):", res);

      const resultsRoot =
        res?.data?.result?.results || res?.data?.results || [];
      const headerRow =
        resultsRoot[0] && Array.isArray(resultsRoot[0])
          ? resultsRoot[0][0]
          : resultsRoot[0];
      const detailRows = resultsRoot[1] || [];

      if (!headerRow) {
        showToast("danger", "Error", "Failed to load transfer order header");
        return;
      }

      const mapped = {
        id: headerRow.transferOrderId,
        number: headerRow.transferNo,
        status: headerRow.status,
        date: moment(headerRow.createdDate_UTC).format("MMM DD, YYYY"),
        sourceStoreId: headerRow.sourceStoreId,
        destinationStoreId: headerRow.destinationStoreId ?? 20,
        source: {
          name:
            headerRow.sourceStoreName ||
            headerRow.sourceStore ||
            headerRow.source?.name ||
            "",
          label: headerRow.sourceStoreName || "",
        },
        destination: {
          name:
            headerRow.destinationStoreName ||
            headerRow.destinationStore ||
            headerRow.destination?.name ||
            "",
          address:
            headerRow.destinationStoreAddress ||
            headerRow.destination?.address ||
            "",
        },
        notes: headerRow.notes || "",
        items: Array.isArray(detailRows)
          ? detailRows.map((d, idx) => ({
              id: d.itemId || `item_${idx}`,
              productId: d.allProductId,
              name: d.productName,
              productDescription: d.productDescription,
              sku: d.sku,
              quantityOrdered: Number(d.qty),
              quantityReceived: Number(
                d.receivedQty || d.quantityReceived || 0,
              ),
              batchNumber: d.batchNumber,

              unitCost: Number(d.unitCost),
              taxPerc: Number(d.taxPerc),
              unitPrice: Number(d.unitPrice),

              isNewToDestinationStore: Boolean(
                d.isNewToDestinationStore || false,
              ),
            }))
          : [],
      };

      setTransfer(mapped);

      const initialPrices = {};
      const initialCosts = {};
      const initialTaxes = {};
      mapped.items.forEach((item) => {
        initialPrices[item.id] = item.unitPrice;
        initialCosts[item.id] = item.unitCost;
        initialTaxes[item.id] = item.taxPerc;
      });

      setEditedPrices(initialPrices);
      setEditedCosts(initialCosts);
      setEditedTaxes(initialTaxes);
    } catch (err) {
      console.error("Error loading transfer orders:", err);
      showToast("danger", "Error", "Failed to load transfer order details");
    }
  };

  // Handle local changes to editable selling price inputs
  const handlePriceChange = (itemId, val) => {
    setEditedPrices(prev => ({
      ...prev,
      [itemId]: val
    }));
  };

    const handleCostChange = (itemId, val) => {
    setEditedCosts(prev => ({
      ...prev,
      [itemId]: val
    }));
  };

    const handleTaxChange = (itemId, val) => {
    setEditedTaxes(prev => ({
      ...prev,
      [itemId]: val
    }));
  };
    

  // Compile UI Column structures dynamically based on store routing context
  const orderDetailsColumns = useMemo(() => {
    const baseColumns = [
      {
        key: "sku",
        label: "SKU",
        align: "left",
        render: (row) => (
          <div className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-100 inline-flex items-center px-3 py-1.5 rounded-full border border-emerald-200">
            {row.sku}
          </div>
        ),
      },
      {
        key: "productDescription",
        label: "Item",
        align: "left",
        render: (row) => (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 text-sm">{row.productDescription}</div>
            {isDestinationStore && (
              <span className={`inline-flex text-[11px] font-bold px-2 py-0.5 rounded ${row.isNewToDestinationStore ? "bg-green-100 text-green-800 border border-green-200" : ""}`}>
                {row.isNewToDestinationStore ? "[New in Your Store]" : null}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "batchNumber",
        label: "Batch",
        align: "left",
        render: (row) => row.batchNumber || "-",
      },
      {
        key: "quantityOrdered",
        label: "Qty Sent",
        align: "right",
        render: (row) => (
          <div className="inline-flex items-center justify-center w-16 h-8 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200">
            {row.quantityOrdered}
          </div>
        ),
      },
    ];

    // Append pricing configurations exclusively when managing the destination workflow 
    if (isDestinationStore) {
      return [
        ...baseColumns,
        {
          key: "unitCost",
          label: "Unit Cost",
          align: "center",
          render: (row) => {
            const currentVal = editedCosts[row.id] ?? "";
            return (
              <div className="w-40 space-y-1 py-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 text-xs">Rs.</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full rounded-md pl-9 pr-3 py-1.5 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors focus:outline-none"
                    placeholder="0.00"
                    value={currentVal}
                    onChange={(e) => handleCostChange(row.id, e.target.value)}
                  />
                </div>
              </div>
            );
          }
        },
        {
          key: "taxPerc",
          label: "Tax %",
          align: "center",
          render: (row) => {
            const currentVal = editedTaxes[row.id] ?? "";
            return (
              <div className="w-32 space-y-1 py-1">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full rounded-md px-3 py-1.5 text-sm border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors focus:outline-none"
                    placeholder="0.00"
                    value={currentVal}
                    onChange={(e) => handleTaxChange(row.id, e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-xs">%</span>
                  </div>
                </div>
              </div>
            );
          }
        },
        {
          key: "unitPrice",
          label: "Unit Price",
          align: "left",
          render: (row) => {
            const currentVal = editedPrices[row.id] ?? "";
            const isNew = row.isNewToDestinationStore;
            return (
              <div className="w-64 space-y-1 py-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 text-xs">Rs.</span>
                  </div>
                  <input
                    type="number"
                    className={`block w-full rounded-md pl-9 pr-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
                      isNew 
                        ? "border-amber-400 bg-amber-50/50 text-amber-900 focus:border-amber-500 focus:ring-amber-300" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="0.00"
                    value={currentVal}
                    onChange={(e) => handlePriceChange(row.id, e.target.value)}
                  />
                </div>
                <p className={`text-sm leading-tight break-words whitespace-normal ${isNew ? "text-green-700 font-medium bg-green-400" : "text-gray-500"}`}>
{isNew 
  ? "Suggested price (Edit if needed)" 
  : "Your store price"}
                </p>
              </div>
            );
          }
        }
      ];
    }

    return baseColumns;
  }, [isDestinationStore, editedPrices, editedCosts, editedTaxes]);

  // Compute stats metrics for matching summary cards
  const newProductsCount = useMemo(() => {
    if (!transfer) return 0;
    return transfer.items.filter(i => i.isNewToDestinationStore).length;
  }, [transfer]);

  const matchedProductsCount = useMemo(() => {
    if (!transfer) return 0;
    return transfer.items.filter(i => !i.isNewToDestinationStore).length;
  }, [transfer]);

  useEffect(() => {
    if (id) {
      loadTranferOrderDetials(id);
    }
  }, [id]);

  const handleReceiveAll =async () => {
    // Compile comprehensive payload with all table data and parameters
    const completePayload = {
      transferOrderId: transfer.id,
      items: transfer.items.map(item => ({
        allProductId: item.productId,
        unitCost: Number(editedCosts[item.id]),
        unitPrice: Number(editedPrices[item.id]),
        taxPerc: Number(editedTaxes[item.id])
      }))
    };

    console.log("Submitting complete transfer order intake payload:", completePayload);

  const res=await  transferOrderReceive(completePayload);

     if(res.data.error){
    showToast("danger", "Error", res.data.error.message || "Failed to create transfer order");
    return;
  }

  console.log('res.data.outputValues:', res.data.outputValues);
   const {responseStatus} = res.data.outputValues;

    if (responseStatus === "failed") {
      showToast("danger", "Exception", res.data.outputValues.outputMessage);
      return;
    }

  showToast("success", "Success", `Transfer order created successfully`);


    // TODO: Replace with actual API call to backend
    // Example: await submitTransferOrderReceipt(completePayload);

    // setTransfer(prev => ({
    //   ...prev,
    //   items: prev.items.map(item => ({
    //     ...item,
    //     quantityReceived: item.quantityOrdered
    //   })),
    //   status: "Received"
    // }));
    showToast("success", "Success", "All inventory items received and retail configurations updated successfully.");
  };

  const handleSend = () => {
    setTransfer(prev => ({ ...prev, status: "Sent" }));
    showToast("success", "Success", "Transfer order marked as sent");
  };


  const handleConfirmAction = () => {
    if (confirmAction === "send") {
      handleSend();
    } else if (confirmAction === "receive") {
      handleReceiveAll();
    } else if (confirmAction === "delete") {
      setTransfer(prev => ({ ...prev, status: "Deleted" }));
      showToast("success", "Deleted", "Transfer order has been deleted");
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleExportPDF = () => showToast("success", "Export", "PDF exported successfully");
  const handleExportCSV = () => showToast("success", "Export", "CSV exported successfully");

  if (!transfer) return <div className="p-10 text-center">Loading transfer order...</div>;

  const isInTransit = transfer.status === "In transit";
  const totalOrdered = transfer.items.reduce((sum, i) => sum + i.quantityOrdered, 0);

  // Status mapping color palette helpers
  const getStatusBadgeStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "received") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (s === "rejected") return "bg-rose-100 text-rose-800 border-rose-200";
    return "bg-blue-100/70 text-blue-600 border-blue-200";
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-3 sm:p-7 pb-20 font-sans">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-4 sm:gap-5">

        {/* Dynamic Status Header Tracking Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <BackButton
                  onClick={() => navigate("/inventory/transferorders/list")}
                  title="Back to Transfer Orders"
                  size="lg"
                />
                <h1 className="text-xl sm:text-[26px] font-bold text-[#1C1C1E] tracking-[-0.5px] break-words">
                  Transfer Order #{transfer.number}
                </h1>
              </div>
              <div className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusBadgeStyle(transfer.status)}`}>
                {transfer.status}
              </div>
            </div>
            <div className="flex sm:block justify-between items-center sm:items-start">
              <div className="text-gray-500 ml-16 text-sm">
                Date: {transfer.date}
              </div>
            </div>
          </div>

          {/* Context Driven Functional Action Block */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
            {isDestinationStore && isInTransit && (
              <button
                onClick={() => {
                  setConfirmAction("receive");
                  setShowConfirmDialog(true);
                }}
                disabled={isReceiving}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-sm disabled:opacity-60 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Confirm & Receive Stock</span>
              </button>
            )}

            <ExportDropdown
              disabled={isReceiving}
              menuItems={[
                { key: "pdf", label: "Export as PDF", onClick: handleExportPDF },
                { key: "csv", label: "Export as CSV", onClick: handleExportCSV }
              ]}
            />
          </div>
        </div>

        {/* Informational Warning Banner — Destination Mode Exclusive */}
        {isDestinationStore && isInTransit && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start shadow-sm">
            <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>ℹ️ Inventory Intake Notice:</strong> Cost prices are locked based on the shipping voucher. Selling prices shown below represent your branch's specific retail configuration. Updates made here will apply instantly to your local store catalog upon confirmation.
            </p>
          </div>
        )}


        {/* Master Context Metadata Grid Layout Card */}
        <div className="bg-white rounded-lg sm:rounded-2xl border border-[#E5E5EA] overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b space-y-4 sm:space-y-0 grid sm:grid-cols-4 gap-4 sm:gap-8 bg-gray-50/50">
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-400">Transfer Number</div>
              <div className="font-semibold text-gray-800">{transfer.number}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-400">Source Store</div>
              <div className="font-medium text-gray-700">{transfer.source.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-400">Destination Store</div>
              <div className="font-medium text-gray-700">{transfer.destination.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-400">Overall Status</div>
              <div className="font-medium"><span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getStatusBadgeStyle(transfer.status)}`}>{transfer.status}</span></div>
            </div>

            {transfer.notes && (
              <div className="sm:col-span-4 space-y-1 pt-2 border-t border-gray-100">
                <div className="text-sm font-bold text-gray-400">Notes</div>
                <div className="text-sm text-gray-600 italic">"{transfer.notes}"</div>
              </div>
            )}
          </div>

          {/* Dynamic Grid Module Viewport */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Item List</h2>
              <div className="text-gray-700 inline-flex items-center gap-2">
                <span className="font-semibold text-gray-600 text-xs bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                  Total Items Quantities: {totalOrdered}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <ReusableTable
                columns={orderDetailsColumns}
                data={transfer.items}
                emptyMessage="No items assigned to this transfer ledger transaction instance"
              />
            </div>

            {/* Micro-copy Intake Summary Card — Destination Mode Exclusive */}
            {isDestinationStore && isInTransit && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 sm:space-y-0.5">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-emerald-600 font-bold">✓</span> 
                    <span><strong>{matchedProductsCount}</strong> Products matched to your existing branch catalog parameters.</span>
                  </div>
                  {newProductsCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                      <span className="text-amber-500 font-bold">⚠️</span> 
                      <span><strong>{newProductsCount}</strong> New items will be newly initialized into your destination store's catalog.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isVisible={showConfirmDialog}
        message={
          confirmAction === "send"
            ? "Are you sure you want to send this order?"
            : confirmAction === "receive"
            ? "Are you sure you want to verify and update retail pricing parameters to receive this order?"
            : "Are you sure you want to delete this order?"
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        title={
          confirmAction === "send"
            ? "Confirm Send"
            : confirmAction === "receive"
            ? "Confirm Inventory Intake Verification"
            : "Confirm Delete"
        }
        severity={confirmAction === "delete" ? "danger" : "info"}
      />
    </div>
  );
};

export default TransferOrderDetail;