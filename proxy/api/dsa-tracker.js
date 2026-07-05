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

  const secret = process.env.NOW_BRIEF_SECRET;

  if (!secret) {
    return res.status(500).json({ error: 'Missing NOW_BRIEF_SECRET environment variable.' });
  }

  try {
    const url = `https://trackingdsa.vercel.app/api/now-brief`;
    const response = await fetch(url, {
      headers: {
        'x-api-key': secret
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'Failed to fetch DSA Tracker', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
