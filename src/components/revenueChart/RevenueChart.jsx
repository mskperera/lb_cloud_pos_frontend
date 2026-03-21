import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import LineChart from '../dashboard/LineChart';
import { getCurrencyInfo } from '../../utils/utils';
import { formatCurrency } from '../../utils/format';

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

function RevenueChart({ dailyRevenueData, monthlyRevenueData,activeTab,title ,subTitle}) {
 // const [activeTab, setActiveTab] = useState('daily');
  const [metricData, setMetricData] = useState('');

  useEffect(() => {
    const updateMetricData = (isMonthly) => {
      const data = isMonthly ? monthlyRevenueData : dailyRevenueData;
      if (data && data.datasets.length >= 2) {
        const netRevenue = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
        const grossProfit = data.datasets[1].data.reduce((sum, val) => sum + val, 0);
  
        setMetricData(
        //  { title: "Gross Revenue", amount: formatCurrency(grossRevenue, false), formula: "Total Sales" },
          {  totalRevenue: formatCurrency(netRevenue, false), totalProfit: formatCurrency(grossProfit, false)},
        );
      }
    };
  
    updateMetricData(activeTab === 'monthly');
  }, [activeTab, dailyRevenueData, monthlyRevenueData]);
  
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: activeTab === 'daily' ? "Daily Revenue" : "Monthly Revenue",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: activeTab === 'daily' ? "Days" : "Months",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: `Revenue & Profit (${getCurrencyInfo().symbol})`,
          font: {
            size: 16,
          },
        },
      },
    },
  };

  if (!dailyRevenueData || !monthlyRevenueData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">

        <div className='flex flex-col gap-2'>
        <h3 className="text-lg font-bold text-gray-600">
         {title}
        </h3>
        
      <p className='text-sky-600 font-semibold'>{subTitle}</p>
</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
       
          <div
            className="flex justify-between gap-5 items-center p-2 bg-sky-50 rounded-lg border border-sky-300"
          >
            <h4 className="font-semibold text-sky-800">Total Revenue</h4>
            <p className="font-bold text-sky-600">{metricData.totalProfit}</p>
          </div>

             <div
            className="flex justify-between gap-5 items-center p-2 bg-green-50 rounded-lg border border-green-300"
          >
            <h4 className=" font-semibold text-green-800">Total Profit</h4>
            <p className=" font-bold text-green-600">{metricData.totalProfit}</p>
          </div>
      
      </div>

        {/* <div className="space-x-2">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div> */}
      </div>

    

      <div className="">
        <LineChart 
          titleVisible={false} 
          data={activeTab === 'daily' ? dailyRevenueData : monthlyRevenueData} 
          options={options} 
          labels={{ show: false, labelType: "percentage" }} 
        />
      </div>
    </div>
  );
}

export default RevenueChart;