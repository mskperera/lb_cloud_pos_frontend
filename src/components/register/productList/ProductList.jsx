import React, { useState, useEffect } from 'react';
import ProductSearch from '../../ProductSearch';
import { getCategoryMenu, getProducts } from '../../../functions/register';
import { useDispatch } from 'react-redux';
import { addOrder } from '../../../state/orderList/orderListSlice';
import ProductItem from './productItem/ProductItem';
import DaisyUIPaginator from '../../../components/DaisyUIPaginator';
import './productList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);

  const handleCategorySelect = (e) => {
    setSelectedCategoryId(e.target.value);
    setCurrentPage(0);
    loadProducts(e.target.value, 0, rowsPerPage);
  };

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
    loadProducts(selectedCategoryId, page, rows);
  };

  const loadProducts = async (categoryId, page = 0, limit = rowsPerPage) => {
    const skip = page * limit;

    const filteredData = {
      productId: null,
      productNo: null,
      productName: null,
      barcode: null,
      categoryId: categoryId,
      searchByKeyword: false,
      skip: skip,
      limit: limit,
    };

    try {
      const _result = await getProducts(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);

      setProducts(_result.data.results[0] || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts(selectedCategoryId, currentPage, rowsPerPage);
  }, [selectedCategoryId, currentPage, rowsPerPage]);

  const loadCategories = async () => {
    const filteredData = {
      skip: null,
      limit: null,
    };
    try {
      const _result = await getCategoryMenu(filteredData, null);
      setCategories(_result.data.results[0] || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleProductClick = (p) => {
    const description = p.productName;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

    const order = {
      productNo: p.productNo,
      description,
      productId: p.productId,
      unitPrice,
      lineTaxRate: p.taxRate_perc,
      qty,
    };

    dispatch(addOrder(order));
  };

  return (
<div className="flex flex-col h-[87vh]">
  <div className="flex-none">
  <div className="mx-4 my-2 flex justify-between items-center gap-5">
          <ProductSearch onProductSelect={handleProductClick} />
          <select
            value={selectedCategoryId}
            onChange={handleCategorySelect}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="-1">All Categories</option>
            {categories.length > 0 && categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

  </div>
  <div className="flex-grow overflow-auto">
  <div className="flex flex-wrap gap-2 py-2 px-4">
            {products.length > 0 ? (
              products.map((p, index) => (
                <ProductItem key={index} p={p} handleProductClick={handleProductClick} />
              ))
            ) : (
              <div>No products found</div>
            )}
          </div>
  </div>
  <div className="flex justify-end px-4 py-4 mt-auto">
  <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
  </div>
</div>


   
  );
};

export default ProductList;
