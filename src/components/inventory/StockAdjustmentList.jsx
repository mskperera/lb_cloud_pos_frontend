import React, { useState, useEffect } from "react";
import {
  getPriceChange,
  getStockAdjustments,
  getStockInfo,
  releaseStockBatch,
  stockAdjust,
  updatePrice,
} from "../../functions/stockEntry";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import InputField from "../inputField/InputField";
import { getAdjustmentReasons } from "../../functions/dropdowns";
import DropdownField from "../inputField/DropdownField";
import { useToast } from "../useToast";
import ConfirmDialog from "../dialog/ConfirmDialog";
import InventoryTransactionHistory from "./InventoryTransactionHistory";

const StockAdjustmentList = ({ inventoryId, product }) => {
  const [loading, setLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState([]);
  const [showAdjustmentPanel, setShowAdjustmentPanel] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [customReason, setCustomReason] = useState(""); // For custom reason
  const [adjustmentType, setAdjustmentType] = useState("add"); // "add" or "deduct"

  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // New state for selected row index
  const [adjustmentReasonsOptions, setAdjustmentReasonsOptions] = useState([]);
  const [stockAdjustments, setStockAdjustments] = useState([]); // State to hold fetched stock adjustments
  const [stockPriceChanges, setPriceChanges] = useState([]); // State to hold fetched stock adjustments

  const [newUnitPrice, setNewUnitPrice] = useState("");
  const [newUnitCost, setNewUnitCost] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [showPriceChangePanel, setShowPriceChangePanel] = useState(false);
  const [showZeroStockQtyData, setShowZeroStockQtyData] = useState(false);  // State for checkbox toggle
   
  const showToast = useToast();

  useEffect(() => {
    loadDrpAdjustmentReasons();
  }, [adjustmentType]);

  const loadDrpAdjustmentReasons = async () => {
    const adustmentTypeId = adjustmentType === "add" ? 1 : 2;
    const objArr = await getAdjustmentReasons(adustmentTypeId);
    setAdjustmentReasonsOptions(objArr.data.results[0]);
  };

  const loadDetails = async () => {
    if (!inventoryId) return;
    setLoading(true);
    try {
      const stockInfoRes = await getStockInfo(inventoryId,showZeroStockQtyData);
      setStockInfo(stockInfoRes.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [inventoryId,showZeroStockQtyData]);

  // Handle opening of price change panel
  const handlePriceChange = (batch, index) => {
    setSelectedBatch(batch);
    setSelectedRowIndex(index);
    setNewUnitPrice(batch.unitPrice);
    setNewUnitCost(batch.unitCost);
    setShowPriceChangePanel(true);
    setShowAdjustmentPanel(false);
    loadPriceChange(batch.stockBatchId);
  };
const [stockBatchInfoToRelaseConfirm, setStockBatchInfoToRelaseConfirm] = useState(null);
    // Handle opening of price change panel


    const releaseBatch = async (stockBatchInfo) => {
      const res = await releaseStockBatch(stockBatchInfo.stockBatchId,stockBatchInfo.isStopRelease);

      if (res.data.error) {
        console.log(res.data.error.message);
        showToast("warning", "Exception", res.data.error.message);
        return;
      }
      const { outputMessage, responseStatus } = res.data.outputValues;

      if (responseStatus === "failed") {
        showToast("warning", "Exception", outputMessage);
        return;
      }

      showToast("success", "Done", outputMessage);
      loadDetails();
    };
  
      const [showDialogReleaseBatch, setShowDialogReleaseBatch] = useState(false);
    
      const handleReleaseBatchConfirm = () => {
        releaseBatch(stockBatchInfoToRelaseConfirm)
        setShowDialogReleaseBatch(false);
      };



     
      
  const handleReleasePrompt = (item,isStopRelease) => {
    setStockBatchInfoToRelaseConfirm({stockBatchId:item.stockBatchId,isStopRelease});
    setShowDialogReleaseBatch(true);
  };

  const handleReleaseBatchCancel = () => {
    setShowDialogReleaseBatch(false);
  };

  const handleAdjustStock = (batch, index) => {
    setSelectedBatch(batch);
    setSelectedRowIndex(index);
    setShowAdjustmentPanel(true);
    setShowPriceChangePanel(false);
    loadStockAdjustments(batch.stockBatchId);

  };

  const handleSaveAdjustment = async () => {
    if (adjustmentQty === 0 || !adjustmentReason) {
      showToast(
        "warning",
        "Exception",
        "Please provide a valid quantity and reason."
      );
      return;
    }
    setLoading(true);

    const adustmentTypeId = adjustmentType === "add" ? 1 : 2;
    const adjustmentData = {
      stockBatchId: selectedBatch.stockBatchId,
      adjustedQty: adjustmentQty,
      adjustmentTypeId: adustmentTypeId,
      adjustmentReasonId: adjustmentReason,
      adjustmentReasonOtherRemark: customReason,
    };
    try {
      const res = await stockAdjust(adjustmentData);

      if (res.data.error) {
        const { error } = res.data;
        showToast("danger", "Exception", error.message);
        return;
      }
      const { outputMessage, responseStatus } = res.data.outputValues;
      if (responseStatus === "failed") {
        showToast("warning", "Exception", outputMessage);
      } else {
        showToast("success", "Success", outputMessage);
        //setShowAdjustmentPanel(false);
        setAdjustmentReason("");
        setAdjustmentQty("");
        setCustomReason("");
        loadDetails();
        loadStockAdjustments(selectedBatch.stockBatchId);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error saving adjustment:", err);
      setLoading(false);
    }
  };

  const loadStockAdjustments = async (stockBatchId) => {
    try {
      if (!stockBatchId) return;
      const res = await getStockAdjustments(stockBatchId);
      setStockAdjustments(res.data.results[0]); // Store the adjustments in state
    } catch (err) {
      console.error("Error fetching stock adjustments:", err);
    }
  };

  const loadPriceChange = async (stockBatchId) => {
    try {
      if (!stockBatchId) return;
      const res = await getPriceChange(stockBatchId);
      setPriceChanges(res.data.results[0]); // Store the adjustments in state
    } catch (err) {
      console.error("Error fetching stock adjustments:", err);
    }
  };

  // Handle saving price changes
  const handleSavePriceChange = async () => {

    if (!newUnitPrice || !newUnitCost) {
      showToast(
        "warning",
        "Exception",
        "Please provide valid price and cost values."
      );
      return;
    }

    const priceChangeData = {
      stockBatchId: selectedBatch.stockBatchId,
      newUnitPrice,
      newUnitCost,
      changeReason
    };

    try {
      setLoading(true);
      const res = await updatePrice(priceChangeData); // Assume `updatePrice` is an API function
      if (res.data.error) {
        showToast("danger", "Exception", res.data.error.message);
        return;
      }

      showToast("success", "Success", "Price updated successfully.");
      setChangeReason('');
      setNewUnitCost('');
      setNewUnitPrice('');
      //setShowPriceChangePanel(false);
      loadDetails();
      loadPriceChange(selectedBatch.stockBatchId);
    } catch (err) {
      console.error("Error updating price:", err);
    } finally {
      setLoading(false);
    }
  };


  // Handle checkbox change (toggle visibility of zero stock rows)
  const handleCheckboxChange = () => {
    setShowZeroStockQtyData(prevState => !prevState);
  };

  const renderStockInfo = () => {
    if (loading) {
      return <div>Loading stock batch details...</div>;
    }

    return (
      <div className="px-10">
      {/* Checkbox for toggling stock visibility */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="showZeroStockQtyData"
          checked={showZeroStockQtyData}
          onChange={handleCheckboxChange} // Toggle the state when checkbox changes
          className="mr-2"
        />
        <label htmlFor="showZeroStockQtyData">Show Zero Quantity Stocks</label>
      </div>
      <div className="p-4 rounded-md w-full overflow-x-auto bg-slate-50">
        <h3 className="font-bold text-lg mb-4">Stock Batch Details</h3>
        {/* <div className="text-center mb-4 w-full">
          <p className=" text-gray-600">
            The item highlighted below is the next to be sold out based on the{" "}
            <span className="font-bold">Batch queue number</span>.
          </p>
        </div> */}

        <table className="table border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10 text-[1rem] border-b border-gray-300">
            <tr>
              <th className="px-2 py-2">Batch No</th>
              <th className="px-2 py-2">Qty</th>
              <th className="px-2 py-2">Batch Queue No</th>
              <th className="px-2 py-2">Expiration Date</th>
              <th className="px-2 py-2">Production Date</th>
              <th className="px-2 py-2">Unit Price</th>
              <th className="px-2 py-2">Unit Cost</th>
              <th className="px-2 py-2">Created</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockInfo
              .sort(
                (a, b) =>
                  a.batchQueueNumber - b.batchQueueNumber ||
                  new Date(a.expDate) - new Date(b.expDate)
              )
              .map((item, index) => {
      
           // const isStockOutOrder = index === 0; // Highlight the first row in the sorted list
               const isStockOutOrder =  !!item.isBatchReleased===true && item.qty>0;
              
               return (
                  <tr
                  key={index}
                  className={`${
                    isStockOutOrder
                      ? "bg-yellow-200 hover:bg-yellow-300"
                      : "bg-slate-50 hover:bg-gray-100"
                  }`}
                >
                  <td className="px-2 py-2">{item.batchNo}</td>
                  <td className="px-2 py-2">{item.qty}</td>
                  <td className="px-2 py-2">{item.batchQueueNumber}</td>
                  <td className="px-2 py-2">{item.expDate ? formatUtcToLocal(item.expDate, true):'-'}</td>
                  <td className="px-2 py-2">{item.prodDate ? formatUtcToLocal(item.prodDate, true):'-'}</td>
                  <td className="px-2 py-2">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-2 py-2">{formatCurrency(item.unitCost)}</td>
                  <td className="px-2 py-2">{formatUtcToLocal(item.createdDate_utc)}</td>
                  <td className="px-2 py-2">
                    <div className="flex space-x-2">
                      {/* Release Batch Button */}
                      {item.isBatchReleased  ? <button
                        onClick={() => handleReleasePrompt(item,true, index)}
                        className={`btn border-0 w-36 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed 
                          bg-red-500 text-white hover:bg-red-600 `}
                          disabled={parseInt(item.qty)===0}
                      >
                        Stop
                      </button> :
                      <button
                        onClick={() => handleReleasePrompt(item,false, index)}
                        className={`btn border-0 w-36 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed 
                          bg-blue-500 text-white hover:bg-blue-600 `}
                      >
                      Release Batch
                      </button>}

                      
                      {/* Change Price Button */}
                      <button
                        onClick={() => handlePriceChange(item, index)}
                        className="btn bg-green-500 text-white hover:bg-green-600 border-0 px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Change Price
                      </button>
                
                      {/* Adjust Stock Button */}
                      <button
                        onClick={() => handleAdjustStock(item, index)}
                        className="btn bg-yellow-500 text-white hover:bg-yellow-600 border-0 px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                      >
                        Adjust Stock
                      </button>
                    </div>
                  </td>
                </tr>
                
                );
              })}
          </tbody>
        </table>
      </div>
      </div>
    );
  };
  const handleCancelAdjustment = () => {
    setShowAdjustmentPanel(false);
  };

  const renderAdjustmentPanel = () => {
    if (!showAdjustmentPanel || !selectedBatch) return null;

    return (
      <div className="p-4 bg-slate-50 rounded-md mt-4">
        <div>
          <h3 className="font-bold text-lg mb-4">
            Adjustment Details for Batch: {selectedBatch.batchNo}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4">
            <div className="mt-2">
              <p className="mb-2 text-lg">Current Quantity</p>
              <p>{selectedBatch.qty}</p>
            </div>
            <div className="mt-2">
              <p className="mb-2 text-lg">Adjustment Type</p>
              <div className="flex gap-2 items-center">
                <div className="mr-4">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="adjustmentType"
                      value="add"
                      checked={adjustmentType === "add"}
                      onChange={() => setAdjustmentType("add")}
                    />
                    <span className="pl-2">Add</span>
                  </label>
                </div>
                <div className="mr-4">
                  <label>
                    <input
                      type="radio"
                      name="adjustmentType"
                      value="deduct"
                      checked={adjustmentType === "deduct"}
                      onChange={() => setAdjustmentType("deduct")}
                    />
                    <span className="pl-2">Deduct</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="">
              <InputField
                id="adjustmentQty"
                label="Adjustment Quantity"
                value={adjustmentQty}
                required={true}
                onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                type="number"
                placeholder="Enter quantity to add or deduct"
              />
            </div>

            <DropdownField
              id="adjustmentReason"
              label="Adjustment Reason"
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              options={adjustmentReasonsOptions}
              placeholder="Select Adjustment Reason"
              required
            />

            {(adjustmentReason === "8" || adjustmentReason === "4") && (
                <InputField
                  id="customReason"
                  label="Custom Reason"
                  value={customReason}
                  required={true}
                  onChange={(e) => setCustomReason(e.target.value)}
                  type="text"
                  placeholder="Enter custom reason"
                />
            )}


<div className="flex justify-end gap-2 mt-11">
              <button
                onClick={handleSaveAdjustment}
                className="btn btn-primary"
              >
                Save Adjustment
              </button>
              <button onClick={handleCancelAdjustment} className="btn">
                Cancel
              </button>
            </div>

    
          </div>
        </div>

        <div className="p-4 rounded-md w-full overflow-x-auto">
          <h3 className="text-center font-bold pb-5">
            Stock Adjustment Details
          </h3>
          <table className="table border-collapse w-full text-left">
  <thead className="sticky top-0 bg-slate-50 z-10 text-[1rem] border-b border-gray-300">
    <tr>
      <th className="px-4 py-2">ID</th>
      <th className="px-4 py-2">Created</th>
      <th className="px-4 py-2">Current Stock Qty</th> {/* Updated column name */}
      <th className="px-4 py-2">Adjustment Amount</th> {/* Updated column name */}
      <th className="px-4 py-2">Final Stock Qty</th> {/* Updated column name */}
      <th className="px-4 py-2">Adjustment Type</th>
      <th className="px-4 py-2">Reason Name</th>
      <th className="px-4 py-2">Other Remarks</th>
    </tr>
  </thead>
  <tbody>
    {stockAdjustments.map((item, index) => {
      const rowColor =
        item.adjustmentTypeName === "Deduction"
          ? "bg-red-100"
          : "bg-green-100";

      // Calculate the final stock quantity after adjustment
      const finalStockQty =
        item.adjustmentTypeId === 1
          ? item.existingStockQty + item.adjustedQty
          : item.existingStockQty - item.adjustedQty;

      return (
        <tr key={index} className={`${rowColor} cursor-pointer`}>
          <td className="px-4 py-2">{item.stockAdjustmentId}</td>
          <td className="px-4 py-2">
            {formatUtcToLocal(item.createdDate_UTC)}
          </td>
          <td className="px-4 py-2">{item.existingStockQty}</td>
          <td className="px-4 py-2">{item.adjustmentTypeId === 1 ? item.adjustedQty : -item.adjustedQty}</td>
          <td className="px-4 py-2">{finalStockQty}</td>
          <td className="px-4 py-2">{item.adjustmentTypeName}</td>
          <td className="px-4 py-2">{item.adjustmentReasonName}</td>
          <td className="px-4 py-2">{item.adjustmentReasonOtherRemark}</td>
        </tr>
      );
    })}
  </tbody>
</table>

        </div>
      </div>
    );
  };

  const ProductInfo = ({ product }) => {
    const { productName, measurementUnitName, sku, productNo, qty } = product;

    return (
      <div className="p-4 ">
        <div className="flex justify-between gap-4">
          <div className="flex flex-col justify-between items-start">
            <span className="font-bold mb-2">Product Name</span>
            <span className="text-gray-800">{productName}</span>
          </div>
          <div className="flex flex-col justify-between items-start">
            <span className="font-bold mb-2">Stock Qty</span>
            <span className="text-gray-800">
              {qty} {measurementUnitName}
            </span>
          </div>
          <div className="flex flex-col justify-between items-start">
            <span className="font-bold mb-2">SKU</span>
            <span className="text-gray-800">{sku}</span>
          </div>
          <div className="flex flex-col justify-between items-start">
            <span className="font-bold mb-2">Product No</span>
            <span className="text-gray-800">{productNo}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPriceChangePanel = () => {
    if (!showPriceChangePanel || !selectedBatch) return null;
  
    return (
      <div className="p-4 bg-slate-50 rounded-md mt-4">
        <h3 className="font-bold text-lg mb-4"> Price Change for Batch: {selectedBatch.batchNo}</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <InputField
            id="newUnitPrice"
            label="New Unit Price"
            value={newUnitPrice}
            onChange={(e) => setNewUnitPrice(Number(e.target.value))}
            type="number"
            placeholder="Enter new unit price"
            required
          />
          <InputField
            id="newUnitCost"
            label="New Unit Cost"
            value={newUnitCost}
            onChange={(e) => setNewUnitCost(Number(e.target.value))}
            type="number"
            placeholder="Enter new unit cost"
            required
          />
          <InputField
            id="changeReason"
            label="Change Reason"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            type="text"
            placeholder="Enter Change Reason"
            required
          />
  
          <div className="flex justify-end space-x-4 items-end">
            <button onClick={handleSavePriceChange} className="btn btn-primary">
              Save Price Change
            </button>
            <button
              onClick={() => setShowPriceChangePanel(false)}
              className="btn"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-4 rounded-md w-full overflow-x-auto">
          <h3 className="text-center font-bold pb-5">
            Price Change Details
          </h3>
          <table className="table border-collapse w-full text-left">
            <thead className="sticky top-0 bg-slate-50 z-10 text-[1rem] border-b border-gray-300">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Old Unit Price</th>
                <th className="px-4 py-2">New Unit Price</th>
                <th className="px-4 py-2">Old Unit Cost</th>
                <th className="px-4 py-2">New Unit Cost</th>
                <th className="px-4 py-2">Change Reason</th>
              </tr>
            </thead>
            <tbody>
              {stockPriceChanges.map((item, index) => {
                const priceChanged = item.oldUnitPrice !== item.newUnitPrice;
                const costChanged = item.oldUnitCost !== item.newUnitCost;
  
                return (
                  <tr key={index} className="cursor-pointer">
                    <td className="px-4 py-2">{item.priceChangeLogId}</td>
                    <td className="px-4 py-2">
                      {formatUtcToLocal(item.CreatedDate_UTC)}
                    </td>
                    <td className={`px-4 py-2 ${priceChanged ? 'bg-red-100' : ''}`}>
                      {item.oldUnitPrice}
                    </td>
                    <td className={`px-4 py-2 ${priceChanged ? 'bg-red-100' : ''}`}>
                      {item.newUnitPrice}
                    </td>
                    <td className={`px-4 py-2 ${costChanged ? 'bg-red-100' : ''}`}>
                      {item.oldUnitCost}
                    </td>
                    <td className={`px-4 py-2 ${costChanged ? 'bg-red-100' : ''}`}>
                      {item.newUnitCost}
                    </td>
                    <td className="px-4 py-2">
                      {item.changeReason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

  return (
    <div className="px-10">
            {showDialogReleaseBatch && (
              <ConfirmDialog
                isVisible={true}
                message={stockBatchInfoToRelaseConfirm.isStopRelease ? `Are you sure you want to stop this batch?` : `Are you sure you want to relese this batch?`}
                onConfirm={handleReleaseBatchConfirm}
                onCancel={handleReleaseBatchCancel}
                title={stockBatchInfoToRelaseConfirm.isStopRelease ? "Confirm Stop" : "Confirm Release"}
                severity={stockBatchInfoToRelaseConfirm.isStopRelease ? "warning" : "info"}
              />
            )}
      <ProductInfo product={product} />
      {renderStockInfo()}
      {renderAdjustmentPanel()}
      {renderPriceChangePanel()}
      {/* <InventoryTransactionHistory inventoryId={inventoryId} product={product} /> */}
    </div>
  );
};

export default StockAdjustmentList;
