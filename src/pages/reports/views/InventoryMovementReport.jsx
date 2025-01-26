import React from 'react';
import ReusableReport from '../ReusableReport';

const InventoryMovementReport = () => {
  const data = [
    { label: 'Product A', purchased: '100 units', sold: '500 units' },
    { label: 'Product B', purchased: '200 units', sold: '300 units' },
    { label: 'Product C', purchased: '50 units', sold: '200 units' }
  ];

  return <ReusableReport title="Inventory Movement Report" data={data} />;
};

export default InventoryMovementReport;
