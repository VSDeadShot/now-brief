import React, { useState } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function SpotifyCard() {
  const [isPlaying, setIsPlaying] = useState(true);

  // Mock data for now to show the premium UI
  const song = {
    title: "Starboy",
    artist: "The Weeknd, Daft Punk",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
    progress: 45 // percentage
  };

  return (
    <Card className="relative overflow-hidden p-4 group cursor-pointer text-white h-[140px]">
      {/* Blurred Album Background */}
      <div 
        className="absolute inset-0 z-0 opacity-50 blur-xl scale-110 transition-transform duration-700 group-hover:scale-125"
        style={{ 
          backgroundImage: `url(${song.albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* Top Header Row */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {/* Album Art Icon */}
            <motion.div 
              className="w-14 h-14 rounded-md overflow-hidden shadow-2xl relative flex-shrink-0"
              whileHover={{ scale: 1.05 }}
            >
              <img src={song.albumArt} alt="Album Art" className="w-full h-full object-cover" />
              {/* Playing Equalizer Animation overlay */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-[2px]">
                  <motion.div animate={{ height: [4, 10, 4] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 bg-white rounded-full" />
                  <motion.div animate={{ height: [8, 14, 8] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                  <motion.div animate={{ height: [5, 12, 5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1 bg-white rounded-full" />
                </div>
              )}
            </motion.div>
            
            {/* Track Info */}
            <div className="flex flex-col min-w-0">
              <h3 className="font-bold text-[15px] leading-tight truncate text-white drop-shadow-md">{song.title}</h3>
              <p className="text-xs text-white/70 truncate drop-shadow-md">{song.artist}</p>
            </div>
          </div>

          {/* Spotify Logo SVG */}
          <div className="text-[#1DB954] w-6 h-6 flex-shrink-0 drop-shadow-md ml-2">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.6.3 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.42.18.6.78.24 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781s.18-1.2.78-1.381c4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.5.36h-.12z"/>
            </svg>
          </div>
        </div>

        {/* Controls & Progress */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${song.progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          {/* Playback Controls */}
          <div className="flex justify-between items-center px-4">
            <button className="text-white/70 hover:text-white transition-colors p-1">
              <SkipBack size={18} className="fill-current" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-md"
            >
              {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}
            </button>
            <button className="text-white/70 hover:text-white transition-colors p-1">
              <SkipForward size={18} className="fill-current" />
            </button>
          </div>
        </div>

      </div>
    </Card>
  );
}
