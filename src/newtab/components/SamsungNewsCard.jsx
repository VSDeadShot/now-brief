import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
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
      className="w-full rounded-[24px] bg-[#1E1E1E] border border-[#2C2C2C] p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-3 text-[#A0A0A0]">
        <Newspaper strokeWidth={2} className="w-[18px] h-[18px] text-blue-500" />
        <h2 className="font-semibold text-sm text-[#F5F5F5]">Samsung News</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-4 bg-[#2C2C2C] rounded w-full"></div>
          <div className="h-4 bg-[#2C2C2C] rounded w-5/6"></div>
          <div className="h-4 bg-[#2C2C2C] rounded w-full"></div>
        </div>
      ) : articles && articles.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {articles.map((article, idx) => (
            <li key={idx} className="flex flex-col gap-1 group cursor-pointer" onClick={() => window.open(article.link, '_blank')}>
              <span className="text-[#F5F5F5] font-medium text-xs line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors">
                {article.title}
              </span>
              {article.excerpt && (
                <p className="text-xs text-[#A0A0A0] font-normal line-clamp-3 mt-0.5 leading-snug">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-[#A0A0A0] font-medium mt-1">
                <span className="text-blue-500">{article.source}</span>
                <span>•</span>
                <span>{timeAgo(article.publishedTime)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-[#A0A0A0] text-xs font-medium">
          Cannot load Samsung news right now.
        </div>
      )}
    </motion.div>
  );
}
