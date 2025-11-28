import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCustomer, getContacts } from "../../functions/contacts";
import { formatUtcToLocal } from '../../utils/format';
import { useToast } from '../useToast';
import DaisyUIPaginator from '../DaisyUIPaginator';
import { FaTimes, FaUserPlus, FaSignInAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { CONTACT_TYPE, SAVE_TYPE } from '../../utils/constants';

export default function CustomerList({ selectingMode = false, onselect }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedFilterBy, setSelectedFilterBy] = useState(2); // Default: Name
  const [searchValue, setSearchValue] = useState("");
  const [selectedContactType, setSelectedContactType] = useState(null); // null = All

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const contactTypeOptions = [
    { id: null, name: "All Contacts" },
    { id: CONTACT_TYPE.CUSTOMER, name: "Customer" },
    { id: CONTACT_TYPE.CUSTOMER_SUPPLIER, name: "Customer / Supplier" },
    { id: CONTACT_TYPE.SUPPLIER, name: "Supplier" },
  ];

  const filterOptions = [
    { id: 1, name: "Customer Code" },
    { id: 2, name: "Customer Name" },
    { id: 3, name: "Email" },
    { id: 4, name: "Mobile" },
    { id: 5, name: "Tel" },
    { id: 6, name: "Whatsapp" },
  ];

  const loadCustomers = async () => {
    setIsLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;

    const payload = {
      contactTypeIds: selectedContactType === null
        ? [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.SUPPLIER, CONTACT_TYPE.CUSTOMER_SUPPLIER]
        : [selectedContactType],
      contactCode: selectedFilterBy === 1 ? searchValue : null,
      contactName: selectedFilterBy === 2 ? searchValue : null,
      email: selectedFilterBy === 3 ? searchValue : null,
      mobile: selectedFilterBy === 4 ? searchValue : null,
      tel: selectedFilterBy === 5 ? searchValue : null,
      whatsappNumber: selectedFilterBy === 6 ? searchValue : null,
      skip,
      limit,
    };

    try {
      const res = await getContacts(payload);
      setCustomers(res.data.results[0] || []);
      setTotalRecords(res.data.outputValues.totalRows || 0);
    } catch (err) {
      showToast("error", "Error", "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
      loadCustomers();
    }, 600);
    return () => clearTimeout(timer);
  }, [searchValue, selectedFilterBy, selectedContactType]);

  useEffect(() => {
    loadCustomers();
  }, [currentPage, rowsPerPage]);

  const handleDelete = async () => {
    try {
      const res = await deleteCustomer(deletingId, true);
      if (res.data.error) {
        showToast("error", "Failed", res.data.error.message);
      } else {
        setCustomers(prev => prev.filter(c => c.contactId !== deletingId));
        setTotalRecords(prev => prev - 1);
        showToast("success", "Deleted", res.data.outputValues.outputMessage);
      }
    } catch (err) {
      showToast("error", "Error", "Delete failed");
    } finally {
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowDeleteDialog(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="text-4xl text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Delete Customer?</h3>
                <p className="text-gray-600 mt-2">This action cannot be undone.</p>
              </div>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowDeleteDialog(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <button
            onClick={() => navigate(`/customers/add?saveType=${SAVE_TYPE.ADD}&id=0`)}
            className="flex items-center gap-3 px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <FaUserPlus className="text-xl" />
            New Customer
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-6 gap-6">
            <div className=''>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Type</label>
              <select
                value={selectedContactType ?? ""}
                onChange={(e) => setSelectedContactType(e.target.value ? +e.target.value : null)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              >
                {contactTypeOptions.map(opt => (
                  <option key={opt.id} value={opt.id ?? ""}>{opt.name}</option>
                ))}
              </select>
            </div>

              <div className=''>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By</label>
              <select
                value={selectedFilterBy}
                onChange={(e) => setSelectedFilterBy(+e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500"
              >
                {filterOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

               <div className='col-span-4'>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  {["Type", "Code", "Name", "Email", "Mobile", "Tel", "Modified", "Actions"].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <div className="inline-block animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20 text-gray-500 text-lg">No customers found</td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.contactId} className="hover:bg-sky-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.contactTypeName}</td>
                      <td className="px-6 py-4 font-medium">{c.contactCode}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{c.contactName}</td>
                      <td className="px-6 py-4 text-gray-600">{c.email || "-"}</td>
                      <td className="px-6 py-4">{c.mobile || "-"}</td>
                      <td className="px-6 py-4">{c.tel || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatUtcToLocal(c.modifiedDate_UTC)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {selectingMode && (
                            <button
                              onClick={() => onselect(c)}
                              className="p-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 active:scale-95 transition"
                              title="Select Customer"
                            >
                              <FaSignInAlt />
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/customers/edit?id=${c.contactId}`)}
                            className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 active:scale-95 transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(c.contactId);
                              setShowDeleteDialog(true);
                            }}
                            className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-95 transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">{totalRecords} customers</span>
            <DaisyUIPaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={({ page, rows }) => {
                setCurrentPage(page);
                setRowsPerPage(rows);
              }}
              rowsPerPageOptions={[10, 30, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
}