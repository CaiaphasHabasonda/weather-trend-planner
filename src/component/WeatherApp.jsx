import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Your API key
const API_KEY = "605ea140dcc5200009c075a27060fba1";

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`City not found: ${errText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

function processForecast(data) {
  const dailyTemps = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyTemps[date]) dailyTemps[date] = [];
    dailyTemps[date].push(item.main.temp);
  });

  return Object.keys(dailyTemps).map((date) => {
    const temps = dailyTemps[date];
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    return { date, temp: avgTemp };
  });
}

function generateInsight(data, cityName) {
  let bestDay = data[0];
  data.forEach((day) => {
    if (day.temp < bestDay.temp) bestDay = day;
  });

  if (bestDay.temp > 35) return `Heat warning in ${cityName}: ${bestDay.date} (${bestDay.temp}°C)`;
  if (bestDay.temp < 5) return `Cold warning in ${cityName}: ${bestDay.date} (${bestDay.temp}°C)`;

  return `Best day to go out in ${cityName}: ${bestDay.date} (${bestDay.temp.toFixed(1)}°C)`;
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [insight, setInsight] = useState("");

  const handleSearch = async () => {
    try {
      const data = await fetchWeather(city);
      setWeather({
        name: data.city.name,
        temp: data.list[0].main.temp,
        condition: data.list[0].weather[0].description,
      });
      const processed = processForecast(data);
      setForecast(processed);
      setInsight(generateInsight(processed, data.city.name));
    } catch (error) {
      setWeather(null);
      setForecast([]);
      setInsight("City not found or error fetching data.");
    }
  };

  const chartData = {
    labels: forecast.map((f) => f.date), // dates from API
    datasets: [
      {
        label: "Temperature (°C)",
        data: forecast.map((f) => f.temp),
        borderColor: "#0078d7",
        backgroundColor: "rgba(0,120,215,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="weather-container">
      <h2>Weather Trend Planner</h2>
      <div className="search-box">
        <label>Enter city: </label>
        <input
          type="text"
          placeholder="City name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {weather && (
        <div className="weather-info">
          <h3>{weather.name}</h3>
          <p>Current Temperature: {weather.temp}°C</p>
          <p>Condition: {weather.condition}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="chart-box">
          <h3>Temperature Trend</h3>
          <Line data={chartData} />
        </div>
      )}

      {insight && (
        <div className="insight-box">
          <h3>Insight:</h3>
          <p>{insight}</p>
        </div>
      )}
    </div>
  );
}
