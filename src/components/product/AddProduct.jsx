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
import { FaTrash, FaPlus, FaLayerGroup, FaTags, FaInfoCircle } from "react-icons/fa";
import CheckBox from "../inputField/CheckBox";

const CategoryItem = ({ onClick, category }) => {
  return (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <span className="text-gray-800 font-medium pr-1">{category.displayName} </span>
      <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" onClick={onClick} />
    </div>
  );
};

export default function AddProduct({ saveType = SAVE_TYPE.ADD, id = 0, onSaved }) {
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
  const [isMultiUom, setIsMultiUom] = useState({ value: false, isDisabled: false });
  
  const [isStockTracked, setIsStockTracked] = useState({ value: true, isDisabled: false });
  const [isAssemblyProduct, setIsAssemblyProduct] = useState({ value: false });
  const [isBatchTracked, setIsBatchTracked] = useState({ value: false });
  const [comboIngredients, setComboIngredients] = useState([]);
  const [subProductsList, setSubProductsList] = useState([]);
  const [variations, setVariations] = useState([]);










  // Multi-UOM Standard Tier Configurations (Applies across all variations)
  const [uomTiers, setUomTiers] = useState([
    {
      id: 1,
      measurementUnitId: "",
      conversionQty: 1,
      isBaseUnit: true,
      isDefaultSalesUom: true,
      isDefaultPurchaseUom: true,
      isDefaultStockUom: true,
      isDecimalAllowed: false,
      displayOrder: 1,
      isActive: true,
    }
  ]);

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
    value: "1",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [reorderLevel, setReorderLevel] = useState({
    label: "Reorder Level",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "decimal" },
  });

  const [productType, setProductType] = useState({
    label: "Product Type",
    value: "2",
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
  const [previewUrl, setPreviewHash] = useState(null);

  const [imageHash0, setImageHash] = useState(null);
  const [imageHashRemoved, setImageHashRemoved] = useState(null);

  const [uploadResponse, setUploadResponse] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [variationTypeOptions, setVariationTypeOptions] = useState([]);
  const [storesOptions, setStoresOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  // Sync Base Measurement Unit with First UOM Tier
  useEffect(() => {
    if (isMultiUom.value && measurementUnit.value) {
      setUomTiers(prev => prev.map((tier, idx) => idx === 0 ? { ...tier, measurementUnitId: measurementUnit.value } : tier));
    }
  }, [measurementUnit.value, isMultiUom.value]);

  // Synchronize dynamic UOM tiers with variation state
  useEffect(() => {
    if (isMultiUom.value) {
      setVariations(prevVariations => prevVariations.map(variation => {
        const uomPrices = uomTiers.map(tier => {
          const existingPriceObj = variation.uomPrices?.find(p => p.uomTierId === tier.id);
          return existingPriceObj || { uomTierId: tier.id, barcode: "", sellingPrice: "" };
        });
        return { ...variation, uomPrices };
      }));
    }
  }, [uomTiers, isMultiUom.value]);

  const handleAddUomTier = () => {
    const newTier = {
      id: Date.now(),
      measurementUnitId: "",
      conversionQty: 1,
      isBaseUnit: false,
      isDefaultSalesUom: false,
      isDefaultPurchaseUom: false,
      isDefaultStockUom: false,
      isDecimalAllowed: false,
      displayOrder: uomTiers.length + 1,
      isActive: true,
    };
    setUomTiers(prev => [...prev, newTier]);
  };

  const handleRemoveUomTier = (id) => {
    if (uomTiers.length <= 1) {
      showToast("warning", "Required", "At least one UOM tier must remain.");
      return;
    }
    setUomTiers(prev => prev.filter(tier => tier.id !== id));
  };

  const handleUomTierChange = (id, field, value) => {
    setUomTiers(prev => prev.map(tier => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      // Single selection enforcement for default flags
      if (["isDefaultSalesUom", "isDefaultPurchaseUom", "isDefaultStockUom"].includes(field) && value === true) {
        return { ...tier, [field]: false };
      }
      return tier;
    }));
  };

  const handleVariationUomPriceChange = (variationIndex, uomTierId, field, value) => {
    setVariations(prev => prev.map((v, idx) => {
      if (idx === variationIndex) {
        const updatedPrices = (v.uomPrices || []).map(p => {
          if (p.uomTierId === uomTierId) {
            return { ...p, [field]: value };
          }
          return p;
        });
        return { ...v, uomPrices: updatedPrices };
      }
      return v;
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsFileSelectLoading(true);
      const response = await uploadImageResized(file);
      setUploadResponse(response);
      setPreviewHash(response.hash);
      setIsFileSelectLoading(false);

      if (imageHash0) {
        setImageHashRemoved(imageHash0);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewHash(null);
    setUploadResponse(null);
    setImageHashRemoved(imageHash0);
    setImageHash(null);

    const input = document.getElementById('image-upload');
    if (input) input.value = '';
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
    setIsMultiUom({ value: false, isDisabled: false });
    
    setIsStockTracked({ value: true, isDisabled: false });
    setIsAssemblyProduct({ value: false });

    setSubProductsList([]);

    const initialVariation = {
      variationProductId: null,
      sku: "",
      barcode: "",
      unitCost: "",
      unitPrice: "",
      taxPerc: "",
      variationDetails: [],
      isAssemblyProduct: false,
      subProductsList: [],
      uomPrices: [],
    };

    setVariations([initialVariation]);

    setProductName({ ...productName, value: "", isTouched: false, isValid: false });
    setProductCategory({ ...productCategory, value: "", isTouched: false, isValid: false });
    setMeasurementUnit({ ...measurementUnit, value: "", isTouched: false, isValid: false });
    setBrand({ ...brand, value: "1", isTouched: false, isValid: false });
  
    setReorderLevel({ ...reorderLevel, value: "", isTouched: false, isValid: false });

    setProductType({ ...productType, value: "2", isTouched: false, isValid: false });
    setSubProductSku({ ...subProductSku, value: "", isTouched: false, isValid: false });
    setSubProductQty({ ...subProductQty, value: "", isTouched: false, isValid: false });
    setVariationType({ ...variationType, value: "", isTouched: false, isValid: false });
    setVariationValue({ ...variationValue, value: "", isTouched: false, isValid: false });

    handleRemoveImage();
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
      isProductItem: null,
      isStockTracked: null,
      isExpiringProduct: null,
      isBatchTracked: null,
      uomType: "SALES",
      searchByKeyword: false,
      skip: 0,
      limit: 1,
    });

    const {
      categories,
      measurementUnitId,
      productName,
      productDescription,
      reorderLevel,
      brandId,
      productTypeId,
      isStockTracked,
      isProductItem,
      isAssemblyProduct,
      isUnique,
      isMultiUom,
      isNotForSelling,
      imageUrl,
      isExpiringProduct,
      isBatchTracked
    } = res.data.results[0][0];


  

    setSelectedCategories(JSON.parse(categories).map((c) => c.id));
    setMeasurementUnit((prev) => ({ ...prev, value: measurementUnitId }));
    setProductName((prev) => ({ ...prev, value: productName }));
    setBrand((prev) => ({ ...prev, value: brandId }));
    setProductType((prev) => ({ ...prev, value: productTypeId }));
    setIsExpiringProduct(isExpiringProduct);
    setIsProductItem(isProductItem);
    setIsUnique(isUnique);

    setIsMultiUom((prev) => ({ ...prev, value: isMultiUom === 1, isDisabled: false }));
    setIsNotForSelling(isNotForSelling);
    setImageHash(imageUrl);

    setIsAssemblyProduct((prev) => ({ ...prev, value: isAssemblyProduct === 1 }));
    setIsStockTracked((prev) => ({ ...prev, value: isStockTracked === 1, isDisabled: false }));
    setIsBatchTracked((prev) => ({ ...prev, value: isBatchTracked === 1, isDisabled: false }));
    setSubProductsList([]);
    const details = await getProductExtraDetails(id);

    if (productTypeId === 2) {
      setReorderLevel((prev) => ({ ...prev, value: reorderLevel }));
      const variationDetails = details.data.results[0];
      const parsedVariations = variationDetails.map((variation) => ({
        ...variation,
        variationDetails:
          typeof variation.variationDetails === "string"
            ? JSON.parse(variation.variationDetails)
            : variation.variationDetails,
        subProductsList: isAssemblyProduct ? JSON.parse(variation.subProductsList)?.map(item => ({
          qty: item.qty,
          allProductId: item.allProductId,
          productDescription: item.productDescription,
          sku: item.sku,
          measurementUnitName: item.measurementUnitName
        })) || [] : [],
      }));
      setVariations(parsedVariations);
      const productStores = details.data.results[1];
      setStores(productStores);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const _variations = variations.map((v) => ({
        ...v,
        variationDetails:
          typeof v.variationDetails === "string"
            ? JSON.parse(v.variationDetails)
            : v.variationDetails,
        subProductsList: isAssemblyProduct.value ? v.subProductsList || [] : [],
        uomPrices: isMultiUom.value ? v.uomPrices : [],
      }));

      const _subProductsList = subProductsList.map((item) => ({
        qty: item.qty,
        allProductId: item.allProductId,
      }));

      const payLoad = {
        tableId: null,
        productTypeId: parseInt(productType.value),
        storeIdList: stores,
        productName: productName.value,
        categoryIdList: selectedCategories,
        variationProductList: _variations,
        multiUomTierList: isMultiUom.value ? uomTiers : [],
        subProductsList: _subProductsList,
        measurementUnitId: measurementUnit.value,
        isNotForSelling: isNotForSelling,
        imgUrl: uploadResponse?.hash || imageHash0,
        isUnique: isUnique,
        isMultiUom: isMultiUom.value,
        isStockTracked: isStockTracked.value,
        isProductItem: isProductItem,
        isAssemblyProduct: isAssemblyProduct.value,
        isBatchTracked: isBatchTracked.value,
        brandId: brand.value,
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
          return;
        }

        if (uploadResponse) {
          await commitFile(uploadResponse.hash);
        }
        showToast("success", "Success", outputMessage);
        resetValues();
        onSaved?.();
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
          return;
        } 
        if (imageHashRemoved) {
          try {
            await markFileAsTobeDeleted(imageHashRemoved);
            setImageHashRemoved(null);
          } catch(err) {
            console.log('error:', err);
          }
        }

        if (uploadResponse) {
          await commitFile(uploadResponse.hash);
        }
        if (!onSaved) {
          await loadValuesForUpdate();
        }
        showToast("success", "Success", outputMessage);
        onSaved?.({ id, payload: payLoad });
      } else {
        showToast("danger", "Exception", "Invalid Save type");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("payload error", error);
    }
  };

  const [hasInitializedVariations, setHasInitializedVariations] = useState(false);

  useEffect(() => {
    if (
      !hasInitializedVariations &&
      productType.value === "2" &&
      variations.length === 0
    ) {
      const initialVariation = {
        variationProductId: null,
        sku: "",
        barcode: "",
        unitCost: "",
        unitPrice: "",
        taxPerc: "",
        variationDetails: [],
        isAssemblyProduct: false,
        subProductsList: [],
        uomPrices: [],
      };

      setVariations([initialVariation]);
      setHasInitializedVariations(true);
    }
  }, [productType.value, variations.length, hasInitializedVariations]);

  const handleNewAddVariation = () => {
    const lastVariation = variations[variations.length - 1];
    const copiedVariationDetails = lastVariation?.variationDetails?.map(detail => ({
      variationTypeId: detail.variationTypeId,
      variationTypeName: detail.variationTypeName,
      variationValue: "",
    })) || [];

    const uomPrices = isMultiUom.value ? uomTiers.map(tier => ({ uomTierId: tier.id, barcode: "", sellingPrice: "" })) : [];

    const newVariation = {
      variationProductId: null,
      sku: "",
      barcode: "",
      unitCost: "",
      unitPrice: "",
      taxPerc: "",
      variationDetails: copiedVariationDetails,
      isAssemblyProduct: false,
      subProductsList: [],
      uomPrices,
    };

    setVariations(prev => [...prev, newVariation]);
  };

  const handleAddVariation = () => {
    if (!variationType.value) {
      alert("Please select a valid variation type");
      return;
    }

    setVariations((prevIngredients) =>
      prevIngredients.map((ingredient) => {
        const variationDetails = ingredient.variationDetails || [];
        const existingVariationType = variationDetails.find(
          (detail) => detail.variationTypeId === variationType.value
        );

        if (existingVariationType) {
          return ingredient;
        }

        return {
          ...ingredient,
          variationDetails: [
            ...variationDetails,
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

  const handleSubProductsChange = (index, newSubProductsList) => {
    setVariations((prevVariations) =>
      prevVariations.map((variation, i) =>
        i === index
          ? { ...variation, subProductsList: newSubProductsList }
          : variation
      )
    );
  };

  const getInstruction = (key) => {
    switch (key) {
      case "isProductItem":
        return "Turn this on for physical items you can count (like goods). Turn it off for services (like installation or repairs).";
      case "isNotForSelling":
        return "Hide this item from the sales screen. Use this for internal store supplies, raw materials, or business assets.";
      case "isUnique":
        return "Use this for one-of-a-kind items with unique IDs that cannot be duplicated or restocked under the same code.";
      case "isMultiUom":
        return "Use this for items sold or tracked in multiple units of measure (e.g., Piece, Pack, Box, or Strip) with different prices or conversions.";
      case "isStockTracked":
        return "Automatically track quantities. The system will count down your stock every time you make a sale.";
      case "isAssemblyProduct":
        return "Turn this on if this is a composite item—a bundle, kit, or recipe made by combining other products together.";
      case "isExpiringProduct":
        return "Track expiration dates for this item (best for food, drinks, or medicine).";
      case "isBatchTracked":
        return "Track stock by batches or lots. Required for managing specific groups of inventory with separate expiry dates or costs.";
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
                  <label className="font-medium text-gray-700 mb-1">
                    {isMultiUom.value ? "Base Unit" : "Measurement Unit"}
                  </label>
                  
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

                  {isMultiUom.value && (
                    <div className="p-3 mt-2 text-sm text-sky-900 bg-sky-50 border border-sky-200 rounded-lg flex items-start gap-2">
                      <FaInfoCircle className="text-sky-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Setting the Base Unit:</p>
                        <p className="mt-0.5 text-xs text-sky-800">
                          Select the absolute minimum unit for transactions (e.g., Milligram, Tablet). You will not be able to define or sell units smaller than this Base Unit.
                        </p>
                      </div>
                    </div>
                  )}

                  {validationMessages(measurementUnit)}
                </div>
              </div>
            </div>

            {/* Category Section */}
            <div className="p-4">
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
                      selectedCategories?.map((categoryId) => {
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
                  {isStockTracked.value && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <CheckBox onChange={(e) => setIsProductItem(e.target.checked)} checked={isProductItem} label="Product Item" />
                  <p className="text-gray-500">{getInstruction("isProductItem")}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isMultiUom"
                      className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      onChange={(e) => setIsMultiUom({ ...isMultiUom, value: e.target.checked })}
                      checked={isMultiUom.value}
                      disabled={isMultiUom.isDisabled}
                    />
                    <label htmlFor="isMultiUom" className="font-medium text-gray-700">Multi UOM</label>
                  </div>
                  <p className="text-gray-500">{getInstruction("isMultiUom")}</p>
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

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isBatchTracked"
                      className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      onChange={(e) => setIsBatchTracked({ ...isBatchTracked, value: e.target.checked })}
                      checked={isBatchTracked.value}
                    />
                    <label htmlFor="isBatchTracked" className="font-medium text-gray-700">Batch Tracked</label>
                  </div>
                  <p className="text-gray-500">{getInstruction("isBatchTracked")}</p>
                </div>
              </div>
            </div>

            {/* MULTI-UOM CONFIGURATION SETUP PANEL */}
            {isMultiUom.value && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <FaLayerGroup className="text-amber-600 text-xl" />
                    <h3 className="text-lg font-semibold text-slate-800">Multi-UOM Hierarchy & Conversion Rules</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddUomTier}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700 transition flex items-center gap-1"
                  >
                    <FaPlus /> Add UOM Tier
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Define the universal measurement unit structure for this product. All variations will enforce this exact unit hierarchy while allowing custom selling prices and barcodes per variation.
                </p>

                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 uppercase text-slate-700 font-bold border-b">
                      <tr>
                        <th className="p-3">Measurement Unit</th>
                        <th className="p-3 text-center">Conversion Qty (Base)</th>
                        <th className="p-3 text-center">Default Sales</th>
                        <th className="p-3 text-center">Default Purchase</th>
                        <th className="p-3 text-center">Default Stock</th>
                        <th className="p-3 text-center">Decimal Allowed</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uomTiers.map((tier, idx) => (
                        <tr key={tier.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            {idx === 0 ? (
                              <div className="font-semibold text-slate-800 flex items-center gap-2">
                                {measurementUnitOptions.find(m => m.id == measurementUnit.value)?.displayName || "Select Base Unit Above"}
                                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold">Base Unit</span>
                              </div>
                            ) : (
                              <select
                                className="w-full p-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500"
                                value={tier.measurementUnitId}
                                onChange={(e) => handleUomTierChange(tier.id, "measurementUnitId", e.target.value)}
                              >
                                <option value="">Select Unit</option>
                                {measurementUnitOptions.map(opt => (
                                  <option key={opt.id} value={opt.id}>{opt.displayName}</option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {idx === 0 ? (
                              <span className="font-mono text-slate-500">1 (Base)</span>
                            ) : (
                              <input
                                type="number"
                                min="1"
                                className="w-20 p-1.5 text-center border border-slate-300 rounded font-mono"
                                value={tier.conversionQty}
                                onChange={(e) => handleUomTierChange(tier.id, "conversionQty", parseFloat(e.target.value))}
                              />
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name="defaultSalesUom"
                              checked={tier.isDefaultSalesUom}
                              onChange={() => handleUomTierChange(tier.id, "isDefaultSalesUom", true)}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name="defaultPurchaseUom"
                              checked={tier.isDefaultPurchaseUom}
                              onChange={() => handleUomTierChange(tier.id, "isDefaultPurchaseUom", true)}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name="defaultStockUom"
                              checked={tier.isDefaultStockUom}
                              onChange={() => handleUomTierChange(tier.id, "isDefaultStockUom", true)}
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={tier.isDecimalAllowed}
                              onChange={(e) => handleUomTierChange(tier.id, "isDecimalAllowed", e.target.checked)}
                            />
                          </td>
                          <td className="p-3 text-center">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveUomTier(tier.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Products Section (Assembly Product) */}
            {isAssemblyProduct.value && variations?.length === 1 ? (
              <SubProductList
                subProductsList={subProductsList}
                setSubProductsList={setSubProductsList}
              />
            ) : null}

            {/* VARIATIONS TABLE */}
            <div className="p-6 rounded-lg">
              <div className="flex justify-between gap-4 mb-6">
                <div>
                  <label className="font-medium text-gray-700 mb-2 block">Variation Type</label>
                  <div className="flex items-center gap-3">
                    <select
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
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
                      className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition flex items-center gap-2"
                      onClick={handleAddVariation}
                    >
                      <FaPlus /> Add Type
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
                    onClick={handleNewAddVariation}
                  >
                    <FaPlus /> New Variation
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border-2 border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">SKU</th>
                      
                      {/* Hide standard pricing and barcode fields when Multi-UOM is active */}
                      {!isMultiUom.value && (
                        <>
                          <th className="px-4 py-3 text-left">Barcode</th>
                          <th className="px-4 py-3 text-left">Unit Cost</th>
                          <th className="px-4 py-3 text-left">Unit Price</th>
                          <th className="px-4 py-3 text-left">Tax (%)</th>
                        </>
                      )}

                      {/* Dynamic Multi-UOM Price Columns */}
                      {isMultiUom.value && uomTiers.map(tier => {
                        const unitName = measurementUnitOptions.find(m => m.id == tier.measurementUnitId)?.displayName || (tier.isBaseUnit ? "Base Unit" : "Unit");
                        return (
                          <th key={tier.id} className="px-4 py-3 text-left bg-amber-50/50 border-x border-amber-200">
                            <div className="text-xs font-bold text-amber-900">{unitName} Multi-UOM</div>
                            <div className="text-[10px] text-amber-700 font-normal">Barcode & Selling Price</div>
                          </th>
                        );
                      })}

                      {variations[0]?.variationDetails &&
                        variations[0].variationDetails.map((c) => (
                          <th key={c.variationTypeId} className="px-8 py-6 text-left text-lg font-bold text-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{c.variationTypeName}</span>
                              <button
                                type="button"
                                className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition"
                                onClick={() => handleRemoveVariationType(c.variationTypeId)}
                              >
                                <FaTrash className="text-sm" />
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
                        <tr className="border-t-2 border-gray-200 hover:bg-sky-50 transition">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
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

                          {/* Standard Pricing Fields rendered only when Multi-UOM is disabled */}
                          {!isMultiUom.value && (
                            <>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
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
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
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
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
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
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
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
                            </>
                          )}

                          {/* Dynamic Multi-UOM Barcode & Selling Price Cells per Variation */}
                          {isMultiUom.value && uomTiers.map(tier => {
                            const uomPriceObj = variation.uomPrices?.find(p => p.uomTierId === tier.id) || { barcode: "", sellingPrice: "" };
                            return (
                              <td key={tier.id} className="px-3 py-2 bg-amber-50/20 border-x border-amber-100">
                                <div className="flex flex-col gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Barcode"
                                    className="p-1 border border-slate-300 rounded text-xs font-mono"
                                    value={uomPriceObj.barcode || ""}
                                    onChange={(e) => handleVariationUomPriceChange(index, tier.id, "barcode", e.target.value)}
                                  />
                                  <input
                                    type="number"
                                    placeholder="Selling Price"
                                    className="p-1 border border-amber-300 bg-white rounded text-xs font-semibold text-emerald-700"
                                    value={uomPriceObj.sellingPrice || ""}
                                    onChange={(e) => handleVariationUomPriceChange(index, tier.id, "sellingPrice", e.target.value)}
                                  />
                                </div>
                              </td>
                            );
                          })}

                          {variation.variationDetails &&
                            variation.variationDetails.map((detail) => (
                              <td key={detail.variationTypeId} className="px-4 py-2">
                                <input
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500"
                                  value={detail.variationValue}
                                  onChange={(e) => handleVariationChange(e.target.value, index, detail.variationTypeId)}
                                  placeholder={`Enter ${detail.variationTypeName}`}
                                />
                              </td>
                            ))}
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition"
                              onClick={() => handleRemoveVariation(variation.variationProductId, index)}
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </td>
                        </tr>
                        {isAssemblyProduct.value && variations?.length >= 1 && (
                          <tr className="border-b">
                            <td colSpan={variation.variationDetails?.length + (isMultiUom.value ? uomTiers.length + 2 : 7)} className="px-20 pb-10">
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

            {/* Enhanced Image Upload Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              {/* <h3 className="text-xl font-semibold text-gray-800 mb-6">Product Image</h3> */}
              <div className="flex flex-col items-center justify-center">
                {(imageHash0 || previewUrl) ? (
                  <div className="relative group w-full max-w-sm">
                    <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <img
                        src={`${process.env.REACT_APP_API_CDN}/${previewUrl || imageHash0}?width=300&height=300&quality=85`}
                        alt="Product preview"
                        className="w-full h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <label
                          htmlFor="image-upload"
                          className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-xl flex items-center gap-3"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Change Image
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transform hover:scale-110 transition z-20"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-sm">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 group"
                    >
                      {isFileSelectLoading ? (
                        <div className="flex flex-col items-center">
                          <svg className="animate-spin h-12 w-12 text-sky-600 mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          <p className="text-gray-600 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="p-4 bg-sky-100 rounded-full mb-4 group-hover:bg-sky-200 transition-colors">
                            <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-lg font-medium text-gray-700 mb-2">Click to upload image</p>
                          <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
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
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : saveType === SAVE_TYPE.UPDATE ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}