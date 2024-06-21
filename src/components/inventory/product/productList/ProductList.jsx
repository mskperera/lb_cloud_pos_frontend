import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatUtcToLocal } from '../../../../utils/format';
import { deleteProduct, getProducts } from '../../../../functions/register';
import { useToast } from '../../../useToast';
import moment from 'moment';
import { getDropdownMeasurementUnit, getDrpdownCategory } from '../../../../functions/dropdowns';
import { validate } from '../../../../utils/formValidation';
import FormElementMessage from '../../../messges/FormElementMessage';
import DaisyUIPaginator from '../../../DaisyUIPaginator';
import ConfirmDialog from '../../../dialog/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash,faPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export default function ProductOrderList({ }) {
  const [products, setProducts] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurementUnitId, setSelectedMeasurementUnitId] = useState(-1);

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

      const filteredData = {
        productId: null,
        productNo: selectedFilterBy.value === 1 ? searchValue.value : null,
        productName: selectedFilterBy.value === 2 ? searchValue.value : null,
        barcode: selectedFilterBy.value === 3 ? searchValue.value : null,
        categoryId: selectedCategoryId,
        measurementUnitId: selectedMeasurementUnitId,
        searchByKeyword: false,
        skip: skip,
        limit: limit,
      };

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
    loadProducts();
  }, [selectedCategoryId, selectedMeasurementUnitId, currentPage, rowsPerPage]);

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
    loadDrpCategory();
    loadDrpMeasurementUnit();
  }, []);

  const loadDrpCategory = async () => {
    const objArr = await getDrpdownCategory();
    setCategoryOptions([{ id: -1, displayName: 'All' }, ...objArr.data.results[0]]);
  };

  const loadDrpMeasurementUnit = async () => {
    const objArr = await getDropdownMeasurementUnit();
    setMeasurementUnitOptions([{ id: -1, displayName: 'All' }, ...objArr.data.results[0]]);
  };

  const actionButtons = (product) => (
    <div className="flex space-x-2">
      <button
        className="btn btn-error btn-xs bg-[#f87171] text-base-100 "
        onClick={async () => {
          const result = await deleteProduct(product.productId, false);
          const { outputMessage, responseStatus } = result.data.outputValues;
          confirmDelete(outputMessage, product.productId);
        }}
        aria-label="Delete"
        title='Delete Product'
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button
        className="btn btn-warning btn-xs bg-[#fb923c] text-base-100"
        onClick={() => navigate(`/addProduct/update/${product.productId}`)}
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

  const barcodeBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.barcode}</span>
  );

  const taxRate_percBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.taxRate_perc}</span>
  );

  const categoriesBodyTemplate = (product) => {
    const categories = JSON.parse(product.categories);
    return (
      isTableDataLoading ? <span>Loading...</span> :
        <>
          {categories.map((c) => (
            <span
              key={c.id}
              className="badge badge-primary bg-green-500 border-none text-white mr-1"
            >
              {c.displayName}
            </span>
          ))}
        </>
    );
  };

  const modifiedDateBodyTemplate = (product) => {

   
    const localFormattedDate =formatUtcToLocal(product.modifiedDate_UTC);
    return isTableDataLoading ? <span>Loading...</span> : <span>{product.modifiedDate_UTC ? localFormattedDate : ''}</span>;
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

      <div className="flex justify-between items-end p-5 gap-2">
        <div className="flex space-x-4 w-full">
      
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
                    handleInputChange(
                      setSearchValue,
                      searchValue,
                      e.target.value
                    )
                  }
                  className="input input-bordered w-full"
                />
              </div>
            )}

        {selectedFilterBy.value===4 && <div className="flex flex-col space-y-2 w-1/5">
            <label className="text-[1rem]">Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
              className="select select-bordered w-full"
            >
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>}

          {selectedFilterBy.value===5 && 
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
          </div>}
       
        </div>


        <button
         className="btn btn-ghost text-[#0284c7] font-bold"
          onClick={() => navigate(`/addProduct/add/0`)}
          title="Add Product"
        >
          <FontAwesomeIcon className="text-xl" icon={faPlusSquare} />Create New Product
        </button>
      </div>
      <div className="flex flex-col h-[65vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 bg-base-100 z-10 text-[1rem] border-b border-gray-300">
              <tr>
                {/* <th className="px-4 py-2">Product Id</th> */}
                <th className="px-4 py-2">Product No</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Measurement Unit</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Barcode</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Tax Rate(%)</th>
                <th className="px-4 py-2">Modified</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.productId}
                  className="border-b border-gray-200 hover:bg-gray-100 bg-white text-[1rem]"
                >
                  {/* <td className="px-4 py-2">{product.productId}</td> */}
                  <td className="px-4 py-2">
                    {productNoBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {productNameBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {measurementUnitNameBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {unitPriceBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">{barcodeBodyTemplate(product)}</td>
                  <td className="px-4 py-2">
                    {categoriesBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {taxRate_percBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {modifiedDateBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">{actionButtons(product)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
