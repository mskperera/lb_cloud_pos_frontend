import React from 'react';
import ReusableReport from '../ReusableReport';

const SalesByProductReport = () => {
  const data = [
    { label: 'Product A', sold: '500 units', revenue: '$5,000' },
    { label: 'Product B', sold: '300 units', revenue: '$3,000' },
    { label: 'Product C', sold: '200 units', revenue: '$2,000' }
  ];

  return <ReusableReport title="Sales by Product Report" data={data} />;
};

export default SalesByProductReport;
