import React from 'react';

export default function WeatherEffects({ condition }) {
  if (!condition) return null;

  // We use pure CSS transform animations for zero Javascript overhead and minimal RAM usage.
  
  if (condition === 'Rain' || condition === 'Drizzle') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/40 animate-rain w-[2px] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-40px`,
              height: `${15 + Math.random() * 20}px`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${0.5 + Math.random() * 0.3}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'Snow') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/60 animate-snow rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'Clouds') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 rounded-[24px]">
        <div className="absolute top-[-20%] left-[-10%] w-32 h-32 bg-white/20 blur-2xl rounded-full animate-cloud-slow" />
        <div className="absolute top-[30%] right-[-10%] w-40 h-40 bg-white/10 blur-3xl rounded-full animate-cloud-fast" />
      </div>
    );
  }

  if (condition === 'Thunderstorm') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        <div className="absolute inset-0 bg-white/0 animate-lightning rounded-[24px]" />
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/50 animate-rain w-[2px] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-40px`,
              height: `${20 + Math.random() * 30}px`,
              animationDelay: `${Math.random()}s`,
              animationDuration: `${0.4 + Math.random() * 0.2}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === 'Clear') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-yellow-200/10 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      </div>
    );
  }

  return null;
}
