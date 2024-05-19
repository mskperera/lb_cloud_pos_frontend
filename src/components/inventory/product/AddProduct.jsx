import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from 'primereact/multiselect';
import React, { useState, useEffect, useRef } from "react";
import { validate } from "../../../utils/formValidation";
import FormElementMessage from "../../messges/FormElementMessage";
import { getDropdownDepartments, getDropdownMeasurementUnit, getDrpdownCategory } from "../../../functions/dropdowns";
import { json, useNavigate } from "react-router-dom";
import { useToast } from "../../useToast";
import { addProduct, getProducts, updateProduct } from "../../../functions/register";
import { SAVE_TYPE } from "../../../utils/constants";

export default function AddProduct({saveType,id}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoGenerateProductNo, setAutoGenerateProductNo] = useState(false); // State to manage checkbox
  const navigate = useNavigate();
  const showToast = useToast();

  const [productNo, setProductNo] = useState({
    label: "Product No",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string"  },
  });
  const [department, setDepartment] = useState({
    label: "Department",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string"  },
  });

  
  const [productName, setProductName] = useState({
    label: "Product Name",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string"  },
  });

  const [productCategory, setProductCategory] = useState({
    label: "Category",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integerArray"  },
  });

  const [measurementUnit, setMeasurementUnit] = useState({
    label: "Measurement Unit",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false , dataType: "integer" },
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
    rules: { required: false, dataType: "string"  }, // Assuming barcode might not be required
  });

  const [taxRatePerc, setTaxRatePerc] = useState({
    label: "TaxRate(%)",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "decimal"  }, // Assuming barcode might not be required
  });


  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", state);
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
    // Ensure that the function returns JSX or null
    return (
      !state.isValid &&
      state.isTouched && (
        <div>
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="mt-2 w-full"
              severity="error"
              text={`${message}`}
            />
          ))}
        </div>
      )
    );
  };

  const [categories1,setCategories1]=useState(null);
  const loadValuesForUpdate=async()=>{
  const ress=await  getProducts({
      productId:id,
      productNo: null,
     productName: null,
     barcode: null,
     productCategoryId:null,
       searchByKeyword:false,
    });

    const {barcode,
      categories,
      measurementUnitId,
      productName,
      productNo,
      reorderLevel,
      taxRate_perc,
      departmentId,
      unitPrice}=ress.data.results[0][0];

      setBarcode(p=>({...p,value:barcode}));
      setProductCategory(p=>({...p,value:JSON.parse(categories).map(c=>c.id)}));
      setMeasurementUnit(p=>({...p,value:measurementUnitId}));
      setProductNo(p=>({...p,value:productNo}));
      setProductName(p=>({...p,value:productName}));
      setReorderLevel(p=>({...p,value:reorderLevel}));
      setTaxRatePerc(p=>({...p,value:taxRate_perc}));
      setUnitPrice(p=>({...p,value:unitPrice}));
      setDepartment(p=>({...p,value:departmentId}));
    console.log('ppppp',ress.data.results[0][0])

  }
  useEffect(()=>{
    if(saveType===SAVE_TYPE.UPDATE){
      loadValuesForUpdate();
    }
  },[saveType]);

  useEffect(()=>{
    loadDrpCategory();
    loadDrpMeasurementUnit();
    loadDrpDepartments();
  },[]);

  const loadDrpCategory=async ()=>{
    const objArr=await getDrpdownCategory();
    setCategoryOptions(objArr.data.results[0])
  }

  const loadDrpMeasurementUnit=async ()=>{
    const objArr=await getDropdownMeasurementUnit();
    setMeasurementUnitOptions(objArr.data.results[0])
  }

  const loadDrpDepartments=async ()=>{
    const objArr=await getDropdownDepartments();
    setDepartmentOptions(objArr.data.results[0])
  }

  const [categoryOptions,setCategoryOptions] =useState([]);
  const [measurementUnitOptions,setMeasurementUnitOptions] =useState([]);
  
  const [departmentOptions,setDepartmentOptions] =useState([]);

useEffect(()=>{
  if(autoGenerateProductNo)
  setProductNo(p=>({...p,value:'[Auto Generate]'}));
else
setProductNo(p=>({...p,value:''}));

},[autoGenerateProductNo])

  const onSubmit=async()=>{

    const payLoad={
      tableId:null,
      branchId:1,
      companyId:1,
      productNo:productNo.value,
      isProductNoAutoGenerate:autoGenerateProductNo,
      productName:productName.value,
      categoryIdList:productCategory.value,
      measurementUnitId:measurementUnit.value,
      unitPrice:unitPrice.value,
      departmentId:department.value,
      barcode:barcode.value,
      reorderLevel:reorderLevel.value
    }

    if(saveType===SAVE_TYPE.ADD){
    const res = await addProduct(payLoad);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      showToast("error", "Exception", error.message);
    }

    const { productId, outputMessage, responseStatus } = res.data.outputValues;
    if(responseStatus==="failed"){
      showToast("warning", "Exception",outputMessage);
    }
    setIsSubmitting(false);
    
    navigate(`/products`)
    showToast("success", "Success", outputMessage);
  }
  else if(saveType===SAVE_TYPE.UPDATE){
    const res = await updateProduct(id,payLoad);
    if (res.data.error) {
      setIsSubmitting(false);
      const { error } = res.data;
      showToast("error", "Exception", error.message);
    }

    const { productId, outputMessage, responseStatus } = res.data.outputValues;
    if(responseStatus==="failed"){
      showToast("warning", "Exception",outputMessage);
    }
    console.log("productId", productId);
    setIsSubmitting(false);
    
    navigate(`/products`)
    showToast("success", "Success", outputMessage);
  }
  }
  return (
    <>
     {saveType===SAVE_TYPE.ADD && <h2 className="text-center">Add Product</h2>}
     {saveType===SAVE_TYPE.UPDATE && <h2 className="text-center">Update Product</h2>}
      <div className="grid px-4">
        <div className="col-12">
          <div className="grid mt-4">
            <div className="col-3">
              <div className="flex flex-column gap-2">
               
                <label htmlFor="productNo">Product No</label>
                <InputText
                  id="productNo"
                  readOnly={autoGenerateProductNo}
                  value={productNo.value}
                  onChange={(e) => {
                    console.log("productNo", e.target.value);
                    handleInputChange(setProductNo, productNo, e.target.value); // Ensure 'discount' state has 'rules'
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(productNo)}
              </div>
            </div>
            <div className="col-3">
              <div className="flex align-items-center gap-2 mt-5">
                <Checkbox
                  inputId="autoGenerate"
                  disabled={saveType===SAVE_TYPE.UPDATE}
                  onChange={(e) => setAutoGenerateProductNo(e.checked)}
                  checked={autoGenerateProductNo}
                />
                <label htmlFor="autoGenerate" className="p-checkbox-label">
                  Auto Generate productNo
                </label>
              </div>
            </div>
              <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="measurementUnit">{department.label}</label>
            <Dropdown
                  id="void-reason"
                   value={department.value}
                  onChange={(e) => {
                     console.log("department", department);
                     handleInputChange(setDepartment, department, e.value);
                  }}
                   options={departmentOptions}
                  optionLabel="displayName" // Property to use as the label
                  optionValue="id" // Property to use as the value
                  placeholder="Select department"
                  className="w-full"
                />
                {validationMessages(department)}
          </div>
        </div>
          </div>{" "}
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="productName">{productName.label}</label>
            <InputText
                  id="productName"
                  value={productName.value}
                  onChange={(e) => {
                    console.log("productName", e.target.value);
                    handleInputChange(setProductName, productName, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(productName)}
          </div>
        </div>
    
        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="measurementUnit">{measurementUnit.label}</label>
            <Dropdown
                  id="void-reason"
                   value={measurementUnit.value}
                  onChange={(e) => {
                     console.log("measurementUnit", measurementUnit);
                     handleInputChange(setMeasurementUnit, measurementUnit, e.value);
                  }}
                   options={measurementUnitOptions}
                  optionLabel="displayName" // Property to use as the label
                  optionValue="id" // Property to use as the value
                  placeholder="Select measurementUnit"
                  className="w-full"
                />
                {validationMessages(measurementUnit)}
          </div>
        </div>
        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="unitPrice">{unitPrice.label}</label>
            <InputText
                  id="unitPrice"
                  value={unitPrice.value}
                  onChange={(e) => {
                    console.log("unitPrice", e.target.value);
                    handleInputChange(setUnitPrice, unitPrice, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(unitPrice)}
          </div>
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="unitPrice">{taxRatePerc.label}</label>
            <InputText
                  id="taxRate"
                  value={taxRatePerc.value}
                  onChange={(e) => {
                    handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(taxRatePerc)}
          </div>
        </div>

        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="reorderLevel">{reorderLevel.label}</label>
            <InputText
                  id="reorderLevel"
                  value={reorderLevel.value}
                  onChange={(e) => {
                    console.log("reorderLevel", e.target.value);
                    handleInputChange(setReorderLevel, reorderLevel, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(reorderLevel)}
          </div>
        </div>
        <div className="col-12 lg:col-3 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="barcode">{barcode.label}</label>
            <InputText
                  id="barcode"
                  value={barcode.value}
                  onChange={(e) => {
                    console.log("barcode", e.target.value);
                    handleInputChange(setBarcode, barcode, e.target.value);
                  }}
                  className="p-inputtext w-full"
                />
                {validationMessages(barcode)}

          </div>
        </div>
        <div className="col-12 lg:col-6 p-2">
          <div className="flex flex-column gap-2">
            <label htmlFor="productCategory">{productCategory.label}</label>
        
            <MultiSelect value={productCategory.value}    onChange={(e) => {
                     console.log("productCategory", productCategory);
                     handleInputChange(setProductCategory, productCategory, e.value);
                  }}
                   options={categoryOptions}
                   optionLabel="displayName" // Property to use as the label
                   optionValue="id" // Property to use as the value
                   placeholder="Select category"
                   className="w-full"
                     display="chip" 
                 maxSelectedLabels={3}
                 />
                {validationMessages(productCategory)}
      

          </div>
        </div>
      </div>

      <div className="grid mt-4 px-4">
        <div className="col-12 p-2 flex justify-content-center">
          <Button
            label={isSubmitting ? "Submitting..." : saveType===SAVE_TYPE.UPDATE ? "Update":"Add"}
            aria-label="Tender"
            className="p-button-rounded p-button-lg p-button-primary"
             onClick={onSubmit}
            style={{ width: "20%" }}
          />
        </div>
      </div>
    </>
  );
}
