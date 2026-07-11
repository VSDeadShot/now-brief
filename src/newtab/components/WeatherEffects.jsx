import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherEffects({ condition }) {
  if (!condition) return null;

  if (condition === 'Clear') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        {/* Sun Glow */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-yellow-300/20 blur-3xl rounded-full" 
        />
        {/* Sun Core */}
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-400 blur-md rounded-full shadow-[0_0_50px_rgba(253,224,71,0.5)]" />
        
        {/* Slow rotating rays */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-50px] right-[-50px] w-48 h-48"
        >
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2 w-48 h-2 bg-yellow-200/10 origin-left blur-sm"
              style={{ transform: `rotate(${i * 45}deg) translateY(-50%)` }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (condition === 'Clouds') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        {/* Background Clouds */}
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[-20%] w-[140%] h-32 bg-white/10 blur-2xl rounded-full"
        />
        {/* Midground Fluffy Clouds */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`mid-${i}`}
            initial={{ x: Math.random() * 300 - 100, y: Math.random() * 50 - 20 }}
            animate={{ x: [null, 400], opacity: [0, 0.4, 0] }}
            transition={{ duration: 25 + Math.random() * 15, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
            className="absolute opacity-0"
          >
            <svg width="120" height="80" viewBox="0 0 24 24" className="text-white/30 drop-shadow-xl" fill="currentColor">
              <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.313-1.745-4.225-4-4.474-.46-2.55-2.67-4.526-5.36-4.526-2.98 0-5.4 2.42-5.4 5.4 0 .332.03.655.087.97-.247-.11-.52-.17-.807-.17-1.105 0-2 .895-2 2s.895 2 2 2h11z"/>
            </svg>
          </motion.div>
        ))}
        {/* Foreground Fluffy Clouds */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`fore-${i}`}
            initial={{ x: Math.random() * 300 - 150, y: 30 + Math.random() * 40 }}
            animate={{ x: [null, 400], opacity: [0, 0.6, 0] }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
            className="absolute opacity-0"
          >
            <svg width="180" height="120" viewBox="0 0 24 24" className="text-white/40 drop-shadow-2xl" fill="currentColor">
              <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.313-1.745-4.225-4-4.474-.46-2.55-2.67-4.526-5.36-4.526-2.98 0-5.4 2.42-5.4 5.4 0 .332.03.655.087.97-.247-.11-.52-.17-.807-.17-1.105 0-2 .895-2 2s.895 2 2 2h11z"/>
            </svg>
          </motion.div>
        ))}
      </div>
    );
  }

  if (condition === 'Rain' || condition === 'Drizzle') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px] bg-slate-900/20">
        {[...Array(40)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ y: -50, x: Math.random() * 400 - 50, opacity: 0 }}
            animate={{ y: 300, x: `calc(${Math.random() * 400 - 50}px - 60px)`, opacity: [0, 0.6, 0] }}
            transition={{ 
              duration: 0.5 + Math.random() * 0.3, 
              repeat: Infinity, 
              ease: "linear", 
              delay: Math.random() * 2 
            }}
            className="absolute bg-white w-[2px] rounded-full blur-[0.5px]"
            style={{
              height: `${20 + Math.random() * 30}px`,
              transform: 'rotate(15deg)'
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'Snow') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        {[...Array(30)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ 
              y: -50, 
              x: Math.random() * 350, 
              opacity: 0,
              rotate: 0 
            }}
            animate={{ 
              y: 300, 
              x: [null, Math.random() * 350 + (Math.random() > 0.5 ? 50 : -50)], 
              opacity: [0, 0.8, 0],
              rotate: 360 
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity, 
              ease: "linear", 
              delay: Math.random() * 5 
            }}
            className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            style={{
              width: `${3 + Math.random() * 5}px`,
              height: `${3 + Math.random() * 5}px`,
              filter: `blur(${Math.random() * 1}px)`
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'Thunderstorm') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px] bg-slate-900/40">
        {/* Lightning flashes */}
        <motion.div 
          animate={{ backgroundColor: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)'] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute inset-0 rounded-[24px]" 
        />
        
        {/* Heavy Rain */}
        {[...Array(50)].map((_, i) => (
          <motion.div 
            key={`rain-${i}`}
            initial={{ y: -50, x: Math.random() * 400 - 50, opacity: 0 }}
            animate={{ y: 300, x: `calc(${Math.random() * 400 - 50}px - 30px)`, opacity: [0, 0.7, 0] }}
            transition={{ 
              duration: 0.3 + Math.random() * 0.2, 
              repeat: Infinity, 
              ease: "linear", 
              delay: Math.random() * 1 
            }}
            className="absolute bg-white/80 w-[2px] rounded-full"
            style={{
              height: `${30 + Math.random() * 40}px`,
              transform: 'rotate(10deg)'
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
