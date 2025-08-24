import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProductsAllVariations } from '../../functions/register';
import { useToast } from '../useToast';
import AdvancedProductSearch from '../AdvancedProductSearch';
import DialogModel from '../model/DialogModel';

const ProductSearch = ({ onProductSelect, onBarcodeEnter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeMode, setBarcodeMode] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const searchRef = useRef(null);
  const showToast = useToast();

  const fetchProducts = async (searchTerm) => {
    if (!store?.storeId) {
      showToast("danger", "Error", "No store selected");
      return;
    }

    if (!barcodeMode && searchTerm.length < 2) {
      showToast("danger", "Error", "SKU must be at least 2 characters");
      return;
    }

    const filteredData = {
      sku: barcodeMode ? null : searchTerm,
      barcode: barcodeMode ? searchTerm : null,
      storeId: store.storeId,
    };

    try {
      const result = await getProductsAllVariations(filteredData, null);
      const results = result.data.results[0] || [];
      if (results.length > 0) {
        if (barcodeMode) {
          onBarcodeEnter({ sku: searchTerm, productName: searchTerm, unitPrice: 0 });
        } else {
          onProductSelect(results[0]);
        }
      } else {
        showToast("danger", "Error", `No product found for ${barcodeMode ? 'barcode' : 'SKU'}: ${searchTerm}`);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast("danger", "Error", `Failed to fetch product for ${barcodeMode ? 'barcode' : 'SKU'}: ${searchTerm}`);
    }
  };

  const debouncedFetchProducts = useCallback(
    debounce((searchTerm) => {
      fetchProducts(searchTerm);
    }, 500),
    [barcodeMode, store]
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      debouncedFetchProducts.cancel(); // Cancel any pending debounced calls
      fetchProducts(searchTerm);
      setSearchTerm(''); // Clear input after Enter
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const toggleSearchMode = () => {
    setBarcodeMode((prev) => !prev);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        setShowAdvancedSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex items-center w-full bg-white border border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition duration-200">
          <i className="pi pi-search text-gray-600 text-lg absolute left-3"></i>
          <input
            type="text"
            className="w-full py-3 pl-10 pr-10 text-base bg-transparent border-none focus:outline-none placeholder-gray-400"
            placeholder={barcodeMode ? 'Scan Barcode' : 'Enter SKU'}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              className="absolute right-3 text-gray-500 hover:text-gray-700"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <i className="pi pi-times text-base"></i>
            </button>
          )}
        </div>
      
        {/* <button
          type="button"
          onClick={toggleSearchMode}
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
        >
          <span className={`pi ${barcodeMode ? 'pi-qrcode' : 'pi-search'} text-base`}></span>
          <span className="ml-2">{barcodeMode ? 'Barcode Mode' : 'SKU Search'}</span>
        </button> */}
        <button
          type="button"
          onClick={() => setShowAdvancedSearch(true)}
          className="flex items-center px-4 py-2 text-sm  rounded-lg bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
        >
          <span className="pi pi-filter text-base"></span>
          <span className="ml-2">Item Lookup</span>
        </button>
      </div>
      {showAdvancedSearch && (
        <DialogModel
          header="Advanced Product Search"
          visible={showAdvancedSearch}
          onHide={() => setShowAdvancedSearch(false)}
        >
          <AdvancedProductSearch
            visible={showAdvancedSearch}
            onHide={() => setShowAdvancedSearch(false)}
            onProductSelect={(product) => {
              onProductSelect(product);
              setShowAdvancedSearch(false);
            }}
          />
        </DialogModel>
      )}
    </div>
  );
};

export default ProductSearch;