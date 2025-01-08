import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ value, label }: { value: any; label: any }) => {
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

  const options = {
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
    <div style={{ position: "relative", width: "200px", height: "120px" }}>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -20%)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{value}%</div>
        <div style={{ fontSize: "14px" }}>{label}</div>
      </div>
    </div>
  );
};

export default GaugeChart;
