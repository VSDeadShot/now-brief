import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { fetchGithubActivity } from '../../lib/github';
import { getCache, setCache } from '../../lib/cache';

export default function GithubStreakCard({ timeOfDay = 'evening' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Instantly load from cache if available
      const cached = await getCache('github_streak');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      // 2. Fetch fresh data in the background
      const freshData = await fetchGithubActivity('VSDeadShot');
      if (freshData) {
        setData(freshData);
        setCache('github_streak', freshData);
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
      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className={`h-12 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded-lg w-20`}></div>
          <div className={`h-4 ${isLight ? 'bg-black/5' : 'bg-white/10'} rounded-md w-32 mt-1`}></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-end justify-between w-full">
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-extrabold ${textColor} tracking-tight`}>{data.streak}</span>
              <span className={`text-sm ${subTextColor} font-medium`}>day streak</span>
            </div>
          </div>
          <div className={`flex items-center gap-2 border-t ${isLight ? 'border-gray-200' : 'border-[#2C2C2C]'} pt-4`}>
            <div className={`w-2.5 h-2.5 rounded-full ${data.hasContributedToday ? 'bg-blue-500' : isLight ? 'bg-gray-300' : 'bg-[#2C2C2C]'}`}></div>
            <span className={`text-sm font-medium ${subTextColor}`}>
              {data.hasContributedToday 
                ? `${data.todayContributions} contribution${data.todayContributions === 1 ? '' : 's'} today` 
                : 'No contributions yet today'}
            </span>
          </div>
        </div>
      ) : (
        <div className={`${subTextColor} text-sm font-medium`}>Failed to load GitHub activity.</div>
      )}
    </motion.div>
  );
}
