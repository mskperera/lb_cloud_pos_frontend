import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PaymentMethodChart() {
  // Sample Data
  const paymentData = {
    labels: ["Cash", "Card", "Digital Wallets"], // Payment methods
    datasets: [
      {
        label: "Transactions",
        data: [120, 200, 150], // Example data for each payment method
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)", // Cash: Pink
          "rgba(54, 162, 235, 0.8)", // Card: Blue
          "rgba(75, 192, 192, 0.8)", // Digital Wallets: Teal
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Legend at the top
      },
      title: {
        display: true,
        text: "Payment Method Breakdown",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Payment Methods",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Transactions",
          font: {
            size: 16,
          },
        },
        beginAtZero: true, // Ensures y-axis starts at zero
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={paymentData} options={options} />
    </div>
  );
}

export default PaymentMethodChart;
