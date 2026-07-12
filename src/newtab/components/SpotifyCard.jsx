import React, { useState } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ThumbsUp, Shuffle, Cast, AudioLines } from 'lucide-react';

export default function SpotifyCard() {
  const [hasToken, setHasToken] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Check storage for token on mount
  React.useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['spotify_access_token'], (result) => {
        if (result.spotify_access_token) {
          setHasToken(true);
        }
      });
    }
  }, []);

  const handleConnect = () => {
    setIsAuthenticating(true);
    
    if (typeof chrome === 'undefined' || !chrome.identity) {
      alert("Chrome Identity API not available. Make sure you are running as an extension.");
      setIsAuthenticating(false);
      return;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      alert("Please set VITE_SPOTIFY_CLIENT_ID in your .env file!");
      setIsAuthenticating(false);
      return;
    }

    const redirectUri = chrome.identity.getRedirectURL(); 
    const scope = 'user-read-currently-playing';
    
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scope);

    chrome.identity.launchWebAuthFlow({
      url: authUrl.toString(),
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error("Auth flow failed:", chrome.runtime.lastError);
        setIsAuthenticating(false);
        return;
      }

      // Extract code from redirect URL
      const url = new URL(redirectUrl);
      const code = url.searchParams.get('code');
      
      if (code) {
        // Send code to local proxy to exchange for tokens
        // (Assuming proxy runs on localhost:3000 during dev)
        fetch('http://localhost:3000/api/spotify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri })
        })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            chrome.storage.local.set({
              spotify_access_token: data.access_token,
              spotify_refresh_token: data.refresh_token
            }, () => {
              setHasToken(true);
              setIsAuthenticating(false);
            });
          } else {
            console.error("No access token returned:", data);
            setIsAuthenticating(false);
          }
        })
        .catch(err => {
          console.error("Token exchange failed:", err);
          setIsAuthenticating(false);
        });
      } else {
        setIsAuthenticating(false);
      }
    });
  };

  const [song, setSong] = useState(null);

  const fetchCurrentlyPlaying = (token) => {
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(async res => {
      if (res.status === 204) {
        setSong(null);
        return;
      }
      if (res.status === 401) {
        console.warn("Spotify token expired, refreshing silently...");
        chrome.storage.local.get(['spotify_refresh_token'], (result) => {
          if (result.spotify_refresh_token) {
            fetch('http://localhost:3000/api/spotify-refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: result.spotify_refresh_token })
            })
            .then(refreshRes => refreshRes.json())
            .then(data => {
              if (data.access_token) {
                chrome.storage.local.set({
                  spotify_access_token: data.access_token,
                  spotify_refresh_token: data.refresh_token
                }, () => {
                  fetchCurrentlyPlaying(data.access_token);
                });
              } else {
                setHasToken(false);
              }
            })
            .catch(err => {
              console.error("Refresh failed:", err);
              setHasToken(false);
            });
          } else {
            setHasToken(false);
          }
        });
        return;
      }
      if (!res.ok) return;

      const data = await res.json();
      if (data && data.item) {
        const formatTime = (ms) => {
          const totalSeconds = Math.floor(ms / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        const progressPercent = (data.progress_ms / data.item.duration_ms) * 100;
        
        setSong({
          title: data.item.name,
          artist: data.item.artists.map(a => a.name).join(', '),
          progress: progressPercent,
          currentTime: formatTime(data.progress_ms),
          totalTime: formatTime(data.item.duration_ms),
          isPlaying: data.is_playing,
          albumArt: data.item.album.images[0]?.url,
          // Using fallback colors for the waveform until we implement dynamic color extraction
          colors: {
            primary: "#f48c06",
            secondary: "#dc2f02",
            accent: "#ffba08"
          }
        });
        setIsPlaying(data.is_playing);
      }
    })
    .catch(console.error);
  };

  // Poll Spotify API every 3 seconds while connected
  React.useEffect(() => {
    if (!hasToken) return;

    const pullData = () => {
      chrome.storage.local.get(['spotify_access_token'], (result) => {
        if (result.spotify_access_token) {
          fetchCurrentlyPlaying(result.spotify_access_token);
        }
      });
    };

    pullData();
    const interval = setInterval(pullData, 3000);
    return () => clearInterval(interval);
  }, [hasToken]);

  // 1. If not connected, show the connect screen
  if (!hasToken) {
    return (
      <Card className="relative overflow-hidden p-5 group text-white min-h-[180px] flex flex-col justify-center items-center rounded-[28px] border border-white/10 bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/20 to-transparent z-0 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.5)]">
             <AudioLines size={24} className="text-black" />
          </div>
          
          <div>
            <h3 className="font-bold text-lg">Spotify Not Connected</h3>
            <p className="text-xs text-white/60 mt-1 max-w-[200px]">
              Connect your account to display your live currently playing tracks.
            </p>
          </div>

          <button 
            onClick={handleConnect}
            disabled={isAuthenticating}
            className="mt-2 bg-white text-black font-bold text-sm px-6 py-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isAuthenticating ? 'Connecting...' : 'Connect Spotify'}
          </button>
        </div>
      </Card>
    );
  }

  // 2. If connected but nothing is playing
  if (hasToken && !song) {
    return (
      <Card className="relative overflow-hidden p-5 group text-white min-h-[180px] flex flex-col justify-center items-center rounded-[28px] border border-white/10 bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/10 to-transparent z-0 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
             <AudioLines size={24} className="text-white/40" />
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-white/80">Nothing Playing</h3>
            <p className="text-xs text-white/50 mt-1 max-w-[200px]">
              Open Spotify on any device to start listening.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // 3. If connected and playing, show the real UI
  return (
    <Card className="relative overflow-hidden p-5 pb-6 group text-white min-h-[180px] flex flex-col justify-between rounded-[28px]">
      {/* Background is a highly blurred version of the live album art */}
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${song.albumArt})`,
          filter: 'blur(30px) saturate(200%)' 
        }} 
      />
      <div className="absolute inset-0 bg-black/30 z-0" />

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
