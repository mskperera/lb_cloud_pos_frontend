import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import LineChart from '../dashboard/LineChart';

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

function RevenueChart() {
  const [activeTab, setActiveTab] = useState('daily'); // State to track the active tab (daily or monthly)

  // Daily and Monthly Revenue Data
  const dailyRevenueData = {
    labels: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 26, 27, 28, 29, 30, 31
    ], // Days in the month
    datasets: [
      {
        label: "Daily Revenue",
        data: [200, 250, 300, 400, 350, 500, 450, 550, 600, 700, 800, 900, 950, 1000, 1100, 1200, 1250, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700], // Daily revenue sample data
        borderColor: "rgba(54, 162, 235, 0.8)", // Blue color for the line
        backgroundColor: "rgba(54, 162, 235, 0.3)", // Light blue background for the area
        tension: 0.4, // Smooth curve for the line
      },
      {
        label: "Daily Profit",
        data: [50, 60, 70, 90, 80, 100, 90, 110, 120, 140, 160, 180, 190, 200, 220, 250, 260, 270, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580], // Daily profit sample data
        borderColor: "rgba(255, 99, 132, 0.8)", // Red color for the profit line
        backgroundColor: "rgba(255, 99, 132, 0.3)", // Light red background for the area
        tension: 0.4, // Smooth curve for the line
      },
    ],
  };

  const monthlyRevenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Monthly labels
    datasets: [
      {
        label: "Monthly Revenue",
        data: [6000, 7500, 9000, 12000, 10500, 15000, 13500, 16500, 18000, 21000, 24000, 27000], // Monthly revenue sample data
        borderColor: "rgba(255, 206, 86, 0.8)", // Yellow
        backgroundColor: "rgba(255, 206, 86, 0.3)",
        tension: 0.4,
      },
      {
        label: "Monthly Profit",
        data: [1000, 1200, 1500, 2000, 1800, 2500, 2200, 2700, 3000, 3500, 4000, 4500], // Monthly profit sample data
        borderColor: "rgba(255, 99, 132, 0.8)", // Red color for the profit line
        backgroundColor: "rgba(255, 99, 132, 0.3)", // Light red background for the area
        tension: 0.4,
      },
    ],
  };

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
          text: "Revenue & Profit ($)",
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Tab Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('daily')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'daily' ? '#4CAF50' : '#f1f1f1',
            color: activeTab === 'daily' ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
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
          }}
        >
          Monthly Revenue
        </button>
      </div>

      {/* Line Chart with Conditional Data */}
      <LineChart data={activeTab === 'daily' ? dailyRevenueData : monthlyRevenueData} options={options} labels={{ show: false, labelType: "percentage" }}  />
    </div>
  );
}

export default RevenueChart;
