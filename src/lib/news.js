const PROXY_URL = 'http://localhost:3000';

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
