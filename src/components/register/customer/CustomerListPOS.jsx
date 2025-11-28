import React, { useState, useEffect, useRef } from 'react';
import { formatUtcToLocal } from '../../../utils/format';
import { getContacts } from '../../../functions/contacts';
import { useToast } from '../../useToast';
import DaisyUIPaginator from '../../DaisyUIPaginator';
import { FaTimes, FaSignInAlt } from 'react-icons/fa';
import { CONTACT_TYPE } from '../../../utils/constants';

export default function CustomerSelectionModal({ showCustomerList, setShowCustomerList, onCustomerSelectHandler }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedFilterBy, setSelectedFilterBy] = useState({ value: 2 }); // Name by default
  const [searchValue, setSearchValue] = useState({ value: "" });
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const searchInputRef = useRef(null);

  const filterByOptions = [
    { id: 1, displayName: 'Customer Code' },
    { id: 2, displayName: 'Customer Name' },
    { id: 3, displayName: 'Email' },
    { id: 4, displayName: 'Mobile' },
    { id: 5, displayName: 'Tel' },
    { id: 6, displayName: 'Whatsapp' },
  ];

  const loadCustomers = async () => {
    if (!showCustomerList) return;

    setIsLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;


        const payload = {
      contactId: null,
      contactTypeIds:[CONTACT_TYPE.CUSTOMER,CONTACT_TYPE.CUSTOMER_SUPPLIER],
      contactCode: selectedFilterBy.value===1 ? searchValue.value:null,
      contactName: selectedFilterBy.value===2 ? searchValue.value:null,

      email: selectedFilterBy.value===3 ? searchValue.value:null,
      mobile: selectedFilterBy.value===4 ? searchValue.value:null,
      tel: selectedFilterBy.value===5 ? searchValue.value:null,
      whatsappNumber: selectedFilterBy.value===6 ? searchValue.value:null,

      searchByKeyword: false,
      skip: skip,
      limit: limit,
    };

    try {
      const res = await getContacts(payload);
      setCustomers(res.data.results[0] || []);
      setTotalRecords(res.data.outputValues.totalRows || 0);
      setSelectedRowIndex(-1);
    } catch (err) {
      showToast("error", "Error", "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  // Load when modal opens
  useEffect(() => {
    if (showCustomerList) {
      setSearchValue({ value: "" });
      setCurrentPage(0);
      setSelectedRowIndex(-1);
      loadCustomers();
    }
  }, [showCustomerList]);

  // Manual search trigger
  const handleSearch = () => {
    setCurrentPage(0);
    loadCustomers();
  };

  // Pagination & filters
  useEffect(() => {
    if (showCustomerList) {
      loadCustomers();
    }
  }, [currentPage, rowsPerPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!showCustomerList || isLoading || customers.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedRowIndex(prev => (prev < customers.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedRowIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && selectedRowIndex >= 0) {
        e.preventDefault();
        onCustomerSelectHandler(customers[selectedRowIndex]);
        setShowCustomerList(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showCustomerList, customers, selectedRowIndex, isLoading]);

  // Auto-focus search input
  useEffect(() => {
    if (showCustomerList && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showCustomerList]);

  if (!showCustomerList) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && setShowCustomerList(false)}
    >
      {/* Blur Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-50 text-gray-600">
          <h2 className="text-xl font-bold">Select Customer</h2>
          <button
            onClick={() => setShowCustomerList(false)}
          className="p-3 rounded-full hover:bg-slate-200 hover:text-red-500 transition-all duration-200"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By</label>
              <select
                value={selectedFilterBy.value}
                onChange={(e) => setSelectedFilterBy({ value: +e.target.value })}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 transition"
              >
                {filterByOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.displayName}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Value</label>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue.value || ""}
                  onChange={(e) => setSearchValue({ value: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter search term..."
                  className="w-full px-6 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-10 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 active:scale-95 transition shadow-md"
              >
                Search
              </button>
            </div>
          </div>

          {totalRecords>rowsPerPage &&    <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">{totalRecords} customers found</span>
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
          </div>}

        </div>

        {/* Customer Table */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b-2 border-gray-200">
              <tr>
                {["Code", "Name", "Email", "Mobile", "Modified", "Action"].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="inline-block animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-gray-500 text-lg">No customers found</td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr
                    key={c.contactId}
                    tabIndex={0}
                    className={`
                      hover:bg-sky-50 cursor-pointer transition-all duration-150 outline-none
                      ${selectedRowIndex === i ? 'bg-sky-100 ring-2 ring-sky-500 ring-inset' : ''}
                    `}
                    onClick={() => setSelectedRowIndex(i)}
                  >
                    <td className="px-6 py-4 font-medium">{c.contactCode}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{c.contactName}</td>
                    <td className="px-6 py-4 text-gray-600">{c.email || "-"}</td>
                    <td className="px-6 py-4">{c.mobile || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatUtcToLocal(c.modifiedDate_UTC)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCustomerSelectHandler(c);
                          setShowCustomerList(false);
                        }}
                        className="px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 active:scale-95 transition flex items-center gap-2 shadow-md"
                      >
                        <FaSignInAlt /> Select
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}