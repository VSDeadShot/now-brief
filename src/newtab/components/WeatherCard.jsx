import React, { useEffect, useState, useRef } from 'react';
import { CloudRain, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import WeatherEffects from './WeatherEffects';
import { fetchWeather } from '../../lib/weather';
import { getCache, setCache } from '../../lib/cache';

export default function WeatherCard({ timeOfDay = 'evening' }) {
  const [city, setCity] = useState(() => localStorage.getItem('weather_city') || 'Jaipur');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [tempCity, setTempCity] = useState(city);
  const inputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const cached = await getCache(`weather_data_${city}`);
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      const freshData = await fetchWeather(city);
      if (freshData) {
        setData(freshData);
        setCache(`weather_data_${city}`, freshData);
      }
      setLoading(false);
    }
    loadData();
  }, [city]);

  const handleCitySave = (e) => {
    e.stopPropagation();
    if (tempCity.trim() && tempCity !== city) {
      const newCity = tempCity.trim();
      setCity(newCity);
      localStorage.setItem('weather_city', newCity);
    }
    setIsEditingCity(false);
  };

  const handleCityEdit = (e) => {
    e.stopPropagation();
    setIsEditingCity(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  let bgClass = "bg-gradient-to-br from-[#403B50] to-[#514B63]";
  if (timeOfDay === 'morning') bgClass = "bg-gradient-to-br from-[#4A90E2] to-[#5CA0F2]";
  else if (timeOfDay === 'afternoon') bgClass = "bg-gradient-to-br from-[#6B6286] to-[#80769D]";

  return (
    <Card 
      className={`relative overflow-hidden ${bgClass} text-white cursor-pointer transition-all duration-300`}
      onClick={() => setIsExpanded(!isExpanded)}
      >
      <WeatherEffects condition={data?.condition} isNight={data?.icon?.endsWith('n')} />
      
      <div className="relative z-10 w-full flex flex-col gap-4 mt-4">
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
          {isEditingCity ? (
            <div className="flex items-center gap-1 bg-white/20 rounded-md px-2 py-1" onClick={e => e.stopPropagation()}>
              <MapPin size={14} className="text-white/70" />
              <input
                ref={inputRef}
                type="text"
                value={tempCity}
                onChange={(e) => setTempCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCitySave(e)}
                className="bg-transparent text-sm font-medium text-white outline-none w-24 placeholder-white/50"
                placeholder="City name..."
              />
              <button onClick={handleCitySave} className="p-1 hover:bg-white/20 rounded-md">
                <Check size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <span className="text-sm font-medium text-white/90 capitalize flex items-center gap-1 group">
              {data.description} in {data.city}
              <button onClick={handleCityEdit} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-md transition-opacity duration-75">
                <MapPin size={12} className="text-white/70" />
              </button>
            </span>
          )}
        </div>

        {/* Expanded Forecast View */}
        <AnimatePresence>
          {isExpanded && data.hourly && data.hourly.length > 0 && (
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
          <div className="relative z-10 text-white/80 text-sm font-medium flex flex-col gap-2">
            <span>Weather data unavailable for "{city}". Check city name or API key.</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setCity('Jaipur'); setTempCity('Jaipur'); localStorage.setItem('weather_city', 'Jaipur'); }}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md w-max mt-1 transition-colors text-white"
            >
              Reset to Default City
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
