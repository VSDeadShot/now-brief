import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { Play } from 'lucide-react';
import { getCache, setCache } from '../../lib/cache';

// Using local dev server for now until we deploy the proxy
const PROXY_URL = 'http://localhost:3000';

async function fetchYoutubeVideos() {
  try {
    const res = await fetch(`${PROXY_URL}/api/youtube`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('YouTube fetch error:', error);
    return null;
  }
}

function generateFakeViews(id) {
  // Simple hash string to get deterministic random number for views
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const count = Math.abs(hash) % 900000 + 10000;
  return new Intl.NumberFormat('en-US').format(count);
}

function generateFakeDuration(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 3) - hash);
  }
  const mins = (Math.abs(hash) % 15) + 3;
  const secs = Math.abs(hash) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 3600) return 'just now';
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

export default function YoutubeCard({ timeOfDay = 'evening' }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const cached = await getCache('youtube_videos');
      if (cached) {
        setVideos(cached);
        setLoading(false);
      }

      const fresh = await fetchYoutubeVideos();
      if (fresh && fresh.length > 0) {
        setVideos(fresh);
        setCache('youtube_videos', fresh);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const isLight = timeOfDay === 'morning';
  const subTextColor = isLight ? "text-[#6E6E6E]" : "text-[#A0A0A0]";

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className={`text-lg font-medium px-2 ${isLight ? 'text-black' : 'text-white'}`}>
        Check out these <span className="text-blue-400 font-normal">YouTube videos.</span>
      </div>

      <Card 
        className="relative overflow-hidden h-[240px] !p-0 shadow-xl cursor-pointer group"
        onClick={() => {
          if (videos[currentIndex]) {
            window.open(videos[currentIndex].link, '_blank');
          }
        }}
      >
        {loading && !videos.length ? (
          <div className={`w-full h-full animate-pulse ${isLight ? 'bg-black/5' : 'bg-white/5'}`}></div>
        ) : videos.length > 0 ? (
          <>
            <motion.img 
              key={`img-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={videos[currentIndex].thumbnail} 
              alt="thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* YouTube Logo in top right */}
            <div className="absolute top-4 right-4 bg-[#FF0000] rounded-lg p-1.5 shadow-lg">
              <Play size={16} fill="white" className="text-white" />
            </div>

            {/* Content at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1.5 pb-8">
              <motion.h3 
                key={`title-${currentIndex}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-white font-bold text-lg leading-tight line-clamp-2"
              >
                {videos[currentIndex].title}
              </motion.h3>
              
              <motion.div 
                key={`meta-${currentIndex}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-1.5 text-white/70 text-sm font-medium"
              >
                <span>{generateFakeViews(videos[currentIndex].id)} views</span>
                <span>•</span>
                <span>{timeAgo(videos[currentIndex].publishedAt)}</span>
              </motion.div>

              <motion.div 
                key={`channel-${currentIndex}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center justify-between mt-1"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] text-white font-bold uppercase">
                      {videos[currentIndex].channelName.substring(0, 2)}
                    </span>
                  </div>
                  <span className="text-white/90 text-sm">{videos[currentIndex].channelName}</span>
                </div>
                
                <div className="bg-white/20 px-2 py-0.5 rounded-md text-white text-xs font-semibold backdrop-blur-sm">
                  {generateFakeDuration(videos[currentIndex].id)}
                </div>
              </motion.div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {videos.slice(0, 8).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60 w-1.5'}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/50 text-sm">
            Could not load videos.
          </div>
        )}
      </Card>
    </div>
  );
}
