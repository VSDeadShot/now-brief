const PROXY_URL = 'https://proxy-gamma-three-97.vercel.app';

export async function fetchNews(type = 'tech') {
  try {
    const res = await fetch(`${PROXY_URL}/api/news?type=${type}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type} news`);
    }
    
    const data = await res.json();
    return data.articles || [];
  } catch (error) {
    console.error(`News fetch error (${type}):`, error);
    return null; 
  }
}
