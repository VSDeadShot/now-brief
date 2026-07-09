// During development, we'll point to the local Vercel dev server.
// When deploying to production, this should be updated to your Vercel project URL.
const PROXY_URL = 'https://proxy-gamma-three-97.vercel.app';

export async function fetchWeather(city = 'Jaipur') {
  try {
    const res = await fetch(`${PROXY_URL}/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      throw new Error('Weather fetch failed');
    }
    const { current, forecast } = await res.json();
    
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
