import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';
import { fetchWeather } from '../../lib/weather';
import { getCache, setCache } from '../../lib/cache';

export default function WeatherCard({ timeOfDay = 'evening' }) {
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

  let bgClass = "bg-gradient-to-br from-[#403B50] to-[#514B63]";
  if (timeOfDay === 'morning') bgClass = "bg-gradient-to-br from-[#4A90E2] to-[#5CA0F2]";
  else if (timeOfDay === 'afternoon') bgClass = "bg-gradient-to-br from-[#6B6286] to-[#80769D]";

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`w-full rounded-[24px] ${bgClass} p-6 flex flex-col gap-4 shadow-lg text-white`}
    >
      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-white/20 rounded-lg w-20"></div>
          <div className="h-4 bg-white/20 rounded-md w-32 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">{data.temp}°</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <img 
              src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
              alt={data.condition}
              className="w-8 h-8 opacity-90 brightness-110 saturate-150"
            />
            <span className="text-sm font-medium text-white/90 capitalize">
              {data.description} in {data.city}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-white/80 text-sm font-medium">Weather data unavailable (Check proxy/API key).</div>
      )}
    </motion.div>
  );
}
