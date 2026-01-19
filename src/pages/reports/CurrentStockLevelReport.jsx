
// Current Stock Level Report
import React, { useEffect, useState } from 'react';
import { FaPrint, FaBoxOpen, FaSpinner } from 'react-icons/fa';
import { getCurrentStockLevel } from '../../functions/report'; // Assume this function exists

const CurrentStockLevelReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const storeId = JSON.parse(localStorage.getItem('selectedStore'))?.storeId;
  const systemInfo = JSON.parse(localStorage.getItem('systemInfo') || '{}');
  const currencySymbol = systemInfo.symbol;

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getCurrentStockLevel(storeId);
      const data = response.data.results[0] || []; // Assume structure: [{ sku, name, quantity, unit, value }]
      setReportData(data);
      setShowReport(true);
    } catch (err) {
      console.error('Error loading report:', err);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalQuantity = reportData.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
  const totalValue = reportData.reduce((sum, item) => sum + parseFloat(item.value || 0), 0);

  const formatNumber = (amount) => new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(amount));
  const formatCurrency = (amount) => `${currencySymbol} ${formatNumber(amount)}`;
  const formatQty = (qty) => parseFloat(qty || 0).toFixed(2).replace(/\.00$/, '');

  useEffect(() => {
    const date = new Date().toLocaleString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Current Stock Level Report</h2>
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
          @page { size: A4; margin: 15mm 12mm 30mm 12mm; }
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          thead { display: table-header-group; }
          table { border-collapse: collapse; width: 100%; font-size: 10.5pt; }
          tr { page-break-inside: avoid; }
          .print-footer { position: fixed; bottom: 0; left: 0; right: 0; height: 24px; background: white; border-top: 1px solid #ddd; font-size: 9pt; color: #333; display: flex; justify-content: space-between; align-items: center; padding: 0 12mm; }
          .print-date::before { content: "Printed on: " var(--print-date); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div id="printable-report" className="bg-white">
          <div className="text-center py-10 px-10 border-b-4 border-gray-800 relative">
            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-800">Current Stock Level Report</h1>
            <p className="mt-4 text-xl flex items-center justify-center gap-3">
              <FaBoxOpen className="text-sky-700" />
              As of Today
            </p>
            <button onClick={() => window.print()} className="no-print absolute right-10 top-1/2 -translate-y-1/2 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-3">
              <FaPrint /> Print / Save PDF
            </button>
            <button onClick={() => {setShowReport(false)}} className="no-print absolute left-10 top-1/2 -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">
              Back
            </button>
          </div>

          <div className="px-10 py-6 pb-24">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd' }}>SKU</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'center' }}>Quantity</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'center' }}>Unit</th>
                  <th style={{ padding: '12px 10px', border: '1px solid #ddd', textAlign: 'right' }}>Value ({currencySymbol})</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '80px 20px', textAlign: 'center' }}>
                      <div className="flex flex-col items-center">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-2xl font-bold text-gray-700">No Stock Data Found</p>
                        <p className="text-gray-500 mt-2 text-lg">
                          No inventory items available
                        </p>
                        <button onClick={() => setShowReport(false)} className="mt-6 px-8 py-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-xl shadow-lg">
                          Back
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {reportData.map((item, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontFamily: 'monospace' }}>{item.sku || '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{formatQty(item.quantity)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{item.unit || '-'}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>{formatNumber(item.value)}</td>
                      </tr>
                    ))}

                    <tr className="bg-gray-800 text-white font-bold text-lg">
                      <td colSpan={2} style={{ padding: '16px 10px', textAlign: 'center', border: '1px solid #ddd' }}>
                        GRAND TOTAL
                      </td>
                      <td style={{ padding: '16px 10px', textAlign: 'center', border: '1px solid #ddd' }}>
                        {formatNumber(totalQuantity)} items
                      </td>
                      <td style={{ padding: '16px 10px', textAlign: 'center', border: '1px solid #ddd' }}>
                        -
                      </td>
                      <td style={{ padding: '16px 10px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {formatCurrency(totalValue)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="print-footer">
            <div className="print-date"></div>
            <div className="page-number"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentStockLevelReport;