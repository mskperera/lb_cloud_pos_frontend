import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import FormElementMessage from "../messges/FormElementMessage";
import ProductSearch from "../productSearch/ProductSearch";
import { useToast } from "../useToast";

import { formatCurrency } from "../../utils/format";
import { transferOrderAdd } from "../../functions/transferOrder";
import { validate } from "../../utils/formValidation";
import ReusableTable from "../ReusableTable";
import MessagePopup from "../MessagePopup";

import {
  ArrowLeftRight,
  X,
  Plus,
  Trash2,
  List,
  Loader2,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Tag,
  Hash,
  Layers,
  MessageSquare,
  Sliders,
} from "lucide-react";
import { getStoresDrp } from "../../functions/dropdowns";

const CreateTransferOrder = ({ isOpen = true, onClose, onSuccess }) => {
  const store = JSON.parse(localStorage.getItem("selectedStore") || "{}");
  const showToast = useToast();

  const [transferList, setTransferList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const costInputRef = useRef(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [transferRefNo, setTransferRefNo] = useState({
    label: "Transfer Ref No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  const [destinationStore, setDestinationStore] = useState({
    label: "Destination Store",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "integer" },
  });

  const [storeOptions, setStoreOptions] = useState([]);

  const [transferDate, setTransferDate] = useState({
    label: "Transfer Date",
    value: moment().format("YYYY-MM-DD"),
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "date" },
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
    if (isOpen) loadStoresList();
  }, [isOpen]);

  useEffect(() => {
    if (isConfigModalOpen && costInputRef.current) {
      setTimeout(() => costInputRef.current?.focus(), 100);
    }
  }, [isConfigModalOpen]);

  const loadStoresList = async () => {
    setIsLoadingData(true);
    try {
      const res = await getStoresDrp();
      const allStores = res?.data?.results?.[0] || [];
      setStoreOptions(allStores.filter((s) => s.id !== store.storeId));
    } catch (err) {
      showToast("danger", "Error", "Failed to load store list");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (setState, state, value) => {
    if (!state.rules) return;
    const validation = validate(value, state);
    setState({
      ...state,
      value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const validationMessages = (state) =>
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
    );

  const resetForm = () => {
    setTransferRefNo((p) => ({ ...p, value: "", isTouched: false }));
    setDestinationStore((p) => ({ ...p, value: "", isTouched: false }));
    setRemark((p) => ({ ...p, value: "", isTouched: false }));
    setTransferList([]);
    setSelectedProduct(null);
    setIsConfigModalOpen(false);
  };

  const onSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!transferRefNo.value || !destinationStore.value) {
      setMessagePopup({
        isOpen: true,
        type: "warning",
        title: "Required Fields Missing",
        message: "Please fill in all mandatory fields before submitting.",
      });
      return;
    }

    if (transferList.length === 0) {
      setMessagePopup({
        isOpen: true,
        type: "warning",
        title: "No Products Added",
        message: "Please add at least one product to the transfer list.",
      });
      return;
    }

    const orderList =[];
    
    transferList.map((entry) => {



   const obj= {
    allProductId: entry.allProductId,
      // unitPrice: entry.unitPrice,
      // unitCost: entry.unitCost,
      qty: entry.qty,
      stockBatchId: entry.stockBatchId
    };

    orderList.push(obj);

   });


      const payload={
    status:"In Transit",
   sourceStoreId: store.storeId,
    destinationStoreId: destinationStore.value,
    transferDate: transferDate.value,
    notes: remark.value,
    orderList_json:orderList
  }

    // const payload = {
    //   sourceStoreId: store.storeId,
    //   destinationStoreId: Number(destinationStore.value),
    //   transferDate: transferDate.value,
    //   transferRefNo: transferRefNo.value,
    //   remark: remark.value,
    //   orderList,
    // };

    setIsSubmitting(true);
    try {
      const res = await transferOrderAdd(payload);


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




      showToast("success", "Success", "Transfer order created successfully!");
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
    if (!selectedProduct) return;

    console.log('selectedProduct',selectedProduct);

    if (!selectedProduct.qty || Number(selectedProduct.qty) <= 0) {
      setMessagePopup({
        isOpen: true,
        type: "danger",
        title: "Quantity Required",
        message: "Please enter a valid transfer quantity.",
      });
      return;
    }

    setTransferList((prev) => [...prev, selectedProduct]);
    setSelectedProduct(null);
    setIsConfigModalOpen(false);
  };

  const handleProductClick = (p) => {
    setSelectedProduct({ ...p, qty: 1, unitCost: p.unitCost || 0, unitPrice: p.unitPrice || 0 });
    setIsConfigModalOpen(true);
  };

  const totalValue = transferList.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.unitCost) || 0),
    0
  );

  const transferColumns = [
    {
      key: "sku",
      header: "SKU",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (row) => (
        <span className="inline-block bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5 text-xs font-mono font-medium text-slate-600 whitespace-nowrap">
          {row.sku}
        </span>
      ),
    },
    {
      key: "productDescription",
      header: "Product Description",
      headerClass: "text-left",
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
        <span className="text-xs p-2 bg-green-200 text-green-700 whitespace-nowrap rounded-full font-semibold">
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
        <span className="font-mono text-xs whitespace-nowrap">{formatCurrency(row.unitCost, false)}</span>
      ),
    },
    {
      key: "total",
      header: "Subtotal",
      headerClass: "text-right whitespace-nowrap",
      cellClass: "text-right font-mono text-xs font-bold text-slate-800",
      render: (row) => formatCurrency((row.qty || 0) * (row.unitCost || 0), false),
    },
    {
      key: "actions",
      header: "",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (row) => (
        <button
          type="button"
          onClick={() => setTransferList((l) => l.filter((item) => item !== row))}
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
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">New Transfer Order</h2>
              <p className="text-xs text-slate-500">
                Transfer stock between store locations efficiently.
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

        {isLoadingData && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
              <span>Loading stores...</span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Header Transfer Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {transferRefNo.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="TRN-XXXX"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={transferRefNo.value}
                    onChange={(e) =>
                      handleInputChange(setTransferRefNo, transferRefNo, e.target.value)
                    }
                  />
                </div>
                {validationMessages(transferRefNo)}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {destinationStore.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <select
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={destinationStore.value}
                    onChange={(e) =>
                      handleInputChange(setDestinationStore, destinationStore, e.target.value)
                    }
                  >
                    <option value="">Select destination store…</option>
                    {storeOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.displayName || s.storeName}
                      </option>
                    ))}
                  </select>
                </div>
                {validationMessages(destinationStore)}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {transferDate.label} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    value={transferDate.value}
                    onChange={(e) =>
                      handleInputChange(setTransferDate, transferDate, e.target.value)
                    }
                  />
                </div>
                {validationMessages(transferDate)}
              </div>
            </div>
          </div>

          <ProductSearch
            onProductSelect={handleProductClick}
            onBarcodeEnter={handleProductClick}
            showOnlyProductItems={true}
            onlyAllowToSelectStockTrackedProduct={true}
          />

          {/* Config Modal */}
          {isConfigModalOpen && selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Configure Transfer Quantity</h3>
                      <p className="text-xs text-slate-500">Set units to transfer</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="text-sm font-bold text-slate-800">
                      {selectedProduct.productDescription}
                    </div>
                    <span className="inline-block bg-white border border-slate-200 rounded-md px-2 py-0.5 text-xs font-mono font-medium text-slate-500 mt-1.5">
                      SKU: {selectedProduct.sku}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                        Enter Transfer Qty <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center justify-center">
                        {/* <Hash className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" /> */}
                        <input
                          ref={costInputRef}
                          type="number"
                          placeholder="0"
                          className="w-full max-w-xs px-4 py-2 text-sm text-center text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                          value={selectedProduct.qty}
                          onChange={(e) =>
                            setSelectedProduct({ ...selectedProduct, qty: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Unit Cost
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                        <input
                          type="number"
                          step="any"
                          className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                          value={selectedProduct.unitCost}
                          onChange={(e) =>
                            setSelectedProduct({ ...selectedProduct, unitCost: e.target.value })
                          }
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addProductHandler}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Transfer List</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div>
            <div className="px-5 py-3.5 mb-2 bg-slate-50 border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <List className="w-4 h-4 text-sky-600" />
                <span>Transfer Items</span>
              </div>
              {transferList.length > 0 && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-md">
                  {transferList.length} item{transferList.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {transferList.length > 0 ? (
              <ReusableTable
                columns={transferColumns}
                data={transferList}
                emptyMessage="No items added yet"
                height="auto"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-1.5">
                <Layers className="w-8 h-8 stroke-[1.5]" />
                <span className="text-xs font-medium">No products added to transfer list yet</span>
              </div>
            )}
          </div>

          {/* Remarks & Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {remark.label}
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <textarea
                  rows={3}
                  placeholder="Add transfer notes..."
                  className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-y"
                  value={remark.value}
                  onChange={(e) =>
                    handleInputChange(setRemark, remark, e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Total Value</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  {formatCurrency(totalValue)}
                </span>
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
                <span>Submit Transfer Order</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransferOrder;

// import React, { useEffect, useState, useCallback } from "react";
// import moment from "moment";
// import Input from "../inputField/Input";
// import ProductSearch from "../productSearch/ProductSearch";
// import { useToast } from "../useToast";
// import TextAreaField from "../inputField/TextAreaField";
// import { useNavigate } from "react-router-dom";
// import { FaTrash } from "react-icons/fa";
// import { validate } from "../../utils/formValidation";
// import Select from "../inputField/Select";
// import Field from "../inputField/Field";
// import { getUserAssignedStores } from "../../functions/store";
// import ReusableTable from "../ReusableTable";
// import { ListIcon } from "lucide-react";
// import SubmitButton from "../buttons/SubmitButton";
// import Button from "../buttons/Button";
// import { transferOrderAdd } from "../../functions/transferOrder";
// import { getBatchedItems } from "../../functions/register";
// import BatchSelectionDialog from "../BatchSelectionDialog";




// /* ─── Transfer Order Component (100% matching style + screenshots) ──────── */
// const TransferOrder = () => {
//   const navigate = useNavigate();
//   const showToast = useToast();
//   const user = JSON.parse(localStorage.getItem('user'));

//   const [isSaveAsDraft, setIsSaveAsDraft] = useState(false); // Optional: for future use if you want to implement "Save as Draft" functionality
//   const [sourceStore, setSourceStore] = useState({
//     label: "Source store",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: true, dataType: "string" },
//   });

//     const [destinationStore, setDestinationStore] = useState({
//       label: "Destination store",
//       value: "",
//       isTouched: false,
//       isValid: false,
//       rules: { required: true, dataType: "string" },
//     });


//   const [transferDate, setTransferDate] = useState({
//     label: "Date of transfer order",
//     value: moment().format("YYYY-MM-DD"),
//     isTouched: false,
//     isValid: true,
//           rules: { required: true, dataType: "date" },
//   });
//   const [notes, setNotes] = useState({
//     label: "Notes",
//     value: "",
//     isTouched: false,
//     isValid: true,
//   });

//   const [transferList, setTransferList] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [storeOptions, setStoreOptions] = useState([]);

//     const [batchedItemList, setBatchedItemList] = useState([]);
  
//     const [isBatchedItemsModalOpen, setIsBatchedItemsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState("");
//  const [addOrderTemp, setAddOrderTemp] = useState(null);

//   const store = JSON.parse(localStorage.getItem("selectedStore"));

//   const loadDrpStores = useCallback(async () => {
//     const objArr = await getUserAssignedStores(user.userId);
//     console.log('objArr', objArr, user.userId);
//     setStoreOptions(objArr.data);
//   }, [user.userId]);

//   useEffect(() => {
//     loadDrpStores();
//   }, [loadDrpStores]);


//   const addItemstoOrderListFinal=(selectedBatch,product)=>{

//   console.log('product;',product)
//       console.log('selectedBatch',selectedBatch);
  
//     setTransferList((prev) => [
//       ...prev,
//       {
//         ...product,
//         id: Date.now(),
//         quantity: "",
//         stockBatchId: selectedBatch.stockBatchId,
//         // unitPrice:
//         // unitCost,
//         // taxPerc,
//         // allProductId,
//       },
//     ]);

//       setIsBatchedItemsModalOpen(false);
//     }
    

//   const handleInputChange = (setState, state, value) => {
//     console.log('handd iinpu',value)
//     if (!state?.rules) {
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
  

//   const onProductSelect = async (product) => {
//  // if (!selectedItem || !selectedItem.quantity) {
//     //   showToast("danger", "Exception", "Quantity is required");
//     //   return;
//     // }
//     if(transferList.some(i=> i.sku === product.sku)){
//       showToast("danger", "Exception", "Item already in transfer list");
//       return;
//     }

//     if(product.stockQty==null){
//       showToast("danger", "Exception", "Stock Qty is Empty");
//       return;
//     }

//  const batchedItemsRes = await getBatchedItems(product.allProductId, store.storeId);
        
//   console.log('product',product);
//     const {isBatchTracked}=batchedItemsRes.data.outputValues;
//      console.log('getBatchedItems',isBatchTracked);


//       const batchedItems = batchedItemsRes.data.results[0];
//   console.log('batchedItems',batchedItems);
// if(batchedItems.length>0){
//    if(!!isBatchTracked){
//         setBatchedItemList(batchedItems);
//         setIsBatchedItemsModalOpen(true);
//         setAddOrderTemp(product);
//         return;
//       }
// else
// {
//     setTransferList((prev) => [
//       ...prev,
//       {
//         ...product,
//         id: Date.now(), 
//         quantity: "",
//         stockBatchId: batchedItems[0].stockBatchId,
//       },
//     ]);
//   }

// }


//   //  setSelectedItem(null);

//   };



//   const removeItem = (id) => {
//     setTransferList((prev) => prev.filter((i) => i.id !== id));
//   };

// const onSubmit = async (e) => {
//   e.preventDefault();
//   if (!sourceStore.value) {
//     showToast("danger", "Error", "Source store is required");
//     return;
//   }
//   if (!destinationStore.value) {
//     showToast("danger", "Error", "Destination store is required");
//     return;
//   }
//   if (transferList.length === 0) {
//     showToast("danger", "Error", "Please add items to the transfer list");
//     return;
//   }
    

//   setIsSubmitting(true);


//   const payload={
//     status:"In Transit",
//     sourceStoreId: sourceStore.value,
//     destinationStoreId: destinationStore.value,
//     transferDate: transferDate.value,
//     notes: notes.value,
//     orderList_json:transferList.map(i=>({
//       allProductId:i.allProductId,
//       qty:i.quantity,
//       stockBatchId:i.stockBatchId
//     }))
//   }

//   const res=await transferOrderAdd(payload);

//   if(res.data.error){
//     showToast("danger", "Error", res.data.error.message || "Failed to create transfer order");
//     setIsSubmitting(false);
//     return;
//   }

//   const transferOrderId = res.data.outputValues.transferOrderId;
//    const responseStatus = res.data.outputValues.responseStatus;

//     if (responseStatus === "failed") {
//       showToast("danger", "Exception", res.data.outputValues.outputMessage);
//        setIsSubmitting(false);
//       return;
//     }

//   showToast("success", "Success", `Transfer order created successfully`);

//    navigate(`/inventory/transferorders/${transferOrderId}`);


// };


//   const totalItems = transferList.length;
//   const totalQuantity = transferList.reduce((sum, i) => sum + parseFloat(i.quantity) || 0, 0);

//   const transferColumns = [
//     {
//       key: "sku",
//       label: "SKU",
//       align: "left",
//       render: (row) => (
//         <div>
//           <div className="text-xs text-gray-700 font-mono">{row.sku}</div>
//         </div>
//       ),
//     },
//   {
//       key: "product",
//       label: "Product",
//       align: "left",
//       render: (row) => (
//         <div>
//           <div className="font-medium">{row.productDescription}</div>
//         </div>
//       ),
//     },
//     {
//       key: "quantity",
//       label: "Quantity",
//       align: "left",
//       render: (row) => {
//         const index = transferList.findIndex((i) => i.id === row.id);
//         return (
//           <div className="flex items-center gap-1.5">
//             <Input
//               type="number"
//              // placeholder="0"
//               value={row.quantity}
//               onChange={(e) => {
//                 const updatedList = [...transferList];
//                 updatedList[index].quantity = e.target.value;
//                 setTransferList(updatedList);
//               }}
//             />
//             {row.measurementUnitName}
//           </div>
//         );
//       },
//     },
//     {
//       key: "actions",
//       label: "",
//       align: "right",
//       render: (row) => (
//         <button
//           onClick={() => removeItem(row.id)}
//           className="text-[#FF3B30] hover:bg-red-50 p-2 rounded-lg transition-colors"
//         >
//           <FaTrash />
//         </button>
//       ),
//     },
//   ];


//   const clearForm = () => {
//     setSourceStore({ ...sourceStore, value: "", isTouched: false, isValid: false });
//     setDestinationStore({ ...destinationStore, value: "", isTouched: false, isValid: false });
//     setTransferDate({ ...transferDate, value: moment().format("YYYY-MM-DD"), isTouched: false, isValid: true });
//     setNotes({ ...notes, value: "", isTouched: false, isValid: true });
//     setTransferList([]);
//   };



//   return (
//     <div className="min-h-screen bg-[#F2F2F7] p-3 sm:p-4 md:p-6 lg:p-7 pb-20 sm:pb-15 font-sans">
//       <div className="max-w-[1060px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-6">
//         {/* ── Top bar ── */}
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-0.5 pb-1">
//           <div>
//             <div className="text-xl md:text-2xl lg:text-[26px] font-bold text-[#1C1C1E] tracking-[-0.4px] leading-none flex items-center gap-2 md:gap-3">
//               Transfer Order
//               <div className="inline-flex items-center gap-1.5 bg-[rgba(0,122,255,0.10)] rounded-full px-2 py-0.5 text-xs font-semibold text-[#007AFF]">
//                 {/* {transferNo} <span className="opacity-60 font-medium">• In transit</span> */}
//               </div>
//             </div>
//             {/* <div className="text-xs text-[#6D6D72] mt-1">Jun 17, 2021 • Ordered by: Owner</div> */}
//           </div>

//           <div className="flex items-center gap-2">
       
//              <Button variant="default"   onClick={() => navigate("/inventory/transferorders/list")} className="w-full sm:w-auto ">
//                  View All Transfers
//                         </Button>
//           </div>
//         </div>

//     <BatchSelectionDialog
//       visible={isBatchedItemsModalOpen}
//       onHide={() => setIsBatchedItemsModalOpen(false)}
//      // selectedProduct={selectedProduct}
//      // selectedVariationProduct={selectedVariationProduct}
//       batchedItemList={batchedItemList}
//       onBatchSelect={(selectedBatch) => addItemstoOrderListFinal(selectedBatch, addOrderTemp)}
//     />



//         <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
//           {/* ── Transfer Details Card ── */}
//            <div className="bg-white rounded-lg border border-gray-200">
//               <div className="p-3 sm:p-4 md:p-5">
//               <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
//                 <Field label="Source store" required>
//                   <Select
//                     value={sourceStore.value}
//                     onChange={(e) =>
//                       handleInputChange(
//                         setSourceStore,
//                         sourceStore,
//                         e.target.value,
//                       )
//                     }
//                   >
//                     <option value="" disabled>
//                       Select a store
//                     </option>
//                     {storeOptions.map((s) => (
//                       <option key={s.storeId} value={s.storeId}>
//                         {s.storeName}
//                       </option>
//                     ))}
//                   </Select>
//                 </Field>

//                 <Field label="Destination store" required>
//                   <Select
//                     value={destinationStore.value}
//                     onChange={(e) =>
//                       handleInputChange(
//                         setDestinationStore,
//                         destinationStore,
//                         e.target.value,
//                       )
//                     }
//                   >
//                     <option value="" disabled>
//                       Select a store
//                     </option>
//                     {storeOptions.map((s) => (
//                       <option key={s.storeId} value={s.storeId}>
//                         {s.storeName}
//                       </option>
//                     ))}
//                   </Select>
//                 </Field>

//                 <Field label="Date of transfer order" required>
//                   <Input
//                     type="date"
//                     value={transferDate.value}
//                     onChange={(e) =>{
//                       console.log('dateee',e.target.value)
//                       handleInputChange(
//                         setTransferDate,
//                         transferDate,
//                         e.target.value,
//                       )
//                     }
//                     }
//                   />
//                 </Field>

//                 <div className="lg:col-span-3 md:col-span-2">
//                   <Field label="Notes">
//                     <TextAreaField
//                       value={notes.value}
//                       onChange={(e) =>
//                         setNotes({ ...notes, value: e.target.value })
//                       }
//                       rows={2}
//                       maxLength={500}
//                     />
//                     <div className="text-right text-xs text-[#AEAEB2] mt-0.5">
//                       {notes.value.length} / 500
//                     </div>
//                   </Field>
//                 </div>
//               </div>
//             </div>
//           </div>


//           <div className="relative z-10">
//             <ProductSearch
//               hideSearchBox={true}
//               onProductSelect={onProductSelect}
//               onlyAllowToSelectStockTrackedProduct={true}
//             />
//           </div>



//           {/* ── Line Items Card (matches both screenshots perfectly) ── */}
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
           
           
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 sm:px-4 md:px-5 py-3 sm:py-3 md:py-4 border-b gap-2">
//               <div className="flex items-center gap-2 md:gap-2.5">
//                     <ListIcon className="w-4 h-4 text-gray-500" />
//                 <div className="font-semibold text-gray-500">
//                  {totalItems}  Items 
   
//                 </div>
//               </div>
//               <div className="font-semibold text-gray-500 sm:text-right">
//                 Total qty: {totalQuantity}
//               </div>
//             </div>

//             {/* Desktop Table View */}
//               <div className="overflow-x-auto p-4">
//               {transferList.length > 0 ? (
//                 <ReusableTable
//                   columns={transferColumns}
//                   data={transferList}
//                   emptyMessage="No items yet"
//                 />
//               ) : (
//               <div className="flex flex-col items-center justify-center py-10 gap-2 bg-white text-gray-700">
//                   <div className="text-gray-500 italic">No items added yet</div>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden">
//               {transferList.length > 0 ? (
//                 <div className="divide-y divide-gray-100">
//                   {transferList.map((item, index) => (
//                     <div key={item.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors">
//                       <div className="flex justify-between items-start gap-3 mb-4">
//                         <div className="flex-1 min-w-0">
//                           <div className="font-medium text-[#1C1C1E] text-sm leading-tight">{item.productDescription}</div>
//                           <div className="text-xs text-[#6D6D72] font-mono mt-1 truncate">{item.sku}</div>
//                         </div>
//                         <button
//                           onClick={() => removeItem(item.id)}
//                           className="text-[#FF3B30] hover:bg-red-50 active:bg-red-100 p-2.5 rounded-lg flex-shrink-0 touch-manipulation transition-colors"
//                           aria-label="Remove item"
//                         >
//                           <FaTrash className="w-4 h-4" />
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 text-xs mb-4">
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <div className="text-[#6D6D72] mb-1 font-medium">Source Stock</div>
//                           <div className="font-semibold text-[#1C1C1E] text-sm">{item.sourceStock || '0'}</div>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-3">
//                           <div className="text-[#6D6D72] mb-1 font-medium">Dest. Stock</div>
//                           <div className="font-semibold text-[#1C1C1E] text-sm">{item.destinationStock || '0'}</div>
//                         </div>
//                       </div>

//                       <div className="bg-blue-50 rounded-lg p-3">
//                         <div className="text-xs text-[#6D6D72] mb-2 font-medium">Transfer Quantity</div>
//                         <div className="flex items-center gap-3">
//                           <div className="flex-1">
//                             <Input
//                               type="number"
//                               //placeholder="0"
//                               value={item.quantity}
//                               onChange={(e) => {
//                                 const updatedList = [...transferList];
//                                 updatedList[index].quantity = e.target.value;
//                                 setTransferList(updatedList);
//                               }}
//                               className="text-sm h-10"
//                               min="0"
//                               step="0.01"
//                             />
//                           </div>
//                           <div className="text-sm text-[#6D6D72] font-medium px-2 py-1 bg-white rounded border">
//                             {item.measurementUnitName}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="py-16 text-center">
//                   <div className="text-4xl mb-3">📦</div>
//                   <div className="text-[#AEAEB2] text-sm font-medium">No items yet</div>
//                   <div className="text-[#AEAEB2] text-xs mt-1">Use search above to add products</div>
//                 </div>
//               )}
//             </div>

//           </div>

//           {/* ── Footer Actions ── */}
//           <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 pt-4 pb-4 sm:pb-0">
//             <Button variant="default" onClick={clearForm} className="w-full sm:w-auto ">
//               Clear
//             </Button>

//             <SubmitButton isSubmitting={isSubmitting} text={isSubmitting ? "Creating transfer..." : "Create Transfer Order"} />
          
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TransferOrder;