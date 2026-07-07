// During development, we'll point to the local Vercel dev server.
// When deploying to production, this should be updated to your Vercel project URL.
const PROXY_URL = 'https://proxy-gamma-three-97.vercel.app';

export async function fetchWeather(city = 'Jaipur') {
  try {
    const res = await fetch(`${PROXY_URL}/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      throw new Error('Weather fetch failed');
    }
    const data = await res.json();
    
    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name
    };
  } catch (error) {
    console.error("Weather error:", error);
    return null; // Component handles graceful fallback
  }
}
