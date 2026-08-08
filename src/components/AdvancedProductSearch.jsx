import React, { useState, useEffect, useCallback, useRef } from "react";
import { formatCurrency } from "../utils/format";
import { getProducts } from "../functions/register";
import {
  getDropdownMeasurementUnit,
  getDrpdownCategory,
  getStoresDrp,
} from "../functions/dropdowns";
import DaisyUIPaginator from "./DaisyUIPaginator";
import { useToast } from "./useToast";
import DialogModel2 from "./model/DialogModel2";
import ReusableTable from "../components/ReusableTable"; // Updated import

const AdvancedProductSearch = ({
  visible,
  onHide,
  onProductSelect,
  showOnlyProductItems,
  onlyAllowToSelectStockTrackedProduct,
}) => {
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
  const [openMenuId, setOpenMenuId] = useState(null);
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

  // Keyboard Arrow Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!visible || isTableDataLoading || products.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedRowIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedRowIndex <= 0) {
          searchInputRef.current?.focus();
          setSelectedRowIndex(-1);
        } else {
          setSelectedRowIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
      } else if (e.key === "Enter" && selectedRowIndex >= 0) {
        e.preventDefault();
        const selectedItem = products[selectedRowIndex];
        const isSelectDisabled =
          onlyAllowToSelectStockTrackedProduct && !selectedItem?.isStockTracked;

        if (selectedItem && !isSelectDisabled) {
          onProductSelect(selectedItem);
          onHide();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, products, selectedRowIndex, isTableDataLoading, onProductSelect, onHide, onlyAllowToSelectStockTrackedProduct]);

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
      uomType: "SALES",
      skip,
      limit,
    };

    try {
      const result = await getProducts(filteredData, null);

      if (result.data.outputValues.responseStatus === "failed") {
        showToast("danger", result.data.outputValues.outputMessage);
        return;
      }

      setTotalRecords(result.data.outputValues.totalRows);
      setProducts(result.data.results[0] || []);
      setSelectedRowIndex(-1);
    } catch (err) {
      showToast("error", "Error", "Failed to load products");
    } finally {
      setIsTableDataLoading(false);
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
    searchValue.value,
    selectedFilterBy.value,
    showOnlyProductItems,
  ]);

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
    visible,
  ]);

  useEffect(() => {
    if (visible && searchInputRef.current) searchInputRef.current.focus();
  }, [visible]);

  const handleSearch = () => {
    setCurrentPage(0);
    loadProducts();
  };



// Table columns definition for ReusableTable
  const productColumns = [
    {
      header: "Product Information",
      key: "productInformation",
      render: (item) => {
        const isPhysicalProduct = item.isProductItem === 1;
        return (
          <>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {item.sku || "NO-SKU"}
              </span>
              {!isPhysicalProduct && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Service / Non-Product
                </span>
              )}
              {item.isAssemblyProduct === 1 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Assembly
                </span>
              )}
              {item.isMultiUom === 1 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Multi-UOM
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-gray-900 mt-1 line-clamp-1">
              {item.productDescription || item.productName}
            </div>
          </>
        );
      },
    },
    {
      header: "Stock Qty",
      key: "stockQty",
      headerClass: "text-center",
      cellClass: "text-center",
      render: (item) => {
        const isPhysicalProduct = item.isProductItem === 1;
        const stockVal = Number(item.stockQty ?? 0);
        const reorderVal = item.reorderLevel ? Number(item.reorderLevel) : null;
        const isOutOfStock = item.isStockTracked && stockVal <= 0;
        const isReorderWarning = item.isStockTracked && reorderVal !== null && stockVal <= reorderVal;

        const getStockBadgeStyle = () => {
          if (isOutOfStock) return "bg-rose-100 text-rose-700 border-rose-300 font-bold animate-pulse";
          if (isReorderWarning) return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        };

        if (item.isStockTracked) {
          return (
            <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${getStockBadgeStyle()}`}>
              {item.formattedQty ?? stockVal}
            </span>
          );
        }

        return (
          <span className="text-xs font-medium text-gray-400 italic">
            {!isPhysicalProduct ? "N/A (Service)" : "Non-Tracked"}
          </span>
        );
      },
    },
    {
      header: "Cost Price",
      key: "unitCost",
      headerClass: "text-right",
      cellClass: "text-right font-mono text-slate-700",
      render: (item) => formatCurrency(item.unitCost, false),
    },
    {
      header: "Unit Price",
      key: "unitPrice",
      headerClass: "text-right",
      cellClass: "text-right font-mono font-semibold text-sm text-sky-600",
      render: (item) => (
        <>
          {formatCurrency(item.unitPrice, false)}
          {item.measurementUnitName && (
            <span className="text-xs font-normal text-gray-500 ml-1">
              / {item.measurementUnitName}
            </span>
          )}
        </>
      ),
    },
  ];



  if (!visible) return null;

  return (
    <DialogModel2 onHide={onHide} title="Advanced Product Search">
      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-100">
        {/* Filters - Responsive */}
        <div className="mx-4 px-2 xs:px-3 sm:px-4 lg:px-6 py-2.5 
        xs:py-3 sm:py-4 lg:py-5 space-y-2.5 xs:space-y-3 sm:space-y-4 lg:space-y-5  
        border-b flex-shrink-0 
        gap-4 bg-white rounded-xl border p-6 mt-4 shadow-sm
        ">
          {/* Mobile: Compact Filter Layout */}
          <div className="lg:hidden space-y-2.5 xs:space-y-3">
            <div>
              <label className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1.5">
                Filter By
              </label>
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

            {[1, 2, 3, 6, 7].includes(selectedFilterBy.value) && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue.value}
                onChange={(e) => setSearchValue({ value: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search..."
                className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
              />
            )}

            {selectedFilterBy.value === 4 && (
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(+e.target.value)}
                className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </select>
            )}

            {selectedFilterBy.value === 5 && (
              <select
                value={selectedMeasurementUnitId}
                onChange={(e) => setSelectedMeasurementUnitId(+e.target.value)}
                className="w-full px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs xs:text-sm"
              >
                {measurementUnitOptions.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleSearch}
              type="button"
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
                {[1, 2, 3, 6, 7].includes(selectedFilterBy.value) && (
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue.value}
                      onChange={(e) => setSearchValue({ value: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search products..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    />
                  </div>
                )}
                {selectedFilterBy.value === 4 && (
                  <div className="flex-1 min-w-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(+e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.displayName}
                        </option>
                      ))}
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
                      {measurementUnitOptions.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  onClick={handleSearch}
                  type="button"
                  className="px-8 py-3 bg-sky-600 text-white font-medium text-sm rounded-xl hover:bg-sky-700 active:bg-sky-800 transition touch-manipulation flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

{/* Product Table Container */}
        <div className="flex-1 px-2 xs:px-3 sm:px-4 lg:px-4 py-2 border rounded-lg overflow-hidden">
          <ReusableTable
            data={products}
            isLoading={isTableDataLoading}
            columns={productColumns}
            emptyMessage="No products found"
            customActions={(item) => {
              const isSelectDisabled =
                onlyAllowToSelectStockTrackedProduct && !item.isStockTracked;

              return (
                <button
                  type="button"
                  disabled={isSelectDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSelectDisabled) return;
                    onProductSelect(item);
                    onHide();
                  }}
                  className={`
                    px-3.5 py-1.5 font-medium text-xs rounded-lg transition-all shadow-2xs whitespace-nowrap
                    ${
                      isSelectDisabled
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-sky-600 text-white hover:bg-sky-700 active:scale-95 cursor-pointer"
                    }
                  `}
                >
                  Select
                </button>
              );
            }}
          />
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">{totalRecords} products found</div>
            <DaisyUIPaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={({ page, rows }) => {
                setCurrentPage(page);
                setRowsPerPage(rows);
              }}
              rowsPerPageOptions={[10, 20, 30, 50, 100]}
            />
          </div>
        </div>
      </div>
    </DialogModel2>
  );
};

export default AdvancedProductSearch;