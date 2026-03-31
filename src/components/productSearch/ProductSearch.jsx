import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProductsAllVariations } from '../../functions/register';
import { useToast } from '../useToast';
import AdvancedProductSearch from '../AdvancedProductSearch';
import DialogModel from '../model/DialogModel';
import Barcode from "./Barcode";

const ProductSearch = ({ onProductSelect, onBarcodeEnter, showOnlyProductItems, hideButton,showAdvancedSearcho,hideSearchBox }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeMode, setBarcodeMode] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const searchRef = useRef(null);
  const showToast = useToast();
 
  useEffect(()=>{
    if(showAdvancedSearcho)
    setShowAdvancedSearch(true)
  },[showAdvancedSearcho])

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





  
  const handleBarcodeEnter = (p) => {
    const description = `${p.productName}`;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

    const order = {
      productNo: p.productNo,
      description,
      productId: p.productTypeId === 2 ? p.variationProductId : p.productId,
      unitPrice,
      productTypeId: p.productTypeId,
      lineTaxRate: p.taxPerc,
      qty,
    };
   // dispatch(addOrder(order));
  };



  return (
    <div ref={searchRef} className="relative w-full ">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full">

        <div className='flex-1'>
    <Barcode onProductSelect={onProductSelect} onBarcodeEnter={onBarcodeEnter} />
 </div>

        <div className='sm:w-auto'>
      {!hideButton ? <button
          type="button"
          onClick={() => setShowAdvancedSearch(true)}
          className="w-full sm:w-auto flex font-semibold items-center justify-center px-4 py-4 text-sm rounded-lg btn-primary text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
        >
          <span className="ml-2">Advanced Search</span>
        </button>:null}
      </div>
</div>

    
          <AdvancedProductSearch
            visible={showAdvancedSearch}
            onHide={() => setShowAdvancedSearch(false)}
            onProductSelect={(product) => {
              onProductSelect(product);
              setShowAdvancedSearch(false);
            }}
            showOnlyProductItems={showOnlyProductItems}
          />
 
    </div>
  );
};

export default ProductSearch;