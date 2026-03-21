import React, { useState, useEffect, useCallback, useRef } from "react";
import { formatCurrency } from "../utils/format";
import { getProducts } from "../functions/register";
import { getDropdownMeasurementUnit, getDrpdownCategory, getStoresDrp } from "../functions/dropdowns";
import DaisyUIPaginator from './DaisyUIPaginator';
import { useToast } from "./useToast";
import { FaTimes } from "react-icons/fa";

const AdvancedProductSearch = ({ visible, onHide, onProductSelect, showOnlyProductItems }) => {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
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
  const [selectedFilterBy, setSelectedFilterBy] = useState({ value: 7 });
  const [searchValue, setSearchValue] = useState({ value: "" });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const tableRef = useRef(null);
  const searchInputRef = useRef(null);

  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions(objArr.data.results[0] || []);
  };

  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions([{ id: -1, displayName: "All Categories" }, ...objArr.data.results[0]]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions([{ id: -1, displayName: "All Units" }, ...objArr.data.results[0]]);
  };

  useEffect(() => {
    loadDrpStores();
    loadDrpCategory();
    loadDrpMeasurementUnit();
  }, []);


  useEffect(() => {
  const handleKeyDown = (e) => {
    if (!visible || isTableDataLoading || products.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedRowIndex(prev => (prev < products.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedRowIndex <= 0) {
        searchInputRef.current?.focus();
        setSelectedRowIndex(-1);
      } else {
        setSelectedRowIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
    } else if (e.key === "Enter" && selectedRowIndex >= 0) {
      e.preventDefault();
      onProductSelect(products[selectedRowIndex]);
      onHide();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [visible, products, selectedRowIndex, isTableDataLoading, onProductSelect, onHide]);


  useEffect(() => {
    if (storesOptions.length > 0 && !selectedStoreId) {
      setSelectedStoreId(storesOptions[0].id);
    }
  }, [storesOptions]);

  const loadProducts = useCallback(async () => {
    if (!selectedStoreId) return;

    setIsTableDataLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;
    const productTypeIds = [];
    if (isSingleProductChecked) productTypeIds.push(1);
    if (isVariationProductChecked) productTypeIds.push(2);
    if (isComboProductChecked) productTypeIds.push(3);

    const filteredData = {
      productId: null,
      sku: selectedFilterBy.value === 6 ? searchValue.value : null,
      productNo: selectedFilterBy.value === 1 ? searchValue.value : null,
      productName: selectedFilterBy.value === 2 ? searchValue.value : null,
      productDescription: selectedFilterBy.value === 7 ? searchValue.value : null,
      barcode: selectedFilterBy.value === 3 ? searchValue.value : null,
      categoryId: selectedCategoryId === -1 ? null : selectedCategoryId,
      measurementUnitId: selectedMeasurementUnitId === -1 ? null : selectedMeasurementUnitId,
      isProductItem: showOnlyProductItems,
      storeId: selectedStoreId,
      productTypeIds: productTypeIds.length > 0 ? productTypeIds : null,
      skip, limit,
    };

    try {
      const result = await getProducts(filteredData, null);
      setTotalRecords(result.data.outputValues.totalRows || 0);
      setProducts(result.data.results[0] || []);
      setSelectedRowIndex(-1);
    } catch (err) {
      showToast("error", "Error", "Failed to load products");
    } finally {
      setIsTableDataLoading(false);
    }
  }, [
    selectedStoreId, selectedCategoryId, selectedMeasurementUnitId,
    isSingleProductChecked, isVariationProductChecked, isComboProductChecked,
    currentPage, rowsPerPage, searchValue.value, selectedFilterBy.value, showOnlyProductItems
  ]);

// Run only when modal becomes visible (not on every filter change)
useEffect(() => {
  if (selectedStoreId) {
    loadProducts();
  }
}, [
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

  useEffect(() => { if (visible && searchInputRef.current) searchInputRef.current.focus(); }, [visible]);

  const handleSearch = () => { setCurrentPage(0); loadProducts(); };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onHide()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Main Panel */}
      <div className="relative w-full max-w-7xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-50 text-gray-600">
           <h2 className="text-xl font-bold">Advanced Product Search</h2>
          <button onClick={onHide}  className="p-3 rounded-full hover:bg-slate-200 hover:text-red-500 transition-all duration-200">
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-6 space-y-5 bg-gray-50 border-b">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By</label>
                <select
                  value={selectedFilterBy.value}
                  onChange={(e) => setSelectedFilterBy({ value: +e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value={7}>Product Description</option>
                  {/* <option value={1}>Product No</option> */}
                  <option value={2}>Product Name</option>
                  <option value={3}>Barcode</option>
                  <option value={6}>SKU</option>
                  <option value={4}>Category</option>
                  <option value={5}>Measurement Unit</option>
                </select>
              </div>
      

              {/* Search Row */}
            <div className="flex flex-wrap items-end gap-4 col-span-3">
              {[1,2,3,6,7].includes(selectedFilterBy.value) && (
                <div className="flex-1 min-w-64">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue.value}
                    onChange={(e) => setSearchValue({ value: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search products..."
                    className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-lg"
                  />
                </div>
              )}
              {selectedFilterBy.value === 4 && (
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(+e.target.value)} className="px-5 py-3 rounded-xl border">
                  {categoryOptions.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                </select>
              )}
              {selectedFilterBy.value === 5 && (
                <select value={selectedMeasurementUnitId} onChange={(e) => setSelectedMeasurementUnitId(+e.target.value)} className="px-5 py-3 rounded-xl border">
                  {measurementUnitOptions.map(u => <option key={u.id} value={u.id}>{u.displayName}</option>)}
                </select>
              )}
              <button onClick={handleSearch} className="px-8 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition">
                Search
              </button>
            </div>
            </div>

    

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">{totalRecords} products found</span>
              <DaisyUIPaginator currentPage={currentPage} rowsPerPage={rowsPerPage} totalRecords={totalRecords} onPageChange={({page, rows}) => {setCurrentPage(page); setRowsPerPage(rows);}} />
            </div>
          </div>

          {/* Table */}
      
          <div className="flex-1 overflow-y-auto m-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <table className="w-full">
                 <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["SKU", "Description", "Price", "Stock", "Action"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
               
              {products.length === 0 ? 
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-500 text-lg">No products found</td>
                    </tr>
                
              :
               
                isTableDataLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16"><div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div></td>
                    </tr>
                )  : (
                  products.map((item, i) => (
                
  <tr
    key={i}
    tabIndex={0}  // Critical: Makes row focusable
    className={`
      hover:bg-sky-50 transition cursor-pointer outline-none 
      ${selectedRowIndex === i ? 'bg-sky-100 ring-2 ring-sky-500 ring-inset' : ''}
    `}
    onClick={() => setSelectedRowIndex(i)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onProductSelect(item);
        onHide();
      }
    }}
    // Auto-focus the selected row
    ref={(el) => {
      if (selectedRowIndex === i && el) {
        el.focus();
      }
    }}
  >
    {/* <td className="px-6 py-4 font-medium">{item.productNo}</td> */}
    <td className="px-6 py-4 text-gray-600">{item.sku || "-"}</td>
    <td className="px-6 py-4 font-medium text-gray-800">{item.productDescription}</td>
    <td className="px-6 py-4 font-semibold text-sky-600">{formatCurrency(item.unitPrice)}</td>
    <td className="px-6 py-4">{item.stockQty ?? "-"}</td>
    <td className="px-6 py-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onProductSelect(item);
          onHide();
        }}
        className="px-5 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 active:scale-95 transition"
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
      </div>
    </div>
  );
};

export default AdvancedProductSearch;