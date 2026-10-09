import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import FormElementMessage from "../messges/FormElementMessage";
import ProductSearch from "../productSearch/ProductSearch";
import { useToast } from "../useToast";
import { getSuppliers } from "../../functions/dropdowns";
import { formatCurrency, getCurrency } from "../../utils/format";
import { CURRENCY_DISPLAY_TYPE } from "../../utils/constants";
import { stockAdd } from "../../functions/stockEntry";
import { validate } from "../../utils/formValidation";
import ReusableTable from "../ReusableTable";
import { getInventoryLastPricing } from "../../functions/store";
import MessagePopup from "../MessagePopup";

import {
  PackagePlus,
  X,
  Plus,
  Trash2,
  List,
  Save,
  Loader2,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Tag,
  Hash,
  Layers,
  Percent,
  Clock,
  MessageSquare,
  Sliders,
} from "lucide-react";

const StockEntry = ({ isOpen = true, onClose, onSuccess }) => {
  const store = JSON.parse(localStorage.getItem("selectedStore") || "{}");
  const showToast = useToast();

  const [stockEntryList, setStockEntryList] = useState([]);
  const [stockEntry, setStockEntry] = useState(null);
  const costInputRef = useRef(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [supplierBillNo, setSupplierBillNo] = useState({
    label: "Supplier Bill No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [supplier, setSupplier] = useState({
    label: "Supplier",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [supplierOptions, setSupplierOptions] = useState([]);

  const [grnDate, setGrnDate] = useState({
    label: "GRN Date",
    value: moment().format("YYYY-MM-DD"),
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "date" },
  });

  const [amountPaid, setAmountPaid] = useState({
    label: "Amount Paid",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [remark, setRemark] = useState({
    label: "Remarks / Notes",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [messagePopup, setMessagePopup] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadDrpSupplier();
    }
  }, [isOpen]);


  useEffect(() => {
    if (isConfigModalOpen && costInputRef.current) {
      setTimeout(() => costInputRef.current?.focus(), 100);
    }
  }, [isConfigModalOpen]);

  const loadDrpSupplier = async () => {
    setIsLoadingData(true);
    try {
      const objArr = await getSuppliers();
      setSupplierOptions(objArr?.data?.results?.[0] || []);
    } catch (err) {
      showToast("danger", "Error", "Failed to load suppliers list");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (setState, state, value) => {
    if (!state.rules) return;
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div className="mt-1 space-y-1">
          {state.validationMessages?.map((message, index) => (
            <FormElementMessage
              key={index}
              className="text-rose-500 text-xs font-medium"
              severity="error"
              text={message}
            />
          ))}
        </div>
      )
    );
  };

  const resetForm = () => {
    setSupplierBillNo((p) => ({ ...p, value: "", isTouched: false }));
    setSupplier((p) => ({ ...p, value: "", isTouched: false }));
    setAmountPaid((p) => ({ ...p, value: "", isTouched: false }));
    setRemark((p) => ({ ...p, value: "", isTouched: false }));
    setStockEntryList([]);
    setStockEntry(null);
    setIsConfigModalOpen(false);
  };

  const onSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!supplierBillNo.value || !supplier.value || !amountPaid.value) {
      setMessagePopup({
        isOpen: true,
        type: "warning",
        title: "Required Fields Missing",
        message: "Please fill in all mandatory fields before submitting.",
      });
      return;
    }

    if (stockEntryList.length === 0) {
      setMessagePopup({
        isOpen: true,
        type: "warning",
        title: "No Products Added",
        message: "Please add at least one product to the stock list.",
      });
      return;
    }

    const orderList = stockEntryList.map((entry) => ({
      allProductId: entry.allProductId,
      productId: entry.variationProductId,
      unitPrice: entry.unitPrice,
      unitCost: entry.unitCost,
      taxPerc: entry.taxPerc,
      qty: entry.qty,
      productionDate: entry.productionDate,
      expirationDate: entry.expirationDate,
    }));

    const payLoad = {
      supplierId: Number(supplier.value),
      storeId: store.storeId,
      stockReceivedDate: grnDate.value,
      amountPaid: amountPaid.value,
      remark: remark.value,
      supplierBillNo: supplierBillNo.value,
      orderList,
      isConfirm: true,
    };

    setIsSubmitting(true);
    try {
      const res = await stockAdd(payLoad);

      if (res?.data?.error) {
        setMessagePopup({
          isOpen: true,
          type: "danger",
          title: "Error Occurred",
          message: res.data.error.message,
        });
        return;
      }

      const responseStatus = res?.data?.outputValues?.responseStatus;

      if (responseStatus === "failed") {
        setMessagePopup({
          isOpen: true,
          type: "warning",
          title: "Exception",
          message: res.data.outputValues.outputMessage,
        });
        return;
      }

      showToast(
        "success",
        "Success",
        res?.data?.outputValues?.outputMessage || "Stock added successfully!"
      );
      resetForm();
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      showToast("danger", "Exception", err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProductHandler = () => {
    if (!stockEntry) {
             
      setMessagePopup({
          isOpen: true,
          type: "danger",
          title: "No product selected",
          message: "Please select a product before adding it to the list."
        });
      return;
    }

    const missingFields = [];
    if (!stockEntry.unitPrice) missingFields.push("unit price");
    if (!stockEntry.unitCost) missingFields.push("unit cost");
    if (!stockEntry.qty) missingFields.push("quantity");

    if (missingFields.length > 0) {

                 setMessagePopup({
          isOpen: true,
          type: "danger",
          title:   "Required fields missing",
          message: `${missingFields.join(", ")} ${
          missingFields.length === 1 ? "is" : "are"
        } required.`
        });

      return;
    }

    if (stockEntry.isExpiringProduct === 1) {
      if (!stockEntry.productionDate) {

           setMessagePopup({
          isOpen: true,
          type: "danger",
          title:    "Production date required",
          message:   "Production date is required for expiring products."
        });

        return;
      }
      if (!stockEntry.expirationDate) {


   setMessagePopup({
          isOpen: true,
          type: "danger",
          title: "Expiration date required",
          message: "Expiration date is required for expiring products."
        });
        return;
      }
    }

    setStockEntryList((prev) => [...prev, stockEntry]);
    setStockEntry(null);
    setIsConfigModalOpen(false);
  };

  const handleProductClick = async (p) => {
    try {
      const lastPricing = await getInventoryLastPricing(p.inventoryId);
      const order = {
        ...p,
        unitCost: lastPricing?.data?.unitCost || "",
        unitPrice: lastPricing?.data?.unitPrice || "",
        taxPerc: lastPricing?.data?.taxPerc || "0",
      };
      setStockEntry(order);
      setIsConfigModalOpen(true);
    } catch (err) {
      showToast("danger", "Error", "Failed to fetch product pricing");
    }
  };

  const closeConfigModal = () => {
    setStockEntry(null);
    setIsConfigModalOpen(false);
  };

  const totalCost = stockEntryList.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.unitCost) || 0),
    0
  );

  const stockEntryColumns = [
    {
      key: "sku",
      header: "SKU",
         headerClass: "text-left ",
      cellClass: "text-left",
      render: (row) => (
        <span className="inline-block bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5 text-xs font-mono font-medium text-slate-600 whitespace-nowrap">
          {row.sku}
        </span>
      ),
    },
    { 
      key: "productDescription", header: "Product Description", headerClass: "text-left",
      cellClass: "text-left whitespace-nowrap",
         render: (row) => (
        <span className="inline-block px-2 py-0.5 text-xs font-semibold text-slate-600">
          {row.productDescription}
        </span>
      ),
     },
    {
      key: "qty",
      header: "Qty",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (row) => (
        <span className=" text-xs p-2 bg-green-200 text-green-700 whitespace-nowrap rounded-full">
          {row.qty} {row.measurementUnitName}
        </span>
      ),
    },
    {
      key: "unitCost",
      header: "Unit Cost",
      headerClass: "text-right whitespace-nowrap",
      cellClass: "text-right",
      render: (row) => (
        <span className="font-mono text-xs whitespace-nowrap">{formatCurrency(row.unitCost,false)}</span>
      ),
    },
    {
      key: "unitPrice",
      header: "Unit Price",
      headerClass: "text-right whitespace-nowrap",
      cellClass: "text-right",
      render: (row) => (
        <span className="font-mono text-xs whitespace-nowrap">{formatCurrency(row.unitPrice,false)}</span>
      ),
    },
    {
      key: "taxPerc",
      header: "Tax %",
      headerClass: "text-right whitespace-nowrap",
      cellClass: "text-right text-xs font-mono whitespace-nowrap",
      render: (row) => `${row.taxPerc}%`,
    },
    {
      key: "dates",
      header: "Prod / Exp",
      headerClass: "text-left whitespace-nowrap",
      cellClass: "text-left",
      render: (row) =>
        row.productionDate ? (
          <span className="text-xs text-slate-600">
            {row.productionDate} <span className="text-slate-400">→</span>{" "}
            {row.expirationDate}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            setStockEntryList((l) => l.filter((item) => item !== row))
          }
          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl my-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <MessagePopup
          isOpen={messagePopup.isOpen}
          onClose={() => setMessagePopup((prev) => ({ ...prev, isOpen: false }))}
          type={messagePopup.type}
          title={messagePopup.title}
          message={messagePopup.message}
        />

        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl border border-sky-200">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">New Stock Entry</h2>
              <p className="text-xs text-slate-500">
                Receive inventory, manage supplier details, and record stock pricing.
              </p>
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

        {/* Loading Overlay */}
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              <span>Loading record...</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Header GRN Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Supplier Bill No */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {supplierBillNo.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter bill number"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={supplierBillNo.value}
                    onChange={(e) =>
                      handleInputChange(setSupplierBillNo, supplierBillNo, e.target.value)
                    }
                  />
                </div>
                {validationMessages(supplierBillNo)}
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {supplier.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <select
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={supplier.value}
                    onChange={(e) =>
                      handleInputChange(setSupplier, supplier, e.target.value)
                    }
                  >
                    <option value="">Select supplier…</option>
                    {supplierOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                {validationMessages(supplier)}
              </div>

              {/* GRN Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {grnDate.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={grnDate.value}
                    onChange={(e) =>
                      handleInputChange(setGrnDate, grnDate, e.target.value)
                    }
                  />
                </div>
                {validationMessages(grnDate)}
              </div>
            </div>
          </div>

          {/* Product Search Box */}
          <div className="space-y-1">
            <ProductSearch
              onProductSelect={handleProductClick}
              onBarcodeEnter={handleProductClick}
              showOnlyProductItems={true}
              onlyAllowToSelectStockTrackedProduct={true}
            />
          </div>

          {/* Selected Product Configuration Panel */}
         {/* Selected Product Configuration Popup Modal */}
{isConfigModalOpen && stockEntry && (
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"> 
 <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Modal Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Configure Stock Item</h3>
            <p className="text-xs text-slate-500">Set cost, price, and stock quantity</p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeConfigModal}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5 space-y-4">
        {/* Product Summary Header */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="text-sm font-bold text-slate-800">
            {stockEntry.productDescription}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-block bg-white border border-slate-200 rounded-md px-2 py-0.5 text-xs font-mono font-medium text-slate-500">
              SKU: {stockEntry.sku}
            </span>
            {stockEntry.isBatchTracked ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 border border-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-700">
                Batch Tracked
              </span>
            ) : null}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-3">
          {/* Unit Cost */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit Cost <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                ref={costInputRef}
                type="number"
                step="any"
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={stockEntry.unitCost}
                onChange={(e) =>
                  setStockEntry({ ...stockEntry, unitCost: e.target.value })
                }
              />
            </div>
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit Price <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="number"
                step="any"
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={stockEntry.unitPrice}
                onChange={(e) =>
                  setStockEntry({ ...stockEntry, unitPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Tax (%) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tax (%)
            </label>
            <div className="relative">
              <Percent className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="number"
                step="any"
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={stockEntry.taxPerc}
                onChange={(e) =>
                  setStockEntry({ ...stockEntry, taxPerc: e.target.value })
                }
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Hash className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="number"
                placeholder="0"
                className="w-full pl-9 pr-12 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={stockEntry.qty}
                onChange={(e) =>
                  setStockEntry({ ...stockEntry, qty: e.target.value })
                }
              />
              <span className="absolute right-3 text-xs font-semibold text-slate-500 pointer-events-none">
                {stockEntry.measurementUnitName}
              </span>
            </div>
          </div>

          {/* Expiration Dates Fields */}
          {stockEntry.isExpiringProduct === 1 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Production Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={stockEntry.productionDate || ""}
                    onChange={(e) =>
                      setStockEntry({
                        ...stockEntry,
                        productionDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expiration Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={stockEntry.expirationDate || ""}
                    onChange={(e) =>
                      setStockEntry({
                        ...stockEntry,
                        expirationDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {stockEntry.isStockTracked === "0" && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs font-medium text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Stock tracking is disabled for this product. Enable stock tracking to proceed.
            </span>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={closeConfigModal}
          className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={addProductHandler}
          disabled={stockEntry.isStockTracked === "0"}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Entry List</span>
        </button>
      </div>
    </div>
  </div>
)}

          {/* Line Items Card */}
          <div className="">
            <div className="px-5 py-3.5 mb-2 bg-slate-50 border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <List className="w-4 h-4 text-sky-600" />
                <span>Product List</span>
              </div>
              {stockEntryList.length > 0 && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-md">
                  {stockEntryList.length} item{stockEntryList.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

  
              {stockEntryList.length > 0 ? (
                <ReusableTable
                  columns={stockEntryColumns}
                  data={stockEntryList}
                  emptyMessage="No items added yet"
                  height="auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-1.5">
                  <Layers className="w-8 h-8 stroke-[1.5]" />
                  <span className="text-xs font-medium">No products added to entry list yet</span>
                </div>
              )}
        
          </div>

          {/* Footer: Remark + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {remark.label}
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <textarea
                  rows={3}
                  placeholder="Add any additional notes or supplier references..."
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-y"
                  value={remark.value}
                  onChange={(e) =>
                    handleInputChange(setRemark, remark, e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-3 bg-white border border-slate-200 rounded-lg p-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Total Cost</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  {formatCurrency(totalCost)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Amount Paid <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-slate-400 pointer-events-none">
                    {getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)}
                  </span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={amountPaid.value}
                    onChange={(e) =>
                      handleInputChange(setAmountPaid, amountPaid, e.target.value)
                    }
                  />
                </div>
                {validationMessages(amountPaid)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 rounded-lg shadow-sm transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  {/* <Save className="w-4 h-4" /> */}
                  <span>Submit Stock Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEntry;



// import React, { useEffect, useState, useRef } from "react";
// import moment from "moment";
// import FormElementMessage from "../messges/FormElementMessage";
// import ProductSearch from "../productSearch/ProductSearch";
// import { useToast } from "../useToast";
// import { getSuppliers } from "../../functions/dropdowns";
// import TextAreaField from "../inputField/TextAreaField";
// import { formatCurrency } from "../../utils/format";
// import { stockAdd } from "../../functions/stockEntry";
// import { useNavigate } from "react-router-dom";
// import { validate } from "../../utils/formValidation";
// import { FaTimes, FaTrash } from "react-icons/fa";
// import Select from "../../components/inputField/Select";
// import Input from "../../components/inputField/Input";
// import Field from "../inputField/Field";
// import SubmitButton from "../buttons/SubmitButton";
// import ReusableTable from "../ReusableTable";
// import { ListIcon } from "lucide-react";
// import Button from "../buttons/Button";
// import { getInventoryLastPricing } from "../../functions/store";

// /* ─── Tiny helpers (now pure Tailwind) ───────────────────────────────────── */




// /* ─── Component (ALL CUSTOM CSS → Tailwind + arbitrary values) ───────────── */
// const StockEntry = () => {


//   const navigate = useNavigate();
//   const store = JSON.parse(localStorage.getItem("selectedStore"));
//   const showToast = useToast();
//   const [stockEntryList, setStockEntryList] = useState([]);
//   const [stockEntry, setStockEntry] = useState(null);
//   const costInputRef = useRef(null);
//   const [supplierBillNo, setSupplierBillNo] = useState({
//     label: "Supplier Bill No",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });
//   const [supplier, setSupplier] = useState({
//     label: "Supplier",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "integer" },
//   });
//   const [supplierOptions, setSupplierOptions] = useState([]);
//   const [grnDate, setGrnDate] = useState({
//     label: "GRN Date",
//     value: moment().format("YYYY-MM-DD"),
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "date" },
//   });
//   const [amountPaid, setAmountPaid] = useState({
//     label: "Amount Paid",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });
//   const [remark, setRemark] = useState({
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     loadDrpSupplier();
//   }, []);

//   const loadDrpSupplier = async () => {
//     const objArr = await getSuppliers();
//     console.log("objArr", objArr.data.results[0]);
//     setSupplierOptions(objArr.data.results[0]);
//   };

//   const handleInputChange = (setState, state, value) => {
//     console.log('handd iinpu',value)
//     if (!state.rules) {
//       console.error("No rules defined for validation in the state", state);
//       return;
//     }
//     const validation = validate(value, state);
//     setState({
//       ...state,
//       value: value,
//       isValid: validation.isValid,
//       isTouched: true,
//       validationMessages: validation.messages,
//     });
//   };

//   const validationMessages = (state) => {
//     return (
//       !state.isValid &&
//       state.isTouched && (
//         <div className="mt-1">
//           {state.validationMessages.map((message, index) => (
//             <FormElementMessage key={index} severity="error" text={message} />
//           ))}
//         </div>
//       )
//     );
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (!supplierBillNo.value || !supplier.value || !amountPaid.value) {
//       showToast("danger", "Exception", "Fill all required fields.");
//       return;
//     }

//     const orderList = stockEntryList.map((entry) => ({
//       allProductId: entry.allProductId,
//       productId: entry.variationProductId,
//       unitPrice: entry.unitPrice,
//       unitCost: entry.unitCost,
//       taxPerc: entry.taxPerc,
//       qty: entry.qty,
//       productionDate: entry.productionDate,
//       expirationDate: entry.expirationDate,
//     }));

//     const payLoad = {
//       supplierId: supplier.value,
//       storeId: store.storeId,
//       stockReceivedDate: grnDate.value,
//       amountPaid: amountPaid.value,
//       remark: remark.value,
//       supplierBillNo: supplierBillNo.value,
//       orderList,
//       isConfirm: true,
//     };

//     setIsSubmitting(true);
//     const res = await stockAdd(payLoad);
//     console.log('stockAdd result', res);

//     setIsSubmitting(false);
 
//     if (res.data.error) {
//       showToast("danger", "Exception", res.data.error.message);
//       return;
//     }

//     const responseStatus = res.data.outputValues.responseStatus;

//     if (responseStatus === "failed") {
//       showToast("danger", "Exception", res.data.outputValues.outputMessage);
//       return;
//     }

//       console.log('res.data.outputValues', res.data.outputValues);
//     showToast("success", "Success", res.data.outputValues.outputMessage);

//     setSupplierBillNo({ ...supplierBillNo, value: "" });
//     setSupplier({ ...supplier, value: "" });
//     setAmountPaid({ ...amountPaid, value: "" });
//     setStockEntryList([]);
//   };

//   const addProductHandler = () => {
//     if (!stockEntry) {
//       showToast("danger", "No product selected", "Please select a product before adding it to the list.");
//       return;
//     }

//     const missingFields = [];
//     if (!stockEntry.unitPrice) missingFields.push("unit price");
//     if (!stockEntry.unitCost) missingFields.push("unit cost");
//     if (!stockEntry.qty) missingFields.push("quantity");

//     if (missingFields.length > 0) {
//       showToast(
//         "danger",
//         "Required fields missing",
//         `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required.`
//       );
//       return;
//     }

//     if (stockEntry.isExpiringProduct === 1) {
//       if (!stockEntry.productionDate) {
//         showToast(
//           "danger",
//           "Production date required",
//           "Production date is required for expiring products."
//         );
//         return;
//       }

//       if (!stockEntry.expirationDate) {
//         showToast(
//           "danger",
//           "Expiration date required",
//           "Expiration date is required for expiring products."
//         );
//         return;
//       }
//     }

//     setStockEntryList((prev) => [...prev, stockEntry]);
//     setStockEntry(null);

//    // showToast("success", "Success", "Product added to the list.");
//   };

//   const handleProductClick = async (p) => {
//     console.log("unitPrice", p);


//  const lastPricing = await getInventoryLastPricing(p.inventoryId);

//     console.log("lastPricing", lastPricing);

//     const order = { ...p, unitCost: lastPricing.data.unitCost, unitPrice: lastPricing.data.unitPrice, taxPerc: lastPricing.data.taxPerc };
//     setStockEntry(order);
    
//   };

//   // useEffect(() => {
//   //   if (stockEntry && costInputRef.current) {
//   //     costInputRef.current.focus();
//   //   }
//   // }, [stockEntry]);

//   const totalCost = stockEntryList.reduce(
//     (acc, item) => acc + item.qty * item.unitCost,
//     0
//   );

//   const stockEntryColumns = [
//     {
//       key: "sku",
//       label: "SKU",
//       align: "left",
//       render: (row) => (
//         <span className="inline-block bg-gray-100 border border-[#E5E5EA] rounded-[8px] px-2 py-0.5 text-xs font-semibold text-[#6D6D72] font-mono">
//           {row.sku}
//         </span>
//       ),
//     },
//     {
//       key: "productDescription",
//       label: "Product",
//       align: "left",
//     },
//     {
//       key: "qty",
//       label: "Qty",
//       align: "center",
//       render: (row) => `${row.qty} ${row.measurementUnitName}`,
//     },
 
//     {
//       key: "unitCost",
//       label: "Unit Cost",
//       align: "right",
//       render: (row) => row.unitCost,
//     },
//     {
//       key: "unitPrice",
//       label: "Unit Price",
//       align: "right",
//       render: (row) => row.unitPrice,
//     },
//         {
//       key: "taxPerc",
//       label: "Tax %",
//       align: "right",
//       render: (row) => row.taxPerc,
//     },
//        {
//       key: "dates",
//       label: "Prod + Exp Dates",
//       align: "left",
//       render: (row) => (row.productionDate ? `${row.productionDate} → ${row.expirationDate}` : "—"),
//     },

//     // {
//     //   key: "total",
//     //   label: "Total",
//     //   align: "right",
//     //   render: (row) => (row.qty * row.unitCost).toFixed(2),
//     // },
//     {
//       key: "actions",
//       label: "Action",
//       align: "center",
//       render: (row) => (
//         <button
//           type="button"
//           onClick={() => setStockEntryList((l) => l.filter((item) => item !== row))}
//           className="w-8 h-8 rounded-sm bg-transparent flex items-center justify-center text-gray-700 hover:bg-[rgba(255,59,48,0.08)] hover:text-[#FF3B30] transition-all"
//         >
//           <FaTrash />
//         </button>
//       ),
//     },
//   ];

//   return (

//     <div className="min-h-screen p-7 pb-15 font-sans">
//       <div className="max-w-[1060px] mx-auto flex flex-col gap-4">
//         {/* ── Top bar ── */}
//         <div className="flex items-end justify-between px-0.5 pb-1">
//           <div>
//             <div className="text-[26px] font-bold text-[#1C1C1E] tracking-[-0.5px] leading-none">
//               Stock Entry
//             </div>
         
//           </div>

//  <Button variant="default"  onClick={() => navigate("/inventory/stockentry/list")} className="w-full sm:w-auto ">
//               View Entries
//             </Button>
        
//         </div>

//         {/* ── GRN Info Card ── */}
//         <form onSubmit={onSubmit} className="space-y-4">
//           <div className="bg-white rounded-lg border border-gray-200">
     

//             <div className="p-5">
//               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3.5">
//                 <Field label="Supplier Bill No" required>
//                   <Input
//                     type="text"
//                     placeholder="Enter bill number"
//                     value={supplierBillNo.value}
//                     onChange={(e) => handleInputChange(setSupplierBillNo, supplierBillNo, e.target.value)}
//                   />
//                   {validationMessages(supplierBillNo)}
//                 </Field>

//                 <Field label="Supplier" required>
                
//                     <Select
//   value={supplier.value}
//   onChange={(e) => handleInputChange(setSupplier, supplier, e.target.value)}
// >
//                     <option value="">Select supplier…</option>
//                     {supplierOptions.map((o) => (
//                       <option key={o.id} value={o.id}>
//                         {o.displayName}
//                       </option>
//                     ))}
//                   </Select>
//                   {validationMessages(supplier)}
//                 </Field>



            


//                 <Field label="GRN Date" required>
//                   <Input
//                     type="date"
//                     value={grnDate.value}
//                     onChange={(e) => handleInputChange(setGrnDate, grnDate, e.target.value)}
//                   />
//                   {validationMessages(grnDate)}
//                 </Field>
//               </div>
//             </div>
//           </div>

//       {/* ── Product Search ── */}
// <ProductSearch 
//   onProductSelect={handleProductClick} 
//   onBarcodeEnter={handleProductClick} 
//   showOnlyProductItems={true} 
//   onlyAllowToSelectStockTrackedProduct={true} 
// />
//           {/* ── Selected Product Panel ── */}
//           {stockEntry && (
//             <div className="bg-white rounded-lg p-5 transition-all">
//               <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[rgba(0,122,255,0.12)] gap-3 flex-wrap">
//                 <div>
//                   <div className="text-[15px] font-bold text-[#1C1C1E]">{stockEntry.productDescription}</div>
//              </div>
//                 <div className="px-3 py-1 bg-slate-100  rounded-full whitespace-nowrap">
//                    <div className=" text-gray-500 mt-0.5 font-medium">SKU: {stockEntry.sku}</div>
               
//                 </div>

//    {stockEntry.isBatchTracked ? (
//                     <span className="inline-flex items-center rounded-full bg-[#1d4ed8] px-3 py-1 text-xs font-semibold text-white">
//                       Batch Tracked
//                     </span>
//                   ) : null}
              

//                  <button
//                             type="button"
//                             onClick={() => {setStockEntry(null)}}
//                             className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-gray-700 hover:bg-[rgba(255,59,48,0.08)] hover:text-[#FF3B30] transition-all"
//                           >
//                             <FaTimes />
//                           </button>

//               </div>

//               <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 items-center">

//                    <Field label="Unit Cost" required>
//                   <Input
//                     ref={costInputRef}
//                     type="number"
//                     //placeholder="0.00"
//                     value={stockEntry.unitCost}
//                     onChange={(e) => setStockEntry({ ...stockEntry, unitCost: e.target.value })}
//                   />
//                 </Field>

//              <Field label="Unit Price" required>
//                   <Input
//                    // ref={priceInputRef}
//                     type="number"
//                     //placeholder="0.00"
//                     value={stockEntry.unitPrice}
//                     onChange={(e) => setStockEntry({ ...stockEntry, unitPrice: e.target.value })}
//                   />
//                 </Field>

//              <Field label="Tax (%)" required>
//                   <Input
//                    // ref={priceInputRef}
//                     type="number"
//                     //placeholder="0.00"
//                     value={stockEntry.taxPerc}
//                     onChange={(e) => setStockEntry({ ...stockEntry, taxPerc: e.target.value })}
//                   />
//                 </Field>


//                       <Field label="Qty" required>
//                 <div className="flex items-end gap-1.5 mr-5">
//                   <Input
//                     type="number"
//                     placeholder="0"
//                     value={stockEntry.qty}
//                     onChange={(e) => setStockEntry({ ...stockEntry, qty: e.target.value })}
//                   />
//                   <span className="font-semibold text-gray-700 pb-2 whitespace-nowrap">
//                     {stockEntry.measurementUnitName}
//                   </span>
//                 </div>
//                 </Field>


//                 {stockEntry.isExpiringProduct === 1 && (
//                   <>
//                     <Field label="Production Date" required>
//                       <Input
//                         type="date"
//                         value={stockEntry.productionDate || ""}
//                         onChange={(e) => setStockEntry({ ...stockEntry, productionDate: e.target.value })}
//                       />
//                     </Field>
//                     <Field label="Expiration Date" required>
//                       <Input
//                         type="date"
//                         value={stockEntry.expirationDate || ""}
//                         onChange={(e) => setStockEntry({ ...stockEntry, expirationDate: e.target.value })}
//                       />
//                     </Field>
//                   </>
//                 )}

   
   
//          <div className="md:col-span-4 flex justify-center mt-5">
//                   <button
//                     type="button"
//                     onClick={addProductHandler}
//                     disabled={stockEntry.isStockTracked === "0"}
//                     className="bg-sky-600 px-6 text-white font-bold rounded-full py-2.5 hover:bg-sky-700 disabled:cursor-not-allowed"
//                   >
//                     Add to List
//                   </button>
//                 </div>
   
           
//               </div>

//               {stockEntry.isStockTracked === "0" && (
//                 <div className="mt-4 bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.2)] rounded-[10px] p-3 flex items-center gap-2 text-sm font-medium text-[#FF3B30]">
//                   ⚠️ Stock tracking is disabled for this product. Enable it to proceed.
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ── Line Items Card ── */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="flex items-center justify-between px-5 py-4">
//               <div className="flex items-center gap-2.5">
//                  <ListIcon className="w-4 h-4" />
                
//                 <div className="font-semibold text-lg text-gray-700">Product List</div>
//               </div>
//               {stockEntryList.length > 0 && (
//                 <div className="font-medium text-gray-700">
//                   {stockEntryList.length} item{stockEntryList.length > 1 ? "s" : ""}
//                 </div>
//               )}
//             </div>

//             <div className="overflow-x-auto p-4">
//               {stockEntryList.length > 0 ? (
//                 <ReusableTable
//                   columns={stockEntryColumns}
//                   data={stockEntryList}
//                   emptyMessage="No items added yet"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-10 gap-2 bg-white text-gray-700">
//                   <div className="text-gray-500 italic">No items added yet</div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ── Footer: Remark + Summary ── */}
//           <div className="">
//             <div className="grid grid-cols-1 lg:grid-cols-4 bg-white border border-gray-200 rounded-lg p-4 gap-5">
//               <div className="lg:col-span-3">
//                 <Field label="Remark">
//                   <TextAreaField
//                     value={remark.value}
//                     onChange={(e) => setRemark({ ...remark, value: e.target.value })}
//                     rows={4}
//                   />
//                 </Field>
//               </div>

//               <div className="flex flex-col gap-5 w-full">
//                 <div className="flex justify-between items-center gap-3 p-2 sm:flex-row sm:items-center sm:justify-between">
//                   <span className="text-base font-semibold text-gray-700">Total Cost</span>
//                   <span className="text-xl font-bold text-gray-700 tracking-[-0.3px]">
//                     {formatCurrency(totalCost)}
//                   </span>
//                 </div>

//                 <Field label="Amount Paid" required message={validationMessages(amountPaid)}>
//                   <Input
//                     type="number"
//                     placeholder="0.00"
//                     value={amountPaid.value}
//                     onChange={(e) => handleInputChange(setAmountPaid, amountPaid, e.target.value)}
//                   />
//                 </Field>
//               </div>
//             </div>

//             <div className="flex justify-center mt-5">
//               <SubmitButton text={isSubmitting ? "Submitting…" : "Submit Stock Entry"} disabled={isSubmitting} />
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StockEntry;
