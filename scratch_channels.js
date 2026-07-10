const channels = ['wisp', 'raj shamani', 'BLOX', 'kai Notebook', 'simple actually'];
async function getIds() {
  for(let c of channels) {
    try {
      const r = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(c));
      const text = await r.text();
      const match = text.match(/"channelId":"(UC[a-zA-Z0-9_-]+)"/);
      console.log(c, '->', match ? match[1] : 'NOT FOUND');
    } catch(e) {
      console.log(c, 'error');
    }
  }
}
getIds();
