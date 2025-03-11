import React from 'react';
import ReusableReport from '../ReusableReport';

const ProfitAndLossReport = () => {
  const data = [
    { label: 'Total Revenue', value: '$30,000' },
    { label: 'Total Expenses', value: '$20,000' },
    { label: 'Net Profit', value: '$10,000' }
  ];

  return <ReusableReport title="Profit and Loss Report" data={data} />;
};

export default ProfitAndLossReport;
