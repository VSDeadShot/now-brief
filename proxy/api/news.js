import Parser from 'rss-parser';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Some feeds block generic fetch User-Agents
  }
});

const FEEDS = {
  samsung: {
    url: 'https://www.sammobile.com/feed/',
    sourceName: 'SamMobile'
  },
  tech: {
    url: 'https://www.theverge.com/rss/tech/index.xml',
    sourceName: 'The Verge'
  }
};

export default async function handler(req, res) {
  // Setup CORS
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

  const { type = 'tech' } = req.query;
  console.log(`[NEWS API] Received request for type: ${type}`);
  
  const feedConfig = FEEDS[type];

  if (!feedConfig) {
    console.log(`[NEWS API] Invalid type: ${type}`);
    return res.status(400).json({ error: 'Invalid news type requested' });
  }

  try {
    const feed = await parser.parseURL(feedConfig.url);
    
    const articles = feed.items.slice(0, 4).map(item => {
      let excerpt = item.contentSnippet || item.content || item.summary || item.description || '';
      // Strip HTML if any remains, though contentSnippet usually strips it
      excerpt = excerpt.replace(/(<([^>]+)>)/gi, "").trim();
      if (excerpt.length > 160) {
        excerpt = excerpt.substring(0, 160) + '...';
      }

      return {
        title: item.title,
        link: item.link,
        publishedTime: item.isoDate || item.pubDate,
        source: feedConfig.sourceName,
        excerpt
      };
    });

    return res.status(200).json({ articles });
  } catch (error) {
    console.error('RSS Parser Error:', error);
    return res.status(500).json({ error: 'Failed to fetch news feed', details: error.message });
  }
}
