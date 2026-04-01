export function processForecast(data) {
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

export function formatDateToDay(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function generateInsight(forecast, rawData) {
  const coldDay = forecast.find((f) => f.temp < 5);
  const hotDay = forecast.find((f) => f.temp > 35);
  const rainDay = rawData.list.find((item) => item.pop > 0.6);

  let messages = [];

  if (coldDay) messages.push(`Cold warning on ${formatDateToDay(coldDay.date)}`);
  if (hotDay) messages.push(`Heat warning on ${formatDateToDay(hotDay.date)}`);
  if (rainDay)
    messages.push(
      `Rain expected on ${formatDateToDay(rainDay.dt_txt.split(" ")[0])}`
    );

  if (messages.length === 0) {
    const bestDay = forecast.reduce((a, b) => (a.temp < b.temp ? a : b));
    messages.push(
      `Best day to go out: ${formatDateToDay(bestDay.date)} (${bestDay.temp} ℃)`
    );
  }

  return messages;
}
