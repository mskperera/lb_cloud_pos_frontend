import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteCustomer, getContacts } from "../../functions/contacts";
import { formatUtcToLocal } from '../../utils/format';
import { useToast } from '../useToast';
import DaisyUIPaginator from '../DaisyUIPaginator';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { validate } from '../../utils/formValidation';
import { CONTACT_TYPE, SAVE_TYPE } from '../../utils/constants';
import GhostButton from "../iconButtons/GhostButton";

export default function CustomerList({ selectingMode, onselect }) {
  const [products, setCustomers] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedFilterBy, setSelectedFilterBy] = useState({
    label: "Filter by",
    value: 1,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "integer" },
  });

  const [searchValue, setSearchValue] = useState({
    label: "Search Value",
    value: null,
    isTouched: false,
    isValid: false,
    rules: { required: false, dataType: "string" },
  });

  const [selectedContactType, setSelectedContactType] = useState({
    label: "Contact Type",
    value: null,
    isTouched: false,
    isValid: true,
    rules: { required: false },
  });

  useEffect(() => {
    loadCustomers(selectedCategoryId);
  }, [currentPage, rowsPerPage, selectedContactType.value]);

  useEffect(() => {
    const delayedLoadCustomers = setTimeout(() => {
      loadCustomers(selectedCategoryId);
    }, 1000);
    return () => clearTimeout(delayedLoadCustomers);
  }, [searchValue.value]);

  const [filterByOptions] = useState([
    { id: 1, displayName: 'Customer Code' },
    { id: 2, displayName: 'Customer Name' },
    { id: 3, displayName: 'Email' },
    { id: 4, displayName: 'Mobile' },
    { id: 5, displayName: 'Tel' },
    { id: 6, displayName: 'Whatsapp' }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const confirmDelete = (outputMessage, productId) => {
    setSelectedIdToDelete(productId);
    setShowDialog(true);
  };

  const deleteAcceptHandler = async (contactId) => {
    try {
      setSelectedIdToDelete('');
      const result = await deleteCustomer(contactId, true);
      const { data } = result;
      if (data.error) {
        showToast("error", "Exception", data.error.message);
        return;
      }
      setCustomers(products.filter(p => p.contactId !== contactId));
      setTotalRecords(totalRecords - 1);
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
    setShowDialog(false);
    setSelectedIdToDelete('');
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

  const contactTypeOptions = [
    { id: null, displayName: "All" },
    { id: CONTACT_TYPE.CUSTOMER, displayName: "Customer" },
    { id: CONTACT_TYPE.CUSTOMER_SUPPLIER, displayName: "Customer / Supplier" },
    { id: CONTACT_TYPE.SUPPLIER, displayName: "Supplier" },
  ];

  const loadCustomers = async () => {
    try {
      setIsTableDataLoading(true);
      const skip = currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const filteredData = {
        contactId: null,
        contactTypeIds: selectedContactType.value !== null
          ? [selectedContactType.value]
          : [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.SUPPLIER, CONTACT_TYPE.CUSTOMER_SUPPLIER],
        contactCode: selectedFilterBy.value === 1 ? searchValue.value : null,
        contactName: selectedFilterBy.value === 2 ? searchValue.value : null,
        email: selectedFilterBy.value === 3 ? searchValue.value : null,
        mobile: selectedFilterBy.value === 4 ? searchValue.value : null,
        tel: selectedFilterBy.value === 5 ? searchValue.value : null,
        whatsappNumber: selectedFilterBy.value === 6 ? searchValue.value : null,
        searchByKeyword: false,
        skip: skip,
        limit: limit,
      };

      const _result = await getContacts(filteredData, null);
      const { totalRows } = _result.data.outputValues;
      setTotalRecords(totalRows);
      setCustomers(_result.data.results[0]);
      setIsTableDataLoading(false);
    } catch (err) {
      setIsTableDataLoading(false);
      console.log("error:", err);
    }
  };

  const actionButtons = (item) => (
    <div className="flex gap-2">
      {selectingMode && (
        <button
          className="px-3 py-1 text-white bg-sky-600 hover:bg-sky-700 rounded text-sm"
          onClick={() => onselect(item.contactId)}
          aria-label="Select"
          title="Select Customer"
        >
          <FontAwesomeIcon icon={faSignIn} />
        </button>
      )}

      <GhostButton
        onClick={async () => {
          const result = await deleteCustomer(item.contactId, false);
          const { outputMessage } = result.data.outputValues;
          confirmDelete(outputMessage, item.contactId);
        }}
        iconClass="pi pi-trash"
        label="Delete"
        color="text-red-500"
        hoverClass="hover:text-red-700 hover:bg-transparent"
      />

      <GhostButton
        onClick={() => navigate(`/customers/edit?id=${item.contactId}`)}
        iconClass="pi pi-pencil"
        label="Edit"
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

      <div className="flex justify-between items-end p-5 gap-4">
        <div className="flex flex-col w-1/5">
          <label className="text-sm font-medium">Contact Type</label>
          <select
            value={selectedContactType.value}
            onChange={(e) =>
              handleInputChange(
                setSelectedContactType,
                selectedContactType,
                e.target.value !== "null" ? parseInt(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring focus:ring-sky-200"
          >
            {contactTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 gap-4">
          <div className="flex flex-col w-1/5">
            <label className="text-sm font-medium">Filter By</label>
            <select
              value={selectedFilterBy.value}
              onChange={(e) =>
                handleInputChange(
                  setSelectedFilterBy,
                  selectedFilterBy,
                  parseInt(e.target.value)
                )
              }
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring focus:ring-sky-200"
            >
              {filterByOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-[35%]">
            <label className="text-sm font-medium">Search Value</label>
            <input
              type="text"
              value={searchValue.value || ''}
              onChange={(e) => handleInputChange(setSearchValue, searchValue, e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:text-sky-800 font-semibold border border-sky-600 rounded"
            onClick={() => navigate(`/customers/add?saveType=${SAVE_TYPE.ADD}&id=0`)}
          >
            <FontAwesomeIcon className="text-lg" icon={faUserPlus} /> New Customer
          </button>
        </div>
      </div>

      <div className="flex flex-col h-[65vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-white">
          <table className="w-full border border-gray-300">
            <thead className="sticky top-0 bg-gray-100 text-sm border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Contact Type</th>
                <th className="px-4 py-2 text-left">Contact Code</th>
                <th className="px-4 py-2 text-left">Contact Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile</th>
                <th className="px-4 py-2 text-left">Tel</th>
                <th className="px-4 py-2 text-left">Modified</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.contactId}
                  className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <td className="px-4 py-2">{product.contactTypeName}</td>
                  <td className="px-4 py-2">{product.contactCode}</td>
                  <td className="px-4 py-2">{product.contactName}</td>
                  <td className="px-4 py-2">{product.email}</td>
                  <td className="px-4 py-2">{product.mobile}</td>
                  <td className="px-4 py-2">{product.tel}</td>
                  <td className="px-4 py-2">{formatUtcToLocal(product.modifiedDate_UTC)}</td>
                  <td className="px-4 py-2">{actionButtons(product)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between w-full p-4 text-sm">
        <div className="text-gray-500">{totalRecords} items found</div>
        <DaisyUIPaginator
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRecords={totalRecords}
          onPageChange={(e) => {
            setCurrentPage(e.page);
            setRowsPerPage(e.rows);
            loadCustomers(selectedCategoryId, e.page, rowsPerPage);
          }}
          rowsPerPageOptions={[10, 30, 50, 100]}
        />
      </div>
    </div>
  );
}
