import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { getProducts } from '../functions/register';
import DaisyUIPaginator from './DaisyUIPaginator';

const ProductSearch = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Function to fetch products based on search term
  const fetchProducts = debounce(async (searchTerm, page, limit) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filteredData = {
      productId: null,
      productNo: null,
      productName: searchTerm,
      barcode: null,
      categoryId: null,
      searchByKeyword: true,
      skip: page * limit,
      limit: limit,
    };

    try {
      const result = await getProducts(filteredData, null);
      setSearchResults(result.data.results[0] || []);
      setShowResults(true);
      setTotalRecords(result.data.outputValues.totalRows);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setShowResults(false);
    }
  }, 300);

  useEffect(() => {
    fetchProducts(searchTerm, currentPage, rowsPerPage);
  }, [searchTerm, currentPage, rowsPerPage]);

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
    fetchProducts(searchTerm, page, rows);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <i className="pi pi-search text-gray-500 sm:text-xl"></i>
      </div>
      <input
        type="text"
        placeholder="Barcode / Product Search"
        className="input input-bordered w-full pl-10"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 bg-white shadow-md rounded-md w-full mt-2 max-h-60 overflow-auto">
          <div className="table-container">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>Product No</th>
                  <th>Name</th>
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
                    <td>{product.productNo}</td>
                    <td>{product.productName}</td>
                    <td>{product.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="paginator-container fixed bottom-0 left-0 w-full bg-white p-4 shadow-md">
  {/* <DaisyUIPaginator
    currentPage={currentPage}
    rowsPerPage={rowsPerPage}
    totalRecords={totalRecords}
    onPageChange={onPageChange}
  /> */}
</div>

        </div>
      )}
    </div>
  );
};

export default ProductSearch;
