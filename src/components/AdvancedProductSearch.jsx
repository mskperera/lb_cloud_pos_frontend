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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onHide()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Main Panel */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-7xl sm:max-h-[92vh] bg-white rounded-none sm:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
         <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-50 text-gray-600">
           <h2 className="text-lg sm:text-xl font-bold">Advanced Product Search</h2>
          <button onClick={onHide}  className="p-2 sm:p-3 rounded-full hover:bg-slate-200 hover:text-red-500 transition-all duration-200 touch-manipulation">
            <FaTimes className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 bg-gray-50 border-b">
            {/* Filter By Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By</label>
                <select
                  value={selectedFilterBy.value}
                  onChange={(e) => setSelectedFilterBy({ value: +e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base"
                >
                  <option value={7}>Product Description</option>
                  <option value={2}>Product Name</option>
                  <option value={3}>Barcode</option>
                  <option value={6}>SKU</option>
                  <option value={4}>Category</option>
                  <option value={5}>Measurement Unit</option>
                </select>
              </div>

              {/* Search Controls - Full width on mobile */}
              <div className="sm:col-span-3 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3 sm:gap-4">
                {[1,2,3,6,7].includes(selectedFilterBy.value) && (
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:hidden">Search</label>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue.value}
                      onChange={(e) => setSearchValue({ value: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search products..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base"
                    />
                  </div>
                )}
                {selectedFilterBy.value === 4 && (
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:hidden">Category</label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(+e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      {categoryOptions.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                    </select>
                  </div>
                )}
                {selectedFilterBy.value === 5 && (
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:hidden">Unit</label>
                    <select
                      value={selectedMeasurementUnitId}
                      onChange={(e) => setSelectedMeasurementUnitId(+e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      {measurementUnitOptions.map(u => <option key={u.id} value={u.id}>{u.displayName}</option>)}
                    </select>
                  </div>
                )}
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 active:bg-sky-800 transition touch-manipulation"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Results and Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">{totalRecords} products found</span>
              <div className="w-full sm:w-auto">
                <DaisyUIPaginator
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  totalRecords={totalRecords}
                  onPageChange={({page, rows}) => {setCurrentPage(page); setRowsPerPage(rows);}}
                />
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
                    <td colSpan={5} className="text-center py-20 text-gray-500">
                      <div className="text-4xl mb-3">📦</div>
                      <div className="text-lg font-medium">No products found</div>
                      <div className="text-sm mt-1">Try adjusting your search filters</div>
                    </td>
                  </tr>
              : isTableDataLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                      <div className="text-sm text-gray-600 mt-3">Loading products...</div>
                    </td>
                  </tr>
              ) : (
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {products.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="text-sm font-medium">No products found</div>
                  <div className="text-xs mt-1">Try adjusting your search filters</div>
                </div>
              ) : isTableDataLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                  <div className="text-sm text-gray-600 mt-3">Loading products...</div>
                </div>
              ) : (
                products.map((item, i) => (
                  <div
                    key={i}
                    className={`
                      bg-white rounded-xl border border-gray-200 p-4 cursor-pointer transition-all
                      hover:bg-gray-50 active:bg-gray-100
                      ${selectedRowIndex === i ? 'ring-2 ring-sky-500 bg-sky-50' : ''}
                    `}
                    onClick={() => setSelectedRowIndex(i)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm leading-tight mb-1">
                          {item.productDescription}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          SKU: {item.sku || "N/A"}
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-lg font-bold text-sky-600">
                          {formatCurrency(item.unitPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Stock: {item.stockQty ?? "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductSelect(item);
                          onHide();
                        }}
                        className="w-full px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 active:scale-95 transition touch-manipulation"
                      >
                        Select Product
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default AdvancedProductSearch;