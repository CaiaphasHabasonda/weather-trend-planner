import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";
import { formatDateToDay } from "../utils";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

export default function WeatherChart({ forecast }) {
  const data = {
    labels: forecast.map((f) => formatDateToDay(f.date)),
    datasets: [
      {
        label: "Avg Temp (℃)",
        data: forecast.map((f) => f.temp),
        borderColor: "blue",
        backgroundColor: "lightblue",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}
