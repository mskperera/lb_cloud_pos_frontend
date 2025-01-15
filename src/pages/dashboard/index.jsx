import React, { useState } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

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

  // Sample Data for Charts
  const salesData = { labels: ['Jan', 'Feb', 'Mar', 'Apr'], datasets: [{ label: 'Sales', data: [1000, 1500, 1200, 1800], borderColor: 'rgba(75,192,192,1)', fill: false }] };
  const topSellingData = { labels: ['Product A', 'Product B', 'Product C'], datasets: [{ label: 'Sales Quantity', data: [300, 500, 400], backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 159, 64, 0.6)'] }] };
  const inventoryData = { labels: ['In Stock', 'Low Stock', 'Out of Stock'], datasets: [{ data: [300, 50, 20], backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'] }] };
  const financialData = { labels: ['Revenue', 'Expenses'], datasets: [{ data: [4000, 1000], backgroundColor: ['#4CAF50', '#FF5722'] }] };

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
              <i className={`pi pi-chart-line text-3xl text-white`} />
                {!isCollapsed && <span>Sales Overview</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 hover:text-blue-400">
              <i className={`pi pi-shopping-cart text-3xl text-white`} />
                {!isCollapsed && <span>Inventory</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 hover:text-blue-400">
              <i className={`pi pi-clipboard text-3xl text-white`} />
                {!isCollapsed && <span>Orders</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 hover:text-blue-400">
              <i className={`pi pi-graph text-3xl text-white`} />
                {!isCollapsed && <span>Reports</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          {[{ label: 'Today Customers', value: 50 }, { label: 'Cash Outflow', value: '$2,500' }, { label: 'Cash Inflow', value: '$5,000' }, { label: 'Current Revenue', value: '$10,000' }, { label: 'Profit', value: '$7,500' }, { label: 'Total Items Sold', value: 450 }].map((card, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center">
              <h3 className="text-lg font-semibold">{card.label}</h3>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Sales Overview</h3>
            <Line data={salesData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Top-selling Products</h3>
            <Bar data={topSellingData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Inventory Overview</h3>
            <Doughnut data={inventoryData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl mb-4">Financial Overview</h3>
            <Pie data={financialData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
