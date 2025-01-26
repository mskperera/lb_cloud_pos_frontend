import React from 'react';
import ReusableReport from '../ReusableReport';

const InventoryValuationReport = () => {
  const data = [
    { label: 'Product A', value: '$500' },
    { label: 'Product B', value: '$1,500' },
    { label: 'Product C', value: '$200' },
    { label: 'Total Inventory Value', value: '$2,200' }
  ];

  return <ReusableReport title="Inventory Valuation Report" data={data} />;
};

export default InventoryValuationReport;
