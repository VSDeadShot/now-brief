import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchNews } from '../../lib/news';
import { getCache, setCache } from '../../lib/cache';

export default function SamsungNewsCard() {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const cached = await getCache('samsung_news');
      if (cached) {
        setArticles(cached);
        setLoading(false);
      }

      const freshData = await fetchNews('samsung');
      if (freshData) {
        setArticles(freshData);
        setCache('samsung_news', freshData);
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
          <path d="M7.5 1.5h9c1.24 0 2.25 1.01 2.25 2.25v16.5c0 1.24-1.01 2.25-2.25 2.25h-9C6.26 22.5 5.25 21.49 5.25 20.25v-16.5c0-1.24 1.01-2.25 2.25-2.25zm0 1.5v16.5h9V3h-9zm4.5 14.25a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25z" />
        </svg>
        <h2 className="font-bold text-lg text-white/90">Samsung News</h2>
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
              <span className="text-white font-medium text-base line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                {article.title}
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mt-0.5">
                <span className="text-blue-400">{article.source}</span>
                <span>•</span>
                <span>{timeAgo(article.publishedTime)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-zinc-500 text-sm font-medium">
          Cannot load Samsung news right now.
        </div>
      )}
    </motion.div>
  );
}
