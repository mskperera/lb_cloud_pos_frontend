import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { getOrders } from "../../functions/order"; // Replace with your actual backend session/DayEnd fetching utility
import { formatCurrency, formatDate, formatUtcToLocal } from "../../utils/format";
import GhostButton from "../iconButtons/GhostButton";
import DaisyUIPaginator from "../../components/DaisyUIPaginator";
import ReusableTable from "../ReusableTable";
import DialogModel2 from "../model/DialogModel2";

import { FaTerminal, FaCalendarAlt, FaFileInvoice, FaSyncAlt, FaEye } from "react-icons/fa";
import { getSessionEndProcessedDetails } from "../../functions/session";
import { getTeminallByUserId } from "../../functions/dropdowns";
import ZReportIndex from "../../pages/z-report";
import { TimerIcon } from "lucide-react";

export default function DayendListAll() {
  const [sessions, setSessions] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal display states for the Z-Report overlay popup
  const [isZReportVisible, setIsZReportVisible] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const [assignedTerminals, setAssignedTerminals] = useState([]);
  const userinfo = JSON.parse(localStorage.getItem("user"));
  const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
const [isLoading,setIsLoading]=useState(false);



  useEffect(() => {
    const loadTerminals = async () => {
      try {
      setIsLoading(true);
        const terminals = await getTeminallByUserId(userinfo?.userId,selectedStore.storeId);
        if (terminals?.data) {
          setAssignedTerminals(terminals.data);
          localStorage.setItem("assignedTerminals", JSON.stringify(terminals.data));
        }
           setIsLoading(false);
      } catch (err) {
         setIsLoading(false);
        console.error("Failed to load terminals:", err);
      }
    };
    if (userinfo?.userId) loadTerminals();
  }, [userinfo?.userId]);




  const [selectedTerminalId, setSelectedTerminalId] = useState(
   assignedTerminals?.[0]?.id);
  
  const [searchFromDate, setSearchFromDate] = useState(moment().subtract(7, 'days').format("YYYY-MM-DD"));
  const [searchToDate, setSearchToDate] = useState(moment().format("YYYY-MM-DD"));

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
  };





  const loadDayendDetails = useCallback(async (resetSkipAndLimit = false) => {
    try {
      setIsTableDataLoading(true);
      const skip = resetSkipAndLimit ? 0 : currentPage * rowsPerPage;
      const limit = rowsPerPage;

      const filterPayload = {
        terminalId: 29,
      //  fromDate: searchFromDate ? moment(searchFromDate).startOf('day').toISOString() : null,
       // toDate: searchToDate ? moment(searchToDate).endOf('day').toISOString() : null,
        skip,
        limit,
      };

      const res = await getSessionEndProcessedDetails(filterPayload);
        console.log("Dayend Details: ", res.data);
    setSessions(res.data.results[0]);
    
   setTotalRecords(res.data.outputValues.totalRows);


      console.log("Fetching Dayend summaries with parameters: ", filterPayload);
      


   
    } catch (err) {
      console.error("Error loading dayend session summaries:", err);
      setSessions([]);
    } finally {
      setIsTableDataLoading(false);
    }
  }, [currentPage, rowsPerPage, selectedTerminalId, searchFromDate, searchToDate]);

  useEffect(() => {
    loadDayendDetails(false);
  }, [loadDayendDetails]);

  // Triggers popup overlay with targeted shift sequence parameters
  const handleOpenZReportPopup = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsZReportVisible(true);
  };

  const actionButtons = (row) => (
    <div className="flex space-x-2 justify-end">
      <GhostButton
        onClick={() => handleOpenZReportPopup(row.sessionId)}
        iconClass="pi pi-eye"
        color="text-sky-600"
        hoverClass="hover:text-sky-800 hover:bg-sky-50"
        aria-label="View Z-Report Popup"
        tooltip="View Z-Report"
      />
    </div>
  );

  const sessionColumns = [
    { key: "sessionId", label: "Session ID", align: "left", render: (row) => <span className="font-mono text-xs font-semibold text-gray-700">{row.sessionId}</span> },
    { key: "sessionName", label: "Session Name", align: "left" },
    { key: "startTime", label: "Date Range", align: "left", render: (row) => `${formatDate(row.startTime,true)} - ${formatDate(row.endTime,true)}` },

    { key: "netSales", label: "Net Sales", align: "right", render: (row) => formatCurrency(row.netSales, false) },
   { 
      key: "diff", 
      label: "Difference", 
      align: "right", 
      render: (row) => {
        const diff = row.difference;
        if (diff === 0) {
          return <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-md">Matched</span>;
        }
        return (
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${diff < 0 ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"}`}>
           {`${formatCurrency(diff, false)}`}
          </span>
        );
      }
    },
    { key: "actions", label: "Z-Report", align: "right", render: (row) => actionButtons(row) },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-fit mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Full Page Header Configuration */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <TimerIcon className="text-gray-400" /> Dayend History
          </h1>
          {/* <p className="text-xs text-gray-500 mt-1">Review finalized registers, system sales totals, variance records, and chronological Z-reports.</p> */}
        </div>

        {/* Top Control Filter Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-4 px-6 py-5 bg-gray-50/70 border-b border-gray-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              POS Terminal
            </label>
            <select
              value={selectedTerminalId}
              onChange={(e) => {
                setSelectedTerminalId(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2.5 bg-white text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium text-gray-800 shadow-sm"
            >
              {assignedTerminals.map(t => (
                <option key={t.id} value={t.terminalId}>{t.displayName}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              <FaCalendarAlt size={12} /> Start Date Range
            </label>
            <input
              type="date"
              value={searchFromDate}
              onChange={(e) => setSearchFromDate(e.target.value)}
              className="w-full px-3 py-2 bg-white text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 font-medium text-gray-800 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
              <FaCalendarAlt size={12} /> End Date Range
            </label>
            <input
              type="date"
              value={searchToDate}
              onChange={(e) => setSearchToDate(e.target.value)}
              className="w-full px-3 py-2 bg-white text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-500 font-medium text-gray-800 shadow-sm"
            />
          </div>

          <div>
            <button
              onClick={() => loadDayendDetails(true)}
              className="w-full px-5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <FaSyncAlt size={12} /> Fetch Records
            </button>
          </div>
        </div>

      
          <ReusableTable
            columns={sessionColumns}
            data={sessions}
            loading={isTableDataLoading}
            emptyMessage="No historical dayend sessions found for the specified configurations."
          />
      

        {/* Table Footer / Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-medium text-gray-500">
              {totalRecords} Item{totalRecords !== 1 ? "s" : ""} found
            </div>
            <DaisyUIPaginator
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
              rowsPerPageOptions={[10, 20, 30, 50]}
            />
          </div>
        </div>
      </div>

      {/* Z-Report Modal Overlay Popup */}
      {isZReportVisible && (
        <DialogModel2 
          onHide={() => setIsZReportVisible(false)} 
          title={`Z-Report Summary [Session: ${selectedSessionId}]`}   
          isVisible={isZReportVisible}
        >
          <div className="p-6 bg-white overflow-y-auto max-h-[80vh]">
          
<ZReportIndex sessionId={selectedSessionId} setIsZReportVisible={setIsZReportVisible} reload={()=>{
  Math.random();
}} />

          </div>
        </DialogModel2>
      )}
    </div>
  );
}