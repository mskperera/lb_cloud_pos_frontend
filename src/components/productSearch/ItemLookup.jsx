import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProductsAllVariations } from '../../functions/register';
import { useToast } from '../useToast';
import AdvancedProductSearch from '../AdvancedProductSearch';
import DialogModel from '../model/DialogModel';

const ProductSearch = ({ onProductSelect, onBarcodeEnter, showOnlyProductItems,hideSearchBox }) => {
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
      debouncedFetchProducts.cancel();
      fetchProducts(searchTerm);
      setSearchTerm('');
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
    <div ref={searchRef} className="">


           <button
          type="button"
      onClick={() => setShowAdvancedSearch(true)}
           className="flex items-center px-4 h-16 font-bold py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
        >
             <span className="ml-2 font-bold">Item Lookup</span>
     
        </button>



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
            showOnlyProductItems={showOnlyProductItems}
          />
        </DialogModel>
      )}
    </div>
  );
};

export default ProductSearch;