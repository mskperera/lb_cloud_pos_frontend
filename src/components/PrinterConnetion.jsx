import React from 'react';

const PrinterConnetion = ({ printerConnected }) => {
  const tooltipText = printerConnected ? 'Printer connected' : 'Printer is not connected';

  return (
    <div className='m-0 p-0'>
      <i
        className={`pi pi-print`}
        style={{ fontSize: '1.5rem' }}
        title={tooltipText}
      ></i>
      {!printerConnected && 
       null
      }
    </div>
  );
};

export default PrinterConnetion;
