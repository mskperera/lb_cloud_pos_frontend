import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "../../../functions/register";
import moment from 'moment';
import { validate } from "../../../utils/formValidation";

const StockEntry = () => {
  const [sku, setSku] = useState({ value: "", label: "SKU" });
  const [barcode, setBarcode] = useState({ value: "", label: "Barcode" });
  const [unitPrice, setUnitPrice] = useState({ value: "", label: "Unit Price" });
  const [comboIngredients, setComboIngredients] = useState([]);

  const [productBarcode, setProductBarcode] = useState({
    label: "Barcode",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [productSku, setProductSku] = useState({
    label: "SKU",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [grnNo, setGrnNo] = useState({
    label: "GRN No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [supplierBillNo, setSupplierBillNo] = useState({
    label: "Supplier Bill No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [store, setStore] = useState({
    label: "Store",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [supplier, setSupplier] = useState({
    label: "Supplier",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [supplierOptions, setSupplierOptions] = useState([]);
 


  const [grnDate, setGrnDate] = useState({
    label: "GRN Date",
    value: moment().format("YYYY-MM-DD"), // Format the date for default display in the date input
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "date" },
  });

  


  const [eneringQty, setEneringQty] = useState({ value: "", label: "Qty" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (setter, field, value) => {
//     setter({ ...field, value });
//   };

  const handleInputChange = (setState, state, value) => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validationMessages = (field) => {
    // Here, you can add your validation logic.
    return field.value === "" ? <span className="text-red-500 text-sm">This field is required.</span> : null;
  };


  const showToast = (type, title, message) => {
    // Show toast notification logic here
    console.log(type, title, message);
  };

  const onSubmit = () => {
    setIsSubmitting(true);
    // Handle form submission logic
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const handleCostChange = (index, value) => {
    setComboIngredients((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, cost: value } : item
      )
    );
  };


  const costBodyTemplate = (rowData, index) => (
    <div>
      <input
        type="text"
        className="input input-bordered w-[10rem]"
        value={rowData.cost || ''} // Handle undefined cost
        onChange={(e) => handleCostChange(index, e.target.value)}
      />
      {/* {validationMessages(rowData.cost)} */}
    </div>
  );

  return (
    <>
      <div className="container mx-auto p-6">
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Combo Ingredients Section */}
            <div className="col-span-2">
              <h3 className="text-center font-bold text-xl">Stock Entry</h3>
              <div className="flex justify-start gap-4 items-end">
              <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">{grnNo.label}</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={grnNo.value}
                    onChange={(e) => handleInputChange(setGrnNo, grnNo, e.target.value)}
                  />
                  {validationMessages(grnNo)}
                </div>


                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">{supplierBillNo.label}</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={supplierBillNo.value}
                    onChange={(e) => handleInputChange(setSupplierBillNo, supplierBillNo, e.target.value)}
                  />
                  {validationMessages(supplierBillNo)}
                </div>


                <div className="flex flex-col">
            <label className="label">
              <span className="label-text">{supplier.label}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={supplier.value}
              onChange={(e) =>
                handleInputChange(
                  setSupplier,
                  supplier,
                  e.target.value
                )
              }
            >
              <option value="" disabled>
                Select Supplier
              </option>
              {supplierOptions.map((option) => (
                <option key={option.id} value={option.id} className="text-lg">
                  {option.displayName}
                </option>
              ))}
            </select>
            {validationMessages(supplier)}
          </div>



          <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">{supplierBillNo.label}</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={supplierBillNo.value}
                    onChange={(e) => handleInputChange(setSupplierBillNo, supplierBillNo, e.target.value)}
                  />
                  {validationMessages(supplierBillNo)}
                </div>

                <div className="flex flex-col">
  <label className="label">
    <span className="label-text">{grnDate.label}</span>
  </label>
  <input
    type="date"
    className="input input-bordered w-full"
    value={grnDate.value}
    onChange={(e) => handleInputChange(setGrnDate, grnDate, e.target.value)}
  />
  {validationMessages(grnDate)}
</div>

<div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">{store.label}</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    className="input input-bordered w-full"
                    value={store.value}
                    onChange={(e) => handleInputChange(setStore, store, e.target.value)}
                  />
                  {validationMessages(store)}
                </div>



          </div>

          <div className="flex justify-start gap-4 items-end">
                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">{productSku.label}</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={productSku.value}
                    onChange={(e) => handleInputChange(setProductSku, productSku, e.target.value)}
                  />
                  {validationMessages(productSku)}
                </div>

                <div className="flex flex-col">
                  <label className="label">
                    <span className="label-text">{eneringQty.label}</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={eneringQty.value}
                    onChange={(e) => handleInputChange(setEneringQty, eneringQty, e.target.value)}
                  />
                  {validationMessages(eneringQty)}
                </div>

                <div className="flex flex-col">
                  <button
                    type="button"
                    className="btn btn-primary mt-6"
                    onClick={async () => {
                      const filteredData = { sku: productSku.value, storeId: 1, searchByKeyword:false, productTypeIds:[1] };
                      const _result = await getProducts(filteredData);
                      const product = _result.data.results[0][0];
                      if (!product) {
                        showToast("danger", "Exception", "Product not found.");
                        return;
                      }

                      console.log('product',product)
                      const _comboIngredents = {
                        sku: product.sku,
                        qty: eneringQty.value,
                        productName: product.productName,
                        measurementUnitName: product.measurementUnitName,
                        productTypeName: product.productTypeName,
                      };

                      if (comboIngredients.some((i) => i.sku === product.sku)) {
                        showToast("danger", "Exception", "The Product already exists.");
                        return;
                      }

                      setComboIngredients([...comboIngredients, _comboIngredents]);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <table className="table border-collapse w-full">
                  <thead className="sticky top-0 bg-base-100 z-10 text-sm border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2">Product Name</th>
                      <th className="px-4 py-2">Product Type</th>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Cost</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comboIngredients.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2">{item.productTypeName}</td>
                        <td className="px-4 py-2">{item.sku}</td>
                        <td className="px-4 py-2">{costBodyTemplate(item,index)}</td>
                        <td className="px-4 py-2">{item.qty} {item.measurementUnitName}</td>
                        <td className="px-4 py-2">
                          <button
                          type="button"
                            className="btn btn-error btn-xs"
                            onClick={() => {
                              setComboIngredients(comboIngredients.filter((_, i) => i !== index));
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="col-span-2 sm:col-span-1">
      
 

            </div>

         
          </div>

          <div className="flex justify-center mt-6">
            <button
              className={`btn btn-primary w-56 ${isSubmitting ? "loading" : ""}`}
              onClick={onSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit Stock Entry"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StockEntry;
