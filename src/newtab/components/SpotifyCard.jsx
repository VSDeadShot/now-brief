import React, { useState } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ThumbsUp, Shuffle, Cast } from 'lucide-react';

export default function SpotifyCard() {
  const [isPlaying, setIsPlaying] = useState(true);

  const song = {
    title: "Nobody (from Kaiju No. 8)",
    artist: "OneRepublic",
    progress: 68,
    currentTime: "01:47",
    totalTime: "02:34",
    // Simulated colors extracted from the album artwork
    colors: {
      primary: "#f48c06",
      secondary: "#dc2f02",
      accent: "#ffba08"
    }
  };

  return (
    <Card className="relative overflow-hidden p-5 pb-6 group text-white min-h-[180px] flex flex-col justify-between rounded-[28px]">
      {/* Background is a deep purple/indigo gradient matching the screenshot */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a293e] to-[#1c1b2b] z-0" />

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center text-[13px] font-semibold opacity-90 px-1">
        <span>This phone</span>
        <button className="text-white hover:text-white/80 transition-colors">
          <Cast size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Track Info (Centered) */}
      <div className="relative z-10 flex justify-center items-center gap-2 mt-4">
        {/* Animated Equalizer */}
        <div className="flex items-end gap-[2px] h-[14px]">
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color, animationDelay: '0s' }} 
          />
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color, animationDelay: '0.15s' }} 
          />
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color, animationDelay: '0.3s' }} 
          />
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color, animationDelay: '0.1s' }} 
          />
        </div>
        <h3 className="font-bold text-[15px] truncate tracking-tight">
          {song.title} <span className="font-normal text-white/70">• {song.artist}</span>
        </h3>
      </div>

      {/* Samsung Style Gradient Waveform Progress Bar */}
      <div className="relative z-10 w-full mt-2">
        
        {/* Track Area Container (Explicit Height) */}
        <div className="relative w-full h-[34px] flex items-end">
          {/* Unplayed Track (Gray) */}
          <div className="absolute bottom-[2px] left-0 right-0 h-[4px] bg-white/20 rounded-full" />
          
          {/* Played Track Container (Clipped to Progress Percentage) */}
          <div 
            className="absolute bottom-[2px] left-0 flex items-end overflow-hidden h-[30px]"
            style={{ width: `${song.progress}%` }}
          >
            {/* Animated SVG Waveform */}
            <svg 
              className="absolute left-0 bottom-[2px] h-[28px] w-full"
              viewBox="0 0 100 28"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradientFront" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={song.colors.secondary} />
                  <stop offset="50%" stopColor={song.colors.accent} />
                  <stop offset="100%" stopColor={song.colors.primary} />
                </linearGradient>
                
                <linearGradient id="waveGradientBack" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={song.colors.secondary} stopOpacity="0.4" />
                  <stop offset="50%" stopColor={song.colors.primary} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={song.colors.secondary} stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <motion.path 
                d="M 0 28 C 10 28, 20 8, 50 15 C 80 22, 90 8, 100 12 L 100 28 L 0 28 Z" 
                fill="url(#waveGradientBack)"
                animate={isPlaying ? { scaleY: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { scaleY: 1, opacity: 0.7 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ originY: 1 }}
              />

              <motion.path 
                d="M 0 28 C 15 28, 25 15, 50 18 C 75 21, 85 12, 100 16 L 100 28 L 0 28 Z" 
                fill="url(#waveGradientFront)" 
                animate={isPlaying ? { scaleY: [1, 1.15, 1] } : { scaleY: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                style={{ originY: 1 }}
              />
            </svg>

            {/* Perfect HTML Base Line to prevent SVG radius stretching */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[4px] rounded-full"
              style={{ background: `linear-gradient(to right, ${song.colors.secondary}, ${song.colors.accent}, ${song.colors.primary})` }}
            />
          </div>

          {/* Scrubber Knob with Glowing Aura */}
          <div 
            className="absolute bottom-[2px] w-[18px] h-[18px] rounded-full border-[3.5px] border-white transform -translate-x-1/2 translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
            style={{ 
              left: `${song.progress}%`,
              backgroundColor: song.colors.primary,
              boxShadow: `0 0 14px 2px ${song.colors.primary}80`
            }}
          />
        </div>
        
        {/* Timestamps */}
        <div className="flex justify-between text-[11.5px] text-white/70 mt-1 font-medium px-1">
          <span>{song.currentTime}</span>
          <span>{song.totalTime}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="relative z-10 flex justify-between items-center px-4 mt-4">
        <button className="text-white hover:text-white/80 transition-colors">
          <ThumbsUp size={20} strokeWidth={2} />
        </button>
        <button className="text-white hover:text-white/80 transition-colors">
          <SkipBack size={24} className="fill-current" strokeWidth={1} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
          className="text-white hover:scale-110 transition-transform active:scale-95"
        >
          {isPlaying ? (
            <Pause size={32} className="fill-current" strokeWidth={1} />
          ) : (
            <Play size={32} className="fill-current" strokeWidth={1} />
          )}
        </button>
        <button className="text-white hover:text-white/80 transition-colors">
          <SkipForward size={24} className="fill-current" strokeWidth={1} />
        </button>
        <button className="text-white hover:text-white/80 transition-colors">
          <Shuffle size={20} strokeWidth={2} />
        </button>
      </div>

    </Card>
  );
}
