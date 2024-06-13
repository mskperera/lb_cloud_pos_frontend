import React, { useState, useEffect } from "react";
import { validate } from "../../../utils/formValidation";

import { getDropdownDepartments, getDropdownMeasurementUnit, getDrpdownCategory } from "../../../functions/dropdowns";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../useToast";
import { addProduct, getProducts, updateProduct } from "../../../functions/register";
import { SAVE_TYPE } from "../../../utils/constants";
import FormElementMessage from "../../messges/FormElementMessage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCross, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function AddProduct({ saveType, id }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoGenerateProductNo, setAutoGenerateProductNo] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const [productNo, setProductNo] = useState({
    label: "Product No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [department, setDepartment] = useState({
    label: "Department",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [productName, setProductName] = useState({
    label: "Product Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [productCategory, setProductCategory] = useState({
    label: "Category",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integerArray" },
  });
  const [measurementUnit, setMeasurementUnit] = useState({
    label: "Measurement Unit",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });
  const [unitPrice, setUnitPrice] = useState({
    label: "Unit Price",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "decimal" },
  });
  const [reorderLevel, setReorderLevel] = useState({
    label: "Reorder Level",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "decimal" },
  });
  const [barcode, setBarcode] = useState({
    label: "Barcode",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [taxRatePerc, setTaxRatePerc] = useState({
    label: "Tax Rate (%)",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "decimal" },
  });

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

  const validationMessages = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage key={index} severity="error" text={message} />
          ))}
        </div>
      )
    );
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const loadValuesForUpdate = async () => {
    const res = await getProducts({
      productId: id,
      productNo: null,
      productName: null,
      barcode: null,
      productCategoryId: null,
      searchByKeyword: false,
    });

    const {
      barcode,
      categories,
      measurementUnitId,
      productName,
      productNo,
      reorderLevel,
      taxRate_perc,
      departmentId,
      unitPrice,
    } = res.data.results[0][0];

    setBarcode((p) => ({ ...p, value: barcode }));
    setProductCategory((p) => ({
      ...p,
      value: JSON.parse(categories).map((c) => c.id),
    }));
    setMeasurementUnit((p) => ({ ...p, value: measurementUnitId }));
    setProductNo((p) => ({ ...p, value: productNo }));
    setProductName((p) => ({ ...p, value: productName }));
    setReorderLevel((p) => ({ ...p, value: reorderLevel }));
    setTaxRatePerc((p) => ({ ...p, value: taxRate_perc }));
    setUnitPrice((p) => ({ ...p, value: unitPrice }));
    setDepartment((p) => ({ ...p, value: departmentId }));
  };

  useEffect(() => {
    if (saveType === SAVE_TYPE.UPDATE) {
      loadValuesForUpdate();
    }
  }, [saveType]);

  useEffect(() => {
    loadDrpCategory();
    loadDrpMeasurementUnit();
    loadDrpDepartments();
  }, []);

  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions(objArr.data.results[0]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions(objArr.data.results[0]);
  };

  const loadDrpDepartments = async () => {
    const objArr = await getDropdownDepartments();
    setDepartmentOptions(objArr.data.results[0]);
  };

  useEffect(() => {
    if (autoGenerateProductNo) setProductNo((p) => ({ ...p, value: "[Auto Generate]" }));
    else setProductNo((p) => ({ ...p, value: "" }));
  }, [autoGenerateProductNo]);

  const onSubmit = async () => {

    const payLoad = {
      tableId: null,
      branchId: 1,
      companyId: 1,
      productNo: productNo.value,
      isProductNoAutoGenerate: autoGenerateProductNo,
      productName: productName.value,
      categoryIdList: selectedCategories, // Use selectedCategories instead
      measurementUnitId: measurementUnit.value,
      unitPrice: unitPrice.value,
      departmentId: department.value,
      barcode: barcode.value,
      reorderLevel: reorderLevel.value,
    };
    
    console.log('payloadd',payLoad)

    setIsSubmitting(true);

    if (saveType === SAVE_TYPE.ADD) {
     
      const res = await addProduct(payLoad);
      setIsSubmitting(false);
      if (res.data.error) {
   
        const { error } = res.data;
        showToast("warning", "Exception", error.message);
        return;
      }
      const { outputMessage, responseStatus } = res.data.outputValues;
      if (responseStatus === "failed") {
        showToast("warning", "Exception", outputMessage);
      } else {
        showToast("success", "Success", outputMessage);
        navigate(`/products`);
      }
    } else if (saveType === SAVE_TYPE.UPDATE) {
      const res = await updateProduct(id, payLoad);
      setIsSubmitting(false);
      if (res.data.error) {
        const { error } = res.data;
        showToast("warning", "Exception", error.message);
        return;
      }
      const { outputMessage, responseStatus } = res.data.outputValues;
      if (responseStatus === "failed") {
        showToast("warning", "Exception", outputMessage);
      } else {
        showToast("success", "Success", outputMessage);
        navigate(`/products`);
      }
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  

  return (
<div className="flex justify-center">
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 ml-5 w-[70%] py-5">
      <div className="flex justify-center lg:col-span-3">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">
            {saveType === SAVE_TYPE.ADD ? "Add Product" : "Update Product"}
          </h2>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{productNo.label}</span>
        </label>
        <div className="flex items-center">
          <input
            type="text"
            className="input input-bordered flex-1"
            readOnly={autoGenerateProductNo}
            value={productNo.value}
            onChange={(e) =>
              handleInputChange(setProductNo, productNo, e.target.value)
            }
          />
          <div className="flex-1">
            <input
              type="checkbox"
              id="autoGenerate"
              className="checkbox checkbox-primary ml-2"
              disabled={saveType === SAVE_TYPE.UPDATE}
              onChange={(e) => setAutoGenerateProductNo(e.target.checked)}
              checked={autoGenerateProductNo}
            />
            <label htmlFor="autoGenerate" className="ml-2">
              Auto Generate
            </label>
          </div>
        </div>
        {validationMessages(productNo)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{department.label}</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={department.value}
          onChange={(e) =>
            handleInputChange(setDepartment, department, e.target.value)
          }
        >
          <option value="" disabled>
            Select Department
          </option>
          {departmentOptions.map((option) => (
            <option key={option.id} value={option.id} className="text-lg">
              {option.displayName}
            </option>
          ))}
        </select>
        {validationMessages(department)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{productName.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={productName.value}
          onChange={(e) =>
            handleInputChange(setProductName, productName, e.target.value)
          }
        />
        {validationMessages(productName)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{measurementUnit.label}</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={measurementUnit.value}
          onChange={(e) =>
            handleInputChange(
              setMeasurementUnit,
              measurementUnit,
              e.target.value
            )
          }
        >
          <option value="" disabled>
            Select Measurement Unit
          </option>
          {measurementUnitOptions.map((option) => (
            <option key={option.id} value={option.id} className="text-lg">
              {option.displayName}
            </option>
          ))}
        </select>
        {validationMessages(measurementUnit)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{unitPrice.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={unitPrice.value}
          onChange={(e) =>
            handleInputChange(setUnitPrice, unitPrice, e.target.value)
          }
        />
        {validationMessages(unitPrice)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{taxRatePerc.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={taxRatePerc.value}
          onChange={(e) =>
            handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value)
          }
        />
        {validationMessages(taxRatePerc)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{reorderLevel.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={reorderLevel.value}
          onChange={(e) =>
            handleInputChange(setReorderLevel, reorderLevel, e.target.value)
          }
        />
        {validationMessages(reorderLevel)}
      </div>

      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{barcode.label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={barcode.value}
          onChange={(e) =>
            handleInputChange(setBarcode, barcode, e.target.value)
          }
        />
        {validationMessages(barcode)}
      </div>

      <div className="col-span-full">
        <div className="grid grid-cols-3 gap-4">
          
      <div className="flex flex-col">
  <label className="label">
    <span className="label-text">{productCategory.label}</span>
  </label>
  <div className="flex space-x-2">
    <select
      className="select select-bordered flex-1"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      <option value="" disabled>
        Select Category
      </option>
      {categoryOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.displayName}
        </option>
      ))}
    </select>
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
          setSelectedCategories([...selectedCategories, parseInt(selectedCategory)]);
          setSelectedCategory(""); // Reset the dropdown
        }
      }}
    >
      Add
    </button>
  </div>
</div>


<div className="col-span-2 flex flex-col">
  <label className="label">
    <span className="label-text">Selected Categories</span>
  </label>
  <div className="flex flex-wrap gap-2">
    {selectedCategories.map((categoryId, index) => {
      const category = categoryOptions.find((opt) => opt.id ===parseInt(categoryId));
  

      return (
        <div
          key={index}
          className="flex justify-between items-center p-2 border rounded gap-1 bg-gray-50"
        >
          <span>{category.displayName}</span>
          <button
            type="button"
            className="btn btn-error btn-xs text-base-100"
            onClick={() => setSelectedCategories(
              selectedCategories.filter((id) => id !== categoryId)
            )}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      );
    })}
  </div>
</div>



</div>
</div>



<div className="flex justify-center mt-20 col-span-full">
        <button
          className={`btn btn-primary w-56 ${isSubmitting ? "loading" : ""}`}
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : saveType === SAVE_TYPE.UPDATE
            ? "Update"
            : "Add"}
        </button>
      </div>
 
    </div>
    </div>
  );
}
