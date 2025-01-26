import React, { useState } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import PaymentMethodChart from '../../components/dashboard/PaymentMethodChart';
import PaymentMethodBreakDownTable from '../../components/dashboard/PaymentMethodBreakDownTable';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import DoughnutChart from '../../components/dashboard/DoughnutChart';
import PieChart from '../../components/dashboard/PieChart';
import LineChart from '../../components/dashboard/LineChart';
import TableView from '../../components/dashboard/TableView';
import RevenueChart from '../../components/revenueChart/RevenueChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import TopCards from '../../components/dashboard/TopCards';

Chart.register(ChartDataLabels);


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  // Sample Data for Charts
  const salesData = {
    labels: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    datasets: [{ label: 'Revenue', data: [5000, 35000, 120000, 1440000], borderColor: 'rgba(75,192,192,1)', fill: false }],
  };
  const profitMarginData = {
    labels: ['Gross Revenue', 'Net Revenue'],
    datasets: [{ data: [1440000, 1200000], backgroundColor: ['#4CAF50', '#36A2EB'] }],
  };

  const refundsData = {
    labels: ['Refunds (Number)', 'Refunds (Value)'],
    datasets: [{ data: [15, 3000], backgroundColor: ['#FF5733', '#FFC300'] }],
  };
  const inventoryData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [{ data: [300, 50, 20], backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] }],
  };



  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Monthly labels
    datasets: [
      {
        label: "Daily Revenue",
        data: [200, 250, 300, 400, 350, 500, 450, 550, 600, 700, 800, 900], // Daily revenue sample data
        borderColor: "rgba(54, 162, 235, 0.8)", // Blue
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        tension: 0.4, // Smooth curve
      },
      {
        label: "Weekly Revenue",
        data: [1400, 1800, 2100, 2800, 2450, 3500, 3150, 3850, 4200, 4900, 5600, 6300], // Weekly revenue sample data
        borderColor: "rgba(75, 192, 192, 0.8)", // Teal
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.4,
      },
      {
        label: "Monthly Revenue",
        data: [6000, 7500, 9000, 12000, 10500, 15000, 13500, 16500, 18000, 21000, 24000, 27000], // Monthly revenue sample data
        borderColor: "rgba(255, 206, 86, 0.8)", // Yellow
        backgroundColor: "rgba(255, 206, 86, 0.3)",
        tension: 0.4,
      },
      {
        label: "Yearly Revenue",
        data: [100000, 120000, 140000, 160000, 180000, 200000, 220000, 240000, 260000, 280000, 300000, 320000], // Yearly revenue sample data
        borderColor: "rgba(255, 99, 132, 0.8)", // Red
        backgroundColor: "rgba(255, 99, 132, 0.3)",
        tension: 0.4,
      },
    ],
  };

  //Total revenue (daily, weekly, monthly, yearly).
  const optionsRevenue = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
       // text: "Total Revenue (Daily, Weekly, Monthly, Yearly)",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue ($)",
          font: {
            size: 16,
          },
        },
      },
    },
  };




  // PaymentMethodChartData
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

//PaymentMethodChartOptions
  const optionsPaymentMethods = {
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

  const dailyRevenueData = {
    labels: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 26, 27, 28, 29, 30, 31
    ], // Days in the month
    datasets: [
      {
        label: "Daily Revenue",
        data: [200, 250, 300, 400, 350, 500, 450, 550, 600, 700, 800, 900, 950, 1000, 1100, 1200, 1250, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700], // Sample revenue data for each day
        borderColor: "rgba(54, 162, 235, 0.8)", // Blue color for the line
        backgroundColor: "rgba(54, 162, 235, 0.3)", // Light blue background for the area
        tension: 0.4, // Smooth curve for the line
      },
    ],
  };
  

  // Monthly and Yearly Revenue Data
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
    ],
  };



   // Total daily revenue chart options
   const optionsDailyRevenue = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "January",
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue ($)",
          font: {
            size: 16,
          },
        },
      },
    },
  };

  // Monthly Revenue Chart Options
  const optionsMonthlyRevenue = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Year 2025",
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue ($)",
          font: {
            size: 16,
          },
        },
      },
    },
  };

// Column configuration with dynamic alignment
const paymentDataTableColumns = [
  { name: "Payment Method", key: "method", align: "left" },
  { name: "Transactions", key: "transactions", align: "center" },
  { name: "Total Amount ($)", key: "amount", align: "right" },
];

// Payment breakdown data with keys matching the column "key" values
const paymentDataTable = [
  { method: "Credit Card", transactions: 120, amount: 4500 },
  { method: "PayPal", transactions: 80, amount: 3200 },
  { method: "Bank Transfer", transactions: 50, amount: 2500 },
  { method: "Cash", transactions: 40, amount: 2000 },
];

  // Data for products nearing expiration

  const productsExpirationData = [
    { sku: "12345", productName: "Product A", batchNo: "B123", expDate: "2025-12-31", qty: 100, supplier: "Supplier A" },
    { sku: "67890", productName: "Product B", batchNo: "B456", expDate: "2025-11-30", qty: 50, supplier: "Supplier B" },
    { sku: "11223", productName: "Product C", batchNo: "B789", expDate: "2025-10-15", qty: 200, supplier: "Supplier C" }
  ];

  // Column names for the products table
  const productsExpirationColumns = [
    { name: "SKU", key: "sku", align: "left" },
    { name: "Product Name", key: "productName", align: "left" },
    { name: "Batch No", key: "batchNo", align: "center" },
    { name: "Expiration Date", key: "expDate", align: "center" },
    { name: "Qty (Remaining)", key: "qty", align: "right" },
    { name: "Supplier", key: "supplier", align: "left" }
  ];

// Column configuration for High-Value Customers with dynamic alignment
const highValueCustomerColumns = [
  { name: "Customer Code", key: "customerCode", align: "left" },
  { name: "Customer Name", key: "customerName", align: "left" },
  { name: "Last Purchase Date", key: "lastPurchaseDate", align: "center" },
  { name: "Loyalty Points", key: "loyaltyPoints", align: "center" },
];

// High-value customers data with keys matching the column "key" values
const highValueCustomerData = [
  { customerCode: "C001", customerName: "John Doe", lastPurchaseDate: "2024-01-10", loyaltyPoints: 1200 },
  { customerCode: "C002", customerName: "Jane Smith", lastPurchaseDate: "2024-01-08", loyaltyPoints: 1050 },
  { customerCode: "C003", customerName: "Sam Wilson", lastPurchaseDate: "2024-01-15", loyaltyPoints: 850 },
  { customerCode: "C004", customerName: "Alice Johnson", lastPurchaseDate: "2024-01-12", loyaltyPoints: 1500 },
];

// Column configuration for Sales Processed by Staff with dynamic alignment
const salesProcessedByStaffColumns = [
  { name: "Staff Code", key: "staffCode", align: "left" },
  { name: "Staff Name", key: "staffName", align: "left" },
  { name: "Sales Amount ($)", key: "salesAmount", align: "right" },
  { name: "Number of Sales", key: "numSales", align: "center" },
];

// Sales data processed by staff with keys matching the column "key" values
const salesProcessedByStaffData = [
  { staffCode: "S001", staffName: "Emily Clark", salesAmount: 10000, numSales: 150 },
  { staffCode: "S002", staffName: "Michael Brown", salesAmount: 8500, numSales: 120 },
  { staffCode: "S003", staffName: "Sarah Lee", salesAmount: 12500, numSales: 180 },
  { staffCode: "S004", staffName: "David Johnson", salesAmount: 9000, numSales: 110 },
];


  const paymentBreakdownData = {
    labels: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'],
    datasets: [
      {
        data: [300, 500, 200, 100],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
        hoverBackgroundColor: ['#375abd', '#17a673', '#2c9faf', '#d4a22c'],
        borderWidth: 1,
      },
    ],
  };
  
  const paymentOptions = {
    plugins: {
      legend: {
        position: 'top',
      
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };
  

  return (
    <div className="flex h-screen bg-gray-100">
    
      {/* Side Menu */}
      <div
        className={`bg-sky-900 text-white ${
          isCollapsed ? 'w-20' : 'w-64'
        } flex-shrink-0 transition-all duration-300 shadow-md overflow-y-auto`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 focus:outline-none bg-sky-700 hover:bg-sky-600 w-full text-left"
        >
          <span>{isCollapsed ? '☰' : 'Collapse'}</span>
        </button>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center gap-4 hover:text-blue-400">
                <i className="pi pi-chart-line text-3xl text-white" />
                {!isCollapsed && <span>Sales Overview</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 hover:text-blue-400">
                <i className="pi pi-shopping-cart text-3xl text-white" />
                {!isCollapsed && <span>Inventory</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 hover:text-blue-400">
                <i className="pi pi-clipboard text-3xl text-white" />
                {!isCollapsed && <span>Customer Insights</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-y-auto">
       
       
    {/* Header */}
<div className="flex flex-col md:flex-row md:items-center justify-between bg-white shadow-sm rounded-lg p-6 mb-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
    <p className="text-sm text-gray-500">
      Showing data for{" "}
      <span className="font-semibold">
        {new Date(selectedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })}
      </span>
    </p>
  </div>
  <div className="mt-4 md:mt-0">
    <label
      htmlFor="date-picker"
      className="text-sm font-medium text-gray-700 mr-2"
    >
      Select Date:
    </label>
    <input
      id="date-picker"
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="input input-bordered"
    />
  </div>
</div>


   <TopCards selectedDate={selectedDate}/>

   {/* Chart Section */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
<RevenueChart />
<TableView title="Payment Method Breakdown" data={paymentDataTable} columns={paymentDataTableColumns}/>

{/* <div className="bg-white p-6 rounded-lg shadow-sm">
  <h3 className="text-xl mb-4">Daily Revenue</h3>
  
  <LineChart data={dailyRevenueData} options={optionsDailyRevenue} labels={{ show: false, labelType: "percentage" }}  />
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
  <h3 className="text-xl mb-4">Monthly Revenue</h3>
  <LineChart data={monthlyRevenueData} options={optionsMonthlyRevenue} labels={{ show: true, labelType: "" }} />
</div> */}
</div>
        <div className='grid grid-cols-3 gap-5 my-5'>
            
       
   
   
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Profit Margins</h3>
            <PieChart
          data={profitMarginData}
          options={paymentOptions}
          labels={{ show: true, labelType: "value",prefix:"Rs"  }} 
        />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Inventory Status</h3>
            <DoughnutChart
          data={inventoryData}
          options={paymentOptions}
          labels={{ show: true, labelType: "percentage" }} 
        />
          </div>

<div className='col-span-2'>
          <TableView title="Products nearing expiration" data={productsExpirationData} columns={productsExpirationColumns}/>
          </div>

<div></div>

<div className='col-span-2'>
          <TableView columns={highValueCustomerColumns} data={highValueCustomerData} title="High-Value Customers" />
          </div>


          <div className='col-span-2'>
          <TableView columns={salesProcessedByStaffColumns} data={salesProcessedByStaffData} title="Sales Processed by Staff" />
</div>


          </div>


     

      
    

      </div>
    </div>
  );
}

export default Dashboard;
