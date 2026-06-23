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
import { FaTrash, FaPlus } from "react-icons/fa";
import CheckBox from "../inputField/CheckBox";

const CategoryItem = ({ onClick, category }) => {
  return (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
      <span className="text-gray-800 font-medium pr-1">{category.displayName} </span>
     <FaTrash  className="text-red-500 hover:text-red-700 cursor-pointer"  onClick={onClick} />
      {/* <FontAwesomeIcon
        icon={faTrash}
        className="text-red-500 hover:text-red-700 cursor-pointer"
        onClick={onClick}
      /> */}
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
    const [isBatchTracked, setIsBatchTracked] = useState({ value: false });
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
  //const [imageHash, setImageHash] = useState("");
  const [storesOptions, setStoresOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);






  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsFileSelectLoading(true);
      const response = await uploadImageResized(file);
      setUploadResponse(response);
      setPreviewHash(response.hash);
      setIsFileSelectLoading(false);

if(imageHash0){
      setImageHashRemoved(imageHash0);
      }

    }
  };

const handleRemoveImage = () => {
  setPreviewHash(null);
  setUploadResponse(null);
  setImageHashRemoved(imageHash0);
  setImageHash(null);

  // Clear the file input
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
      variationDetails: [], // Important: start empty so user can add Size/Color
      isAssemblyProduct: false,
      subProductsList: [],
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
       isStockTracked:null,
       isExpiringProduct:null,
       isBatchTracked:null,

      searchByKeyword: false,
      skip: 0,
      limit: 1,
    });

    console.log('loadValuesForUpdate:',res);
    const {
      categories,
      measurementUnitId,
      productName,
      reorderLevel,
      brandId,
      productTypeId,
      isStockTracked,
      isProductItem,
      isAssemblyProduct,
      isUnique,
      isNotForSelling,
      imageUrl,
      isExpiringProduct,
      allProductId,
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
    setIsNotForSelling(isNotForSelling);

    setImageHash(imageUrl);
    console.log('lllimageUrllll:',imageUrl)
  //   if(imageHash){
  //   setPreviewHash(imageHash);
  // }

   setIsAssemblyProduct((prev) => ({ ...prev, value: isAssemblyProduct===1 }));
   setIsStockTracked((prev) => ({ ...prev, value: isStockTracked===1, isDisabled: false }));
   setIsBatchTracked((prev) => ({ ...prev, value: isBatchTracked===1, isDisabled: false }));
    setSubProductsList([]);
    const details = await getProductExtraDetails(id);

    if (productTypeId === 1) {
   
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
      // const _comboIngredients = [...comboIngredients];
      // const _prepaired_comboIngredients = _comboIngredients.map((item) => ({
      //   barcode: item.barcode,
      //   measurementUnitName: item.measurementUnitName,
      //   productId: item.productId,
      //   productId_mat: item.productTypeId === 1 ? item.productId_mat : null,
      //   variationProductId_mat: item.productTypeId === 2 ? item.productId_mat : null,
      //   productName: item.productName,
      //   productTypeId: item.productTypeId,
      //   productTypeName: item.productTypeName,
      //   qty: item.qty,
      //   sku: item.sku,
      // }));
      const _subProductsList = subProductsList.map((item) => ({
        qty: item.qty,
        allProductId: item.allProductId,
      }));

      const payLoad = {
        tableId: null,
       // productNo: productNo.value,
        productTypeId: parseInt(productType.value),
        storeIdList: stores,
       // isProductNoAutoGenerate: autoGenerateProductNo,
        productName: productName.value,
        categoryIdList: selectedCategories,
        variationProductList: _variations,
      //  comboProductDetailList: _prepaired_comboIngredients,
        subProductsList: _subProductsList,
        measurementUnitId: measurementUnit.value,
        isNotForSelling: isNotForSelling,
        imgUrl: uploadResponse?.hash || imageHash0,
        isUnique: isUnique,
        isStockTracked: isStockTracked.value,
        isProductItem: isProductItem,
        isAssemblyProduct: isAssemblyProduct.value,
        isBatchTracked:isBatchTracked.value,
        brandId: brand.value,
     //   unitCost: isNumeric(unitCost.value) ? unitCost.value : null,
      //  unitPrice: isNumeric(unitPrice.value) ? unitPrice.value : null,
      //  taxPerc: isNumeric(taxRatePerc.value) ? taxRatePerc.value : null,
      //  sku: sku.value,
      //  barcode: barcode.value === '' ? null : barcode.value,
        reorderLevel: reorderLevel.value ? reorderLevel.value : null,
        isExpiringProduct: isExpiringProduct,
      };
      setIsSubmitting(true);
      if (saveType === SAVE_TYPE.ADD) {
        const res = await addProduct(payLoad);

        console.log('res',res.data.outputValues);
   
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
            try{
            await markFileAsTobeDeleted(imageHashRemoved);
            setImageHashRemoved(null);
            }
            catch(err){
              console.log('error:',err);
            }
          }

          if (uploadResponse) {
            await commitFile(uploadResponse.hash);
          }
          await loadValuesForUpdate();
          showToast("success", "Success", outputMessage);
        
      } else {
        showToast("danger", "Exception", "Invalid Save type");
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("payloadd", error);
    }
  };

// Add this state to track if we've already initialized variations
const [hasInitializedVariations, setHasInitializedVariations] = useState(false);

useEffect(() => {
  // Only run once, and only if we're dealing with variation product (type 2)
  // and no variations exist yet
  if (
    !hasInitializedVariations &&
    productType.value === "2" &&
    variations.length === 0
  ) {
    // Create a fresh empty variation with empty variationDetails array
    const initialVariation = {
      variationProductId: null,
      sku: "",
      barcode: "",
      unitCost: "",
      unitPrice: "",
      taxPerc: "",
      variationDetails: [], // Important: start empty so user can add Size/Color
      isAssemblyProduct: false,
      subProductsList: [],
    };

    setVariations([initialVariation]);
    setHasInitializedVariations(true); // Prevent future runs
  }
}, [productType.value, variations.length, hasInitializedVariations]);


  // const handleNewAddVariation = () => {
  //   const lastVariation = variations[variations.length - 1];
  //   console.log('handle variations :',lastVariation)
  //   const newVariation = {
  //     variationProductId: null,
  //     sku: "",
  //     barcode: "",
  //     unitCost: "",
  //     unitPrice: "",
  //     taxPerc: "",
  //     variationDetails: lastVariation
  //       ? lastVariation.variationDetails?.map((detail) => ({
  //           variationTypeId: detail.variationTypeId,
  //           variationTypeName: detail.variationTypeName,
  //           variationValue: "",
  //         }))
  //       : [],
  //     isAssemblyProduct: false,
  //     subProductsList: [],
  //   };
  //   setVariations((prevVariations) => [...prevVariations, newVariation]);
  // };



const handleNewAddVariation = () => {
  const lastVariation = variations[variations.length - 1];

  // Copy variation types from the last variation (e.g., Size, Color)
  const copiedVariationDetails = lastVariation?.variationDetails?.map(detail => ({
    variationTypeId: detail.variationTypeId,
    variationTypeName: detail.variationTypeName,
    variationValue: "", // Clear value for new row
  })) || [];

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
  };

  setVariations(prev => [...prev, newVariation]);
};

  // const handleAddVariation = () => {
  //   if (!variationType.value) {
  //     alert("Please select a valid variation type");
  //     return;
  //   }
  //   setVariations((prevIngredients) =>
  //     prevIngredients.map((ingredient) => {
  //       const existingVariationType = ingredient.variationDetails?.find(
  //         (detail) => detail.variationTypeId === variationType.value
  //       );
  //       if (existingVariationType) {
  //         return ingredient;
  //       }
  //       return {
  //         ...ingredient,
  //         variationDetails: [
  //           ...ingredient.variationDetails,
  //           {
  //             variationTypeId: variationType.value,
  //             variationTypeName: variationTypeOptions.find(
  //               (o) => o.id == variationType.value
  //             )?.displayName,
  //             variationValue: "",
  //           },
  //         ],
  //       };
  //     })
  //   );
  // };

  const handleAddVariation = () => {
  if (!variationType.value) {
    alert("Please select a valid variation type");
    return;
  }

  setVariations((prevIngredients) =>
    prevIngredients.map((ingredient) => {
      // Ensure variationDetails is always an array
      const variationDetails = ingredient.variationDetails || [];

      // Check if the variation type already exists
      const existingVariationType = variationDetails.find(
        (detail) => detail.variationTypeId === variationType.value
      );

      if (existingVariationType) {
        return ingredient; // no duplicate variation type
      }

      return {
        ...ingredient,
        variationDetails: [
          ...variationDetails, // safe now
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

  // const getInstruction = (key) => {
  //   switch (key) {
  //     case "isProductItem":
  //       return isProductItem
  //         ? "Uncheck this if the item is a service, like installation or consulting."
  //         : "Check this if the item is a physical product you can count, like goods.";
  //     case "isNotForSelling":
  //       return isNotForSelling
  //         ? "Uncheck this to make the item available for sale to customers."
  //         : "Check this to mark the item as 'Not for Sale' for internal use only.";
  //     case "isUnique":
  //       return isUnique
  //         ? "Check this for one-of-a-kind items that can't be restocked."
  //         : "Uncheck this for items you can restock and sell multiple times.";
  //     case "isStockTracked":
  //       return isStockTracked.value
  //         ? "Uncheck this to manually manage stock. Inventory won't update automatically on sales."
  //         : "Check this to automatically keep track of how many you have in stock. When you sell one, the count goes down.";
  //     case "isAssemblyProduct":
  //       return isAssemblyProduct
  //         ? "Uncheck this if the item is a standalone product, not made from others."
  //         : "Check this if the item is made from other products (an assembly).";
  //     case "isExpiringProduct":
  //       return isExpiringProduct
  //         ? "Uncheck this if the item doesn't expire, like tools or clothes."
  //         : "Check this if the item has an expiration date, like food or medicine.";
  //     case "isExpiringProduct":
  //       return isBatchTracked.value
  //         ? "Uncheck this if the item doesn't expire, like tools or clothes."
  //         : "Check this if the item has an expiration date, like food or medicine.";
  //     default:
  //       return "";
  //   }
  // };

const getInstruction = (key) => {
  switch (key) {
    case "isProductItem":
      return "Turn this on for physical items you can count (like goods). Turn it off for services (like installation or repairs).";
      
    case "isNotForSelling":
      return "Hide this item from the sales screen. Use this for internal store supplies, raw materials, or business assets.";
      
    case "isUnique":
      return "Use this for one-of-a-kind items with unique IDs that cannot be duplicated or restocked under the same code.";
      
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
              {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">General Information</h3> */}
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
     
                {/* <div className="flex flex-col">
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
                </div> */}
                {/* <StoresComponent stores={stores} setStores={setStoresHandler} /> */}
              </div>
            </div>
            {/* Category Section */}
            <div className="p-4">
              {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3> */}
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
              {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Options</h3> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <CheckBox onChange={(e) => setIsProductItem(e.target.checked)}  checked={isProductItem} 
                  label="Product Item" />
                  <p className="text-gray-500">{getInstruction("isProductItem")}</p>
                </div>
                {/* <div className="flex flex-col gap-1">
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
                </div> */}
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
            {/* Sub-Products Section (Assembly Product) */}
            {isAssemblyProduct.value && variations?.length===1 ? (
              <SubProductList
                subProductsList={subProductsList}
                setSubProductsList={setSubProductsList}
              />
            ) : null}

   
            {/* Product Details Section (for Product Type 1 and 3) */}
            {/* {variations?.length === 1 && (
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                   <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
           
   <div className="flex flex-col justify-between">
                    <label className=" font-medium text-gray-700 mb-2 block"></label>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                      onClick={handleNewAddVariation}
                    >
                      <FaPlus />
    
                      New Variation
                  </button>
                  </div>
</div>

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
            )} */}

            {/* Variations Section (Product Type 2) */}
            {/* {variations?.length > 1 && ( */}
              <div className="p-6 rounded-lg">
           



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
                        <FaPlus />
                        {/* <FontAwesomeIcon icon={faPlus} /> */}
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
                      <FaPlus />
                      {/* <FontAwesomeIcon icon={faPlus} /> */}
                      New Variation
                  </button>
                  </div>

                </div>
            <div className="overflow-x-auto rounded-3xl border-2 border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Barcode</th>
                        <th className="px-4 py-3 text-left">Unit Cost</th>
                        <th className="px-4 py-3 text-left">Unit Price</th>
                        <th className="px-4 py-3 text-left">Tax (%)</th>
                        {/* <th className="px-4 py-3 text-left">Assembly Product</th> */}
                        {variations[0]?.variationDetails &&
                          variations[0].variationDetails.map((c) => (
                                  <th key={c.variationTypeId} className="px-8 py-6 text-left text-lg font-bold text-gray-700">
                              <div className="flex items-center gap-2">
                                <span>{c.variationTypeName}</span>
                                <button
                                  type="button"
                                  className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-200"
                                  onClick={() => handleRemoveVariationType(c.variationTypeId)}
                                  aria-label={`Remove ${c.variationTypeName} Type`}
                                  title={`Remove ${c.variationTypeName} Type`}
                                >
                                  <FaTrash className="text-sm"/>
                                  {/* <FontAwesomeIcon icon={faClose} size="sm" /> */}
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
                                <FaTrash className="text-sm" />
                                {/* <FontAwesomeIcon icon={faClose} size="sm" /> */}
                              </button>
                            </td>
                          </tr>
                          {isAssemblyProduct.value && variations?.length>=1 && (
                            <tr className="border-b ">
                      
                              <td colSpan={variation.variationDetails?.length + 7} className="px-20 pb-10">
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
            {/* // )} */}

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
          <div className="overflow-x-auto rounded-3xl border-2 border-gray-200">
                  <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
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
                              <FaTrash />
                              {/* <FontAwesomeIcon icon={faTrash} /> */}
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
            {/* <div className="bg-gray-50 p-6 rounded-md shadow-sm">
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
            </div> */}

{/* Enhanced Image Upload Section */}
<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
  <h3 className="text-xl font-semibold text-gray-800 mb-6">Product Image</h3>

  <div className="flex flex-col items-center justify-center">
    {/* {JSON.stringify(previewUrl)}
      {JSON.stringify(imageHash0)} */}
    
    {/* Image Preview Area */}
    {(imageHash0 || previewUrl) ? (
    <div className="relative group w-full max-w-sm">

  <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-dashed border-gray-300 bg-gray-50">
    <img
      src={`${process.env.REACT_APP_API_CDN}/${previewUrl || imageHash0}?width=300&height=300&quality=85`}
      alt="Product preview"
      className="w-full h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
    />

    {/* Hover Overlay - "Change Image" */}
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

  {/* Small Remove (X) Button in Corner */}
  <button
    type="button"
    onClick={handleRemoveImage}
    className="absolute top-3 right-3 p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-20 opacity-90 hover:opacity-100"
    aria-label="Remove image"
    title="Remove image"
  >
    <FaTrash className="text-sm" />
  </button>

  {/* Hidden File Input (triggered by label above) */}
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
</div>
    ) : (
      /* Upload Placeholder */
      <div className="w-full max-w-sm">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
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

    {/* Optional: Show file name or status below */}
    {uploadResponse && previewUrl && !isFileSelectLoading && (
      <p className="mt-4 text-sm text-green-600 font-medium flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Image uploaded successfully
      </p>
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