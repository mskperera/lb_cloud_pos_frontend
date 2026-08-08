import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import FormElementMessage from "../messges/FormElementMessage";
import ProductSearch from "../productSearch/ProductSearch";
import { useToast } from "../useToast";
import { getSuppliers } from "../../functions/dropdowns";
import TextAreaField from "../inputField/TextAreaField";
import { formatCurrency } from "../../utils/format";
import { stockAdd } from "../../functions/stockEntry";
import { useNavigate } from "react-router-dom";
import { validate } from "../../utils/formValidation";
import { FaTimes, FaTrash } from "react-icons/fa";
import Select from "../../components/inputField/Select";
import Input from "../../components/inputField/Input";
import Field from "../inputField/Field";
import SubmitButton from "../buttons/SubmitButton";
import ReusableTable from "../ReusableTable";
import { ListIcon } from "lucide-react";
import Button from "../buttons/Button";
import { getInventoryLastPricing } from "../../functions/store";

/* ─── Tiny helpers (now pure Tailwind) ───────────────────────────────────── */




/* ─── Component (ALL CUSTOM CSS → Tailwind + arbitrary values) ───────────── */
const StockEntry = () => {


  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const showToast = useToast();
  const [stockEntryList, setStockEntryList] = useState([]);
  const [stockEntry, setStockEntry] = useState(null);
  const costInputRef = useRef(null);
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
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDrpSupplier();
  }, []);

  const loadDrpSupplier = async () => {
    const objArr = await getSuppliers();
    console.log("objArr", objArr.data.results[0]);
    setSupplierOptions(objArr.data.results[0]);
  };

  const handleInputChange = (setState, state, value) => {
    console.log('handd iinpu',value)
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
      return;
    }
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
        <div className="mt-1">
          {state.validationMessages.map((message, index) => (
            <FormElementMessage key={index} severity="error" text={message} />
          ))}
        </div>
      )
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!supplierBillNo.value || !supplier.value || !amountPaid.value) {
      showToast("danger", "Exception", "Fill all required fields.");
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
      supplierId: supplier.value,
      storeId: store.storeId,
      stockReceivedDate: grnDate.value,
      amountPaid: amountPaid.value,
      remark: remark.value,
      supplierBillNo: supplierBillNo.value,
      orderList,
      isConfirm: true,
    };

    setIsSubmitting(true);
    const res = await stockAdd(payLoad);
    console.log('stockAdd result', res);

    setIsSubmitting(false);
 
    if (res.data.error) {
      showToast("danger", "Exception", res.data.error.message);
      return;
    }

    const responseStatus = res.data.outputValues.responseStatus;

    if (responseStatus === "failed") {
      showToast("danger", "Exception", res.data.outputValues.outputMessage);
      return;
    }

      console.log('res.data.outputValues', res.data.outputValues);
    showToast("success", "Success", res.data.outputValues.outputMessage);

    setSupplierBillNo({ ...supplierBillNo, value: "" });
    setSupplier({ ...supplier, value: "" });
    setAmountPaid({ ...amountPaid, value: "" });
    setStockEntryList([]);
  };

  const addProductHandler = () => {
    if (!stockEntry) {
      showToast("danger", "No product selected", "Please select a product before adding it to the list.");
      return;
    }

    const missingFields = [];
    if (!stockEntry.unitPrice) missingFields.push("unit price");
    if (!stockEntry.unitCost) missingFields.push("unit cost");
    if (!stockEntry.qty) missingFields.push("quantity");

    if (missingFields.length > 0) {
      showToast(
        "danger",
        "Required fields missing",
        `${missingFields.join(", ")} ${missingFields.length === 1 ? "is" : "are"} required.`
      );
      return;
    }

    if (stockEntry.isExpiringProduct === 1) {
      if (!stockEntry.productionDate) {
        showToast(
          "danger",
          "Production date required",
          "Production date is required for expiring products."
        );
        return;
      }

      if (!stockEntry.expirationDate) {
        showToast(
          "danger",
          "Expiration date required",
          "Expiration date is required for expiring products."
        );
        return;
      }
    }

    setStockEntryList((prev) => [...prev, stockEntry]);
    setStockEntry(null);

   // showToast("success", "Success", "Product added to the list.");
  };

  const handleProductClick = async (p) => {
    console.log("unitPrice", p);


 const lastPricing = await getInventoryLastPricing(p.inventoryId);

    console.log("lastPricing", lastPricing);

    const order = { ...p, unitCost: lastPricing.data.unitCost, unitPrice: lastPricing.data.unitPrice, taxPerc: lastPricing.data.taxPerc };
    setStockEntry(order);
    
  };

  // useEffect(() => {
  //   if (stockEntry && costInputRef.current) {
  //     costInputRef.current.focus();
  //   }
  // }, [stockEntry]);

  const totalCost = stockEntryList.reduce(
    (acc, item) => acc + item.qty * item.unitCost,
    0
  );

  const stockEntryColumns = [
    {
      key: "sku",
      label: "SKU",
      align: "left",
      render: (row) => (
        <span className="inline-block bg-gray-100 border border-[#E5E5EA] rounded-[8px] px-2 py-0.5 text-xs font-semibold text-[#6D6D72] font-mono">
          {row.sku}
        </span>
      ),
    },
    {
      key: "productDescription",
      label: "Product",
      align: "left",
    },
    {
      key: "qty",
      label: "Qty",
      align: "center",
      render: (row) => `${row.qty} ${row.measurementUnitName}`,
    },
 
    {
      key: "unitCost",
      label: "Unit Cost",
      align: "right",
      render: (row) => row.unitCost,
    },
    {
      key: "unitPrice",
      label: "Unit Price",
      align: "right",
      render: (row) => row.unitPrice,
    },
        {
      key: "taxPerc",
      label: "Tax %",
      align: "right",
      render: (row) => row.taxPerc,
    },
       {
      key: "dates",
      label: "Prod + Exp Dates",
      align: "left",
      render: (row) => (row.productionDate ? `${row.productionDate} → ${row.expirationDate}` : "—"),
    },

    // {
    //   key: "total",
    //   label: "Total",
    //   align: "right",
    //   render: (row) => (row.qty * row.unitCost).toFixed(2),
    // },
    {
      key: "actions",
      label: "Action",
      align: "center",
      render: (row) => (
        <button
          type="button"
          onClick={() => setStockEntryList((l) => l.filter((item) => item !== row))}
          className="w-8 h-8 rounded-sm bg-transparent flex items-center justify-center text-gray-700 hover:bg-[rgba(255,59,48,0.08)] hover:text-[#FF3B30] transition-all"
        >
          <FaTrash />
        </button>
      ),
    },
  ];

  return (

    <div className="min-h-screen p-7 pb-15 font-sans">
      <div className="max-w-[1060px] mx-auto flex flex-col gap-4">
        {/* ── Top bar ── */}
        <div className="flex items-end justify-between px-0.5 pb-1">
          <div>
            <div className="text-[26px] font-bold text-[#1C1C1E] tracking-[-0.5px] leading-none">
              Stock Entry
            </div>
         
          </div>

 <Button variant="default"  onClick={() => navigate("/inventory/stockentry/list")} className="w-full sm:w-auto ">
              View Entries
            </Button>
        
        </div>

        {/* ── GRN Info Card ── */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200">
     

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3.5">
                <Field label="Supplier Bill No" required>
                  <Input
                    type="text"
                    placeholder="Enter bill number"
                    value={supplierBillNo.value}
                    onChange={(e) => handleInputChange(setSupplierBillNo, supplierBillNo, e.target.value)}
                  />
                  {validationMessages(supplierBillNo)}
                </Field>

                <Field label="Supplier" required>
                
                    <Select
  value={supplier.value}
  onChange={(e) => handleInputChange(setSupplier, supplier, e.target.value)}
>
                    <option value="">Select supplier…</option>
                    {supplierOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.displayName}
                      </option>
                    ))}
                  </Select>
                  {validationMessages(supplier)}
                </Field>



            


                <Field label="GRN Date" required>
                  <Input
                    type="date"
                    value={grnDate.value}
                    onChange={(e) => handleInputChange(setGrnDate, grnDate, e.target.value)}
                  />
                  {validationMessages(grnDate)}
                </Field>
              </div>
            </div>
          </div>

      {/* ── Product Search ── */}
<ProductSearch 
  onProductSelect={handleProductClick} 
  onBarcodeEnter={handleProductClick} 
  showOnlyProductItems={true} 
  onlyAllowToSelectStockTrackedProduct={true} 
/>
{JSON.stringify(stockEntry)}
          {/* ── Selected Product Panel ── */}
          {stockEntry && (
            <div className="bg-white rounded-lg p-5 transition-all">
              <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[rgba(0,122,255,0.12)] gap-3 flex-wrap">
                <div>
                  <div className="text-[15px] font-bold text-[#1C1C1E]">{stockEntry.productDescription}</div>
             </div>
                <div className="px-3 py-1 bg-slate-100  rounded-full whitespace-nowrap">
                   <div className=" text-gray-500 mt-0.5 font-medium">SKU: {stockEntry.sku}</div>
               
                </div>

   {stockEntry.isBatchTracked ? (
                    <span className="inline-flex items-center rounded-full bg-[#1d4ed8] px-3 py-1 text-xs font-semibold text-white">
                      Batch Tracked
                    </span>
                  ) : null}
              

                 <button
                            type="button"
                            onClick={() => {setStockEntry(null)}}
                            className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-gray-700 hover:bg-[rgba(255,59,48,0.08)] hover:text-[#FF3B30] transition-all"
                          >
                            <FaTimes />
                          </button>

              </div>

              <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 items-center">

                   <Field label="Unit Cost" required>
                  <Input
                    ref={costInputRef}
                    type="number"
                    //placeholder="0.00"
                    value={stockEntry.unitCost}
                    onChange={(e) => setStockEntry({ ...stockEntry, unitCost: e.target.value })}
                  />
                </Field>

             <Field label="Unit Price" required>
                  <Input
                   // ref={priceInputRef}
                    type="number"
                    //placeholder="0.00"
                    value={stockEntry.unitPrice}
                    onChange={(e) => setStockEntry({ ...stockEntry, unitPrice: e.target.value })}
                  />
                </Field>

             <Field label="Tax (%)" required>
                  <Input
                   // ref={priceInputRef}
                    type="number"
                    //placeholder="0.00"
                    value={stockEntry.taxPerc}
                    onChange={(e) => setStockEntry({ ...stockEntry, taxPerc: e.target.value })}
                  />
                </Field>


                      <Field label="Qty" required>
                <div className="flex items-end gap-1.5 mr-5">
                  <Input
                    type="number"
                    placeholder="0"
                    value={stockEntry.qty}
                    onChange={(e) => setStockEntry({ ...stockEntry, qty: e.target.value })}
                  />
                  <span className="font-semibold text-gray-700 pb-2 whitespace-nowrap">
                    {stockEntry.measurementUnitName}
                  </span>
                </div>
                </Field>


                {stockEntry.isExpiringProduct === 1 && (
                  <>
                    <Field label="Production Date" required>
                      <Input
                        type="date"
                        value={stockEntry.productionDate || ""}
                        onChange={(e) => setStockEntry({ ...stockEntry, productionDate: e.target.value })}
                      />
                    </Field>
                    <Field label="Expiration Date" required>
                      <Input
                        type="date"
                        value={stockEntry.expirationDate || ""}
                        onChange={(e) => setStockEntry({ ...stockEntry, expirationDate: e.target.value })}
                      />
                    </Field>
                  </>
                )}

   
   
         <div className="md:col-span-4 flex justify-center mt-5">
                  <button
                    type="button"
                    onClick={addProductHandler}
                    disabled={stockEntry.isStockTracked === "0"}
                    className="bg-sky-600 px-6 text-white font-bold rounded-full py-2.5 hover:bg-sky-700 disabled:cursor-not-allowed"
                  >
                    Add to List
                  </button>
                </div>
   
           
              </div>

              {stockEntry.isStockTracked === "0" && (
                <div className="mt-4 bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.2)] rounded-[10px] p-3 flex items-center gap-2 text-sm font-medium text-[#FF3B30]">
                  ⚠️ Stock tracking is disabled for this product. Enable it to proceed.
                </div>
              )}
            </div>
          )}

          {/* ── Line Items Card ── */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2.5">
                 <ListIcon className="w-4 h-4" />
                
                <div className="font-semibold text-lg text-gray-700">Product List</div>
              </div>
              {stockEntryList.length > 0 && (
                <div className="font-medium text-gray-700">
                  {stockEntryList.length} item{stockEntryList.length > 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="overflow-x-auto p-4">
              {stockEntryList.length > 0 ? (
                <ReusableTable
                  columns={stockEntryColumns}
                  data={stockEntryList}
                  emptyMessage="No items added yet"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2 bg-white text-gray-700">
                  <div className="text-gray-500 italic">No items added yet</div>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer: Remark + Summary ── */}
          <div className="">
            <div className="grid grid-cols-1 lg:grid-cols-4 bg-white border border-gray-200 rounded-lg p-4 gap-5">
              <div className="lg:col-span-3">
                <Field label="Remark">
                  <TextAreaField
                    value={remark.value}
                    onChange={(e) => setRemark({ ...remark, value: e.target.value })}
                    rows={4}
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-5 w-full">
                <div className="flex justify-between items-center gap-3 p-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-base font-semibold text-gray-700">Total Cost</span>
                  <span className="text-xl font-bold text-gray-700 tracking-[-0.3px]">
                    {formatCurrency(totalCost)}
                  </span>
                </div>

                <Field label="Amount Paid" required message={validationMessages(amountPaid)}>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amountPaid.value}
                    onChange={(e) => handleInputChange(setAmountPaid, amountPaid, e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <SubmitButton text={isSubmitting ? "Submitting…" : "Submit Stock Entry"} disabled={isSubmitting} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEntry;
