import { Doughnut, Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the plugin globally for Chart.js
Chart.register(ChartDataLabels);

const PieChart = ({ data, options, labels = { show: false, labelType: "percentage",prefix:'' } }) => {
    // Extend options with datalabels configuration based on labels prop
    const extendedOptions = {
      ...options,
      plugins: {
        ...options.plugins,
        datalabels: labels.show
          ? {
              color: '#fff',
              font: {
                weight: 'bold',
                size: 14,
              },
              formatter: (value, ctx) => {
                const total = ctx.dataset.data.reduce((sum, val) => sum + val, 0);
                if (labels.labelType === "percentage") {
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                } else if (labels.labelType === "value") {
                  return `${labels.prefix}${value.toLocaleString()}`; // For value-based display (e.g., $200)
                }
                return value;
              },
            }
          : false,
      },
      maintainAspectRatio: true, // Keep aspect ratio to prevent height growth
    };
  
    return (
        <Pie data={data} options={extendedOptions} />
    );
};
  
export default PieChart;
