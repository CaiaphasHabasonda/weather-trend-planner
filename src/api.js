export async function fetchWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=YOUR_API_KEY&units=metric`
  );
  if (!response.ok) throw new Error("City not found");
  return await response.json();
}
