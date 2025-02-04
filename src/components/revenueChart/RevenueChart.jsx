import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import LineChart from '../dashboard/LineChart';
import { getCurrencyInfo } from '../../utils/utils';
import PieChart from '../dashboard/PieChart';

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

function RevenueChart({ dailyRevenueData, monthlyRevenueData }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [profitMarginData, setProfitMarginData] = useState({
    labels: ["Revenue", "Profit"], 
    datasets: [
      {
        data: [0, 0], // Initial placeholder values
        backgroundColor: ["#4CAF50", "#36A2EB"],
      },
      
    ],
  });

  const paymentOptions = {
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {
    const updateProfitMarginData = (isMonthly) => {
      const data = isMonthly ? monthlyRevenueData : dailyRevenueData;


      if (data && data.datasets.length >= 2) {
        const totalRevenue = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
        const totalProfit = data.datasets[1].data.reduce((sum, val) => sum + val, 0);

        console.log('updateProfitMarginData',totalRevenue,totalProfit)
        setProfitMarginData({
          labels: ["Revenue", "Profit"], 
          datasets: [
            {
              data: [totalRevenue, totalProfit],
              backgroundColor: ["rgba(0, 123, 255, 0.8)", "rgba(40, 167, 69, 0.8)"]
            },
          ],
        });        
      }
    };

    updateProfitMarginData(activeTab === 'monthly');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
   
          <div className="col-span-3 flex justify-between items-center">

      <h3 className="text-xl mb-2">{options.plugins.title.text}</h3>

            <div>
        <button
          onClick={() => setActiveTab('daily')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'daily' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'daily' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
            borderRadius: 10
          }}
        >
          Daily Revenue
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'monthly' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'monthly' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 10
          }}
        >
          Monthly Revenue
        </button>
      </div>

</div>
<div className="col-span-2">
      <LineChart 
        titleVisible={false} 
        data={activeTab === 'daily' ? dailyRevenueData : monthlyRevenueData} 
        options={options} 
        labels={{ show: false, labelType: "percentage" }} 
      />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
        {/* <h3 className="text-xl mb-4">Profit Margins</h3> */}
        <PieChart
          data={profitMarginData}
          options={paymentOptions}
          labels={{ show: true, labelType: "value", prefix: "Rs" }}
        />
      </div>
     
    </div></div>
  );
}

export default RevenueChart;
