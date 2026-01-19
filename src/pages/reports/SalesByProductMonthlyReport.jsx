import React, { useEffect, useState } from 'react';
import { FaPrint, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { getMonthlySalesDetails } from '../../functions/report';
import { useNavigate } from 'react-router-dom';

const SalesByProductMonthlyReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showReport, setShowReport] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  const storeId = JSON.parse(localStorage.getItem('selectedStore'))?.storeId;
  const systemInfo = JSON.parse(localStorage.getItem('systemInfo') || '{}');
  const currencySymbol = systemInfo.symbol;

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getMonthlySalesDetails(storeId, selectedYear, selectedMonth);
      const data = response.data.results[0] || [];
      setReportData(data);
      setShowReport(true);
    } catch (err) {
      console.error('Error loading report:', err);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Safe calculations with parseFloat
  const totalQty = reportData.reduce((sum, item) => sum + parseFloat(item.qtySold || 0), 0);
  const totalRevenue = reportData.reduce((sum, item) => sum + parseFloat(item.netAmount || 0), 0);
  const totalCost = reportData.reduce((sum, item) => sum + (parseFloat(item.cost || 0) * parseFloat(item.qtySold || 0)), 0);
  const totalProfit = totalRevenue - totalCost;
  const totalTax = reportData.reduce((sum, item) => sum + parseFloat(item.taxAmount || 0), 0);
  const hasTax = totalTax > 0;
const navigate=useNavigate();
  // Format number with commas, no symbol
  const formatNumber = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  // Format with currency symbol (for headers & totals)
  const formatCurrency = (amount) => {
    return `${currencySymbol} ${formatNumber(amount)}`;
  };

  const formatQtyWithUnit = (qty, unit) => {
    const qtyF = parseFloat(qty || 0).toFixed(2).replace(/\.00$/, '');
    if (!unit) return qtyF;
    const u = unit.toLowerCase();
    if (['piece', 'pc', 'pcs', 'unit'].includes(u)) return qtyF;
    return `${qtyF} ${unit}`;
  };

  useEffect(() => {
    const date = new Date().toLocaleString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    document.documentElement.style.setProperty('--print-date', `"${date}"`);
  }, []);

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
          Sales by Product Report
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-sky-200">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-sky-200">
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
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
            size: A4;
            margin: 15mm;
          }

          body, html {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Hide everything except printable area */
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report {
            position: absolute;
            left: 0; top: 0; width: 100%;
          }

          .no-print { display: none !important; }

          /* Repeat table header on each page */
          thead { display: table-header-group; }

          /* Table styling */
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11pt;
            page-break-inside: auto;
          }
          tr { page-break-inside: avoid; page-break-after: auto; }

          /* Footer: Print Date (left) + Page Number (right) */
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

          .print-date::before {
            content: "Printed on: " var(--print-date);
          }

          /* Page number using CSS counters */
          .page-number::after {
            counter-increment: page;
            content: "Page " counter(page);
          }

          body {
            counter-reset: page;
          }
          @page {
            counter-increment: page;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div id="printable-report" className="bg-white">

          <div className="text-center py-10 px-10 border-b-4 border-gray-800 relative">
            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-800">
              Sales by Product Report
            </h1>
            <p className="mt-4 text-xl flex items-center justify-center gap-3">
              <FaCalendarAlt className="text-sky-700" />
              Period: {months.find(m => m.value === selectedMonth).label} {selectedYear}
            </p>
            <button onClick={() => window.print()}
              className="no-print absolute right-10 top-1/2 -translate-y-1/2 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-3">
              <FaPrint /> Print / Save PDF
            </button>
            <button onClick={() => 
 {           
 // setShowReport(false);
navigate('/reports/report-dashboard');
}
            }
              className="no-print absolute left-10 top-1/2 -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">
              Back
            </button>
          </div>

          <div className="px-10 py-6 pb-24">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-gray-600 text-white text-left">
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd' }}>SKU</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd' }}>Product Description</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'center' }}>Qty Sold</th>
                  {hasTax && <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'right' }}>Tax</th>}
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'right' }}>Cost</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'right' }}>Gross Profit</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={hasTax ? 7 : 6} style={{ padding: '80px 20px', textAlign: 'center' }}>
                      <div className="flex flex-col items-center">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-2xl font-bold text-gray-700">No Sales Data Found</p>
                        <p className="text-gray-500 mt-2 text-lg">
                          No transactions recorded for <strong>{months.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
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
                    {reportData.map((item, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontFamily: 'monospace' }}>
                          {item.sku || '-'}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {item.productDescription}
                          {item.brandName && <span className="text-gray-600 text-sm ml-2">({item.brandName})</span>}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right', fontWeight: '600' }}>
                          {formatQtyWithUnit(item.qtySold, item.measurementUnitName)}
                        </td>
                        {hasTax && (
                          <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                            {formatNumber(item.taxAmount)}
                          </td>
                        )}
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                          {formatNumber(item.netAmount)}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                          {formatNumber(item.cost * item.qtySold)}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right', fontWeight: '600' }}>
                         {formatNumber(item.netAmount-(item.cost * item.qtySold))}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-600 text-white font-bold text-md">
                      <td colSpan={2} style={{ padding: '14px 10px', textAlign: 'center', border: '1px solid #ddd' }}>
                        GRAND TOTAL
                      </td>
                      <td style={{ padding: '16px 10px', textAlign: 'center', border: '1px solid #ddd' }}>
                        {/* {formatNumber(totalQty)} items */}
                      </td>
                      {hasTax && (
                        <td style={{ padding: '16px 10px', textAlign: 'right', border: '1px solid #ddd' }}>
                          {formatCurrency(totalTax)}
                        </td>
                      )}
                      <td style={{ padding: '16px 10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {formatCurrency(totalRevenue)}
                      </td>
                      <td style={{ padding: '16px 10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {formatCurrency(totalCost)}
                      </td>
                      <td style={{ padding: '16px 10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {formatCurrency(totalProfit)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Uncomment to enable footer */}
          {/* <div className="print-footer">
            <div className="print-date"></div>
            <div>Page <span className="page-current">1</span> of <span className="page-total">1</span></div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SalesByProductMonthlyReport;
