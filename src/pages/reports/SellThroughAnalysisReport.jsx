import React, { useEffect, useState } from 'react';
import { FaPrint, FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { getSellThroughAnalysis } from '../../functions/report';
import { useToast } from '../../components/useToast';

const SellThroughAnalysisReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Default to current month
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const showToast = useToast();
  const storeId = JSON.parse(localStorage.getItem('selectedStore'))?.storeId;
  const systemInfo = JSON.parse(localStorage.getItem('systemInfo') || '{}');

  const fetchReport = async () => {
    if (!storeId) {
      showToast('danger', 'Error', 'No store selected');
      return;
    }

    setLoading(true);
    try {
      const year = moment(selectedMonth).year();
      const month = moment(selectedMonth).month() + 1; // moment months are 0-indexed

      const response = await getSellThroughAnalysis(storeId, year, month);

      if (response.data.error) {
        showToast('danger', 'Exception', response.data.error.message);
        return;
      }

      const data = response.data.results || [];
      setReportData(data);
      setShowReport(true);
    } catch (err) {
      console.error('Error loading sell-through report:', err);
      showToast('danger', 'Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(parseFloat(num || 0));
  };

  const monthLabel = moment(selectedMonth).format('MMMM YYYY');

  useEffect(() => {
    const date = new Date().toLocaleString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    document.documentElement.style.setProperty('--print-date', `"${date}"`);
  }, []);

  if (!showReport) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Sell-through / Turnover Analysis (Monthly)
        </h2>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Month
            </label>
            <DatePicker
              selected={selectedMonth}
              onChange={(date) => setSelectedMonth(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-sky-200"
            />
          </div>
        </div>

        <button
          onClick={fetchReport}
          disabled={loading}
          className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg shadow-lg flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Loading Report...
            </>
          ) : (
            'View Report'
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body, html {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          thead { display: table-header-group; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
            page-break-inside: auto;
          }
          tr { page-break-inside: avoid; page-break-after: auto; }
          th, td {
            padding: 8px 6px;
            border: 1px solid #ddd;
            white-space: nowrap;
          }
          thead tr,
          .grand-total-row {
            background-color: #718096 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          thead th,
          .grand-total-row td {
            color: white !important;
          }
          .print-date::before { content: "Printed on: " var(--print-date); }
        }
        @media screen {
          table { font-size: 12px; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div id="printable-report" className="bg-white">
          <div className="text-center py-10 px-10 border-b-4 border-gray-800 relative">
            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-800">
              Sell-through / Turnover Analysis (Monthly)
            </h1>
            <p className="mt-4 text-xl flex items-center justify-center gap-3">
              <FaCalendarAlt className="text-sky-700" />
              Period: {monthLabel}
            </p>
            <button
              onClick={() => window.print()}
              className="no-print absolute right-10 top-1/2 -translate-y-1/2 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-3"
            >
              <FaPrint /> Print / Save PDF
            </button>
            <button
              onClick={() => setShowReport(false)}
              className="no-print absolute left-10 top-1/2 -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Back
            </button>
          </div>

          <div className="px-10 py-6 pb-24">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th style={{ textAlign: 'left' }}>SKU</th>
                  <th style={{ textAlign: 'center' }}>Qty Sold (month)</th>
                  <th style={{ textAlign: 'center' }}>Average On-Hand Qty</th>
                  <th style={{ textAlign: 'center' }}>Inventory Turnover (times)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '80px 20px', textAlign: 'center' }}>
                      <div className="flex flex-col items-center">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-2xl font-bold text-gray-700">No Data Found</p>
                        <p className="text-gray-500 mt-2 text-lg">No sales or inventory recorded for this month.</p>
                        <button
                          onClick={() => setShowReport(false)}
                          className="mt-6 px-8 py-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-xl shadow-lg"
                        >
                          Select Different Month
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {reportData.map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ textAlign: 'left' }}>{row.sku}</td>
                        <td style={{ textAlign: 'center' }}>{formatNumber(row.qtySold)}</td>
                        <td style={{ textAlign: 'center' }}>{formatNumber(row.avgOnHand)}</td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>
                          {formatNumber(row.turnover)}
                        </td>
                      </tr>
                    ))}

                    {/* Optional: Grand Total Row */}
                    <tr className="bg-gray-600 text-white font-bold grand-total-row">
                      <td style={{ textAlign: 'center' }}>AVERAGE</td>
                      <td colSpan={2}></td>
                      <td style={{ textAlign: 'center' }}>
                        {formatNumber(
                          reportData.reduce((sum, r) => sum + parseFloat(r.turnover || 0), 0) / reportData.length || 0
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellThroughAnalysisReport;