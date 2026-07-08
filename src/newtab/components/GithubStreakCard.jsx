import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { fetchGithubActivity } from '../../lib/github';
import { getCache, setCache } from '../../lib/cache';

export default function GithubStreakCard() {
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

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full rounded-[24px] bg-[#1E1E1E] border border-[#2C2C2C] p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-3 text-[#A0A0A0]">
        <Flame strokeWidth={2} className="w-[18px] h-[18px] text-blue-500" />
        <h2 className="font-semibold text-sm text-[#F5F5F5]">GitHub Activity</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-[#2C2C2C] rounded-lg w-20"></div>
          <div className="h-4 bg-[#2C2C2C] rounded-md w-32 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-end justify-between w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-medium text-[#F5F5F5] tracking-tight">{data.streak}</span>
              <span className="text-xs text-[#A0A0A0] font-medium">day streak</span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-[#2C2C2C] pt-4">
            <div className={`w-2.5 h-2.5 rounded-full ${data.hasContributedToday ? 'bg-blue-500' : 'bg-[#2C2C2C]'}`}></div>
            <span className="text-xs font-medium text-[#A0A0A0]">
              {data.hasContributedToday 
                ? `${data.todayContributions} contribution${data.todayContributions === 1 ? '' : 's'} today` 
                : 'No contributions yet today'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-[#A0A0A0] text-xs font-medium">Failed to load GitHub activity.</div>
      )}
    </motion.div>
  );
}
