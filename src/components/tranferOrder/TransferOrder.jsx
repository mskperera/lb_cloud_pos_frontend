import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import Input from "../inputField/Input";
import ProductSearch from "../productSearch/ProductSearch";
import { useToast } from "../useToast";
import TextAreaField from "../inputField/TextAreaField";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { validate } from "../../utils/formValidation";
import Select from "../inputField/Select";
import Field from "../inputField/Field";
import { getUserAssignedStores } from "../../functions/store";
import ReusableTable from "../ReusableTable";
import { ListIcon } from "lucide-react";
import SubmitButton from "../buttons/SubmitButton";
import Button from "../buttons/Button";
import { transferOrderAdd } from "../../functions/transferOrder";
import { getBatchedItems } from "../../functions/register";
import BatchSelectionDialog from "../BatchSelectionDialog";




/* ─── Transfer Order Component (100% matching style + screenshots) ──────── */
const TransferOrder = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const user = JSON.parse(localStorage.getItem('user'));

  const [isSaveAsDraft, setIsSaveAsDraft] = useState(false); // Optional: for future use if you want to implement "Save as Draft" functionality
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeOptions, setStoreOptions] = useState([]);

    const [batchedItemList, setBatchedItemList] = useState([]);
  
    const [isBatchedItemsModalOpen, setIsBatchedItemsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
 const [addOrderTemp, setAddOrderTemp] = useState(null);

  const store = JSON.parse(localStorage.getItem("selectedStore"));

  const loadDrpStores = useCallback(async () => {
    const objArr = await getUserAssignedStores(user.userId);
    console.log('objArr', objArr, user.userId);
    setStoreOptions(objArr.data);
  }, [user.userId]);

  useEffect(() => {
    loadDrpStores();
  }, [loadDrpStores]);


  const addItemstoOrderListFinal=(selectedBatch,product)=>{

  console.log('product;',product)
      console.log('selectedBatch',selectedBatch);
  
    setTransferList((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now(),
        quantity: "",
        stockBatchId: selectedBatch.stockBatchId,
        // unitPrice:
        // unitCost,
        // taxPerc,
        // allProductId,
      },
    ]);

      setIsBatchedItemsModalOpen(false);
    }
    

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
  

  const onProductSelect = async (product) => {
 // if (!selectedItem || !selectedItem.quantity) {
    //   showToast("danger", "Exception", "Quantity is required");
    //   return;
    // }
    if(transferList.some(i=> i.sku === product.sku)){
      showToast("danger", "Exception", "Item already in transfer list");
      return;
    }

    if(product.stockQty==null){
      showToast("danger", "Exception", "Stock Qty is Empty");
      return;
    }

 const batchedItemsRes = await getBatchedItems(product.allProductId, store.storeId);
        
  console.log('product',product);
    const {isBatchTracked}=batchedItemsRes.data.outputValues;
     console.log('getBatchedItems',isBatchTracked);


      const batchedItems = batchedItemsRes.data.results[0];
  console.log('batchedItems',batchedItems);
if(batchedItems.length>0){
   if(!!isBatchTracked){
        setBatchedItemList(batchedItems);
        setIsBatchedItemsModalOpen(true);
        setAddOrderTemp(product);
        return;
      }
else
{
    setTransferList((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now(), 
        quantity: "",
        stockBatchId: batchedItems[0].stockBatchId,
      },
    ]);
  }

}


  //  setSelectedItem(null);

  };



  const removeItem = (id) => {
    setTransferList((prev) => prev.filter((i) => i.id !== id));
  };

const onSubmit = async (e) => {
  e.preventDefault();
  if (!sourceStore.value) {
    showToast("danger", "Error", "Source store is required");
    return;
  }
  if (!destinationStore.value) {
    showToast("danger", "Error", "Destination store is required");
    return;
  }
  if (transferList.length === 0) {
    showToast("danger", "Error", "Please add items to the transfer list");
    return;
  }
    

  setIsSubmitting(true);


  const payload={
    status:"In Transit",
    sourceStoreId: sourceStore.value,
    destinationStoreId: destinationStore.value,
    transferDate: transferDate.value,
    notes: notes.value,
    orderList_json:transferList.map(i=>({
      allProductId:i.allProductId,
      qty:i.quantity,
      stockBatchId:i.stockBatchId
    }))
  }

  const res=await transferOrderAdd(payload);

  if(res.data.error){
    showToast("danger", "Error", res.data.error.message || "Failed to create transfer order");
    setIsSubmitting(false);
    return;
  }

  const transferOrderId = res.data.outputValues.transferOrderId;
   const responseStatus = res.data.outputValues.responseStatus;

    if (responseStatus === "failed") {
      showToast("danger", "Exception", res.data.outputValues.outputMessage);
       setIsSubmitting(false);
      return;
    }

  showToast("success", "Success", `Transfer order created successfully`);

   navigate(`/inventory/transferorders/${transferOrderId}`);


};


  const totalItems = transferList.length;
  const totalQuantity = transferList.reduce((sum, i) => sum + parseFloat(i.quantity) || 0, 0);

  const transferColumns = [
    {
      key: "sku",
      label: "SKU",
      align: "left",
      render: (row) => (
        <div>
          <div className="text-xs text-gray-700 font-mono">{row.sku}</div>
        </div>
      ),
    },
  {
      key: "product",
      label: "Product",
      align: "left",
      render: (row) => (
        <div>
          <div className="font-medium">{row.productDescription}</div>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      align: "left",
      render: (row) => {
        const index = transferList.findIndex((i) => i.id === row.id);
        return (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
             // placeholder="0"
              value={row.quantity}
              onChange={(e) => {
                const updatedList = [...transferList];
                updatedList[index].quantity = e.target.value;
                setTransferList(updatedList);
              }}
            />
            {row.measurementUnitName}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (row) => (
        <button
          onClick={() => removeItem(row.id)}
          className="text-[#FF3B30] hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <FaTrash />
        </button>
      ),
    },
  ];


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
       
             <Button variant="default"   onClick={() => navigate("/inventory/transferorders/list")} className="w-full sm:w-auto ">
                 View All Transfers
                        </Button>
          </div>
        </div>

    <BatchSelectionDialog
      visible={isBatchedItemsModalOpen}
      onHide={() => setIsBatchedItemsModalOpen(false)}
     // selectedProduct={selectedProduct}
     // selectedVariationProduct={selectedVariationProduct}
      batchedItemList={batchedItemList}
      onBatchSelect={(selectedBatch) => addItemstoOrderListFinal(selectedBatch, addOrderTemp)}
    />



        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* ── Transfer Details Card ── */}
           <div className="bg-white rounded-lg border border-gray-200">
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
                      rows={2}
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
              onlyAllowToSelectStockTrackedProduct={true}
            />
          </div>



          {/* ── Line Items Card (matches both screenshots perfectly) ── */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
           
           
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 sm:px-4 md:px-5 py-3 sm:py-3 md:py-4 border-b gap-2">
              <div className="flex items-center gap-2 md:gap-2.5">
                    <ListIcon className="w-4 h-4 text-gray-500" />
                <div className="font-semibold text-gray-500">
                 {totalItems}  Items 
   
                </div>
              </div>
              <div className="font-semibold text-gray-500 sm:text-right">
                Total qty: {totalQuantity}
              </div>
            </div>

            {/* Desktop Table View */}
              <div className="overflow-x-auto p-4">
              {transferList.length > 0 ? (
                <ReusableTable
                  columns={transferColumns}
                  data={transferList}
                  emptyMessage="No items yet"
                />
              ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2 bg-white text-gray-700">
                  <div className="text-gray-500 italic">No items added yet</div>
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
                              //placeholder="0"
                              value={item.quantity}
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
            <Button variant="default" onClick={clearForm} className="w-full sm:w-auto ">
              Clear
            </Button>

            <SubmitButton isSubmitting={isSubmitting} text={isSubmitting ? "Creating transfer..." : "Create Transfer Order"} />
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferOrder;