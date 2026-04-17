
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProducts } from '../../functions/register';
import { useToast } from '../useToast';
import { FaBarcode, FaSearch } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { XIcon } from 'lucide-react';

const ProductSearch = ({ onProductSelect, onBarcodeEnter, isMobile }) => {
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

  const store = JSON.parse(localStorage.getItem('selectedStore'));
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
          skip: 0,
          limit: 100,
        };

        const result = await getProducts(filteredData, null);
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

    if (barcodeMode) return;

    if (value.trim() === '') {
      setProducts([]);
      setSelectedIndex(-1);
    } else {
      fetchKeywordProducts(value);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // ... your existing Enter logic remains unchanged ...
      if (barcodeMode && searchTerm) {
        // barcode logic here
        const filteredData = { barcode: searchTerm, storeId: store.storeId, skip: 0, limit: 100 };
        try {
          const result = await getProducts(filteredData, null);
          const results = result.data.results[0] || [];
          if (results.length === 1) {
            onBarcodeEnter({ ...results[0] });
            setSearchTerm('');
          }
        } catch (err) {
          showToast('danger', 'Error', 'Failed to lookup barcode');
        }
      } else if (!barcodeMode && products.length > 0 && selectedIndex >= 0) {
        onProductSelect(products[selectedIndex]);
        setSearchTerm('');
        setProducts([]);
        setSelectedIndex(-1);
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
    inputRef.current?.focus();
  };

  const toggleMode = (newMode) => {
    setBarcodeMode(newMode);
    setSearchTerm('');
    setProducts([]);
    setSelectedIndex(-1);
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

  // Dynamic background color based on mode
  const inputBgColor = barcodeMode 
    ? 'var(--lpos-barcode-bg, #34c759)'   // Light Green for Barcode
    : 'var(--lpos-search-bg, #0284c7)';   // Warm Blue for Search

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <div 
            className="relative flex items-center w-full border shadow-sm rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              background: inputBgColor,
              borderColor: barcodeMode ? '#34c759' : '#0284c7',
            }}
          >
            {/* Mode Toggle Button */}
            <div ref={buttonRef}>
              <button
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
          {!barcodeMode && (loading || products.length > 0) && (
            <div 
              className="absolute top-full mt-2 w-full shadow-2xl z-40 max-h-96 overflow-hidden"
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
                <table className="w-full">
                  <thead className="bg-[var(--lpos-surface)] border-b sticky top-0">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">SKU</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">Description</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => (
                      <tr
                        key={i}
                        onClick={() => {
                          onProductSelect(item);
                          setSearchTerm('');
                          setProducts([]);
                        }}
                        className={`cursor-pointer hover:bg-sky-50 transition-all ${selectedIndex === i ? 'bg-sky-100' : ''}`}
                      >
                        <td className="px-5 py-4 font-mono text-sm text-gray-600">{item.sku || '-'}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-800">{item.productDescription || item.productName}</td>
                        <td className="px-5 py-4 font-semibold text-sky-600">{formatCurrency(item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* No Results */}
          {!barcodeMode && searchTerm && !loading && products.length === 0 && searchTerm.length > 1 && (
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

export default ProductSearch;