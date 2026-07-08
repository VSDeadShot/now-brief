import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';
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
      className="w-full rounded-[24px] bg-[#1E1E1E] border border-[#2C2C2C] p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-3 text-[#A0A0A0]">
        <CloudRain strokeWidth={2} className="w-[18px] h-[18px] text-blue-500" />
        <h2 className="font-semibold text-sm text-[#F5F5F5]">Weather</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-[#2C2C2C] rounded-lg w-20"></div>
          <div className="h-4 bg-[#2C2C2C] rounded-md w-32 mt-1"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium text-[#F5F5F5] tracking-tight">{data.temp}°</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <img 
              src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
              alt={data.condition}
              className="w-8 h-8 opacity-90 brightness-110 saturate-150"
            />
            <span className="text-xs font-medium text-[#A0A0A0] capitalize">
              {data.description} in {data.city}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-[#A0A0A0] text-xs font-medium">Weather data unavailable (Check proxy/API key).</div>
      )}
    </motion.div>
  );
}
