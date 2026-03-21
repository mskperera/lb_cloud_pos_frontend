import React, { useEffect, useState } from "react";
import moment from "moment";
import FormElementMessage from "../messges/FormElementMessage";
import InputField from "../inputField/InputField";
import ProductSearch from "../productSearch/ProductSearch";
import { useToast } from "../useToast";
import { getSuppliers } from "../../functions/dropdowns";
import TextAreaField from "../inputField/TextAreaField";
import { formatCurrency } from "../../utils/format";
import { stockAdd } from "../../functions/stockEntry";
import { useNavigate } from "react-router-dom";
import { validate } from "../../utils/formValidation";
import { FaTrash } from "react-icons/fa";

/* ─── Tiny helpers (now pure Tailwind) ───────────────────────────────────── */
const Field = ({ label, required = false, children, message }) => (
  <div className="flex flex-col gap-1.5">
    <div className="text-[11.5px] font-semibold tracking-[0.4px] uppercase text-[#6D6D72]">
      {label}
      {required && <span className="ml-0.5 text-[#007AFF]">*</span>}
    </div>
    {children}
    {message}
  </div>
);

const Input = (props) => (
  <input
    className="w-full px-3.5 py-2.5 text-[14px] font-medium text-[#1C1C1E] bg-[#F9F9FB] border-[1.5px] border-[#E5E5EA] rounded-[13px] outline-none transition-[border,box-shadow,background] duration-150 placeholder:text-[#AEAEB2] placeholder:font-normal focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3.5px_rgba(0,122,255,0.22)] read-only:bg-[#F2F2F7] read-only:border-transparent read-only:text-[#AEAEB2] disabled:cursor-default"
    {...props}
  />
);

const Select = ({ children, ...props }) => (
  <select
    className="w-full px-3.5 py-2.5 text-[14px] font-medium text-[#1C1C1E] bg-[#F9F9FB] border-[1.5px] border-[#E5E5EA] rounded-[13px] outline-none transition-[border,box-shadow,background] duration-150 focus:border-[#007AFF] focus:bg-white focus:shadow-[0_0_0_3.5px_rgba(0,122,255,0.22)] cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 fill=%27none%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 stroke=%27%23AEAEB2%27 stroke-width=%271.6%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_13px_center] pr-9"
    {...props}
  >
    {children}
  </select>
);

/* ─── Component (ALL CUSTOM CSS → Tailwind + arbitrary values) ───────────── */
const StockEntry = () => {


  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const showToast = useToast();
  const [stockEntryList, setStockEntryList] = useState([]);
  const [stockEntry, setStockEntry] = useState(null);
  const [grnNo, setGrnNo] = useState("[New]");
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
    label: "Remark",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpiringProductChecked, setIsExpiringProductChecked] = useState(false);

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
      productId: entry.productTypeId === 2 ? entry.variationProductId : entry.productId,
      unitPrice: entry.unitPrice,
      unitCost: entry.unitCost,
      qty: entry.qty,
      productTypeId: entry.productTypeId,
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
    setIsSubmitting(false);

    if (res.data.error) {
      showToast("danger", "Exception", res.data.error.message);
      return;
    }

    const responseStatus = res.data.outputValues.responseStatus;

    if (responseStatus === "failed") {
      showToast("danger", "Exception", "Fill all required fields.");
      return;
    }

    showToast("success", "Success", res.data.outputValues.outputMessage);

    setSupplierBillNo({ ...supplierBillNo, value: "" });
    setSupplier({ ...supplier, value: "" });
    setAmountPaid({ ...amountPaid, value: "" });
    setStockEntryList([]);
  };

  const addProductHandler = () => {
    if (
      !stockEntry ||
      !stockEntry.unitPrice ||
      !stockEntry.unitCost ||
      !stockEntry.qty
    ) {
      showToast("danger", "Exception", "Fill all required fields.");
      return;
    }

    if (
      stockEntry.isExpiringProduct === 1 &&
      (!stockEntry.productionDate || !stockEntry.expirationDate)
    ) {
      showToast(
        "danger",
        "Exception",
        "Expiration date and production date are required."
      );
      return;
    }
    setStockEntryList((prev) => [...prev, stockEntry]);
    setStockEntry(null);
    showToast("success", "Success", "Product added to the list.");
  };

  const handleProductClick = (p) => {
    console.log("unitPrice", p);
    const order = { ...p };
    setStockEntry(order);
  };

  const totalCost = stockEntryList.reduce(
    (acc, item) => acc + item.qty * item.unitCost,
    0
  );


  return (

    <div className="min-h-screen bg-[#F2F2F7] p-7 pb-15 font-sans">
      <div className="max-w-[1060px] mx-auto flex flex-col gap-4">
        {/* ── Top bar ── */}
        <div className="flex items-end justify-between px-0.5 pb-1">
          <div>
            <div className="text-[26px] font-bold text-[#1C1C1E] tracking-[-0.5px] leading-none">
              Stock Entry
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 bg-[rgba(0,122,255,0.10)] rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#007AFF]">
              GRN {grnNo}
              <span className="opacity-60 font-medium">New</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/inventory/stockentry/list")}
            className="flex items-center gap-1.5 bg-white border border-[#E5E5EA] rounded-[9999px] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer transition-all hover:bg-[rgba(0,122,255,0.10)] hover:border-[#007AFF] hover:-translate-y-px shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.05)] active:translate-y-0"
          >
            View Entries
          </button>
        </div>

        {/* ── GRN Info Card ── */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="bg-white rounded-[18px] border border-[#E5E5EA] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-[rgba(0,122,255,0.10)] text-[#007AFF] flex items-center justify-center text-sm">
                  📦
                </div>
                <div className="text-sm font-semibold text-[#1C1C1E] tracking-[-0.1px]">GRN Details</div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                    value={supplier.id}
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
               <ProductSearch onProductSelect={handleProductClick} showOnlyProductItems={true} />

          {/* ── Selected Product Panel ── */}
          {stockEntry && (
            <div className="bg-gradient-to-br from-[#F5F9FF] to-[#EFF5FF] border-[1.5px] border-[rgba(0,122,255,0.14)] rounded-[18px] p-5 transition-all">
              <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[rgba(0,122,255,0.12)] gap-3 flex-wrap">
                <div>
                  <div className="text-[15px] font-bold text-[#1C1C1E]">{stockEntry.productDescription}</div>
                  <div className="text-xs text-[#6D6D72] mt-0.5 font-medium">SKU: {stockEntry.productNo}</div>
                </div>
                <div className="px-3 py-1 bg-[rgba(0,122,255,0.10)] text-[#007AFF] text-[11px] font-bold tracking-[0.3px] uppercase rounded-full whitespace-nowrap">
                  {stockEntry.productTypeName}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
                {/* Unit Cost */}
                <div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stockEntry.unitCost || ""}
                    onChange={(e) => setStockEntry({ ...stockEntry, unitCost: e.target.value })}
                  />
                </div>

                {/* Quantity + Unit */}
                <div className="flex items-end gap-1.5">
                  <Input
                    type="number"
                    placeholder="0"
                    value={stockEntry.qty || ""}
                    onChange={(e) => setStockEntry({ ...stockEntry, qty: e.target.value })}
                  />
                  <span className="text-xs font-semibold text-[#6D6D72] pb-2 whitespace-nowrap">
                    {stockEntry.measurementUnitName}
                  </span>
                </div>

                {/* Production / Expiration (if expiring) */}
                {stockEntry.isExpiringProduct === 1 && (
                  <>
                    <div>
                      <Input
                        type="date"
                        value={stockEntry.productionDate || ""}
                        onChange={(e) => setStockEntry({ ...stockEntry, productionDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={stockEntry.expirationDate || ""}
                        onChange={(e) => setStockEntry({ ...stockEntry, expirationDate: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {/* Add Button */}
                <button
                  type="button"
                  onClick={addProductHandler}
                  disabled={stockEntry.isStockTracked === "0"}
                  className="col-span-full lg:col-span-1 bg-[#007AFF] text-white text-sm font-bold rounded-[13px] py-2.5 transition-all hover:bg-[#0066DD] hover:shadow-[0_4px_14px_rgba(0,122,255,0.32)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add to List
                </button>
              </div>

              {stockEntry.isStockTracked === "0" && (
                <div className="mt-4 bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.2)] rounded-[10px] p-3 flex items-center gap-2 text-sm font-medium text-[#FF3B30]">
                  ⚠️ Stock tracking is disabled for this product. Enable it to proceed.
                </div>
              )}
            </div>
          )}

          {/* ── Line Items Card ── */}
          <div className="bg-white rounded-[18px] border border-[#E5E5EA] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-[rgba(52,199,89,0.12)] text-[#34C759] flex items-center justify-center text-sm">
                  📋
                </div>
                <div className="text-sm font-semibold text-[#1C1C1E]">Line Items</div>
              </div>
              {stockEntryList.length > 0 && (
                <div className="text-xs font-medium text-[#6D6D72]">
                  {stockEntryList.length} item{stockEntryList.length > 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              {stockEntryList.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F9F9FB]">
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72] rounded-tl-[10px]">
                        SKU
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Product
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Type
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Qty
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Dates
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Unit Cost
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Unit Price
                      </th>
                      <th className="px-3.5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72]">
                        Total
                      </th>
                      <th className="px-3.5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.5px] text-[#6D6D72] rounded-tr-[10px]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockEntryList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[rgba(0,122,255,0.03)] transition-colors">
                        <td className="px-3.5 py-3">
                          <span className="inline-block bg-[#F2F2F7] border border-[#E5E5EA] rounded-[8px] px-2 py-0.5 text-xs font-semibold text-[#6D6D72] font-mono">
                            {item.sku}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[#48484A] font-medium">{item.productDescription}</td>
                        <td className="px-3.5 py-3 text-sm text-[#48484A] font-medium">{item.productTypeName}</td>
                        <td className="px-3.5 py-3 text-sm text-[#48484A] font-medium">
                          {item.qty} {item.measurementUnitName}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[#48484A] font-medium">
                          {item.productionDate ? `${item.productionDate} → ${item.expirationDate}` : "—"}
                        </td>
                        <td className="px-3.5 py-3 text-sm text-[#48484A] font-medium">{item.unitCost}</td>
                        <td className="px-3.5 py-3 text-sm text-[#48484A] font-medium">{item.unitPrice}</td>
                        <td className="px-3.5 py-3 text-sm text-[#1C1C1E] font-bold">
                          {(item.qty * item.unitCost).toFixed(2)}
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setStockEntryList((l) => l.filter((_, i) => i !== idx))}
                            className="w-8 h-8 rounded-[8px] bg-transparent flex items-center justify-center text-[#AEAEB2] hover:bg-[rgba(255,59,48,0.08)] hover:text-[#FF3B30] transition-all"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#AEAEB2]">
                  <div className="text-4xl opacity-40">📦</div>
                  <div className="text-sm font-medium">No items added yet</div>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer: Remark + Summary ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
            <Field label="Remark">
              <TextAreaField
                value={remark.value}
                onChange={(e) => setRemark({ ...remark, value: e.target.value })}
                className="min-h-[96px]" /* if TextAreaField accepts className */
              />
            </Field>

            <div className="flex flex-col gap-3.5">
              <div className="bg-[#F9F9FB] border border-[#E5E5EA] rounded-[13px] p-4 flex flex-col gap-3 min-w-[240px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-[#6D6D72]">Total Cost</span>
                  <span className="text-[16px] font-bold text-[#1C1C1E] tracking-[-0.3px]">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
                <div className="h-px bg-[#E5E5EA]" />

                <Field label="Amount Paid" required message={validationMessages(amountPaid)}>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amountPaid.value}
                    onChange={(e) => handleInputChange(setAmountPaid, amountPaid, e.target.value)}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#007AFF] text-white text-[15px] font-bold rounded-[13px] flex items-center justify-center gap-2 transition-all hover:bg-[#0062CC] hover:shadow-[0_6px_20px_rgba(0,122,255,0.35)] disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 16 16" width="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                    Submit Stock Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEntry;





// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import FormElementMessage from "../messges/FormElementMessage";
// import InputField from "../inputField/InputField";
// import ProductSearch from "../productSearch/ProductSearch";
// import { useToast } from "../useToast";
// import { getSuppliers } from "../../functions/dropdowns";
// import TextAreaField from "../inputField/TextAreaField";
// import { formatCurrency } from "../../utils/format";
// import { stockAdd } from "../../functions/stockEntry";
// import { useNavigate } from "react-router-dom";
// import { validate } from "../../utils/formValidation";
// import { FaTrash } from "react-icons/fa";

// const StockEntry = () => {
//   const navigate = useNavigate();
//   const store = JSON.parse(localStorage.getItem("selectedStore"));
//   const showToast = useToast();
//   const [stockEntryList, setStockEntryList] = useState([]);
//   const [stockEntry, setStockEntry] = useState(null);
//   const [grnNo, setGrnNo] = useState("[New]");
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
//     label: "Remark",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isExpiringProductChecked, setIsExpiringProductChecked] = useState(false);

//   useEffect(() => {
//     loadDrpSupplier();
//   }, []);

//   const loadDrpSupplier = async () => {
//     const objArr = await getSuppliers();
//     console.log("objArr", objArr.data.results[0]);
//     setSupplierOptions(objArr.data.results[0]);
//   };

//   const handleInputChange = (setState, state, value) => {
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
//       productId: entry.productTypeId === 2 ? entry.variationProductId : entry.productId,
//       unitPrice: entry.unitPrice,
//       unitCost: entry.unitCost,
//       qty: entry.qty,
//       productTypeId: entry.productTypeId,
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
//     setIsSubmitting(false);

//     if (res.data.error) {
//       showToast("danger", "Exception", res.data.error.message);
//       return;
//     }

//     const responseStatus = res.data.outputValues.responseStatus;

//     if (responseStatus === "failed") {
//       showToast("danger", "Exception", "Fill all required fields.");
//       return;
//     }

//     showToast("success", "Success", res.data.outputValues.outputMessage);

//     setSupplierBillNo({ ...supplierBillNo, value: "" });
//     setSupplier({ ...supplier, value: "" });
//     setAmountPaid({ ...amountPaid, value: "" });
//     setStockEntryList([]);
//   };

//   const addProductHandler = () => {
//     if (
//       !stockEntry ||
//       !stockEntry.unitPrice ||
//       !stockEntry.unitCost ||
//       !stockEntry.qty
//     ) {
//       showToast("danger", "Exception", "Fill all required fields.");
//       return;
//     }

//     if (
//       stockEntry.isExpiringProduct === 1 &&
//       (!stockEntry.productionDate || !stockEntry.expirationDate)
//     ) {
//       showToast(
//         "danger",
//         "Exception",
//         "Expiration date and production date are required."
//       );
//       return;
//     }
//     setStockEntryList((prev) => [...prev, stockEntry]);
//     setStockEntry(null);
//     showToast("success", "Success", "Product added to the list.");
//   };

//   const handleProductClick = (p) => {
//     console.log("unitPrice", p);
//     const order = { ...p };
//     setStockEntry(order);
//   };

//   const totalCost = stockEntryList.reduce(
//     (acc, item) => acc + item.qty * item.unitCost,
//     0
//   );

//   return (
//     <div className="min-h-screen bg-sky-50 p-4 sm:p-6 lg:p-8">
//       <div className="container mx-auto max-w-7xl">
//         <form onSubmit={onSubmit}>
//           <div className="space-y-6">
//             {/* Header Section */}
//             <div className="text-center">
//               <h3 className="text-2xl font-bold text-gray-900">Stock Entry</h3>
//               <div className="flex justify-end mt-2">
//                 <button
//                   type="button"
//                   className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-sky-600 transition duration-200"
//                   onClick={() => navigate("/inventory/stockentry/list")}
//                 >
//                   <i className="pi pi-book text-lg"></i>
//                   <span>View Stock Entries</span>
//                 </button>
//               </div>
//             </div>

//             {/* Form Fields */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-xl border  p-6">
//               <InputField
//                 label="GRN No"
//                 value={grnNo}
//                 required={false}
//                 isReadOnly={true}
//                 placeholder="Enter GRN No"
//                 className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
//               />
//               <div className="flex flex-col">
//                 <InputField
//                   label={supplierBillNo.label}
//                   value={supplierBillNo.value}
//                   required={supplierBillNo.rules.required}
//                   onChange={(e) => handleInputChange(setSupplierBillNo, supplierBillNo, e.target.value)}
//                   validationMessages={validationMessages(supplierBillNo)}
//                   placeholder="Enter Supplier Bill No"
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">{supplier.label}</label>
//                 <select
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//                   value={supplier.value}
//                   onChange={(e) => handleInputChange(setSupplier, supplier, e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Select Supplier
//                   </option>
//                   {supplierOptions.map((option) => (
//                     <option key={option.id} value={option.id}>
//                       {option.displayName}
//                     </option>
//                   ))}
//                 </select>
//                 {validationMessages(supplier)}
//               </div>
//               <InputField
//                 label={grnDate.label}
//                 value={grnDate.value}
//                 required={grnDate.rules.required}
//                 onChange={(e) => handleInputChange(setGrnDate, grnDate, e.target.value)}
//                 validationMessages={validationMessages(grnDate)}
//                 type="date"
//                 className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//               />
//             </div>

//             {/* Product Search */}
//             <div className="bg-white rounded-xl border  p-6">
//               <ProductSearch onProductSelect={handleProductClick} showOnlyProductItems={true} />
//             </div>

//             {/* Selected Product Details */}
//             {stockEntry && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-gray-50 rounded-xl p-6 shadow-sm">
//                 <InputField
//                   label="Product No"
//                   isReadOnly={true}
//                   value={stockEntry.productNo}
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
//                 />
//                 <div className="sm:col-span-2">
//                   <InputField
//                     label="Product Description"
//                     isReadOnly={true}
//                     value={stockEntry.productDescription}
//                     className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
//                   />
//                 </div>
//                 <InputField
//                   label="Product Type"
//                   isReadOnly={true}
//                   value={stockEntry.productTypeName}
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
//                 />
//                 <InputField
//                   label="Unit Price"
//                   isReadOnly={true}
//                   type="number"
//                   value={stockEntry.unitPrice}
//                   onChange={(e) => setStockEntry({ ...stockEntry, unitPrice: e.target.value })}
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
//                 />
//                 <InputField
//                   label="Unit Cost"
//                   type="number"
//                   required={true}
//                   value={stockEntry.unitCost}
//                   onChange={(e) => setStockEntry({ ...stockEntry, unitCost: e.target.value })}
//                   placeholder="Enter Unit Cost"
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//                 />
//                 <div className="flex items-end gap-2">
//                   <InputField
//                     label="Qty"
//                     type="number"
//                     required={true}
//                     value={stockEntry.qty}
//                     onChange={(e) => setStockEntry({ ...stockEntry, qty: e.target.value })}
//                     placeholder="Enter Qty"
//                     className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//                   />
//                   <span className="text-sm text-gray-600 mb-2">{stockEntry.measurementUnitName}</span>
//                 </div>
//                 <InputField
//                   label="Production Date"
//                   value={stockEntry.productionDate}
//                   onChange={(e) => setStockEntry({ ...stockEntry, productionDate: e.target.value })}
//                   type="date"
//                   isDisabled={!stockEntry.isExpiringProduct}
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 disabled:bg-gray-100"
//                 />
//                 <InputField
//                   label="Expiration Date"
//                   value={stockEntry.expirationDate}
//                   onChange={(e) => setStockEntry({ ...stockEntry, expirationDate: e.target.value })}
//                   type="date"
//                   isDisabled={!stockEntry.isExpiringProduct}
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 disabled:bg-gray-100"
//                 />
//                 <div className="flex items-end">
//                   <button
//                     type="button"
//                     className={`w-full sm:w-1/2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
//                       stockEntry.isStockTracked === "0" ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                     onClick={addProductHandler}
//                     disabled={stockEntry.isStockTracked === "0"}
//                   >
//                     Add
//                   </button>
//                 </div>
//                 {stockEntry.isStockTracked === "0" && (
//                   <div className="col-span-5 bg-red-100 p-4 rounded-lg flex justify-center">
//                     <span className="text-sm text-red-700">
//                       This product is not stock-tracked. Enable stock tracking to add it to stock.
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Stock Entry List Table */}
//             <div className="bg-white rounded-xl border p-6 mt-6">
//               {stockEntryList.length > 0 ? (
//                 <table className="w-full border-collapse">
//                   <thead className="sticky top-0 bg-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-300">
//                     <tr>
//                                          <th className="px-4 py-3 text-left">SKU</th>
//                       <th className="px-4 py-3 text-left">Product Name</th>
//                       <th className="px-4 py-3 text-left">Product Type</th>
   
//                       <th className="px-4 py-3 text-left">Qty</th>
//                       <th className="px-4 py-3 text-left">Production & Expiration Date</th>
//                       <th className="px-4 py-3 text-left">Unit Cost</th>
//                       <th className="px-4 py-3 text-left">Unit Price</th>
//                       <th className="px-4 py-3 text-left">Total Cost</th>
//                       <th className="px-4 py-3 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stockEntryList.map((item, index) => (
//                       <tr
//                         key={index}
//                         className="border-b border-gray-200 hover:bg-gray-50 text-sm text-gray-700"
//                       >
//                                <td className="px-4 py-3">{item.sku}</td>
//                         <td className="px-4 py-3">{item.productDescription}</td>
//                         <td className="px-4 py-3">{item.productTypeName}</td>
                 
//                         <td className="px-4 py-3">{item.qty} {item.measurementUnitName}</td>
//                         <td className="px-4 py-3">{item.productionDate} - {item.expirationDate}</td>
//                         <td className="px-4 py-3">{item.unitCost}</td>
//                         <td className="px-4 py-3">{item.unitPrice}</td>
//                         <td className="px-4 py-3">{(item.qty * item.unitCost).toFixed(2)}</td>
//                         <td className="px-4 py-3">
                          
//                                     <FaTrash   className="text-red-500 hover:text-red-700 cursor-pointer"
//                             onClick={() => setStockEntryList(stockEntryList.filter((_, i) => i !== index))}
//                             title="Remove Item" />

             
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="flex justify-center items-center h-20 text-gray-500 bg-gray-50 rounded-lg">
//                   No items in the stock entry list.
//                 </div>
//               )}
//             </div>

//             {/* Remark and Total Section */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white rounded-xl border  p-6">
//               <div className="sm:col-span-2">
//                 <TextAreaField
//                   label={remark.label}
//                   value={remark.value}
//                   onChange={(e) => setRemark({ ...remark, value: e.target.value })}
//                   placeholder="Enter Remark"
//                   rows={5}
//                   className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//                 />
//               </div>
//               <div className="flex flex-col gap-4">
//                 <div className="flex justify-between">
//                   <span className="text-sm font-semibold text-gray-700">Total Cost</span>
//                   <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalCost)}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <InputField
//                     label="Amount Paid"
//                     value={amountPaid.value}
//                     type="number"
//                     onChange={(e) => handleInputChange(setAmountPaid, amountPaid, e.target.value)}
//                     validationMessages={validationMessages(amountPaid)}
//                     placeholder="Enter Paid Amount"
//                     className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center mt-6">
//               <button
//                 type="submit"
//                 className={`w-full sm:w-56 px-6 py-3 text-sm font-semibold text-white bg-sky-600 rounded-lg border  hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200 ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin h-5 w-5 mr-2 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
//                       ></path>
//                     </svg>
//                     Submitting...
//                   </span>
//                 ) : (
//                   "Submit Stock Entry"
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StockEntry;
