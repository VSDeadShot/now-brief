import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
      className="w-full rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 p-7 flex flex-col gap-4 shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3 text-zinc-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
        <h2 className="font-bold text-lg text-white/90">GitHub Activity</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-white/10 rounded-lg w-20"></div>
          <div className="h-4 bg-white/10 rounded-md w-32 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-end justify-between w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-white tracking-tight">{data.streak}</span>
              <span className="text-zinc-400 font-medium">day streak</span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-white/5 pt-4">
            <div className={`w-2.5 h-2.5 rounded-full ${data.hasContributedToday ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-zinc-600'}`}></div>
            <span className="text-sm font-medium text-zinc-300">
              {data.hasContributedToday 
                ? `${data.todayContributions} contribution${data.todayContributions === 1 ? '' : 's'} today` 
                : 'No contributions yet today'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-zinc-400 text-sm font-medium">Failed to load GitHub activity.</div>
      )}
    </motion.div>
  );
}
