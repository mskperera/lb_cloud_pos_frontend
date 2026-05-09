import React, { useState, useEffect, useCallback, useRef } from "react";
import { formatCurrency } from "../utils/format";
import { getProducts } from "../functions/register";
import { getDropdownMeasurementUnit, getDrpdownCategory, getStoresDrp } from "../functions/dropdowns";
import DaisyUIPaginator from './DaisyUIPaginator';
import { useToast } from "./useToast";
import { FaSignInAlt, FaTimes } from "react-icons/fa";
import { SignalHighIcon, XIcon } from "lucide-react";
import CloseButton from "./buttons/CloseButton";
import DialogModel2 from "./model/DialogModel2";

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
    <DialogModel2 onHide={onHide} title="Advanced Product Search">
      {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters - Responsive */}
          <div className="px-2 xs:px-3 sm:px-4 lg:px-6 py-2.5 xs:py-3 sm:py-4 lg:py-5 space-y-2.5 xs:space-y-3 sm:space-y-4 lg:space-y-5 bg-gray-50 border-b flex-shrink-0">
            
            {/* Mobile: Compact Filter Layout */}
            <div className="lg:hidden space-y-2.5 xs:space-y-3">
              {/* Filter By Dropdown */}
              <div>
                <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1.5">Filter By</label>
                <select
                  value={selectedFilterBy.value}
                  onChange={(e) => setSelectedFilterBy({ value: +e.target.value })}
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
                >
                  <option value={7}>Description</option>
                  <option value={2}>Name</option>
                  <option value={3}>Barcode</option>
                  <option value={6}>SKU</option>
                  <option value={4}>Category</option>
                  <option value={5}>Unit</option>
                </select>
              </div>

              {/* Search Input - Mobile */}
              {[1,2,3,6,7].includes(selectedFilterBy.value) && (
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue.value}
                  onChange={(e) => setSearchValue({ value: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search..."
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
                />
              )}

              {/* Category Select - Mobile */}
              {selectedFilterBy.value === 4 && (
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(+e.target.value)}
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
                >
                  {categoryOptions.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                </select>
              )}

              {/* Unit Select - Mobile */}
              {selectedFilterBy.value === 5 && (
                <select
                  value={selectedMeasurementUnitId}
                  onChange={(e) => setSelectedMeasurementUnitId(+e.target.value)}
                  className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
                >
                  {measurementUnitOptions.map(u => <option key={u.id} value={u.id}>{u.displayName}</option>)}
                </select>
              )}

              {/* Search Button - Full Width Mobile */}
              <button
                onClick={handleSearch}
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 bg-sky-600 text-white font-medium text-xs xs:text-sm rounded-lg xs:rounded-xl hover:bg-sky-700 active:bg-sky-800 transition touch-manipulation"
              >
                Search
              </button>
            </div>

            {/* Desktop: Full Filter Layout */}
            <div className="hidden lg:block space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By</label>
                  <select
                    value={selectedFilterBy.value}
                    onChange={(e) => setSelectedFilterBy({ value: +e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                  >
                    <option value={7}>Product Description</option>
                    <option value={2}>Product Name</option>
                    <option value={3}>Barcode</option>
                    <option value={6}>SKU</option>
                    <option value={4}>Category</option>
                    <option value={5}>Measurement Unit</option>
                  </select>
                </div>

                <div className="lg:col-span-3 flex items-end gap-5">
                  {[1,2,3,6,7].includes(selectedFilterBy.value) && (
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchValue.value}
                        onChange={(e) => setSearchValue({ value: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search products..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                      />
                    </div>
                  )}
                  {selectedFilterBy.value === 4 && (
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(+e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                      >
                        {categoryOptions.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                      </select>
                    </div>
                  )}
                  {selectedFilterBy.value === 5 && (
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                      <select
                        value={selectedMeasurementUnitId}
                        onChange={(e) => setSelectedMeasurementUnitId(+e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                      >
                        {measurementUnitOptions.map(u => <option key={u.id} value={u.id}>{u.displayName}</option>)}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={handleSearch}
                    className="px-8 py-3 bg-sky-600 text-white font-medium text-sm rounded-xl hover:bg-sky-700 active:bg-sky-800 transition touch-manipulation flex-shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="flex-1 overflow-y-auto px-2 xs:px-3 sm:px-4 lg:px-4 py-2 xs:py-3 sm:py-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["SKU", "Description", "Price", "Stock", "Action"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.length === 0 ? 
                    <tr>
                      <td colSpan={5} className="text-center py-16 lg:py-20 text-gray-500">
                        <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">📦</div>
                        <div className="text-base lg:text-lg font-medium">No products found</div>
                        <div className="text-xs lg:text-sm mt-1">Try adjusting your search filters</div>
                      </td>
                    </tr>
                  : isTableDataLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 lg:py-16">
                        <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                        <div className="text-xs lg:text-sm text-gray-600 mt-2 lg:mt-3">Loading products...</div>
                      </td>
                    </tr>
                  ) : (
                    products.map((item, i) => (
                
  <tr
    key={i}
    tabIndex={0}
    className={`
      hover:bg-gray-50 transition cursor-pointer outline-none
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
    ref={(el) => {
      if (selectedRowIndex === i && el) {
        el.focus();
      }
    }}
  >
    <td className="px-6 py-4 text-gray-600">{item.sku || "-"}</td>
    <td className="px-6 py-4 font-medium text-gray-800 truncate">{item.productDescription}</td>
    <td className="px-6 py-4 font-semibold text-sky-600">{formatCurrency(item.unitPrice)}</td>
    <td className="px-6 py-4">{item.stockQty ?? "-"}</td>
    <td className="px-6 py-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onProductSelect(item);
          onHide();
        }}
        className="px-4 py-1.5 lg:py-2 bg-sky-600 text-white font-medium text-xs lg:text-sm rounded-lg hover:bg-sky-700 active:scale-95 transition whitespace-nowrap"
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

            {/* Tablet Card View (md to lg) */}
            <div className="hidden md:block lg:hidden space-y-2">
              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm font-medium">No products found</div>
                  <div className="text-xs mt-1">Try adjusting your search filters</div>
                </div>
              ) : isTableDataLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                  <div className="text-xs text-gray-600 mt-2">Loading products...</div>
                </div>
              ) : (
                products.map((item, i) => (
                  <div
                    key={i}
                        style={{
              background: "var(--lpos-bg)",
              borderRadius: "var(--lpos-radius-md)",
              padding: "14px 16px",
              border: "1px solid transparent",
              transition: "all 0.2s",
            }}
                    className={`
                      bg-white rounded-lg border border-gray-200 p-3 cursor-pointer transition-all
                      hover:bg-gray-50 active:bg-gray-100 text-sm
                      ${selectedRowIndex === i ? 'ring-2 ring-sky-500 bg-sky-50' : ''}
                    `}
                    onClick={() => setSelectedRowIndex(i)}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                          {item.productDescription}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {item.sku || "N/A"}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sky-600 text-sm">
                          {formatCurrency(item.unitPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.stockQty ?? "N/A"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductSelect(item);
                        onHide();
                      }}
                      className="w-full px-3 py-2 bg-sky-600 text-white font-medium text-xs rounded-lg hover:bg-sky-700 active:scale-95 transition touch-manipulation"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2 xs:space-y-2.5">
              {products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-xs xs:text-sm font-medium">No products found</div>
                  <div className="text-xs mt-0.5">Try adjusting filters</div>
                </div>
              ) : isTableDataLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin w-7 h-7 border-3 border-sky-500 border-t-transparent rounded-full"></div>
                  <div className="text-xs text-gray-600 mt-2">Loading...</div>
                </div>
              ) : (
                products.map((item, i) => (
                  <div
                    key={i}
                        style={{
              background: "var(--lpos-bg)",
              borderRadius: "var(--lpos-radius-md)",

              border: "1px solid transparent",
              transition: "all 0.2s",
            }}
                    className={`
                      p-2.5 xs:p-3 cursor-pointer transition-all active:bg-gray-100 text-xs xs:text-sm
                      ${selectedRowIndex === i ? 'ring-2 ring-sky-500 bg-sky-50' : ''}
                    `}
                    onClick={() => setSelectedRowIndex(i)}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 line-clamp-2">
                          {item.productDescription}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          {item.sku || "N/A"}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-1">
                        <div className="font-bold text-sky-600">
                          {formatCurrency(item.unitPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.stockQty ?? "N/A"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductSelect(item);
                        onHide();
                      }}
                      className="w-full px-3 py-2 bg-sky-600 text-white  text-xs rounded-lg hover:bg-sky-700 active:scale-95 transition touch-manipulation"
                    >
                     Select
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination - fixed at bottom, outside scroll */}
          <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                {totalRecords} products found
              </div>
              <DaisyUIPaginator
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRecords={totalRecords}
                onPageChange={({page, rows}) => {setCurrentPage(page); setRowsPerPage(rows);}}
                rowsPerPageOptions={[10, 20, 30, 50, 100]}
              />
            </div>
          </div>
        </div>

    </DialogModel2>

    );
};

export default AdvancedProductSearch;