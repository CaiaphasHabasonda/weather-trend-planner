import WeatherApp from "./component/WeatherApp";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Weather Trend Planner</h1>
        <p>Plan your outdoor activities with confidence</p>
      </header>

      {/* Main Weather Application */}
      <main className="app-main">
        <WeatherApp />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Powered by OpenWeather API</p>
      </footer>
    </div>
  );
}

export default App;
