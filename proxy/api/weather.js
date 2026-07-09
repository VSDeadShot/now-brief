export default async function handler(req, res) {
  // Setup CORS to allow the extension to fetch this during local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Default to Jaipur if no city is provided
  const { city = 'Jaipur' } = req.query; 
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENWEATHER_API_KEY environment variable.' });
  }

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    
    if (!currentResponse.ok || !forecastResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    return res.status(200).json({ current: currentData, forecast: forecastData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
