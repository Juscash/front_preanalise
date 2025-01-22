import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface GaugeChartProps {
  value: number;
  label: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label }) => {
  const data = {
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ["#30BF78", "#E0E0E0"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="gauge-chart-container">
      <div className="gauge-chart-label">{label}</div>
      <Doughnut data={data} options={options} />
      <div className="gauge-chart-value">{value.toFixed(1)}%</div>
    </div>
  );
};

export default GaugeChart;
