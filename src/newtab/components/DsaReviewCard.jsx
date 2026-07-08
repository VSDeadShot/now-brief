import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import { fetchDsaReviews } from '../../lib/dsaTracker';
import { getCache, setCache } from '../../lib/cache';

export default function DsaReviewCard({ timeOfDay = 'evening' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const cached = await getCache('dsa_reviews');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      const freshData = await fetchDsaReviews();
      if (freshData) {
        setData(freshData);
        setCache('dsa_reviews', freshData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const isLight = timeOfDay === 'morning';
  const cardBg = isLight ? "bg-[#FFFFFF]" : "bg-[#1C1C1E]";
  const textColor = isLight ? "text-[#1A1A1A]" : "text-[#F5F5F5]";
  const subTextColor = isLight ? "text-[#6E6E6E]" : "text-[#A0A0A0]";

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`w-full rounded-[24px] ${cardBg} p-6 flex flex-col gap-4 shadow-lg`}
    >
      <div className={`text-xs font-bold uppercase tracking-wider ${subTextColor} opacity-70`}>DSA Tracker</div>
      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className={`h-12 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded-lg w-16`}></div>
          <div className={`h-4 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded-md w-48 mt-1`}></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-extrabold ${textColor} tracking-tight`}>{data.dueToday}</span>
            <span className={`text-sm ${subTextColor} font-medium`}>due today</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full bg-blue-500`}></div>
            <span className={`text-sm font-medium ${subTextColor}`}>
              {data.dueToday > 0 ? 'Time for your daily review session' : 'All caught up for today!'}
            </span>
          </div>
        </div>
      ) : (
        <div className={`${subTextColor} text-sm font-medium`}>Cannot connect to DSA Tracker (Check API endpoint).</div>
      )}
    </motion.div>
  );
}
