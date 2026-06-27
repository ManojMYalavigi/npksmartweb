import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MandiCharts({ historyData = [], cropName = "" }) {
  if (!historyData || historyData.length === 0) {
    return <div style={{ color: "#94a3b8" }}>No price trend history available.</div>;
  }

  const labels = historyData.map((h) => h.month);
  const prices = historyData.map((h) => h.price);

  const data = {
    labels,
    datasets: [
      {
        label: `${cropName} Mandi Price (INR/Quintal)`,
        data: prices,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#fbbf24",
        pointBorderColor: "#0b1c15",
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#e2e8f0",
          font: {
            family: "Outfit, sans-serif",
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(11, 28, 21, 0.95)",
        titleColor: "#fbbf24",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(16, 185, 129, 0.3)",
        borderWidth: 1,
        titleFont: { family: "Outfit, sans-serif" },
        bodyFont: { family: "Inter, sans-serif" },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: { family: "Inter, sans-serif" },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: { family: "Inter, sans-serif" },
        },
      },
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "260px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
