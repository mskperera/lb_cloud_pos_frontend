import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCustomer, getContacts } from "../../functions/contacts";
import { formatUtcToLocal } from "../../utils/format";
import { useToast } from "../useToast";
import ConfirmDialog from "../dialog/ConfirmDialog";
import ReusableTable from "../ReusableTable";
import { FaPlus, FaEdit, FaTrash, FaSignInAlt } from "react-icons/fa";
import { Users } from "lucide-react";
import { CONTACT_TYPE, SAVE_TYPE } from "../../utils/constants";
import AddCustomer from "./AddCustomerComp_2";

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

  const searchInputRef = useRef(null);

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

  const [modalState, setModalState] = useState({
    isOpen: false,
    saveType: SAVE_TYPE.ADD,
    contactId: 0,
  });

  const handleOpenAdd = () => {
    setModalState({
      isOpen: true,
      saveType: SAVE_TYPE.ADD,
      contactId: 0,
    });
  };

  const handleOpenEdit = (id) => {
    setModalState({
      isOpen: true,
      saveType: SAVE_TYPE.UPDATE,
      contactId: id,
    });
  };

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  /**
   * Called when a customer is added or updated over the course of the popup lifecycle.
   */
  const handleSaved = async ({ id, payload, result }) => {
    try {
      if (modalState.saveType === SAVE_TYPE.ADD) {
        // Option A: If API returns the created record ID/object, fetch or insert it into top of table
        const newContactId = result?.outputValues?.contactId || id;
        if (newContactId) {
          const res = await getContacts({ contactId: newContactId });
          const newCustomer = res?.data?.results?.[0]?.[0];
          if (newCustomer) {
            setCustomers((prev) => [newCustomer, ...prev]);
            setTotalRecords((prev) => prev + 1);
            return;
          }
        }
        // Fallback: Reload full list if new ID details aren't returned
        loadCustomers();
      } else if (modalState.saveType === SAVE_TYPE.UPDATE) {
        // Fetch refreshed single contact record from backend
        const res = await getContacts({ contactId: id });
        const updatedCustomer = res?.data?.results?.[0]?.[0];

        if (updatedCustomer) {
          setCustomers((prev) =>
            prev.map((c) => (c.contactId === id ? { ...c, ...updatedCustomer } : c))
          );
        } else {
          // Local fallback patch over the course of updating state
          setCustomers((prev) =>
            prev.map((c) =>
              c.contactId === id
                ? {
                    ...c,
                    contactName: payload.contactName,
                    email: payload.email,
                    mobile: payload.mobile,
                    tel: payload.tel,
                    remark: payload.remark,
                    contactTypeId: payload.contactTypeId,
                  }
                : c
            )
          );
        }
      }
    } catch (err) {
      console.error("Error updating customer list over the course of save:", err);
      loadCustomers(); // Fallback to full load
    }
  };

  const loadCustomers = async () => {
    setIsLoading(true);
    const skip = currentPage * rowsPerPage;
    const limit = rowsPerPage;

    const payload = {
      contactTypeIds:
        selectedContactType === null
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

  const handleDeletePrompt = (contactId) => {
    setDeletingId(contactId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteCustomer(deletingId, true);
      if (res.data.error) {
        showToast("danger", "Failed", res.data.error.message);
      } else {
        setCustomers((prev) => prev.filter((c) => c.contactId !== deletingId));
        setTotalRecords((prev) => prev - 1);
        showToast("success", "Successful", res.data.outputValues.outputMessage);
      }
    } catch (err) {
      showToast("danger", "Error", "Delete failed");
    } finally {
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeletingId(null);
  };

  const onPageChange = ({ page, rows }) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
  };

  const customerColumns = [
    {
      header: "Type",
      key: "contactTypeName",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 shadow-2xs">
          {item.contactTypeName}
        </span>
      ),
    },
    {
      header: "Customer Code",
      key: "contactCode",
      headerClass: "text-left",
      cellClass: "text-left font-mono text-slate-700",
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
          {item.contactCode || "-"}
        </span>
      ),
    },
    {
      header: "Name",
      key: "contactName",
      headerClass: "text-left",
      cellClass: "text-left font-semibold text-gray-900 text-sm",
      render: (item) => (
        <span className="text-sm font-semibold text-gray-900">{item.contactName}</span>
      ),
    },
    {
      header: "Email",
      key: "email",
      headerClass: "text-left",
      cellClass: "text-left text-slate-600 font-mono text-xs",
      render: (item) => (
        <span className="text-xs font-mono text-slate-600">{item.email || "-"}</span>
      ),
    },
    {
      header: "Mobile",
      key: "mobile",
      headerClass: "text-left",
      cellClass: "text-left font-mono text-xs text-slate-700",
      render: (item) => (
        <span className="text-xs font-mono text-slate-700">{item.mobile || "-"}</span>
      ),
    },
    {
      header: "Tel",
      key: "tel",
      headerClass: "text-left",
      cellClass: "text-left font-mono text-xs text-slate-700",
      render: (item) => (
        <span className="text-xs font-mono text-slate-700">{item.tel || "-"}</span>
      ),
    },
    {
      header: "Modified",
      key: "modifiedDate_UTC",
      headerClass: "text-left",
      cellClass: "text-left",
      render: (item) => (
        <span className="inline-block bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-200">
          {item.modifiedDate_UTC ? formatUtcToLocal(item.modifiedDate_UTC) : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      headerClass: "text-center w-28",
      cellClass: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1">
          {selectingMode && (
            <button
              onClick={() => onselect(item)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-200/60 transition"
              title="Select Customer"
            >
              <FaSignInAlt className="w-4 h-4 text-sky-600" />
            </button>
          )}
          <button
            onClick={() => handleOpenEdit(item.contactId)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-200/60 transition"
            title="Edit Customer"
          >
            <FaEdit className="w-4 h-4 text-amber-600" />
          </button>
          <button
            onClick={() => handleDeletePrompt(item.contactId)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-200/60 transition"
            title="Delete Customer"
          >
            <FaTrash className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-10 py-4">
      {/* Confirm Delete Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          isVisible={true}
          message="Are you sure you want to delete this customer? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Confirm Delete"
          severity="danger"
        />
      )}

      {/* Header Section */}
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 text-gray-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-600 tracking-tight">Customer List</h2>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex text-sm items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:bg-emerald-700 transition ml-auto"
        >
          <FaPlus className="w-4 h-4" />
          <span>Create New Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 my-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 min-w-[220px]">
            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Contact Type:
            </label>
            <select
              value={selectedContactType ?? ""}
              onChange={(e) =>
                setSelectedContactType(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            >
              {contactTypeOptions.map((opt) => (
                <option key={opt.id ?? "all"} value={opt.id ?? ""}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 min-w-[220px]">
            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Filter By:
            </label>
            <select
              value={selectedFilterBy}
              onChange={(e) => setSelectedFilterBy(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            >
              {filterOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Search:
            </label>
            <input
              type="text"
              ref={searchInputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-3 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              placeholder="Type to search..."
            />
            <button
              type="button"
              onClick={loadCustomers}
              className="px-4 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none transition whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Data Table */}
      <ReusableTable
        data={customers}
        isLoading={isLoading}
        columns={customerColumns}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 30, 50, 100]}
        paginationPosition="top"
      />

      <AddCustomer
        isOpen={modalState.isOpen}
        saveType={modalState.saveType}
        id={modalState.contactId}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </div>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { deleteCustomer, getContacts } from "../../functions/contacts";
// import { formatUtcToLocal } from "../../utils/format";
// import { useToast } from "../useToast";
// import ConfirmDialog from "../dialog/ConfirmDialog";
// import ReusableTable from "../ReusableTable";
// import { FaPlus, FaEdit, FaTrash, FaSignInAlt } from "react-icons/fa";
// import { Users } from "lucide-react";
// import { CONTACT_TYPE, SAVE_TYPE } from "../../utils/constants";
// import AddCustomer from "./AddCustomerComp_2";

// export default function CustomerList({ selectingMode = false, onselect }) {
//   const [customers, setCustomers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const showToast = useToast();

//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(30);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [selectedFilterBy, setSelectedFilterBy] = useState(2); // Default: Name
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedContactType, setSelectedContactType] = useState(null); // null = All

//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const searchInputRef = useRef(null);

//   const contactTypeOptions = [
//     { id: null, name: "All Contacts" },
//     { id: CONTACT_TYPE.CUSTOMER, name: "Customer" },
//     { id: CONTACT_TYPE.CUSTOMER_SUPPLIER, name: "Customer / Supplier" },
//     { id: CONTACT_TYPE.SUPPLIER, name: "Supplier" },
//   ];

//   const filterOptions = [
//     { id: 1, name: "Customer Code" },
//     { id: 2, name: "Customer Name" },
//     { id: 3, name: "Email" },
//     { id: 4, name: "Mobile" },
//     { id: 5, name: "Tel" },
//     { id: 6, name: "Whatsapp" },
//   ];


// const [modalState, setModalState] = useState({
//     isOpen: false,
//     saveType: SAVE_TYPE.ADD,
//     contactId: 0,
//   });

//   const handleOpenAdd = () => {
//     setModalState({
//       isOpen: true,
//       saveType: SAVE_TYPE.ADD,
//       contactId: 0,
//     });
//   };

//   const handleOpenEdit = (id) => {
//     setModalState({
//       isOpen: true,
//       saveType: SAVE_TYPE.UPDATE,
//       contactId: id,
//     });
//   };

//   const handleClose = () => {
//     setModalState((prev) => ({ ...prev, isOpen: false }));
//   };

//   const handleSaved = () => {
//     // Refresh your list data here over the course of updating state
//   };


//   const loadCustomers = async () => {
//     setIsLoading(true);
//     const skip = currentPage * rowsPerPage;
//     const limit = rowsPerPage;

//     const payload = {
//       contactTypeIds:
//         selectedContactType === null
//           ? [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.SUPPLIER, CONTACT_TYPE.CUSTOMER_SUPPLIER]
//           : [selectedContactType],
//       contactCode: selectedFilterBy === 1 ? searchValue : null,
//       contactName: selectedFilterBy === 2 ? searchValue : null,
//       email: selectedFilterBy === 3 ? searchValue : null,
//       mobile: selectedFilterBy === 4 ? searchValue : null,
//       tel: selectedFilterBy === 5 ? searchValue : null,
//       whatsappNumber: selectedFilterBy === 6 ? searchValue : null,
//       skip,
//       limit,
//     };

//     try {
//       const res = await getContacts(payload);
//       setCustomers(res.data.results[0] || []);
//       setTotalRecords(res.data.outputValues.totalRows || 0);
//     } catch (err) {
//       showToast("error", "Error", "Failed to load customers");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentPage(0);
//       loadCustomers();
//     }, 600);
//     return () => clearTimeout(timer);
//   }, [searchValue, selectedFilterBy, selectedContactType]);

//   useEffect(() => {
//     loadCustomers();
//   }, [currentPage, rowsPerPage]);

//   const handleDeletePrompt = (contactId) => {
//     setDeletingId(contactId);
//     setShowDeleteDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       const res = await deleteCustomer(deletingId, true);
//       if (res.data.error) {
//         showToast("danger", "Failed", res.data.error.message);
//       } else {
//         setCustomers((prev) => prev.filter((c) => c.contactId !== deletingId));
//         setTotalRecords((prev) => prev - 1);
//         showToast("success", "Successful", res.data.outputValues.outputMessage);
//       }
//     } catch (err) {
//       showToast("danger", "Error", "Delete failed");
//     } finally {
//       setShowDeleteDialog(false);
//       setDeletingId(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setShowDeleteDialog(false);
//     setDeletingId(null);
//   };

//   const onPageChange = ({ page, rows }) => {
//     setCurrentPage(page);
//     setRowsPerPage(rows);
//   };

//   // Table columns structured to match ProductInventoryList.jsx design
//   const customerColumns = [
//     {
//       header: "Type",
//       key: "contactTypeName",
//       headerClass: "text-left",
//       cellClass: "text-left",
//       render: (item) => (
//         <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 shadow-2xs">
//           {item.contactTypeName}
//         </span>
//       ),
//     },
//     {
//       header: "Customer Code",
//       key: "contactCode",
//       headerClass: "text-left",
//       cellClass: "text-left font-mono text-slate-700",
//       render: (item) => (
//         <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
//           {item.contactCode || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Name",
//       key: "contactName",
//       headerClass: "text-left",
//       cellClass: "text-left font-semibold text-gray-900 text-sm",
//       render: (item) => (
//         <span className="text-sm font-semibold text-gray-900">{item.contactName}</span>
//       ),
//     },
//     {
//       header: "Email",
//       key: "email",
//       headerClass: "text-left",
//       cellClass: "text-left text-slate-600 font-mono text-xs",
//       render: (item) => (
//         <span className="text-xs font-mono text-slate-600">{item.email || "-"}</span>
//       ),
//     },
//     {
//       header: "Mobile",
//       key: "mobile",
//       headerClass: "text-left",
//       cellClass: "text-left font-mono text-xs text-slate-700",
//       render: (item) => (
//         <span className="text-xs font-mono text-slate-700">{item.mobile || "-"}</span>
//       ),
//     },
//     {
//       header: "Tel",
//       key: "tel",
//       headerClass: "text-left",
//       cellClass: "text-left font-mono text-xs text-slate-700",
//       render: (item) => (
//         <span className="text-xs font-mono text-slate-700">{item.tel || "-"}</span>
//       ),
//     },
//     {
//       header: "Modified",
//       key: "modifiedDate_UTC",
//       headerClass: "text-left",
//       cellClass: "text-left",
//       render: (item) => (
//         <span className="inline-block bg-sky-50 text-sky-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-sky-200">
//           {item.modifiedDate_UTC ? formatUtcToLocal(item.modifiedDate_UTC) : "N/A"}
//         </span>
//       ),
//     },
//     {
//       header: "Actions",
//       key: "actions",
//       headerClass: "text-center w-28",
//       cellClass: "text-center",
//       render: (item) => (
//         <div className="flex items-center justify-center gap-1">
//           {selectingMode && (
//             <button
//               onClick={() => onselect(item)}
//               className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-200/60 transition"
//               title="Select Customer"
//             >
//               <FaSignInAlt className="w-4 h-4 text-sky-600" />
//             </button>
//           )}
//           <button
//             //onClick={() => navigate(`/customers/edit?id=${item.contactId}`)}
//             onClick={() => handleOpenEdit(item.contactId)}
//             className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-200/60 transition"
//             title="Edit Customer"
//           >
//             <FaEdit className="w-4 h-4 text-amber-600" />
//           </button>
//           <button
//             onClick={() => handleDeletePrompt(item.contactId)}
//             className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-200/60 transition"
//             title="Delete Customer"
//           >
//             <FaTrash className="w-4 h-4 text-rose-600" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="px-10 py-4">
//       {/* Confirm Delete Dialog */}
//       {showDeleteDialog && (
//         <ConfirmDialog
//           isVisible={true}
//           message="Are you sure you want to delete this customer? This action cannot be undone."
//           onConfirm={handleConfirmDelete}
//           onCancel={handleCancelDelete}
//           title="Confirm Delete"
//           severity="danger"
//         />
//       )}

//       {/* Header Section */}
//       <div className="px-6 flex items-center justify-between">
//         <div className="flex items-center gap-2.5">
//           <div className="p-2 text-gray-600 flex items-center justify-center">
//             <Users className="w-7 h-7" />
//           </div>
//           <h2 className="text-xl font-bold text-gray-600 tracking-tight">Customer List</h2>
//         </div>

//         <button
//         onClick={handleOpenAdd}
//          // onClick={() => navigate(`/customers/add?saveType=${SAVE_TYPE.ADD}&id=0`)}
//           className="flex text-sm items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:bg-emerald-700 transition ml-auto"
//         >
//           <FaPlus className="w-4 h-4" />
//           <span>Create New Customer</span>
//         </button>
//       </div>

//       {/* Filter and Search Bar */}
//       <div className="bg-white rounded-xl border border-slate-200 p-4 my-4 shadow-sm">
//         <div className="flex flex-wrap items-center gap-4">
//           {/* Contact Type Filter */}
//           <div className="flex items-center gap-2 min-w-[220px]">
//             <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
//               Contact Type:
//             </label>
//             <select
//               value={selectedContactType ?? ""}
//               onChange={(e) =>
//                 setSelectedContactType(e.target.value ? Number(e.target.value) : null)
//               }
//               className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
//             >
//               {contactTypeOptions.map((opt) => (
//                 <option key={opt.id ?? "all"} value={opt.id ?? ""}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Filter By Field */}
//           <div className="flex items-center gap-2 min-w-[220px]">
//             <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
//               Filter By:
//             </label>
//             <select
//               value={selectedFilterBy}
//               onChange={(e) => setSelectedFilterBy(Number(e.target.value))}
//               className="w-full px-2.5 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
//             >
//               {filterOptions.map((opt) => (
//                 <option key={opt.id} value={opt.id}>
//                   {opt.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Search Input */}
//           <div className="flex items-center gap-2 flex-1 min-w-[280px]">
//             <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
//               Search:
//             </label>
//             <input
//               type="text"
//               ref={searchInputRef}
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               className="w-full px-3 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
//               placeholder="Type to search..."
//             />
//             <button
//               type="button"
//               onClick={loadCustomers}
//               className="px-4 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none transition whitespace-nowrap"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reusable Data Table */}
//       <ReusableTable
//         data={customers}
//         isLoading={isLoading}
//         columns={customerColumns}
//         currentPage={currentPage}
//         rowsPerPage={rowsPerPage}
//         totalRecords={totalRecords}
//         onPageChange={onPageChange}
//         rowsPerPageOptions={[10, 30, 50, 100]}
//         paginationPosition="top"
//       />


// <AddCustomer
//         isOpen={modalState.isOpen}
//         saveType={modalState.saveType}
//         id={modalState.contactId}
//         onClose={handleClose}
//         onSaved={handleSaved}
//       />

//     </div>
//   );
// }






// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { deleteCustomer, getContacts } from "../../functions/contacts";
// import { formatUtcToLocal } from '../../utils/format';
// import { useToast } from '../useToast';
// import DaisyUIPaginator from '../DaisyUIPaginator';
// import { FaTimes, FaUserPlus, FaSignInAlt, FaEdit, FaTrash } from 'react-icons/fa';
// import { CONTACT_TYPE, SAVE_TYPE } from '../../utils/constants';

// export default function CustomerList({ selectingMode = false, onselect }) {
//   const [customers, setCustomers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const showToast = useToast();

//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(30);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [selectedFilterBy, setSelectedFilterBy] = useState(2); // Default: Name
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedContactType, setSelectedContactType] = useState(null); // null = All

//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const contactTypeOptions = [
//     { id: null, name: "All Contacts" },
//     { id: CONTACT_TYPE.CUSTOMER, name: "Customer" },
//     { id: CONTACT_TYPE.CUSTOMER_SUPPLIER, name: "Customer / Supplier" },
//     { id: CONTACT_TYPE.SUPPLIER, name: "Supplier" },
//   ];

//   const filterOptions = [
//     { id: 1, name: "Customer Code" },
//     { id: 2, name: "Customer Name" },
//     { id: 3, name: "Email" },
//     { id: 4, name: "Mobile" },
//     { id: 5, name: "Tel" },
//     { id: 6, name: "Whatsapp" },
//   ];

//   const loadCustomers = async () => {
//     setIsLoading(true);
//     const skip = currentPage * rowsPerPage;
//     const limit = rowsPerPage;

//     const payload = {
//       contactTypeIds: selectedContactType === null
//         ? [CONTACT_TYPE.CUSTOMER, CONTACT_TYPE.SUPPLIER, CONTACT_TYPE.CUSTOMER_SUPPLIER]
//         : [selectedContactType],
//       contactCode: selectedFilterBy === 1 ? searchValue : null,
//       contactName: selectedFilterBy === 2 ? searchValue : null,
//       email: selectedFilterBy === 3 ? searchValue : null,
//       mobile: selectedFilterBy === 4 ? searchValue : null,
//       tel: selectedFilterBy === 5 ? searchValue : null,
//       whatsappNumber: selectedFilterBy === 6 ? searchValue : null,
//       skip,
//       limit,
//     };

//     try {
//       const res = await getContacts(payload);
//       setCustomers(res.data.results[0] || []);
//       setTotalRecords(res.data.outputValues.totalRows || 0);
//     } catch (err) {
//       showToast("error", "Error", "Failed to load customers");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentPage(0);
//       loadCustomers();
//     }, 600);
//     return () => clearTimeout(timer);
//   }, [searchValue, selectedFilterBy, selectedContactType]);

//   useEffect(() => {
//     loadCustomers();
//   }, [currentPage, rowsPerPage]);

//   const handleDelete = async () => {
//     try {
//       const res = await deleteCustomer(deletingId, true);
//       if (res.data.error) {
//         showToast("error", "Failed", res.data.error.message);
//       } else {
//         setCustomers(prev => prev.filter(c => c.contactId !== deletingId));
//         setTotalRecords(prev => prev - 1);
//         showToast("success", "Deleted", res.data.outputValues.outputMessage);
//       }
//     } catch (err) {
//       showToast("error", "Error", "Delete failed");
//     } finally {
//       setShowDeleteDialog(false);
//       setDeletingId(null);
//     }
//   };

//   return (
//     <>
//       {/* Delete Confirmation Modal */}
//       {showDeleteDialog && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowDeleteDialog(false)}>
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
//           <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
//             <div className="text-center space-y-6">
//               <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
//                 <FaTrash className="text-4xl text-red-600" />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">Delete Customer?</h3>
//                 <p className="text-gray-600 mt-2">This action cannot be undone.</p>
//               </div>
//               <div className="flex gap-4 justify-center">
//                 <button onClick={() => setShowDeleteDialog(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition">
//                   Cancel
//                 </button>
//                 <button onClick={handleDelete} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition">
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
//           <button
//             onClick={() => navigate(`/customers/add?saveType=${SAVE_TYPE.ADD}&id=0`)}
//             className="flex items-center gap-3 px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
//           >
//             <FaUserPlus className="text-xl" />
//             New Customer
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
//           <div className="grid md:grid-cols-6 gap-6">
//             <div className=''>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Type</label>
//               <select
//                 value={selectedContactType ?? ""}
//                 onChange={(e) => setSelectedContactType(e.target.value ? +e.target.value : null)}
//                 className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
//               >
//                 {contactTypeOptions.map(opt => (
//                   <option key={opt.id} value={opt.id ?? ""}>{opt.name}</option>
//                 ))}
//               </select>
//             </div>

//               <div className=''>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By</label>
//               <select
//                 value={selectedFilterBy}
//                 onChange={(e) => setSelectedFilterBy(+e.target.value)}
//                 className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500"
//               >
//                 {filterOptions.map(opt => (
//                   <option key={opt.id} value={opt.id}>{opt.name}</option>
//                 ))}
//               </select>
//             </div>

//                <div className='col-span-4'>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
//               <input
//                 type="text"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 placeholder="Type to search..."
//                 className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 text-lg"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
//                 <tr>
//                   {["Type", "Customer Id", "Name", "Email", "Mobile", "Tel", "Modified", "Actions"].map(h => (
//                     <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={8} className="text-center py-20">
//                       <div className="inline-block animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
//                     </td>
//                   </tr>
//                 ) : customers.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="text-center py-20 text-gray-500 text-lg">No customers found</td>
//                   </tr>
//                 ) : (
//                   customers.map((c) => (
//                     <tr key={c.contactId} className="hover:bg-sky-50 transition">
//                       <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.contactTypeName}</td>
//                       <td className="px-6 py-4 font-medium">{c.contactCode}</td>
//                       <td className="px-6 py-4 font-semibold text-gray-900">{c.contactName}</td>
//                       <td className="px-6 py-4 text-gray-600">{c.email || "-"}</td>
//                       <td className="px-6 py-4">{c.mobile || "-"}</td>
//                       <td className="px-6 py-4">{c.tel || "-"}</td>
//                       <td className="px-6 py-4 text-sm text-gray-500">{formatUtcToLocal(c.modifiedDate_UTC)}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           {selectingMode && (
//                             <button
//                               onClick={() => onselect(c)}
//                               className="p-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 active:scale-95 transition"
//                               title="Select Customer"
//                             >
//                               <FaSignInAlt />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => navigate(`/customers/edit?id=${c.contactId}`)}
//                             className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 active:scale-95 transition"
//                             title="Edit"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setDeletingId(c.contactId);
//                               setShowDeleteDialog(true);
//                             }}
//                             className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-95 transition"
//                             title="Delete"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}
//           <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
//             <span className="text-sm text-gray-600 font-medium">{totalRecords} customers</span>
//             <DaisyUIPaginator
//               currentPage={currentPage}
//               rowsPerPage={rowsPerPage}
//               totalRecords={totalRecords}
//               onPageChange={({ page, rows }) => {
//                 setCurrentPage(page);
//                 setRowsPerPage(rows);
//               }}
//               rowsPerPageOptions={[10, 30, 50, 100]}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }