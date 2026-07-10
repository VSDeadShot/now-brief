import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'mediaGroup'],
      ['yt:videoId', 'videoId'],
      ['yt:channelId', 'channelId']
    ]
  }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const channelIds = [
      'UC0h07r_UgTD0Tc-Dn5XLX3g', // wisp
      'UCzwCEE_PchiBULMnAJqhGVg', // raj shamani
      'UCi4oaPnysjad4Vb5G_8SkFg', // BLOX
      'UCNhWSOlt_UoCzS2YSMhHYmA', // kai Notebook
      'UCFRUDZUCGDlZGeGfftBovXw'  // simple actually
    ];

    let allVideos = [];

    // Fetch all feeds in parallel
    const feedPromises = channelIds.map(id => 
      parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`)
        .catch(err => {
          console.error(`Failed to fetch RSS for ${id}:`, err);
          return null;
        })
    );

    const feeds = await Promise.all(feedPromises);

    feeds.forEach(feed => {
      if (!feed || !feed.items) return;
      
      feed.items.forEach(item => {
        // Find high res thumbnail if possible
        let thumbnailUrl = '';
        if (item.mediaGroup && item.mediaGroup['media:thumbnail']) {
          const thumbnails = item.mediaGroup['media:thumbnail'];
          // Use the highest resolution thumbnail (usually the first one, or we just grab the URL)
          thumbnailUrl = thumbnails[0]?.$?.url || '';
        } else {
          // fallback
          thumbnailUrl = `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
        }

        allVideos.push({
          id: item.videoId,
          title: item.title,
          channelName: feed.title,
          channelId: item.channelId,
          publishedAt: item.isoDate,
          link: item.link,
          thumbnail: thumbnailUrl
        });
      });
    });

    // Sort by newest first
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Return the top 10 most recent videos
    res.status(200).json(allVideos.slice(0, 10));
  } catch (error) {
    console.error('YouTube Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
}
