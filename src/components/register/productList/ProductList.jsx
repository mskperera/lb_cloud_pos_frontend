import React, { useState, useEffect, useRef } from "react";
import {
  getBatchedItems,
  getCategoryMenu,
  getProductsPosMenu,
  getVariationProductDetails,
} from "../../../functions/register";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, updateOrderBatchId } from "../../../state/orderList/orderListSlice";
import ProductItem from "./productItem/ProductItem";
import DaisyUIPaginator from "../../../components/DaisyUIPaginator";
import BatchSelectionDialog from "../../BatchSelectionDialog";
import { FaSearch } from "react-icons/fa";
import { ChevronDownIcon, CopyIcon, PackageIcon, XIcon } from "lucide-react";
import ProductCardButton from "./productItem/ProductCardButton";


const CategoryBar = ({ categories, selectedCategoryId, onSelect }) => {
  const [overflowIds, setOverflowIds] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);
  const barRef = useRef();
  const moreRef = useRef();

  const allCats = [ ...categories];

  useEffect(() => {
    measureTabs();
  }, [categories]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measureTabs());
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, [categories]);

  const measureTabs = () => {
    if (!barRef.current) return;
    const containerW = barRef.current.offsetWidth - 80; // reserve for "More" btn
    let used = 0;
    const overflow = [];
    allCats.forEach((c, i) => {
      const approxW = c.categoryName.length * 8.5 + 34;
      if (i > 0 && used + approxW > containerW) {
        overflow.push(c.categoryId);
      } else {
        used += approxW + 8;
      }
    });
    setOverflowIds(overflow);
  };

  const visibleCats = allCats.filter(c => !overflowIds.includes(c.categoryId));
  const hiddenCats = allCats.filter(c => overflowIds.includes(c.categoryId));
  const activeInOverflow = overflowIds.includes(selectedCategoryId);

  return (
    <div style={{padding:"14px 20px 0",display:"flex",alignItems:"center",gap:8,flexShrink:0,position:"relative"}}>
      <div ref={barRef} style={{display:"flex",gap:8,flex:1,overflow:"hidden",minWidth:0}}>
        {visibleCats.map(c => (
          <button
            key={c.categoryId}
            style={{fontFamily:"inherit",fontWeight:600}}

            className={`lpos-cat-tab${selectedCategoryId===c.categoryId?" active":""}`}
            onClick={() => onSelect(c)}
          >
            {c.categoryName}
          </button>
        ))}
      </div>
      {hiddenCats.length > 0 && (
        <div ref={moreRef} style={{position:"relative",flexShrink:0}}>
          <button
            onClick={() => setDropOpen(v=>!v)}
      
            style={{
              display:"flex",alignItems:"center",gap:5,padding:"8px 13px",
              borderRadius:"var(--lpos-radius-sm)",border:activeInOverflow?"1.5px solid var(--lpos-accent-medium)":"none",
              background:activeInOverflow?"var(--lpos-accent-soft)":"var(--lpos-surface)",
              fontFamily:"inherit",fontWeight:600,fontSize:13,
              color:activeInOverflow?"var(--lpos-accent)":"var(--lpos-text-secondary)",
              cursor:"pointer",boxShadow:"var(--lpos-shadow-sm)",flexShrink:0,
            }}
          >
            More <span style={{background:"var(--lpos-accent)",color:"white",fontWeight:700,padding:"1px 5px",borderRadius:10}}>{hiddenCats.length}</span>
            <span style={{transform:dropOpen?"rotate(180deg)":"rotate(0)",transition:"transform .2s",display:"flex"}}><ChevronDownIcon /></span>
          </button>
          {dropOpen && (
            <div style={{
              position:"absolute",right:0,top:"calc(100% + 8px)",
              minWidth:210,background:"var(--lpos-surface)",
              borderRadius:"var(--lpos-radius-md)",
              boxShadow:"0 8px 30px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.07)",
              border:"1px solid var(--lpos-border)",padding:6,zIndex:2000,
            }}>
              {hiddenCats.map(c => (
                <div
                  key={c.categoryId}
                  onClick={() => { onSelect(c); setDropOpen(false); }}
                  style={{
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"9px 12px",margin:"4px 0",borderRadius:9,cursor:"pointer",
                    fontSize:13.5,fontWeight:c.categoryId===selectedCategoryId?600:500,
                    color:c.categoryId===selectedCategoryId?"var(--lpos-accent)":"var(--lpos-text-secondary)",
                    background:c.categoryId===selectedCategoryId?"var(--lpos-accent-soft)":"transparent",
                    transition:"background .13s",gap:10,
                  }}
                  onMouseEnter={e=>{ if(c.categoryId!==selectedCategoryId) e.currentTarget.style.background="var(--lpos-bg)"; }}
                  onMouseLeave={e=>{ if(c.categoryId!==selectedCategoryId) e.currentTarget.style.background="transparent"; }}
                >
                  {c.categoryName}
                  {c.categoryId===selectedCategoryId && (
                    <div style={{width:16,height:16,borderRadius:"50%",background:"var(--lpos-accent)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {dropOpen && <div style={{position:"fixed",inset:0,zIndex:1999}} onClick={()=>setDropOpen(false)}/>}
    </div>
  );
};


const ProductList = ({onMobClose, onOrderComplete}) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalRecords, setTotalRecords] = useState(10);

  const [selectedVariationProducts, setSelectedVariationProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedVariationProduct, setSelectedVariationProduct] = useState("");
  const [variationLevel, setVariationLevel] = useState(0);
  const [variationPath, setVariationPath] = useState([]);
  const [currentVariations, setCurrentVariations] = useState([]);

  const [productListLoading, setIsProductListLoading] = useState(false);

  const store = JSON.parse(localStorage.getItem("selectedStore"));
  const terminal = JSON.parse(localStorage.getItem("terminal"));
  
  const [addOrderTemp, setAddOrderTemp] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const loadingTimeoutRef = useRef();

  const [batchedItemList, setBatchedItemList] = useState([]);

  const [isBatchedItemsModalOpen, setIsBatchedItemsModalOpen] = useState(false);

  const productListScrollTopRef = useRef(0);
  const productListScrollRef = useRef(null);
  const prevVariationCountRef = useRef(0);

  const existingOrders = useSelector((state) => state.orderList.list);

  // Refresh product quantities when order is completed
  useEffect(() => {
    if (onOrderComplete) {
      // Update product quantities in current list without reloading
      console.log('realoadddddding..............')
      loadProducts(selectedCategoryId, currentPage, rowsPerPage);
    }
  }, [onOrderComplete]);


  const handleCategorySelect = (c) => {
    setSelectedCategoryId(c.categoryId);
    setCurrentPage(0);
    loadProducts(c.categoryId, 0, rowsPerPage);

    setSelectedVariationProducts([]);
    setVariationPath([]);
    setVariationLevel(0);
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
      productName: null,
      barcode: null,
      categoryId: categoryId,
      storeId: store.storeId,
      terminalId: terminal?.terminalId,
      searchByKeyword: false,
       skip: skip,
       limit: limit,
    };

    try {
      setIsProductListLoading(true);
      const _result = await getProductsPosMenu(filteredData, null);
      console.log("getProductsPosMenu", _result);

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

  useEffect(() => {
    if (prevVariationCountRef.current > 0 && selectedVariationProducts.length === 0) {
      const el = productListScrollRef.current;
      if (el) {
        el.scrollTop = productListScrollTopRef.current;
      }
    }
    prevVariationCountRef.current = selectedVariationProducts.length;
  }, [selectedVariationProducts.length]);

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

  const getProductVariationLevel = (product) => {
    try {
      const parsed = JSON.parse(product.variationProducts || "[]");
      return parsed?.[0]?.variationValueLevel ?? 0;
    } catch (error) {
      return 0;
    }
  };

  const handleProductClick = async (p) => {
    const loadingId = p.productId ?? p.allProductId;
    let showLoading = false;
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => {
      setLoadingItemId(loadingId);
      showLoading = true;
    }, 500);

    try {
      const description = p.productName;
      const qty = 1;
      const unitPrice = Number(p.unitPrice);

        const payload = { productId: p.productId, storeId: store.storeId };
        try {
          const details = await getVariationProductDetails(payload);
          const variations = details.data.results[0] || [];
          const variationValueLevel = JSON.parse(p.variationProducts)[0].variationValueLevel;

const allprouctIdParsed=JSON.parse(p.allProductId)[0];
 const batchedItemsRes = await getBatchedItems(allprouctIdParsed, store.storeId);
        

    const {isBatchTracked}=batchedItemsRes.data.outputValues;
     console.log('getBatchedItems',batchedItemsRes);


      const batchedItems = batchedItemsRes.data.results[0];

      console.log('orrrange',p)

          if (variationValueLevel===0) {
            // If no variations or variations is not an array, add directly to order
            const order = {
             allProductId:JSON.parse(p.allProductId)[0],
              storeId: store.storeId,
              sku: variations[0].sku,
              description,
              unitPrice:variations[0].unitPrice,
              lineTaxRate: variations[0].taxPerc,
              qty,
              measurementUnitName: p.measurementUnitName,
              stockQty: p.isStockTracked ? p.stockQty : undefined,
              imageUrl:p.imageUrl,
              inventoryId:p.inventoryId
            };


            
      if(batchedItems.length>0 && !!isBatchTracked){
        setBatchedItemList(batchedItems);
        setIsBatchedItemsModalOpen(true);
        setAddOrderTemp(order);
        return;
      }
      // else if(batchedItems.length===1 && batchedItems[0].batchNo!=null){
      //   setBatchedItemList(batchedItems);
      //   setIsBatchedItemsModalOpen(true);
      //   setAddOrderTemp(order);
      //   return;
      // }
      else{
        order.stockBatchId=batchedItems[0]?.stockBatchId?batchedItems[0].stockBatchId:null;
        // order.batchNo=batchedItems[0]?.batchNo?batchedItems[0].batchNo:null;
        dispatch(addOrder(order));
      }

            
          //  dispatch(addOrder(order));
          } else {
            // Save the root list scroll position before switching to variation mode.
            productListScrollTopRef.current = productListScrollRef.current?.scrollTop || 0;

            // If variations exist, show inline in main product list area
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
        //   const order = {
        //  allProductId:p.allProductId,
        //   storeId: store.storeId,
        //     sku: p.sku,
        //     description,
        //     unitPrice,
        //     lineTaxRate: p.taxPerc,
        //     qty,
        //     measurementUnitName: p.measurementUnitName,
        //     stockQty: p.isStockTracked ? p.stockQty : undefined,
        //          imageUrl:p.imageUrl
        //   };
        //   dispatch(addOrder(order));
        }
      
    } finally {
      clearTimeout(loadingTimeoutRef.current);
      setLoadingItemId(null);
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


  const handleProductVariationClick = async (p, selectedProduct) => {
    const loadingId = p.variationProductId ?? p.allProductId;
    setLoadingItemId(loadingId);
    try {
      const qty = 1;
      const unitPrice = Number(p.unitPrice);
      const v = JSON.parse(p.variationValues)
        // .map((v) => `${v.variationTypeName}: ${v.variationValue}`)
          .map((v) => ` ${v.variationValue}`)
        .join(" | ");

      console.log('selectedProduct',selectedProduct);
      console.log('variation product clicked',p);
      const batchedItemsRes = await getBatchedItems(p.allProductId, store.storeId);
       const {isBatchTracked}=batchedItemsRes.data.outputValues;

      console.log('getBatchedItems',batchedItemsRes);
      const batchedItems = batchedItemsRes.data.results[0];

      const description = `${selectedProduct.productName} ${v}`;
      setSelectedVariationProduct({description,p});

      const order = {
        allProductId:p.allProductId,
        storeId:store.storeId,
        sku: p.sku,
        description,
        unitPrice: unitPrice,
        lineTaxRate: p.taxPerc,
        qty,
        measurementUnitName: selectedProduct.measurementUnitName,
        stockQty: selectedProduct.isStockTracked ? p.stockQty : undefined,
               imageUrl:selectedProduct.imageUrl,
        inventoryId:p.inventoryId
      };


       if(batchedItems.length>0 && !!isBatchTracked){
        setBatchedItemList(batchedItems);
        setIsBatchedItemsModalOpen(true);
        setAddOrderTemp(order);
        return;
      }
      // else if(batchedItems.length===1 && batchedItems[0].batchNo!=null){
      //   setBatchedItemList(batchedItems);
      //   setIsBatchedItemsModalOpen(true);
      //   setAddOrderTemp(order);
      //   return;
      // }
      else{
        order.stockBatchId=batchedItems[0]?.stockBatchId?batchedItems[0].stockBatchId:null;
        // order.batchNo=batchedItems[0]?.batchNo?batchedItems[0].batchNo:null;
        dispatch(addOrder(order));
      }
    } finally {
      setLoadingItemId(null);
    }
    // Exit variation selection mode
    //setSelectedVariationProducts([]);
    // setVariationPath([]);
    // setVariationLevel(0);
  };


const addItemstoOrderListFinal=(selectedBatch,order)=>{
    const isOrderExist = existingOrders.find(
      (o) => o.allProductId===order.allProductId && o.storeId===order.storeId
    );

    console.log('selectedBatch',selectedBatch);
    const orderFinal = {
      ...order,
      stockBatchId: selectedBatch.stockBatchId,
      batchNo: selectedBatch.batchNo,
      unitPrice: selectedBatch.unitPrice ?? order.unitPrice,
      lineTaxRate: selectedBatch.taxPerc ?? order.lineTaxRate,
      stockQty: order.measurementUnitName ? selectedBatch.qty : order.stockQty,
    };

    if (isOrderExist) {
      dispatch(updateOrderBatchId({
        allProductId: order.allProductId,
        storeId: order.storeId,
        stockBatchId: selectedBatch.stockBatchId,
        batchNo: selectedBatch.batchNo,
        unitPrice: selectedBatch.unitPrice,
        lineTaxRate: selectedBatch.taxPerc ?? order.lineTaxRate,
      }));
    } else {
      dispatch(addOrder(orderFinal));
    }

    setAddOrderTemp(null);
    setIsBatchedItemsModalOpen(false);
  }

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



 const activeCatLabel = selectedCategoryId === -1 ? "All Items" : (categories.find(c=>c.categoryId===selectedCategoryId)?.categoryName || "Products");

  const topVariationProducts = products.filter((p) => getProductVariationLevel(p) > 0);
  const rootVariationProducts = products.filter((p) => getProductVariationLevel(p) === 0);

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


    <BatchSelectionDialog
      visible={isBatchedItemsModalOpen}
      onHide={() => setIsBatchedItemsModalOpen(false)}
      selectedProduct={selectedProduct}
      selectedVariationProduct={selectedVariationProduct}
      batchedItemList={batchedItemList}
      onBatchSelect={(selectedBatch) => addItemstoOrderListFinal(selectedBatch, addOrderTemp)}
    />





   <div className="lpos-main lpos-scroll" style={{display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--lpos-bg)",flex:1}}>
   
   
       {totalRecords>rowsPerPage && <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        /> }


   <div className="mob-sheet-handle" style={{display:"none",alignItems:"center",justifyContent:"space-between",padding:"12px 16px 0",flexShrink:0}}>
        <span style={{fontSize:16,fontWeight:700,letterSpacing:"-.3px"}}>Browse Products</span>
        <button onClick={onMobClose} style={{width:32,height:32,borderRadius:"50%",border:"none",background:"var(--lpos-bg)",color:"var(--lpos-text-secondary)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <XIcon/>
        </button>
      </div>
      {/* Category tabs */}
      <CategoryBar categories={categories} selectedCategoryId={selectedCategoryId} onSelect={handleCategorySelect} />
    
      {/* Section header - Changes based on mode */}
      <div style={{padding:"14px 20px 2px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        {selectedVariationProducts.length > 0 ? (
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button
              onClick={() => {
                setSelectedVariationProducts([]);
                setVariationPath([]);
                setVariationLevel(0);
              }}
         className="text-sky-700 hover:text-sky-800"
              style={{borderRadius:8,border:"none",background:"var(--lpos-bg)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,padding:"10px 12px",gap:6}}
              title="Back to products"
            >
              <ChevronDownIcon style={{transform:"rotate(90deg)",fontSize:16}} />
              <span style={{fontWeight:600}}>Back</span>
            </button>
         
          </div>
        ) : null}
         <>
            <span className="text-lg font-semibold text-gray-700">{activeCatLabel}</span>
            <span className="text-sm text-gray-500" style={{fontWeight:500}}>
              {products.length} item{products.length !== 1 ? "s" : ""}
            </span>
          </>
      </div>

      {/* Breadcrumb Navigation for Variations */}
      {selectedVariationProducts.length > 0 && (
        <div style={{padding:"12px 20px 8px",borderBottom:"1px solid var(--lpos-border)",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <button
          className="text-lg font-semibold text-gray-700"
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
            style={{color:"var(--lpos-accent)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}
          >
            {selectedProduct.productName}
          </button>
          {variationPath.map((p, index) => (
            <React.Fragment key={index}>
              <span style={{color:"var(--lpos-text-tertiary)"}}>/</span>
              <button
              className="text-lg"
                onClick={() => handleBreadcrumbClick(index)}
                style={{color:"var(--lpos-accent)",fontWeight:500,background:"none",border:"none",cursor:"pointer",padding:0,textTransform:"capitalize"}}
              >
                {p.value}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}



    <div className="lpos-scroll" ref={productListScrollRef} style={{flex:1,overflowY:"auto",padding:"12px 20px 20px"}}>
    
    
        {productListLoading ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:14,color:"var(--lpos-text-secondary)"}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid var(--lpos-accent-medium)",borderTopColor:"var(--lpos-accent)",animation:"spin 0.8s linear infinite"}}/>
            <span style={{fontSize:14,fontWeight:500}}>Loading products…</span>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : selectedVariationProducts.length > 0 ? (
          /* === INLINE VARIATION SELECTION VIEW === */
          <div>
            {currentVariations.length > 0 ? (
           <div>
  {variationLevel < getVariationTypes(selectedVariationProducts).length - 1 ? (
    /* === Option Level (e.g., Size, Color) === */
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
        gap: 12,
      }}
    >
      {currentVariations.map((value, index) => (
        <div
          key={index}
          onClick={() =>
            handleVariationSelect(
              value,
              getVariationTypes(selectedVariationProducts)[variationLevel]
            )
          }
          style={{
            backgroundColor: "white",
            border: "1.5px solid var(--lpos-border)",
            borderRadius: 12,
            padding: 16,
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minHeight: 120,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--lpos-accent)";
            e.currentTarget.style.backgroundColor =
              "var(--lpos-accent-soft)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--lpos-border)";
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <CopyIcon
            className="w-10 h-10"
            style={{ color: "var(--lpos-accent)" }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--lpos-text-primary)",
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  ) : (
    /* === Final Variation Level (SKU, Price, Stock) === */
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 12,
      }}
    >
      {currentVariations.map((p, index) => {
        const variationLabel = JSON.parse(p.variationValues)[JSON.parse(p.variationValues).length - 1].variationValue
     

                 const order = existingOrders.find(o => o.allProductId === p.allProductId);
                    const orderQty = order ? order.qty : 0;

        return (
          <ProductCardButton
            key={index}
            compact={true}
            onClick={() =>
              handleProductVariationClick(p, selectedProduct)
            }
            disabled={
              selectedProduct.isStockTracked && p.stockQty <= 0
            }
            loading={loadingItemId === p.variationProductId}
            title={selectedProduct.productName}
            productName={variationLabel}
            imageUrl={selectedProduct.imageUrl}
            hasImage={Boolean(selectedProduct.imageUrl)}
            sku={p.sku}
            unitPrice={p.unitPrice}
           // variationLabel={variationLabel}
            isStockTracked={selectedProduct.isStockTracked}
            stockQty={` ${p.stockQty} `}
            measurementUnitName={selectedProduct.measurementUnitName}
                     orderQty={orderQty}
          />
        );
      })}
    </div>
  )}
</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:12,color:"var(--lpos-text-tertiary)"}}>
                <FaSearch style={{fontSize:48,opacity:0.3}}/>
                <span style={{fontSize:16,fontWeight:600,color:"var(--lpos-text-secondary)"}}>No variations found</span>
                <span style={{fontSize:13}}>Try selecting different options</span>
              </div>
            )}
          </div>
        ) : products.length === 0 ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:12,color:"var(--lpos-text-tertiary)"}}>
            <PackageIcon/>
            <span style={{fontSize:17,fontWeight:700,color:"var(--lpos-text-secondary)"}}>No products found</span>
            <span style={{fontSize:13,color:"var(--lpos-text-tertiary)"}}>Try selecting a different category</span>
          </div>
        ) : (
          <div>
            {topVariationProducts.length > 0 && (
              <div style={{marginBottom:14}}>
                {/* <div style={{marginBottom:10, color:"var(--lpos-text-secondary)", fontSize:13, fontWeight:600}}>
                  Variation products
                </div> */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
                  {topVariationProducts.map((p, i) => {
                    // Find order quantity for this product
                    const order = existingOrders.find(o => o.allProductId === p.allProductId);
                    const orderQty = order ? order.qty : 0;
                    return (
                      <ProductItem
                        disabled={selectedProduct.isStockTracked && p.stockQty <= 0}
                        key={`top-${i}-${p.productId}`}
                        p={p}
                        handleProductClick={handleProductClick}
                        loading={loadingItemId === p.productId}
                        orderQty={orderQty}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {rootVariationProducts.length > 0 && (
              <div style={{marginTop:18, paddingTop:18, borderTop:"1px solid var(--lpos-border)"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                  {rootVariationProducts.map((p, i) => {
                    const allProductId = JSON.parse(p.allProductId)[0];
                    const order = existingOrders.find(o => o.allProductId === allProductId);
                    const orderQty = order ? order.qty : 0;
                    return (
                      <ProductItem
                        disabled={selectedProduct.isStockTracked && p.stockQty <= 0}
                        key={`root-${i}-${p.productId}`}
                        p={p}
                        handleProductClick={handleProductClick}
                        loading={loadingItemId === p.productId}
                        orderQty={orderQty}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
    
    
  
        {/* Pagination */}
        {!selectedVariationProducts.length && totalRecords > rowsPerPage && (
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:20}}>
            <button disabled={currentPage===0} onClick={()=>onPageChange({page:currentPage-1,rows:rowsPerPage})} style={{padding:"6px 14px",borderRadius:8,border:"1px solid var(--lpos-border)",background:"var(--lpos-surface)",cursor:currentPage===0?"not-allowed":"pointer",fontSize:13,fontWeight:600,color:"var(--lpos-text-secondary)",opacity:currentPage===0?.5:1}}>← Prev</button>
            <span style={{fontSize:13,color:"var(--lpos-text-secondary)",fontWeight:500}}>Page {currentPage+1} of {Math.ceil(totalRecords/rowsPerPage)}</span>
            <button disabled={(currentPage+1)*rowsPerPage>=totalRecords} onClick={()=>onPageChange({page:currentPage+1,rows:rowsPerPage})} style={{padding:"6px 14px",borderRadius:8,border:"1px solid var(--lpos-border)",background:"var(--lpos-surface)",cursor:(currentPage+1)*rowsPerPage>=totalRecords?"not-allowed":"pointer",fontSize:13,fontWeight:600,color:"var(--lpos-text-secondary)",opacity:(currentPage+1)*rowsPerPage>=totalRecords?.5:1}}>Next →</button>
          </div>
        )}




</div>

    </div>
  
         </>
  );
};

export default ProductList;
