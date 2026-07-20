import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash, FaArrowDown, FaArrowUp, FaCalculator } from "react-icons/fa";
import { useToast } from "../useToast";
import FormElementMessage from "../messges/FormElementMessage";
import { validate } from "../../utils/formValidation";
import DaisyUIPaginator from "../DaisyUIPaginator";
import { formatCurrency, formatUtcToLocal } from "../../utils/format";
import DialogModel2 from "../model/DialogModel2";

// Import the correct API functions directly from your paidInOut.js file
import { 
  getPaidInOutLogs, 
  addPaidInOutLog, 
  updatePaidInOutLog, 
  deletePaidInOutLog 
} from "../../functions/paidInOut";

const TRANSACTION_TYPES = {
  PAID_IN: "PAID_IN",
  PAID_OUT: "PAID_OUT",
};

export default function PaidInOutActivity({ isVisible, setIsVisible }) {
  const showToast = useToast();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Pagination & Filtering state
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterType, setFilterType] = useState("ALL"); // ALL, PAID_IN, PAID_OUT
  const [searchValue, setSearchValue] = useState("");


  const sessionDetails=JSON.parse(localStorage.getItem("sessionDetails"));
  // Form Field States
  const [actionType, setActionType] = useState(TRANSACTION_TYPES.PAID_IN);
  
  const [amount, setAmount] = useState({
    label: "Amount",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "numeric" },
  });

  const [description, setDescription] = useState({
    label: "Description / Reason",
    value: "",
    isTouched: false,
    isValid: false,
    rules: { required: true, dataType: "string" },
  });

  // Modal State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Calculate Summary Totals for the current view safely handling both key mappings
  const totalPaidIn = activities.reduce((sum, item) => {
    const isPaidIn = item.type === TRANSACTION_TYPES.PAID_IN || item.transactionType === TRANSACTION_TYPES.PAID_IN;
    return isPaidIn ? sum + parseFloat(item.amount || 0) : sum;
  }, 0);

  const totalPaidOut = activities.reduce((sum, item) => {
    const isPaidOut = item.type === TRANSACTION_TYPES.PAID_OUT || item.transactionType === TRANSACTION_TYPES.PAID_OUT;
    return isPaidOut ? sum + parseFloat(item.amount || 0) : sum;
  }, 0);

  const handleInputChange = (setState, state, value) => {
    const validation = validate(value, state);
    setState({
      ...state,
      value,
      isValid: validation.isValid,
      isTouched: true,
      validationMessages: validation.messages,
    });
  };

  const renderValidation = (state) => {
    return (
      !state.isValid &&
      state.isTouched && (
        <div className="mt-1 space-y-1">
          {state.validationMessages.map((message, index) => (
            <FormElementMessage
              key={index}
              className="text-red-500 text-sm"
              severity="error"
              text={message}
            />
          ))}
        </div>
      )
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setActionType(TRANSACTION_TYPES.PAID_IN);
    setAmount({ label: "Amount", value: "", isTouched: false, isValid: false, rules: { required: true, dataType: "numeric" } });
    setDescription({ label: "Description / Reason", value: "", isTouched: false, isValid: false, rules: { required: true, dataType: "string" } });
  };

  // Integrated Fetch Architecture matching standard pagination rules
  const loadActivities = useCallback(async () => {
    if (!isVisible) return;
    setIsLoading(true);
    
    const requestPayload = {
        sessionId:sessionDetails.sessionId,
      skip: currentPage * rowsPerPage,
      limit: rowsPerPage,
      filterType: filterType,
      search: searchValue
    };

    // Corrected to use getPaidInOutLogs
    const response = await getPaidInOutLogs(requestPayload);
    console.log('response', response);
    if (response && response.status === 200) {
      setActivities(response.data.results[0] || []);
      setTotalRecords(response.data.outputValues.totalRows || 0);
    } else {
      showToast("error", "Error", response?.data?.message || "Failed to load drawer history");
    }
    setIsLoading(false);
  }, [currentPage, rowsPerPage, filterType, searchValue, isVisible, showToast]);

  // Handle data reload on dependencies update
  useEffect(() => {
    const timer = setTimeout(() => {
      loadActivities();
    }, 600);
    return () => clearTimeout(timer);
  }, [loadActivities]);

  const handleEditSetup = (item) => {
    setEditingId(item.id);
    setActionType(item.transactionType || item.type);
    setAmount((p) => ({ ...p, value: item.amount, isValid: true, isTouched: true }));
    setDescription((p) => ({ ...p, value: item.description, isValid: true, isTouched: true }));
  };

  // Integrated Submit Payload processing
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!amount.isValid || !description.isValid) {
      showToast("warning", "Validation", "Please fill in all required fields accurately.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
        sessionId:sessionDetails.sessionId,
      transactionType: actionType,
      amount: parseFloat(amount.value),
      description: description.value,
      timestamp_UTC: new Date().toISOString(),
    };

    let response;
    if (editingId) {
      // Corrected to use updatePaidInOutLog
      response = await updatePaidInOutLog(editingId, payload);
    } else {
      // Corrected to use addPaidInOutLog
      response = await addPaidInOutLog(payload);
    }

    if (response && (response.status === 200 || response.status === 201)) {
      showToast("success", "Success", editingId ? "Entry updated successfully" : "Cash drawer activity logged");
      resetForm();
      loadActivities();
    } else {
      showToast("danger", "Exception", response?.data?.message || "Operation failed");
    }
    setIsSubmitting(false);
  };

  // Integrated Delete Action
  const handleDelete = async () => {
    if (!deletingId) return;
    
    // Corrected to use deletePaidInOutLog passing required id and isConfirm flag
    const response = await deletePaidInOutLog(deletingId, true);
    if (response && response.status === 200) {
      showToast("success", "Deleted", "Entry removed successfully");
      
      // Fallback page recalculation routine if the last item on current page is removed
      if (activities.length === 1 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else {
        loadActivities();
      }
    } else {
      showToast("error", "Error", response?.data?.message || "Delete failed");
    }
    setShowDeleteDialog(false);
    setDeletingId(null);
  };

  return (
    <>
      <DialogModel2 onHide={() => setIsVisible(false)} title="Paid In / Paid Out" isVisible={isVisible}>
        
        {/* Delete Confirmation Modal */}
        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteDialog(false)} />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="text-4xl text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Remove Ledger Entry?</h3>
                  <p className="text-gray-600 mt-2">This change will alter the current cash session balances.</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button type="button" onClick={() => setShowDeleteDialog(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition">Cancel</button>
                  <button type="button" onClick={handleDelete} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            
            {/* Search and Filter controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <input 
                type="text" 
                placeholder="Search description..." 
                className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <select 
                className="w-full sm:w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(0); }}
              >
                <option value="ALL">All Transactions</option>
                <option value="PAID_IN">Paid In</option>
                <option value="PAID_OUT">Paid Out</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Management Form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingId ? "Modify Transaction" : "New Cash Transaction"}
                </h2>
                
                {/* Mode Switcher Buttons */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setActionType(TRANSACTION_TYPES.PAID_IN)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      actionType === TRANSACTION_TYPES.PAID_IN
                        ? "bg-sky-600 text-white shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaArrowDown /> Paid In (Cash In)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType(TRANSACTION_TYPES.PAID_OUT)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      actionType === TRANSACTION_TYPES.PAID_OUT
                        ? "bg-rose-600 text-white shadow"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FaArrowUp /> Paid Out (Cash Out)
                  </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">{amount.label} *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={amount.value}
                        onChange={(e) => handleInputChange(setAmount, amount, e.target.value)}
                      />
                    </div>
                    {renderValidation(amount)}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">{description.label} *</label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Change delivery from safe, office supplies purchase..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={description.value}
                      onChange={(e) => handleInputChange(setDescription, description, e.target.value)}
                    />
                    {renderValidation(description)}
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-1/3 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-white font-semibold rounded-lg shadow-md transition ${
                        actionType === TRANSACTION_TYPES.PAID_IN 
                          ? "bg-sky-600 hover:bg-sky-700" 
                          : "bg-rose-600 hover:bg-rose-700"
                      } disabled:opacity-50`}
                    >
                      <FaPlus />
                      {isSubmitting ? "Processing..." : editingId ? "Update Item" : "Add Transaction"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Interactive Log List */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {["Type", "Reason Description", "Amount", "Timestamp", "Actions"].map((h) => (
                            <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="text-center py-12">
                              <div className="inline-block animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" />
                            </td>
                          </tr>
                        ) : activities.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-12 text-gray-500">No shift ledger movements reported during this timeframe.</td>
                          </tr>
                        ) : (
                          activities.map((item) => {
                            const isPaidIn = item.type === TRANSACTION_TYPES.PAID_IN || item.transactionType === TRANSACTION_TYPES.PAID_IN;
                            return (
                              <tr key={item.id} className="hover:bg-slate-50/80 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                    isPaidIn 
                                      ? "bg-sky-50 text-sky-700 border border-sky-200" 
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}>
                                    {isPaidIn ? <FaArrowDown /> : <FaArrowUp />}
                                    {isPaidIn ? "Paid In" : "Paid Out"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-800 max-w-xs truncate" title={item.description}>
                                  {item.description}
                                </td>
                                <td className={`px-6 py-4 text-sm font-bold whitespace-nowrap ${
                                  isPaidIn ? "text-sky-600" : "text-rose-600"
                                }`}>
                                  {isPaidIn ? "+" : "-"}{formatCurrency(item.amount, false)}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                                  {formatUtcToLocal(item.timestamp_UTC)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditSetup(item)}
                                      className="p-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:scale-95 transition"
                                      title="Edit Entry"
                                    >
                                      <FaEdit size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDeletingId(item.id);
                                        setShowDeleteDialog(true);
                                      }}
                                      className="p-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 active:scale-95 transition"
                                      title="Delete Entry"
                                    >
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>

                      {/* Summary Section / Table Footer */}
                      {!isLoading && activities.length > 0 && (
                        <tfoot className="bg-gray-100/70 border-t border-b border-gray-200 font-semibold text-gray-700">
                          <tr>
                            <td colSpan={2} className="px-6 py-3 text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                              <FaCalculator className="text-gray-400" /> Page Summary
                            </td>
                            <td colSpan={3} className="px-6 py-3 text-sm">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                                <div>
                                  <span className="text-xs text-gray-500 font-normal block">Total Paid In:</span>
                                  <span className="text-sky-600 font-bold">{formatCurrency(totalPaidIn, false)}</span>
                                </div>
                                <div className="sm:border-l sm:pl-6 border-gray-300">
                                  <span className="text-xs text-gray-500 font-normal block">Total Paid Out:</span>
                                  <span className="text-rose-600 font-bold">{formatCurrency(totalPaidOut, false)}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  {/* Footer Paginator integration */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-600 font-semibold">{totalRecords} entries tracked</span>
                    <DaisyUIPaginator
                      currentPage={currentPage}
                      rowsPerPage={rowsPerPage}
                      totalRecords={totalRecords}
                      onPageChange={({ page, rows }) => {
                        setCurrentPage(page);
                        setRowsPerPage(rows);
                      }}
                      rowsPerPageOptions={[10, 20, 50]}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </DialogModel2>
    </>
  );
}