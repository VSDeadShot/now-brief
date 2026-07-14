export async function fetchDsaReviews() {
  try {
    const secret = import.meta.env.VITE_NOW_BRIEF_SECRET;
    if (!secret) {
      console.warn("Missing VITE_NOW_BRIEF_SECRET in .env");
      return null;
    }

    const res = await fetch(`https://trackingdsa.vercel.app/api/now-brief`, {
      headers: {
        'x-api-key': secret
      }
    });
    
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
