import React, { forwardRef } from 'react';
import moment from 'moment';
import { formatCurrency, getCurrency } from '../../../utils/format';
import { CURRENCY_DISPLAY_TYPE } from '../../../utils/constants';

const ZReportComponent = forwardRef(({ sessionDetails, dayendDetails, cashDenominationTotal }, ref) => {
  // Safe field parsers to protect against text formatting null exceptions
  const openingCash = parseFloat(dayendDetails?.openingcashAmount);
  const grossSales = parseFloat(dayendDetails?.totalSales);
  const discounts = parseFloat(dayendDetails?.totalDiscounts);
  const cogs = parseFloat(dayendDetails?.totalCostAmount);
  const netSales = parseFloat(dayendDetails?.netSales);
  const netCashSales = parseFloat(dayendDetails?.netCashSales);
  const netCardSales = parseFloat(dayendDetails?.netCardSales);
  const paidIn = parseFloat(dayendDetails?.paidIn)
  const paidOut = parseFloat(dayendDetails?.paidOut);
  
  // Operational analytics properties from backend row payload state
  const totalTransactions = dayendDetails?.noOfTransactions;
  const customersServed = dayendDetails?.noOfCustomers;
  const itemsMoved = dayendDetails?.noOfProductsSold;
  const voidedTransactions = dayendDetails?.noOfVoidedTransactions;
  const voidedValue = parseFloat(dayendDetails?.voidedTransactionsAmount);

  // 1. Financial Flow Calculations matching UI metrics
  const expectedCash = parseFloat(dayendDetails?.expectedCash);
  const actualCashCounted = parseFloat(dayendDetails?.actualCashCounted);

    const actualCardTotal = parseFloat(dayendDetails?.actualCardTotal);
  const expectedCardTotal = parseFloat(dayendDetails?.expectedCardTotal);



  const closingDiscrepancyCash = actualCashCounted - expectedCash;

  const closingDiscrepancyCard = actualCardTotal - expectedCardTotal;


   const expectedTotal = parseFloat(dayendDetails?.expectedTotal);
  const actualTotal = parseFloat(dayendDetails?.actualTotal);
  

const finalDiffDiscrepancy = actualTotal - expectedTotal;



  // Styles utility block for clean layout maintenance
  const flexRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '6px',
    margin: '3px 0',
    fontSize: '7px',
    lineHeight: 1.3,
  };
  const labelStyle = { flex: 1, minWidth: 0, wordBreak: 'break-word', whiteSpace: 'normal' };
  const valueStyle = {
    flexShrink: 0,
    textAlign: 'right',
    marginLeft: '6px',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
  };
  const dividerLineStyle = { borderBottom: '1px dashed #000', margin: '6px 0' };
  const doubleDividerStyle = { borderBottom: '3px double #000', margin: '8px 0' };

  return (
    <>
    <style>{`
        @media print {
          /* Hide all UI controls, sidebars, buttons, and backgrounds */
          body * {
            visibility: hidden !important;
          }
          
          /* Make ONLY the printable receipt and its children visible */
          .z-report-print, .z-report-print * {
            visibility: visible !important;
          }

          /* Position the receipt at the top left of the printed page */
          .z-report-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 8px !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Ensure proper page bounds and hide margins */
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
 
 <div 
        className="receipt z-report-print" 
        ref={ref} 
        style={{ 
          width: '80mm', 
          padding: '12px', 
          background: '#fff', 
          fontFamily: '"Courier New", Courier, monospace', 
          color: '#000',
          lineHeight: '1.4'
        }}
      >
    
      {/* Header Profile Section */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 2px 0' }}>
          {dayendDetails?.companyName || 'LEGEND BYTE POS'}
        </h1>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          Store: {dayendDetails?.storeName}
        </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          <span>Session: {dayendDetails?.sessionName}</span>
        </div>
           <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          <span>Terminal: POS{dayendDetails?.terminalId}</span>
        </div>
        <div style={{ margin: '6px 0', borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '2px 0', fontWeight: 'bold' }}>
          OFFICIAL Z REPORT (DAY END)
        </div>
      </div>

      {/* Meta Audit Summary Information */}
      <div style={{ marginBottom: '12px'}}>
        <div style={flexRowStyle}><span style={labelStyle}>Session ID:</span> <span style={{ ...valueStyle, fontWeight: 'bold' }}>{dayendDetails?.sessionId || 'N/A'}</span></div>
        <div style={flexRowStyle}><span style={labelStyle}>Start Time:</span> <span style={valueStyle}>{dayendDetails?.startTime ? moment(dayendDetails.startTime).format('YYYY-MM-DD HH:mm') : 'N/A'}</span></div>
        <div style={flexRowStyle}><span style={labelStyle}>End Time:</span> <span style={valueStyle}>{dayendDetails?.endTime ? moment(dayendDetails.endTime).format('YYYY-MM-DD HH:mm') : 'N/A'}</span></div>
        <div style={flexRowStyle}><span style={labelStyle}>Print Date:</span> <span style={valueStyle}>{moment().format('YYYY-MM-DD HH:mm')}</span></div>
      </div>

      {/* 1. SALES SUMMARY (Rs) */}
      <div>
        <div style={{ fontWeight: 'bold', marginTop: '10px' }}>SALES SUMMARY <span className="">({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</span></div>
        
           <div style={dividerLineStyle}></div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Product Sales:</span>
          <span style={valueStyle}>{formatCurrency(parseFloat(dayendDetails?.productSales), false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Service / Non-Product Sales:</span>
          <span style={valueStyle}>{formatCurrency(dayendDetails?.nonProductSales, false)}</span>
        </div>
        
        <div style={dividerLineStyle}></div>
        
        <div style={{...flexRowStyle, fontWeight: 'bold'}}>
          <span style={labelStyle}>Gross Sales:</span>
          <span style={valueStyle}>{formatCurrency(grossSales, false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>(-) Active Discounts Given:</span>
          <span style={valueStyle}>{formatCurrency(discounts, false)}</span>
        </div>
    
        <div style={dividerLineStyle}></div>
        <div style={{ ...flexRowStyle, fontWeight: 'bold'}}>
          <span style={labelStyle}>Net Sales:</span>
          <span style={valueStyle}>{formatCurrency(netSales, false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Voided Invoices Value:</span>
          <span style={{ ...valueStyle, color: '#b45309' }}>{formatCurrency(voidedValue, false)}</span>
        </div>
            <div style={flexRowStyle}>
          <span style={labelStyle}>Total Cost of Goods Sold (COGS):</span>
          <span style={valueStyle}>{formatCurrency(cogs, false)}</span>
        </div>

        <div style={doubleDividerStyle}></div>
      </div>

      {/* 2. REVENUE STREAM MIX (Rs) */}
      {/* <div>
        <div style={{ fontWeight: 'bold' }}>REVENUE STREAM MIX (Rs)</div>
        <div style={dividerLineStyle}></div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Product Inventory Sales:</span>
          <span style={valueStyle}>{formatCurrency(parseFloat(dayendDetails?.productSales), false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Service / Non-Product Sales:</span>
          <span style={valueStyle}>{formatCurrency(dayendDetails?.nonProductSales, false)}</span>
        </div>
        <div style={doubleDividerStyle}></div>
      </div>
       */}

      {/* 3. FINANCIAL FLOW BREAKDOWN (Rs) */}
      <div>
        <div style={{ fontWeight: 'bold' }}>CASH FLOW BREAKDOWN <span className="">({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</span></div>
        <div style={dividerLineStyle}></div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Opening Drawer Cash:</span>
          <span style={valueStyle}>{formatCurrency(openingCash, false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>(+) Cash Sales:</span>
          <span style={valueStyle}>{formatCurrency(netCashSales, false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>(+) Paid In:</span>
          <span style={valueStyle}>{formatCurrency(paidIn, false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>(-) Paid Out:</span>
          <span style={valueStyle}>{formatCurrency(paidOut, false)}</span>
        </div>
        <div style={dividerLineStyle}></div>
        <div style={{ ...flexRowStyle, fontWeight: 'bold' }}>
          <span style={labelStyle}>Expected Drawer Cash:</span>
          <span style={valueStyle}>{formatCurrency(expectedCash, false)}</span>
        </div>
        <div style={{ ...flexRowStyle, fontWeight: 'bold' }}>
          <span style={labelStyle}>Actual Drawer Cash Counted:</span>
          <span style={valueStyle}>{formatCurrency(actualCashCounted, false)}</span>
        </div>
        <div style={{ ...flexRowStyle, fontWeight: 'bold', color: closingDiscrepancyCash === 0 ? '' : (closingDiscrepancyCash > 0 ?'blue':'red' ) }}>
          <span style={labelStyle}>Cash Short / Over:</span>
          <span style={valueStyle}>{formatCurrency(closingDiscrepancyCash, false)}</span>
        </div>
    
        <div style={doubleDividerStyle}></div>
      </div>





 <div>
        <div style={{ fontWeight: 'bold' }}>CARD BREAKDOWN <span className="">({getCurrency(CURRENCY_DISPLAY_TYPE.SYMBOL)})</span></div>
        <div style={dividerLineStyle}></div>
     

     <div style={flexRowStyle}>
          <span style={labelStyle}>(+) Card Sales:</span>
          <span style={valueStyle}>{formatCurrency(netCardSales, false)}</span>
        </div>

        <div style={{ ...flexRowStyle, fontWeight: 'bold' }}>
          <span style={labelStyle}>Expected Card Total:</span>
          <span style={valueStyle}>{formatCurrency(dayendDetails?.expectedCardTotal, false)}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Actual Card Total:</span>
          <span style={valueStyle}>{formatCurrency(dayendDetails?.actualCardTotal, false)}</span>
        </div>
           <div style={flexRowStyle}>
          <span style={labelStyle}>Terminal Slip No:</span>
          <span style={valueStyle}>{dayendDetails?.terminalSlipNo}</span>
        </div>
        
        <div style={{ ...flexRowStyle, fontWeight: 'bold', color: closingDiscrepancyCard === 0 ? '' : (closingDiscrepancyCard > 0 ?'blue':'red' )  }}>
          <span style={labelStyle}>Card Short / Over:</span>
          <span style={valueStyle}>{formatCurrency(closingDiscrepancyCard, false)}</span>
        </div>

        <div style={doubleDividerStyle}></div>
      </div>




      {/* 4. END-OF-DAY REVENUE RECONCILIATION MONITOR */}
 {/* 4. REVENUE RECONCILIATION BLOCKS */}
<div>
  <div style={{ fontWeight: 'bold' }}>REVENUE RECONCILIATION</div>
  <div style={dividerLineStyle}></div>
  
  <div style={flexRowStyle}>
    <span style={labelStyle}>Expected Total:</span>
    <span style={valueStyle}>{formatCurrency(dayendDetails?.expectedTotal, false)}</span>
  </div>

  <div style={flexRowStyle}>
    <span style={labelStyle}>Counted Total:</span>
    <span style={valueStyle}>{formatCurrency(dayendDetails?.actualTotal, false)}</span>
  </div>


  <div style={dividerLineStyle}></div>

  

  <div style={{ ...flexRowStyle, fontWeight: 'bold', color: finalDiffDiscrepancy === 0 ? 'green' : 'red' }}>
    <span style={labelStyle}>Difference:</span>
    <span style={valueStyle}>
      {finalDiffDiscrepancy > 0 ? '+' : ''}{formatCurrency(finalDiffDiscrepancy, false)}
    </span>
  </div>
  <div style={doubleDividerStyle}></div>
</div>

      {/* 5. OPERATIONS & QUANTITIES */}
      <div>
        <div style={{ fontWeight: 'bold' }}>OPERATIONS & QUANTITIES</div>
        <div style={dividerLineStyle}></div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Successful Transactions:</span>
          <span style={valueStyle}>{totalTransactions}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Registered Customer Sales:</span>
          <span style={valueStyle}>{customersServed}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Physical Items Moved:</span>
          <span style={valueStyle}>{itemsMoved}</span>
        </div>
        <div style={flexRowStyle}>
          <span style={labelStyle}>Voided Transactions:</span>
          <span style={valueStyle}>{voidedTransactions}</span>
        </div>
        <div style={dividerLineStyle}></div>
      </div>

      {/* Footer Block */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <div style={{ fontWeight: 'bold' }}>* Z-REPORT COMPLETION AUDIT *</div>
        <div style={{ margin: '2px 0' }}>Please retain this thermal copy for bookkeeping records.</div>
        <div style={{ color: '#666', marginTop: '4px' }}>System by legendbyte.com</div>
      </div>
    </div>

       </>
  );
});

ZReportComponent.displayName = "ZReportComponent";
export default ZReportComponent;