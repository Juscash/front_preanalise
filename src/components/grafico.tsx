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
      <div
        style={{
          fontSize: "16px",
          color: "#0a3672",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {label}
      </div>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: "translate(-50%, -20%)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "26px", fontWeight: "bold", color: "#0a3672" }}>{value}%</div>
      </div>
    </div>
  );
};

export default GaugeChart;
