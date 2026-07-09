import React, { useEffect, useState } from 'react';
import { CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import WeatherEffects from './WeatherEffects';
import { fetchWeather } from '../../lib/weather';
import { getCache, setCache } from '../../lib/cache';

export default function WeatherCard({ timeOfDay = 'evening' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card 
      className={`relative overflow-hidden ${bgClass} text-white cursor-pointer transition-all duration-300`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <WeatherEffects condition={data?.condition} />
      
      <div className="relative z-10 w-full flex flex-col gap-4">
        {loading ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-12 bg-white/20 rounded-lg w-20"></div>
          <div className="h-4 bg-white/20 rounded-md w-32 mt-1"></div>
        </div>
      ) : data ? (
      <div className="flex flex-col gap-1 w-full">
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

        {/* Expanded Forecast View */}
        <AnimatePresence>
          {isExpanded && data.hourly && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col border-t border-white/20 pt-4 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 w-full overflow-x-auto pb-2 scrollbar-hide">
                {data.hourly.map((hour, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 min-w-[50px]">
                    <span className="text-[11px] font-medium text-white/70">{hour.time}</span>
                    <img src={`https://openweathermap.org/img/wn/${hour.icon}.png`} alt="icon" className="w-8 h-8" />
                    <span className="text-sm font-bold">{hour.temp}°</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex flex-col gap-1 pb-1">
                <span className="text-xs text-white/70">Forecast Insight</span>
                <span className="text-sm font-bold text-white">Expect {data.hourly[0].temp}° and {data.condition.toLowerCase()} soon.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        ) : (
          <div className="relative z-10 text-white/80 text-sm font-medium">Weather data unavailable (Check proxy/API key).</div>
        )}
      </div>
    </Card>
  );
}
