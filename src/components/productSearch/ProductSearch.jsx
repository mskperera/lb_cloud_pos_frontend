import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import AdvancedProductSearch from '../AdvancedProductSearch';
import Barcode from "./Barcode";

const ProductSearch = ({ 
  onProductSelect, 
  onBarcodeEnter, 
  showOnlyProductItems, 
  hideButton,
  showAdvancedSearcho,
  hideSearchBox,
  onlyAllowToSelectStockTrackedProduct 
}) => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (showAdvancedSearcho) {
      setShowAdvancedSearch(true);
    }
  }, [showAdvancedSearcho]);

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

  // Safe wrapper for barcode handler
  const handleBarcodeEntered = (product) => {
    if (typeof onBarcodeEnter === 'function') {
      onBarcodeEnter(product);
    } else if (typeof onProductSelect === 'function') {
      // Fallback: select product directly when no explicit barcode handler is passed
      onProductSelect(product);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full">
        <div className="flex-1">
          <Barcode 
            onProductSelect={onProductSelect} 
            onBarcodeEnter={handleBarcodeEntered} 
            onlyAllowToSelectStockTrackedProduct={onlyAllowToSelectStockTrackedProduct}
              uomType={"PURCHASE"}
          />
        </div>

        {!hideButton && (
          <div className="sm:w-auto">
            <button
              type="button"
              onClick={() => setShowAdvancedSearch(true)}
              className="w-full sm:w-auto flex font-semibold items-center justify-center px-4 py-4 text-sm rounded-lg btn-primary text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
            >
              <span className="ml-2">Advanced Search</span>
            </button>
          </div>
        )}
      </div>

      {showAdvancedSearch && createPortal(
        <AdvancedProductSearch
          visible={showAdvancedSearch}
          onHide={() => setShowAdvancedSearch(false)}
          onProductSelect={(product) => {
            if (typeof onProductSelect === 'function') {
              onProductSelect(product);
            }
            setShowAdvancedSearch(false);
          }}
          showOnlyProductItems={showOnlyProductItems}
          onlyAllowToSelectStockTrackedProduct={onlyAllowToSelectStockTrackedProduct}
        />,
        document.body
      )}
    </div>
  );
};

export default ProductSearch;