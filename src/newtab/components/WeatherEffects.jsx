import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherEffects({ condition, isNight }) {
  if (!condition) return null;

  if (condition === 'Clear') {
    if (isNight) {
      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
          {/* Twinkling Stars */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
              className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`
              }}
            />
          ))}
          
          {/* Moon Glow */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-30px] right-[-30px] w-56 h-56 bg-slate-300/10 blur-3xl rounded-full" 
          />
          {/* Moon Core (Crescent) */}
          <div className="absolute top-[-10px] right-[10px] w-24 h-24 rounded-full shadow-[-15px_15px_0_0_rgba(226,232,240,0.8)] opacity-90 blur-[1px]" />
        </div>
      );
    }

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
          className="absolute top-[-10%] left-[-20%] w-[150%] h-[60%] bg-white/20 blur-[40px] rounded-b-full"
        />
        
        {/* Midground cloud layer 1 */}
        <motion.div
          animate={{ x: ['0%', '-20%', '0%'] }}
          transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[0%] left-[10%] w-[120%] h-[50%] bg-white/30 blur-[35px] rounded-b-full"
        />

        {/* Midground cloud layer 2 */}
        <motion.div
          animate={{ x: ['-15%', '15%', '-15%'] }}
          transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-10%] w-[130%] h-[55%] bg-white/20 blur-[30px] rounded-b-full"
        />
        
        {/* Foreground dense cloud chunks */}
        <motion.div
          animate={{ x: ['-30%', '5%', '-30%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-[-40%] w-[180%] h-[65%] bg-white/40 blur-[30px] rounded-b-[100px]"
        />
      </div>
    );
  }

  if (condition === 'Rain' || condition === 'Drizzle') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px] bg-slate-900/20">
        <div className="absolute inset-[-50%] w-[200%] h-[200%] rotate-[15deg]">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/50 animate-rain w-[1px] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                height: `${10 + Math.random() * 15}px`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.4 + Math.random() * 0.3}s`
              }}
            />
          ))}
        </div>
        
        {/* Splash effect at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden z-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`splash-${i}`}
              className="absolute bottom-1 bg-white/60 rounded-full animate-splash"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${1.5 + Math.random() * 1.5}px`,
                height: `${1 + Math.random() * 1}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.3 + Math.random() * 0.2}s`
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
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px] bg-slate-900/60">
        
        {/* Dark Thunderstorm Clouds */}
        <motion.div
          animate={{ x: ['-10%', '0%', '-10%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-20%] w-[150%] h-[60%] bg-black/40 blur-[40px] rounded-b-full"
        />
        <motion.div
          animate={{ x: ['0%', '-20%', '0%'] }}
          transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[0%] left-[10%] w-[120%] h-[50%] bg-slate-800/50 blur-[35px] rounded-b-full"
        />
        <motion.div
          animate={{ x: ['-30%', '5%', '-30%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-[-40%] w-[180%] h-[65%] bg-slate-900/60 blur-[30px] rounded-b-[100px]"
        />

        {/* Lightning flashes (Background Illumination) */}
        <motion.div 
          animate={{ opacity: [0, 1, 0, 0, 0.6, 0, 0, 0, 0, 0, 0.8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-white/40 mix-blend-overlay rounded-[24px]" 
        />
        
        {/* Actual Lightning Bolt SVG */}
        <motion.div 
          animate={{ opacity: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10px] right-[25%] w-12 h-12 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-90 transform -rotate-12">
            <path d="M11 21.999c-.198 0-.392-.058-.555-.166-.312-.208-.475-.572-.412-.942l1.528-8.891H6.5c-.389 0-.74-.225-.905-.577-.165-.353-.105-.773.155-1.066l9-10c.264-.294.685-.369 1.037-.184.352.184.551.554.49 9.42l-1.528 8.891h5.062c.389 0 .74.225.905.577.165.353.105.773-.155 1.066l-9 10c-.173.192-.416.299-.667.299z" />
          </svg>
        </motion.div>

        {/* Heavy Rain */}
        <div className="absolute inset-[-50%] w-[200%] h-[200%] rotate-[15deg]">
          {[...Array(80)].map((_, i) => (
            <div 
              key={`rain-${i}`}
              className="absolute bg-white/70 animate-rain w-[1.5px] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                height: `${15 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${0.2 + Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Heavy Splash effect */}
        <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden z-10">
          {[...Array(40)].map((_, i) => (
            <div 
              key={`tsplash-${i}`}
              className="absolute bottom-1 bg-white/80 rounded-full animate-splash"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 1.5}px`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${0.2 + Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
