import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../useToast";
import { addOrder } from "../../state/orderList/orderListSlice";
import { getDropdownMeasurementUnit } from "../../functions/dropdowns";

export default function AddCustomProduct({ visible, onClose }) {
  const dispatch = useDispatch();
  const showToast = useToast();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [measurementUnit, setMeasurementUnit] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validationMessage,setValidationMessage]= useState("");

  useEffect(() => {
    const loadMeasurementUnits = async () => {
      try {
        const response = await getDropdownMeasurementUnit();
        setMeasurementUnitOptions(response.data.results[0]);
      } catch (err) {
        console.error("Error loading measurement units:", err);
        showToast("error", "Exception", "Failed to load measurement units.");
      }
    };
    loadMeasurementUnits();
  }, []);

  const validateForm = () => {

        setValidationMessage('');

    if (!description.trim()) {  
      setValidationMessage("Item description is required.");
      return false;
    }

  if (!price) {  
      setValidationMessage("Price is required.");
      return false;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationMessage("Price must be a positive number.");
      return false;
    }

    if (!quantity) {  
      setValidationMessage("Qty is required.");
      return false;
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum < 1) {
      setValidationMessage("Quantity must be a positive integer.");
      return false;
    }

     if (!taxRate && taxRate!=0) {  
      setValidationMessage("TaxRate is required.");
      return false;
    }

       const taxRateNum = taxRate ? parseFloat(taxRate) : 0;
    if (!isNaN(taxRateNum) && taxRateNum < 0) {
      setValidationMessage("Tax rate cannot be negative.");
      return false;
    }

   if (!measurementUnit.trim()) {     
      setValidationMessage("Unit is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    

    try {
      const selectedUnit = measurementUnitOptions.find(
        (option) => option.id === parseInt(measurementUnit)
      ).displayName;   

    
      const order = {
        productNo: "",
        sku: "",
        description: description.trim(),
        productId: 0,
        productTypeId:0,
        unitPrice: parseFloat(price).toString(),
        lineTaxRate: taxRate ? parseFloat(taxRate).toString() : "0",
        qty: parseInt(quantity, 10),
        measurementUnitName: selectedUnit,
        isCustomProduct:true
      };

     
      dispatch(addOrder(order));
      showToast("success", "Success", "Custom item added successfully.");
      setDescription("");
      setPrice("");
      setQuantity("1");
      setMeasurementUnit("");
      setTaxRate(0);
      onClose();
    } catch (err) {
      console.error("Error adding custom item:", err);
      showToast("error", "Exception", "Failed to add custom item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    visible && (
   
        <div className="bg-white max-w-xl w-full p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5">
              <div className="col-span-2 flex flex-col gap-2 mb-4">
                <label htmlFor="description" className="text-md font-medium text-gray-700">
                  Item Description
                </label>
                <input
                  id="description"
                  type="text"
                  className="w-full px-3 py-2 text-md text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                  placeholder="Enter item description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-span-2 flex gap-1 mb-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="quantity" className="text-md font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 text-md text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label htmlFor="measurementUnit" className="text-md font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    id="measurementUnit"
                    className="w-full px-3 py-2 text-md text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                    value={measurementUnit}
                    onChange={(e) => setMeasurementUnit(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Measurement Unit</option>
                    {measurementUnitOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-2 mb-4">
                <label htmlFor="price" className="text-md font-medium text-gray-700">
                  Unit Price
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 text-md text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
        <div className="col-span-2 flex flex-col gap-2 mb-4">
  <label htmlFor="taxRate" className="text-md font-medium text-gray-700">
    Tax Rate (%)
  </label>
  <input
    id="taxRate"
    type="number"
    step="0.01"
    min="0"
    className="w-full px-3 py-2 text-md text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
    placeholder="Enter tax rate"
    value={taxRate ?? ""}  // allow free typing
    onChange={(e) => setTaxRate(e.target.value)}  // keep as string
    disabled={isSubmitting}
  />
</div>

                  <div className="flex justify-end gap-2 col-span-4">
              {validationMessage && <span className="text-red-600">{validationMessage}</span>}
              </div>
              <div className="flex justify-end gap-2 col-span-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-md font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-md font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Item"}
                </button>
              </div>
            </div>
          </form>
      
      </div>
    )
  );
}