import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import LineChart from '../dashboard/LineChart';
import { getCurrencyInfo } from '../../utils/utils';
import TableView from '../dashboard/TableView'; // Import the TableView component
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

function RevenueChart({ dailyRevenueData, monthlyRevenueData }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [metricData, setMetricData] = useState([
    { title: "Gross Revenue", amount: 0, formula: "Total Sales" },
    { title: "Net Revenue", amount: 0, formula: "Gross Revenue - Returns - Discounts" },
    { title: "Gross Profit", amount: 0, formula: "Gross Revenue - COGS" },
  ]);

  useEffect(() => {
    const updateMetricData = (isMonthly) => {
      const data = isMonthly ? monthlyRevenueData : dailyRevenueData;
      if (data && data.datasets.length >= 2) {
        const grossRevenue = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
        const netRevenue = data.datasets[1].data.reduce((sum, val) => sum + val, 0);
        const grossProfit = data.datasets[2].data.reduce((sum, val) => sum + val, 0);
  
        setMetricData([
          { title: "Gross Revenue", amount: formatCurrency(grossRevenue, false), formula: "Total Sales" },
          { title: "Net Revenue", amount: formatCurrency(netRevenue, false), formula: "Gross Revenue - Returns - Discounts" },
          { title: "Gross Profit", amount: formatCurrency(grossProfit, false), formula: "Gross Revenue - COGS" },
        ]);
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



  const dailyRevenueColumns = [
    { name: "Metric", key: "title", align: "left" },
    { name: `Amount(${getCurrencyInfo().symbol})`, key: "amount", align: "right" },
    { name: "Description", key: "formula", align: "left" },
  ];
  
  const monthlyRevenueColumns = [
    { name: "Metric", key: "title", align: "left" },
    { name: `Amount(${getCurrencyInfo().symbol})`, key: "amount", align: "right" },
    { name: "Description", key: "formula", align: "left" },
  ];
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
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

        <div className="col-span-2 ">
          <LineChart 
            titleVisible={false} 
            data={activeTab === 'daily' ? dailyRevenueData : monthlyRevenueData} 
            options={options} 
            labels={{ show: false, labelType: "percentage" }} 
          />
        </div>

        <div className="pt-9">
        <h3 className="text-xl mb-4">{`Sum of ${activeTab === 'daily' ? 'Days' : 'Months'}`}</h3>
        <TableView
  data={metricData}
  columns={activeTab === 'daily' ? dailyRevenueColumns : monthlyRevenueColumns}
/>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;
