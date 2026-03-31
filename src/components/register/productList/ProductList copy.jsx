import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  getCategoryMenu,
  getProductExtraDetails,
  getProductsPosMenu,
  getVariationProductDetails,
} from "../../../functions/register";
import { useDispatch } from "react-redux";
import { addOrder } from "../../../state/orderList/orderListSlice";
import ProductItem from "./productItem/ProductItem";
import DaisyUIPaginator from "../../../components/DaisyUIPaginator";
import DialogModel from "../../model/DialogModel";
import { formatCurrency } from "../../../utils/format";
import { FaPalette, FaSearch, FaTag } from "react-icons/fa";



// const CategoryItem = ({ c, handleProductClick,selectedCategoryId }) => {

//   return (
// <div
//   className={`rounded-lg cursor-pointer
//    hover:bg-orange-100 p-2 border-2 border-gray-200 text-center flex  justify-center items-center ${c.categoryId===selectedCategoryId && 'border-orange-600 bg-orange-200'}`}
//   onClick={() => handleProductClick(c)}
// >
//   {c.categoryName}
// </div>

//   );
// };

const CategoryItem = ({ c, handleProductClick, selectedCategoryId }) => {
  const isSelected = c.categoryId === selectedCategoryId;

  return (
    <div
      onClick={() => handleProductClick(c)}
      className={`
        relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer
        transition-all duration-300 group
        ${isSelected 
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30' 
          : 'bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300'
        }

        active:scale-95 

      `}
    >
      {/* Icon / Avatar */}
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg
        transition-all duration-300
        ${isSelected 
          ? 'bg-white/20 text-white shadow-lg' 
          : 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 group-hover:from-orange-200 group-hover:to-orange-300'
        }
      `}>
        {c.categoryName.charAt(0).toUpperCase()}
      </div>

      {/* Category Name */}
      <span className={`
        font-semibold text-base tracking-wide flex-1
        ${isSelected ? 'text-white' : 'text-gray-800 group-hover:text-orange-700'}
      `}>
        {c.categoryName}
      </span>

      {/* Right Arrow / Active Indicator */}
      <div className="flex items-center">
        {isSelected ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {/* Active Left Border */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full" />
      )}
    </div>
  );
};
const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalRecords, setTotalRecords] = useState(10);

  const [selectedVariationProducts, setSelectedVariationProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [variationLevel, setVariationLevel] = useState(0);
  const [variationPath, setVariationPath] = useState([]);
  const [currentVariations, setCurrentVariations] = useState([]);

  const [saleType, setSaleType] = useState("products");
  const [productListLoading, setIsProductListLoading] = useState(false);
  const [isVariationSelectionMenuShow, setIsVariationSelectionMenuShow] = useState(false);

  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const terminalId = localStorage.getItem("terminalId");
  

  const handleCategorySelect = (c) => {
    setSelectedCategoryId(c.categoryId);
    setCurrentPage(0);
    loadProducts(c.categoryId, 0, rowsPerPage);
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
      storeId: store.storeId,
      terminalId:terminalId,
      searchByKeyword: false,
       skip: skip,
       limit: limit,
    };

    try {
      setIsProductListLoading(true);
      const _result = await getProductsPosMenu(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      setProducts(_result.data.results[0] || []);
      setIsProductListLoading(false);
    } catch (error) {
      setIsProductListLoading(false);
      console.error("Error loading products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    if (selectedCategoryId && products.length === 0) {
      loadProducts(selectedCategoryId, currentPage, rowsPerPage);
    }
  }, [selectedCategoryId, currentPage, rowsPerPage]);

  const loadCategories = async () => {
    const filteredData = { skip: null, limit: null };
    try {
      const _result = await getCategoryMenu(filteredData, null);
      setCategories(_result.data.results[0] || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const getVariationTypes = (variations) => {
    const variationTypes = new Set();
    variations.forEach((variation) => {
      JSON.parse(variation.variationValues).forEach((v) => {
        variationTypes.add(v.variationTypeName);
      });
    });
    return Array.from(variationTypes);
  };

  const getVariationValuesForType = (variations, type, path) => {
    const filteredVariations = variations.filter((variation) => {
      const values = JSON.parse(variation.variationValues);
      return path.every((p, i) => {
        const valueAtLevel = values.find((v) => v.variationTypeName === p.type);
        return valueAtLevel && valueAtLevel.variationValue === p.value;
      });
    });

    if (type === getVariationTypes(variations)[getVariationTypes(variations).length - 1]) {
      return filteredVariations;
    }

    const values = new Set();
    filteredVariations.forEach((variation) => {
      const value = JSON.parse(variation.variationValues).find(
        (v) => v.variationTypeName === type
      );
      if (value) values.add(value.variationValue);
    });
    return Array.from(values);
  };

  const handleProductClick = async (p) => {
    const description = p.productName;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);
console.log('produckkkkkkkkkkkkts');
    if (p.productTypeId === 2) {
      const payload = { productId: p.productId, storeId: store.storeId };
      try {
        const details = await getVariationProductDetails(payload);
        const variations = details.data.results[0] || [];

console.log('product000000',p);
        if (!variations[0].variationValues) {
          // If no variations or variations is not an array, add directly to order
          const order = {
            productNo: p.productNo,
            sku: variations[0].sku,
            description,
            productId: p.productId,
            productTypeId: p.productTypeId,
            unitPrice:variations[0].unitPrice,
            lineTaxRate: variations[0].taxPerc,
            qty,
            measurementUnitName: p.measurementUnitName,
            stockQty: p.isStockTracked ? p.stockQty : undefined,
            imageUrl:p.imageUrl
          };
          dispatch(addOrder(order));
        } else {
          // If variations exist, show dialog and set up variation selection
          setIsVariationSelectionMenuShow(true);
          setSelectedVariationProducts(variations);
          setSelectedProduct(p);
          setVariationLevel(0);
          setVariationPath([]);
          setCurrentVariations(
            getVariationValuesForType(variations, getVariationTypes(variations)[0], [])
          );
        }
      } catch (error) {
        console.error("Error fetching variation details:", error);
        // Handle error by adding product as a single item
        const order = {
          productNo: p.productNo,
          sku: p.sku,
          description,
          productId: p.productId,
          productTypeId: p.productTypeId,
          unitPrice,
          lineTaxRate: p.taxPerc,
          qty,
          measurementUnitName: p.measurementUnitName,
          stockQty: p.isStockTracked ? p.stockQty : undefined,
               imageUrl:p.imageUrl
        };
        dispatch(addOrder(order));
      }
    } else if (p.productTypeId === 1 || p.productTypeId === 3) {
      const order = {
        productNo: p.productNo,
        sku: p.sku,
        description,
        productId: p.productId,
        productTypeId: p.productTypeId,
        unitPrice,
        lineTaxRate: p.taxPerc,
        qty,
        measurementUnitName: p.measurementUnitName,
        stockQty: p.isStockTracked ? p.stockQty : undefined,
             imageUrl:p.imageUrl
      };
      dispatch(addOrder(order));
    }
  };

  const handleVariationSelect = (value, type) => {
    const newPath = [...variationPath, { type, value }];
    setVariationPath(newPath);
    const variationTypes = getVariationTypes(selectedVariationProducts);
    const nextLevel = variationLevel + 1;

    setVariationLevel(nextLevel);
    setCurrentVariations(
      getVariationValuesForType(selectedVariationProducts, variationTypes[nextLevel], newPath)
    );
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = variationPath.slice(0, index + 1);
    setVariationPath(newPath);
    setVariationLevel(index + 1);
    const variationTypes = getVariationTypes(selectedVariationProducts);
    if (index + 1 < variationTypes.length) {
      setCurrentVariations(
        getVariationValuesForType(selectedVariationProducts, variationTypes[index + 1], newPath)
      );
    } else {
      setCurrentVariations(
        getVariationValuesForType(selectedVariationProducts, variationTypes[index], newPath)
      );
    }
  };

  const handleBack = () => {
    const variationTypes = getVariationTypes(selectedVariationProducts);
    if (variationLevel === 0) {
      setVariationLevel(0);
      setVariationPath([]);
      setCurrentVariations(
        getVariationValuesForType(selectedVariationProducts, variationTypes[0], [])
      );
    } else {
      const newPath = variationPath.slice(0, variationLevel - 1);
      setVariationPath(newPath);
      setVariationLevel(variationLevel - 1);
      const targetType = variationTypes[variationLevel - 1] || variationTypes[0];
      setCurrentVariations(
        getVariationValuesForType(selectedVariationProducts, targetType, newPath)
      );
    }
  };

  const handleProductVariationClick = async (p, selectedProduct) => {
    const qty = 1;
    const unitPrice = Number(p.unitPrice);
    const v = JSON.parse(p.variationValues)
      // .map((v) => `${v.variationTypeName}: ${v.variationValue}`)
        .map((v) => ` ${v.variationValue}`)
      .join(" | ");
    const order = {
      productNo: selectedProduct.productNo,
      sku: p.sku,
      description: `${selectedProduct.productName} ${v}`,
      productId: p.variationProductId,
      productTypeId: selectedProduct.productTypeId,
      unitPrice: unitPrice,
      lineTaxRate: p.taxPerc,
      qty,
      measurementUnitName: selectedProduct.measurementUnitName,
      stockQty: selectedProduct.isStockTracked ? p.stockQty : undefined,
             imageUrl:selectedProduct.imageUrl
    };
    dispatch(addOrder(order));
    setIsVariationSelectionMenuShow(false);
  };

  function useContainerWidth(ref) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

  const containerRef = useRef();
  const width = useContainerWidth(containerRef);

  // You can define breakpoints however you like
  let cols = 4;
    if (width < 500) cols = 2;
  if (width < 600) cols = 3;
  else if (width < 900) cols = 4;
  else cols = 4;
  return (

    <>



    <DialogModel
  header={
    <div className="flex items-center gap-2">
      <FaPalette className="h-5 w-5 text-white" />
      <span className="font-semibold text-lg">{selectedProduct.productName}</span>
    </div>
  }
  visible={isVariationSelectionMenuShow}
  onHide={() => setIsVariationSelectionMenuShow(false)}
  className="w-full max-w-4xl"
>
  <div className="p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl">
    {/* Breadcrumb Navigation */}
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
      <button
        onClick={handleBack}
        className="p-1.5 rounded-full hover:bg-sky-100 transition-colors"
        title="Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-sky-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => {
          setVariationLevel(0);
          setVariationPath([]);
          setCurrentVariations(
            getVariationValuesForType(
              selectedVariationProducts,
              getVariationTypes(selectedVariationProducts)[0],
              []
            )
          );
        }}
        className="px-2 py-1 rounded-md hover:bg-sky-100 hover:text-sky-600 transition-all font-medium"
      >
       {selectedProduct.productName}
      </button>

      {variationPath.map((p, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => handleBreadcrumbClick(index)}
            className="px-2 py-1 rounded-md hover:bg-sky-100 hover:text-sky-600 transition-all font-medium capitalize"
          >
            {p.value}
          </button>
        </React.Fragment>
      ))}
    </nav>

    {/* Variation Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {currentVariations.length > 0 ? (
        variationLevel < getVariationTypes(selectedVariationProducts).length - 1 ? (
          /* === Option Level (e.g., Size, Color) === */
          currentVariations.map((value, index) => (
            <div
              key={index}
              onClick={() =>
                handleVariationSelect(
                  value,
                  getVariationTypes(selectedVariationProducts)[variationLevel]
                )
              }
              className={`
                group relative overflow-hidden
                bg-white/70 backdrop-blur-sm
                rounded-xl p-5 cursor-pointer
                border border-gray-200
                transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-lg hover:border-sky-400
                hover:bg-gradient-to-br hover:from-sky-50 hover:to-white
                active:scale-95
              `}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                  <FaTag className="h-6 w-6 text-sky-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm tracking-tight">
                  {value}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* === Final Variation Level (SKU, Price, Stock) === */
          currentVariations.map((p, index) => {
            const variationLabel = JSON.parse(p.variationValues)
              .map(v => v.variationValue)
              .join(" • ");

            return (
              <div
                key={index}
                onClick={() => handleProductVariationClick(p, selectedProduct)}
                className={`
                  group relative overflow-hidden
                  bg-white rounded-xl p-4 cursor-pointer
                  border-2 transition-all duration-300
                  hover:border-sky-400
                  active:scale-95
                `}
              >
                {/* Stock Badge */}
                {selectedProduct.isStockTracked ? (
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold
                    ${p.stockQty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {/* {p.stockQty > 0 ? `${p.stockQty} left` : 'Out'} */}
                  </div>
                ):''}

                {/* SKU */}
                <p className="text-xs text-gray-500 font-mono mb-1">
                  {p.sku || "N/A"}
                </p>

                {/* Variation Label */}
                <p className="text-sm font-medium text-gray-700 line-clamp-2 mb-2">
                  {variationLabel}
                </p>

                {/* Price */}
                <p className="text-lg font-bold text-gray-800 text-center">
                  {formatCurrency(p.unitPrice, true)}
                </p>

                {/* Hover Indicator */}
                <div className="absolute inset-0 bg-sky-500 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
              </div>
            );
          })
        )
      ) : (
        /* === Empty State === */
        <div className="col-span-full text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FaSearch className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No variations found</p>
          <p className="text-sm text-gray-400 mt-1">Try selecting different options</p>
        </div>
      )}
    </div>
  </div>
</DialogModel>
 
    <div className="grid grid-cols-12  pl-5  h-[80vh]">
   
       {totalRecords>rowsPerPage && <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        /> }

<div className="col-span-3 mt-3 flex flex-col h-full bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-inner border border-gray-200 overflow-hidden">
  {/* This div takes full remaining height and enables scrolling */}
  <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-6 min-h-0">
    <div className="space-y-3">

      {/* Category List */}
      {categories?.map((c) => (
        <CategoryItem
          key={c.categoryId}
          c={c}
          handleProductClick={handleCategorySelect}
          selectedCategoryId={selectedCategoryId}
        />
      ))}
    </div>
  </div>
</div>


    {/* <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        /> 
        
        <select
          value={selectedCategoryId}
          style={{ margin: 0 }}
          onChange={handleCategorySelect}
          className="w-full max-w-xs px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
        >
          <option value="-1">All Categories</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
        </select> */}

   <div className="col-span-9 w-full overflow-auto custom-scrollbar my-2 p-2 rounded-lg">
  {!productListLoading ? (
    <div className="grid gap-2 grid-cols-4 md:grid-cols-4">
      {products.length > 0 ? (
        products.map((p, index) => (
          <ProductItem key={index} p={p} handleProductClick={handleProductClick} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center h-64 text-center p-6 rounded-lg text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 014-4h6a4 4 0 014 4h-1a4 4 0 00-4 4v2m-6 0h6"
            />
          </svg>
          <span className="text-lg font-semibold">No products found</span>
          <span className="text-sm text-gray-400">Try adjusting your search or filter</span>
        </div>
      )}
    </div>
  ) : (
    <div className="flex justify-center items-center h-[80vh] text-lg font-semibold text-gray-600">
      Please wait, loading products...
    </div>
  )}
</div>

    </div>
  
         </>
  );
};

export default ProductList;
