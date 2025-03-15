import React, { useState, useEffect, useCallback } from "react";
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
  updateProduct,
} from "../../functions/register";
import { SAVE_TYPE } from "../../utils/constants";
import FormElementMessage from "../messges/FormElementMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
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

const CategoryItem = ({ onClick, category }) => {
  return (
    <div className="flex justify-between items-center p-3 border rounded-full gap-2 bg-gray-50">
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoGenerateProductNo, setAutoGenerateProductNo] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    setProductType((p) => ({ ...p, value: 1 }));
  }, []);

  const [stores, setStores] = useState([
    { storeId: store.storeId, storeName: store.storeName },
  ]);
  const [isProductItem, setIsProductItem] = useState(true);
  const [isNotForSelling, setIsNotForSelling] = useState(false);
  const [isExpiringProduct, setIsExpiringProduct] = useState(false);
  const [isUnique, setIsUnique] = useState(false);
  const [isStockTracked, setIsStockTracked] = useState(true);

  const [comboIngredients, setComboIngredients] = useState([]);
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
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [comboIngrednentSku, setComboIngrednentSku] = useState({
    label: "sku",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });
  const [comboIngrednentQty, setComboIngrednentQty] = useState({
    label: "Qty",
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

  const resetValues = () => {
    setStores([{ storeId: store.storeId, storeName: store.storeName }]);
    setIsProductItem(true);
    setIsNotForSelling(false);
    setIsExpiringProduct(false);
    setIsUnique(false);
    setIsStockTracked(true);

    setComboIngredients([]);
    setVariations([]);

    // setProductNo((prev) => ({
    //   ...prev,
    //   value: "",
    //   isTouched: false,
    //   isValid: false,
    // }));
    setProductName((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setProductCategory((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setMeasurementUnit((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setBrand((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setUnitCost((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setUnitPrice((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setReorderLevel((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setBarcode((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setSku((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setTaxRatePerc((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setProductType((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setComboIngrednentSku((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setComboIngrednentQty((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setVariationType((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
    setVariationValue((prev) => ({
      ...prev,
      value: "",
      isTouched: false,
      isValid: false,
    }));
  };

  const [isFileSelectLoading, setIsFileSelectLoading] = useState(false); // Store selected image
  const [previewUrl, setPreviewUrl] = useState(null); // Store image preview URL
  const [uploadResponse, setUploadResponse] = useState(null); // Store response from the upload API

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsFileSelectLoading(true);
      const response = await uploadImageResized(file); // Call the upload function
      console.log("setPreviewUrl", response);
      setUploadResponse(response);
      setPreviewUrl(
        `${process.env.REACT_APP_API_CDN}/${response.hash}?width=200&height=200&quality=80`
      ); // Generate preview URL

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

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);

  const [brandOptions, setBrandOptions] = useState([]);
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [variationTypeOptions, setVariationTypeOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [storesOptions, setStoresOptions] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(0);
  const [newVariation, setNewVariation] = useState({
    sku: "",
    unitPrice: "",
    variationDetails: [],
  });

  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions([...objArr.data.results[0]]);
  };

  useEffect(() => {
    loadDrpStores();
  }, []);

  const loadValuesForUpdate = async () => {
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
      isUnique,
      isNotForSelling,
      sku,
      imageUrl,
      isExpiringProduct,
    } = res.data.results[0][0];

    setBarcode((p) => ({ ...p, value: barcode }));

    // setProductCategory((p) => ({
    //   ...p,
    //   value: JSON.parse(categories).map((c) => c.id),
    // }));

    console.log(" res.data.results[0][0]", res.data.results[0][0]);
    setSelectedCategories(JSON.parse(categories).map((c) => c.id));
    setMeasurementUnit((p) => ({ ...p, value: measurementUnitId }));
    setProductNo((p) => ({ ...p, value: productNo }));
    setProductName((p) => ({ ...p, value: productName }));
    setReorderLevel((p) => ({ ...p, value: reorderLevel }));
    setTaxRatePerc((p) => ({ ...p, value: taxPerc }));
    setUnitCost((p) => ({ ...p, value: unitCost }));
    setUnitPrice((p) => ({ ...p, value: unitPrice }));
    setBrand((p) => ({ ...p, value: brandId }));
    setProductType((p) => ({ ...p, value: productTypeId }));
    setIsExpiringProduct(isExpiringProduct);

    setIsStockTracked(isStockTracked);
    setIsProductItem(isProductItem);
    setIsUnique(isUnique);
    setIsNotForSelling(isNotForSelling);
    setSku((p) => ({ ...p, value: sku }));

    setImageUrl(imageUrl);
    setPreviewUrl(
      `${process.env.REACT_APP_API_CDN}/${imageUrl}?width=200&height=200&quality=80`
    );

    const details = await getProductExtraDetails(id);

    if (productTypeId === 1) {
      const _singleProductSkuBarcode = details.data.results[0][0];
      console.log("_singleProductSkuBarcode:", _singleProductSkuBarcode);

      const _singleProductStores = details.data.results[1];
      console.log("_singleProductStores:", _singleProductStores);
      setStores(_singleProductStores);
    } else if (productTypeId === 2) {
      const variationDetails = details.data.results[0];

      const parsedVariations = variationDetails.map((variation) => ({
        ...variation,
        variationDetails:
          typeof variation.variationDetails === "string"
            ? JSON.parse(variation.variationDetails)
            : variation.variationDetails,
      }));

      setVariations(parsedVariations);

      const productStores = details.data.results[1];
      setStores(productStores);
    }

    if (productTypeId === 3) {
      const _comboProductSKuBarcoe = details.data.results[0];
      console.log("_comboProductSKuBarcoe:", _comboProductSKuBarcoe);
      setComboIngredients(_comboProductSKuBarcoe);

      const _comboProductStores = details.data.results[1];
      console.log("_comboProductStores:", _comboProductStores);
      setStores(_comboProductStores);
    }
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

    setVariationType((p) => ({ ...p, value: options[0].id }));
  };

  useEffect(() => {
    if (autoGenerateProductNo)
      setProductNo((p) => ({ ...p, value: "[Auto Generate]" }));
    else setProductNo((p) => ({ ...p, value: "" }));
  }, [autoGenerateProductNo]);

  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const _variations = variations.map((v) => ({
        ...v,
        variationDetails:
          typeof v.variationDetails === "string"
            ? JSON.parse(v.variationDetails) // Parse if it's a JSON string
            : v.variationDetails, // Use as-is if it's already an object
      }));

      const _comboIngredients = [...comboIngredients];
      console.log("_comboIngredients", _comboIngredients);

      const _prepaired_comboIngredients = [];
      _comboIngredients.map((item) => {
        return _prepaired_comboIngredients.push({
          barcode: item.barcode,
          measurementUnitName: item.measurementUnitName,
          productId: item.productId,
          productId_mat: item.productTypeId === 1 ? item.productId_mat : null,
          variationProductId_mat:
            item.productTypeId === 2 ? item.productId_mat : null,
          productName: item.productName,
          productTypeId: item.productTypeId,
          productTypeName: item.productTypeName,
          qty: item.qty,
          sku: item.sku,
        });
      });

      const payLoad = {
        tableId: null,
        productNo: productNo.value,
        productTypeId: parseInt(productType.value),
        storeIdList: stores,
        isProductNoAutoGenerate: autoGenerateProductNo,
        productName: productName.value,
        categoryIdList: selectedCategories, // Use selectedCategories instead

        variationProductList: _variations,

        comboProductDetailList: _prepaired_comboIngredients,
        // comboProductDetailList:[
        //   {qty:"4",productId_mat:16,variationProductId_mat:null},
        //   {qty:"7.7",productId_mat:17,variationProductId_mat:null},
        //   {qty:"2.6",productId_mat:null,variationProductId_mat:10},
        //    {qty:"7.1",productId_mat:null,variationProductId_mat:11}
        //   ],
        measurementUnitId: measurementUnit.value,
        isNotForSelling: isNotForSelling,
        imgUrl: uploadResponse?.hash || imageUrl, ///
        isUnique: isUnique,
        isStockTracked: isStockTracked,
        isProductItem: isProductItem,
        brandId: brand.value,
        unitCost: isNumeric(unitCost.value) ? unitCost.value : null,
        unitPrice: isNumeric(unitPrice.value) ? unitPrice.value : null,
        taxPerc: isNumeric(taxRatePerc.value) ? taxRatePerc.value : null,
        sku: sku.value,
        barcode: barcode.value,
        reorderLevel: reorderLevel.value,
        isExpiringProduct: isExpiringProduct,
      };

      console.log("payloadd", payLoad);

      setIsSubmitting(true);
      console.log("lllllllllllllllllllll", SAVE_TYPE.ADD, saveType);
      if (saveType === SAVE_TYPE.ADD) {
        const res = await addProduct(payLoad);
        if (res.data.error) {
          const { error } = res.data;

          showToast("danger", "Exception", error.message);
          setIsSubmitting(false);
          return;
        }

        const { outputMessage, responseStatus } = res.data.outputValues;
        if (responseStatus === "failed") {
          showToast("warning", "Exception", outputMessage);
          setIsSubmitting(false);
        } else {
          console.log("uploadResponse", uploadResponse);
          if (uploadResponse) {
            await commitFile(uploadResponse.hash);
          }
          showToast("success", "Success", outputMessage);
          // navigate(`/products/add?saveType=add`);
          resetValues();
        }
      } else if (saveType === SAVE_TYPE.UPDATE) {
        const res = await updateProduct(id, payLoad);
        if (res.data.error) {
          const { error } = res.data;
          showToast("danger", "Exception", error.message);
          setIsSubmitting(false);
          return;
        }
        const { outputMessage, responseStatus } = res.data.outputValues;
        if (responseStatus === "failed") {
          showToast("warning", "Exception", outputMessage);
          setIsSubmitting(false);
        } else {
          console.log("uploadResponse", uploadResponse);
          if (imageUrl) {
            await markFileAsTobeDeleted(imageUrl);
          }

          if (uploadResponse) {
            await commitFile(uploadResponse.hash);
          }

          await loadValuesForUpdate();
          showToast("success", "Success", outputMessage);
          //navigate(`/products`);
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

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleNewAddVariation = () => {
    // Get the last variation to copy its variationDetails structure
    const lastVariation = variations[variations.length - 1];

    // Create a new variation with the same number of variationDetails but empty values
    const newVariation = {
      variationProductId: null,
      sku: "",
      unitPrice: "",
      variationDetails: lastVariation
        ? lastVariation.variationDetails.map((detail) => ({
            variationTypeId: detail.variationTypeId, // Keep the type (variationTypeId)
            variationTypeName: detail.variationTypeName,
            variationValue: "", // Set empty value for new textboxes
          }))
        : [], // If no previous variation, initialize with empty array
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
        // Check if this variation already has the selected type
        const existingVariationType = ingredient.variationDetails.find(
          (detail) => detail.variationTypeId === variationType.value
        );

        if (existingVariationType) {
          return ingredient; // If the variation type already exists, don't add it again
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

  // Handle variation removal by index
  const handleRemoveVariation = (variationProductId, index) => {
    setVariations((prevVariations) =>
      prevVariations.filter((_, i) => i !== index)
    );
  };

  // Removing a variation type from a specific variation
  const handleRemoveVariationType = (variationTypeId) => {
    // Loop through each variation and update the variationDetails
    const updatedVariations = variations.map((item) => {
      // Parse variationDetails from string to array
      const variationDetails = item.variationDetails;

      // Filter out the variation type with the specified ID
      const updatedVariationDetails = variationDetails.filter(
        (detail) => detail.variationTypeId !== variationTypeId
      );

      return {
        ...item,
        variationDetails: updatedVariationDetails,
      };
    });

    setVariations(updatedVariations);
  };

  // Function to handle variation change by index
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
                : [], // Fallback to an empty array if variationDetails is not defined
            }
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
          ? "When checked, this item is treated as a countable (qty) product, suitable for physical goods."
          : "When unchecked, this item is considered a service. Ideal for services like installation or consultation.";
      case "isNotForSelling":
        return isNotForSelling
          ? "This item will be marked as 'Not for Sale' and won't appear in sales transactions, perfect for internal use items."
          : "This item is available for sale. Use this for products you sell regularly.";
      case "isUnique":
        return isUnique
          ? "Marking as 'Unique' means this is a one-of-a-kind item, useful for products with single availability."
          : "Not unique; this item can be restocked and sold in multiples.";
      case "isStockTracked":
        return isStockTracked
          ? "When checked, this item is tracked in inventory with stock levels. Inventory will automatically update as sales are made."
          : "Inventory will not auto-update upon sales. Use for items you manage manually or occasionally.";
      default:
        return "";
    }
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
    <>
      <div className="container mx-auto p-4 lg:px-8 xl:px-16 2xl:px-24">
        <div className="flex justify-center lg:col-span-3">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">
              {saveType === SAVE_TYPE.ADD ? "Add Product" : "Update Product"}
            </h2>
          </div>
        </div>
        {/* {JSON.stringify({ imageUrl })}
        {JSON.stringify({ previewUrl })} */}
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Product Number with Auto Generate Checkbox */}
          {/* <div className="flex flex-col">
            <label className="label">
              <span className="label-text text-lg">{productNo.label}</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                className="input input-bordered flex-1"
                disabled={
                  !autoGenerateProductNo && saveType === SAVE_TYPE.UPDATE
                }
                value={productNo.value}
                onChange={(e) =>
                  handleInputChange(setProductNo, productNo, e.target.value)
                }
              />
              <div className="flex items-center ml-2">
                <input
                  type="checkbox"
                  id="autoGenerate"
                  className="checkbox checkbox-primary"
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
          </div> */}

          <InputField
            label={productName.label}
            value={productName.value}
            onChange={(e) =>
              handleInputChange(setProductName, productName, e.target.value)
            }
            validationMessages={validationMessages(productName)}
            placeholder="Enter product name"
          />

          <div className="flex flex-col">
            <label className="label">
              <span className="label-text text-lg">
                {measurementUnit.label}
              </span>
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

          {/* Brand */}
          <div className="flex flex-col">
            <label className="label">
              <span className="label-text text-lg">{brand.label}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={brand.value}
              onChange={(e) =>
                handleInputChange(setBrand, brand, e.target.value)
              }
            >
              <option value="" disabled>
                Select Brand
              </option>
              {brandOptions.map((option) => (
                <option key={option.id} value={option.id} className="text-lg">
                  {option.displayName}
                </option>
              ))}
            </select>
            {validationMessages(brand)}
          </div>

          {/* Product Category */}
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="label">
                  <span className="label-text text-lg">
                    {productCategory.label}
                  </span>
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

                  <GhostButton
                    onClick={() => {
                      if (
                        selectedCategory &&
                        !selectedCategories.includes(selectedCategory)
                      ) {
                        setSelectedCategories([
                          ...selectedCategories,
                          parseInt(selectedCategory),
                        ]);
                        setSelectedCategory("");
                      }
                    }}
                    disabled={selectedCategory === ""}
                    iconClass="pi pi-plus-circle text-lg"
                    labelClass="text-md font-normal"
                    label="Add"
                    color="text-blue-500"
                    hoverClass="hover:text-blue-700 hover:bg-transparent"
                  />
                </div>
              </div>

              {/* Selected Categories */}
              <div className="col-span-2 flex flex-col">
                <label className="label">
                  {/* <span className="label-text text-lg">Selected Categories</span> */}
                </label>
                <div className="flex flex-wrap gap-2 mt-6">
                  {categoryOptions.length > 0 &&
                    selectedCategories?.map((categoryId, index) => {
                      const category = categoryOptions.find(
                        (opt) => opt.id === parseInt(categoryId)
                      );
                      return (
                        <CategoryItem
                          key={categoryId}
                          category={category}
                          onClick={() =>
                            setSelectedCategories(
                              selectedCategories.filter(
                                (id) => id !== categoryId
                              )
                            )
                          }
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Reorder Level */}
          <InputField
            label={reorderLevel.label}
            value={reorderLevel.value}
            onChange={(e) =>
              handleInputChange(setReorderLevel, reorderLevel, e.target.value)
            }
            validationMessages={validationMessages(reorderLevel)}
            placeholder="Enter Reorder Level"
          />

          <div className="grid grid-cols-3 col-span-3 gap-10">
            <div className="flex flex-col gap-1">
              <div className="flex gap-5 items-center">
                <input
                  type="checkbox"
                  id="autoDeductInventory"
                  className="checkbox checkbox-primary"
                  onChange={(e) => setIsProductItem(e.target.checked)}
                  checked={isProductItem}
                />
                <label htmlFor="autoDeductInventory">Product Item</label>
              </div>
              <p className="text-gray-500">{getInstruction("isProductItem")}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex gap-5 items-center">
                <input
                  type="checkbox"
                  id="isNotForSelling"
                  className="checkbox checkbox-primary"
                  onChange={(e) => setIsNotForSelling(e.target.checked)}
                  checked={isNotForSelling}
                />
                <label htmlFor="isNotForSelling">Not For Selling</label>
              </div>
              <p className="text-gray-500">
                {getInstruction("isNotForSelling")}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex gap-5 items-center">
                <input
                  type="checkbox"
                  id="isUnique"
                  className="checkbox checkbox-primary"
                  onChange={(e) => setIsUnique(e.target.checked)}
                  checked={isUnique}
                />
                <label htmlFor="isUnique">Unique</label>
              </div>
              <p className="text-gray-500">{getInstruction("isUnique")}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex gap-5 items-center">
                <input
                  type="checkbox"
                  id="isStockTracked"
                  className="checkbox checkbox-primary"
                  onChange={(e) => setIsStockTracked(e.target.checked)}
                  checked={isStockTracked}
                  disabled={!isProductItem}
                />
                <label htmlFor="isStockTracked">Stock Tracked</label>
              </div>
              <p className="text-gray-500">
                {getInstruction("isStockTracked")}
              </p>
            </div>

            <div className="flex gap-5 items-center mt-10 justify-center">
              <input
                type="checkbox"
                id="isExpiringProduct"
                className="checkbox checkbox-primary"
                onChange={(e) => setIsExpiringProduct(e.target.checked)}
                checked={isExpiringProduct}
              />
              <label htmlFor="isExpiringProduct">Expiring Product</label>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="label">
              <span className="label-text text-lg">{productType.label}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={productType.value}
              onChange={(e) =>
                handleInputChange(setProductType, productType, e.target.value)
              }
              disabled={saveType === SAVE_TYPE.UPDATE}
            >
              {productTypeOptions.map((option) => (
                <option key={option.id} value={option.id} className="text-lg">
                  {option.displayName}
                </option>
              ))}
            </select>
            {validationMessages(productType)}
          </div>

          <div className="flex flex-col col-span-2 bg-red">
            <StoresComponent stores={stores} setStores={setStoresHandler} />
          </div>

          {productType.value == "1" && (
            <>
              <InputField
                label={sku.label}
                value={sku.value}
                onChange={(e) => handleInputChange(setSku, sku, e.target.value)}
                validationMessages={validationMessages(sku)}
                placeholder="Enter SKU"
              />

              <InputField
                label={barcode.label}
                value={barcode.value}
                onChange={(e) =>
                  handleInputChange(setBarcode, barcode, e.target.value)
                }
                validationMessages={validationMessages(barcode)}
                placeholder="Enter Barcode"
              />
              <InputField
                label={unitCost.label}
                value={unitCost.value}
                onChange={(e) =>
                  handleInputChange(setUnitCost, unitCost, e.target.value)
                }
                validationMessages={validationMessages(unitCost)}
                placeholder="Enter unitCost"
              />

              <InputField
                label={unitPrice.label}
                value={unitPrice.value}
                onChange={(e) =>
                  handleInputChange(setUnitPrice, unitPrice, e.target.value)
                }
                validationMessages={validationMessages(unitPrice)}
                placeholder="Enter UnitPrice"
              />

              {/* Tax Rate */}
              <InputField
                label={taxRatePerc.label}
                value={taxRatePerc.value}
                onChange={(e) =>
                  handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value)
                }
                validationMessages={validationMessages(taxRatePerc)}
                placeholder="Enter Tax Perc"
              />
            </>
          )}

          {productType.value == "2" && (
            <div className="flex flex-col col-span-3">
              <div className="bg-[#ffffff] p-6 rounded-md">
                <h3 className="text-center font-bold pb-5">Variations</h3>

                {/* Grid container for form inputs */}
                <div className="grid grid-cols-6 gap-6 mb-4">
                  <div className="col-span-3 flex">
                    <button
                      type="button"
                      className="btn btn-primary self-end"
                      onClick={handleNewAddVariation}
                    >
                      Add Variation
                    </button>
                  </div>

                  <div className="flex-col items-center"></div>
                  <div className="col-span-2 flex items-center gap-4">
                    <div className="flex flex-col space-y-2 w-full">
                      <label className="text-[1rem]">Variation Type</label>
                      <select
                        className="select select-bordered w-full"
                        value={variationType.value}
                        onChange={(e) =>
                          handleInputChange(
                            setVariationType,
                            variationType,
                            e.target.value
                          )
                        }
                      >
                        {variationTypeOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.displayName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary self-end"
                      onClick={async () => {
                        handleAddVariation();
                      }}
                    >
                      Add Variation Type
                    </button>
                  </div>
                </div>

                <table className="table border-collapse w-full">
                  <thead className="sticky top-0 bg-base-100 z-10 text-sm border-b">
                    <tr>
                      <th className="px-4 py-2">SKU</th>
                      <th className="px-4 py-2">Barcode</th>
                      <th className="px-4 py-2">Unit Cost</th>
                      <th className="px-4 py-2">Unit Price</th>
                      <th className="px-4 py-2">Tax(%)</th>
                      {variations[0]?.variationDetails &&
                        variations[0].variationDetails.map((c) => (
                          <th key={c.variationTypeId} className="px-4 py-2">
                            <span>{c.variationTypeName}</span>
                            <button
                              type="button"
                              className="btn text-error btn-xs ml-2"
                              onClick={() =>
                                handleRemoveVariationType(c.variationTypeId)
                              }
                              aria-label="Remove Variation Type"
                              title="Remove Variation Type"
                            >
                              <FontAwesomeIcon icon={faClose} />
                            </button>
                          </th>
                        ))}
                      <th className="px-4 py-2"></th>{" "}
                      {/* Extra cell for Remove button */}
                    </tr>
                  </thead>

                  <tbody>
                    {variations.map((variation, index) => (
                      <tr key={variation.variationProductId}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="input input-bordered w-full text-sm"
                            value={variation.sku}
                            onChange={(e) => {
                              const updatedSku = e.target.value;
                              setVariations((prevVariations) =>
                                prevVariations.map((item, i) =>
                                  i === index
                                    ? { ...item, sku: updatedSku }
                                    : item
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="input input-bordered w-full text-sm"
                            value={variation.barcode}
                            onChange={(e) => {
                              const updatedBarcode = e.target.value;
                              setVariations((prevVariations) =>
                                prevVariations.map((item, i) =>
                                  i === index
                                    ? { ...item, barcode: updatedBarcode }
                                    : item
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="input input-bordered w-full text-sm"
                            value={variation.unitCost}
                            onChange={(e) => {
                              const updatedUnitCost = e.target.value;
                              setVariations((prevVariations) =>
                                prevVariations.map((item, i) =>
                                  i === index
                                    ? { ...item, unitCost: updatedUnitCost }
                                    : item
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="input input-bordered w-full text-sm"
                            value={variation.unitPrice}
                            onChange={(e) => {
                              const updatedUnitPrice = e.target.value;
                              setVariations((prevVariations) =>
                                prevVariations.map((item, i) =>
                                  i === index
                                    ? { ...item, unitPrice: updatedUnitPrice }
                                    : item
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="input input-bordered w-full text-sm"
                            value={variation.taxPerc}
                            onChange={(e) => {
                              const updatedTaxPerc = e.target.value;
                              setVariations((prevVariations) =>
                                prevVariations.map((item, i) =>
                                  i === index
                                    ? { ...item, taxPerc: updatedTaxPerc }
                                    : item
                                )
                              );
                            }}
                          />
                        </td>

                        {variation.variationDetails &&
                          variation.variationDetails.map((detail) => (
                            <td
                              key={detail.variationTypeId}
                              className="px-4 py-2"
                            >
                              <input
                                type="text"
                                className="input input-bordered w-full text-sm"
                                value={detail.variationValue}
                                onChange={(e) => {
                                  const updatedValue = e.target.value;
                                  handleVariationChange(
                                    updatedValue,
                                    index,
                                    detail.variationTypeId
                                  );
                                }}
                              />
                            </td>
                          ))}

                        {/* Add Remove button for each variation row */}
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            className="btn text-error btn-xs"
                            onClick={() =>
                              handleRemoveVariation(
                                variation.variationProductId,
                                index
                              )
                            }
                            aria-label="Remove Variation Row"
                            title="Remove Variation Row"
                          >
                            <FontAwesomeIcon icon={faClose} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {productType.value == "3" && (
            <>
              <InputField
                label={sku.label}
                value={sku.value}
                onChange={(e) => handleInputChange(setSku, sku, e.target.value)}
                validationMessages={validationMessages(sku)}
                placeholder="Enter SKU"
              />

              <InputField
                label={barcode.label}
                value={barcode.value}
                onChange={(e) =>
                  handleInputChange(setBarcode, barcode, e.target.value)
                }
                validationMessages={validationMessages(barcode)}
                placeholder="Enter Barcode"
              />
              <InputField
                label={unitCost.label}
                value={unitCost.value}
                onChange={(e) =>
                  handleInputChange(setUnitCost, unitCost, e.target.value)
                }
                validationMessages={validationMessages(unitCost)}
                placeholder="Enter unitCost"
              />

              <InputField
                label={unitPrice.label}
                value={unitPrice.value}
                onChange={(e) =>
                  handleInputChange(setUnitPrice, unitPrice, e.target.value)
                }
                validationMessages={validationMessages(unitPrice)}
                placeholder="Enter Unit Price"
              />

              {/* Tax Rate */}
              <InputField
                label={taxRatePerc.label}
                value={taxRatePerc.value}
                onChange={(e) =>
                  handleInputChange(setTaxRatePerc, taxRatePerc, e.target.value)
                }
                validationMessages={validationMessages(taxRatePerc)}
                placeholder="Enter Tax Perc"
              />

              <div className="col-span-2 mt-4">
                <h3 className="text-center font-bold">Combo Ingredients</h3>
                <div className="flex justify-start gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="label">
                      <span className="label-text">
                        {comboIngrednentSku.label}
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={comboIngrednentSku.value}
                      onChange={(e) =>
                        handleInputChange(
                          setComboIngrednentSku,
                          comboIngrednentSku,
                          e.target.value
                        )
                      }
                    />
                    {validationMessages(comboIngrednentSku)}
                  </div>

                  <div className="flex flex-col">
                    <label className="label">
                      <span className="label-text">
                        {comboIngrednentQty.label}
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={comboIngrednentQty.value}
                      onChange={(e) =>
                        handleInputChange(
                          setComboIngrednentQty,
                          comboIngrednentQty,
                          e.target.value
                        )
                      }
                    />
                    {validationMessages(comboIngrednentQty)}
                  </div>

                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={async () => {
                        const filteredData = {
                          productId: null,
                          productNo: null,
                          productName: null,
                          sku: comboIngrednentSku.value,
                          barcode: null,
                          brandId: null, //1-none
                          storeId: 1,
                          productTypeIds: [],
                          productCategoryId: null,
                          measurementUnitId: null,
                          searchByKeyword: false,
                          skip: 0,
                          limit: 1,
                        };

                        const _result = await getProducts(filteredData);
                        const product = _result.data.results[0][0];
                        if (!product) {
                          showToast(
                            "danger",
                            "Exception",
                            "Product not found."
                          );
                          return;
                        }

                        const _comboIngredents = {
                          measurementUnitName: product.measurementUnitName,
                          productId: product.productId,
                          productId_mat:
                            product.productTypeId === 1
                              ? product.productId
                              : product.productTypeId === 2
                              ? product.variationProductId
                              : null,
                          productName: product.productName,
                          productTypeId: product.productTypeId,
                          productTypeName: product.productTypeName,
                          sku: product.sku,
                          qty: comboIngrednentQty.value,
                        };
                        const existingComboIngre = [...comboIngredients];

                        if (
                          existingComboIngre.find((i) => i.sku === product.sku)
                        ) {
                          showToast(
                            "danger",
                            "Exception",
                            "The Product already exists."
                          );
                          return;
                        }

                        existingComboIngre.push(_comboIngredents);
                        console.log("existingComboIngre ", existingComboIngre);
                        setComboIngredients(existingComboIngre);
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-2">
                  <table className="table  border-collapse">
                    <thead className="sticky top-0 bg-base-100 z-10 text-[1rem] border-b border-gray-300">
                      <tr>
                        {/* <th>Product ID (Mat)</th> */}
                        <th className="px-4 py-2">Product Name</th>
                        <th className="px-4 py-2">Product Type</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {JSON.stringify(comboIngredients)} */}
                      {comboIngredients.map((item) => (
                        <tr
                          key={item.productId}
                          className={` hover:bg-gray-100 text-[1rem]`}
                        >
                          {/* <td>{item.productId}</td> */}
                          <td className="px-4 py-2">{item.productName}</td>
                          <td className="px-4 py-2">{item.productTypeName}</td>
                          <td className="px-4 py-2">{item.sku}</td>
                          <td className="px-4 py-2">
                            {item.qty} {item.measurementUnitName}
                          </td>

                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              <button
                                className="btn btn-error btn-xs bg-[#f87171] text-base-100 "
                                onClick={async () => {
                                  const updatedExtraDetails =
                                    comboIngredients.filter(
                                      (c) => c.productId !== item.productId
                                    );
                                  setComboIngredients(updatedExtraDetails);
                                }}
                                aria-label="Delete"
                                title="Delete Product"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-4 p-4 border-dashed shadow-sm">
            {/* File Input */}
            <label className="flex flex-col items-center cursor-pointer">
              <span className="mb-2 text-sm font-medium text-gray-700">
                Upload an Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex items-center justify-center w-40 h-12 btn-primary text-white text-sm font-medium rounded-lgtransition">
                Choose File
              </div>
            </label>

            {isFileSelectLoading ? (
              <div className="w-full max-w-md text-center">
                <div className="relative overflow-hidden rounded-lg">
                  <span className="loading loading-spinner loading-lg text-info"></span>
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

          {/* {JSON.stringify(uploadResponse, null, 2)} */}
          <div className="flex justify-center mt-20 mb-10 col-span-full">
            <button
              className={`btn btn-primary w-56 ${
                isSubmitting ? "loading" : ""
              }`}
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
        </form>
      </div>
    </>
  );
}
