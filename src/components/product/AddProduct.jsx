import React, { useState, useEffect, useCallback, useRef } from "react";
import { validate } from "../../utils/formValidation";
import {
  getDropdownBrands,
  getDropdownMeasurementUnit,
  getDrpdownCategory,
  getProductTypesDrp,
  getStoresDrp,
  getVariationTypesDrp,
} from "../../functions/dropdowns";
import { useNavigate } from "react-router-dom";
import { useToast } from "../useToast";
import {
  addProduct,
  getProductExtraDetails,
  getProducts,
  getSubProductList,
  updateProduct,
} from "../../functions/register";
import { SAVE_TYPE } from "../../utils/constants";
import FormElementMessage from "../messges/FormElementMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import StoresComponent from "../storeComponent/StoreComponent";
import {
  commitFile,
  deleteFile,
  markFileAsTobeDeleted,
  uploadImageResized,
} from "../../functions/asset";
import InputField from "../inputField/InputField";
import DialogModel from "../model/DialogModel";
import GhostButton from "../iconButtons/GhostButton";
import ProductSearch from "../productSearch/ProductSearch";
import LoadingSpinner from "../LoadingSpinner";
import SubProductList from "./SubProductList";

const CategoryItem = ({ onClick, category }) => {
  return (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <span className="text-gray-800 font-medium">{category.displayName}</span>
      <FontAwesomeIcon
        icon={faTrash}
        className="text-red-500 hover:text-red-700 cursor-pointer"
        onClick={onClick}
      />
    </div>
  );
};

export default function AddProduct({ saveType = SAVE_TYPE.ADD, id = 0 }) {
  const store = JSON.parse(localStorage.getItem("stores"))[0];
  const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
  const navigate = useNavigate();
  const showToast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoGenerateProductNo, setAutoGenerateProductNo] = useState(true);
  const [stores, setStores] = useState([{ storeId: store.storeId, storeName: store.storeName }]);
  const [isProductItem, setIsProductItem] = useState(true);
  const [isNotForSelling, setIsNotForSelling] = useState(false);
  const [isExpiringProduct, setIsExpiringProduct] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  const [isStockTracked, setIsStockTracked] = useState({ value: true, isDisabled: false });
  const [isAssemblyProduct, setIsAssemblyProduct] = useState({ value: false });
  const [comboIngredients, setComboIngredients] = useState([]);
  const [subProductsList, setSubProductsList] = useState([]);
  const [variations, setVariations] = useState([]);
  const [productNo, setProductNo] = useState({
    label: "Product No",
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
  const [brand, setBrand] = useState({
    label: "Brand",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [unitCost, setUnitCost] = useState({
    label: "Unit Cost",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "decimal" },
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
  const [sku, setSku] = useState({
    label: "SKU",
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
  const [productType, setProductType] = useState({
    label: "Product Type",
    value: "1",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });
  const [subProductSku, setSubProductSku] = useState({
    label: "Sub-Product SKU",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [subProductQty, setSubProductQty] = useState({
    label: "Sub-Product Quantity",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [variationType, setVariationType] = useState({
    label: "Variation Type",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });
  const [variationValue, setVariationValue] = useState({
    label: "Variation Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [isFileSelectLoading, setIsFileSelectLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [variationTypeOptions, setVariationTypeOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [storesOptions, setStoresOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSKU = () => {
    if (!productName.value) {
      showToast("warning", "Warning", "Please enter a product name first.");
      return;
    }
    const prefix = productName.value.replace(/\s+/g, '').slice(0, 5).toUpperCase();
    const randomNum = Math.floor(10 + Math.random() * 90);
    const newSKU = `${prefix}${randomNum}`;
    handleInputChange(setSku, sku, newSKU);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsFileSelectLoading(true);
      const response = await uploadImageResized(file);
      setUploadResponse(response);
      setPreviewUrl(
        `${process.env.REACT_APP_API_CDN}/${response.hash}?width=200&height=200&quality=80`
      );
      setIsFileSelectLoading(false);
    }
  };

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

  const resetValues = () => {
    setStores([{ storeId: store.storeId, storeName: store.storeName }]);
    setIsProductItem(true);
    setIsNotForSelling(false);
    setIsExpiringProduct(false);
    setIsUnique(false);
    setIsStockTracked({ value: true, isDisabled: false });
    setIsAssemblyProduct({ value: false });
    setComboIngredients([]);
    setSubProductsList([]);
    setVariations([]);
    setProductName({ ...productName, value: "", isTouched: false, isValid: false });
    setProductCategory({ ...productCategory, value: "", isTouched: false, isValid: false });
    setMeasurementUnit({ ...measurementUnit, value: "", isTouched: false, isValid: false });
    setBrand({ ...brand, value: "", isTouched: false, isValid: false });
    setUnitCost({ ...unitCost, value: "", isTouched: false, isValid: false });
    setUnitPrice({ ...unitPrice, value: "", isTouched: false, isValid: false });
    setReorderLevel({ ...reorderLevel, value: "", isTouched: false, isValid: false });
    setBarcode({ ...barcode, value: "", isTouched: false, isValid: false });
    setSku({ ...sku, value: "", isTouched: false, isValid: false });
    setTaxRatePerc({ ...taxRatePerc, value: "", isTouched: false, isValid: false });
    setProductType({ ...productType, value: "1", isTouched: false, isValid: false });
    setSubProductSku({ ...subProductSku, value: "", isTouched: false, isValid: false });
    setSubProductQty({ ...subProductQty, value: "", isTouched: false, isValid: false });
    setVariationType({ ...variationType, value: "", isTouched: false, isValid: false });
    setVariationValue({ ...variationValue, value: "", isTouched: false, isValid: false });
  };

  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions([...objArr.data.results[0]]);
  };

  useEffect(() => {
    loadDrpStores();
  }, []);

  const loadValuesForUpdate = async () => {
    setIsLoading(true);
    const res = await getProducts({
      productId: id,
      productNo: null,
      productName: null,
      barcode: null,
      storeId: selectedStore.storeId,
      productCategoryId: null,
      searchByKeyword: false,
      skip: 0,
      limit: 1,
    });

    console.log('loadValuesForUpdate:',res);
    const {
      barcode,
      categories,
      measurementUnitId,
      productName,
      productNo,
      reorderLevel,
      unitCost,
      unitPrice,
      taxPerc,
      brandId,
      productTypeId,
      isStockTracked,
      isProductItem,
      isAssemblyProduct,
      isUnique,
      isNotForSelling,
      sku,
      imageUrl,
      isExpiringProduct,
      allProductId
    } = res.data.results[0][0];

    setBarcode((prev) => ({ ...prev, value: barcode }));
    setSelectedCategories(JSON.parse(categories).map((c) => c.id));
    setMeasurementUnit((prev) => ({ ...prev, value: measurementUnitId }));
    setProductNo((prev) => ({ ...prev, value: productNo }));
    setProductName((prev) => ({ ...prev, value: productName }));
    setTaxRatePerc((prev) => ({ ...prev, value: taxPerc }));
    setUnitCost((prev) => ({ ...prev, value: unitCost }));
    setUnitPrice((prev) => ({ ...prev, value: unitPrice }));
    setBrand((prev) => ({ ...prev, value: brandId }));
    setProductType((prev) => ({ ...prev, value: productTypeId }));
    setIsExpiringProduct(isExpiringProduct);
    setIsProductItem(isProductItem);
    setIsUnique(isUnique);
    setIsNotForSelling(isNotForSelling);
    setSku((prev) => ({ ...prev, value: sku }));
    setImageUrl(imageUrl);
    setPreviewUrl(
      `${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`
    );

   setIsAssemblyProduct((prev) => ({ ...prev, value: isAssemblyProduct===1 }));
   setIsStockTracked((prev) => ({ ...prev, value: isStockTracked===1, isDisabled: false }));
   
    setSubProductsList([]);
    const details = await getProductExtraDetails(id);

    if (productTypeId === 1) {
      setReorderLevel((prev) => ({
        ...prev,
        value: reorderLevel,
      }));
   

      const _singleProductSkuBarcode = details.data.results[0][0];
      const _singleProductStores = details.data.results[1];
      setStores(_singleProductStores);

      if (isAssemblyProduct) {
        const resSubProductist = await getSubProductList(allProductId);
        const _subProducts = resSubProductist.data.results[0];
        setSubProductsList(_subProducts.map(item => ({
          allProductId: item.allProductId_mat,
          qty: item.qty,
          productDescription: item.productDescription,
          productTypeName: item.productTypeName,
          sku: item.sku,
          measurementUnitName: item.measurementUnitName,
        })));
      }
    } else if (productTypeId === 2) {
      setReorderLevel((prev) => ({ ...prev, value: reorderLevel }));
    
      const variationDetails = details.data.results[0];
      console.log('variationDetails',variationDetails)
      const parsedVariations = variationDetails.map((variation) => ({
        ...variation,
        variationDetails:
          typeof variation.variationDetails === "string"
            ? JSON.parse(variation.variationDetails)
            : variation.variationDetails,
       // isAssemblyProduct: variation.isAssemblyProduct===1,
        subProductsList: isAssemblyProduct ? JSON.parse(variation.subProductsList)?.map(item => ({
          qty: item.qty,
          allProductId: item.allProductId,
          productDescription:item.productDescription,
          sku:item.sku,
          measurementUnitName:item.measurementUnitName
        })) || [] : [],
      }));
      setVariations(parsedVariations);

      const productStores = details.data.results[1];
      setStores(productStores);
    } else if (productTypeId === 3) {
      setReorderLevel((prev) => ({ ...prev, isDisabled: true }));
      setIsStockTracked({ value: false, isDisabled: true });

      const _comboProductSkuBarcode = details.data.results[0];
      setComboIngredients(_comboProductSkuBarcode);

      const _comboProductStores = details.data.results[1];
      setStores(_comboProductStores);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (saveType === SAVE_TYPE.UPDATE) {
      loadValuesForUpdate();
    }
  }, [saveType]);

  useEffect(() => {
    loadDrpCategory();
    loadDrpMeasurementUnit();
    loadDrpBrands();
    loadDrpProductTypes();
    loadDrpVariationTypes();
  }, []);

  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions(objArr.data.results[0]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions(objArr.data.results[0]);
  };

  const loadDrpBrands = async () => {
    const objArr = await getDropdownBrands();
    setBrandOptions(objArr.data.results[0]);
  };

  const loadDrpProductTypes = async () => {
    const objArr = await getProductTypesDrp();
    setProductTypeOptions(objArr.data.results[0]);
  };

  const loadDrpVariationTypes = async () => {
    const objArr = await getVariationTypesDrp();
    const options = objArr.data.results[0];
    setVariationTypeOptions(options);
    setVariationType({ ...variationType, value: options[0]?.id || "" });
  };

  useEffect(() => {
    if (autoGenerateProductNo)
      setProductNo({ ...productNo, value: "[Auto Generate]" });
    else setProductNo({ ...productNo, value: "" });
  }, [autoGenerateProductNo]);

  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const _variations = variations.map((v) => ({
        ...v,
        variationDetails:
          typeof v.variationDetails === "string"
            ? JSON.parse(v.variationDetails)
            : v.variationDetails,
        //isAssemblyProduct: v.isAssemblyProduct || false,
        subProductsList: isAssemblyProduct.value ? v.subProductsList || [] : [],
      }));
      const _comboIngredients = [...comboIngredients];
      const _prepaired_comboIngredients = _comboIngredients.map((item) => ({
        barcode: item.barcode,
        measurementUnitName: item.measurementUnitName,
        productId: item.productId,
        productId_mat: item.productTypeId === 1 ? item.productId_mat : null,
        variationProductId_mat: item.productTypeId === 2 ? item.productId_mat : null,
        productName: item.productName,
        productTypeId: item.productTypeId,
        productTypeName: item.productTypeName,
        qty: item.qty,
        sku: item.sku,
      }));
      const _subProductsList = subProductsList.map((item) => ({
        qty: item.qty,
        allProductId: item.allProductId,
      }));

      const payLoad = {
        tableId: null,
        productNo: productNo.value,
        productTypeId: parseInt(productType.value),
        storeIdList: stores,
        isProductNoAutoGenerate: autoGenerateProductNo,
        productName: productName.value,
        categoryIdList: selectedCategories,
        variationProductList: _variations,
        comboProductDetailList: _prepaired_comboIngredients,
        subProductsList: _subProductsList,
        measurementUnitId: measurementUnit.value,
        isNotForSelling: isNotForSelling,
        imgUrl: uploadResponse?.hash || imageUrl,
        isUnique: isUnique,
        isStockTracked: isStockTracked.value,
        isProductItem: isProductItem,
        isAssemblyProduct: isAssemblyProduct.value,
        brandId: brand.value,
        unitCost: isNumeric(unitCost.value) ? unitCost.value : null,
        unitPrice: isNumeric(unitPrice.value) ? unitPrice.value : null,
        taxPerc: isNumeric(taxRatePerc.value) ? taxRatePerc.value : null,
        sku: sku.value,
        barcode: barcode.value === '' ? null : barcode.value,
        reorderLevel: reorderLevel.value ? reorderLevel.value : null,
        isExpiringProduct: isExpiringProduct,
      };
      setIsSubmitting(true);
      if (saveType === SAVE_TYPE.ADD) {
        const res = await addProduct(payLoad);
        if (res.data.error) {
          showToast("danger", "Exception", res.data.error.message);
          setIsSubmitting(false);
          return;
        }
        const { outputMessage, responseStatus } = res.data.outputValues;
        if (responseStatus === "failed") {
          showToast("warning", "Exception", outputMessage);
          setIsSubmitting(false);
        } else {
          if (uploadResponse) {
            await commitFile(uploadResponse.hash);
          }
          showToast("success", "Success", outputMessage);
          resetValues();
        }
      } else if (saveType === SAVE_TYPE.UPDATE) {
        const res = await updateProduct(id, payLoad);
        if (res.data.error) {
          showToast("danger", "Exception", res.data.error.message);
          setIsSubmitting(false);
          return;
        }
        const { outputMessage, responseStatus } = res.data.outputValues;
        if (responseStatus === "failed") {
          showToast("warning", "Exception", outputMessage);
          setIsSubmitting(false);
        } else {
          if (imageUrl) {
            await markFileAsTobeDeleted(imageUrl);
          }
          if (uploadResponse) {
            await commitFile(uploadResponse.hash);
          }
          await loadValuesForUpdate();
          showToast("success", "Success", outputMessage);
        }
      } else {
        showToast("danger", "Exception", "Invalid Save type");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("payloadd", error);
    }
  };

  const handleNewAddVariation = () => {
    const lastVariation = variations[variations.length - 1];
    const newVariation = {
      variationProductId: null,
      sku: "",
      barcode: "",
      unitCost: "",
      unitPrice: "",
      taxPerc: "",
      variationDetails: lastVariation
        ? lastVariation.variationDetails.map((detail) => ({
            variationTypeId: detail.variationTypeId,
            variationTypeName: detail.variationTypeName,
            variationValue: "",
          }))
        : [],
      isAssemblyProduct: false,
      subProductsList: [],
    };
    setVariations((prevVariations) => [...prevVariations, newVariation]);
  };

  const handleAddVariation = () => {
    if (!variationType.value) {
      alert("Please select a valid variation type");
      return;
    }
    setVariations((prevIngredients) =>
      prevIngredients.map((ingredient) => {
        const existingVariationType = ingredient.variationDetails?.find(
          (detail) => detail.variationTypeId === variationType.value
        );
        if (existingVariationType) {
          return ingredient;
        }
        return {
          ...ingredient,
          variationDetails: [
            ...ingredient.variationDetails,
            {
              variationTypeId: variationType.value,
              variationTypeName: variationTypeOptions.find(
                (o) => o.id == variationType.value
              )?.displayName,
              variationValue: "",
            },
          ],
        };
      })
    );
  };

  const handleRemoveVariation = (variationProductId, index) => {
    setVariations((prevVariations) => prevVariations.filter((_, i) => i !== index));
  };

  const handleRemoveVariationType = (variationTypeId) => {
    const updatedVariations = variations.map((item) => {
      const variationDetails = item.variationDetails;
      const updatedVariationDetails = variationDetails.filter(
        (detail) => detail.variationTypeId !== variationTypeId
      );
      return { ...item, variationDetails: updatedVariationDetails };
    });
    setVariations(updatedVariations);
  };

  const handleVariationChange = (value, index, variationTypeId) => {
    setVariations((prevVariations) =>
      prevVariations.map((variation, i) =>
        i === index
          ? {
              ...variation,
              variationDetails: Array.isArray(variation.variationDetails)
                ? variation.variationDetails.map((detail) =>
                    detail.variationTypeId === variationTypeId
                      ? { ...detail, variationValue: value }
                      : detail
                  )
                : [],
            }
          : variation
      )
    );
  };

  const handleAssemblyChange = (index, checked) => {
    setVariations((prevVariations) =>
      prevVariations.map((variation, i) =>
        i === index
          ? {
              ...variation,
              isAssemblyProduct: checked,
              subProductsList: checked ? variation.subProductsList || [] : [],
            }
          : variation
      )
    );
  };

  const handleSubProductsChange = (index, newSubProductsList) => {
    setVariations((prevVariations) =>
      prevVariations.map((variation, i) =>
        i === index
          ? { ...variation, subProductsList: newSubProductsList }
          : variation
      )
    );
  };

  const setStoresHandler = (stores) => {
    setStores(stores);
  };

  const getInstruction = (key) => {
    switch (key) {
      case "isProductItem":
        return isProductItem
          ? "Check this if the item is a physical product you can count, like goods."
          : "Uncheck this if the item is a service, like installation or consulting.";
      case "isNotForSelling":
        return isNotForSelling
          ? "Check this to mark the item as 'Not for Sale' for internal use only."
          : "Uncheck this to make the item available for sale to customers.";
      case "isUnique":
        return isUnique
          ? "Check this for one-of-a-kind items that can't be restocked."
          : "Uncheck this for items you can restock and sell multiple times.";
      case "isStockTracked":
        return isStockTracked.value
          ? "Check this to automatically keep track of how many you have in stock. When you sell one, the count goes down."
          : "Uncheck this to manually manage stock. Inventory won't update automatically on sales.";
      case "isAssemblyProduct":
        return isAssemblyProduct
          ? "Check this if the item is made from other products (an assembly)."
          : "Uncheck this if the item is a standalone product, not made from others.";
      case "isExpiringProduct":
        return isExpiringProduct
          ? "Check this if the item has an expiration date, like food or medicine."
          : "Uncheck this if the item doesn't expire, like tools or clothes.";
      default:
        return "";
    }
  };

  const handleProductClick = (p) => {
    handleInputChange(setSubProductSku, subProductSku, p.sku);
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

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {saveType === SAVE_TYPE.ADD ? "Add Product" : "Update Product"}
        </h2>
        {isLoading ? (
          <LoadingSpinner loadingMessage="Loading please wait..." />
        ) : (
          <form onSubmit={onSubmit} className="space-y-8">
            {/* General Information Section */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputField
                  label={productName.label}
                  value={productName.value}
                  onChange={(e) => handleInputChange(setProductName, productName, e.target.value)}
                  validationMessages={validationMessages(productName)}
                  placeholder="Enter product name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">{measurementUnit.label}</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    value={measurementUnit.value}
                    onChange={(e) => handleInputChange(setMeasurementUnit, measurementUnit, e.target.value)}
                  >
                    <option value="" disabled>Select Measurement Unit</option>
                    {measurementUnitOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.displayName}</option>
                    ))}
                  </select>
                  {validationMessages(measurementUnit)}
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">{brand.label}</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    value={brand.value}
                    onChange={(e) => handleInputChange(setBrand, brand, e.target.value)}
                  >
                    <option value="" disabled>Select Brand</option>
                    {brandOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.displayName}</option>
                    ))}
                  </select>
                  {validationMessages(brand)}
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">{productType.label}</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    value={productType.value}
                    onChange={(e) => handleInputChange(setProductType, productType, e.target.value)}
                    disabled={saveType === SAVE_TYPE.UPDATE}
                  >
                    {productTypeOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.displayName}</option>
                    ))}
                  </select>
                  {validationMessages(productType)}
                </div>
                <StoresComponent stores={stores} setStores={setStoresHandler} />
              </div>
            </div>
            {/* Category Section */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">{productCategory.label}</label>
                  <div className="flex gap-2">
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="" disabled>Select Category</option>
                      {categoryOptions.map((option) => (
                        <option key={option.id} value={option.id}>{option.displayName}</option>
                      ))}
                    </select>
                    <GhostButton
                      onClick={() => {
                        if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
                          setSelectedCategories([...selectedCategories, parseInt(selectedCategory)]);
                          setSelectedCategory("");
                        }
                      }}
                      disabled={selectedCategory === ""}
                      iconClass="pi pi-plus-circle text-lg"
                      labelClass="text-md font-normal"
                      label="Add"
                      color="text-sky-500"
                      hoverClass="hover:text-sky-700 hover:bg-transparent"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-2 mt-6">
                    {categoryOptions.length > 0 &&
                      selectedCategories?.map((categoryId, index) => {
                        const category = categoryOptions.find((opt) => opt.id === parseInt(categoryId));
                        return (
                          <CategoryItem
                            key={categoryId}
                            category={category}
                            onClick={() => setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))}
                          />
                        );
                      })}
                  </div>
                </div>
                <div>
                  {productType.value != "3" && (
                    <InputField
                      label={reorderLevel.label}
                      value={reorderLevel.value}
                      isDisabled={reorderLevel.isDisabled}
                      onChange={(e) => handleInputChange(setReorderLevel, reorderLevel, e.target.value)}
                      validationMessages={validationMessages(reorderLevel)}
                      placeholder="Enter Reorder Level"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Product Options Section */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoDeductInventory"
                      className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      onChange={(e) => setIsProductItem(e.target.checked)}
                      checked={isProductItem}
                    />
                    <label htmlFor="autoDeductInventory" className="font-medium text-gray-700">Product Item</label>
                  </div>
                  <p className="text-gray-500">{getInstruction("isProductItem")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isNotForSelling"
                      className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      onChange={(e) => setIsNotForSelling(e.target.checked)}
                      checked={isNotForSelling}
                    />
                    <label htmlFor="isNotForSelling" className="font-medium text-gray-700">Not For Selling</label>
                  </div>
                  <p className="text-gray-500">{getInstruction("isNotForSelling")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isStockTracked"
                      className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      onChange={(e) => setIsStockTracked({ ...isStockTracked, value: e.target.checked })}
                      checked={isStockTracked.value}
                      disabled={!isProductItem || isStockTracked.isDisabled}
                    />
                    <label htmlFor="isStockTracked" className="font-medium text-gray-700">Stock Tracked</label>
                  </div>
                  <p className="text-gray-500">{getInstruction("isStockTracked")}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isExpiringProduct"
                      className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      onChange={(e) => setIsExpiringProduct(e.target.checked)}
                      checked={isExpiringProduct}
                    />
                    <label htmlFor="isExpiringProduct" className="font-medium text-gray-700">Expiring Product</label>
                  </div>
                  <p className="text-gray-500">{getInstruction("isExpiringProduct")}</p>
                </div>
      
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isAssemblyProduct"
                        className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                        onChange={(e) => setIsAssemblyProduct({ ...isAssemblyProduct, value: e.target.checked })}
                        checked={isAssemblyProduct.value}
                      />
                      <label htmlFor="isAssemblyProduct" className="font-medium text-gray-700">Assembly Product</label>
                    </div>
                    <p className="text-gray-500">{getInstruction("isAssemblyProduct")}</p>
                  </div>
               
              </div>
            </div>
            {/* Sub-Products Section (Assembly Product) */}
            {isAssemblyProduct.value && productType.value == "1" ? (
              <SubProductList
                subProductsList={subProductsList}
                setSubProductsList={setSubProductsList}
              />
            ) : null}

            {/* Product Details Section (for Product Type 1 and 3) */}
            {(productType.value == "1" || productType.value == "3") && (
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">{sku.label}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                        value={sku.value}
                        onChange={(e) => handleInputChange(setSku, sku, e.target.value)}
                        placeholder="Enter SKU"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
                        onClick={generateSKU}
                      >
                        Generate SKU
                      </button>
                    </div>
                    {validationMessages(sku)}
                  </div>
                  <InputField
                    label={barcode.label}
                    value={barcode.value}
                    onChange={(e) => handleInputChange(setBarcode, barcode, e.target.value)}
                    validationMessages={validationMessages(barcode)}
                    placeholder="Enter Barcode"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                  />
                  <InputField
                    label={unitCost.label}
                    value={unitCost.value}
                    onChange={(e) => handleInputChange(setUnitCost, unitCost, e.target.value)}
                    validationMessages={validationMessages(unitCost)}
                    placeholder="Enter Unit Cost"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                  />
                  <InputField
                    label={unitPrice.label}
                    value={unitPrice.value}
                    onChange={(e) => handleInputChange(setUnitPrice, unitPrice, e.target.value)}
                    validationMessages={validationMessages(unitPrice)}
                    placeholder="Enter Unit Price"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                  />
                  <InputField
                    label={taxRatePerc.label}
                    value={taxRatePerc.value}
                    onChange={(e) => handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value)}
                    validationMessages={validationMessages(taxRatePerc)}
                    placeholder="Enter Tax Rate (%)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}

            {/* Variations Section (Product Type 2) */}
            {productType.value == "2" && (
              <div className="p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Variations</h3>
                <div className="flex justify-between gap-4 mb-6">
                  <div className="">
                    <label className=" font-medium text-gray-700 mb-2 block">Variation Type</label>
                    <div className="flex items-center gap-3">
                      <select
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 bg-white"
                        value={variationType.value}
                        onChange={(e) => handleInputChange(setVariationType, variationType, e.target.value)}
                      >
                        <option value="" disabled>Select Variation Type</option>
                        {variationTypeOptions.map((option) => (
                          <option key={option.id} value={option.id}>{option.displayName}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 flex items-center gap-2"
                        onClick={handleAddVariation}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Type
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <label className=" font-medium text-gray-700 mb-2 block"></label>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                      onClick={handleNewAddVariation}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      New Variation
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50  font-medium text-gray-700 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Barcode</th>
                        <th className="px-4 py-3 text-left">Unit Cost</th>
                        <th className="px-4 py-3 text-left">Unit Price</th>
                        <th className="px-4 py-3 text-left">Tax (%)</th>
                        {/* <th className="px-4 py-3 text-left">Assembly Product</th> */}
                        {variations[0]?.variationDetails &&
                          variations[0].variationDetails.map((c) => (
                            <th key={c.variationTypeId} className="px-4 py-3 text-left">
                              <div className="flex items-center gap-2">
                                <span>{c.variationTypeName}</span>
                                <button
                                  type="button"
                                  className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
                                  onClick={() => handleRemoveVariationType(c.variationTypeId)}
                                  aria-label={`Remove ${c.variationTypeName} Type`}
                                  title={`Remove ${c.variationTypeName} Type`}
                                >
                                  <FontAwesomeIcon icon={faClose} size="sm" />
                                </button>
                              </div>
                            </th>
                          ))}
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((variation, index) => (
                        <React.Fragment key={variation.variationProductId || index}>
                        
                          <tr className="transition-colors duration-150">
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
                                value={variation.sku}
                                onChange={(e) => {
                                  const updatedSku = e.target.value;
                                  setVariations((prevVariations) =>
                                    prevVariations.map((item, i) =>
                                      i === index ? { ...item, sku: updatedSku } : item
                                    )
                                  );
                                }}
                                placeholder="Enter SKU"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
                                value={variation.barcode}
                                onChange={(e) => {
                                  const updatedBarcode = e.target.value;
                                  setVariations((prevVariations) =>
                                    prevVariations.map((item, i) =>
                                      i === index ? { ...item, barcode: updatedBarcode } : item
                                    )
                                  );
                                }}
                                placeholder="Enter Barcode"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
                                value={variation.unitCost}
                                onChange={(e) => {
                                  const updatedUnitCost = e.target.value;
                                  setVariations((prevVariations) =>
                                    prevVariations.map((item, i) =>
                                      i === index ? { ...item, unitCost: updatedUnitCost } : item
                                    )
                                  );
                                }}
                                placeholder="Enter Unit Cost"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
                                value={variation.unitPrice}
                                onChange={(e) => {
                                  const updatedUnitPrice = e.target.value;
                                  setVariations((prevVariations) =>
                                    prevVariations.map((item, i) =>
                                      i === index ? { ...item, unitPrice: updatedUnitPrice } : item
                                    )
                                  );
                                }}
                                placeholder="Enter Unit Price"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
                                value={variation.taxPerc}
                                onChange={(e) => {
                                  const updatedTaxPerc = e.target.value;
                                  setVariations((prevVariations) =>
                                    prevVariations.map((item, i) =>
                                      i === index ? { ...item, taxPerc: updatedTaxPerc } : item
                                    )
                                  );
                                }}
                                placeholder="Enter Tax %"
                              />
                            </td>
                            {/* <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                checked={variation.isAssemblyProduct}
                                onChange={(e) => handleAssemblyChange(index, e.target.checked)}
                              />
                            </td> */}
                            {variation.variationDetails &&
                              variation.variationDetails.map((detail) => (
                                <td key={detail.variationTypeId} className="px-4 py-2">
                                  <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
                                    value={detail.variationValue}
                                    onChange={(e) => handleVariationChange(e.target.value, index, detail.variationTypeId)}
                                    placeholder={`Enter ${detail.variationTypeName}`}
                                  />
                                </td>
                              ))}
                            <td className="px-4 py-2">
                              <button
                                type="button"
                                className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
                                onClick={() => handleRemoveVariation(variation.variationProductId, index)}
                                aria-label="Remove Variation Row"
                                title="Remove Variation Row"
                              >
                                <FontAwesomeIcon icon={faClose} size="sm" />
                              </button>
                            </td>
                          </tr>
                          {isAssemblyProduct.value && (
                            <tr className="border-b ">
                      
                              <td colSpan={variation.variationDetails.length + 7} className="px-20 pb-10">
                                <SubProductList
                                  subProductsList={variation.subProductsList}
                                  setSubProductsList={(newSubProductsList) =>
                                    handleSubProductsChange(index, newSubProductsList)
                                  }
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Combo Ingredients Section (Product Type 3) */}
            {productType.value == "3" && (
              <div className="bg-gray-50 p-6 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Combo Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Search Product</label>
                    <ProductSearch onProductSelect={handleProductClick} />
                    {validationMessages(subProductSku)}
                  </div>
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">{subProductQty.label}</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                      value={subProductQty.value}
                      onChange={(e) => handleInputChange(setSubProductQty, subProductQty, e.target.value)}
                      placeholder="Enter Quantity"
                    />
                    {validationMessages(subProductQty)}
                  </div>
                  <button
                    type="button"
                    className="self-end px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
                    onClick={async () => {
                      const filteredData = {
                        productId: null,
                        productNo: null,
                        productName: "",
                        sku: subProductSku.value,
                        barcode: null,
                        brandId: null,
                        storeId: selectedStore.storeId,
                        productTypeIds: null,
                        categoryId: -1,
                        measurementUnitId: -1,
                        searchByKeyword: false,
                        skip: 0,
                        limit: 1,
                      };
                      const _result = await getProducts(filteredData);
                      const product = _result.data.results[0][0];
                      if (!product) {
                        showToast("danger", "Exception", "Product not found.");
                        return;
                      }
                      const _comboIngredents = {
                        measurementUnitName: product.measurementUnitName,
                        productId: product.productId,
                        productId_mat: product.productTypeId === 1 ? product.productId : product.productTypeId === 2 ? product.variationProductId : null,
                        productName: product.productName,
                        productTypeId: product.productTypeId,
                        productTypeName: product.productTypeName,
                        sku: product.sku,
                        qty: subProductQty.value,
                      };
                      const existingComboIngre = [...comboIngredients];
                      if (existingComboIngre.find((i) => i.sku === product.sku)) {
                        showToast("danger", "Exception", "The Product already exists.");
                        return;
                      }
                      existingComboIngre.push(_comboIngredents);
                      setComboIngredients(existingComboIngre);
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left">Product Name</th>
                        <th className="px-4 py-2 text-left">Product Type</th>
                        <th className="px-4 py-2 text-left">SKU</th>
                        <th className="px-4 py-2 text-left">Qty</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {comboIngredients.map((item) => (
                        <tr key={item.productId} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{item.productName}</td>
                          <td className="px-4 py-2">{item.productTypeName}</td>
                          <td className="px-4 py-2">{item.sku}</td>
                          <td className="px-4 py-2">{item.qty} {item.measurementUnitName}</td>
                          <td className="px-4 py-2">
                            <button
                              className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-200"
                              onClick={async () => {
                                const updatedExtraDetails = comboIngredients.filter(
                                  (c) => c.productId !== item.productId
                                );
                                setComboIngredients(updatedExtraDetails);
                              }}
                              aria-label="Delete"
                              title="Delete Product"
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
            )}

            {/* Image Upload Section */}
            <div className="bg-gray-50 p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Image</h3>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center cursor-pointer">
                  <span className="mb-2 font-medium text-gray-700">Upload an Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center w-40 h-12 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 transition-colors duration-200">
                    Choose File
                  </div>
                </label>
                {isFileSelectLoading ? (
                  <div className="w-full max-w-md text-center">
                    <div className="relative overflow-hidden rounded-lg">
                      <svg className="animate-spin h-8 w-8 text-sky-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                ) : (
                  previewUrl && (
                    <div className="w-full max-w-md text-center">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="object-contain w-full max-h-32 rounded-lg"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className={`w-56 py-3 px-6 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 font-semibold ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : saveType === SAVE_TYPE.UPDATE ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { validate } from "../../utils/formValidation";
// import {
//   getDropdownBrands,
//   getDropdownMeasurementUnit,
//   getDrpdownCategory,
//   getProductTypesDrp,
//   getStoresDrp,
//   getVariationTypesDrp,
// } from "../../functions/dropdowns";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../useToast";
// import {
//   addProduct,
//   getProductExtraDetails,
//   getProducts,
//   getSubProductList,
//   updateProduct,
// } from "../../functions/register";
// import { SAVE_TYPE } from "../../utils/constants";
// import FormElementMessage from "../messges/FormElementMessage";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faClose, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import StoresComponent from "../storeComponent/StoreComponent";
// import {
//   commitFile,
//   deleteFile,
//   markFileAsTobeDeleted,
//   uploadImageResized,
// } from "../../functions/asset";
// import InputField from "../inputField/InputField";
// import DialogModel from "../model/DialogModel";
// import GhostButton from "../iconButtons/GhostButton";
// import ProductSearch from "../productSearch/ProductSearch";
// import LoadingSpinner from "../LoadingSpinner";
// import SubProductList from "./SubProductList";

// const CategoryItem = ({ onClick, category }) => {
//   return (
//     <div className="flex justify-between items-center p-3 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
//       <span className="text-gray-800 font-medium">{category.displayName}</span>
//       <FontAwesomeIcon
//         icon={faTrash}
//         className="text-red-500 hover:text-red-700 cursor-pointer"
//         onClick={onClick}
//       />
//     </div>
//   );
// };

// export default function AddProduct({ saveType = SAVE_TYPE.ADD, id = 0 }) {
//   const store = JSON.parse(localStorage.getItem("stores"))[0];
//   const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
//   const navigate = useNavigate();
//   const showToast = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [autoGenerateProductNo, setAutoGenerateProductNo] = useState(true);
//   const [stores, setStores] = useState([{ storeId: store.storeId, storeName: store.storeName }]);
//   const [isProductItem, setIsProductItem] = useState(true);
//   const [isNotForSelling, setIsNotForSelling] = useState(false);
//   const [isExpiringProduct, setIsExpiringProduct] = useState(false);
//   const [isUnique, setIsUnique] = useState(false);
//   const [isStockTracked, setIsStockTracked] = useState({ value: true, isDisabled: false });
//   const [isAssemblyProduct, setIsAssemblyProduct] = useState({ value: false });
//   const [comboIngredients, setComboIngredients] = useState([]);
//   const [subProductsList, setSubProductsList] = useState([]);
//   const [variations, setVariations] = useState([]);
//   const [productNo, setProductNo] = useState({
//     label: "Product No",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [productName, setProductName] = useState({
//     label: "Product Name",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [productCategory, setProductCategory] = useState({
//     label: "Category",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integerArray" },
//   });
//   const [measurementUnit, setMeasurementUnit] = useState({
//     label: "Measurement Unit",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });
//   const [brand, setBrand] = useState({
//     label: "Brand",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [unitCost, setUnitCost] = useState({
//     label: "Unit Cost",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [unitPrice, setUnitPrice] = useState({
//     label: "Unit Price",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [reorderLevel, setReorderLevel] = useState({
//     label: "Reorder Level",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [barcode, setBarcode] = useState({
//     label: "Barcode",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [sku, setSku] = useState({
//     label: "SKU",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [taxRatePerc, setTaxRatePerc] = useState({
//     label: "Tax Rate (%)",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [productType, setProductType] = useState({
//     label: "Product Type",
//     value: "1",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });
//   const [subProductSku, setSubProductSku] = useState({
//     label: "Sub-Product SKU",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [subProductQty, setSubProductQty] = useState({
//     label: "Sub-Product Quantity",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [variationType, setVariationType] = useState({
//     label: "Variation Type",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });
//   const [variationValue, setVariationValue] = useState({
//     label: "Variation Value",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [isFileSelectLoading, setIsFileSelectLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploadResponse, setUploadResponse] = useState(null);
//   const [categoryOptions, setCategoryOptions] = useState([]);
//   const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
//   const [brandOptions, setBrandOptions] = useState([]);
//   const [productTypeOptions, setProductTypeOptions] = useState([]);
//   const [variationTypeOptions, setVariationTypeOptions] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const [storesOptions, setStoresOptions] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const generateSKU = () => {
//     if (!productName.value) {
//       showToast("warning", "Warning", "Please enter a product name first.");
//       return;
//     }
//     const prefix = productName.value.replace(/\s+/g, '').slice(0, 5).toUpperCase();
//     const randomNum = Math.floor(10 + Math.random() * 90);
//     const newSKU = `${prefix}${randomNum}`;
//     handleInputChange(setSku, sku, newSKU);
//   };

//   const handleImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setIsFileSelectLoading(true);
//       const response = await uploadImageResized(file);
//       setUploadResponse(response);
//       setPreviewUrl(
//         `${process.env.REACT_APP_API_CDN}/${response.hash}?width=200&height=200&quality=80`
//       );
//       setIsFileSelectLoading(false);
//     }
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

//   const resetValues = () => {
//     setStores([{ storeId: store.storeId, storeName: store.storeName }]);
//     setIsProductItem(true);
//     setIsNotForSelling(false);
//     setIsExpiringProduct(false);
//     setIsUnique(false);
//     setIsStockTracked({ value: true, isDisabled: false });
//     setIsAssemblyProduct({ value: false });
//     setComboIngredients([]);
//     setSubProductsList([]);
//     setVariations([]);
//     setProductName({ ...productName, value: "", isTouched: false, isValid: false });
//     setProductCategory({ ...productCategory, value: "", isTouched: false, isValid: false });
//     setMeasurementUnit({ ...measurementUnit, value: "", isTouched: false, isValid: false });
//     setBrand({ ...brand, value: "", isTouched: false, isValid: false });
//     setUnitCost({ ...unitCost, value: "", isTouched: false, isValid: false });
//     setUnitPrice({ ...unitPrice, value: "", isTouched: false, isValid: false });
//     setReorderLevel({ ...reorderLevel, value: "", isTouched: false, isValid: false });
//     setBarcode({ ...barcode, value: "", isTouched: false, isValid: false });
//     setSku({ ...sku, value: "", isTouched: false, isValid: false });
//     setTaxRatePerc({ ...taxRatePerc, value: "", isTouched: false, isValid: false });
//     setProductType({ ...productType, value: "1", isTouched: false, isValid: false });
//     setSubProductSku({ ...subProductSku, value: "", isTouched: false, isValid: false });
//     setSubProductQty({ ...subProductQty, value: "", isTouched: false, isValid: false });
//     setVariationType({ ...variationType, value: "", isTouched: false, isValid: false });
//     setVariationValue({ ...variationValue, value: "", isTouched: false, isValid: false });
//   };

//   const loadDrpStores = async () => {
//     const objArr = await getStoresDrp();
//     setStoresOptions([...objArr.data.results[0]]);
//   };

//   useEffect(() => {
//     loadDrpStores();
//   }, []);

//   const loadValuesForUpdate = async () => {
//     setIsLoading(true);
//     const res = await getProducts({
//       productId: id,
//       productNo: null,
//       productName: null,
//       barcode: null,
//       storeId: selectedStore.storeId,
//       productCategoryId: null,
//       searchByKeyword: false,
//       skip: 0,
//       limit: 1,
//     });

//     const {
//       barcode,
//       categories,
//       measurementUnitId,
//       productName,
//       productNo,
//       reorderLevel,
//       unitCost,
//       unitPrice,
//       taxPerc,
//       brandId,
//       productTypeId,
//       isStockTracked,
//       isProductItem,
//       isAssemblyProduct,
//       isUnique,
//       isNotForSelling,
//       sku,
//       imageUrl,
//       isExpiringProduct,
//       allProductId
//     } = res.data.results[0][0];

//     setBarcode((prev) => ({ ...prev, value: barcode }));
//     setSelectedCategories(JSON.parse(categories).map((c) => c.id));
//     setMeasurementUnit((prev) => ({ ...prev, value: measurementUnitId }));
//     setProductNo((prev) => ({ ...prev, value: productNo }));
//     setProductName((prev) => ({ ...prev, value: productName }));
//     setTaxRatePerc((prev) => ({ ...prev, value: taxPerc }));
//     setUnitCost((prev) => ({ ...prev, value: unitCost }));
//     setUnitPrice((prev) => ({ ...prev, value: unitPrice }));
//     setBrand((prev) => ({ ...prev, value: brandId }));
//     setProductType((prev) => ({ ...prev, value: productTypeId }));
//     setIsExpiringProduct(isExpiringProduct);
//     setIsProductItem(isProductItem);
//     setIsUnique(isUnique);
//     setIsNotForSelling(isNotForSelling);
//     setSku((prev) => ({ ...prev, value: sku }));
//     setImageUrl(imageUrl);
//     setPreviewUrl(
//       `${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`
//     );

//     setSubProductsList([]);
//     const details = await getProductExtraDetails(id);

//     if (productTypeId === 1) {
//       setReorderLevel((prev) => ({
//         ...prev,
//         value: reorderLevel,
//       }));
//       setIsStockTracked((prev) => ({ ...prev, value: isStockTracked, isDisabled: false }));
//       setIsAssemblyProduct((prev) => ({ ...prev, value: isAssemblyProduct }));

//       const _singleProductSkuBarcode = details.data.results[0][0];
//       const _singleProductStores = details.data.results[1];
//       setStores(_singleProductStores);

//       if (isAssemblyProduct) {
//        const resSubProductist=await getSubProductList(allProductId);

//         const _subProducts = resSubProductist.data.results[0];
//                console.log('_subProducts:',_subProducts)

//         setSubProductsList(_subProducts.map(item => ({
//           allProductId: item.allProductId_mat,
//           qty: item.qty,
//           productDescription: item.productDescription,
//           productTypeName: item.productTypeName,
//           sku: item.sku,
//           measurementUnitName: item.measurementUnitName,
//         })));
//       }
//     } else if (productTypeId === 2) {
//       setReorderLevel((prev) => ({ ...prev, value: reorderLevel }));
//       setIsStockTracked({ value: isStockTracked, isDisabled: false });

//       const variationDetails = details.data.results[0];
//       const parsedVariations = variationDetails.map((variation) => ({
//         ...variation,
//         variationDetails:
//           typeof variation.variationDetails === "string"
//             ? JSON.parse(variation.variationDetails)
//             : variation.variationDetails,
//       }));
//       setVariations(parsedVariations);

//       const productStores = details.data.results[1];
//       setStores(productStores);
//     } else if (productTypeId === 3) {
//       setReorderLevel((prev) => ({ ...prev, isDisabled: true }));
//       setIsStockTracked({ value: false, isDisabled: true });

//       const _comboProductSkuBarcode = details.data.results[0];
//       setComboIngredients(_comboProductSkuBarcode);

//       const _comboProductStores = details.data.results[1];
//       setStores(_comboProductStores);
//     }

//     setIsLoading(false);
//   };

//   useEffect(() => {
//     if (saveType === SAVE_TYPE.UPDATE) {
//       loadValuesForUpdate();
//     }
//   }, [saveType]);

//   useEffect(() => {
//     loadDrpCategory();
//     loadDrpMeasurementUnit();
//     loadDrpBrands();
//     loadDrpProductTypes();
//     loadDrpVariationTypes();
//   }, []);

//   const loadDrpCategory = async () => {
//     const objArr = await getDrpdownCategory();
//     setCategoryOptions(objArr.data.results[0]);
//   };

//   const loadDrpMeasurementUnit = async () => {
//     const objArr = await getDropdownMeasurementUnit();
//     setMeasurementUnitOptions(objArr.data.results[0]);
//   };

//   const loadDrpBrands = async () => {
//     const objArr = await getDropdownBrands();
//     setBrandOptions(objArr.data.results[0]);
//   };

//   const loadDrpProductTypes = async () => {
//     const objArr = await getProductTypesDrp();
//     setProductTypeOptions(objArr.data.results[0]);
//   };

//   const loadDrpVariationTypes = async () => {
//     const objArr = await getVariationTypesDrp();
//     const options = objArr.data.results[0];
//     setVariationTypeOptions(options);
//     setVariationType({ ...variationType, value: options[0]?.id || "" });
//   };

//   useEffect(() => {
//     if (autoGenerateProductNo)
//       setProductNo({ ...productNo, value: "[Auto Generate]" });
//     else setProductNo({ ...productNo, value: "" });
//   }, [autoGenerateProductNo]);

//   const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const _variations = variations.map((v) => ({
//         ...v,
//         variationDetails:
//           typeof v.variationDetails === "string"
//             ? JSON.parse(v.variationDetails)
//             : v.variationDetails,
//       }));
//       const _comboIngredients = [...comboIngredients];
//       const _prepaired_comboIngredients = _comboIngredients.map((item) => ({
//         barcode: item.barcode,
//         measurementUnitName: item.measurementUnitName,
//         productId: item.productId,
//         productId_mat: item.productTypeId === 1 ? item.productId_mat : null,
//         variationProductId_mat: item.productTypeId === 2 ? item.productId_mat : null,
//         productName: item.productName,
//         productTypeId: item.productTypeId,
//         productTypeName: item.productTypeName,
//         qty: item.qty,
//         sku: item.sku,
//       }));
//       const _subProductsList = subProductsList.map((item) => ({
//         qty: item.qty,
//         allProductId: item.allProductId,
//       }));

//       const payLoad = {
//         tableId: null,
//         productNo: productNo.value,
//         productTypeId: parseInt(productType.value),
//         storeIdList: stores,
//         isProductNoAutoGenerate: autoGenerateProductNo,
//         productName: productName.value,
//         categoryIdList: selectedCategories,
//         variationProductList: _variations,
//         comboProductDetailList: _prepaired_comboIngredients,
//         subProductsList: _subProductsList,
//         measurementUnitId: measurementUnit.value,
//         isNotForSelling: isNotForSelling,
//         imgUrl: uploadResponse?.hash || imageUrl,
//         isUnique: isUnique,
//         isStockTracked: isStockTracked.value,
//         isProductItem: isProductItem,
//         isAssemblyProduct: isAssemblyProduct.value,
//         brandId: brand.value,
//         unitCost: isNumeric(unitCost.value) ? unitCost.value : null,
//         unitPrice: isNumeric(unitPrice.value) ? unitPrice.value : null,
//         taxPerc: isNumeric(taxRatePerc.value) ? taxRatePerc.value : null,
//         sku: sku.value,
//         barcode: barcode.value === '' ? null : barcode.value,
//         reorderLevel: reorderLevel.value ? reorderLevel.value : null,
//         isExpiringProduct: isExpiringProduct,
//       };
//       setIsSubmitting(true);
//       if (saveType === SAVE_TYPE.ADD) {
//         const res = await addProduct(payLoad);
//         if (res.data.error) {
//           showToast("danger", "Exception", res.data.error.message);
//           setIsSubmitting(false);
//           return;
//         }
//         const { outputMessage, responseStatus } = res.data.outputValues;
//         if (responseStatus === "failed") {
//           showToast("warning", "Exception", outputMessage);
//           setIsSubmitting(false);
//         } else {
//           if (uploadResponse) {
//             await commitFile(uploadResponse.hash);
//           }
//           showToast("success", "Success", outputMessage);
//           resetValues();
//         }
//       } else if (saveType === SAVE_TYPE.UPDATE) {
//         const res = await updateProduct(id, payLoad);
//         if (res.data.error) {
//           showToast("danger", "Exception", res.data.error.message);
//           setIsSubmitting(false);
//           return;
//         }
//         const { outputMessage, responseStatus } = res.data.outputValues;
//         if (responseStatus === "failed") {
//           showToast("warning", "Exception", outputMessage);
//           setIsSubmitting(false);
//         } else {
//           if (imageUrl) {
//             await markFileAsTobeDeleted(imageUrl);
//           }
//           if (uploadResponse) {
//             await commitFile(uploadResponse.hash);
//           }
//           await loadValuesForUpdate();
//           showToast("success", "Success", outputMessage);
//         }
//       } else {
//         showToast("danger", "Exception", "Invalid Save type");
//       }
//       setIsSubmitting(false);
//     } catch (error) {
//       setIsSubmitting(false);
//       console.error("payloadd", error);
//     }
//   };

//   const handleNewAddVariation = () => {
//     const lastVariation = variations[variations.length - 1];
//     const newVariation = {
//       variationProductId: null,
//       sku: "",
//       unitPrice: "",
//       variationDetails: lastVariation
//         ? lastVariation.variationDetails.map((detail) => ({
//             variationTypeId: detail.variationTypeId,
//             variationTypeName: detail.variationTypeName,
//             variationValue: "",
//           }))
//         : [],
//     };
//     setVariations((prevVariations) => [...prevVariations, newVariation]);
//   };

//   const handleAddVariation = () => {
//     if (!variationType.value) {
//       alert("Please select a valid variation type");
//       return;
//     }
//     setVariations((prevIngredients) =>
//       prevIngredients.map((ingredient) => {
//         const existingVariationType = ingredient.variationDetails?.find(
//           (detail) => detail.variationTypeId === variationType.value
//         );
//         if (existingVariationType) {
//           return ingredient;
//         }
//         return {
//           ...ingredient,
//           variationDetails: [
//             ...ingredient.variationDetails,
//             {
//               variationTypeId: variationType.value,
//               variationTypeName: variationTypeOptions.find(
//                 (o) => o.id == variationType.value
//               )?.displayName,
//               variationValue: "",
//             },
//           ],
//         };
//       })
//     );
//   };

//   const handleRemoveVariation = (variationProductId, index) => {
//     setVariations((prevVariations) => prevVariations.filter((_, i) => i !== index));
//   };

//   const handleRemoveVariationType = (variationTypeId) => {
//     const updatedVariations = variations.map((item) => {
//       const variationDetails = item.variationDetails;
//       const updatedVariationDetails = variationDetails.filter(
//         (detail) => detail.variationTypeId !== variationTypeId
//       );
//       return { ...item, variationDetails: updatedVariationDetails };
//     });
//     setVariations(updatedVariations);
//   };

//   const handleVariationChange = (value, index, variationTypeId) => {
//     setVariations((prevVariations) =>
//       prevVariations.map((variation, i) =>
//         i === index
//           ? {
//               ...variation,
//               variationDetails: Array.isArray(variation.variationDetails)
//                 ? variation.variationDetails.map((detail) =>
//                     detail.variationTypeId === variationTypeId
//                       ? { ...detail, variationValue: value }
//                       : detail
//                   )
//                 : [],
//             }
//           : variation
//       )
//     );
//   };

//   const setStoresHandler = (stores) => {
//     setStores(stores);
//   };

//   const getInstruction = (key) => {
//     switch (key) {
//       case "isProductItem":
//         return isProductItem
//           ? "Check this if the item is a physical product you can count, like goods."
//           : "Uncheck this if the item is a service, like installation or consulting.";
//       case "isNotForSelling":
//         return isNotForSelling
//           ? "Check this to mark the item as 'Not for Sale' for internal use only."
//           : "Uncheck this to make the item available for sale to customers.";
//       case "isUnique":
//         return isUnique
//           ? "Check this for one-of-a-kind items that can't be restocked."
//           : "Uncheck this for items you can restock and sell multiple times.";
//       case "isStockTracked":
//         return isStockTracked.value
//           ? "Check this to automatically keep track of how many you have in stock. When you sell one, the count goes down. 📉"
//           : "Uncheck this to manually manage stock. Inventory won't update automatically on sales. ✍️";
//       case "isAssemblyProduct":
//         return isAssemblyProduct
//           ? "Check this if the item is made from other products (an assembly)."
//           : "Uncheck this if the item is a standalone product, not made from others.";
//       case "isExpiringProduct":
//         return isExpiringProduct
//           ? "Check this if the item has an expiration date, like food or medicine."
//           : "Uncheck this if the item doesn't expire, like tools or clothes.";
//       default:
//         return "";
//     }
//   };

//   const handleProductClick = (p) => {
//     handleInputChange(setSubProductSku, subProductSku, p.sku);
//   };

//   const validationMessages = (state) => {
//     return (
//       !state.isValid &&
//       state.isTouched && (
//         <div>
//           {state.validationMessages.map((message, index) => (
//             <FormElementMessage key={index} severity="error" text={message} />
//           ))}
//         </div>
//       )
//     );
//   };

//   return (
//     <div className="container mx-auto p-6 min-h-screen">
//       <div className="bg-white p-4 rounded-lg">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
//           {saveType === SAVE_TYPE.ADD ? "Add Product" : "Update Product"}
//         </h2>
//         {isLoading ? (
//           <LoadingSpinner loadingMessage="Loading please wait..." />
//         ) : (
//           <form onSubmit={onSubmit} className="space-y-8">
//             {/* General Information Section */}
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">General Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <InputField
//                   label={productName.label}
//                   value={productName.value}
//                   onChange={(e) => handleInputChange(setProductName, productName, e.target.value)}
//                   validationMessages={validationMessages(productName)}
//                   placeholder="Enter product name"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <div className="flex flex-col">
//                   <label className="font-medium text-gray-700 mb-1">{measurementUnit.label}</label>
//                   <select
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                     value={measurementUnit.value}
//                     onChange={(e) => handleInputChange(setMeasurementUnit, measurementUnit, e.target.value)}
//                   >
//                     <option value="" disabled>Select Measurement Unit</option>
//                     {measurementUnitOptions.map((option) => (
//                       <option key={option.id} value={option.id}>{option.displayName}</option>
//                     ))}
//                   </select>
//                   {validationMessages(measurementUnit)}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="font-medium text-gray-700 mb-1">{brand.label}</label>
//                   <select
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                     value={brand.value}
//                     onChange={(e) => handleInputChange(setBrand, brand, e.target.value)}
//                   >
//                     <option value="" disabled>Select Brand</option>
//                     {brandOptions.map((option) => (
//                       <option key={option.id} value={option.id}>{option.displayName}</option>
//                     ))}
//                   </select>
//                   {validationMessages(brand)}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="font-medium text-gray-700 mb-1">{productType.label}</label>
//                   <select
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                     value={productType.value}
//                     onChange={(e) => handleInputChange(setProductType, productType, e.target.value)}
//                     disabled={saveType === SAVE_TYPE.UPDATE}
//                   >
//                     {productTypeOptions.map((option) => (
//                       <option key={option.id} value={option.id}>{option.displayName}</option>
//                     ))}
//                   </select>
//                   {validationMessages(productType)}
//                 </div>
//                 <StoresComponent stores={stores} setStores={setStoresHandler} />
//               </div>
//             </div>
//                    {/* Category Section */}
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <div className="flex flex-col">
//                   <label className="font-medium text-gray-700 mb-1">{productCategory.label}</label>
//                   <div className="flex gap-2">
//                     <select
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                       value={selectedCategory}
//                       onChange={(e) => setSelectedCategory(e.target.value)}
//                     >
//                       <option value="" disabled>Select Category</option>
//                       {categoryOptions.map((option) => (
//                         <option key={option.id} value={option.id}>{option.displayName}</option>
//                       ))}
//                     </select>
//                     <GhostButton
//                       onClick={() => {
//                         if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
//                           setSelectedCategories([...selectedCategories, parseInt(selectedCategory)]);
//                           setSelectedCategory("");
//                         }
//                       }}
//                       disabled={selectedCategory === ""}
//                       iconClass="pi pi-plus-circle text-lg"
//                       labelClass="text-md font-normal"
//                       label="Add"
//                       color="text-sky-500"
//                       hoverClass="hover:text-sky-700 hover:bg-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <div className="flex flex-wrap gap-2 mt-6">
//                     {categoryOptions.length > 0 &&
//                       selectedCategories?.map((categoryId, index) => {
//                         const category = categoryOptions.find((opt) => opt.id === parseInt(categoryId));
//                         return (
//                           <CategoryItem
//                             key={categoryId}
//                             category={category}
//                             onClick={() => setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))}
//                           />
//                         );
//                       })}
//                   </div>
//                 </div>
//                 <div>
//                   {productType.value != "3" && (
//                     <InputField
//                       label={reorderLevel.label}
//                       value={reorderLevel.value}
//                       isDisabled={reorderLevel.isDisabled}
//                       onChange={(e) => handleInputChange(setReorderLevel, reorderLevel, e.target.value)}
//                       validationMessages={validationMessages(reorderLevel)}
//                       placeholder="Enter Reorder Level"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>



//             {/* Product Options Section */}
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Options</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       id="autoDeductInventory"
//                       className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                       onChange={(e) => setIsProductItem(e.target.checked)}
//                       checked={isProductItem}
//                     />
//                     <label htmlFor="autoDeductInventory" className="font-medium text-gray-700">Product Item</label>
//                   </div>
//                   <p className="text-gray-500">{getInstruction("isProductItem")}</p>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       id="isNotForSelling"
//                       className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                       onChange={(e) => setIsNotForSelling(e.target.checked)}
//                       checked={isNotForSelling}
//                     />
//                     <label htmlFor="isNotForSelling" className="font-medium text-gray-700">Not For Selling</label>
//                   </div>
//                   <p className="text-gray-500">{getInstruction("isNotForSelling")}</p>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       id="isStockTracked"
//                       className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                       onChange={(e) => setIsStockTracked({ ...isStockTracked, value: e.target.checked })}
//                       checked={isStockTracked.value}
//                       disabled={!isProductItem || isStockTracked.isDisabled}
//                     />
//                     <label htmlFor="isStockTracked" className="font-medium text-gray-700">Stock Tracked</label>
//                   </div>
//                   <p className="text-gray-500">{getInstruction("isStockTracked")}</p>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       id="isExpiringProduct"
//                       className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                       onChange={(e) => setIsExpiringProduct(e.target.checked)}
//                       checked={isExpiringProduct}
//                     />
//                     <label htmlFor="isExpiringProduct" className="font-medium text-gray-700">Expiring Product</label>
//                   </div>
//                   <p className="text-gray-500">{getInstruction("isExpiringProduct")}</p>
//                 </div>
//              {productType.value == "1" ?   <div className="flex flex-col gap-1">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       id="isAssemblyProduct"
//                       className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                       onChange={(e) => setIsAssemblyProduct({ ...isAssemblyProduct, value: e.target.checked })}
//                       checked={isAssemblyProduct.value}
//                     />
//                     <label htmlFor="isAssemblyProduct" className="font-medium text-gray-700">Assembly Product</label>
//                   </div>
//                   <p className="text-gray-500">{getInstruction("isAssemblyProduct")}</p>
//                 </div>:null}
//               </div>
//             </div>
//                      {/* Sub-Products Section (Assembly Product) */}
//             {isAssemblyProduct.value ? (
//               <SubProductList
//                 subProductsList={subProductsList}
//                 setSubProductsList={setSubProductsList}
//               />
//             ):null}



//        {/* Product Details Section (for Product Type 1 and 3) */}
//          {(productType.value == "1" || productType.value == "3") && (
//             <div className="bg-gray-50 p-4 rounded-md shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="flex flex-col">
//                   <label className=" font-medium text-gray-700 mb-1">{sku.label}</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                       value={sku.value}
//                       onChange={(e) => handleInputChange(setSku, sku, e.target.value)}
//                       placeholder="Enter SKU"
//                     />
//                     <button
//                       type="button"
//                       className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
//                       onClick={generateSKU}
//                     >
//                       Generate SKU
//                     </button>
//                   </div>
//                   {validationMessages(sku)}
//                 </div>
//                 <InputField
//                   label={barcode.label}
//                   value={barcode.value}
//                   onChange={(e) => handleInputChange(setBarcode, barcode, e.target.value)}
//                   validationMessages={validationMessages(barcode)}
//                   placeholder="Enter Barcode"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <InputField
//                   label={unitCost.label}
//                   value={unitCost.value}
//                   onChange={(e) => handleInputChange(setUnitCost, unitCost, e.target.value)}
//                   validationMessages={validationMessages(unitCost)}
//                   placeholder="Enter Unit Cost"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <InputField
//                   label={unitPrice.label}
//                   value={unitPrice.value}
//                   onChange={(e) => handleInputChange(setUnitPrice, unitPrice, e.target.value)}
//                   validationMessages={validationMessages(unitPrice)}
//                   placeholder="Enter Unit Price"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <InputField
//                   label={taxRatePerc.label}
//                   value={taxRatePerc.value}
//                   onChange={(e) => handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value)}
//                   validationMessages={validationMessages(taxRatePerc)}
//                   placeholder="Enter Tax Rate (%)"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
            
//               </div>
//             </div>
//           )}




//             {/* Variations Section (Product Type 2) */}
//             {productType.value == "2" && (
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-6">Variations</h3>
//                 <div className="flex justify-between gap-4 mb-6">
//                   <div className="">
//                     <label className=" font-medium text-gray-700 mb-2 block">Variation Type</label>
//                     <div className="flex items-center gap-3">
//                       <select
//                         className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 bg-white"
//                         value={variationType.value}
//                         onChange={(e) => handleInputChange(setVariationType, variationType, e.target.value)}
//                       >
//                         <option value="" disabled>Select Variation Type</option>
//                         {variationTypeOptions.map((option) => (
//                           <option key={option.id} value={option.id}>{option.displayName}</option>
//                         ))}
//                       </select>
//                       <button
//                         type="button"
//                         className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 flex items-center gap-2"
//                         onClick={handleAddVariation}
//                       >
//                         <FontAwesomeIcon icon={faPlus} />
//                         Add Type
//                       </button>
//                     </div>
//                   </div>
//                        <div className="flex flex-col justify-between">
//                     <label className=" font-medium text-gray-700 mb-2 block"></label>
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
//                     onClick={handleNewAddVariation}
//                   >
//                     <FontAwesomeIcon icon={faPlus} />
//                     New Variation
//                   </button>
//                   </div>
//                 </div>
//                 <div className="overflow-x-auto rounded-md border border-gray-200">
//                   <table className="w-full border-collapse">
//                     <thead className="bg-gray-50  font-medium text-gray-700 border-b border-gray-200">
//                       <tr>
//                         <th className="px-4 py-3 text-left">SKU</th>
//                         <th className="px-4 py-3 text-left">Barcode</th>
//                         <th className="px-4 py-3 text-left">Unit Cost</th>
//                         <th className="px-4 py-3 text-left">Unit Price</th>
//                         <th className="px-4 py-3 text-left">Tax (%)</th>
//                         {variations[0]?.variationDetails &&
//                           variations[0].variationDetails.map((c) => (
//                             <th key={c.variationTypeId} className="px-4 py-3 text-left">
//                               <div className="flex items-center gap-2">
//                                 <span>{c.variationTypeName}</span>
//                                 <button
//                                   type="button"
//                                   className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
//                                   onClick={() => handleRemoveVariationType(c.variationTypeId)}
//                                   aria-label={`Remove ${c.variationTypeName} Type`}
//                                   title={`Remove ${c.variationTypeName} Type`}
//                                 >
//                                   <FontAwesomeIcon icon={faClose} size="sm" />
//                                 </button>
//                               </div>
//                             </th>
//                           ))}
//                         <th className="px-4 py-3"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {variations.map((variation, index) => (
//                         <tr key={variation.variationProductId || index} className="hover:bg-gray-50 transition-colors duration-150">
//                           <td className="px-4 py-2">
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                               value={variation.sku}
//                               onChange={(e) => {
//                                 const updatedSku = e.target.value;
//                                 setVariations((prevVariations) =>
//                                   prevVariations.map((item, i) =>
//                                     i === index ? { ...item, sku: updatedSku } : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Enter SKU"
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                               value={variation.barcode}
//                               onChange={(e) => {
//                                 const updatedBarcode = e.target.value;
//                                 setVariations((prevVariations) =>
//                                   prevVariations.map((item, i) =>
//                                     i === index ? { ...item, barcode: updatedBarcode } : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Enter Barcode"
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                               value={variation.unitCost}
//                               onChange={(e) => {
//                                 const updatedUnitCost = e.target.value;
//                                 setVariations((prevVariations) =>
//                                   prevVariations.map((item, i) =>
//                                     i === index ? { ...item, unitCost: updatedUnitCost } : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Enter Unit Cost"
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                               value={variation.unitPrice}
//                               onChange={(e) => {
//                                 const updatedUnitPrice = e.target.value;
//                                 setVariations((prevVariations) =>
//                                   prevVariations.map((item, i) =>
//                                     i === index ? { ...item, unitPrice: updatedUnitPrice } : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Enter Unit Price"
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <input
//                               type="text"
//                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                               value={variation.taxPerc}
//                               onChange={(e) => {
//                                 const updatedTaxPerc = e.target.value;
//                                 setVariations((prevVariations) =>
//                                   prevVariations.map((item, i) =>
//                                     i === index ? { ...item, taxPerc: updatedTaxPerc } : item
//                                   )
//                                 );
//                               }}
//                               placeholder="Enter Tax %"
//                             />
//                           </td>
//                           {variation.variationDetails &&
//                             variation.variationDetails.map((detail) => (
//                               <td key={detail.variationTypeId} className="px-4 py-2">
//                                 <input
//                                   type="text"
//                                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                                   value={detail.variationValue}
//                                   onChange={(e) => handleVariationChange(e.target.value, index, detail.variationTypeId)}
//                                   placeholder={`Enter ${detail.variationTypeName}`}
//                                 />
//                               </td>
//                             ))}
//                           <td className="px-4 py-2">
//                             <button
//                               type="button"
//                               className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
//                               onClick={() => handleRemoveVariation(variation.variationProductId, index)}
//                               aria-label="Remove Variation Row"
//                               title="Remove Variation Row"
//                             >
//                               <FontAwesomeIcon icon={faClose} size="sm" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Combo Ingredients Section (Product Type 3) */}
//             {productType.value == "3" && (
//               <div className="bg-gray-50 p-6 rounded-md shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Combo Ingredients</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//                   <div className="flex flex-col">
//                     <label className="font-medium text-gray-700 mb-1">Search Product</label>
//                     <ProductSearch onProductSelect={handleProductClick} />
//                     {validationMessages(subProductSku)}
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="font-medium text-gray-700 mb-1">{subProductQty.label}</label>
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                       value={subProductQty.value}
//                       onChange={(e) => handleInputChange(setSubProductQty, subProductQty, e.target.value)}
//                       placeholder="Enter Quantity"
//                     />
//                     {validationMessages(subProductQty)}
//                   </div>
//                   <button
//                     type="button"
//                     className="self-end px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
//                     onClick={async () => {
//                       const filteredData = {
//                         productId: null,
//                         productNo: null,
//                         productName: "",
//                         sku: subProductSku.value,
//                         barcode: null,
//                         brandId: null,
//                         storeId: selectedStore.storeId,
//                         productTypeIds: null,
//                         categoryId: -1,
//                         measurementUnitId: -1,
//                         searchByKeyword: false,
//                         skip: 0,
//                         limit: 1,
//                       };
//                       const _result = await getProducts(filteredData);
//                       const product = _result.data.results[0][0];
//                       if (!product) {
//                         showToast("danger", "Exception", "Product not found.");
//                         return;
//                       }
//                       const _comboIngredents = {
//                         measurementUnitName: product.measurementUnitName,
//                         productId: product.productId,
//                         productId_mat: product.productTypeId === 1 ? product.productId : product.productTypeId === 2 ? product.variationProductId : null,
//                         productName: product.productName,
//                         productTypeId: product.productTypeId,
//                         productTypeName: product.productTypeName,
//                         sku: product.sku,
//                         qty: subProductQty.value,
//                       };
//                       const existingComboIngre = [...comboIngredients];
//                       if (existingComboIngre.find((i) => i.sku === product.sku)) {
//                         showToast("danger", "Exception", "The Product already exists.");
//                         return;
//                       }
//                       existingComboIngre.push(_comboIngredents);
//                       setComboIngredients(existingComboIngre);
//                     }}
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead className="bg-gray-100 border-b border-gray-200">
//                       <tr>
//                         <th className="px-4 py-2 text-left">Product Name</th>
//                         <th className="px-4 py-2 text-left">Product Type</th>
//                         <th className="px-4 py-2 text-left">SKU</th>
//                         <th className="px-4 py-2 text-left">Qty</th>
//                         <th className="px-4 py-2"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {comboIngredients.map((item) => (
//                         <tr key={item.productId} className="hover:bg-gray-50">
//                           <td className="px-4 py-2">{item.productName}</td>
//                           <td className="px-4 py-2">{item.productTypeName}</td>
//                           <td className="px-4 py-2">{item.sku}</td>
//                           <td className="px-4 py-2">{item.qty} {item.measurementUnitName}</td>
//                           <td className="px-4 py-2">
//                             <button
//                               className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-200"
//                               onClick={async () => {
//                                 const updatedExtraDetails = comboIngredients.filter(
//                                   (c) => c.productId !== item.productId
//                                 );
//                                 setComboIngredients(updatedExtraDetails);
//                               }}
//                               aria-label="Delete"
//                               title="Delete Product"
//                             >
//                               <FontAwesomeIcon icon={faTrash} />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

     

//             {/* Image Upload Section */}
//             <div className="bg-gray-50 p-6 rounded-md shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Image</h3>
//               <div className="flex items-center gap-4">
//                 <label className="flex flex-col items-center cursor-pointer">
//                   <span className="mb-2 font-medium text-gray-700">Upload an Image</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                   <div className="flex items-center justify-center w-40 h-12 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700 transition-colors duration-200">
//                     Choose File
//                   </div>
//                 </label>
//                 {isFileSelectLoading ? (
//                   <div className="w-full max-w-md text-center">
//                     <div className="relative overflow-hidden rounded-lg">
//                       <svg className="animate-spin h-8 w-8 text-sky-500" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                     </div>
//                   </div>
//                 ) : (
//                   previewUrl && (
//                     <div className="w-full max-w-md text-center">
//                       <div className="relative overflow-hidden rounded-lg">
//                         <img
//                           src={previewUrl}
//                           alt="Preview"
//                           className="object-contain w-full max-h-32 rounded-lg"
//                         />
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center mt-8">
//               <button
//                 type="submit"
//                 className={`w-56 py-3 px-6 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 font-semibold ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </span>
//                 ) : saveType === SAVE_TYPE.UPDATE ? "Update" : "Add"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { validate } from "../../utils/formValidation";
// import {
//   getDropdownBrands,
//   getDropdownMeasurementUnit,
//   getDrpdownCategory,
//   getProductTypesDrp,
//   getStoresDrp,
//   getVariationTypesDrp,
// } from "../../functions/dropdowns";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../useToast";
// import {
//   addProduct,
//   getProductExtraDetails,
//   getProducts,
//   updateProduct,
// } from "../../functions/register";
// import { SAVE_TYPE } from "../../utils/constants";
// import FormElementMessage from "../messges/FormElementMessage";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faClose, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// import StoresComponent from "../storeComponent/StoreComponent";
// import {
//   commitFile,
//   deleteFile,
//   markFileAsTobeDeleted,
//   uploadImageResized,
// } from "../../functions/asset";
// import InputField from "../inputField/InputField";
// import DialogModel from "../model/DialogModel";
// import GhostButton from "../iconButtons/GhostButton";
// import ProductSearch from "../productSearch/ProductSearch";
// import LoadingSpinner from "../LoadingSpinner";

// const CategoryItem = ({ onClick, category }) => {
//   return (
//     <div className="flex justify-between items-center p-3 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
//       <span className="text-gray-800 font-medium">{category.displayName}</span>
//       <FontAwesomeIcon
//         icon={faTrash}
//         className="text-red-500 hover:text-red-700 cursor-pointer"
//         onClick={onClick}
//       />
//     </div>
//   );
// };

// export default function AddProduct({ saveType = SAVE_TYPE.ADD, id = 0 }) {
//   const store = JSON.parse(localStorage.getItem("stores"))[0];
//   const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
//   const navigate = useNavigate();
//   const showToast = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [autoGenerateProductNo, setAutoGenerateProductNo] = useState(true);

//   const [stores, setStores] = useState([{ storeId: store.storeId, storeName: store.storeName }]);
//   const [isProductItem, setIsProductItem] = useState(true);
//   const [isNotForSelling, setIsNotForSelling] = useState(false);
//   const [isExpiringProduct, setIsExpiringProduct] = useState(false);
//   const [isUnique, setIsUnique] = useState(false);
//   const [isStockTracked, setIsStockTracked] = useState({ value: true, isDisabled: false });
//  const [isAssemblyProduct, setIsAssemblyProduct] = useState({ value: false});

//   const [comboIngredients, setComboIngredients] = useState([]);
//   const [variations, setVariations] = useState([]);
//   const [productNo, setProductNo] = useState({
//     label: "Product No",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [productName, setProductName] = useState({
//     label: "Product Name",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [productCategory, setProductCategory] = useState({
//     label: "Category",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integerArray" },
//   });
//   const [measurementUnit, setMeasurementUnit] = useState({
//     label: "Measurement Unit",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });
//   const [brand, setBrand] = useState({
//     label: "Brand",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [unitCost, setUnitCost] = useState({
//     label: "Unit Cost",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [unitPrice, setUnitPrice] = useState({
//     label: "Unit Price",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [reorderLevel, setReorderLevel] = useState({
//     label: "Reorder Level",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [barcode, setBarcode] = useState({
//     label: "Barcode",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [sku, setSku] = useState({
//     label: "SKU",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [taxRatePerc, setTaxRatePerc] = useState({
//     label: "Tax Rate (%)",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "decimal" },
//   });
//   const [productType, setProductType] = useState({
//     label: "Product Type",
//     value: "1",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });
//   const [comboIngrednentSku, setComboIngrednentSku] = useState({
//     label: "sku",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [comboIngrednentQty, setComboIngrednentQty] = useState({
//     label: "Qty",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [variationType, setVariationType] = useState({
//     label: "Variation Type",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "integer" },
//   });
//   const [variationValue, setVariationValue] = useState({
//     label: "Variation Value",
//     value: "",
//     isTouched: false,
//     isValid: false,
//     rules: { required: false, dataType: "string" },
//   });
//   const [isFileSelectLoading, setIsFileSelectLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploadResponse, setUploadResponse] = useState(null);
//   const [categoryOptions, setCategoryOptions] = useState([]);
//   const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
//   const [brandOptions, setBrandOptions] = useState([]);
//   const [productTypeOptions, setProductTypeOptions] = useState([]);
//   const [variationTypeOptions, setVariationTypeOptions] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const [storesOptions, setStoresOptions] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
  

//   const generateSKU = () => {
//     if (!productName.value) {
//       showToast("warning", "Warning", "Please enter a product name first.");
//       return;
//     }
//     const prefix = productName.value.replace(/\s+/g, '').slice(0, 5).toUpperCase();
//     const randomNum = Math.floor(10 + Math.random() * 90);
//     const newSKU = `${prefix}${randomNum}`;
//     handleInputChange(setSku, sku, newSKU);
//   };

//   const handleImageChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setIsFileSelectLoading(true);
//       const response = await uploadImageResized(file);
//       console.log("setPreviewUrl", response);
//       setUploadResponse(response);
//       setPreviewUrl(
//         `${process.env.REACT_APP_API_CDN}/${response.hash}?width=200&height=200&quality=80`
//       );
//       setIsFileSelectLoading(false);
//     }
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

//   const resetValues = () => {
//     setStores([{ storeId: store.storeId, storeName: store.storeName }]);
//     setIsProductItem(true);
//     setIsNotForSelling(false);
//     setIsExpiringProduct(false);
//     setIsUnique(false);
//     setIsStockTracked({ value: true, isDisabled: false });
//     setIsAssemblyProduct({ value: false });
//     setComboIngredients([]);
//     setVariations([]);
//     setProductName({ ...productName, value: "", isTouched: false, isValid: false });
//     setProductCategory({ ...productCategory, value: "", isTouched: false, isValid: false });
//     setMeasurementUnit({ ...measurementUnit, value: "", isTouched: false, isValid: false });
//     setBrand({ ...brand, value: "", isTouched: false, isValid: false });
//     setUnitCost({ ...unitCost, value: "", isTouched: false, isValid: false });
//     setUnitPrice({ ...unitPrice, value: "", isTouched: false, isValid: false });
//     setReorderLevel({ ...reorderLevel, value: "", isTouched: false, isValid: false });
//     setBarcode({ ...barcode, value: "", isTouched: false, isValid: false });
//     setSku({ ...sku, value: "", isTouched: false, isValid: false });
//     setTaxRatePerc({ ...taxRatePerc, value: "", isTouched: false, isValid: false });
//     setProductType({ ...productType, value: "1", isTouched: false, isValid: false });
//     setComboIngrednentSku({ ...comboIngrednentSku, value: "", isTouched: false, isValid: false });
//     setComboIngrednentQty({ ...comboIngrednentQty, value: "", isTouched: false, isValid: false });
//     setVariationType({ ...variationType, value: "", isTouched: false, isValid: false });
//     setVariationValue({ ...variationValue, value: "", isTouched: false, isValid: false });
//   };

//   const loadDrpStores = async () => {
//     const objArr = await getStoresDrp();
//     setStoresOptions([...objArr.data.results[0]]);
//   };

//   useEffect(() => {
//     loadDrpStores();
//   }, []);

// const loadValuesForUpdate = async () => {

// setIsLoading(true);
//   const res = await getProducts({
//     productId: id,
//     productNo: null,
//     productName: null,
//     barcode: null,
//     storeId: selectedStore.storeId,
//     productCategoryId: null,
//     searchByKeyword: false,
//     skip: 0,
//     limit: 1,
//   });

//   const {
//     barcode,
//     categories,
//     measurementUnitId,
//     productName,
//     productNo,
//     reorderLevel,
//     unitCost,
//     unitPrice,
//     taxPerc,
//     brandId,
//     productTypeId,
//     isStockTracked,
//     isProductItem,
//     isAssemblyProduct,
//     isUnique,
//     isNotForSelling,
//     sku,
//     imageUrl,
//     isExpiringProduct,
//   } = res.data.results[0][0];

//   setBarcode((prev) => ({ ...prev, value: barcode }));
//   setSelectedCategories(JSON.parse(categories).map((c) => c.id));
//   setMeasurementUnit((prev) => ({ ...prev, value: measurementUnitId }));
//   setProductNo((prev) => ({ ...prev, value: productNo }));
//   setProductName((prev) => ({ ...prev, value: productName }));
//   setTaxRatePerc((prev) => ({ ...prev, value: taxPerc }));
//   setUnitCost((prev) => ({ ...prev, value: unitCost }));
//   setUnitPrice((prev) => ({ ...prev, value: unitPrice }));
//   setBrand((prev) => ({ ...prev, value: brandId }));
//   setProductType((prev) => ({ ...prev, value: productTypeId }));
//   setIsExpiringProduct(isExpiringProduct);
//   setIsProductItem(isProductItem);
//   setIsUnique(isUnique);
//   setIsNotForSelling(isNotForSelling);
//   setSku((prev) => ({ ...prev, value: sku }));
//   setImageUrl(imageUrl);
//   setPreviewUrl(
//     `${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`
//   );

//   const details = await getProductExtraDetails(id);

//   if (productTypeId === 1) {
//     setReorderLevel((prev) => ({
//       ...prev,
//       value: reorderLevel,
//     }));

//     setIsStockTracked((prev) => ({ ...prev, value: isStockTracked, isDisabled: false }));
//     setIsAssemblyProduct((prev) => ({ ...prev, value: isAssemblyProduct }));

//     const _singleProductSkuBarcode = details.data.results[0][0];
//     console.log("_singleProductSkuBarcode:", _singleProductSkuBarcode);

//     const _singleProductStores = details.data.results[1];
//     console.log("_singleProductStores:", _singleProductStores);
//     setStores(_singleProductStores);
//   } else if (productTypeId === 2) {
//     setReorderLevel((prev) => ({ ...prev, value: reorderLevel }));
//     setIsStockTracked({ value: isStockTracked, isDisabled: false });

//     const variationDetails = details.data.results[0];
//     const parsedVariations = variationDetails.map((variation) => ({
//       ...variation,
//       variationDetails:
//         typeof variation.variationDetails === "string"
//           ? JSON.parse(variation.variationDetails)
//           : variation.variationDetails,
//     }));
//     setVariations(parsedVariations);

//     const productStores = details.data.results[1];
//     setStores(productStores);
//   } else if (productTypeId === 3) {
//     setReorderLevel((prev) => ({ ...prev, isDisabled: true }));
//     setIsStockTracked({ value: false, isDisabled: true });

//     const _comboProductSkuBarcode = details.data.results[0];
//     console.log("_comboProductSkuBarcode:", _comboProductSkuBarcode);
//     setComboIngredients(_comboProductSkuBarcode);

//     const _comboProductStores = details.data.results[1];
//     console.log("_comboProductStores:", _comboProductStores);
//     setStores(_comboProductStores);
//   }

//   setIsLoading(false);
// };


//   useEffect(() => {
//     if (saveType === SAVE_TYPE.UPDATE) {
//       loadValuesForUpdate();
//     }
//   }, [saveType]);

//   useEffect(() => {
//     loadDrpCategory();
//     loadDrpMeasurementUnit();
//     loadDrpBrands();
//     loadDrpProductTypes();
//     loadDrpVariationTypes();
//   }, []);

//   const loadDrpCategory = async () => {
//     const objArr = await getDrpdownCategory();
//     setCategoryOptions(objArr.data.results[0]);
//   };

//   const loadDrpMeasurementUnit = async () => {
//     const objArr = await getDropdownMeasurementUnit();
//     setMeasurementUnitOptions(objArr.data.results[0]);
//   };

//   const loadDrpBrands = async () => {
//     const objArr = await getDropdownBrands();
//     setBrandOptions(objArr.data.results[0]);
//   };

//   const loadDrpProductTypes = async () => {
//     const objArr = await getProductTypesDrp();
//     setProductTypeOptions(objArr.data.results[0]);
//   };

//   const loadDrpVariationTypes = async () => {
//     const objArr = await getVariationTypesDrp();
//     const options = objArr.data.results[0];
//     setVariationTypeOptions(options);
//     setVariationType({ ...variationType, value: options[0]?.id || "" });
//   };

//   useEffect(() => {
//     if (autoGenerateProductNo)
//       setProductNo({ ...productNo, value: "[Auto Generate]" });
//     else setProductNo({ ...productNo, value: "" });
//   }, [autoGenerateProductNo]);

//   const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const _variations = variations.map((v) => ({
//         ...v,
//         variationDetails:
//           typeof v.variationDetails === "string"
//             ? JSON.parse(v.variationDetails)
//             : v.variationDetails,
//       }));
//       const _comboIngredients = [...comboIngredients];
//       const _prepaired_comboIngredients = _comboIngredients.map((item) => ({
//         barcode: item.barcode,
//         measurementUnitName: item.measurementUnitName,
//         productId: item.productId,
//         productId_mat: item.productTypeId === 1 ? item.productId_mat : null,
//         variationProductId_mat: item.productTypeId === 2 ? item.productId_mat : null,
//         productName: item.productName,
//         productTypeId: item.productTypeId,
//         productTypeName: item.productTypeName,
//         qty: item.qty,
//         sku: item.sku,
//       }));
//       const payLoad = {
//         tableId: null,
//         productNo: productNo.value,
//         productTypeId: parseInt(productType.value),
//         storeIdList: stores,
//         isProductNoAutoGenerate: autoGenerateProductNo,
//         productName: productName.value,
//         categoryIdList: selectedCategories,
//         variationProductList: _variations,
//         comboProductDetailList: _prepaired_comboIngredients,
//         subProductsList:subProductsList,
//         measurementUnitId: measurementUnit.value,
//         isNotForSelling: isNotForSelling,
//         imgUrl: uploadResponse?.hash || imageUrl,
//         isUnique: isUnique,
//         isStockTracked: isStockTracked.value,
//         isProductItem: isProductItem,
//         isAssemblyProduct:isAssemblyProduct.value,
//         brandId: brand.value,
//         unitCost: isNumeric(unitCost.value) ? unitCost.value : null,
//         unitPrice: isNumeric(unitPrice.value) ? unitPrice.value : null,
//         taxPerc: isNumeric(taxRatePerc.value) ? taxRatePerc.value : null,
//         sku: sku.value,
//         barcode: barcode.value === '' ? null : barcode.value,
//         reorderLevel: reorderLevel.value ? reorderLevel.value :null,
//         isExpiringProduct: isExpiringProduct,
//       };
//       console.log("payloadd", payLoad);
//       setIsSubmitting(true);
//       if (saveType === SAVE_TYPE.ADD) {
//         const res = await addProduct(payLoad);
//         if (res.data.error) {
//           showToast("danger", "Exception", res.data.error.message);
//           setIsSubmitting(false);
//           return;
//         }
//         const { outputMessage, responseStatus } = res.data.outputValues;
//         if (responseStatus === "failed") {
//           showToast("warning", "Exception", outputMessage);
//           setIsSubmitting(false);
//         } else {
//           if (uploadResponse) {
//             await commitFile(uploadResponse.hash);
//           }
//           showToast("success", "Success", outputMessage);
//           resetValues();
//         }
//       } else if (saveType === SAVE_TYPE.UPDATE) {
//         const res = await updateProduct(id, payLoad);
//         if (res.data.error) {
//           showToast("danger", "Exception", res.data.error.message);
//           setIsSubmitting(false);
//           return;
//         }
//         const { outputMessage, responseStatus } = res.data.outputValues;
//         if (responseStatus === "failed") {
//           showToast("warning", "Exception", outputMessage);
//           setIsSubmitting(false);
//         } else {
//           if (imageUrl) {
//             await markFileAsTobeDeleted(imageUrl);
//           }
//           if (uploadResponse) {
//             await commitFile(uploadResponse.hash);
//           }
//           await loadValuesForUpdate();
//           showToast("success", "Success", outputMessage);
//         }
//       } else {
//         showToast("danger", "Exception", "Invalid Save type");
//       }
//       setIsSubmitting(false);
//     } catch (error) {
//       setIsSubmitting(false);
//       console.error("payloadd", error);
//     }
//   };

//   const handleNewAddVariation = () => {
//     const lastVariation = variations[variations.length - 1];
//     const newVariation = {
//       variationProductId: null,
//       sku: "",
//       unitPrice: "",
//       variationDetails: lastVariation
//         ? lastVariation.variationDetails.map((detail) => ({
//             variationTypeId: detail.variationTypeId,
//             variationTypeName: detail.variationTypeName,
//             variationValue: "",
//           }))
//         : [],
//     };
//     setVariations((prevVariations) => [...prevVariations, newVariation]);
//   };

//   const handleAddVariation = () => {
//     if (!variationType.value) {
//       alert("Please select a valid variation type");
//       return;
//     }
//     setVariations((prevIngredients) =>
//       prevIngredients.map((ingredient) => {

//         console.log('variation details set variation ',ingredient.variationDetails);
//         const existingVariationType = ingredient.variationDetails?.find(
//           (detail) => detail.variationTypeId === variationType.value
//         );
//         if (existingVariationType) {
//           return ingredient;
//         }
//         return {
//           ...ingredient,
//           variationDetails: [
//             ...ingredient.variationDetails,
//             {
//               variationTypeId: variationType.value,
//               variationTypeName: variationTypeOptions.find(
//                 (o) => o.id == variationType.value
//               )?.displayName,
//               variationValue: "",
//             },
//           ],
//         };
//       })
//     );
//   };

//   const handleRemoveVariation = (variationProductId, index) => {
//     setVariations((prevVariations) => prevVariations.filter((_, i) => i !== index));
//   };

//   const handleRemoveVariationType = (variationTypeId) => {
//     const updatedVariations = variations.map((item) => {
//       const variationDetails = item.variationDetails;
//       const updatedVariationDetails = variationDetails.filter(
//         (detail) => detail.variationTypeId !== variationTypeId
//       );
//       return { ...item, variationDetails: updatedVariationDetails };
//     });
//     setVariations(updatedVariations);
//   };

//   const handleVariationChange = (value, index, variationTypeId) => {
//     setVariations((prevVariations) =>
//       prevVariations.map((variation, i) =>
//         i === index
//           ? {
//               ...variation,
//               variationDetails: Array.isArray(variation.variationDetails)
//                 ? variation.variationDetails.map((detail) =>
//                     detail.variationTypeId === variationTypeId
//                       ? { ...detail, variationValue: value }
//                       : detail
//                   )
//                 : [],
//             }
//           : variation
//       )
//     );
//   };

//   const setStoresHandler = (stores) => {
//     setStores(stores);
//   };

// const getInstruction = (key) => {
//   switch (key) {
//     case "isProductItem":
//       return isProductItem
//         ? "Check this if the item is a physical product you can count, like goods."
//         : "Uncheck this if the item is a service, like installation or consulting.";

//     case "isNotForSelling":
//       return isNotForSelling
//         ? "Check this to mark the item as 'Not for Sale' for internal use only."
//         : "Uncheck this to make the item available for sale to customers.";

//     case "isUnique":
//       return isUnique
//         ? "Check this for one-of-a-kind items that can't be restocked."
//         : "Uncheck this for items you can restock and sell multiple times.";

//     case "isStockTracked":
//       return isStockTracked.value
//         ? "Check this to automatically keep track of how many you have in stock. When you sell one, the count goes down. 📉"
//         : "Uncheck this to manually manage stock. Inventory won't update automatically on sales. ✍️";

//     case "isAssemblyProduct":
//       return isAssemblyProduct
//         ? "Check this if the item is made from other products (an assembly)."
//         : "Uncheck this if the item is a standalone product, not made from others.";

//     case "isExpiringProduct":
//       return isExpiringProduct
//         ? "Check this if the item has an expiration date, like food or medicine."
//         : "Uncheck this if the item doesn't expire, like tools or clothes.";

//     default:
//       return "";
//   }
// };

//   const handleProductClick = (p) => {
//     console.log("handleProductClick:", p);
//     handleInputChange(setComboIngrednentSku, comboIngrednentSku, p.sku);
//   };

//   const validationMessages = (state) => {
//     return (
//       !state.isValid &&
//       state.isTouched && (
//         <div>
//           {state.validationMessages.map((message, index) => (
//             <FormElementMessage key={index} severity="error" text={message} />
//           ))}
//         </div>
//       )
//     );
//   };

//   return (
//     <div className="container mx-auto p-6 min-h-screen ">
//       <div className=" bg-white p-4 rounded-lg">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
//           {saveType === SAVE_TYPE.ADD ? "Add Product" : "Update Product"}
//         </h2>
//       {isLoading ?<LoadingSpinner loadingMessage="Loading please wait..." /> : <form onSubmit={onSubmit} className="space-y-8">
//           {/* General Information Section */}
//            <div className=" p-4">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">General Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <InputField
//                 label={productName.label}
//                 value={productName.value}
//                 onChange={(e) => handleInputChange(setProductName, productName, e.target.value)}
//                 validationMessages={validationMessages(productName)}
//                 placeholder="Enter product name"
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//               />
//               <div className="flex flex-col">
//                 <label className=" font-medium text-gray-700 mb-1">{measurementUnit.label}</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                   value={measurementUnit.value}
//                   onChange={(e) => handleInputChange(setMeasurementUnit, measurementUnit, e.target.value)}
//                 >
//                   <option value="" disabled>Select Measurement Unit</option>
//                   {measurementUnitOptions.map((option) => (
//                     <option key={option.id} value={option.id}>{option.displayName}</option>
//                   ))}
//                 </select>
//                 {validationMessages(measurementUnit)}
//               </div>
//               <div className="flex flex-col">
//                 <label className=" font-medium text-gray-700 mb-1">{brand.label}</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                   value={brand.value}
//                   onChange={(e) => handleInputChange(setBrand, brand, e.target.value)}
//                 >
//                   <option value="" disabled>Select Brand</option>
//                   {brandOptions.map((option) => (
//                     <option key={option.id} value={option.id}>{option.displayName}</option>
//                   ))}
//                 </select>
//                 {validationMessages(brand)}
//               </div>
//               <div className="flex flex-col">
//                 <label className=" font-medium text-gray-700 mb-1">{productType.label}</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                   value={productType.value}
//                   onChange={(e) => handleInputChange(setProductType, productType, e.target.value)}
//                   disabled={saveType === SAVE_TYPE.UPDATE}
//                 >
//                   {productTypeOptions.map((option) => (
//                     <option key={option.id} value={option.id}>{option.displayName}</option>
//                   ))}
//                 </select>
//                 {validationMessages(productType)}
//               </div>
//               <StoresComponent stores={stores} setStores={setStoresHandler} />
//             </div>
//           </div>

//           {/* Product Options Section */}
//           <div className="p-4">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Options</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="autoDeductInventory"
//                     className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                     onChange={(e) => setIsProductItem(e.target.checked)}
//                     checked={isProductItem}
//                   />
//                   <label htmlFor="autoDeductInventory" className=" font-medium text-gray-700">Product Item</label>
//                 </div>
//                 <p className=" text-gray-500">{getInstruction("isProductItem")}</p>
//               </div>
//               <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="isNotForSelling"
//                     className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                     onChange={(e) => setIsNotForSelling(e.target.checked)}
//                     checked={isNotForSelling}
//                   />
//                   <label htmlFor="isNotForSelling" className=" font-medium text-gray-700">Not For Selling</label>
//                 </div>
//                 <p className=" text-gray-500">{getInstruction("isNotForSelling")}</p>
//               </div>
//               {/* <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="isUnique"
//                     className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                     onChange={(e) => setIsUnique(e.target.checked)}
//                     checked={isUnique}
//                   />
//                   <label htmlFor="isUnique" className=" font-medium text-gray-700">Unique</label>
//                 </div>
//                 <p className="text-xs text-gray-500">{getInstruction("isUnique")}</p>
//               </div> */}
//               <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="isStockTracked"
//                     className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                     onChange={(e) => setIsStockTracked({ ...isStockTracked, value: e.target.checked })}
//                     checked={isStockTracked.value}
//                     disabled={!isProductItem || isStockTracked.isDisabled}
//                   />
//                   <label htmlFor="isStockTracked" className=" font-medium text-gray-700">Stock Tracked</label>
//                 </div>
//                 <p className=" text-gray-500">{getInstruction("isStockTracked")}</p>
//               </div>
//               <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="isExpiringProduct"
//                     className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                     onChange={(e) => setIsExpiringProduct(e.target.checked)}
//                     checked={isExpiringProduct}
//                   />
//                   <label htmlFor="isExpiringProduct" className=" font-medium text-gray-700">Expiring Product</label>
//                 </div>
//                   <p className=" text-gray-500">{getInstruction("isExpiringProduct")}</p>
//               </div>
//             </div>
//           </div>

//           {/* Category Section */}
//           <div className="p-4">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <div className="flex flex-col">
//                 <label className=" font-medium text-gray-700 mb-1">{productCategory.label}</label>
//                 <div className="flex gap-2">
//                   <select
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                   >
//                     <option value="" disabled>Select Category</option>
//                     {categoryOptions.map((option) => (
//                       <option key={option.id} value={option.id}>{option.displayName}</option>
//                     ))}
//                   </select>
//                   <GhostButton
//                     onClick={() => {
//                       if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
//                         setSelectedCategories([...selectedCategories, parseInt(selectedCategory)]);
//                         setSelectedCategory("");
//                       }
//                     }}
//                     disabled={selectedCategory === ""}
//                     iconClass="pi pi-plus-circle text-lg"
//                     labelClass="text-md font-normal"
//                     label="Add"
//                     color="text-sky-500"
//                     hoverClass="hover:text-sky-700 hover:bg-transparent"
//                   />
//                 </div>
//               </div>
//               <div className="md:col-span-2">
//                 <div className="flex flex-wrap gap-2 mt-6">
//                   {categoryOptions.length > 0 &&
//                     selectedCategories?.map((categoryId, index) => {
//                       const category = categoryOptions.find((opt) => opt.id === parseInt(categoryId));
//                       return (
//                         <CategoryItem
//                           key={categoryId}
//                           category={category}
//                           onClick={() => setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))}
//                         />
//                       );
//                     })}
//                 </div>
//               </div>

//  <div className="">
// {/* {JSON.stringify(reorderLevel)} */}
// {productType.value != "3" &&  <InputField
//                   label={reorderLevel.label}
//                   value={reorderLevel.value}
//                   isDisabled={reorderLevel.isDisabled}
//                   onChange={(e) => handleInputChange(setReorderLevel, reorderLevel, e.target.value)}
//                   validationMessages={validationMessages(reorderLevel)}
//                   placeholder="Enter Reorder Level"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
// }
//             </div>
//           </div>
// </div>

  
//           {/* Product Details Section (for Product Type 1 and 3) */}
//           {(productType.value == "1" || productType.value == "3") && (
//             <div className="bg-gray-50 p-4 rounded-md shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="flex flex-col">
//                   <label className=" font-medium text-gray-700 mb-1">{sku.label}</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                       value={sku.value}
//                       onChange={(e) => handleInputChange(setSku, sku, e.target.value)}
//                       placeholder="Enter SKU"
//                     />
//                     <button
//                       type="button"
//                       className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
//                       onClick={generateSKU}
//                     >
//                       Generate SKU
//                     </button>
//                   </div>
//                   {validationMessages(sku)}
//                 </div>
//                 <InputField
//                   label={barcode.label}
//                   value={barcode.value}
//                   onChange={(e) => handleInputChange(setBarcode, barcode, e.target.value)}
//                   validationMessages={validationMessages(barcode)}
//                   placeholder="Enter Barcode"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <InputField
//                   label={unitCost.label}
//                   value={unitCost.value}
//                   onChange={(e) => handleInputChange(setUnitCost, unitCost, e.target.value)}
//                   validationMessages={validationMessages(unitCost)}
//                   placeholder="Enter Unit Cost"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <InputField
//                   label={unitPrice.label}
//                   value={unitPrice.value}
//                   onChange={(e) => handleInputChange(setUnitPrice, unitPrice, e.target.value)}
//                   validationMessages={validationMessages(unitPrice)}
//                   placeholder="Enter Unit Price"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
//                 <InputField
//                   label={taxRatePerc.label}
//                   value={taxRatePerc.value}
//                   onChange={(e) => handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value)}
//                   validationMessages={validationMessages(taxRatePerc)}
//                   placeholder="Enter Tax Rate (%)"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                 />
            

//                  <div className="flex flex-col gap-1">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="isAssemblyProduct"
//                     className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
//                     onChange={(e) => setIsAssemblyProduct({ ...isAssemblyProduct, value: e.target.checked })}
//                     checked={isAssemblyProduct.value}
//                    // disabled={isStockTracked.isDisabled}
//                   />
//                   <label htmlFor="isAssemblyProduct" className=" font-medium text-gray-700">Assembly Product</label>
//                 </div>
//                 <p className=" text-gray-500">{getInstruction("isAssemblyProduct")}</p>
//               </div>


//               </div>
//             </div>
//           )}

//   {productType.value == "2" && (
//   <div className="bg-gray-50 p-6 rounded-lg">
//     <h3 className="text-xl font-semibold text-gray-800 mb-6">Variations</h3>
//     <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
//       <div className="flex-1">
//         <label className=" font-medium text-gray-700 mb-2 block">Variation Type</label>
//         <div className="flex items-center gap-3">
//           <select
//             className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 bg-white"
//             value={variationType.value}
//             onChange={(e) => handleInputChange(setVariationType, variationType, e.target.value)}
//           >
//             <option value="" disabled>Select Variation Type</option>
//             {variationTypeOptions.map((option) => (
//               <option key={option.id} value={option.id}>{option.displayName}</option>
//             ))}
//           </select>
//           <button
//             type="button"
//             className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 flex items-center gap-2"
//             onClick={handleAddVariation}
//           >
//             <FontAwesomeIcon icon={faPlus} />
//             Add Type
//           </button>
//         </div>
//       </div>
//       <button
//         type="button"
//         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
//         onClick={handleNewAddVariation}
//       >
//         <FontAwesomeIcon icon={faPlus} />
//         New Variation
//       </button>
//     </div>
//     <div className="overflow-x-auto rounded-md border border-gray-200">
//       <table className="w-full border-collapse">
//         <thead className="bg-gray-50  font-medium text-gray-700 border-b border-gray-200">
//           <tr>
//             <th className="px-4 py-3 text-left">SKU</th>
//             <th className="px-4 py-3 text-left">Barcode</th>
//             <th className="px-4 py-3 text-left">Unit Cost</th>
//             <th className="px-4 py-3 text-left">Unit Price</th>
//             <th className="px-4 py-3 text-left">Tax (%)</th>
//             {variations[0]?.variationDetails &&
//               variations[0].variationDetails.map((c) => (
//                 <th key={c.variationTypeId} className="px-4 py-3 text-left">
//                   <div className="flex items-center gap-2">
//                     <span>{c.variationTypeName}</span>
//                     <button
//                       type="button"
//                       className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
//                       onClick={() => handleRemoveVariationType(c.variationTypeId)}
//                       aria-label={`Remove ${c.variationTypeName} Type`}
//                       title={`Remove ${c.variationTypeName} Type`}
//                     >
//                       <FontAwesomeIcon icon={faClose} size="sm" />
//                     </button>
//                   </div>
//                 </th>
//               ))}
//             <th className="px-4 py-3"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {variations.map((variation, index) => (
//             <tr key={variation.variationProductId || index} className="hover:bg-gray-50 transition-colors duration-150">
//               <td className="px-4 py-2">
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                   value={variation.sku}
//                   onChange={(e) => {
//                     const updatedSku = e.target.value;
//                     setVariations((prevVariations) =>
//                       prevVariations.map((item, i) =>
//                         i === index ? { ...item, sku: updatedSku } : item
//                       )
//                     );
//                   }}
//                   placeholder="Enter SKU"
//                 />
//               </td>
//               <td className="px-4 py-2">
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                   value={variation.barcode}
//                   onChange={(e) => {
//                     const updatedBarcode = e.target.value;
//                     setVariations((prevVariations) =>
//                       prevVariations.map((item, i) =>
//                         i === index ? { ...item, barcode: updatedBarcode } : item
//                       )
//                     );
//                   }}
//                   placeholder="Enter Barcode"
//                 />
//               </td>
//               <td className="px-4 py-2">
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                   value={variation.unitCost}
//                   onChange={(e) => {
//                     const updatedUnitCost = e.target.value;
//                     setVariations((prevVariations) =>
//                       prevVariations.map((item, i) =>
//                         i === index ? { ...item, unitCost: updatedUnitCost } : item
//                       )
//                     );
//                   }}
//                   placeholder="Enter Unit Cost"
//                 />
//               </td>
//               <td className="px-4 py-2">
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                   value={variation.unitPrice}
//                   onChange={(e) => {
//                     const updatedUnitPrice = e.target.value;
//                     setVariations((prevVariations) =>
//                       prevVariations.map((item, i) =>
//                         i === index ? { ...item, unitPrice: updatedUnitPrice } : item
//                       )
//                     );
//                   }}
//                   placeholder="Enter Unit Price"
//                 />
//               </td>
//               <td className="px-4 py-2">
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                   value={variation.taxPerc}
//                   onChange={(e) => {
//                     const updatedTaxPerc = e.target.value;
//                     setVariations((prevVariations) =>
//                       prevVariations.map((item, i) =>
//                         i === index ? { ...item, taxPerc: updatedTaxPerc } : item
//                       )
//                     );
//                   }}
//                   placeholder="Enter Tax %"
//                 />
//               </td>
//               {variation.variationDetails &&
//                 variation.variationDetails.map((detail) => (
//                   <td key={detail.variationTypeId} className="px-4 py-2">
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 "
//                       value={detail.variationValue}
//                       onChange={(e) => handleVariationChange(e.target.value, index, detail.variationTypeId)}
//                       placeholder={`Enter ${detail.variationTypeName}`}
//                     />
//                   </td>
//                 ))}
//               <td className="px-4 py-2">
//                 <button
//                   type="button"
//                   className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
//                   onClick={() => handleRemoveVariation(variation.variationProductId, index)}
//                   aria-label="Remove Variation Row"
//                   title="Remove Variation Row"
//                 >
//                   <FontAwesomeIcon icon={faClose} size="sm" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}

//           {/* Combo Ingredients Section (Product Type 3) */}
//           {productType.value == "3" && (
//             <div className="bg-gray-50 p-6 rounded-md shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Combo Ingredients</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//                 <div className="flex flex-col">
//                   <label className=" font-medium text-gray-700 mb-1">Search Product</label>
//                   <ProductSearch onProductSelect={handleProductClick} />
//                   {validationMessages(comboIngrednentSku)}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className=" font-medium text-gray-700 mb-1">{comboIngrednentQty.label}</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
//                     value={comboIngrednentQty.value}
//                     onChange={(e) => handleInputChange(setComboIngrednentQty, comboIngrednentQty, e.target.value)}
//                     placeholder="Enter Quantity"
//                   />
//                   {validationMessages(comboIngrednentQty)}
//                 </div>
//                 <button
//                   type="button"
//                   className="self-end px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200"
//                   onClick={async () => {
//                     const filteredData = {
//                       productId: null,
//                       productNo: null,
//                       productName: "",
//                       sku: comboIngrednentSku.value,
//                       barcode: null,
//                       brandId: null,
//                       storeId: selectedStore.storeId,
//                       productTypeIds: null,
//                       categoryId: -1,
//                       measurementUnitId: -1,
//                       searchByKeyword: false,
//                       skip: 0,
//                       limit: 1,
//                     };
//                     const _result = await getProducts(filteredData);
//                     console.log("getProducts result ", _result);
//                     const product = _result.data.results[0][0];
//                     if (!product) {
//                       showToast("danger", "Exception", "Product not found.");
//                       return;
//                     }
//                     const _comboIngredents = {
//                       measurementUnitName: product.measurementUnitName,
//                       productId: product.productId,
//                       productId_mat: product.productTypeId === 1 ? product.productId : product.productTypeId === 2 ? product.variationProductId : null,
//                       productName: product.productName,
//                       productTypeId: product.productTypeId,
//                       productTypeName: product.productTypeName,
//                       sku: product.sku,
//                       qty: comboIngrednentQty.value,
//                     };
//                     const existingComboIngre = [...comboIngredients];
//                     if (existingComboIngre.find((i) => i.sku === product.sku)) {
//                       showToast("danger", "Exception", "The Product already exists.");
//                       return;
//                     }
//                     existingComboIngre.push(_comboIngredents);
//                     console.log("existingComboIngre ", existingComboIngre);
//                     setComboIngredients(existingComboIngre);
//                   }}
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead className="bg-gray-100  border-b border-gray-200">
//                     <tr>
//                       <th className="px-4 py-2 text-left">Product Name</th>
//                       <th className="px-4 py-2 text-left">Product Type</th>
//                       <th className="px-4 py-2 text-left">SKU</th>
//                       <th className="px-4 py-2 text-left">Qty</th>
//                       <th className="px-4 py-2"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {comboIngredients.map((item) => (
//                       <tr key={item.productId} className="hover:bg-gray-50">
//                         <td className="px-4 py-2">{item.productName}</td>
//                         <td className="px-4 py-2">{item.productTypeName}</td>
//                         <td className="px-4 py-2">{item.sku}</td>
//                         <td className="px-4 py-2">{item.qty} {item.measurementUnitName}</td>
//                         <td className="px-4 py-2">
//                           <button
//                             className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors duration-200"
//                             onClick={async () => {
//                               const updatedExtraDetails = comboIngredients.filter(
//                                 (c) => c.productId !== item.productId
//                               );
//                               setComboIngredients(updatedExtraDetails);
//                             }}
//                             aria-label="Delete"
//                             title="Delete Product"
//                           >
//                             <FontAwesomeIcon icon={faTrash} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Image Upload Section */}
//           <div className="bg-gray-50 p-6 rounded-md shadow-sm">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Image</h3>
//             <div className="flex items-center gap-4">
//               <label className="flex flex-col items-center cursor-pointer">
//                 <span className="mb-2  font-medium text-gray-700">Upload an Image</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//                 <div className="flex items-center justify-center w-40 h-12 bg-sky-600 text-white  font-medium rounded-md hover:bg-sky-700 transition-colors duration-200">
//                   Choose File
//                 </div>
//               </label>
//               {isFileSelectLoading ? (
//                 <div className="w-full max-w-md text-center">
//                   <div className="relative overflow-hidden rounded-lg">
//                     <svg className="animate-spin h-8 w-8 text-sky-500" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                   </div>
//                 </div>
//               ) : (
//                 previewUrl && (
//                   <div className="w-full max-w-md text-center">
//                     <div className="relative overflow-hidden rounded-lg">
//                       <img
//                         src={previewUrl}
//                         alt="Preview"
//                         className="object-contain w-full max-h-32 rounded-lg"
//                       />
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-center mt-8">
//             <button
//               type="submit"
//               className={`w-56 py-3 px-6 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors duration-200 font-semibold ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center gap-2">
//                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Submitting...
//                 </span>
//               ) : saveType === SAVE_TYPE.UPDATE ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>}
//       </div>
//     </div>
//   );
// }
