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
import { formatCurrency, formatDate, formatUtcToLocal } from "../../utils/format";
import { getDrpSession, getStoresDrp } from "../../functions/dropdowns";
import LowStockProducts from "../../components/lowStockProducts/LowStockProducts";

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
        label: "Gross Revenue",
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
        label: "Net Revenue",
        data: [
          50, 60, 70, 90, 80, 100, 90, 110, 120, 140, 160, 180, 190, 200, 220,
          250, 260, 270, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500,
          520, 540, 560, 580,
        ], // Net Revenue sample data
        borderColor: "rgba(40, 167, 69, 0.8)", // Greenish color for profit
        backgroundColor: "rgba(40, 167, 69, 0.3)", // Light greenish background
        tension: 0.4, // Smooth curve for the line
      },
      {
        label: "Gross Profit",
        data: [
          50, 60, 70, 90, 80, 100, 90, 110, 120, 140, 160, 180, 190, 200, 220,
          250, 260, 270, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500,
          520, 540, 560, 580,
        ], // Gross Profit sample data
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
        label: "Gross Revenue",
        data: [
          6000, 7500, 9000, 12000, 10500, 15000, 13500, 16500, 18000, 21000,
          24000, 27000,
        ], // Gross Revenue sample data
        borderColor: "rgba(0, 123, 255, 0.8)", // Blueish color for revenue
        backgroundColor: "rgba(0, 123, 255, 0.3)", // Light blueish background
        tension: 0.4,
      },
      {
        label: "Net Revenue",
        data: [
          1000, 1200, 1500, 2000, 1800, 2500, 2200, 2700, 3000, 3500, 4000,
          4500,
        ], // Net Revenue sample data
        borderColor: "rgba(40, 167, 69, 0.8)", // Greenish color for profit
        backgroundColor: "rgba(40, 167, 69, 0.3)", // Light greenish background
        tension: 0.4,
      },
      {
        label: "Gross Profit",
        data: [
          1000, 1200, 1500, 2000, 1800, 2500, 2200, 2700, 3000, 3500, 4000,
          4500,
        ], // Gross Profit sample data
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

  const [selectedStore, setSelectedStore] = useState(null);
  const [storeOptions, setStoreOptions] = useState([]); // Session options from API
  const [showCharts, setShowCharts] = useState(false);
  

  const [lowStockProductsData,setLowStockProductsData] =useState([
    {
      sku: "12345",
      productName: "Product A",
      qty: 100,
      expQty:0,
      supplier: "Supplier A",
    },
    {
      sku: "67890",
      productName: "Product B",
      qty: 50,
      expQty: 0,
      supplier: "Supplier B",
    },
    {
      sku: "11223",
      productName: "Product C",
      qty: 200,
      expQty: 2,
      supplier: "Supplier C",
    },
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

  const [productsExpirationData,setProductsExpirationData] = useState([
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
    const objArr = await getDrpSession("desc",selectedStore);
    setSessionsOptions(objArr.data.results[0]);
  };

    // Load session data
    const loadDrpStore= async () => {
      const objArr = await getStoresDrp();
      setStoreOptions(objArr.data.results[0]);
    };

  // Load store from localStorage
  const loadStoreFromLocalStorage = () => {
    const store = JSON.parse(localStorage.getItem('stores'))[0];
    console.log('store',store)
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
            label: "Gross Revenue",
            data: Array.from({ length: 31 }, (_, i) => {
              const record = dailyRevenueRecords.find(
                (item) => item.Day === i + 1
              );
              return record ? parseFloat(record.dailyGrossRevenue) : 0; // Set to 0 if no data for the day
            }),
      borderColor: "rgba(0, 123, 255, 0.8)", // Blue
      backgroundColor: "rgba(0, 123, 255, 0.3)",
            tension: 0.4,
          },
            {
            label: "Net Revenue",
            data: Array.from({ length: 31 }, (_, i) => {
              const record = dailyRevenueRecords.find(
                (item) => item.Day === i + 1
              );
              return record ? parseFloat(record.dailyNetRevenue) : 0; // Set to 0 if no data for the day
            }),
  borderColor: "rgba(255, 193, 7, 0.8)", // Yellow
      backgroundColor: "rgba(255, 193, 7, 0.3)",
            tension: 0.4,
          },
          {
            label: "Gross Profit",
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
      const monthlyRevenueData = {
        labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`), // Month 1 to 12
        datasets: [
          {
            label: "Gross Revenue",
            data: Array.from({ length: 12 }, (_, i) => {
              const record = monthlyRevenueRecords.find(
                (item) => item.Month === i + 1
              );
              return record ? parseFloat(record.monthlyGrossRevenue) : 0; // Set to 0 if no data for the month
            }),
       borderColor: "rgba(0, 123, 255, 0.8)", // Blue
      backgroundColor: "rgba(0, 123, 255, 0.3)",
            tension: 0.4,
          },
               {
            label: "Neet Revenue",
            data: Array.from({ length: 12 }, (_, i) => {
              const record = monthlyRevenueRecords.find(
                (item) => item.Month === i + 1
              );
              return record ? parseFloat(record.monthlyNetRevenue) : 0; // Set to 0 if no data for the month
            }),
    borderColor: "rgba(255, 193, 7, 0.8)", // Yellow
      backgroundColor: "rgba(255, 193, 7, 0.3)",
            tension: 0.4,
          },
          {
            label: "Gross Profit",
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
  reorderLevel:item.reorderLevel
}));



// Set state with the processed data
setLowStockProductsData(lowStockProductsData);


      const productsNearingExpiration=records[5];
const productsExpirationData = productsNearingExpiration.map((item) => ({
  sku: item.sku,
  productName: item.productName,
  batchNo: item.batchNo,
  expDate:formatUtcToLocal(item.expDate,true),
  qty: item.qty,
  supplier: item.supplier,
}));

setProductsExpirationData(productsExpirationData);


const inventoryRecords=records[6];
// Mapping the result to the chart data format
    
console.log('inventoryRecords',inventoryRecords);
const { inStock, lowStock, outOfStock,expiredStock } = inventoryRecords[0]; // Destructure counts


setInventoryData({
  labels: ["In Stock", "Expired Stock", "Low Stock", "Out of Stock"],
  datasets: [
    {
      data: [inStock, expiredStock, lowStock, outOfStock], // Use the counts from your query
      backgroundColor: [
        "#36A2EB",  // In Stock (Blue)
        "#FFCE56",  // Expired Stock (Yellow)
        "#FF6384",  // Low Stock (Pink)
        "#FF6F61",  // Out of Stock (Red)
      ],
    },
  ],
});



const highValuedCustomerRecords=records[7];


// Mapping the highValuedCustomerRecords to the required format with all the columns from the query
const highValueCustomerData = highValuedCustomerRecords.map((customer) => ({
  customerCode: customer.customerCode,
  customerName: customer.customerName,
  lastPurchaseDate:formatUtcToLocal(customer.lastPurchaseDate),  // The most recent purchase date
  numberOfPurchases: customer.NumberOfPurchases, // Total number of purchases made by the customer
  averageOrderValue: customer.averageOrderValue, // Average amount spent per order
  totalSpend:formatCurrency(customer.totalSpend,false), // Total spend of the customer
  numberOfReturns: customer.numberOfReturns, // Number of returns made by the customer
  totalRefundAmount: customer.totalRefundAmount, // Total refund amount based on returns
  purchaseFrequency: customer.purchaseFrequency, // Purchase frequency (Weekly/Monthly)
  //mostFrequentItems: customer.mostFrequentItems, // Most frequently purchased items
  mostUsedPaymentMethod: customer.mostUsedPaymentMethod, // Most used payment method
}));


console.log('High Value Customer Data:', highValueCustomerData);
setHighValueCustomerData(highValueCustomerData);



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



  const [inventoryData,setInventoryData] =useState({
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        data: [300, 50, 20],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  });

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
  { name: "Most Used Payment Method", key: "mostUsedPaymentMethod", align: "left" },
];

  // High-value customers data with keys matching the column "key" values
  const [highValueCustomerData,setHighValueCustomerData] =useState([]);

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



  useEffect(() => {
    if (sessionsOptions.length > 0) {
      const defaultSession = sessionsOptions[0];
      setSelectedSession(defaultSession.id);
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
    }
    else{
      setShowCharts(false);
    }
  }, [sessionsOptions, selectedStore, selectedSession]);

  return (
    <div className="flex h-screen bg-gray-100">

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

          <div className="flex justify-start gap-10">
       
            <div className="mt-4 md:mt-0">
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
                {/* <option value="All">All Stores</option> */}
              {storeOptions.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.displayName}
                </option>
              ))}
            </select>
          </div>



          <div className="mt-4 md:mt-0">
            <label
              htmlFor="session-dropdown"
              className="text-md font-medium text-gray-700 mr-2"
            >
             Session:
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

        </div>

      
    {showCharts ?  <>
      <TopCards data={dashboardCards} />

            <RevenueChart
              monthlyRevenueData={monthlyRevenueData}
              dailyRevenueData={dailyRevenueData}
            />
      

      <div className="grid grid-cols-3 gap-5 my-5">
          <div className="col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl mb-4">Payment Method Breakdown</h3>
            <TableView
              data={paymentDataTable}
              columns={paymentDataTableColumns}
            />
          </div>
          </div>
          </div>

 

          <div className="grid grid-cols-3 gap-5 my-5">
          <div className="col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Low Stock Products</h3>
<TableView
             // title="Low Stock Products"
              data={lowStockProductsData}
              columns={lowStockProductsColumns}
            />
      </div>
      </div>


   

      <div className="bg-white p-6 rounded-lg shadow-sm">
      
            <h3 className="text-xl mb-4">Inventory Status</h3>
            <DoughnutChart
              data={inventoryData}
              options={inventoryOptions}
              labels={{ show: true, labelType: "percentage" }}
            />
          </div>
</div>



          {/* <LowStockProducts  lowStockProductsData={lowStockProductsData}
              lowStockProductsColumns={lowStockProductsColumns}/>
            */}


      {/* <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <PieChart
            data={profitMarginData}
            options={paymentOptions}
            labels={{ show: true, labelType: "value", prefix: "Rs" }}
          />
        </div> */}

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
          <div className="col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl mb-4">Products Nearing Expiration</h3>
            <TableView
             // title="Products nearing expiration"
              data={productsExpirationData}
              columns={productsExpirationColumns}
            />
            </div>
          </div>

     </div>
        
          <div className="grid grid-cols-4 gap-5 my-5">
          <div className="col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl mb-4">High-Value Customers</h3>
            <TableView
              columns={highValueCustomerColumns}
              data={highValueCustomerData}
              title="High-Value Customers"
            />
             </div>
             </div>
         

             {/* <div className="col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl mb-4">Sales Processed by Staff</h3>
            <TableView
              columns={salesProcessedByStaffColumns}
              data={salesProcessedByStaffData}
              title="Sales Processed by Staff"
            />
          </div>
        </div> */}
        </div>
        
        </>:<div class="flex justify-center items-center h-screen bg-gray-100 rounded-lg shadow-sm">
  <span class="text-4xl text-gray-500 mr-3">🚫</span>
  <p class="text-xl text-gray-600 font-medium">No data found</p>
</div>

}
      </div>
    </div>
  );
}

export default Dashboard;
