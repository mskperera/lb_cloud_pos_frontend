import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaPrint, FaSpinner } from 'react-icons/fa';
import { getInventoryOnHand } from '../../functions/report';
import { useToast } from '../../components/useToast';
import moment from 'moment';

const InventoryOnHandReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const showToast = useToast();
  const storeId = JSON.parse(localStorage.getItem('selectedStore'))?.storeId;
  const systemInfo = JSON.parse(localStorage.getItem('systemInfo') || '{}');
  const currencySymbol = systemInfo.symbol || 'LKR';

  const fetchReport = async () => {
    if (!storeId) {
      showToast('danger', 'Error', 'No store selected');
      return;
    }

    setLoading(true);
    try {
      const response = await getInventoryOnHand(storeId);

      if (response.data.error) {
        showToast('danger', 'Exception', response.data.error.message);
        return;
      }

      const data = response.data.results[0];
      setReportData(data);
      setShowReport(true);
    } catch (err) {
      console.error('Error loading inventory report:', err);
      showToast('danger', 'Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const formatQtyWithUnit = (qty, unit) => {
    const qtyF = parseFloat(qty || 0).toFixed(2).replace(/\.00$/, '');
    if (!unit) return qtyF;
    const u = unit.toLowerCase();
    if (['piece', 'pc', 'pcs', 'unit'].includes(u)) return qtyF;
    return `${qtyF} ${unit}`;
  };
  // Grand totals
  const grandQtyOnHand = reportData.reduce((sum, row) => sum + parseFloat(row.qtyOnHand || 0), 0);
  const grandTotalValue = reportData.reduce((sum, row) => sum + parseFloat(row.totalValue || 0), 0);

  const formatNumber = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount || 0));
  };

  const formatCurrency = (amount) => `${currencySymbol} ${formatNumber(amount)}`;

  const reportDate = moment().format('MMMM DD, YYYY');

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
          Inventory On-Hand Report
        </h2>

        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            This report shows current stock levels for all products as of today.
          </p>
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

    /* Force background colors to print */
    thead tr,
    .grand-total-row {  /* Add this class to your Grand Total <tr> */
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    thead th,
    .grand-total-row td {
      color: white !important; /* Ensures white text stays visible */
    }

  }
  @media screen {
    table { font-size: 12px; }
  }
`}</style>

      

      <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <div id="printable-report" className="bg-white">
          <div className="text-center py-10 px-10 border-b-4 border-gray-800 relative">
            <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-800">
              Inventory On-Hand Report
            </h1>
            <p className="mt-4 text-xl">
              As of: {reportDate}
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
                  <th style={{ textAlign: 'left', width: '15%' }}>SKU</th>
                  <th style={{ textAlign: 'left', width: '40%' }}>Product Description</th>
                  <th style={{ textAlign: 'center' }}>Qty On Hand</th>
                  <th style={{ textAlign: 'center' }}>Reorder Level</th>
                  <th style={{ textAlign: 'right' }}>Unit Cost ({currencySymbol})</th>
                  <th style={{ textAlign: 'right' }}>Total Value ({currencySymbol})</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '80px 20px', textAlign: 'center' }}>
                      <div className="flex flex-col items-center">
                        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-2xl font-bold text-gray-700">No Inventory Data Found</p>
                        <p className="text-gray-500 mt-2 text-lg">No products found for this store.</p>
                        <button
                          onClick={() => setShowReport(false)}
                          className="mt-6 px-8 py-3 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-xl shadow-lg"
                        >
                          Go Back
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {reportData.map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ textAlign: 'left' }}>{row.sku}</td>
                        <td style={{ textAlign: 'left' }}>{row.productDescription}</td>
<td style={{ textAlign: 'center' }}>
  {parseFloat(row.qtyOnHand) <= parseFloat(row.reorderLevel) ? (
    <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>
      <FaExclamationTriangle
        className="inline mr-1 text-orange-400"
        title="Low"
      />
      {formatQtyWithUnit(row.qtyOnHand,row.measurementUnitName)} 
    </span>
  ) : (
    <span style={{ fontWeight: 'normal' }}>
      
      {formatQtyWithUnit(row.qtyOnHand,row.measurementUnitName)} 
    </span>
  )}
</td>
                        <td style={{ textAlign: 'center' }}>{row.reorderLevel}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber(row.unitCost)}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(row.totalValue)}</td>
                      </tr>
                    ))}

                    <tr className="bg-gray-600 text-white font-bold">
                      <td colSpan={2} style={{ textAlign: 'center' }}>GRAND TOTAL</td>
                      <td style={{ textAlign: 'center' }}>{grandQtyOnHand}</td>
                      <td colSpan={2}></td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(grandTotalValue)}</td>
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

export default InventoryOnHandReport;