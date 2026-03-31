import React, { useEffect, useState } from "react";
import moment from "moment";
import FormElementMessage from "../messges/FormElementMessage";
import Input from "../inputField/InputField";
import ProductSearch from "../productSearch/ProductSearch";
import { useToast } from "../useToast";
import TextAreaField from "../inputField/TextAreaField";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { validate } from "../../utils/formValidation";
import Select from "../inputField/Select";
import Field from "../inputField/Field";
import { getUserAssignedStores } from "../../functions/store";




/* ─── Transfer Order Component (100% matching style + screenshots) ──────── */
const TransferOrder = () => {
  const navigate = useNavigate();
  const showToast = useToast();
    const store = JSON.parse(localStorage.getItem("stores")) || [];
  const [transferNo] = useState("TO1012"); // simulating new TO number
const user=JSON.parse(localStorage.getItem('user'));

  const [sourceStore, setSourceStore] = useState({
    label: "Source store",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

    const [destinationStore, setDestinationStore] = useState({
      label: "Destination store",
      value: "",
      isTouched: false,
      isValid: false,
      rules: { required: true, dataType: "string" },
    });


  const [transferDate, setTransferDate] = useState({
    label: "Date of transfer order",
    value: moment().format("YYYY-MM-DD"),
    isTouched: false,
    isValid: true,
          rules: { required: true, dataType: "date" },
  });
  const [notes, setNotes] = useState({
    label: "Notes",
    value: "",
    isTouched: false,
    isValid: true,
  });

  const [transferList, setTransferList] = useState([]);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  


  const [storeOptions,setStoreOptions] = useState([]);

  const loadDrpStores = async () => {
    const objArr = await getUserAssignedStores(user.userId);
    console.log('objArr',objArr,user.userId);
    setStoreOptions(objArr.data);
  };

  useEffect(() => {
    loadDrpStores();
  }, []);



  const handleInputChange = (setState, state, value) => {
    console.log('handd iinpu',value)
    if (!state?.rules) {
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
  

  const onProductSelect = (product) => {
 // if (!selectedItem || !selectedItem.quantity) {
    //   showToast("danger", "Exception", "Quantity is required");
    //   return;
    // }
    if(transferList.some(i=> i.sku === product.sku)){
      showToast("danger", "Exception", "Item already in transfer list");
      return;
    }

    setTransferList((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now(),
        quantity:null,
      },
    ]);
  //  setSelectedItem(null);
    showToast("success", "Success", "Item added to transfer list");
  };



  const removeItem = (id) => {
    setTransferList((prev) => prev.filter((i) => i.id !== id));
  };

const onSubmit = async (e) => {
  e.preventDefault();
  if (!sourceStore.value || !destinationStore.value || transferList.length === 0) {
    showToast("danger", "Error", "Please fill required fields and add items");
    return;
  }

  setIsSubmitting(true);

  // Simulate API → in real app → POST to backend
  setTimeout(() => {
    const newTransferNumber = "TO" + Math.floor(1000 + Math.random() * 9000); // or from backend
    showToast("success", "Success", `Transfer order ${newTransferNumber} created successfully ✓`);

    // Instead of list → go to detail view
    navigate(`/inventory/transferorders/${newTransferNumber}`);

    setIsSubmitting(false);
    // Optional: clearForm();
  }, 900);
};

  const totalItems = transferList.length;
  const totalQuantity = transferList.reduce((sum, i) => sum + parseFloat(i.quantity) || 0, 0);

  const clearForm = () => {
    setSourceStore({ ...sourceStore, value: "", isTouched: false, isValid: false });
    setDestinationStore({ ...destinationStore, value: "", isTouched: false, isValid: false });
    setTransferDate({ ...transferDate, value: moment().format("YYYY-MM-DD"), isTouched: false, isValid: true });
    setNotes({ ...notes, value: "", isTouched: false, isValid: true });
    setTransferList([]);
  };



  return (
    <div className="min-h-screen bg-[#F2F2F7] p-3 sm:p-4 md:p-6 lg:p-7 pb-20 sm:pb-15 font-sans">
      <div className="max-w-[1060px] mx-auto flex flex-col gap-3 sm:gap-4 md:gap-6">
        {/* ── Top bar ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-0.5 pb-1">
          <div>
            <div className="text-xl md:text-2xl lg:text-[26px] font-bold text-[#1C1C1E] tracking-[-0.4px] leading-none flex items-center gap-2 md:gap-3">
              Transfer Order
              <div className="inline-flex items-center gap-1.5 bg-[rgba(0,122,255,0.10)] rounded-full px-2 py-0.5 text-xs font-semibold text-[#007AFF]">
                {/* {transferNo} <span className="opacity-60 font-medium">• In transit</span> */}
              </div>
            </div>
            {/* <div className="text-xs text-[#6D6D72] mt-1">Jun 17, 2021 • Ordered by: Owner</div> */}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/inventory/transferorders/list")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white border border-[#E5E5EA] rounded-[9999px] px-4 sm:px-3 md:px-4 py-3 sm:py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[rgba(0,122,255,0.10)] active:bg-[rgba(0,122,255,0.15)] hover:border-[#007AFF] transition-colors touch-manipulation"
            >
              View All Transfers
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* ── Transfer Details Card ── */}
          <div className="bg-white rounded-lg md:rounded-[18px] border border-[#E5E5EA] overflow-hidden">
            <div className="p-3 sm:p-4 md:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
                <Field label="Source store" required>
                  <Select
                    value={sourceStore.value}
                    onChange={(e) =>
                      handleInputChange(
                        setSourceStore,
                        sourceStore,
                        e.target.value,
                      )
                    }
                  >
                    <option value="" disabled>
                      Select a store
                    </option>
                    {storeOptions.map((s) => (
                      <option key={s.storeId} value={s.storeId}>
                        {s.storeName}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Destination store" required>
                  <Select
                    value={destinationStore.value}
                    onChange={(e) =>
                      handleInputChange(
                        setDestinationStore,
                        destinationStore,
                        e.target.value,
                      )
                    }
                  >
                    <option value="" disabled>
                      Select a store
                    </option>
                    {storeOptions.map((s) => (
                      <option key={s.storeId} value={s.storeId}>
                        {s.storeName}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Date of transfer order" required>
                  <Input
                    type="date"
                    value={transferDate.value}
                    onChange={(e) =>{
                      console.log('dateee',e.target.value)
                      handleInputChange(
                        setTransferDate,
                        transferDate,
                        e.target.value,
                      )
                    }
                    }
                  />
                </Field>

                <div className="lg:col-span-3 md:col-span-2">
                  <Field label="Notes">
                    <TextAreaField
                      value={notes.value}
                      onChange={(e) =>
                        setNotes({ ...notes, value: e.target.value })
                      }
                      className="min-h-[72px]"
                      maxLength={500}
                    />
                    <div className="text-right text-xs text-[#AEAEB2] mt-0.5">
                      {notes.value.length} / 500
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>


          <div className="relative z-10">
            <ProductSearch
              hideSearchBox={true}
              onProductSelect={onProductSelect}
              showAdvancedSearcho={showAdvancedSearch}
            />
          </div>



          {/* ── Line Items Card (matches both screenshots perfectly) ── */}
          <div className="bg-white rounded-lg md:rounded-[18px] border border-[#E5E5EA] overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 sm:px-4 md:px-5 py-3 sm:py-3 md:py-4 border-b gap-2">
              <div className="flex items-center gap-2 md:gap-2.5">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-[#34C759] bg-opacity-10 text-[#34C759] rounded-[6px] md:rounded-[8px] flex items-center justify-center text-sm md:text-lg">
                  📋
                </div>
                <div className="font-semibold text-sm md:text-base">
                  Items • {totalItems} selected
                </div>
              </div>
              <div className="text-xs text-[#6D6D72] sm:text-right">
                Total qty: {totalQuantity}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              {transferList.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F9F9FB] text-left">
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                        Item
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                        Source stock
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                        Destination stock
                      </th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6D6D72]">
                        Quantity
                      </th>
                      <th className="px-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferList.map((item, index) => (
                      <tr key={item.id} className="border-t hover:bg-[#F9F9FB]">
                        <td className="px-4 py-3">
                          <div className="font-medium">{item.productDescription}</div>
                          <div className="text-xs text-[#6D6D72] font-mono">
                            {item.sku}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1C1C1E]">
                          {item.sourceStock}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#1C1C1E]">
                          {item.destinationStock}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedList = [...transferList];
                                updatedList[index].quantity = e.target.value;
                                setTransferList(updatedList);
                              }}
                            />
                            {item.measurementUnitName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#FF3B30] hover:bg-red-50 p-2 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="text-[#AEAEB2] text-sm font-medium">No items yet</div>
                  <div className="text-[#AEAEB2] text-xs mt-1">Use search above to add products</div>
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {transferList.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {transferList.map((item, index) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#1C1C1E] text-sm leading-tight">{item.productDescription}</div>
                          <div className="text-xs text-[#6D6D72] font-mono mt-1 truncate">{item.sku}</div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#FF3B30] hover:bg-red-50 active:bg-red-100 p-2.5 rounded-lg flex-shrink-0 touch-manipulation transition-colors"
                          aria-label="Remove item"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-[#6D6D72] mb-1 font-medium">Source Stock</div>
                          <div className="font-semibold text-[#1C1C1E] text-sm">{item.sourceStock || '0'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-[#6D6D72] mb-1 font-medium">Dest. Stock</div>
                          <div className="font-semibold text-[#1C1C1E] text-sm">{item.destinationStock || '0'}</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-[#6D6D72] mb-2 font-medium">Transfer Quantity</div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.quantity || ''}
                              onChange={(e) => {
                                const updatedList = [...transferList];
                                updatedList[index].quantity = e.target.value;
                                setTransferList(updatedList);
                              }}
                              className="text-sm h-10"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="text-sm text-[#6D6D72] font-medium px-2 py-1 bg-white rounded border">
                            {item.measurementUnitName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="text-[#AEAEB2] text-sm font-medium">No items yet</div>
                  <div className="text-[#AEAEB2] text-xs mt-1">Use search above to add products</div>
                </div>
              )}
            </div>

          </div>

          {/* ── Footer Actions ── */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 pt-4 pb-4 sm:pb-0">
            <button
              type="button"
              onClick={clearForm}
              className="w-full sm:w-auto btn-secondary bg-white hover:bg-gray-50 active:bg-gray-100 border border-[#E5E5EA] px-6 sm:px-10 font-semibold py-4 sm:py-3.5 rounded-[13px] flex items-center justify-center gap-2 shadow-sm touch-manipulation transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto btn-primary font-semibold py-4 sm:py-3.5 rounded-[13px] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 touch-manipulation transition-all active:scale-[0.98]"
            >
              {isSubmitting ? "Creating transfer..." : "Create Transfer Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferOrder;