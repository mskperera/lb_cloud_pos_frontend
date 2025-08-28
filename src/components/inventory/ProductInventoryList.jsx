import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import {
  deleteProduct,
  getProductExtraDetails,
  getProducts,
} from "../../functions/register";
import { useToast } from "../useToast";
import {
  getDropdownMeasurementUnit,
  getDrpdownCategory,
  getStoresDrp,
} from "../../functions/dropdowns";
import { validate } from "../../utils/formValidation";
import FormElementMessage from "../messges/FormElementMessage";
import DaisyUIPaginator from "../DaisyUIPaginator";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { getStockInfo } from "../../functions/stockEntry";
import ProductVariationDetails from "./ProductVariationDetails";
import GhostButton from "../iconButtons/GhostButton";

const ProductDetails = ({ selectedProduct, confirmDelete }) => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singleProductSkuBarcodes, setSingleProductSkuBarcodes] = useState([]);
  const [variationProductSkuBarcodes, setVariationProductSkuBarcodes] =
    useState([]);
  const [comboProductDetails, setComboProductDetails] = useState([]);
  const navigate = useNavigate();
  const [productTypeId, setProductTypeId] = useState("");

  const [stockInfo, setStockInfo] = useState([]);

  const loadDetails = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const details = await getProductExtraDetails(selectedProduct.productId);
      // setExtraDetails(details);
      const stores = details.data.results[1];
      const productSkuBarcodes = details.data.results[0];

      console.log("stores", stores);
      console.log("singleProductSkuBarcodes", singleProductSkuBarcodes);
      const productTypeId = details?.data?.outputValues?.productTypeId;
      setProductTypeId(productTypeId);
      console.log("productTypeId", productTypeId);

      // setVariations(details.data.results[0])
      //   setStores(details.data.results[1]);
      setCategories(JSON.parse(selectedProduct.categories));
      setStores(stores);

      if (productTypeId == 1) {
        setSingleProductSkuBarcodes(productSkuBarcodes[0]);

        const stockInfoRes = await getStockInfo(selectedProduct.inventoryId);
        const stockInfo = stockInfoRes.data;
        console.log("stockInfo", stockInfo);
        setStockInfo(stockInfoRes.data); // Set stock info here
      } else if (productTypeId == 2) {
        const parsedVariations = productSkuBarcodes.map((variation) => ({
          ...variation,
          variationDetails:
            typeof variation.variationDetails === "string"
              ? JSON.parse(variation.variationDetails)
              : variation.variationDetails,
        }));

        setVariationProductSkuBarcodes(parsedVariations);

        const stockInfoRes = await getStockInfo(selectedProduct.inventoryId);
        const stockInfo = stockInfoRes.data;
        console.log("stockInfo", stockInfo);
        setStockInfo(stockInfoRes.data); // Set stock info here
      } else if (productTypeId == 3) {
        setComboProductDetails(productSkuBarcodes);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [selectedProduct]);

  const renderExtraDetails = () => {
    if (loading) {
      return <div>Loading...</div>; // Show loading message
    }
    return (
      <div className="grid grid-cols-4">
        <div className="flex flex-col gap-4 col-span-2">
          <div className="flex gap-4 align-middle">
            <p className="text-lg mt-2">Categories </p>
            <div className="flex gap-1 mt-2">
              {categories?.map((c) => (
                <>
                  <span
                    key={c.id}
                    className="badge badge-primary p-4 bg-green-500 border-none text-white mr-1"
                  >
                    {c.displayName}
                  </span>{" "}
                  {"/"}
                </>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="label">Last Modified</label>
            <p className=" p-2">
              {formatUtcToLocal(selectedProduct.modifiedDate_UTC)}
            </p>
          </div>
        </div>
        <div className="col-span-2 flex justify-end gap-5">
          {/* Inventory History View */}
          {/* View Transactional History */}
          <GhostButton
            onClick={() =>
              navigate(
                `/inventory/transactionHistory?inventoryId=${selectedProduct.inventoryId}&prodN=${selectedProduct.productName}&qty=${selectedProduct.stockQty}&measU=${selectedProduct.measurementUnitName}&sku=${selectedProduct.sku}&prodNo=${selectedProduct.productNo}`
              )
            }
            iconClass="pi pi-history"
            label="View History"
            tooltip="View all transactional history"
            color="text-blue-500"
            hoverClass="hover:text-blue-700 hover:bg-transparent"
          />

          {/* Delete */}
          <GhostButton
            onClick={async () => {
              const result = await deleteProduct(
                selectedProduct.productId,
                false
              );
              const { outputMessage, responseStatus } =
                result.data.outputValues;
              confirmDelete(outputMessage, selectedProduct.productId);
            }}
            iconClass="pi pi-trash"
            label="Delete"
            tooltip="Delete this item"
            color="text-red-500"
            hoverClass="hover:text-red-700 hover:bg-transparent"
          />

          {/* Edit */}
          <GhostButton
            onClick={() =>
              navigate(
                `/products/add?saveType=update&id=${selectedProduct.productId}`
              )
            }
            iconClass="pi pi-pencil"
            label="Edit"
            tooltip="Edit this item"
            color="text-green-500"
            hoverClass="hover:text-green-700 hover:bg-transparent"
          />

          {/* Manage Stock */}
          <GhostButton
            onClick={() =>
              navigate(
                `/inventory/stockAdjustment?inventoryId=${selectedProduct.inventoryId}&prodN=${selectedProduct.productName}&qty=${selectedProduct.stockQty}&measU=${selectedProduct.measurementUnitName}&sku=${selectedProduct.sku}&prodNo=${selectedProduct.productNo}`
              )
            }
            iconClass="pi pi-cog"
            label="Manage Stock"
            tooltip="Manage stock levels"
            color="text-yellow-500"
            hoverClass="hover:text-yellow-700 hover:bg-transparent"
          />
        </div>

        {productTypeId === 2 && (
          <>
            <div className="col-span-2">
              <ProductVariationDetails
                variationProductSkuBarcodes={variationProductSkuBarcodes}
              />
            </div>
            <div className="col-span-2">
              {/* <StockInfo inventoryId={selectedProduct.inventoryId} /> */}
            </div>
          </>
        )}

        {productTypeId === 3 && (
          <div className="m-4 bg-white p-4 rounded-md col-span-2">
            <h3 className="text-center font-bold pb-5">Combo Ingredients</h3>
            <table className="table border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">SKU</th>
                </tr>
              </thead>
              <tbody>
                {comboProductDetails.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">
                      {item.qty} {item.measurementUnitName}
                    </td>
                    <td className="px-4 py-2">{item.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  <button>
    <FontAwesomeIcon icon={faWrench} className="mr-2" />
    Manage Stock
  </button>;

  return <div className=" p-2 mb-2">{renderExtraDetails()}</div>;
};

export default function ProductInventoryList({}) {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] =
    useState(-1);
  const [storesOptions, setStoresOptions] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");

    const searchInputRef = useRef(null); // ✅ create ref
  // New states for checkboxes
  const [isSingleProductChecked, setIsSingleProductChecked] = useState(false);
  const [isVariationProductChecked, setIsVariationProductChecked] =
    useState(false);
  const [isComboProductChecked, setIsComboProductChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
    loadProducts(selectedCategoryId, page, rows);
  };

  const [selectedFilterBy, setSelectedFilterBy] = useState({
    label: "Filter by",
    value: 7,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue, setSearchValue] = useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [isSearchValueEntered, setIsSearchValueEntered] = useState(false);

  const loadProducts = async () => {
    try {
      console.log("loadproducs");
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const productTypeIds = [];
      if (isSingleProductChecked) productTypeIds.push(1);
      if (isVariationProductChecked) productTypeIds.push(2);
      if (isComboProductChecked) productTypeIds.push(3);

      const filteredData = {
        productId: null,
        sku:selectedFilterBy.value === 6 ? searchValue.value : null,
        productNo: selectedFilterBy.value === 1 ? searchValue.value : null,
        productName: selectedFilterBy.value === 2 ? searchValue.value : null,
            productDescription: selectedFilterBy.value === 7 ? searchValue.value : null,
        barcode: selectedFilterBy.value === 3 ? searchValue.value : null,
        categoryId: selectedCategoryId,
        measurementUnitId: selectedMeasurementUnitId,
        storeId: selectedStoreId === -1 ? null : selectedStoreId,
        productTypeIds: productTypeIds.length > 0 ? productTypeIds : null,
        searchByKeyword: false,
        skip: skip,
        limit: limit,
      };

      const _result = await getProducts(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      setProducts(_result.data.results[0]);
      setIsTableDataLoading(false);
    } catch (err) {
      setIsTableDataLoading(false);
      console.log("error:", err);
    }
  };

  useEffect(() => {
    setSelectedStoreId(storesOptions.length > 0 && storesOptions[0].id);
  }, [storesOptions]);

  useEffect(() => {
    loadProducts();
  }, [
    selectedStoreId,
    selectedCategoryId,
    selectedMeasurementUnitId,
    isSingleProductChecked,
    isVariationProductChecked,
    isComboProductChecked,
    currentPage,
    rowsPerPage,
  ]);

   useEffect(() => {
    if ([1, 2, 3, 6, 7].includes(selectedFilterBy.value)) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [selectedFilterBy.value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      loadProducts();
    }
  };

  // useEffect(() => {
  //   if (isSearchValueEntered) {
  //     const delayedLoadProducts = setTimeout(() => {
  //       loadProducts();
  //     }, 1000);
  //     return () => clearTimeout(delayedLoadProducts);
  //   }
  // }, [searchValue.value]);

  useEffect(() => {
    if ([1, 2, 3].includes(selectedFilterBy.value)) {
      setSelectedCategoryId(-1);
      setSelectedMeasurementUnitId(-1);
    } else {
      setSearchValue({ ...searchValue, value: "" });
    }
  }, [selectedFilterBy.value]);

  useEffect(() => {
    setIsSearchValueEntered(true);
  }, [isSearchValueEntered]);

  const [filterByOptions, setFilterByOptions] = useState([
    { id: 1, displayName: "Product No" },
    { id: 2, displayName: "Product Name" },
      { id: 7, displayName: "Product Description" },
    { id: 3, displayName: "Barcode" },
    { id: 4, displayName: "Category" },
    { id: 5, displayName: "Measurement Unit" },
       { id: 6, displayName: "SKU" },
  ]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);

  useEffect(() => {
    loadDrpStores();
    loadDrpCategory();
    loadDrpMeasurementUnit();
  }, []);

  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions([...objArr.data.results[0]]);
  };

  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions([
      { id: -1, displayName: "All" },
      ...objArr.data.results[0],
    ]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions([
      { id: -1, displayName: "All" },
      ...objArr.data.results[0],
    ]);
  };

  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const handleToggleMenu = (index) => {
    // Toggle the current menu or close it if already open
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const validationMessages = (state) => {
    if (!state.isValid && state.isTouched) {
      return state.validationMessages.map((message, index) => (
        <FormElementMessage
          key={index}
          className="mt-2 w-full"
          severity="error"
          text={`${message}`}
        />
      ));
    }
    return null;
  };

  const actionButtons = (index, item) => (
    <div className="flex space-x-2 gap-5">
      <GhostButton
        onClick={() =>
        {
  
          navigate(
            `/inventory/transactionHistory?inventoryId=${item.inventoryId}&prodN=${item.productName}&qty=${item.stockQty}&measU=${item.measurementUnitName}&sku=${item.sku}&prodNo=${item.productNo}`
          )
        }
        }
        iconClass="pi pi-history text-lg"
           labelClass="text-md font-normal"
        // tooltip="View all transactional history"
       // label="History"
        color="text-blue-500"
        hoverClass="hover:text-blue-700 hover:bg-transparent"
      />



      {/* <GhostButton
        onClick={() => handleRowExpand(index, item)}
        iconClass={`fas ${
          expandedRowId === index ? "pi pi-angle-down" : "pi pi-angle-right"
        } text-lg`}
          labelClass="text-md font-normal"
        label="More"
        color="text-blue-500"
        hoverClass="hover:text-blue-700 hover:bg-transparent"
      /> */}

      
<GhostButton
        onClick={async () => {
          const result = await deleteProduct(item.allProductId, false);
          const { outputMessage, responseStatus } = result.data.outputValues;
          confirmDelete(outputMessage, item.allProductId);
        }}
        iconClass="pi pi-trash text-lg"
        labelClass="text-md font-normal"
        //tooltip="Delete this item"
        color="text-red-500"
        //label="Delete"
        hoverClass="hover:text-red-700 hover:bg-transparent"
      />

      <GhostButton
          onClick={() =>
           {
            navigate(
              `/products/edit?saveType=update&id=${item.productId}`
            )
          }}
        iconClass="pi pi-pencil text-lg"
                labelClass="text-md font-normal"
        //tooltip="Edit this item"
       // label="Edit"
        color="text-green-500"
        hoverClass="hover:text-green-700 hover:bg-transparent"
      />

{item.inventoryId ? (
  <GhostButton
    onClick={() =>
      window.open(`/inventory/stockAdjustment?inventoryId=${item.inventoryId}`, '_blank')
    }
    iconClass="pi pi-cog text-lg"
    labelClass="text-md font-normal"
    label="Manage"
    // tooltip="Manage stock levels"
    color="text-yellow-500"
    hoverClass="hover:text-yellow-700 hover:bg-transparent"
  />
) : (
  <div className=""></div>
)}
    </div>
  );

  const handleInputChange = (setState, state, value) => {
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const [showDialog, setShowDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const confirmDelete = (outputMessage, productId) => {
    setProductIdToDelete(productId);
    setShowDialog(true);
  };

  const deleteAcceptHandler = async (allProductId) => {
    try {
      setProductIdToDelete("");
      const result = await deleteProduct(allProductId, true);
      const { data } = result;
      if (data.error) {
        showToast("danger", "Exception", data.error.message);
        return;
      }
      setProducts(products.filter((p) => p.allProductId !== allProductId));
      setTotalRecords(totalRecords - 1);
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.log("err :", err);
    }
  };

  const handleConfirm = () => {
    deleteAcceptHandler(productIdToDelete);
    setShowDialog(false);
  };

  const handleCancel = () => {
    // Handle the cancellation action here
    console.log("Cancelled!");
    setShowDialog(false);
    setProductIdToDelete("");
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null); // Track expanded row

  const handleRowSelect = (index, product) => {
    setSelectedRowIndex(index);
    setSelectedProduct(product);
  };

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const handleRowExpand = async (index, product) => {
    // If clicking the same row, collapse it
    if (expandedRowId === index) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(index);
    }
    setSelectedRowIndex(index);
    setSelectedProduct(product);
  };

  return (
    <div className="px-10">
      {showDialog && (
        <ConfirmDialog
          isVisible={true}
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Confirm Delete"
          severity="danger"
        />
      )}
      <div className="pt-4">
        <h3 className="text-center font-bold text-xl">Product Inventory</h3>
      </div>
    <div className="flex flex-col md:flex-row justify-between items-end py-4 gap-4 bg-white rounded-xl border p-6 mt-4">


       <div className="flex flex-col md:flex-row w-full gap-6">
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <div className="flex flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="singleProduct"
                    checked={isSingleProductChecked}
                    onChange={(e) => setIsSingleProductChecked(e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
                  />
                  <label htmlFor="singleProduct" className="text-sm font-medium text-gray-800">Single</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="variationProduct"
                    checked={isVariationProductChecked}
                    onChange={(e) => setIsVariationProductChecked(e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
                  />
                  <label htmlFor="variationProduct" className="text-sm font-medium text-gray-800">Variation</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="comboProduct"
                    checked={isComboProductChecked}
                    onChange={(e) => setIsComboProductChecked(e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-2 focus:ring-sky-500"
                  />
                  <label htmlFor="comboProduct" className="text-sm font-medium text-gray-800">Combo</label>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full md:w-1/5">
              <label className="text-sm font-medium text-gray-700 mb-2">Store</label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              >
                <option value="" disabled>Select Store</option>
                {storesOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full md:w-1/5">
              <label className="text-sm font-medium text-gray-700 mb-2">Filter By</label>
              <select
                value={selectedFilterBy.value}
                onChange={(e) => handleInputChange(setSelectedFilterBy, selectedFilterBy, parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              >
                <option value="" disabled>Select Filter</option>
                {filterByOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            </div>
            {[1, 2, 3, 6,7].includes(selectedFilterBy.value) && (
              <div className="flex flex-col w-full md:w-1/3">
                <label className="text-sm font-medium text-gray-700 mb-2">Search Value</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    ref={searchInputRef} // ✅ ref added
                    value={searchValue.value}
                    onChange={(e) => handleInputChange(setSearchValue, searchValue, e.target.value)}
                   onKeyDown={handleKeyDown} // ✅ Enter key handler
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                    placeholder="Enter search value"
                  />
                  <button
                    type="button"
                    onClick={loadProducts}
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
            {selectedFilterBy.value === 4 && (
              <div className="flex flex-col w-full md:w-1/5">
                <label className="text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                >
                  <option value="" disabled>Select Category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedFilterBy.value === 5 && (
              <div className="flex flex-col w-full md:w-1/5">
                <label className="text-sm font-medium text-gray-700 mb-2">Measurement Unit</label>
                <select
                  value={selectedMeasurementUnitId}
                  onChange={(e) => setSelectedMeasurementUnitId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                >
                  <option value="" disabled>Select Measurement Unit</option>
                  {measurementUnitOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        
</div>
      <div className="flex justify-between w-full items-center">
        <div className="pl-3">
          <span className=" text-gray-500">{totalRecords} items found</span>
        </div>

        <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 30, 50, 100]}
        />
      </div>
      <div className="flex flex-col h-[65vh] overflow-hidden">
      <div className="flex-1 overflow-y-auto bg-white">
       <table className="w-full border-collapse">
  <thead className="sticky top-0 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200 z-10">
    <tr>
      <th className="px-4 py-3 text-left"></th>
      <th className="px-4 py-3 text-left">Product No</th>
      <th className="px-4 py-3 text-left">SKU</th>
      <th className="px-4 py-3 text-left">Product Description</th>
      <th className="px-4 py-3 text-left">Brand</th>
      <th className="px-4 py-3 text-left">Cost Price</th>
      <th className="px-4 py-3 text-left">Unit Price</th>
      <th className="px-4 py-3 text-left">Tax (%)</th>
      <th className="px-4 py-3 text-left">Stock Qty</th>
      <th className="px-4 py-3 text-left">Product Type</th>
      <th className="px-4 py-3 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {isTableDataLoading ? (
      <tr>
        <td colSpan="11" className="px-4 py-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </td>
      </tr>
    ) : (
      products.map((item, index) => (
        <React.Fragment key={index}>
          <tr
            className={`border-b border-gray-200 text-sm ${
              expandedRowId === index
                ? "bg-blue-100 hover:bg-blue-200"
                : "hover:bg-gray-50"
            } transition-colors duration-150`}
          >
            <td
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleRowExpand(index, item)}
            >
              <FontAwesomeIcon
                icon={expandedRowId === index ? faAngleDown : faAngleRight}
                className="text-gray-600"
              />
            </td>
            <td className="px-4 py-2">{item.productNo}</td>
            <td className="px-4 py-2">{item.sku}</td>
            <td className="px-4 py-2">{item.productDescription}</td>
            <td className="px-4 py-2">{item.brandName}</td>
            <td className="px-4 py-2">{item.unitCost}</td>
            <td className="px-4 py-2">{item.unitPrice}</td>
            <td className="px-4 py-2">{item.taxPerc}</td>
            <td className="px-4 py-2">{item.stockQty}</td>
            <td className="px-4 py-2">{item.productTypeName}</td>
            <td className="px-4 py-2">{actionButtons(index, item)}</td>
          </tr>
          {expandedRowId === index && (
            <tr>
              <td colSpan="11" className="bg-gray-50 p-4">
                <ProductDetails
                  selectedProduct={item}
                  confirmDelete={confirmDelete}
                />
              </td>
            </tr>
          )}
        </React.Fragment>
      ))
    )}
  </tbody>
</table>
      </div>
      </div>
    </div>
  );
}
