import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchWeather } from '../../lib/weather';
import { getCache, setCache } from '../../lib/cache';

export default function WeatherCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const cached = await getCache('weather_data');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      const freshData = await fetchWeather('Jaipur');
      if (freshData) {
        setData(freshData);
        setCache('weather_data', freshData);
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
          <path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
          <path d="M12 4.5A7.5 7.5 0 1019.5 12 7.5 7.5 0 0012 4.5zm0 13.5a6 6 0 110-12 6 6 0 010 12z" />
        </svg>
        <h2 className="font-bold text-lg text-white/90">Weather</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-white/10 rounded-lg w-20"></div>
          <div className="h-4 bg-white/10 rounded-md w-32 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-white tracking-tight">{data.temp}°</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <img 
              src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
              alt={data.condition}
              className="w-8 h-8 opacity-90 brightness-110 saturate-150"
            />
            <span className="text-sm font-medium text-zinc-300 capitalize">
              {data.description} in {data.city}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-zinc-400 text-sm font-medium">Weather data unavailable (Check proxy/API key).</div>
      )}
    </motion.div>
  );
}
