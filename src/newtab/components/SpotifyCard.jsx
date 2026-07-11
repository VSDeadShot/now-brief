import React, { useState } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ThumbsUp, Shuffle, Cast } from 'lucide-react';

export default function SpotifyCard() {
  const [isPlaying, setIsPlaying] = useState(true);

  const song = {
    title: "Nobody (from Kaiju No. 8)",
    artist: "OneRepublic",
    progress: 58, 
    currentTime: "01:30",
    totalTime: "02:34",
    color: "#E86F36", // Signature orange
    waveColor: "#9c4a24" // Darker orange for the wave body
  };

  return (
    <Card className="relative overflow-hidden p-4 group text-white h-[180px] flex flex-col justify-between rounded-[28px] bg-[#141414]">
      
      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center text-[13px] font-semibold opacity-90 px-1">
        <span>This phone</span>
        <button className="text-white hover:text-white/80 transition-colors">
          <Cast size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Track Info (Centered) */}
      <div className="relative z-10 flex justify-center items-center gap-2 mt-4">
        {/* Tiny record/disc icon */}
        <div className="w-[14px] h-[14px] rounded-full border-[2px] border-white flex items-center justify-center">
           <div className="w-[3px] h-[3px] bg-white rounded-full" />
        </div>
        <h3 className="font-bold text-[15px] truncate tracking-tight">
          {song.title} <span className="font-normal text-white/70">• {song.artist}</span>
        </h3>
      </div>

      {/* Samsung Style Wavy Progress Bar */}
      <div className="relative z-10 w-full mt-4">
        {/* Background track line (gray) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[3px] bg-white/20 rounded-full" />
        
        {/* Wavy Container */}
        <div 
          className="absolute top-1/2 -translate-y-[calc(50%-1.5px)] left-0 flex items-end overflow-hidden"
          style={{ width: `${song.progress}%`, height: '50px' }}
        >
          {/* Animated Wave SVG */}
          {isPlaying ? (
            <motion.svg 
              className="absolute left-0 bottom-0 w-[200%] h-[35px]" 
              style={{ color: song.waveColor }}
              viewBox="0 0 200 35" 
              preserveAspectRatio="none"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <path 
                d="M 0 35 C 20 35, 30 5, 50 15 C 70 25, 80 5, 100 15 C 120 25, 130 5, 150 15 C 170 25, 180 35, 200 35 L 200 35 L 0 35 Z" 
                fill="currentColor" 
              />
            </motion.svg>
          ) : (
            <svg className="absolute left-0 bottom-0 w-[200%] h-[35px]" style={{ color: song.waveColor }} viewBox="0 0 200 35" preserveAspectRatio="none">
              <path d="M 0 35 L 200 35 L 200 35 L 0 35 Z" fill="currentColor" />
            </svg>
          )}
          
          {/* Base active colored line */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[3px] rounded-l-full" 
            style={{ backgroundColor: song.color }}
          />
        </div>

        {/* Scrubber Knob */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full border-[2.5px] border-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform"
          style={{ left: `${song.progress}%`, backgroundColor: song.color }}
        />
        
        {/* Timestamps */}
        <div className="flex justify-between text-[11px] text-white/60 mt-3 font-medium px-1">
          <span>{song.currentTime}</span>
          <span>{song.totalTime}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="relative z-10 flex justify-between items-center px-4 mt-2">
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
