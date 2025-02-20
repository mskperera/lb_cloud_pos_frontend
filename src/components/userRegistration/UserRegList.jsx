import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSignIn, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteCustomer, getContacts } from "../../functions/contacts";
import { formatUtcToLocal } from '../../utils/format';
import { useToast } from '../useToast';
import DaisyUIPaginator from '../DaisyUIPaginator';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { validate } from '../../utils/formValidation';
import { CONTACT_TYPE, SAVE_TYPE, USER_ROLE } from '../../utils/constants';
import GhostButton from "../iconButtons/GhostButton";
import { deleteUserRegistrations, getUserRegistrations } from '../../functions/userRegistration';

export default function UserRegList({selectingMode,onselect }) {
  const [userRegistrations, setUserRegistration] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  const [currentPage, setCurrentPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    loadList(selectedCategoryId, event.page, rowsPerPage);
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
    value: null,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });


  const [selectedUserRole, setSelectedUserRole] = useState({
    label: "Contact Type",
    value: null,
    isTouched: false,
    isValid: true,
    rules: { required: false },
  });
  

  useEffect(() => {
    loadList(selectedCategoryId);
  }, [currentPage, rowsPerPage,selectedUserRole.value]);

  useEffect(() => {
    console.log("useEffect search by value");
  
    const delayedLoadCustomers = setTimeout(() => {
        loadList(selectedCategoryId);
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

  const deleteAcceptHandler = async (userId) => {
    try {
      setSelectedIdToDelete('');
      const result = await deleteUserRegistrations(userId, true);

      const { data } = result;
      if (data.error) {
        showToast("error", "Exception", data.error.message);
        return;
      }

      setUserRegistration(userRegistrations.filter(p=>p.userId!==userId));
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


  const contactTypeOptions = [
    { id: null, displayName: "All" },
    { id: USER_ROLE.ADMIN, displayName: "Admin" },
    { id: USER_ROLE.MANAGER, displayName: "Manager" },
    { id: USER_ROLE.CASHIER, displayName: "Cashier" },
  ];
  

  const loadList = async () => {
    try {
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;
  
      const filteredData = {
        userId: null,
        userRoleIds: selectedUserRole.value !== null 
          ? [selectedUserRole.value] 
          : [USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.CASHIER],
        username: selectedFilterBy.value === 1 ? searchValue.value : null,
        email: selectedFilterBy.value === 3 ? searchValue.value : null,
        searchByKeyword: false,
        skip: skip,
        limit: limit,
      };
  
      const _result = await getUserRegistrations(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      console.log("ppppp", _result.data);
  
      setUserRegistration(_result.data.results[0]);
      setIsTableDataLoading(false);
    } catch (err) {
      setIsTableDataLoading(false);
      console.log("error:", err);
    }
  };
  

  

//// replaceed by daisy
const userRoleBodyTemplate = (rowData) => (
  isTableDataLoading ? <span>Loading...</span> : <span>{rowData.userRoleName}</span>
);


  const usernameBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.uName}</span>
  );

  const passwordBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.password}</span>
  );

  const emailBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.email}</span>
  );

  const displayNameBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.displayName}</span>
  );

  const statusBodyTemplate = (rowData) => (
    isTableDataLoading ? <span>Loading...</span> : <span>{rowData.isActive}</span>
  );


  const modifiedDateBodyTemplate = (item) => {
    const localFormattedDate =formatUtcToLocal(item.modifiedDate_UTC);
    return isTableDataLoading ? <span>Loading...</span> : <span>{item.modifiedDate_UTC ? localFormattedDate : ''}</span>;
  };
//


  
const actionButtons = (item) => (
  <div className="flex gap-4">

  {selectingMode && <button
      className="btn btn-primary btn-xs bg-[#0284c7] text-base-100"
      onClick={() => {
        onselect(item.userId); 
      }}
      aria-label="Select" title='Select Customer'
    >
      <FontAwesomeIcon icon={faSignIn} />
    </button>}


      {/* Delete */}
      <GhostButton
          onClick={async () => {
            const result = await deleteUserRegistrations(item.userId, false);
            const { outputMessage, responseStatus } = result.data.outputValues;
            confirmDelete(outputMessage, item.userId);
          }}
            iconClass="pi pi-trash"
            label="Delete"
          //  tooltip="Delete this item"
            color="text-red-500"
            hoverClass="hover:text-red-700 hover:bg-transparent"
          />

          {/* Edit */}
          <GhostButton
           onClick={() =>    navigate(`/customers/edit?id=${item.userId}`)}
    
            iconClass="pi pi-pencil"
            label="Edit"
          //  tooltip="Edit this item"
            color="text-green-500"
            hoverClass="hover:text-green-700 hover:bg-transparent"
          />
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


<div className="flex justify-end items-end p-5 gap-2">

        <button
         className="btn btn-ghost text-[#0284c7] font-bold"
          onClick={() =>        navigate(`/customers/add?saveType=${SAVE_TYPE.ADD}&id=0`)}
          title="Add Product"
        >
          <FontAwesomeIcon className="text-xl" icon={faUserPlus} />New User
        </button>

      </div>

        <div className="flex justify-content-between align-items-center px-5 gap-2">
          <div className="col-9">
            <div className="grid w-full">
          
           
            </div>
          </div>


        </div>


        <div className="flex flex-col h-[65vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-white">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 bg-gray-200 z-10 text-[1rem] border-b border-gray-300">
              <tr>
                {/* <th className="px-4 py-2">Product Id</th> */}
                <th className="px-4 py-2">User Role</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Password</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Display Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Modified</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* {JSON.stringify(userRegistrations)} */}
              {userRegistrations.map((item) => (
                <tr
                  key={item.userId}
                  className="border-b border-gray-200 hover:bg-gray-100 text-[1rem]"
                > 
                  <td className="px-4 py-2">
                    {userRoleBodyTemplate(item)}
                  </td>

                  <td className="px-4 py-2">
                    {usernameBodyTemplate(item)}
                  </td>
                  <td className="px-4 py-2">
                    {passwordBodyTemplate(item)}
                  </td>
                  <td className="px-4 py-2">
                    {emailBodyTemplate(item)}
                  </td>
                   <td className="px-4 py-2">
                    {displayNameBodyTemplate(item)}
                  </td>
                  <td className="px-4 py-2">{statusBodyTemplate(item)}</td>
               
            
                  <td className="px-4 py-2">
                    {modifiedDateBodyTemplate(item)}
                  </td>
                  <td className="px-4 py-2">{actionButtons(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      

      <div className="flex justify-between w-full p-4">
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
