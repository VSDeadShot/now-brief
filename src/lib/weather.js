export async function fetchWeather(city = 'Jaipur') {
  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn("Missing VITE_OPENWEATHER_API_KEY in .env");
      return null;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather fetch failed');
    }
    
    const current = await currentResponse.json();
    const forecast = await forecastResponse.json();
    
    // Process forecast to get next 4 intervals (3-hour intervals)
    let hourly = [];
    if (forecast && forecast.list) {
      hourly = forecast.list.slice(0, 4).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon
      }));
    }

    return {
      temp: Math.round(current.main.temp),
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      city: current.name,
      hourly
    };
  } catch (error) {
    console.error("Weather error:", error);
    return null; // Component handles graceful fallback
  }
}
