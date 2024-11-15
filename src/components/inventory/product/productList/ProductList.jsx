import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatUtcToLocal } from '../../../../utils/format';
import { deleteProduct, getNonSerializedItems, getProductAvailaleStores, getProductExtraDetails, getProducts } from '../../../../functions/register';
import { useToast } from '../../../useToast';
import { getDropdownMeasurementUnit, getDrpdownCategory, getProductTypesDrp, getStoresDrp } from '../../../../functions/dropdowns';
import { validate } from '../../../../utils/formValidation';
import FormElementMessage from '../../../messges/FormElementMessage';
import DaisyUIPaginator from '../../../DaisyUIPaginator';
import ConfirmDialog from '../../../dialog/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash,faPlus, faPlusSquare, faArrowAltCircleRight, faCompress, faCompressArrowsAlt, faAngleUp, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './productList.css';

const ProductDetails = ({ selectedProduct }) => {
  const [availableStores, setAvailableStores] = useState([]);
  const [extraDetails, setExtraDetails] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const details = await getProductExtraDetails(selectedProduct.productId);
      setExtraDetails(details);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      loadDetails();
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (extraDetails?.data?.results) {
      setStores(extraDetails.data.results[1]); 
      setCategories(JSON.parse(selectedProduct.categories));
    }
  }, [extraDetails]);

  const renderExtraDetails = () => {
    if (loading) {
      return <div>Loading...</div>; // Show loading message
    }

    if (!selectedProduct || !extraDetails?.data?.outputValues?.productTypeId) {
      return null;
    }

    const productTypeId = extraDetails?.data?.outputValues?.productTypeId;

    if (productTypeId === 1) {
      return <div className='flex justify-start gap-5'> 
          <div className='bg-white p-4 rounded-md'>
           <h3 className='text-center font-bold text-lg pb-2'>Stores</h3>
           <table className="table border-collaps">
             <thead className="sticky top-0 bg-base-100 z-10 text-[1rem] border-b border-gray-300">
               <tr>
                 <th className="px-4 py-2">Store Code</th>
                 <th className="px-4 py-2">Store Name</th>
               </tr>
             </thead>
             <tbody>
               {stores.map((item) => (
                 <tr key={item.storeId} className="hover:bg-gray-100 text-[1rem] m-5">
                   <td className="px-4 py-2">{item.storeCode}</td>
                   <td className="px-4 py-2">{item.storeName}</td>
     
                 </tr>
               ))}
             </tbody>
           </table>
           </div>

           <div className='bg-white p-4 rounded-md'>
            <h3 className='text-lg'>Categories </h3>
           <div className='flex gap-1 mt-2'>
          {categories?.map((c) => (
           <>
           <span
              key={c.id}
              className="badge badge-primary p-4 bg-green-500 border-none text-white mr-1"
            >
              {c.displayName}
            </span> {"/"}
            </>
          ))}
        </div>
        
            </div>
           </div>;
    }

    if (productTypeId === 2) {
      return (
        <div className='m-4 bg-gray-100 p-4 rounded-md'>
          <h3 className='text-center font-bold pb-5'>Variations</h3>
          <table className="table border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Barcode</th>
                <th className="px-4 py-2">Variation</th>
              </tr>
            </thead>
            <tbody>
              {extraDetails.data.results[0].map((item) => (
                <tr key={item.variationProductId}>
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">{item.barcode}</td>
                  <td className="px-4 py-2">
                    {JSON.parse(item.variationValues).map((v) => (
                      <div key={v.variationName} className='flex gap-2 border-gray-100 border p-2 rounded-md bg-gray-50'>
                        <div className='flex-1'>{v.variationName}</div>
                        <div className='flex-1'>{v.variationValue}</div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (productTypeId === 3) {
      return (
        <div className='m-4 bg-gray-100 p-4 rounded-md'>
          <h3 className='text-center font-bold pb-5'>Combo Ingredients</h3>
          <table className="table border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">SKU</th>
              </tr>
            </thead>
            <tbody>
              {extraDetails.data.results[0].map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2">{item.qty} {item.measurementUnitName}</td>
                  <td className="px-4 py-2">{item.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className=" p-2 mb-2">
      {renderExtraDetails()}
    </div>
  );
};

///export default ProductDetails;



export default function ProductOrderList({ }) {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] = useState(-1);
  const [storesOptions, setStoresOptions] = useState([]);

  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [selectedProdutTypeId, setSelectedProdutTypeId] = useState(-1);

   // New states for checkboxes
   const [isSingleProductChecked, setIsSingleProductChecked] = useState(false);
   const [isVariationProductChecked, setIsVariationProductChecked] = useState(false);
   const [isComboProductChecked, setIsComboProductChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(10);


  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
    loadProducts(selectedCategoryId, page, rows);
  };


  const [selectedFilterBy, setSelectedFilterBy] = useState({
    label: 'Filter by',
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: 'integer' },
  });

  const [searchValue, setSearchValue] = useState({
    label: 'Search Value',
    value: '',
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: 'string' },
  });

  const [isSearchValueEntered,setIsSearchValueEntered]=useState(false);
 
  const loadProducts = async () => {
    try {
      console.log('loadproducs')
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

           // Prepare the list of product types based on the checked checkboxes
           const productTypeIds = [];
           if (isSingleProductChecked) productTypeIds.push(1);  // Single Product
           if (isVariationProductChecked) productTypeIds.push(2);  // Variation Product
           if (isComboProductChecked) productTypeIds.push(3);  // Combo Product


      const filteredData = {
        productId: null,
        productNo: selectedFilterBy.value === 1 ? searchValue.value : null,
        productName: selectedFilterBy.value === 2 ? searchValue.value : null,
        barcode: selectedFilterBy.value === 3 ? searchValue.value : null,
        categoryId: selectedCategoryId,
        measurementUnitId: selectedMeasurementUnitId,
        storeId:selectedStoreId===-1 ? null :selectedStoreId,
        productTypeIds: productTypeIds.length > 0 ? productTypeIds : null,
        searchByKeyword: false,
        skip: skip,
        limit: limit,
      };


      console.log('filteredData ',filteredData )
      const _result = await getProducts(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      setProducts(_result.data.results[0]);
      setIsTableDataLoading(false);
    } catch (err) {
      setIsTableDataLoading(false);
      console.log('error:', err);
    }
  };


  useEffect(() => {
    setSelectedStoreId(storesOptions.length>0 && storesOptions[0].id)
  }, [storesOptions]);


  useEffect(() => {
    loadProducts();
  }, [selectedStoreId,selectedCategoryId, selectedMeasurementUnitId,isSingleProductChecked, 
    isVariationProductChecked, 
    isComboProductChecked, currentPage, rowsPerPage]);

  useEffect(() => {

    if(isSearchValueEntered){

      const delayedLoadProducts = setTimeout(() => {
        loadProducts();
      }, 1000);
      return () => clearTimeout(delayedLoadProducts);
    }
    
  }, [searchValue.value]);


  useEffect(()=>{
    if([1,2,3].includes(selectedFilterBy.value)){
      setSelectedCategoryId(-1);
      setSelectedMeasurementUnitId(-1);
    }
    else{
      setSearchValue({...searchValue,value:""});
    }
  },[selectedFilterBy.value]);

  useEffect(() => {
    setIsSearchValueEntered(true);
  }, [isSearchValueEntered]);


  const [filterByOptions, setFilterByOptions] = useState([
    { id: 1, displayName: 'Product No' },
    { id: 2, displayName: 'Product Name' },
    { id: 3, displayName: 'Barcode' },
    { id: 4, displayName: 'Category' },
    { id: 5, displayName: 'Measurement Unit' }
  ]);





  const [categoryOptions, setCategoryOptions] = useState([]);
  const [measurementUnitOptions, setMeasurementUnitOptions] = useState([]);




  
  useEffect(() => {
    loadDrpStores();
    loadDrpCategory();
    loadDrpMeasurementUnit();

  }, []);





  const loadDrpStores = async () => {
    const objArr = await getStoresDrp();
    setStoresOptions([ ...objArr.data.results[0]]);
  };


  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions([{ id: -1, displayName: 'All' }, ...objArr.data.results[0]]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions([{ id: -1, displayName: 'All' }, ...objArr.data.results[0]]);
  };

  const actionButtons = (item) => (
    <div className="flex space-x-2">
        <button
        className="btn btn-primary btn-xs text-base-100"
        onClick={() => handleRowExpand(item.productId)}
        aria-label="Edit" title='More'
      >
        More
      </button>

      <button
        className="btn btn-error btn-xs bg-[#f87171] text-base-100 "
        onClick={async () => {
          const result = await deleteProduct(item.productId, false);
          const { outputMessage, responseStatus } = result.data.outputValues;
          confirmDelete(outputMessage, item.productId);
        }}
        aria-label="Delete"
        title='Delete Product'
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button
        className="btn btn-warning btn-xs bg-[#fb923c] text-base-100"
        onClick={() => navigate(`/addProduct/update/${item.productId}`)}
        aria-label="Edit" title='Edit Product'
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  );

  const validationMessages = (state) => {
    if (!state.isValid && state.isTouched) {
      return state.validationMessages.map((message, index) => (
        <FormElementMessage
          key={index}
          className="mt-2 w-full"
          severity="error"
          text={`${message}`}
        />
      ));
    }
    return null;
  };






  const productNoBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.productNo}</span>
  );

  const productNameBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.productName}</span>
  );

  const measurementUnitNameBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.measurementUnitName}</span>
  );

  const unitPriceBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.unitPrice)}</span>
  );

  const stockQtyBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{`${!rowData.isStockTracked ? 'N/A' : `${rowData.stockQty} ${rowData.measurementUnitName}` }`}</span>
  );

  const productTypeBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.productTypeName}</span>
  );
  const storeNameBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.storeName}</span>
  );

  const costPriceBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{formatCurrency(rowData.costPrice)}</span>
  );

  const brandBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.brandName}</span>
  );



  const barcodeBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.sku}</span>
  );

  const taxRate_percBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.taxRate_perc}</span>
  );

  const categoriesBodyTemplate = (item) => {
    const categories = JSON.parse(item.categories);
    return (
      isTableDataLoading ? <span>Loading...</span> :
        <div className='flex gap-1'>
          {categories.map((c) => (
            <span
              key={c.id}
              className="badge badge-primary bg-green-500 border-none text-white mr-1"
            >
              {c.displayName}
            </span>
          ))}
        </div>
    );
  };

  const modifiedDateBodyTemplate = (item) => {

   
    const localFormattedDate =formatUtcToLocal(item.modifiedDate_UTC);
    return isTableDataLoading ? <span>Loading...</span> : <span>{item.modifiedDate_UTC ? localFormattedDate : ''}</span>;
  };

  const handleInputChange = (setState, state, value) => {
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const [showDialog, setShowDialog] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const confirmDelete = (outputMessage, productId) => {
    setProductIdToDelete(productId);
    setShowDialog(true);
  };


  const deleteAcceptHandler = async (productId) => {
    try {
      setProductIdToDelete('');
      const result = await deleteProduct(productId, true);
      const { data } = result;
      if (data.error) {
        showToast('danger', 'Exception', data.error.message);
        return;
      }
      setProducts(products.filter(p => p.productId !== productId));
      setTotalRecords(totalRecords-1);
      showToast('success', 'Successful', data.outputValues.outputMessage);
    } catch (err) {
      console.log('err :', err);
    }
  };



  const handleConfirm = () => {
    deleteAcceptHandler(productIdToDelete);
    setShowDialog(false);
  };

  const handleCancel = () => {
    // Handle the cancellation action here
    console.log("Cancelled!");
    setShowDialog(false);
    setProductIdToDelete('');
  };




  const [selectedRowId, setSelectedRowId] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null); // Track expanded row
  

  const [nonSerializedDetails, setNonSerializedDetails] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);

  const handleRowSelect = (index,product) => {
    setSelectedRowIndex(index);
    setSelectedProduct(product);
};

const fetchExtraDetails = (productId) => {
    // Your API call to fetch extra details
    // setExtraDetails(response.data);
};


  // const handleRowExpand = async (productId) => {
  //   const details = await getProductExtraDetails(productId); // Implement this function
  //   setExtraDetails(details);
  //   setSelectedProduct(productId);
  // };
const [selectedRowIndex,setSelectedRowIndex]=useState(null);
  const handleRowExpand = async (index,product) => {
    
    // If clicking the same row, collapse it
    if (expandedRowId === index) {
      setExpandedRowId(null);

    } else {
      setExpandedRowId(index);
    }
    setSelectedRowIndex(index);
    setSelectedProduct(product);
  };


  return (
    <div className="px-10">
      {showDialog && (
        <ConfirmDialog
          isVisible={true}
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Confirm Delete"
          severity="danger"
        />
      )}

      <div className="flex justify-between py-5 gap-2 items-end">

        <div className="flex space-x-4 w-full">
          <div className="flex flex-col">
            <label className="text-[1rem] font-semibold">Product Type</label>
            <div className="flex flex-row gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="singleProduct"
                  checked={isSingleProductChecked}
                  onChange={(e) => setIsSingleProductChecked(e.target.checked)}
                />
                <label htmlFor="singleProduct" className="font-semibold">
                  Single
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="variationProduct"
                  checked={isVariationProductChecked}
                  onChange={(e) =>
                    setIsVariationProductChecked(e.target.checked)
                  }
                />
                <label htmlFor="variationProduct" className="font-semibold">
                  Variation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="comboProduct"
                  checked={isComboProductChecked}
                  onChange={(e) => setIsComboProductChecked(e.target.checked)}
                />
                <label htmlFor="comboProduct" className="font-semibold">
                  Combo
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-1/5">
            <label className="text-[1rem]">Store</label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(parseInt(e.target.value))}
              className="select select-bordered w-full"
            >
              {storesOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2 w-1/5">
            <label className="text-[1rem]">Filter By</label>
            <select
              value={selectedFilterBy.value}
              onChange={(e) =>
                handleInputChange(
                  setSelectedFilterBy,
                  selectedFilterBy,
                  parseInt(e.target.value)
                )
              }
              className="select select-bordered w-full"
            >
              {filterByOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>

          {[1, 2, 3].includes(selectedFilterBy.value) && (
            <div className="flex flex-col space-y-2 w-[35%]">
              <label className="text-[1rem]">Search Value</label>
              <input
                type="text"
                value={searchValue.value}
                onChange={(e) =>
                  handleInputChange(setSearchValue, searchValue, e.target.value)
                }
                className="input input-bordered w-full"
              />
            </div>
          )}

          {selectedFilterBy.value === 4 && (
            <div className="flex flex-col space-y-2 w-1/5">
              <label className="text-[1rem]">Category</label>
              <select
                value={selectedCategoryId}
                onChange={(e) =>
                  setSelectedCategoryId(parseInt(e.target.value))
                }
                className="select select-bordered w-full"
              >
                {categoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedFilterBy.value === 5 && (
            <div className="flex flex-col space-y-2 w-1/5">
              <label className="text-[1rem]">Measurement Unit</label>
              <select
                value={selectedMeasurementUnitId}
                onChange={(e) =>
                  setSelectedMeasurementUnitId(parseInt(e.target.value))
                }
                className="select select-bordered w-full"
              >
                {measurementUnitOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          className="btn btn-ghost text-[#0284c7] font-bold"
          onClick={() => navigate(`/addProduct/add/0`)}
          title="Add Product"
        >
          <FontAwesomeIcon className="text-xl" icon={faPlusSquare} />
          Create New
        </button>
      </div>
      <div className="flex justify-between w-full bg-white p-4">
        {/* Items count display */}
        <div className="pl-3">
          <span className=" text-gray-500">{totalRecords} items found</span>
        </div>

        {/* DaisyUIPaginator component */}
        <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 30, 50, 100]}
        />
      </div>
      <div className="flex flex-col ">
        {/* <ProductDetails selectedProduct={selectedProduct}  /> */}

        <table className="table w-full border-collapse">
          <thead className="sticky top-0 bg-base-100 z-10 text-[1rem] border-b border-gray-300">
            <tr>
              {/* <th className="px-4 py-2">Product Id</th> */}
              <th className=""></th>
              <th className="px-4 py-2">Product No</th>
              <th className="px-4 py-2">Product Name</th>

              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Cost Price</th>
              <th className="px-4 py-2">Unit Price</th>
              <th className="px-4 py-2">Stock Qty</th>
              <th className="px-4 py-2">Product Type</th>
              <th className="px-4 py-2">SKU</th>
              {/* <th className="px-4 py-2">Category</th> */}
              <th className="px-4 py-2">Tax Rate(%)</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <React.Fragment key={index}>
                {/* {JSON.stringify(index)}
                  {JSON.stringify(expandedRowId)} */}
                {/* {JSON.stringify(item)} */}
                <tr
                  onClick={() => handleRowSelect(index, item)}
                  className={`border-b border-gray-200 text-[1rem] ${
                    selectedRowIndex === index
                      ? "bg-blue-500 text-white hover:bg-blue-500 "
                      : "hover:bg-gray-100"
                  }`}
                >
            
                    <td
                      className=" cursor-pointer"
                      onClick={() => handleRowExpand(index, item)}
                    >
                      {expandedRowId === index ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </td>
                  
                  <td className="px-4 py-2">{productNoBodyTemplate(item)}</td>
                  <td className="px-4 py-2">{productNameBodyTemplate(item)}</td>

                  <td className="px-4 py-2">{brandBodyTemplate(item)}</td>
                  <td className="px-4 py-2">{costPriceBodyTemplate(item)}</td>

                  <td className="px-4 py-2">{unitPriceBodyTemplate(item)}</td>

                  <td className="px-4 py-2">{stockQtyBodyTemplate(item)}</td>
                  <td className="px-4 py-2">{productTypeBodyTemplate(item)}</td>

                  <td className="px-4 py-2">{barcodeBodyTemplate(item)}</td>
                  {/* <td className="px-4 py-2">{categoriesBodyTemplate(item)}</td> */}
                  <td className="px-4 py-2">
                    {taxRate_percBodyTemplate(item)}
                  </td>
                  <td className="px-4 py-2">{actionButtons(item)}</td>
                </tr>
                {/* Extra details row (conditionally rendered) */}

                {expandedRowId === index && (
                  <tr >
                    <td colSpan="12" className='bg-slate-50'>
                      <ProductDetails selectedProduct={item} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
