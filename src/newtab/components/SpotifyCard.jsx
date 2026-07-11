import React, { useState } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ThumbsUp } from 'lucide-react';

export default function SpotifyCard() {
  const [isPlaying, setIsPlaying] = useState(true);

  // Mock data mimicking the Samsung Music widget screenshot exactly
  const song = {
    title: "Nobody (from Kaiju No. 8)",
    artist: "OneRepublic",
    // We'll use a cool dark fantasy album art that matches the screenshot's vibe
    albumArt: "https://i.scdn.co/image/ab67616d0000b273b64c0ed79c322b2707f1396b", 
    progress: 58, // percentage (01:30 out of 02:34 is ~58%)
    currentTime: "01:30",
    totalTime: "02:34",
    color: "#E86F36" // Signature orange from the screenshot
  };

  return (
    <Card className="relative overflow-hidden p-5 group cursor-pointer text-white min-h-[180px] flex flex-col justify-between rounded-3xl border border-white/10">
      {/* Full Screen Album Art Background */}
      <div 
        className="absolute inset-0 z-0 opacity-70 transition-transform duration-700 group-hover:scale-105"
        style={{ 
          backgroundImage: `url(${song.albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {/* Heavy vignette for contrast like in screenshot */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Top Header: Source & Cast Icon */}
      <div className="relative z-10 flex justify-between items-center text-[12.5px] font-bold opacity-90 mb-4">
        <span>This phone</span>
        <div className="border-[1.5px] border-white rounded-full p-[3px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/>
            <line x1="2" y1="20" x2="2.01" y2="20"/>
          </svg>
        </div>
      </div>

      {/* Track Info (Centered) */}
      <div className="relative z-10 flex justify-center items-center gap-1.5 mb-6">
        {/* Tiny record/disc icon */}
        <div className="w-[14px] h-[14px] rounded-full border-[2px] border-white flex items-center justify-center opacity-80">
           <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <h3 className="font-bold text-[14px] truncate drop-shadow-md tracking-tight">
          {song.title} <span className="font-medium opacity-80">• {song.artist}</span>
        </h3>
      </div>

      {/* Samsung Style Wavy Progress Bar */}
      <div className="relative z-10 w-full mb-5 mt-2">
        {/* Background track line (gray) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[4px] bg-white/30 rounded-full" />
        
        {/* The Animated Wave Container (clips to progress) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center overflow-hidden"
          style={{ width: `${song.progress}%`, height: '40px' }}
        >
          {/* Base active colored line */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[4px] rounded-l-full" 
            style={{ backgroundColor: song.color }}
          />
          
          {/* Pulsing Wavy Mountain SVG (Faked Audio Equalizer) */}
          {isPlaying && (
            <motion.svg 
              className="absolute left-[10%] bottom-[50%] w-[80%] h-[20px] opacity-70" 
              style={{ color: song.color }}
              viewBox="0 0 100 20" 
              preserveAspectRatio="none"
              animate={{ scaleY: [1, 2.5, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M0 20 Q 25 20, 50 0 T 100 20 Z" fill="currentColor" />
            </motion.svg>
          )}
        </div>

        {/* Scrubber Knob with White Ring */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-[3px] border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] transform -translate-x-1/2"
          style={{ left: `${song.progress}%`, backgroundColor: song.color }}
        />
        
        {/* Timestamps */}
        <div className="flex justify-between text-[11px] opacity-75 mt-[18px] font-medium">
          <span>{song.currentTime}</span>
          <span>{song.totalTime}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="relative z-10 flex justify-between items-center px-2">
        <button className="text-white hover:scale-110 transition-transform">
          <ThumbsUp size={20} strokeWidth={2.5} />
        </button>
        <button className="text-white hover:scale-110 transition-transform">
          <SkipBack size={26} className="fill-current" strokeWidth={1} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
          className="text-white hover:scale-110 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause size={30} className="fill-current" strokeWidth={1} /> : <Play size={30} className="fill-current" strokeWidth={1} />}
        </button>
        <button className="text-white hover:scale-110 transition-transform">
          <SkipForward size={26} className="fill-current" strokeWidth={1} />
        </button>
        <button className="text-white hover:scale-110 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
        </button>
      </div>

    </Card>
  );
}
