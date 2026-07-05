import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchDsaReviews } from '../../lib/dsaTracker';

export default function DsaReviewCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // In phase 2 this will use chrome.storage.local caching
      const result = await fetchDsaReviews();
      setData(result);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 p-7 flex flex-col gap-4 shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3 text-zinc-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
        <h2 className="font-bold text-lg text-white/90">DSA Tracker</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-white/10 rounded-lg w-16"></div>
          <div className="h-4 bg-white/10 rounded-md w-48 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-white tracking-tight">{data.dueToday}</span>
            <span className="text-zinc-400 font-medium">due today</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${data.dueToday > 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]'}`}></div>
            <span className="text-sm font-medium text-zinc-300">
              {data.dueToday > 0 ? 'Time for your daily review session' : 'All caught up for today!'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-zinc-400 text-sm font-medium">Cannot connect to DSA Tracker (Check API endpoint).</div>
      )}
    </motion.div>
  );
}
