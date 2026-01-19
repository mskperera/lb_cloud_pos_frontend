import React, { useEffect, useState } from 'react';
import { FaPrint, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getDailySalesSummary } from '../../functions/report';
import { useToast } from '../../components/useToast';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const DailySalesSummaryReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
  const [showReport, setShowReport] = useState(false);
  const showToast = useToast();
  const storeId = JSON.parse(localStorage.getItem('selectedStore'))?.storeId;
  const systemInfo = JSON.parse(localStorage.getItem('systemInfo') || '{}');
  const currencySymbol = systemInfo.symbol;

  const navigate=useNavigate();
  
  const fetchReport = async () => {
    setLoading(true);
    try {

      const fromDate = formatApiDate(startDate);
    const toDate = formatApiDate(endDate);
            console.log('yyyytttt',startDate, endDate);
      const response = await getDailySalesSummary(storeId, fromDate, toDate);


       

              if (response.data.error) {
                showToast("danger", "Exception", response.data.error.message);
             
                return;
              }
         

      const data = response.data.results[0];
      setReportData(data);
      setShowReport(true);
    } catch (err) {
      console.error('Error loading report:', err);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Grand totals
  const grandTotalSales = reportData.reduce((sum, row) => sum + parseFloat(row.totalSales || 0), 0);
  const grandTransactions = reportData.reduce((sum, row) => sum + parseFloat(row.numTransactions || 0), 0);
  const grandCash = reportData.reduce((sum, row) => sum + parseFloat(row.cashSales || 0), 0);
  const grandCard = reportData.reduce((sum, row) => sum + parseFloat(row.cardSales || 0), 0);
  const grandDiscounts = reportData.reduce((sum, row) => sum + parseFloat(row.discounts || 0), 0);
  const grandRefunds = reportData.reduce((sum, row) => sum + parseFloat(row.refunds || 0), 0);
  const grandNetSales = reportData.reduce((sum, row) => sum + parseFloat(row.netSales || 0), 0);
  const grandGrossProfit = reportData.reduce((sum, row) => sum + parseFloat(row.grossProfit || 0), 0);



const formatDisplayDate = (date) => {
  return moment(date).format('MMMM DD, YYYY'); // e.g., December 17, 2025
};

// Helper to format for API (if needed)
const formatApiDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const periodLabel = moment(startDate).isSame(endDate, 'day')
  ? formatDisplayDate(startDate)
  : `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;


  const formatNumber = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount || 0));
  };

  const formatCurrency = (amount) => `${currencySymbol} ${formatNumber(amount)}`;


  useEffect(() => {
    const date = new Date().toLocaleString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    document.documentElement.style.setProperty('--print-date', `"${date}"`);
  }, []);

  // Print page number logic
  useEffect(() => {
    const updatePageNumbers = () => {
      const currentEls = document.querySelectorAll('.page-current');
      const totalEls = document.querySelectorAll('.page-total');
      const totalPages = Math.ceil(document.body.scrollHeight / 1050);
      currentEls.forEach((el, i) => el.textContent = i + 1);
      totalEls.forEach(el => el.textContent = totalPages);
    };

    const handlePrint = () => setTimeout(updatePageNumbers, 300);
    window.onbeforeprint = handlePrint;
    const mediaQuery = window.matchMedia('print');
    mediaQuery.addEventListener('change', e => e.matches && handlePrint());

    return () => {
      window.onbeforeprint = null;
      mediaQuery.removeEventListener('change', () => {});
    };
  }, [showReport]);

  if (!showReport) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Daily Sales Summary Report
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-sky-200"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              minDate={startDate}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-sky-200"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
        <button onClick={fetchReport} disabled={loading}
          className="w-full bg-sky-700 hover:bg-sky-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg shadow-lg flex items-center justify-center gap-3">
          {loading ? <><FaSpinner className="animate-spin" /> Loading Report...</> : 'View Report'}
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @media print {
          @page {
            size: A4 landscape;    /* <-- This forces landscape orientation */
            margin: 12mm;
          }

          body, html {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; }

          .no-print { display: none !important; }

          thead { display: table-header-group; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;          /* Slightly smaller to fit comfortably */
            page-break-inside: auto;
          }
          tr { page-break-inside: avoid; page-break-after: auto; }

          th, td {
            padding: 8px 6px;
            border: 1px solid #ddd;
            white-space: nowrap;      /* Prevent wrapping */
          }

          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: white;
            border-top: 1px solid #ddd;
            font-size: 9pt;
            color: #444;
            display: flex;
            justify-content: space-between;
            padding: 0 12mm;
            line-height: 20px;
            z-index: 9999;
          }

          .print-date::before { content: "Printed on: " var(--print-date); }
        }

        /* On screen (optional) - keep portrait for preview */
        @media screen {
          table { font-size: 12px; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div id="printable-report" className="bg-white">
          <div className="text-center py-10 px-10 border-b-4 border-gray-800 relative">
            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-800">
              Daily Sales Summary Report
            </h1>
            <p className="mt-4 text-xl flex items-center justify-center gap-3">
              <FaCalendarAlt className="text-sky-700" />
              Period: {periodLabel}
            </p>
            <button onClick={() => window.print()}
              className="no-print absolute right-10 top-1/2 -translate-y-1/2 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-3">
              <FaPrint /> Print / Save PDF
            </button>
            <button onClick={() => {
              navigate('/reports/report-dashboard')
            }}
              className="no-print absolute left-10 top-1/2 -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">
              Back
            </button>
          </div>

          <div className="px-10 py-6 pb-24">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-gray-600 text-white text-left">
                  <th style={{ textAlign: 'center' }}>Date</th>
                  <th style={{ textAlign: 'right' }}>Total Sales</th>
                  <th style={{ textAlign: 'center' }}># Transactions</th>
                  <th style={{ textAlign: 'right' }}>Cash Sales</th>
                  <th style={{ textAlign: 'right' }}>Card Sales</th>
                  <th style={{ textAlign: 'right' }}>Discounts</th>
                  <th style={{ textAlign: 'right' }}>Refunds</th>
                  <th style={{ textAlign: 'right' }}>Net Sales</th>
                  <th style={{ textAlign: 'right' }}>Gross Profit</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '80px 20px', textAlign: 'center' }}>
                      <div className="flex flex-col items-center">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-2xl font-bold text-gray-700">No Sales Data Found</p>
                        <p className="text-gray-500 mt-2 text-lg">
                          No transactions recorded for the selected period
                        </p>
                        <button onClick={() => setShowReport(false)}
                          className="mt-6 px-8 py-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-xl shadow-lg">
                          Select Different Period
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
            
                    {reportData.map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ textAlign: 'center' }}>{moment(row.saleDate).format('DD-MMM-yyyy')}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber(row.totalSales)}</td>
                        <td style={{ textAlign: 'center' }}>{row.numTransactions}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber(row.cashSales)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber(row.cardSales)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber(row.discounts)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber(row.refunds)}</td>
                        <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatNumber(row.netSales)}</td>
                        <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatNumber(row.grossProfit)}</td>
                      </tr>
                    ))}

                    <tr className="bg-gray-600 text-white font-bold text-md">
                      <td style={{ textAlign: 'center' }}>GRAND TOTAL</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandTotalSales)}</td>
                      <td style={{ textAlign: 'center' }}>{grandTransactions}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandCash)}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandCard)}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandDiscounts)}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandRefunds)}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandNetSales)}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandGrossProfit)}</td>
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

export default DailySalesSummaryReport;