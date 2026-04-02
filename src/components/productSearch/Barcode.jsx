import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProducts } from '../../functions/register';
import { useToast } from '../useToast';
import { FaBarcode, FaSearch } from 'react-icons/fa';
import { formatCurrency } from '../../utils/format';
import { XIcon } from 'lucide-react';

const ProductSearch = ({ onProductSelect, onBarcodeEnter,isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const showToast = useToast();

  // Fetch products for keyword search
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
        const { outputMessage, responseStatus } = result.data.outputValues;

        if (responseStatus === 'invalid') {
          showToast('warning', 'Exception', outputMessage);
          setProducts([]);
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

      if (barcodeMode && searchTerm) {
        const filteredData = {
          barcode: searchTerm,
          storeId: store.storeId,
          skip: 0,
          limit: 100,
        };

        try {
          const result = await getProducts(filteredData, null);

          if (result.data.error) {
            showToast('danger', 'Exception', result.data.error.message);
            return;
          }

          const { outputMessage, responseStatus } = result.data.outputValues;
          if (responseStatus === 'invalid') {
            showToast('warning', 'Exception', outputMessage);
            return;
          }

          const results = result.data.results[0] || [];

          if (results.length === 0) {
            showToast('warning', 'Not Found', 'Barcode not found.');
            return;
          }

          if (results.length > 1) {
            showToast('warning', 'Duplicate', 'Multiple products found with this barcode.');
            return;
          }

          onBarcodeEnter({ ...results[0] });
          setSearchTerm('');
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
      setMenuPosition({
        top: rect.top + rect.height,
        left: rect.left,
        width: rect.width,
      });
    }
    setShowModeMenu((prev) => !prev);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 w-full">
     

        {/* Search Input */}
        <div className="relative flex-1">
          <div className="relative flex items-center w-full bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition">
             {/* Mode Button (Icon Only + Arrow) */}
        <div ref={buttonRef} className="relative">
          <button
            onClick={handleToggleClick}
            className="flex items-center gap-2 px-4 py-4  rounded-lg  transition shadow-sm
            
            bg-white  text-gray-700  font-semibold hover:text-sky-800 hover:shadow-lg hover:bg-gray-50
            "
          >
            {barcodeMode ? <><FaBarcode className="text-xl" /> {!isMobile && ' Barcode'}</> : <><FaSearch className="text-xl" />  {!isMobile && ' Search'}</>}
            <svg
              className={`w-4 h-4 transition-transform ${showModeMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        

            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={barcodeMode ? 'Scan or enter barcode...' : 'Type product name or description...'}
              className="w-full py-4 pl-0 pr-12 text-base bg-transparent border-none focus:outline-none placeholder-gray-400"
            />

            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-4 text-gray-500 hover:text-red-600 transition z-10"
              >
              <XIcon />
              </button>
            )}
          </div>

          {/* Keyword Search Results Dropdown */}
          {!barcodeMode && (loading || products.length > 0) && (
            <div 
              className="absolute top-full mt-2 w-full shadow-2xl z-40 max-h-96 overflow-hidden"
    style={{
      background: "var(--lpos-bg)",
      borderRadius: "var(--lpos-radius-md)",
      border: "1px solid var(--lpos-border)",
      transition: "all 0.2s",
    }}
            >
              {loading ? (
                <div className="p-10 text-center">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Price</th>
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
                        className={`cursor-pointer transition-all hover:bg-sky-50 ${
                          selectedIndex === i ? 'bg-sky-100 ring-2 ring-sky-500 ring-inset' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">{item.sku || '-'}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.productDescription || item.productName}
                        </td>
                        <td className="px-4 py-3 font-semibold text-sky-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* No Results */}
          {!barcodeMode && searchTerm && !loading && products.length === 0 && searchTerm.length > 1 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-10 text-center text-gray-500 z-40">
              No products found for "<strong>{searchTerm}</strong>"
            </div>
          )}
        </div>
      </div>

      {/* Popup Menu with Blurred Backdrop */}
      {showModeMenu && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-start"
          onClick={() => setShowModeMenu(false)}
        >
          <div
            className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              minWidth: '200px', // Ensures full text width
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleMode(!barcodeMode)}
              className="flex items-center gap-3 w-full px-5 py-4 text-left hover:bg-sky-50 transition font-medium text-gray-700 whitespace-nowrap"
            >
              {barcodeMode ? (
                <>
                  <FaSearch className="text-xl text-sky-600" />
                  Switch to Search Mode
                </>
              ) : (
                <>
                  <FaBarcode className="text-xl text-sky-600" />
                  Switch to Barcode Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;