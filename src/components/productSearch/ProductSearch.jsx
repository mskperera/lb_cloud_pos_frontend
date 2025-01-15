import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { getProductsAllVariations } from '../../functions/register';
import { useNavigate } from 'react-router-dom';

const ProductSearch = ({ onProductSelect,onBarcodeEnter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState(false);
  const store = JSON.parse(localStorage.getItem('selectedStore'));
  const navigate = useNavigate();
  const searchRef = useRef(null); // Reference for the search container

  const fetchProducts = async (searchTerm, page, limit) => {
    if (searchTerm.length < 2 && !barcodeMode) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filteredData = {
      productId: null,
      productNo: null,
      productName: null,
      sku: null,
      barcode: barcodeMode ? searchTerm : null,
      allSearchableFields: barcodeMode ? null : searchTerm,
      categoryId: null,
      searchByKeyword: !barcodeMode,
      storeId: store.storeId,
      skip: page * limit,
      limit: limit,
    };

    setLoading(true);
    setTimeout(async () => {
      try {
        const result = await getProductsAllVariations(filteredData, null);
        setSearchResults(result.data.results[0] || []);
        setShowResults(true);
        setTotalRecords(result.data.outputValues.totalRows);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const debouncedFetchProducts = useCallback(
    debounce((searchTerm, page, limit) => {
      fetchProducts(searchTerm, page, limit);
    }, 1000),
    [barcodeMode]
  );

  useEffect(() => {
    debouncedFetchProducts(searchTerm, currentPage, rowsPerPage);

    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [searchTerm, currentPage, rowsPerPage, debouncedFetchProducts]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProductClick = (product) => {
    onProductSelect(product);
    setShowResults(false);
    setSearchTerm('');
  };

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchProducts(searchTerm, currentPage, rowsPerPage);
    }
  };

  const toggleBarcodeMode = () => {
    setBarcodeMode((prev) => !prev);
    setSearchTerm('');
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full m-0 p-0">
      <div className="flex gap-2 w-full">
        <div
          className="relative flex items-center border border-gray-200 rounded-lg bg-white focus-within:ring-2
        focus-within:ring-sky-500 focus-within:border-sky-500 m-0 p-0 w-full"
        >
          <i className="pi pi-search text-gray-500 text-lg absolute left-3"></i>
          <input
            type="text"
            style={{ margin: 0, marginLeft: '22px' }}
            className="w-full py-3 pl-10 pr-4 text-sm bg-white border-none rounded-lg focus:outline-none"
            placeholder={barcodeMode ? 'Scan Barcode' : 'SKU / Product Details'}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />



        </div>

        <div
          className="flex gap-2 items-center "
        >
<button
  type="button"
  onClick={() => {
    setBarcodeMode(true);
    setSearchTerm('');
  }} // Set barcode mode directly
  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all border focus:outline-none focus:ring
    ${barcodeMode ? 'bg-sky-500 text-white border-sky-500 hover:bg-sky-600' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
>
  <span className="pi pi-qrcode text-lg"></span>
</button>

<button
  type="button"
  onClick={() => {
    setBarcodeMode(false);
    setSearchTerm('');
  }} // Set SKU/product details mode directly
  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all border focus:outline-none focus:ring
    ${!barcodeMode ? 'bg-sky-500 text-white border-sky-500 hover:bg-sky-600' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
>
  <span className="pi pi-search text-lg"></span>
</button>



</div>

      </div>

      {showResults && (
        <div className="absolute z-20 bg-white shadow-md rounded-md w-full mt-2 max-h-60 overflow-auto">
          {searchResults.length > 0 ? (
            <div className="table-container">
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((product, index) => (
                    <tr
                      key={index}
                      className="hover cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <td>{product.sku}</td>
                      <td>{product.productName}</td>
                      <td>{product.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">Items not found</div>
          )}
          {loading && (
            <div className="text-center text-gray-500 py-4">Searching...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
