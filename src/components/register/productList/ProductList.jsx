import React, { useState, useEffect } from "react";
import {
  getCategoryMenu,
  getProductExtraDetails,
  getProducts,
} from "../../../functions/register";
import { useDispatch } from "react-redux";
import { addOrder } from "../../../state/orderList/orderListSlice";
import ProductItem from "./productItem/ProductItem";
import DaisyUIPaginator from "../../../components/DaisyUIPaginator";
import "./productList.css";
import DialogModel from "../../model/DialogModel";

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
    console.log("store", store);
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
      const _result = await getProducts(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);

      setProducts(_result.data.results[0] || []);
    } catch (error) {
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

      const variations = await loadDetails(p.productId);
      console.log("variations",variations);
      setSelectedVariationProducts(variations);
      setSelectedProduct(p);
    }

    if (p.productTypeId === 1 || p.productTypeId === 3) {
    console.log("unitPrice", unitPrice);

    const order = {
      productNo: p.productNo,
      description,
      productId: p.productId,
      productTypeId: p.productTypeId,
      unitPrice,
      lineTaxRate: p.taxRate_perc,
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
    console.log("selectedProduct", p);

    const v =p.variationDetails.map(v=>v.variationValue).join(" | ");
    const order = {
      productNo: selectedProduct.productNo,
      description: `${selectedProduct.productName} ${v}`,
      measurementUnitName:selectedProduct.measurementUnitName,
      productId: p.variationProductId,
      productTypeId: selectedProduct.productTypeId,
      unitPrice: unitPrice,
      qty,
    };
  
    dispatch(addOrder(order));
  };

  return (
    <div className="flex flex-col gap-2 h-[40vh] ">
      <DialogModel
        header={selectedProduct.productName}
        visible={isVariationSelectionMenuShow}
        onHide={() => setIsVariationSelectionMenuShow(false)}
        width="500px"
        height="300px"
      >
        <div className="flex flex-wrap gap-2 px-4 m-0 p-0 ">
          {selectedVariationProducts.length > 0 ? (
            selectedVariationProducts.map((p, index) => (
              <button
                key={index}
                className="flex flex-col btn h-auto border-none  md:w-[188px] items-center justify-between 
      rounded-lg cursor-pointer py-4 px-2 gap-0 hover:bg-base-300 shadow bg-[#ffffff]"
                onClick={() => {
                  handleProductVariationClick(p, selectedProduct);
                }}
              >
                <div className="flex justify-center gap-1 w-full items-center">
                  <div className="flex gap-2 ">
                    {p.variationDetails.map((v) => v.variationValue + " / ")}
                  </div>
                </div>

                <p className="text-md font-semibold text-center text-gray-600">
                  Rs {p.unitPrice}
                </p>
              </button>
            ))
          ) : (
            <div>No items found</div>
          )}
        </div>
      </DialogModel>

      {/* <DialogModel
        header={<h4>{selectedProduct.productName}</h4>}
        visible={isVariationSelectionMenuShow}
        maximizable
        maximized={true}
        style={{ width: "20vw" }}
        onHide={() => setIsVariationSelectionMenuShow(false)}
      >
      
      </DialogModel> */}

      <div className="px-4 pt-2 flex justify-between gap-5 m-0 p-0">
        {/* <ProductSearch onProductSelect={handleProductClick} /> */}
        {/* {JSON.stringify(isVariationSelectionMenuShow)} */}
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
          className="select select-bordered w-full max-w-xs"
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

      <div className="flex flex-wrap gap-2 px-4 m-0 p-0  ">
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
    </div>
  );
};

export default ProductList;
