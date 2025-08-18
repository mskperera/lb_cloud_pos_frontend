import React, { useState, useEffect } from "react";
import {
  getCategoryMenu,
  getProductExtraDetails,
  getProducts,
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

  const [selectedVariationProducts, setSelectedVariationProducts] = useState(
    []
  );
  const [selectedProduct, setSelectedProduct] = useState("");

  const [saleType, setSaleType] = useState("products");
  const [productListLoading, setIsProductListLoading] = useState(false);

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
    console.log("store oooo", store);
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
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const [isVariationSelectionMenuShow, setIsVariationSelectionMenuShow] =
    useState(false);

  const loadDetails = async (productId) => {
    if (!productId) return;

    try {
      const details = await getProductExtraDetails(productId);
      // setExtraDetails(details);
      const stores = details.data.results[1];
      const productSkuBarcodes = details.data.results[0];

      const productTypeId = details?.data?.outputValues?.productTypeId;

      if (productTypeId == 2) {
        const parsedVariations = productSkuBarcodes.map((variation) => ({
          ...variation,
          variationDetails:
            typeof variation.variationDetails === "string"
              ? JSON.parse(variation.variationDetails)
              : variation.variationDetails,
        }));

        return parsedVariations;
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  
  const handleProductClick = async (p) => {
    const description = p.productName;
    const qty = 1;
    const unitPrice = Number(p.unitPrice);

    if (p.productTypeId === 2) {
      setIsVariationSelectionMenuShow(true);



      const payload={productId:p.productId,storeId:store.storeId}
      const details = await getVariationProductDetails(payload);
      // setExtraDetails(details);
    
      const variations =details.data.results[0]; //await loadDetails(p.productId);
      console.log("variations",variations);
      console.log("details",details.data.results[0]);

      setSelectedVariationProducts(variations);
      setSelectedProduct(p);
    }

    if (p.productTypeId === 1 || p.productTypeId === 3) {


    const order = {
      productNo: p.productNo,
      sku:p.sku,
      description,
      productId: p.productId,
      productTypeId: p.productTypeId,
      unitPrice,
      lineTaxRate: p.taxPerc,
      qty,
      measurementUnitName:p.measurementUnitName,
    };

    dispatch(addOrder(order));
  }


  };

  const handleProductVariationClick = async (p, selectedProduct) => {
    const qty = 1;
    const unitPrice = Number(p.unitPrice);
    console.log("p", p);
    console.log("selectedProduct", selectedProduct);


    const v =JSON.parse(p.variationValues).map(v=>v).join(" | ");
    const order = {
      productNo: selectedProduct.productNo,
      sku:p.sku,
      description: `${selectedProduct.productName} ${v}`,
      productId: p.variationProductId,
      productTypeId: selectedProduct.productTypeId,
      unitPrice: unitPrice,
      lineTaxRate: p.taxPerc,
      qty,
      measurementUnitName:selectedProduct.measurementUnitName,
    };
  
    console.log("handleProductVariationClick", order);

    dispatch(addOrder(order));
  };

  return (
    <div className="flex flex-col gap-2">
      <DialogModel
        header={selectedProduct.productName}
        visible={isVariationSelectionMenuShow}
        onHide={() => setIsVariationSelectionMenuShow(false)}
      >
        {/* {JSON.stringify(selectedVariationProducts)} */}
        <div className="flex flex-wrap gap-4 px-4 m-0 p-0">
          {selectedVariationProducts.length > 0 ? (
            selectedVariationProducts.map((p, index) => (
              <div
                key={index}
                className={`flex flex-col w-full md:w-[188px] items-center justify-between
              rounded-lg cursor-pointer py-4 px-3 bg-white shadow-lg border
              ${
                p.stockQty > 0
                  ? "hover:border-green-500"
                  : "hover:border-red-500"
              }
              hover:shadow-xl transition duration-300`}
                onClick={() => {
                  handleProductVariationClick(p, selectedProduct);
                  setIsVariationSelectionMenuShow(false); // Hides the modal
                }}
              >
                <div className="w-full text-xs text-gray-500 text-left mb-2">
                  <span className="font-semibold">SKU:</span> {p.sku || "N/A"}
                </div>

                <div className="flex flex-col items-center mb-3">
                  <div className="flex gap-1 items-center justify-center">
                    {p.variationValues &&
                      JSON.parse(p.variationValues).map((v, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-sm rounded-md text-gray-700"
                        >
                          {v}
                        </span>
                      ))}
                  </div>
                </div>

                <p className="text-lg font-bold text-center text-gray-800">
                  {formatCurrency(p.unitPrice,true)}
                </p>

                <p
                  className={`text-sm font-medium mt-2 ${
                    p.stockQty > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.stockQty > 0 ? `${p.stockQty} in stock` : "Out of stock"}
                </p>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center w-full">
              No items found
            </div>
          )}
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

      <div className="overflow-auto max-h-[70vh] m-0 p-2  rounded-lg">
        {!productListLoading ? (
          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 px-4 m-0 p-0 sm:grid-cols-2">
            {products.length > 0 ? (
              products.map((p, index) => (
                <ProductItem
                  key={index}
                  p={p}
                  handleProductClick={handleProductClick}
                />
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
