// ReusableReport.js
import React from 'react';

const ReusableReport = ({ title, data }) => {
  return (
    <div>
      <h3>{title}</h3>
      {data && data.length > 0 ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ReusableReport;
