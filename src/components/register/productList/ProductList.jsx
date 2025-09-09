import React, { useState, useEffect, useCallback } from "react";
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

const ProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
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
      storeId: store.storeId,
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
console.log('variations',variations);
console.log('products',p);
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
    };
    dispatch(addOrder(order));
    setIsVariationSelectionMenuShow(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <DialogModel
        header={selectedProduct.productName}
        visible={isVariationSelectionMenuShow}
        onHide={() => setIsVariationSelectionMenuShow(false)}
      >
        <div className="flex flex-col gap-4 px-4 m-0 p-0 min-w-[50vw] min-h-[50vh] overflow-auto">
          <div className="flex items-center gap-2 text-sm mb-4 text-gray-600">
            <button
              onClick={handleBack}
              className="btn btn-sm btn-ghost text-sky-600 hover:bg-sky-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span
              className="cursor-pointer hover:text-sky-500"
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
            >
              Home
            </span>
         
            {variationPath.map((p, index) => (
              <span key={index} className="flex items-center gap-2">
                <span> / </span>
                <span
                  className="cursor-pointer hover:text-sky-500"
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {p.type}: {p.value}
                </span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {currentVariations.length > 0 ? (
              variationLevel < getVariationTypes(selectedVariationProducts).length - 1 ? (
                currentVariations.map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full  md:w-[188px] items-center justify-between rounded-lg cursor-pointer py-4 px-3 bg-[#f0faff] border-gray-200 sky-500 shadow-md border hover:border-sky-500 hover:shadow-xl transition duration-300"
                    onClick={() =>
                      handleVariationSelect(
                        value,
                        getVariationTypes(selectedVariationProducts)[variationLevel]
                      )
                    }
                  >
                    <p className="font-medium text-gray-700">{value}</p>
                  </div>
                ))
              ) : (
                currentVariations.map((p, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full md:w-[188px] items-center justify-between rounded-lg cursor-pointer py-4 px-3 bg-white shadow-lg border hover:border-sky-500 hover:shadow-xl transition duration-300"
                    onClick={() => {
                      handleProductVariationClick(p, selectedProduct);
                    }}
                  >
                    <div className="w-full text-xs text-gray-500 text-left mb-2">
                      <span className="font-semibold">SKU:</span> {p.sku || "N/A"}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {
                        JSON.parse(p.variationValues).find(
                          (v) => v.variationTypeName === getVariationTypes(selectedVariationProducts)[variationLevel]
                        )?.variationValue
                      }
                    </p>
                    <p className="text-lg font-bold text-center text-gray-800">
                      {formatCurrency(p.unitPrice, true)}
                    </p>
                    {selectedProduct.isStockTracked ? (
                      <p className="text-sm font-medium mt-2">
                        {p.stockQty > 0 ? `${p.stockQty} in stock` : "Out of stock"}
                      </p>
                    ) : null}
                  </div>
                ))
              )
            ) : (
              <div className="text-gray-500 text-center w-full">No items found</div>
            )}
          </div>
       
        </div>
      </DialogModel>

      <div className="px-4 pt-2 flex justify-between gap-5 m-0 p-0">
        <DaisyUIPaginator
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
        </select>
      </div>

      <div className="overflow-auto max-h-[70vh] m-0 p-2 rounded-lg">
        {!productListLoading ? (
          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 px-4 m-0 p-0 sm:grid-cols-2">
            {products.length > 0 ? (
              products.map((p, index) => (
                <ProductItem key={index} p={p} handleProductClick={handleProductClick} />
              ))
            ) : (
              <div>No products found</div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[80vh] text-lg font-semibold text-gray-600">
            Please wait, loading products...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   getCategoryMenu,
//   getProductExtraDetails,
//   getProductsPosMenu,
//   getVariationProductDetails,
// } from "../../../functions/register";
// import { useDispatch } from "react-redux";
// import { addOrder } from "../../../state/orderList/orderListSlice";
// import ProductItem from "./productItem/ProductItem";
// import DaisyUIPaginator from "../../../components/DaisyUIPaginator";
// import DialogModel from "../../model/DialogModel";
// import { formatCurrency } from "../../../utils/format";

// const ProductList = () => {
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(30);
//   const [totalRecords, setTotalRecords] = useState(10);

//   const [selectedVariationProducts, setSelectedVariationProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [variationLevel, setVariationLevel] = useState(0);
//   const [variationPath, setVariationPath] = useState([]);
//   const [currentVariations, setCurrentVariations] = useState([]);

//   const [saleType, setSaleType] = useState("products");
//   const [productListLoading, setIsProductListLoading] = useState(false);
//   const [isVariationSelectionMenuShow, setIsVariationSelectionMenuShow] = useState(false);

//   const store = JSON.parse(localStorage.getItem("selectedStore"));

//   const handleCategorySelect = (e) => {
//     setSelectedCategoryId(e.target.value);
//     setCurrentPage(0);
//     loadProducts(e.target.value, 0, rowsPerPage);
//   };

//   const onPageChange = ({ page, rows }) => {
//     setCurrentPage(page);
//     setRowsPerPage(rows);
//     loadProducts(selectedCategoryId, page, rows);
//   };

//   const loadProducts = async (categoryId, page = 0, limit = rowsPerPage) => {
//     const skip = page * limit;
//     const filteredData = {
//       productId: null,
//       productNo: null,
//       productName: null,
//       barcode: null,
//       categoryId: categoryId,
//       storeId: store.storeId,
//       searchByKeyword: false,
//       skip: skip,
//       limit: limit,
//     };

//     try {
//       setIsProductListLoading(true);
//       const _result = await getProductsPosMenu(filteredData, null);
//       const { totalRows } = _result.data.outputValues;
//       setTotalRecords(totalRows);
//       setProducts(_result.data.results[0] || []);
//       setIsProductListLoading(false);
//     } catch (error) {
//       setIsProductListLoading(false);
//       console.error("Error loading products:", error);
//       setProducts([]);
//     }
//   };

//   useEffect(() => {
//     if (selectedCategoryId && products.length === 0) {
//       loadProducts(selectedCategoryId, currentPage, rowsPerPage);
//     }
//   }, [selectedCategoryId, currentPage, rowsPerPage]);

//   const loadCategories = async () => {
//     const filteredData = { skip: null, limit: null };
//     try {
//       const _result = await getCategoryMenu(filteredData, null);
//       setCategories(_result.data.results[0] || []);
//     } catch (error) {
//       console.error("Error loading categories:", error);
//       setCategories([]);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const getVariationTypes = (variations) => {
//     const variationTypes = new Set();
//     variations.forEach((variation) => {
//       JSON.parse(variation.variationValues).forEach((v) => {
//         variationTypes.add(v.variationTypeName);
//       });
//     });
//     return Array.from(variationTypes);
//   };

//   const getVariationValuesForType = (variations, type, path) => {
//     const filteredVariations = variations.filter((variation) => {
//       const values = JSON.parse(variation.variationValues);
//       return path.every((p, i) => {
//         const valueAtLevel = values.find((v) => v.variationTypeName === p.type);
//         return valueAtLevel && valueAtLevel.variationValue === p.value;
//       });
//     });

//     if (type === getVariationTypes(variations)[getVariationTypes(variations).length - 1]) {
//       return filteredVariations;
//     }

//     const values = new Set();
//     filteredVariations.forEach((variation) => {
//       const value = JSON.parse(variation.variationValues).find(
//         (v) => v.variationTypeName === type
//       );
//       if (value) values.add(value.variationValue);
//     });
//     return Array.from(values);
//   };

//   const handleProductClick = async (p) => {
//     const description = p.productName;
//     const qty = 1;
//     const unitPrice = Number(p.unitPrice);

//     if (p.productTypeId === 2) {
//       setIsVariationSelectionMenuShow(true);
//       const payload = { productId: p.productId, storeId: store.storeId };
//       const details = await getVariationProductDetails(payload);
//       const variations = details.data.results[0];
//       console.log('getVariationProductDetails',variations)
//       setSelectedVariationProducts(variations);
//       setSelectedProduct(p);
//       setVariationLevel(0);
//       setVariationPath([]);
//       setCurrentVariations(
//         getVariationValuesForType(variations, getVariationTypes(variations)[0], [])
//       );
//     }

//     if (p.productTypeId === 1 || p.productTypeId === 3) {
//       const order = {
//         productNo: p.productNo,
//         sku: p.sku,
//         description,
//         productId: p.productId,
//         productTypeId: p.productTypeId,
//         unitPrice,
//         lineTaxRate: p.taxPerc,
//         qty,
//         measurementUnitName: p.measurementUnitName,
//       };
//       dispatch(addOrder(order));
//     }
//   };

//   const handleVariationSelect = (value, type) => {
//     const newPath = [...variationPath, { type, value }];
//     setVariationPath(newPath);
//     const variationTypes = getVariationTypes(selectedVariationProducts);
//     const nextLevel = variationLevel + 1;

//     setVariationLevel(nextLevel);
//     setCurrentVariations(
//       getVariationValuesForType(selectedVariationProducts, variationTypes[nextLevel], newPath)
//     );
//   };

//   const handleBreadcrumbClick = (index) => {
//     const newPath = variationPath.slice(0, index + 1);
//     setVariationPath(newPath);
//     setVariationLevel(index + 1);
//     const variationTypes = getVariationTypes(selectedVariationProducts);
//     if (index + 1 < variationTypes.length) {
//       setCurrentVariations(
//         getVariationValuesForType(selectedVariationProducts, variationTypes[index + 1], newPath)
//       );
//     } else {
//       setCurrentVariations(
//         getVariationValuesForType(selectedVariationProducts, variationTypes[index], newPath)
//       );
//     }
//   };

//   const handleBack = () => {
//     const variationTypes = getVariationTypes(selectedVariationProducts);
//     if (variationLevel === 0) {
//       setVariationLevel(0);
//       setVariationPath([]);
//       setCurrentVariations(
//         getVariationValuesForType(selectedVariationProducts, variationTypes[0], [])
//       );
//     } else {
//       const newPath = variationPath.slice(0, variationLevel - 1);
//       setVariationPath(newPath);
//       setVariationLevel(variationLevel - 1);
//       const targetType = variationTypes[variationLevel - 1] || variationTypes[0];
//       setCurrentVariations(
//         getVariationValuesForType(selectedVariationProducts, targetType, newPath)
//       );
//     }
//   };

//   const handleProductVariationClick = async (p, selectedProduct) => {
//     const qty = 1;
//     const unitPrice = Number(p.unitPrice);
//     const v = JSON.parse(p.variationValues)
//       .map((v) => `${v.variationTypeName}: ${v.variationValue}`)
//       .join(" | ");
//     const order = {
//       productNo: selectedProduct.productNo,
//       sku: p.sku,
//       description: `${selectedProduct.productName} ${v}`,
//       productId: p.variationProductId,
//       productTypeId: selectedProduct.productTypeId,
//       unitPrice: unitPrice,
//       lineTaxRate: p.taxPerc,
//       qty,
//       measurementUnitName: selectedProduct.measurementUnitName,
//     };
//     dispatch(addOrder(order));
//     setIsVariationSelectionMenuShow(false);
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <DialogModel
//         header={selectedProduct.productName}
//         visible={isVariationSelectionMenuShow}
//         onHide={() => setIsVariationSelectionMenuShow(false)}
//       >
//         {/* {JSON.stringify(selectedVariationProducts)} */}
//           <div className="flex flex-col gap-4 px-4 m-0 p-0 min-w-[50vw] min-h-[50vh] overflow-auto">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <button
//               onClick={handleBack}
//               className="btn btn-sm btn-ghost text-sky-600 hover:bg-sky-100"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <span
//               className="cursor-pointer hover:text-sky-500"
//               onClick={() => {
//                 setVariationLevel(0);
//                 setVariationPath([]);
//                 setCurrentVariations(
//                   getVariationValuesForType(
//                     selectedVariationProducts,
//                     getVariationTypes(selectedVariationProducts)[0],
//                     []
//                   )
//                 );
//               }}
//             >
//               Home
//             </span>
//             {variationPath.map((p, index) => (
//               <span key={index} className="flex items-center gap-2">
//                 <span> / </span>
//                 <span
//                   className="cursor-pointer hover:text-sky-500"
//                   onClick={() => handleBreadcrumbClick(index)}
//                 >
//                   {p.type}: {p.value}
//                 </span>
//               </span>
//             ))}
//           </div>
//           <div className="flex flex-wrap gap-4">
//             {/* {JSON.stringify(currentVariations)} */}
//             {currentVariations.length > 0 ? (
//               variationLevel < getVariationTypes(selectedVariationProducts).length - 1 ? (
//                 currentVariations.map((value, index) => (
//                   <div
//                     key={index}
//                     className="flex flex-col w-full md:w-[188px] items-center justify-between rounded-lg cursor-pointer py-4 px-3 bg-white shadow-lg border hover:border-sky-500 hover:shadow-xl transition duration-300"
//                     onClick={() =>
//                       handleVariationSelect(
//                         value,
//                         getVariationTypes(selectedVariationProducts)[variationLevel]
//                       )
//                     }
//                   >
//                     <p className="text-sm font-medium text-gray-700">{value}</p>
//                   </div>
//                 ))
//               ) : (
//                 currentVariations.map((p, index) => (
//                   <div
//                     key={index}
//                     className="flex flex-col w-full md:w-[188px] items-center justify-between rounded-lg cursor-pointer py-4 px-3 bg-white shadow-lg border hover:border-sky-500 hover:shadow-xl transition duration-300"
//                     onClick={() => {
//                       handleProductVariationClick(p, selectedProduct);
//                     }}
//                   >
//                     <div className="w-full text-xs text-gray-500 text-left mb-2">
//                       <span className="font-semibold">SKU:</span> {p.sku || "N/A"}
//                     </div>
//                     <p className="text-sm font-medium text-gray-700">
//                       {
//                         JSON.parse(p.variationValues).find(
//                           (v) => v.variationTypeName === getVariationTypes(selectedVariationProducts)[variationLevel]
//                         )?.variationValue
//                       }
//                     </p>
//                     <p className="text-lg font-bold text-center text-gray-800">
//                       {formatCurrency(p.unitPrice, true)}
//                     </p>
//                     {selectedProduct.isStockTracked ? (
//                       <p className="text-sm font-medium mt-2">
//                         {p.stockQty > 0 ? `${p.stockQty} in stock` : "Out of stock"}
//                       </p>
//                     ) : null}
//                   </div>
//                 ))
//               )
//             ) : (
//               <div className="text-gray-500 text-center w-full">No items found</div>
//             )}
//           </div>
//         </div>
//       </DialogModel>

//       <div className="px-4 pt-2 flex justify-between gap-5 m-0 p-0">
//         <DaisyUIPaginator
//           currentPage={currentPage}
//           rowsPerPage={rowsPerPage}
//           totalRecords={totalRecords}
//           onPageChange={onPageChange}
//           rowsPerPageOptions={[10, 20, 30, 50, 100]}
//         />
//         <select
//           value={selectedCategoryId}
//           style={{ margin: 0 }}
//           onChange={handleCategorySelect}
//           className="w-full max-w-xs px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
//         >
//           <option value="-1">All Categories</option>
//           {categories.length > 0 &&
//             categories.map((c) => (
//               <option key={c.categoryId} value={c.categoryId}>
//                 {c.categoryName}
//               </option>
//             ))}
//         </select>
//       </div>

//       <div className="overflow-auto max-h-[70vh] m-0 p-2 rounded-lg">
//         {!productListLoading ? (
//           <div className="grid grid-cols-4 md:grid-cols-3 gap-2 px-4 m-0 p-0 sm:grid-cols-2">
//             {products.length > 0 ? (
//               products.map((p, index) => (
//                 <ProductItem key={index} p={p} handleProductClick={handleProductClick} />
//               ))
//             ) : (
//               <div>No products found</div>
//             )}
//           </div>
//         ) : (
//           <div className="flex justify-center items-center h-[80vh] text-lg font-semibold text-gray-600">
//             Please wait, loading products...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductList;
