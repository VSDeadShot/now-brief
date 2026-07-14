export async function fetchNews(type = 'tech') {
  try {
    let rssUrl = '';
    
    if (type === 'samsung') {
      rssUrl = 'https://www.sammobile.com/feed/';
    } else {
      // Tech news default (The Verge)
      rssUrl = 'https://www.theverge.com/rss/index.xml';
    }

    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    const data = await res.json();
    
    if (data.status !== 'ok') {
      throw new Error(`Failed to fetch ${type} news`);
    }
    
    // Map rss2json format to our expected format, and only take the top 3 articles
    return data.items.slice(0, 3).map(item => ({
      title: item.title,
      link: item.link,
      excerpt: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...', // strip HTML and truncate
      publishedTime: item.pubDate,
      source: type === 'samsung' ? 'SamMobile' : 'The Verge'
    }));
    
  } catch (error) {
    console.error(`News fetch error (${type}):`, error);
    return null; 
  }
}
