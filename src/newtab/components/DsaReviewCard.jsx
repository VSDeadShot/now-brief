import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import { fetchDsaReviews } from '../../lib/dsaTracker';
import { getCache, setCache } from '../../lib/cache';

export default function DsaReviewCard() {
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

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full rounded-[24px] bg-[#1E1E1E] border border-[#2C2C2C] p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-3 text-[#A0A0A0]">
        <ListTodo strokeWidth={2} className="w-[18px] h-[18px] text-blue-500" />
        <h2 className="font-semibold text-sm text-[#F5F5F5]">DSA Tracker</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-[#2C2C2C] rounded-lg w-16"></div>
          <div className="h-4 bg-[#2C2C2C] rounded-md w-48 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-[#F5F5F5] tracking-tight">{data.dueToday}</span>
            <span className="text-xs text-[#A0A0A0] font-medium">due today</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full bg-blue-500`}></div>
            <span className="text-xs font-medium text-[#A0A0A0]">
              {data.dueToday > 0 ? 'Time for your daily review session' : 'All caught up for today!'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-[#A0A0A0] text-xs font-medium">Cannot connect to DSA Tracker (Check API endpoint).</div>
      )}
    </motion.div>
  );
}
