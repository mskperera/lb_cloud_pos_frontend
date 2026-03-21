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




/* ─── Transfer Order Component (100% matching style + screenshots) ──────── */
const TransferOrder = () => {
  const navigate = useNavigate();
  const showToast = useToast();
    const store = JSON.parse(localStorage.getItem("stores")) || [];
  const [transferNo] = useState("TO1012"); // simulating new TO number


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
  


  const [storeOptions,setStoreOptions] = useState(store);


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
    <div className="min-h-screen bg-[#F2F2F7] p-7 pb-15 font-sans">
      <div className="max-w-[1060px] mx-auto flex flex-col gap-4">
        {/* ── Top bar ── */}
        <div className="flex items-end justify-between px-0.5 pb-1">
          <div>
            <div className="text-[26px] font-bold text-[#1C1C1E] tracking-[-0.5px] leading-none flex items-center gap-3">
              Transfer Order
              <div className="inline-flex items-center gap-1.5 bg-[rgba(0,122,255,0.10)] rounded-full px-2.5 py-0.5 text-xs font-semibold text-[#007AFF]">
                {/* {transferNo} <span className="opacity-60 font-medium">• In transit</span> */}
              </div>
            </div>
            {/* <div className="text-xs text-[#6D6D72] mt-1">Jun 17, 2021 • Ordered by: Owner</div> */}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/inventory/transferorders/list")}
              className="flex items-center gap-1.5 bg-white border border-[#E5E5EA] rounded-[9999px] px-4 py-2 text-sm font-semibold text-[#007AFF] cursor-pointer hover:bg-[rgba(0,122,255,0.10)] hover:border-[#007AFF]"
            >
              View All Transfers
            </button>
     
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* ── Transfer Details Card ── */}
          <div className="bg-white rounded-[18px] border border-[#E5E5EA] overflow-hidden">
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

                <div className="col-span-3">
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

          <ProductSearch
            hideSearchBox={true}
            onProductSelect={onProductSelect}
            showAdvancedSearcho={showAdvancedSearch}
          />


          {/* ── Line Items Card (matches both screenshots perfectly) ── */}
          <div className="bg-white rounded-[18px] border border-[#E5E5EA]  overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#34C759] bg-opacity-10 text-[#34C759] rounded-[8px] flex items-center justify-center text-lg">
                  📋
                </div>
                <div className="font-semibold">
                  Items • {totalItems} selected
                </div>
              </div>
              <div className="text-xs text-[#6D6D72]">
                Total qty: {totalQuantity}
              </div>
            </div>

            <div className="overflow-x-auto">
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
                          <div>{item.productDescription}</div>
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
                            className="text-[#FF3B30] hover:bg-red-50 p-2 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-[#AEAEB2]">
                  No items yet • Use search above
                </div>
              )}
            </div>

          </div>

          {/* ── Footer Actions ── */}
          <div className="flex justify-center gap-5 pt-4">
            <button 
            type="button"
            onClick={clearForm}
            className="btn-secondary  bg-white hover:bg-gray-50 border border-[#E5E5EA] px-10 font-semibold py-3.5 rounded-[13px] flex items-center justify-center gap-2 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className=" btn-primary w-1/4 font-semibold py-3.5 rounded-[13px] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
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