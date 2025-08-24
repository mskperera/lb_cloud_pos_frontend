import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { validate } from "../utils/formValidation";
import { formatCurrency } from "../utils/format";
import { getProducts } from "../functions/register";
import { getDropdownMeasurementUnit, getDrpdownCategory, getStoresDrp } from "../functions/dropdowns";
import DialogModel from "./model/DialogModel";
import DaisyUIPaginator from './DaisyUIPaginator';
import { useToast } from "./useToast";

const AdvancedProductSearch = ({ visible, onHide, onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] = useState(-1);
  const [storesOptions, setStoresOptions] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [isSingleProductChecked, setIsSingleProductChecked] = useState(false);
  const [isVariationProductChecked, setIsVariationProductChecked] = useState(false);
  const [isComboProductChecked, setIsComboProductChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
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

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1); // Track selected row
  const tableRef = useRef(null); // Reference to the table for focusing rows
  const searchInputRef = useRef(null); // Reference to the search input

  const loadDrpStores = async () => {
    try {
      const objArr = await getStoresDrp();
      setStoresOptions([...objArr.data.results[0]]);
    } catch (err) {
      console.error("Error loading stores:", err);
      showToast("danger", "Error", "Failed to load stores");
    }
  };

  const loadDrpCategory = async () => {
    try {
      const objArr = await getDrpdownCategory();
      setCategoryOptions([{ id: -1, displayName: "All" }, ...objArr.data.results[0]]);
    } catch (err) {
      console.error("Error loading categories:", err);
      showToast("danger", "Error", "Failed to load categories");
    }
  };

  const loadDrpMeasurementUnit = async () => {
    try {
      const objArr = await getDropdownMeasurementUnit();
      setMeasurementUnitOptions([{ id: -1, displayName: "All" }, ...objArr.data.results[0]]);
    } catch (err) {
      console.error("Error loading measurement units:", err);
      showToast("danger", "Error", "Failed to load measurement units");
    }
  };

    useEffect(() => {
if(visible){
    setSearchValue({...searchValue,value:''})
}
  }, [visible]);



  useEffect(() => {
    loadDrpStores();
    loadDrpCategory();
    loadDrpMeasurementUnit();
  }, []);

  useEffect(() => {
    if (storesOptions.length > 0) {
      setSelectedStoreId(storesOptions[0].id);
    }
  }, [storesOptions]);

  const loadProducts =useCallback( async () => {
    if (!selectedStoreId) {
      showToast("danger", "Error", "Please select a store");
      return;
    }

    try {
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;
      const productTypeIds = [];
      if (isSingleProductChecked) productTypeIds.push(1);
      if (isVariationProductChecked) productTypeIds.push(2);
      if (isComboProductChecked) productTypeIds.push(3);

      const normalizedSearchValue = searchValue.value.trim().replace(/\s+/g, ' ').toLowerCase();
      const filteredData = {
        productId: null,
        sku: selectedFilterBy.value === 6 ? normalizedSearchValue : null,
        productNo: selectedFilterBy.value === 1 ? normalizedSearchValue : null,
        productName: selectedFilterBy.value === 2 ? normalizedSearchValue : null,
        productDescription: selectedFilterBy.value === 7 ? normalizedSearchValue : null,
        barcode: selectedFilterBy.value === 3 ? normalizedSearchValue : null,
        categoryId: selectedCategoryId === -1 ? null : selectedCategoryId,
        measurementUnitId: selectedMeasurementUnitId === -1 ? null : selectedMeasurementUnitId,
        storeId: selectedStoreId,
        productTypeIds: productTypeIds.length > 0 ? productTypeIds : null,
        searchByKeyword: false,
        skip,
        limit,
      };

      console.log('filteredData',filteredData)
      const result = await getProducts(filteredData, null);
      setTotalRecords(result.data.outputValues.totalRows || 0);
      setProducts(result.data.results[0] || []);
      setSelectedRowIndex(-1); // Reset selected row on new data load
    } catch (err) {
      console.error("Error loading products:", err);
      showToast("danger", "Error", "Failed to load products");
    } finally {
      setIsTableDataLoading(false);
    }
  },[selectedStoreId,
    selectedCategoryId,
    selectedMeasurementUnitId,
    isSingleProductChecked,
    isVariationProductChecked,
    isComboProductChecked,
    currentPage,
    rowsPerPage,
    searchValue.value,
    selectedFilterBy.value,
    showToast

])

  useEffect(() => {
    if (selectedStoreId) {
      loadProducts();
    }
  }, [selectedStoreId,
        selectedStoreId,
    selectedCategoryId,
        selectedMeasurementUnitId,
    isSingleProductChecked,
    isVariationProductChecked,
    isComboProductChecked,
    currentPage,
    rowsPerPage,
    visible
  ]);

  // Focus search input when component is shown
  useEffect(() => {
    if (visible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [visible]);

  const handleInputChange = (setState, state, value) => {
    const validation = validate(value, state);
    setState({
      ...state,
      value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });

    
  };

  const handleManualSearch = () => {
    if ([1, 2, 3, 6, 7].includes(selectedFilterBy.value) && searchValue.value.trim() !== '') {
      setCurrentPage(0); // Reset to page 1
      loadProducts();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && [1, 2, 3, 6, 7].includes(selectedFilterBy.value) && searchValue.value.trim() !== '') {
      setCurrentPage(0); // Reset to page 1
      loadProducts();
    }

  };

  useEffect(()=>{
    if(searchValue.value===''){
        if(selectedStoreId){
      setCurrentPage(0);
      loadProducts();
        }
    }
  },[searchValue.value])

  // Handle keyboard navigation for table rows and search input
  useEffect(() => {
    const handleTableKeyDown = (e) => {
      if (isTableDataLoading) return;

      // Ignore printable characters when Ctrl is pressed
    if (e.ctrlKey) {
      return; // Skip processing to avoid capturing keys like 'f' when Ctrl+F is pressed
    }
    
      // Handle printable characters and Backspace
      if ((/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Spacebar') && searchInputRef.current && [1, 2, 3, 6, 7].includes(selectedFilterBy.value)) {
        e.preventDefault();
        const newValue = e.key === 'Backspace' ? searchValue.value.slice(0, -1) : searchValue.value + e.key;
        handleInputChange(setSearchValue, searchValue, newValue);
        searchInputRef.current.focus();
        setSelectedRowIndex(-1);
      } else if (e.key === 'ArrowDown' && products.length > 0) {
        e.preventDefault();
        setSelectedRowIndex((prevIndex) =>
          prevIndex < products.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === 'ArrowUp' && products.length > 0) {
        e.preventDefault();
        if (selectedRowIndex === 0 && searchInputRef.current) {
          searchInputRef.current.focus();
          setSelectedRowIndex(-1);
        } else {
          setSelectedRowIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        }
      } else if (e.key === 'Enter' && selectedRowIndex >= 0 && selectedRowIndex < products.length) {
        e.preventDefault();
        const selectedProduct = products[selectedRowIndex];
        onProductSelect(selectedProduct);
        onHide();
      }
    };

    window.addEventListener('keydown', handleTableKeyDown);
    return () => window.removeEventListener('keydown', handleTableKeyDown);
  }, [products, selectedRowIndex, onProductSelect, onHide, isTableDataLoading, searchValue, selectedFilterBy.value]);

  // Scroll to selected row when index changes
  useEffect(() => {
    if (selectedRowIndex >= 0 && tableRef.current) {
      const row = tableRef.current.querySelector(`tr[data-row-index="${selectedRowIndex}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        row.focus();
      }
    }
  }, [selectedRowIndex]);

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
    setSelectedRowIndex(-1); // Reset selected row on page change
  };

  const filterByOptions = [
    { id: 1, displayName: "Product No" },
    { id: 2, displayName: "Product Name" },
    { id: 7, displayName: "Product Description" },
    { id: 3, displayName: "Barcode" },
    { id: 4, displayName: "Category" },
    { id: 5, displayName: "Measurement Unit" },
    { id: 6, displayName: "SKU" },
  ];

  return (

      <div className="flex flex-col gap-6 p-6 bg-[#fbfcff] w-full">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-3">Product Type</label>
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
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Filter By</label>
            <select
              value={selectedFilterBy.value}
              onChange={(e) => {
                handleInputChange(setSelectedFilterBy, selectedFilterBy, parseInt(e.target.value));
                    setSelectedMeasurementUnitId(-1);
                    setSelectedCategoryId(-1);
            }}
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
          <div className="flex flex-col">
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
        </div>
        <div className="grid grid-cols-7 gap-4 items-center">
          <span className="text-sm text-gray-600 pl-3">{totalRecords} items found</span>
          <div className="col-span-3">
            {[1, 2, 3, 6, 7].includes(selectedFilterBy.value) && (
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col flex-grow">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue.value}
                    onChange={(e) => {
         
                        handleInputChange(setSearchValue, searchValue, e.target.value);
           
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
                    placeholder="Enter search value"
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={handleManualSearch}
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
            {selectedFilterBy.value === 4 && (
              <div className="flex flex-col w-1/5">
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
              <div className="flex flex-col w-1/5">
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
          <div className="col-span-3">
            <DaisyUIPaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </div>
        </div>
        <div className="flex-1 max-h-[400px] min-h-[400px] overflow-y-auto bg-white rounded-lg border border-gray-200 w-full">
          <table ref={tableRef} className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 bg-[#fbfcff] text-sm font-semibold text-gray-700 border-b border-gray-200 z-10">
              <tr>
                <th className="px-4 py-3 text-left w-1/6">Product No</th>
                <th className="px-4 py-3 text-left w-1/6">SKU</th>
                <th className="px-4 py-3 text-left w-2/6">Product Description</th>
                <th className="px-4 py-3 text-left w-1/6">Unit Price</th>
                <th className="px-4 py-3 text-left w-1/6">Stock Qty</th>
                <th className="px-4 py-3 text-left w-1/6">Action</th>
              </tr>
            </thead>
            <tbody>
              {isTableDataLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2 min-h-[400px] w-full">
                      <svg className="animate-spin h-5 w-5 text-sky-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2 min-h-[400px] w-full">
                      No products found
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((item, index) => (
                  <tr
                    key={index}
                    data-row-index={index}
                    tabIndex={0}
                    className={`border-b border-gray-200 hover:bg-sky-50 cursor-pointer transition duration-150 outline-none ${
                      selectedRowIndex === index ? 'bg-sky-100' : ''
                    }`}
                    onClick={() => setSelectedRowIndex(index)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.productNo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.productDescription}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate">{item.stockQty}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        className="px-3 py-1 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductSelect(item);
                          onHide();
                        }}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

  );
};

export default AdvancedProductSearch;