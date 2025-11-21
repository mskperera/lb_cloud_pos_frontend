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
import {
  formatCurrency,
  formatDate,
  formatUtcToLocal,
} from "../../utils/format";
import { getDrpSession, getStoresDrp } from "../../functions/dropdowns";
import LowStockProducts from "../../components/lowStockProducts/LowStockProducts";
import DatePicker from "react-datepicker"; // Install via npm if needed: npm install react-datepicker
import LineChart from "../../components/dashboard/LineChart";
import { FaPalette } from "react-icons/fa";
import moment from "moment";
import LoadingSpinner from '../../components/LoadingSpinner';

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

// Mock data for demo; replace with real API fetches
const mockSessions = [
  { id: "session1", displayName: "Day-End Morning Shift" },
  { id: "session2", displayName: "Day-End Evening Shift" },
];

const mockDailySalesData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    { label: "Sales", data: [1200, 1900, 3000, 500, 2000] },
    { label: "Transactions", data: [65, 59, 80, 81, 56] },
  ],
};

const mockTransactions = [
  { id: 1, date: "2025-11-15", amount: 150, type: "Cash" },
  { id: 2, date: "2025-11-14", amount: 200, type: "Credit" },
];

const mockInventory = [
  { item: "Product A", stock: 50, turnover: "High" },
  { item: "Product B", stock: 10, turnover: "Low" },
];

function POSDashboard({ fetchData }) {
  // Assume fetchData is a prop for API calls
  const [selectedSession, setSelectedSession] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState({
    totalSales: 0,
    avgTransaction: 0,
    totalTransactions: 0,
    inventoryTurnover: 0,
    lowStockItems: 0,
    customerCount: 0,
    salesData: mockDailySalesData,
    transactions: mockTransactions,
    inventory: mockInventory,
  });

  useEffect(() => {
    // Simulate fetching filtered data based on session/date
    // In real app: Call API with params like { session: selectedSession, startDate, endDate }
    const data = fetchData({ session: selectedSession, startDate, endDate }); // Mocked
    setFilteredData({
      totalSales: 5000, // Example calculations
      avgTransaction: 100,
      totalTransactions: 50,
      inventoryTurnover: 4.5,
      lowStockItems: 5,
      customerCount: 200,
      salesData: mockDailySalesData, // Filtered chart data
      transactions: mockTransactions.filter(
        (tx) => /* date filter logic */ true
      ),
      inventory: mockInventory.filter((item) => /* session filter */ true),
    });
  }, [selectedSession, startDate, endDate, fetchData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sales & Transactions Trend" },
    },
    scales: {
      y: {
        title: { display: true, text: `Value (${getCurrencyInfo().symbol})` },
      },
    },
  };

  return (
    <div className="bg-gray-100 p-6">
      {/* Filters Section */}
      <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold">POS Dashboard</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Session
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Sessions</option>
              {mockSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.displayName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(filteredData.totalSales)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Avg. Transaction</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(filteredData.avgTransaction)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-2xl font-bold">{filteredData.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Inventory Turnover</h3>
          <p className="text-2xl font-bold">{filteredData.inventoryTurnover}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Low Stock Items</h3>
          <p className="text-2xl font-bold text-red-600">
            {filteredData.lowStockItems}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Customer Count</h3>
          <p className="text-2xl font-bold">{filteredData.customerCount}</p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-bold mb-4">Sales & Transactions Trend</h3>
        <div className="h-80">
          <LineChart data={filteredData.salesData} options={chartOptions} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Amount</th>
              <th className="px-4 py-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-4 py-2">{tx.id}</td>
                <td className="px-4 py-2">{tx.date}</td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-2">{tx.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inventory Overview */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4">Inventory Summary</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-right">Stock Level</th>
              <th className="px-4 py-2 text-left">Turnover</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.inventory.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{item.item}</td>
                <td className="px-4 py-2 text-right">{item.stock}</td>
                <td className="px-4 py-2">{item.turnover}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar state
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today

  const [dashboardCards, setDashboardCards] = useState(null);

  // Daily and Monthly Revenue Data
  const [dailyRevenueData, setDailyRevenueData] = useState(null);

  const [monthlyRevenueData, setMonthlyRevenueData] = useState(null);

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
    const [selectedSessionName, setSelectedSessionName] = useState(null); 
  const [sessionsOptions, setSessionsOptions] = useState([]); // Session options from API

  const [selectedStore, setSelectedStore] = useState(null);
  const [storeOptions, setStoreOptions] = useState([]); // Session options from API
  const [showCharts, setShowCharts] = useState(false);

  const [lowStockProductsData, setLowStockProductsData] = useState([
    // {
    //   sku: "12345",
    //   productName: "Product A",
    //   qty: 100,
    //   expQty:0,
    //   supplier: "Supplier A",
    // },
    // {
    //   sku: "67890",
    //   productName: "Product B",
    //   qty: 50,
    //   expQty: 0,
    //   supplier: "Supplier B",
    // },
    // {
    //   sku: "11223",
    //   productName: "Product C",
    //   qty: 200,
    //   expQty: 2,
    //   supplier: "Supplier C",
    // },
  ]);

  const lowStockProductsColumns = [
    { name: "SKU", key: "sku", align: "left" },
    { name: "Product Name", key: "productName", align: "left" },
    { name: "Qty (Remaining)", key: "qty", align: "right" },
    { name: "Qty (Expired)", key: "qty", align: "right" },
    { name: "Supplier", key: "supplier", align: "left" },
    { name: "Reorder Level", key: "reorderLevel", align: "left" },
  ];

  // Data for products nearing expiration

  const [productsExpirationData, setProductsExpirationData] = useState([
    // {
    //   sku: "12345",
    //   productName: "Product A",
    //   batchNo: "B123",
    //   expDate: "2025-12-31",
    //   qty: 100,
    //   supplier: "Supplier A",
    // },
    // {
    //   sku: "67890",
    //   productName: "Product B",
    //   batchNo: "B456",
    //   expDate: "2025-11-30",
    //   qty: 50,
    //   supplier: "Supplier B",
    // },
    // {
    //   sku: "11223",
    //   productName: "Product C",
    //   batchNo: "B789",
    //   expDate: "2025-10-15",
    //   qty: 200,
    //   supplier: "Supplier C",
    // },
  ]);

  // Column definitions
  const productsExpirationColumns = [
    { name: "SKU", key: "sku", align: "left" },
    { name: "Product Name", key: "productName", align: "left" },
    { name: "Batch No", key: "batchNo", align: "center" },
    { name: "Expiration Date", key: "expDate", align: "center" },
    { name: "Qty (Remaining)", key: "qty", align: "right" },
    { name: "Supplier", key: "supplier", align: "left" },
  ];

  // Load session data
  const loadDrpSession = async () => {
    const objArr = await getDrpSession("desc", selectedStore);
    setSessionsOptions(objArr.data.results[0]);
  };

  // Load session data
  const loadDrpStore = async () => {
    // const objArr = await getStoresDrp();
    const stores = JSON.parse(localStorage.getItem("stores"));
    const storesDrpArr = [];
    stores.map((s) => {
      storesDrpArr.push({ id: s.storeId, displayName: s.storeName });
    });
    console.log("storesoooo", storesDrpArr);
    setStoreOptions(storesDrpArr);
  };

  // Load store from localStorage
  const loadStoreFromLocalStorage = () => {
    const store = JSON.parse(localStorage.getItem("stores"))[0];
    console.log("store", store);
    if (store) {
      setSelectedStore(store.storeId);
    }
  };

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
            label: "Revenue",
            data: Array.from({ length: 31 }, (_, i) => {
              const record = dailyRevenueRecords.find(
                (item) => item.Day === i + 1
              );
              return record ? parseFloat(record.dailyNetRevenue) : 0; // Set to 0 if no data for the day
            }),
            borderColor: "rgba(0, 123, 255, 0.8)", // Blue
            backgroundColor: "rgba(0, 123, 255, 0.3)",
            tension: 0.4,
          },
          {
            label: "Profit",
            data: Array.from({ length: 31 }, (_, i) => {
              const record = dailyRevenueRecords.find(
                (item) => item.Day === i + 1
              );
              return record ? parseFloat(record.dailyGrossProfit) : 0; // Set to 0 if no data for the day
            }),
            borderColor: "rgba(40, 167, 69, 0.8)", // Green
            backgroundColor: "rgba(40, 167, 69, 0.3)",
            tension: 0.4,
          },
        ],
      };

      // Prepare monthly data (for months 1 to 12)
      const monthNames = [
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
      ];

      const monthlyRevenueData = {
        labels: monthNames, // Use month abbreviations
        datasets: [
          {
            label: "Revenue",
            data: Array.from({ length: 12 }, (_, i) => {
              const record = monthlyRevenueRecords.find(
                (item) => item.Month === i + 1
              );
              return record ? parseFloat(record.monthlyNetRevenue) : 0; // Set to 0 if no data for the month
            }),
            borderColor: "rgba(0, 123, 255, 0.8)", // Blue
            backgroundColor: "rgba(0, 123, 255, 0.3)",
            tension: 0.4,
          },
          {
            label: "Profit",
            data: Array.from({ length: 12 }, (_, i) => {
              const record = monthlyRevenueRecords.find(
                (item) => item.Month === i + 1
              );
              return record ? parseFloat(record.monthlyGrossProfit) : 0; // Set to 0 if no data for the month
            }),
            borderColor: "rgba(40, 167, 69, 0.8)", // Green
            backgroundColor: "rgba(40, 167, 69, 0.3)",
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

      //Low Stock Products
      const lowStockProducts = records[4];

      // Process low stock products data
      const lowStockProductsData = lowStockProducts.map((item) => ({
        sku: item.sku,
        productName: item.productName,
        qty: item.qty,
        expQty: item.expQty || 0,
        supplier: item.supplier,
        reorderLevel: item.reorderLevel,
      }));

      // Set state with the processed data
      setLowStockProductsData(lowStockProductsData);

      const productsNearingExpiration = records[5];
      const productsExpirationData = productsNearingExpiration.map((item) => ({
        sku: item.sku,
        productName: item.productName,
        batchNo: item.batchNo,
        expDate: formatUtcToLocal(item.expDate, true),
        qty: item.qty,
        supplier: item.supplier,
      }));

      setProductsExpirationData(productsExpirationData);

      const inventoryRecords = records[6];
      // Mapping the result to the chart data format

      console.log("inventoryRecords", inventoryRecords);
      const {
        inStock,
        lowStock,
        outOfStock,
        expiredStock,
        expiringSoon,
        nonExpiredSafeStock,
      } = inventoryRecords[0]; // Destructure counts
      const healthyStock = inStock - lowStock;

      setInventoryStatus({
        healthyStock,
        lowStock,
        outOfStock,
        expiredStock,
        expiringSoon,
        nonExpiredSafeStock,
      });

      setInventoryData({
        labels: ["Healthy Stock", "Low Stock", "Out of Stock"],
        datasets: [
          {
            data: [healthyStock, lowStock, outOfStock],
            backgroundColor: ["rgba(40, 167, 69, 0.8)", "#FFA239", "#FF6384"],
          },
        ],
      });

      if (nonExpiredSafeStock === 0) {
        setInventoryExpirationData({
          labels: ["No Expiring Stock"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#EEEEEE"],
            },
          ],
        });
      } else {
        setInventoryExpirationData({
          labels: ["Non-Expired Stock", "Expiring Soon", "Expired Stock"],
          datasets: [
            {
              data: [nonExpiredSafeStock, expiringSoon, expiredStock],
              backgroundColor: ["rgba(40, 167, 69, 0.8)", "#FFA239", "#FF6384"],
            },
          ],
        });
      }

      // setInventoryData({
      //   labels: ["In Stock", "Expired Stock", "Low Stock", "Out of Stock"],
      //   datasets: [
      //     {
      //       data: [inStock, expiredStock, lowStock, outOfStock], // Use the counts from your query
      //       backgroundColor: [
      //         "rgba(40, 167, 69, 0.8)",  // In Stock (Blue)
      //         "#FFCE56",  // Expired Stock (Yellow)
      //         "#FF6F61",  // Low Stock (Pink)
      //         "#FF6384",  // Out of Stock (Red)
      //       ],
      //     },
      //   ],
      // });

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

  const [inventoryStatus, setInventoryStatus] = useState(null);

  const [inventoryData, setInventoryData] = useState(null);

  const [inventoryExpirationData, setInventoryExpirationData] = useState(null);

  const inventoryOptions = {
    plugins: {
      legend: {
        position: "top",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  // The columns structure for the table
  const highValueCustomerColumns = [
    { name: "Customer Code", key: "customerCode", align: "left" },
    { name: "Customer Name", key: "customerName", align: "left" },
    { name: "Last Purchase Date", key: "lastPurchaseDate", align: "center" },
    { name: "Number of Purchases", key: "numberOfPurchases", align: "center" },
    { name: "Average Order Value", key: "averageOrderValue", align: "center" },
    { name: "Total Spend", key: "totalSpend", align: "center" },
    { name: "Number of Returns", key: "numberOfReturns", align: "center" },
    { name: "Total Refund Amount", key: "totalRefundAmount", align: "center" },
    { name: "Purchase Frequency", key: "purchaseFrequency", align: "center" },
    // { name: "Most Frequent Items", key: "mostFrequentItems", align: "left" },
    {
      name: "Most Used Payment Method",
      key: "mostUsedPaymentMethod",
      align: "left",
    },
  ];




  useEffect(() => {
    if (sessionsOptions.length > 0) {
      const defaultSession = sessionsOptions[0];
      // console.log('sessiondetails:',defaultSession.displayName)
      setSelectedSession(defaultSession.id);
      setSelectedSessionName(defaultSession.displayName);
      loadDashboardDetails(defaultSession.id);
    }
  }, [sessionsOptions]);

  // Handle session change
  const handleSessionChange = (e) => {
    const selectedSessionId = e.target.value;
    setSelectedSession(selectedSessionId);
  };

  // Handle store change
  const handleStoreChange = (e) => {
    const selectedStoreId = e.target.value;
    setSelectedStore(selectedStoreId);
  };

  useEffect(() => {
    loadDrpStore();
  }, []);

  useEffect(() => {
    loadStoreFromLocalStorage();
  }, []);

  useEffect(() => {
    loadDrpSession();
    //loadStoreFromLocalStorage();
  }, [selectedStore]);

  useEffect(() => {
    if (sessionsOptions.length > 0 && selectedStore) {
      loadDashboardDetails(selectedSession);
      setShowCharts(true);
    } else {
      setShowCharts(false);
    }
  }, [sessionsOptions, selectedStore, selectedSession]);

  return (
    <div className="flex h-screen ">
      <div className="flex-1 ml-5 p-4 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-lg p-6 mb-6">
          <div className="flex gap-1 items-center">
            <FaPalette className="text-2xl font-bold text-gray-600" />{" "}
            <h1 className="text-2xl font-bold text-gray-600">Dashboard</h1>
            {/* <p className="text-md text-gray-500 mt-2">
              Showing data for{" "}
              <span className="font-semibold">
                {selectedSession && sessionsOptions.length > 0
                  ? sessionsOptions.find((o) => o.id == selectedSession)
                      .displayName
                  : "Select a Session"}
              </span>
            </p> */}
          </div>

          <div className="flex justify-start gap-10">
            {/* <div className="mt-4 md:mt-0">
            <label
              htmlFor="session-dropdown"
              className="text-md font-medium text-gray-700 mr-2"
            >
              Store :
            </label>
            <select
              id="session-dropdown"
              value={selectedStore || "All"}
              onChange={handleStoreChange}
              className="input input-bordered"
            >
              {storeOptions.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.displayName}
                </option>
              ))}
            </select>
          </div> */}

            <div className="flex justify-start items-center gap-1 mt-4 md:mt-0">
              <label
                htmlFor="session-dropdown"
                className="text-md font-medium text-gray-700 mr-2"
              >
                Session:
              </label>
              <p>{selectedSessionName}</p>
              {/* <select
                id="session-dropdown"
                value={selectedSession}
                onChange={handleSessionChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {sessionsOptions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.displayName}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        </div>

        {showCharts ? (
          <>
            <TopCards data={dashboardCards} />

            <div className="grid grid-cols-2 gap-2">
          {dailyRevenueData ?   <RevenueChart
                monthlyRevenueData={monthlyRevenueData}
                dailyRevenueData={dailyRevenueData}
                activeTab="daily"
                title="Daily Revenue & Profit"
                subTitle={`For ${moment().format("MMMM")}`}
              />:null}

           {monthlyRevenueData ?  <RevenueChart
                monthlyRevenueData={monthlyRevenueData}
                dailyRevenueData={dailyRevenueData}
                activeTab="monthly"
                title="Monthly Revenue & Profit"
                subTitle={`For ${moment().format("YYYY")}`}
              />:null}
            </div>

            {/* <div className="grid grid-cols-3 gap-5 my-5">
          <div className="col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl mb-4">Payment Method Breakdown</h3>
            <TableView
              data={paymentDataTable}
              columns={paymentDataTableColumns}
            />
          </div>
          </div>
          </div> */}

            <div className="grid grid-cols-2 gap-2 my-5">


              <div className="grid grid-cols-2 gap-5 my-5 bg-white p-6 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-xl mb-4">In-Stock vs Out-of-Stock</h3>
               {inventoryData ?    <DoughnutChart
                    data={inventoryData}
                    options={inventoryOptions}
                    labels={{ show: true, labelType: "percentage" }}
                  />:
                    <p><LoadingSpinner loadingMessage="Loading..." /></p>
                    }
                </div>

                <div className=" flex flex-col gap-2 justify-center">
                  {inventoryStatus ? (
                    <>
                      <div className="border-green-300 border rounded-lg bg-green-50 p-4 flex justify-between px-4 hover:bg-green-100 hover:cursor-pointer hover:text-green-700">
                        <p className="text-gray-700">Healthy Stock</p>
                        <p className="font-semibold text-green-700">
                          {inventoryStatus?.healthyStock}
                        </p>
                      </div>

                      <div className="border-[#FFA239] border rounded-lg bg-orange-50 p-4 flex justify-between px-4 hover:bg-orange-100 hover:cursor-pointer hover:text-orange-700">
                        <p className="text-orange-700">Low Stock</p>
                        <p className="font-semibold text-orange-700">
                          {inventoryStatus?.lowStock}
                        </p>
                      </div>

                      <div className="border-red-300 border rounded-lg bg-red-50 p-4 flex justify-between px-4 hover:bg-red-100 hover:cursor-pointer hover:text-red-700">
                        <p className="text-red-700">Out Stock</p>
                        <p className="font-semibold text-red-700">
                          {inventoryStatus?.outOfStock}
                        </p>
                      </div>
                    </>
                  ) : (
                <p><LoadingSpinner loadingMessage="Loading..." /></p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 my-5 bg-white p-6 rounded-lg shadow-sm">
                <div>
                  <h3 className="text-xl mb-4">Inventory Expiry Status</h3>
                {inventoryExpirationData ?  <DoughnutChart
                    data={inventoryExpirationData}
                    options={inventoryOptions}
                    labels={{ show: true, labelType: "percentage" }}
                  />:
                    <p><LoadingSpinner loadingMessage="Loading..." /></p>
                    }
                </div>

                <div className=" flex flex-col gap-2 justify-center">
                {inventoryStatus ?
               <>
                  <div className="border-green-300 border rounded-lg bg-green-50 p-4 flex justify-between px-4 hover:bg-green-100 hover:cursor-pointer hover:text-green-700">
                    <p className="text-gray-700">SafeStock</p>
                    <p className="font-semibold text-green-700">
                      {inventoryStatus?.nonExpiredSafeStock}
                    </p>
                  </div>

                  <div className="border-[#FFA239] border rounded-lg bg-orange-50 p-4 flex justify-between px-4 hover:bg-orange-100 hover:cursor-pointer hover:text-orange-700">
                    <p className="text-orange-700">Expiring Soon</p>
                    <p className="font-semibold text-orange-700">
                      {inventoryStatus?.expiringSoon}
                    </p>
                  </div>

                  <div className="border-red-300 border rounded-lg bg-red-50 p-4 flex justify-between px-4 hover:bg-red-100 hover:cursor-pointer hover:text-red-700">
                    <p className="text-red-700">Expired Stock</p>
                    <p className="font-semibold text-red-700">
                      {inventoryStatus?.expiredStock}
                    </p>
                  </div>
                  </>:
                  <p><LoadingSpinner loadingMessage="Loading..." /></p>
                  }

                </div>
              </div>
            </div>




  
          </>
        ) : (
          <div class="flex justify-center items-center h-screen bg-gray-100 rounded-lg shadow-sm">
            <span class="text-4xl text-gray-500 mr-3">🚫</span>
            <p class="text-xl text-gray-600 font-medium">No data found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
