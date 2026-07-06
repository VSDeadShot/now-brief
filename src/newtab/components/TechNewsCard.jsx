import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchNews } from '../../lib/news';
import { getCache, setCache } from '../../lib/cache';

export default function TechNewsCard() {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const cached = await getCache('tech_news');
      if (cached) {
        setArticles(cached);
        setLoading(false);
      }

      const freshData = await fetchNews('tech');
      if (freshData) {
        setArticles(freshData);
        setCache('tech_news', freshData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const timeAgo = (dateString) => {
    const diff = new Date() - new Date(dateString);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 p-7 flex flex-col gap-4 shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3 text-zinc-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1c0 .414-.336.75-.75.75H8.25a.75.75 0 00-.75.75v12.5a.75.75 0 00.75.75h7.5a.75.75 0 00.75-.75V5.5a.75.75 0 00-.75-.75h-.25a.75.75 0 010-1.5h.25a2.25 2.25 0 012.25 2.25v12.5a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 016 18.5V5.5A2.25 2.25 0 018.25 3.25h3v-1a.75.75 0 01.75-.75z" clipRule="evenodd" />
          <path d="M9.75 8.25a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm0 3.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" />
        </svg>
        <h2 className="font-bold text-lg text-white/90">Tech News</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-full"></div>
        </div>
      ) : articles && articles.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {articles.map((article, idx) => (
            <li key={idx} className="flex flex-col gap-1 group cursor-pointer" onClick={() => window.open(article.link, '_blank')}>
              <span className="text-white font-medium text-base line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                {article.title}
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mt-0.5">
                <span className="text-purple-400">{article.source}</span>
                <span>•</span>
                <span>{timeAgo(article.publishedTime)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-zinc-500 text-sm font-medium">
          Cannot load Tech news right now.
        </div>
      )}
    </motion.div>
  );
}
