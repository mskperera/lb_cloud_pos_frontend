
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProducts, getProductsByBarcode } from '../../functions/register';
import { useToast } from '../useToast';
import { FaBarcode, FaSearch } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { XIcon } from 'lucide-react';

const Barcode = ({ onProductSelect, onBarcodeEnter, isMobile, onlyAllowToSelectStockTrackedProduct,uomType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeMode, setBarcodeMode] = useState(() => {
    const saved = localStorage.getItem('barcodeMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [showModeMenu, setShowModeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const showToast = useToast();

  // Fetch products
  const fetchKeywordProducts = useCallback(
    debounce(async (term) => {
      if (!term.trim() || term.length < 1 || barcodeMode) {
        setProducts([]);
        return;
      }

      if (!store?.storeId) {
        showToast('danger', 'Error', 'No store selected');
        return;
      }

      setLoading(true);
      try {
        const filteredData = {
          productDescription: term,
          storeId: store.storeId,
          uomType:uomType,
          skip: 0,
          limit: 100,
        };

        const result = await getProducts(filteredData);

      if(result.data.outputValues.responseStatus==="failed"){
           showToast("danger", result.data.outputValues.outputMessage);
           return;
      }

        const results = result.data.results[0] || [];
        setProducts(results.slice(0, 10));
        setSelectedIndex(results.length > 0 ? 0 : -1);
      } catch (err) {
        console.error(err);
        showToast('danger', 'Error', 'Failed to search products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 600),
    [barcodeMode, store?.storeId]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (barcodeMode) {
      setIsDropdownOpen(false);
      return;
    }

    if (value.trim() === '') {
      setProducts([]);
      setSelectedIndex(-1);
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);
      fetchKeywordProducts(value);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // ... your existing Enter logic remains unchanged ...
      if (barcodeMode && searchTerm) {
        // barcode logic here
   const filteredData = { 
  barcode: searchTerm, 
  storeId: store.storeId, 
  uomType: 'SALES' 
};
        try {
          const result = await getProductsByBarcode(filteredData, null);
             
          const results = result.results[0][0];
             console.log('bbbbbarrrr ccc re:',results)
          if (results) {
            onBarcodeEnter(results,searchTerm);
            setSearchTerm('');
          }
        } catch (err) {
                       console.log('bbbbbarrrr ccc re err:',err)
          showToast('danger', 'Error', 'Failed to lookup barcode');
        }
      } else if (!barcodeMode && products.length > 0 && selectedIndex >= 0) {
        onProductSelect(products[selectedIndex]);
        setSearchTerm('');
        setProducts([]);
        setSelectedIndex(-1);
        setIsDropdownOpen(false);
      }
    }

    if (!barcodeMode && products.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setProducts([]);
    setSelectedIndex(-1);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const toggleMode = (newMode) => {
    setBarcodeMode(newMode);
    setSearchTerm('');
    setProducts([]);
    setSelectedIndex(-1);
    setIsDropdownOpen(false);
    setShowModeMenu(false);
    inputRef.current?.focus();
  };

  const handleToggleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.top + rect.height, left: rect.left, width: rect.width });
    }
    setShowModeMenu((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('barcodeMode', JSON.stringify(barcodeMode));
  }, [barcodeMode]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchContainerRef.current?.contains(event.target)) {
        fetchKeywordProducts.cancel();
        setProducts([]);
        setSelectedIndex(-1);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      fetchKeywordProducts.cancel();
    };
  }, [fetchKeywordProducts]);

  // Dynamic background color based on mode
  const inputBgColor = barcodeMode 
    ? 'var(--lpos-barcode-bg, #34c759)'   // Light Green for Barcode
    : 'var(--lpos-search-bg, #0284c7)';   // Warm Blue for Search

  return (
    <div ref={searchContainerRef} className="relative w-full border-gray-400 ">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <div 
            className="relative flex items-center  w-full border shadow-sm rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              background: inputBgColor,
              borderColor: barcodeMode ? '#34c759' : '#0284c7',
            }}
          >
            {/* Mode Toggle Button */}
            <div ref={buttonRef}>
              <button
              type='button'
                onClick={handleToggleClick}
                className="flex items-center gap-3 px-5 py-4 font-semibold text-gray-800 hover:bg-black/5 transition-all rounded-l-2xl"
              >
                {barcodeMode ? (
                  <FaBarcode className="text-2xl text-green-600" />
                ) : (
                  <FaSearch className="text-2xl text-sky-600" />
                )}
                {!isMobile && (
                  <span className="text-sm tracking-widest">
                    {barcodeMode ? 'BARCODE' : 'SEARCH'}
                  </span>
                )}
                <svg className={`w-4 h-4 transition-transform ${showModeMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Digital Mono Input */}
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={barcodeMode ? 'Scan or enter barcode...' : 'Search product name or description...'}
              className="flex-1 py-4 pl-4 pr-12 text-base font-bold bg-transparent border-none focus:outline-none placeholder-gray-500"
              style={{
                fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                letterSpacing: '0.8px',
                fontSize: isMobile ? '15px' : '17px',
              }}
            />

            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-4 p-1 text-gray-500 hover:text-red-600 transition"
              >
                <XIcon size={20} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Results Dropdown - Already styled in previous response */}
          {!barcodeMode && isDropdownOpen && (loading || products.length > 0) && (
            <div 
              className="absolute  top-full mt-2 w-full shadow-2xl z-40 max-h-96 overflow-hidden"
              style={{
                background: "var(--lpos-bg)",
                borderRadius: "var(--lpos-radius-md)",
                border: "1px solid var(--lpos-border)",
              }}
            >
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
<table className="w-full text-left border-collapse">
  <thead className="bg-[var(--lpos-surface)] border-b sticky top-0 z-10">
    <tr>
      <th className="px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
      <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
      <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Price</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-100">
    {products.map((item, i) => {
      const isSelectDisabled = onlyAllowToSelectStockTrackedProduct && !item.isStockTracked;
      const isSelected = selectedIndex === i;
      const isPhysicalProduct = item.isProductItem === 1 || item.isProductItem === true;

      return (
        <tr
          key={item.variationProductId || i}
          onClick={() => {
            if (isSelectDisabled) return;
            onProductSelect(item);
            setSearchTerm('');
            setProducts([]);
          }}
          className={`
            transition-colors duration-150
            ${isSelected ? 'bg-sky-50' : 'hover:bg-gray-50'}
            ${isSelectDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50/50' : 'cursor-pointer'}
          `}
        >
          {/* Main Details (SKU, Description & Badges) */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* SKU Badge */}
              <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {item.sku || 'NO-SKU'}
              </span>

              {/* Item Type Badge: Service vs Physical Product */}
              {!isPhysicalProduct && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Service / Non-Product
                </span>
              )}

              {/* Multi-UOM Badge */}
              {item.isMultiUom === 1 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Multi-UOM
                </span>
              )}

              {/* Barcode Scan Badge */}
              {item.barcodeSource === 'UOM' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  UOM Scan
                </span>
              )}
            </div>

            {/* Description */}
            <div className="text-sm font-medium text-gray-900 mt-1 line-clamp-1">
              {item.productDescription || item.productName}
            </div>
          </td>

          {/* Stock Availability */}
          <td className="px-4 py-3 text-right whitespace-nowrap align-middle">
            {item.isStockTracked ? (
              <div className="inline-flex flex-col items-end">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.stockQty > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {item.formattedQty || `${item.stockQtyDisplay ?? 0} ${item.measurementUnitName || ''}`}
                </span>
              </div>
            ) : (
              <span className="text-xs font-medium text-gray-400 italic">
                {!isPhysicalProduct ? 'N/A (Service)' : 'Non-Tracked'}
              </span>
            )}
          </td>

          {/* Price & Unit Combination */}
          <td className="px-4 py-3 text-right whitespace-nowrap align-middle">
            <div className="text-sm font-bold text-sky-700">
              {formatCurrency(item.unitPrice)}
              {item.measurementUnitName && (
                <span className="text-xs font-normal text-gray-500 ml-1">
                  / {item.measurementUnitName}
                </span>
              )}
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
              )}
            </div>
          )}

          {/* No Results */}
          {!barcodeMode && isDropdownOpen && searchTerm && !loading && products.length === 0 && searchTerm.length > 1 && (
            <div 
              className="absolute top-full mt-2 w-full text-center py-10 text-gray-500"
              style={{
                background: "var(--lpos-bg)",
                borderRadius: "var(--lpos-radius-md)",
                border: "1px solid var(--lpos-border)",
              }}
            >
              No products found for <strong>"{searchTerm}"</strong>
            </div>
          )}
        </div>
      </div>

      {/* Mode Menu */}
      {showModeMenu && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={() => setShowModeMenu(false)}>
          <div
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              minWidth: '220px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleMode(!barcodeMode)}
              className="flex items-center gap-3 w-full px-6 py-4 hover:bg-gray-50 text-gray-700 font-medium"
            >
              {barcodeMode ? (
                <> <FaSearch className="text-xl" /> Switch to Search Mode </>
              ) : (
                <> <FaBarcode className="text-xl" /> Switch to Barcode Mode </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barcode;