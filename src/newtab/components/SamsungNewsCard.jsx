import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import Card from './Card';
import { fetchNews } from '../../lib/news';
import { getCache, setCache } from '../../lib/cache';

export default function SamsungNewsCard({ timeOfDay = 'evening' }) {
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

  const isLight = timeOfDay === 'morning';
  const cardBg = isLight ? "bg-[#FFFFFF]" : "bg-[#1C1C1E]";
  const textColor = isLight ? "text-[#1A1A1A]" : "text-[#F5F5F5]";
  const subTextColor = isLight ? "text-[#6E6E6E]" : "text-[#A0A0A0]";

  return (
    <div className="flex flex-col gap-3 w-full">
      {loading ? (
        <Card timeOfDay={timeOfDay} className="p-4 flex flex-col gap-4">
          <div className="animate-pulse flex flex-col gap-4">
            <div className={`h-4 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded w-1/3`}></div>
            <div className={`h-4 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded w-full`}></div>
            <div className={`h-4 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded w-5/6`}></div>
          </div>
        </Card>
      ) : articles && articles.length > 0 ? (
        articles.map((article, idx) => (
          <Card 
            key={idx} 
            timeOfDay={timeOfDay} 
            className="p-4 flex flex-col gap-1 group" 
            onClick={() => window.open(article.link, '_blank')}
          >
            {/* Row 1: Source + timestamp */}
            <div className={`flex items-center gap-2 text-xs ${subTextColor} font-medium`}>
              <span className="text-blue-500">{article.source}</span>
              <span>•</span>
              <span>{timeAgo(article.publishedTime)}</span>
            </div>
            
            {/* Row 2: Headline */}
            <span className={`${textColor} font-bold text-[15px] line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors mt-1`}>
              {article.title}
            </span>
            
            {/* Row 3: Snippet (clamp to 2 lines) */}
            {article.excerpt && (
              <p className={`text-[13px] ${subTextColor} font-normal line-clamp-2 mt-1 leading-snug`}>
                {article.excerpt}
              </p>
            )}
          </Card>
        ))
      ) : (
        <Card timeOfDay={timeOfDay} className="p-4">
          <div className={`${subTextColor} text-sm font-medium`}>
            Cannot load Samsung news right now.
          </div>
        </Card>
      )}
    </div>
  );
}
