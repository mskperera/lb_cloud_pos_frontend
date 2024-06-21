import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash,faPlus, faPlay, faSignIn, faPlusSquare, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteCustomer, getCustomers } from "../../functions/customer";
import { formatUtcToLocal } from '../../utils/format';
import { useToast } from '../useToast';
import DaisyUIPaginator from '../DaisyUIPaginator';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { validate } from '../../utils/formValidation';

export default function CustomerList({selectingMode,onselect }) {
  const [products, setCustomers] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedMeasurmentUnitId, setSelectedMeasurmentUnitId] = useState(-1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    loadCustomers(selectedCategoryId, event.page, rowsPerPage);
  };

  const [selectedFilterBy,setSelectedFilterBy] =useState({
    label: "Filter by",
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue,setSearchValue] =useState({
    label: "Search Value",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });


  const loadCustomers = async () => {
    try{
    setIsTableDataLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;

    const filteredData = {
      customerId: null,
      customerCode: selectedFilterBy.value===1 ? searchValue.value:null,
      customerName: selectedFilterBy.value===2 ? searchValue.value:null,

      email: selectedFilterBy.value===3 ? searchValue.value:null,
      mobile: selectedFilterBy.value===4 ? searchValue.value:null,
      tel: selectedFilterBy.value===5 ? searchValue.value:null,
      whatsappNumber: selectedFilterBy.value===6 ? searchValue.value:null,

      searchByKeyword: false,
      skip: skip,
      limit: limit,
    };
    const _result = await getCustomers(filteredData, null);
    const { totalRows } = _result.data.outputValues;
    setTotalRecords(totalRows);
    console.log("ppppp", _result.data);

    setCustomers(_result.data.results[0]);
    setIsTableDataLoading(false);
  }
  catch(err){
    setIsTableDataLoading(false);
    console.log('error:',err);
  }
  };

  useEffect(() => {
    loadCustomers(selectedCategoryId);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    console.log("useEffect search by value");
  
    const delayedLoadCustomers = setTimeout(() => {
        loadCustomers(selectedCategoryId);
    }, 1000);

    return () => clearTimeout(delayedLoadCustomers);
  
}, [searchValue.value]);



  const [filterByOptions,setFilterByOptions] =useState([{id:1,displayName:'Customer Code'},{id:2,displayName:'Customer Name'},{id:3,displayName:'Email'},{id:4,displayName:'Mobile'},{id:5,displayName:'Tel'},{id:6,displayName:'Whatsapp'}]);






  const [showDialog, setShowDialog] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const confirmDelete = (outputMessage, productId) => {
    setSelectedIdToDelete(productId);
    setShowDialog(true);
  };

  const deleteAcceptHandler = async (customerId) => {
    try {
      setSelectedIdToDelete('');
      const result = await deleteCustomer(customerId, true);

      const { data } = result;
      if (data.error) {
        showToast("error", "Exception", data.error.message);
        return;
      }

      setCustomers(products.filter(p=>p.customerId!==customerId));
      setTotalRecords(totalRecords-1);
      showToast("success", "Successful", data.outputValues.outputMessage);
    } catch (err) {
      console.log("err :", err);
    }
  };


  const handleConfirm = () => {
    deleteAcceptHandler(selectedIdToDelete);
    setShowDialog(false);
  };

  const handleCancel = () => {
    // Handle the cancellation action here
    console.log("Cancelled!");
    setShowDialog(false);
    setSelectedIdToDelete('');
  };





  const handleInputChange = (setState, state, value) => {
    console.log("Nlllll", state);
    if (!state.rules) {
      console.error("No rules defined for validation in the state", state);
      return;
    }
    const validation = validate(value, state);
    setState({
      ...state,
      value: value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };


  

  

//// replaceed by daisy
  const customerCodeBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.customerCode}</span>
  );

  const customerNameBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.customerName}</span>
  );

  const emailBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.email}</span>
  );

  const mobileBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.mobile}</span>
  );

  const telBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.tel}</span>
  );

  const whatsappNumberBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.whatsappNumber}</span>
  );

  const modifiedDateBodyTemplate = (product) => {
    const localFormattedDate =formatUtcToLocal(product.modifiedDate_UTC);
    return isTableDataLoading ? <span>Loading...</span> : <span>{product.modifiedDate_UTC ? localFormattedDate : ''}</span>;
  };
//


  
const actionButtons = (item) => (
  <div className="flex space-x-2">

  {selectingMode && <button
      className="btn btn-primary btn-xs bg-[#0284c7] text-base-100"
      onClick={() => {
        onselect(item.customerId); 
      }}
      aria-label="Select" title='Select Customer'
    >
      <FontAwesomeIcon icon={faSignIn} />
    </button>}

    <button
      className="btn btn-error btn-xs bg-[#f87171] text-base-100 "
      onClick={async () => {
        const result = await deleteCustomer(item.customerId, false);
        const { outputMessage, responseStatus } = result.data.outputValues;
        confirmDelete(outputMessage, item.customerId);
      }}
      aria-label="Delete"
      title='Delete customer'
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
    <button
      className="btn btn-warning btn-xs bg-[#fb923c] text-base-100"
      onClick={() =>    navigate(`/addCustomer/update/${item.customerId}`)}
      aria-label="Edit" title='Edit customer'
    >
      <FontAwesomeIcon icon={faEdit} />
    </button>
  </div>
);



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
        


       
        </div>


<div className='flex justify-center items-center'>

{/* <button
          className="btn btn-ghost text-[#0284c7]"
          onClick={() => {
            onselect(selectedCustomer.customerId); 
          }}
          title="Select Cutomer"
        >
          <FontAwesomeIcon className="text-xl" icon={faSignIn} />Select Cutomer
        </button> */}
        <button
         className="btn btn-ghost text-[#0284c7] font-bold"
          onClick={() =>        navigate(`/addCustomer/add/0`)}
          title="Add Product"
        >
          <FontAwesomeIcon className="text-xl" icon={faUserPlus} />New Customer
        </button>
</div>
      </div>

        <div className="flex justify-content-between align-items-center px-5 gap-2">
          <div className="col-9">
            <div className="grid w-full">
          
           
            </div>
          </div>


        </div>


        <div className="flex flex-col h-[65vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 bg-base-100 z-10 text-[1rem] border-b border-gray-300">
              <tr>
                {/* <th className="px-4 py-2">Product Id</th> */}
                <th className="px-4 py-2">Customer Code</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Tel</th>
                <th className="px-4 py-2">Whatsapp/Mobile</th>
                <th className="px-4 py-2">Modified</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.customerId}
                  className="border-b border-gray-200 hover:bg-gray-100 bg-white text-[1rem]"
                >
                  <td className="px-4 py-2">{product.customerId}</td>
                  <td className="px-4 py-2">
                    {customerCodeBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {customerNameBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {emailBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">
                    {mobileBodyTemplate(product)}
                  </td>
                  <td className="px-4 py-2">{telBodyTemplate(product)}</td>
              
                  <td className="px-4 py-2">
                    {whatsappNumberBodyTemplate(product)}
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
