import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherEffects({ condition, isNight }) {
  if (!condition) return null;

  // Calculate moon phase (0-7)
  const getMoonPhaseIndex = () => {
    const LUNAR_MONTH = 29.53058867;
    const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
    const daysSince = (Date.now() - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phase = (daysSince % LUNAR_MONTH) / LUNAR_MONTH;
    return Math.floor(phase * 8 + 0.5) % 8;
  };

  if (condition === 'Clear') {
    if (isNight) {
      const phaseIndex = getMoonPhaseIndex();

      // 0:New, 1:WaxingCrescent, 2:FirstQuarter, 3:WaxingGibbous, 4:Full, 5:WaningGibbous, 6:LastQuarter, 7:WaningCrescent
      // Offset (px) of a same-size dark disc over the lit disc, for a 96px (w-24/h-24) moon.
      // Produces a curved lens-shaped terminator instead of a straight-line cut.
      // These are NOT linear fractions of the diameter (24/48/72) - circle-overlap area is a
      // non-linear function of center-to-center distance, so a 48px offset (half the diameter)
      // actually covers ~61% of the disc, not 50%. Values below are solved from the true
      // two-circle overlap-area formula so quarter phases land on an exact 50/50 split.
      const PHASE_SHADOW_OFFSET = [0, -19, -39, -61, -96, 61, 39, 19];
      const shadowOffset = PHASE_SHADOW_OFFSET[phaseIndex] ?? -19;

      const moonBaseStyle = {
        background: 'radial-gradient(circle at 32% 28%, #f8fafc 0%, #e5e9f0 45%, #c7cdd6 100%)',
        boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.28), inset 2px 2px 6px rgba(255,255,255,0.35), 0 0 14px rgba(226,232,240,0.35), 0 0 0 1px rgba(148,163,184,0.28)'
      };
      const craterStyle = {
        backgroundImage: 'radial-gradient(circle at 28% 62%, rgba(0,0,0,0.10) 0 6px, transparent 7px), radial-gradient(circle at 60% 24%, rgba(0,0,0,0.08) 0 4px, transparent 5px), radial-gradient(circle at 74% 66%, rgba(0,0,0,0.09) 0 5px, transparent 6px), radial-gradient(circle at 45% 42%, rgba(0,0,0,0.06) 0 3px, transparent 4px)'
      };

      return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
          {/* Twinkling Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
              className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"
              style={{
                top: `${Math.random() * 70}%`,
                left: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`
              }}
            />
          ))}

          {/* Ambient Glow - wide, soft */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.22, 0.38, 0.22] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-slate-300/10 blur-3xl rounded-full"
          />
          {/* Ambient Glow - tight, closer to the disc */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-6px] right-[14px] w-36 h-36 bg-slate-200/20 blur-2xl rounded-full"
          />
          {/* Dynamic Phase Moon - curved terminator via two overlapping discs */}
          <div className="absolute top-[-10px] right-[10px] w-24 h-24 rounded-full overflow-hidden" style={moonBaseStyle}>
            <div className="absolute inset-0 rounded-full mix-blend-multiply" style={craterStyle} />
            <div
              className="absolute inset-0 rounded-full transition-transform duration-1000"
              style={{
                transform: `translateX(${shadowOffset}px)`,
                // Mostly-opaque so it reads as genuinely dark, but not fully opaque -
                // a hint of the lit disc's own gradient still shows through as "earthshine"
                // instead of a flat black cutout.
                background: 'radial-gradient(circle at 70% 75%, rgba(120,132,156,0.82) 0%, rgba(55,60,78,0.92) 55%, rgba(12,13,18,0.97) 100%)',
                filter: 'blur(7px)'
              }}
            />
            <motion.div
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: 'inset 1.5px 1.5px 2px rgba(255,255,255,0.45)' }}
            />
          </div>
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
