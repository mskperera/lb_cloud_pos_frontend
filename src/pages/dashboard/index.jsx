import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";
import DoughnutChart from "../../components/dashboard/DoughnutChart";
import PieChart from "../../components/dashboard/PieChart";
import TableView from "../../components/dashboard/TableView";
import RevenueChart from "../../components/revenueChart/RevenueChart";
import "react-datepicker/dist/react-datepicker.css";
import TopCards from "../../components/dashboard/TopCards";
import { getDashboardDetails } from "../../functions/dashboard";
import { getCurrencyInfo } from "../../utils/utils";
import { formatCurrency } from "../../utils/format";
import { getDrpSession } from "../../functions/dropdowns";

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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today

  const [dashboardCards, setDashboardCards] = useState(null);

  // Daily and Monthly Revenue Data
  const [dailyRevenueData, setDailyRevenueData] = useState({
    labels: Array.from({ length: 31 }, (_, i) => i + 1), // Days in the month
    datasets: [
      {
        label: "Daily Revenue",
        data: [
          200, 250, 300, 400, 350, 500, 450, 550, 600, 700, 800, 900, 950, 1000,
          1100, 1200, 1250, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
          2100, 2200, 2300, 2400, 2500, 2600, 2700,
        ], // Daily revenue sample data
        borderColor: "rgba(0, 123, 255, 0.8)", // Blueish color for revenue
        backgroundColor: "rgba(0, 123, 255, 0.3)", // Light blueish background
        tension: 0.4, // Smooth curve for the line
      },
      {
        label: "Daily Profit",
        data: [
          50, 60, 70, 90, 80, 100, 90, 110, 120, 140, 160, 180, 190, 200, 220,
          250, 260, 270, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500,
          520, 540, 560, 580,
        ], // Daily profit sample data
        borderColor: "rgba(40, 167, 69, 0.8)", // Greenish color for profit
        backgroundColor: "rgba(40, 167, 69, 0.3)", // Light greenish background
        tension: 0.4, // Smooth curve for the line
      },
    ],
  });

  const [monthlyRevenueData, setMonthlyRevenueData] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // Monthly labels
    datasets: [
      {
        label: "Monthly Revenue",
        data: [
          6000, 7500, 9000, 12000, 10500, 15000, 13500, 16500, 18000, 21000,
          24000, 27000,
        ], // Monthly revenue sample data
        borderColor: "rgba(0, 123, 255, 0.8)", // Blueish color for revenue
        backgroundColor: "rgba(0, 123, 255, 0.3)", // Light blueish background
        tension: 0.4,
      },
      {
        label: "Monthly Profit",
        data: [
          1000, 1200, 1500, 2000, 1800, 2500, 2200, 2700, 3000, 3500, 4000,
          4500,
        ], // Monthly profit sample data
        borderColor: "rgba(40, 167, 69, 0.8)", // Greenish color for profit
        backgroundColor: "rgba(40, 167, 69, 0.3)", // Light greenish background
        tension: 0.4,
      },
    ],
  });

  const [paymentDataTable, setPaymentDataTable] = useState([]);

  const paymentDataTableColumns = [
    { name: "Payment Method", key: "method", align: "left" },
    { name: "Transactions", key: "transactions", align: "center" },
    {
      name: `Total Amount (${getCurrencyInfo()?.symbol})`,
      key: "amount",
      align: "right",
    },
  ];
  const [selectedSession, setSelectedSession] = useState(null); // Session state
  const [sessionsOptions, setSessionsOptions] = useState([]); // Session options from API

  const loadDashboardDetails = async (sessionId) => {
    try {
      const filteredData = { sessionId };
      const result = await getDashboardDetails(filteredData);
      const records = result.data.results;
      const data = records[0][0];
      setDashboardCards(data);

      const dailyRevenueRecords = records[1]; // Daily revenue data
      const monthlyRevenueRecords = records[2]; // Monthly revenue data

      // Prepare daily data (for days 1 to 31)
      const dailyRevenueData = {
        labels: Array.from({ length: 31 }, (_, i) => i + 1), // Days 1 to 31
        datasets: [
          {
            label: "Daily Revenue",
            data: Array.from({ length: 31 }, (_, i) => {
              const record = dailyRevenueRecords.find(
                (item) => item.Day === i + 1
              );
              return record ? parseFloat(record.DailyRevenue) : 0; // Set to 0 if no data for the day
            }),
            borderColor: "rgba(0, 123, 255, 0.8)", // Blueish color for revenue
            backgroundColor: "rgba(0, 123, 255, 0.8)",
            tension: 0.4,
          },
          {
            label: "Daily Profit",
            data: Array.from({ length: 31 }, (_, i) => {
              const record = dailyRevenueRecords.find(
                (item) => item.Day === i + 1
              );
              return record ? parseFloat(record.DailyProfit) : 0; // Set to 0 if no data for the day
            }),
            borderColor: "rgba(40, 167, 69, 0.8)", // Greenish color for profit
            backgroundColor: "rgba(40, 167, 69, 0.8)", // Light greenish background
            tension: 0.4,
          },
        ],
      };

      // Prepare monthly data (for months 1 to 12)
      const monthlyRevenueData = {
        labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`), // Month 1 to 12
        datasets: [
          {
            label: "Monthly Revenue",
            data: Array.from({ length: 12 }, (_, i) => {
              const record = monthlyRevenueRecords.find(
                (item) => item.Month === i + 1
              );
              return record ? parseFloat(record.MonthlyRevenue) : 0; // Set to 0 if no data for the month
            }),
            borderColor: "rgba(0, 123, 255, 0.8)", // Blueish color for revenue
            backgroundColor: "rgba(0, 123, 255, 0.8)",
            tension: 0.4,
          },
          {
            label: "Monthly Profit",
            data: Array.from({ length: 12 }, (_, i) => {
              const record = monthlyRevenueRecords.find(
                (item) => item.Month === i + 1
              );
              return record ? parseFloat(record.MonthlyProfit) : 0; // Set to 0 if no data for the month
            }),
            borderColor: "rgba(40, 167, 69, 0.8)", // Greenish color for profit
            backgroundColor: "rgba(40, 167, 69, 0.8)", // Light greenish background
            tension: 0.4,
          },
        ],
      };

      // Set the state with the data
      setDailyRevenueData(dailyRevenueData);
      setMonthlyRevenueData(monthlyRevenueData);

      const paymenBreakdowntData = records[3];

      const paymentTableData = [];
      paymenBreakdowntData.forEach((item) => {
        paymentTableData.push({
          method: item.method,
          transactions: item.transactions,
          amount: formatCurrency(item.amount, false),
        });
      });

      setPaymentDataTable(paymentTableData);
    } catch (err) {
      console.log("Error fetching categories:", err);
    }
  };

  // Sample Data for Charts
  const salesData = {
    labels: ["Daily", "Weekly", "Monthly", "Yearly"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 35000, 120000, 1440000],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const refundsData = {
    labels: ["Refunds (Number)", "Refunds (Value)"],
    datasets: [{ data: [15, 3000], backgroundColor: ["#FF5733", "#FFC300"] }],
  };
  const inventoryData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        data: [300, 50, 20],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const revenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // Monthly labels
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
        data: [
          1400, 1800, 2100, 2800, 2450, 3500, 3150, 3850, 4200, 4900, 5600,
          6300,
        ], // Weekly revenue sample data
        borderColor: "rgba(75, 192, 192, 0.8)", // Teal
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        tension: 0.4,
      },
      {
        label: "Monthly Revenue",
        data: [
          6000, 7500, 9000, 12000, 10500, 15000, 13500, 16500, 18000, 21000,
          24000, 27000,
        ], // Monthly revenue sample data
        borderColor: "rgba(255, 206, 86, 0.8)", // Yellow
        backgroundColor: "rgba(255, 206, 86, 0.3)",
        tension: 0.4,
      },
      {
        label: "Yearly Revenue",
        data: [
          100000, 120000, 140000, 160000, 180000, 200000, 220000, 240000,
          260000, 280000, 300000, 320000,
        ], // Yearly revenue sample data
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

  // Data for products nearing expiration

  const productsExpirationData = [
    {
      sku: "12345",
      productName: "Product A",
      batchNo: "B123",
      expDate: "2025-12-31",
      qty: 100,
      supplier: "Supplier A",
    },
    {
      sku: "67890",
      productName: "Product B",
      batchNo: "B456",
      expDate: "2025-11-30",
      qty: 50,
      supplier: "Supplier B",
    },
    {
      sku: "11223",
      productName: "Product C",
      batchNo: "B789",
      expDate: "2025-10-15",
      qty: 200,
      supplier: "Supplier C",
    },
  ];

  // Column names for the products table
  const productsExpirationColumns = [
    { name: "SKU", key: "sku", align: "left" },
    { name: "Product Name", key: "productName", align: "left" },
    { name: "Batch No", key: "batchNo", align: "center" },
    { name: "Expiration Date", key: "expDate", align: "center" },
    { name: "Qty (Remaining)", key: "qty", align: "right" },
    { name: "Supplier", key: "supplier", align: "left" },
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
    {
      customerCode: "C001",
      customerName: "John Doe",
      lastPurchaseDate: "2024-01-10",
      loyaltyPoints: 1200,
    },
    {
      customerCode: "C002",
      customerName: "Jane Smith",
      lastPurchaseDate: "2024-01-08",
      loyaltyPoints: 1050,
    },
    {
      customerCode: "C003",
      customerName: "Sam Wilson",
      lastPurchaseDate: "2024-01-15",
      loyaltyPoints: 850,
    },
    {
      customerCode: "C004",
      customerName: "Alice Johnson",
      lastPurchaseDate: "2024-01-12",
      loyaltyPoints: 1500,
    },
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
    {
      staffCode: "S001",
      staffName: "Emily Clark",
      salesAmount: 10000,
      numSales: 150,
    },
    {
      staffCode: "S002",
      staffName: "Michael Brown",
      salesAmount: 8500,
      numSales: 120,
    },
    {
      staffCode: "S003",
      staffName: "Sarah Lee",
      salesAmount: 12500,
      numSales: 180,
    },
    {
      staffCode: "S004",
      staffName: "David Johnson",
      salesAmount: 9000,
      numSales: 110,
    },
  ];

  const paymentBreakdownData = {
    labels: ["Credit Card", "PayPal", "Bank Transfer", "Cash"],
    datasets: [
      {
        data: [300, 500, 200, 100],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
        hoverBackgroundColor: ["#375abd", "#17a673", "#2c9faf", "#d4a22c"],
        borderWidth: 1,
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

  const loadDrpSession = async () => {
    const objArr = await getDrpSession("desc");
    setSessionsOptions(objArr.data.results[0]);
  };

  useEffect(() => {
    loadDrpSession();
  }, []);

  useEffect(() => {
    if (sessionsOptions.length > 0) {
      const defaultSession = sessionsOptions[0];
      setSelectedSession(defaultSession.id);
      loadDashboardDetails(defaultSession.id);
    }
  }, [sessionsOptions]);

  const handleSessionChange = (e) => {
    const selectedSessionId = e.target.value;
    console.log("handleSessionChange", selectedSessionId);
    setSelectedSession(selectedSessionId);
    loadDashboardDetails(selectedSessionId);
  };

  // const profitMarginData = {
  //   labels: ['Gross Revenue', 'Net Revenue'],
  //   datasets: [{ data: [1440000, 1200000], backgroundColor: ['#4CAF50', '#36A2EB'] }],
  // };

  const [profitMarginData, setProfitMarginData] = useState({
    labels: ["Gross Revenue", "Net Revenue"],
    datasets: [
      {
        data: [1440000, 1200000], // Placeholder values, will be updated
        backgroundColor: ["#4CAF50", "#36A2EB"],
      },
    ],
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <div
        className={` bg-sky-900 text-white ${
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
      </div> */}

      <div className="flex-1 ml-5 p-4 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white shadow-sm rounded-lg p-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
            <p className="text-md text-gray-500 mt-2">
              Showing data for{" "}
              <span className="font-semibold">
                {selectedSession && sessionsOptions.length > 0
                  ? sessionsOptions.find((o) => o.id == selectedSession)
                      .displayName
                  : "Select a Session"}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <label
              htmlFor="session-dropdown"
              className="text-md font-medium text-gray-700 mr-2"
            >
              Select Session:
            </label>
            <select
              id="session-dropdown"
              value={selectedSession}
              onChange={handleSessionChange}
              className="input input-bordered"
            >
              {/* <option value="" disabled>Select a session</option> */}
              {sessionsOptions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TopCards data={dashboardCards} />

        {/* Chart Section */}
      
            <RevenueChart
              monthlyRevenueData={monthlyRevenueData}
              dailyRevenueData={dailyRevenueData}
            />
      
          {/* <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Profit Margins</h3>
            <PieChart
          data={profitMarginData}
          options={paymentOptions}
          labels={{ show: true, labelType: "value",prefix:"Rs"  }} 
        />
          </div> */}

          {/* <div className="bg-white p-6 rounded-lg shadow-sm">
  <h3 className="text-xl mb-4">Daily Revenue</h3>
  
  <LineChart data={dailyRevenueData} options={optionsDailyRevenue} labels={{ show: false, labelType: "percentage" }}  />
</div>
<div className="bg-white p-6 rounded-lg shadow-sm">
  <h3 className="text-xl mb-4">Monthly Revenue</h3>
  <LineChart data={monthlyRevenueData} options={optionsMonthlyRevenue} labels={{ show: true, labelType: "" }} />
</div> */}
        
        <div className="grid grid-cols-3 gap-5 my-5">
          <div className="col-span-2">
            <TableView
              title="Payment Method Breakdown"
              data={paymentDataTable}
              columns={paymentDataTableColumns}
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
          <div className="col-span-3">
            <TableView
              title="Products nearing expiration"
              data={productsExpirationData}
              columns={productsExpirationColumns}
            />
          </div>
          
      

          <div></div>

          <div className="col-span-2">
            <TableView
              columns={highValueCustomerColumns}
              data={highValueCustomerData}
              title="High-Value Customers"
            />
          </div>

          <div className="col-span-2">
            <TableView
              columns={salesProcessedByStaffColumns}
              data={salesProcessedByStaffData}
              title="Sales Processed by Staff"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
