import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import LineChart from '../dashboard/LineChart';
import { getCurrencyInfo } from '../../utils/utils';
import PieChart from '../dashboard/PieChart';
import TableView from '../dashboard/TableView';
import DoughnutChart from '../dashboard/DoughnutChart';

Chart.register(ChartDataLabels);

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LowStockProducts({ lowStockProductsData, lowStockProductsColumns }) {
 

  if (!lowStockProductsData) {
    return <div>Loading...</div>;
  }

  const inventoryData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        data: [300, 50, 20],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const paymentOptions = {
    plugins: {
      legend: {
        position: "top",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };


  return (
    <div className="bg-white  rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
  
<div className="col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Low Stock Products</h3>
<TableView
             // title="Low Stock Products"
              data={lowStockProductsData}
              columns={lowStockProductsColumns}
            />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
        {/* <h3 className="text-xl mb-4">Profit Margins</h3> */}
        {/* <PieChart
          data={profitMarginData}
          options={paymentOptions}
          labels={{ show: true, labelType: "value", prefix: "Rs" }}
        /> */}
      </div>
     </div>
  
    </div></div>
  );
}

export default LowStockProducts;
