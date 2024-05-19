import React from 'react';

const PrinterConnetion = ({ printerConnected }) => {
  const tooltipText = printerConnected ? 'Printer connected' : 'Printer is not connected';

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <i
        className={`pi pi-print`}
        style={{ fontSize: '1.5rem', margin: '10px' }}
        title={tooltipText}
      ></i>
      {!printerConnected && (
        <i
          className="pi pi-times"
          style={{
            fontSize: '1.5rem',
            position: 'absolute',
            fontWeight: 'bold',
            top: '5px',
            left: '10px',
            color: 'red',
          }}
          title={tooltipText}
        ></i>
      )}
    </div>
  );
};

export default PrinterConnetion;
