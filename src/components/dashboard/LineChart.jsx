import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the plugin globally for Chart.js
Chart.register(ChartDataLabels);

const LineChart = ({ data,titleVisible=true, options, labels = { show: false, labelType: "percentage",color:null} }) => {
  // Extend options with datalabels configuration based on labels prop
  const extendedOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        display: titleVisible,
      },
      datalabels: labels.show
        ? {
            color: labels.color ? labels.color : 'black',
            font: {
             // weight: 'bold',
              size: 12,
            },
            formatter: (value, ctx) => {
              const total = ctx.dataset.data.reduce((sum, val) => sum + val, 0);
              if (labels.labelType === "percentage") {
                const percentage = ((value / total) * 100).toFixed(1);
                return `${percentage}%`;
              } else if (labels.labelType === "value") {
                return `${value.toLocaleString()}`; // For value-based display (e.g., $200)
              }
              return value;
            },
          }
        : false,
    },
    maintainAspectRatio: true, // Keep aspect ratio to prevent height growth
    responsive: true, // Ensure the chart is responsive
  };

  return <Line  data={data} options={extendedOptions} />;
};

export default LineChart;
