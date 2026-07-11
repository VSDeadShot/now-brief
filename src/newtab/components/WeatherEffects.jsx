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
        {/* Deep background cloud layer */}
        <motion.div
          animate={{ x: ['-10%', '0%', '-10%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-30px] left-[-20%] w-[150%] h-40 bg-white/20 blur-[50px] rounded-full"
        />
        
        {/* Midground cloud layer 1 */}
        <motion.div
          animate={{ x: ['0%', '-20%', '0%'] }}
          transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10px] left-[10%] w-[120%] h-48 bg-white/30 blur-[40px] rounded-full"
        />

        {/* Midground cloud layer 2 */}
        <motion.div
          animate={{ x: ['-15%', '15%', '-15%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[50px] left-[-10%] w-[130%] h-40 bg-white/20 blur-[35px] rounded-full"
        />
        
        {/* Foreground dense cloud chunks */}
        <motion.div
          animate={{ x: ['-30%', '5%', '-30%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-40px] left-[-40%] w-[180%] h-56 bg-white/40 blur-[30px] rounded-t-[100px]"
        />
      </div>
    );
  }

  if (condition === 'Rain' || condition === 'Drizzle') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px] bg-slate-900/20">
        <div className="absolute inset-[-50%] w-[200%] h-[200%] rotate-[15deg]">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/60 animate-rain w-[1.5px] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                height: `${20 + Math.random() * 30}px`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.4 + Math.random() * 0.3}s`
              }}
            />
          ))}
        </div>
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
        <div className="absolute inset-[-50%] w-[200%] h-[200%] rotate-[15deg]">
          {[...Array(60)].map((_, i) => (
            <div 
              key={`rain-${i}`}
              className="absolute bg-white/80 animate-rain w-[2px] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                height: `${30 + Math.random() * 40}px`,
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${0.3 + Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
