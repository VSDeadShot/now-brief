const PROXY_URL = 'https://proxy-gamma-three-97.vercel.app';

export async function fetchDsaReviews() {
  try {
    const res = await fetch(`${PROXY_URL}/api/dsa-tracker`);

    if (!res.ok) {
      throw new Error('Failed to fetch DSA reviews');
    }
    
    const data = await res.json();
    return {
      dueToday: data.dueToday || 0
    };
  } catch (error) {
    console.error("DSA Tracker fetch error:", error);
    return null; // Component will handle graceful fallback
  }
}
