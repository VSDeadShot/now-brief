import React, { useState } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ThumbsUp, Shuffle, Cast, AudioLines } from 'lucide-react';
import { getAlbumColors } from '../../lib/colors';

// PKCE Utility Functions
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export default function SpotifyCard({ timeOfDay = 'evening' }) {
  const isLight = timeOfDay === 'morning';
  const [hasToken, setHasToken] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [authError, setAuthError] = useState(null);

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
    setAuthError(null);
    setIsAuthenticating(true);
    
    if (typeof chrome === 'undefined' || !chrome.identity) {
      setAuthError("Chrome Identity API not available.");
      setIsAuthenticating(false);
      return;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      setAuthError("Missing Client ID in .env file");
      setIsAuthenticating(false);
      return;
    }

    const redirectUri = chrome.identity.getRedirectURL(); 
    const scope = 'user-read-currently-playing user-modify-playback-state';
    
    const codeVerifier = generateRandomString(64);
    
    sha256(codeVerifier).then(hashed => {
      const codeChallenge = base64encode(hashed);

      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('scope', scope);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('code_challenge', codeChallenge);

      chrome.identity.launchWebAuthFlow({
        url: authUrl.toString(),
        interactive: true
      }, (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          setAuthError(chrome.runtime.lastError?.message || "Auth flow failed or was cancelled.");
          setIsAuthenticating(false);
          return;
        }

        const url = new URL(redirectUrl);
        const code = url.searchParams.get('code');
        
        if (code) {
          // Exchange code for token directly via PKCE
          const body = new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          });

          fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
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
              setAuthError(data.error_description || "Invalid response from auth server.");
              setIsAuthenticating(false);
            }
          })
          .catch(err => {
            setAuthError("Network error during token exchange.");
            setIsAuthenticating(false);
          });
        } else {
          setAuthError("No authorization code received.");
          setIsAuthenticating(false);
        }
      });
    });
  };

  const handleLogout = () => {
    chrome.storage.local.remove(['spotify_access_token', 'spotify_refresh_token'], () => {
      setHasToken(false);
      setSong(null);
    });
  };

  const [song, setSong] = useState(null);
  const [albumColors, setAlbumColors] = useState({
    primary: "#f48c06",
    secondary: "#dc2f02",
    accent: "#ffba08"
  });
  const [localProgressMs, setLocalProgressMs] = useState(0);

  // Sync local progress when the API updates it
  React.useEffect(() => {
    if (song && song.progress_ms !== undefined) {
      setLocalProgressMs(song.progress_ms);
    }
  }, [song?.progress_ms]);

  // Buttery smooth 60fps local progress ticker
  React.useEffect(() => {
    if (!song || !isPlaying) return;
    
    let lastTime = performance.now();
    let frameId;

    const tick = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      
      setLocalProgressMs(prev => {
        const next = prev + delta;
        return next > song.duration_ms ? song.duration_ms : next;
      });
      frameId = requestAnimationFrame(tick);
    };
    
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [song?.duration_ms, isPlaying]);

  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return "00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Dynamically extract colors whenever the album artwork changes
  React.useEffect(() => {
    if (song && song.albumArt) {
      getAlbumColors(song.albumArt)
        .then((colors) => {
          setAlbumColors(colors);
        })
        .catch(err => {
          console.warn("Could not extract album colors (using default orange fallback):", err);
          setAlbumColors({ primary: '#f48c06', secondary: '#dc2f02', accent: '#ffba08' });
        });
    }
  }, [song?.albumArt]);

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
            const body = new URLSearchParams({
              client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
              grant_type: 'refresh_token',
              refresh_token: result.spotify_refresh_token
            });

            fetch('https://accounts.spotify.com/api/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: body.toString()
            })
            .then(refreshRes => refreshRes.json())
            .then(data => {
              if (data.access_token) {
                chrome.storage.local.set({
                  spotify_access_token: data.access_token,
                  spotify_refresh_token: data.refresh_token || result.spotify_refresh_token
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
        setSong({
          title: data.item.name,
          artist: data.item.artists.map(a => a.name).join(', '),
          progress_ms: data.progress_ms,
          totalTime: formatTime(data.item.duration_ms),
          duration_ms: data.item.duration_ms, // Store raw MS for seeking
          isPlaying: data.is_playing,
          albumArt: data.item.album.images[0]?.url
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

  // Playback Control Functions
  const sendPlaybackCommand = (endpoint, method = 'POST', queryParams = '') => {
    chrome.storage.local.get(['spotify_access_token'], (result) => {
      if (result.spotify_access_token) {
        fetch(`https://api.spotify.com/v1/me/player/${endpoint}${queryParams}`, {
          method: method,
          headers: { 'Authorization': `Bearer ${result.spotify_access_token}` }
        }).catch(err => console.error(`Failed to execute ${endpoint}:`, err));
      }
    });
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    // Optimistic UI update
    if (song) setSong({ ...song, isPlaying: newIsPlaying });
    sendPlaybackCommand(newIsPlaying ? 'play' : 'pause', 'PUT');
  };

  const handleNext = (e) => {
    e.stopPropagation();
    sendPlaybackCommand('next');
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    sendPlaybackCommand('previous');
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!song || !song.duration_ms) return;
    
    // Calculate click position percentage relative to the track bounds
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let percent = clickX / rect.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    
    const targetMs = Math.floor(percent * song.duration_ms);
    
    // Optimistic UI update
    setLocalProgressMs(targetMs);
    
    sendPlaybackCommand('seek', 'PUT', `?position_ms=${targetMs}`);
  };

  // 1. If not connected, show the connect screen
  if (!hasToken) {
    return (
      <Card className={`relative overflow-hidden p-5 group min-h-[180px] flex flex-col justify-center items-center rounded-[28px] border ${isLight ? 'bg-white text-black border-black/5' : 'bg-[#1a1a1a] text-white border-white/10'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/20 to-transparent z-0 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.5)]">
             <AudioLines size={24} className={isLight ? "text-white" : "text-black"} />
          </div>
          
          <div>
            <h3 className="font-bold text-lg">Spotify Not Connected</h3>
            <p className={`text-xs mt-1 max-w-[200px] ${isLight ? 'text-black/60' : 'text-white/60'}`}>
              Connect your account to display your live currently playing tracks.
            </p>
          </div>

          <button 
            onClick={handleConnect}
            disabled={isAuthenticating}
            className={`mt-2 font-bold text-sm px-6 py-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 ${isLight ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {isAuthenticating ? 'Connecting...' : 'Connect Spotify'}
          </button>

          {authError && (
            <p className="text-red-400 text-[10px] mt-1 max-w-[200px] leading-tight">
              Error: {authError}
            </p>
          )}
        </div>
      </Card>
    );
  }

  // 2. If connected but nothing is playing
  if (hasToken && !song) {
    return (
      <Card className={`relative overflow-hidden p-5 group min-h-[180px] flex flex-col justify-center items-center rounded-[28px] border ${isLight ? 'bg-white text-black border-black/5' : 'bg-[#1a1a1a] text-white border-white/10'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/10 to-transparent z-0 opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
             <AudioLines size={24} className={isLight ? "text-black/40" : "text-white/40"} />
          </div>
          
          <div>
            <h3 className={`font-bold text-lg ${isLight ? 'text-black/80' : 'text-white/80'}`}>Nothing Playing</h3>
            <p className={`text-xs mt-1 max-w-[200px] ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Open Spotify on any device to start listening.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const currentProgressPercent = song ? (localProgressMs / song.duration_ms) * 100 : 0;

  // 3. If connected and playing, show the real UI
  return (
    <Card className={`relative overflow-hidden p-5 pb-6 group min-h-[180px] flex flex-col justify-between rounded-[28px] ${isLight ? 'text-black bg-white' : 'text-white'}`}>
      {/* Background is a highly blurred version of the live album art */}
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${song.albumArt})`,
          filter: 'blur(30px) saturate(200%)' 
        }} 
      />
      <div className={`absolute inset-0 z-0 ${isLight ? 'bg-white/60' : 'bg-black/30'}`} />

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center text-[13px] font-semibold opacity-90 px-1">
        <span className="cursor-pointer hover:underline" onClick={handleLogout} title="Click to disconnect and re-authenticate">This phone</span>
        <button className={`transition-colors ${isLight ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'}`}>
          <Cast size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Track Info (Centered) */}
      <div className="relative z-10 flex justify-center items-center gap-2 mt-4">
        {/* Animated Equalizer */}
        <div className="flex items-end gap-[2px] h-[14px]">
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color || albumColors.primary, animationDelay: '0s' }} 
          />
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color || albumColors.primary, animationDelay: '0.15s' }} 
          />
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color || albumColors.primary, animationDelay: '0.3s' }} 
          />
          <div 
            className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} 
            style={{ backgroundColor: song.color || albumColors.primary, animationDelay: '0.1s' }} 
          />
        </div>
        <h3 className="font-bold text-[15px] truncate tracking-tight">
          {song.title} <span className={`font-normal ${isLight ? 'text-black/70' : 'text-white/70'}`}>• {song.artist}</span>
        </h3>
      </div>

      {/* Samsung Style Gradient Waveform Progress Bar */}
      <div className="relative z-10 w-full mt-2">
        
        {/* Track Area Container (Explicit Height, Clickable for Seeking) */}
        <div 
          className="relative w-full h-[34px] flex items-end cursor-pointer group/track" 
          onClick={handleSeek}
        >
          {/* Unplayed Track */}
          <div className={`absolute bottom-[2px] left-0 right-0 h-[4px] rounded-full group-hover/track:h-[6px] transition-all ${isLight ? 'bg-black/10' : 'bg-white/20'}`} />
          
          {/* Played Track Container (Clipped to Progress Percentage) */}
          <div 
            className="absolute bottom-[2px] left-0 flex items-end overflow-hidden h-[30px]"
            style={{ width: `${currentProgressPercent}%` }}
          >
            {/* Animated SVG Waveform */}
            <svg 
              className="absolute left-0 bottom-[2px] h-[28px] w-full"
              viewBox="0 0 100 28"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradientFront" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={albumColors.secondary} />
                  <stop offset="50%" stopColor={albumColors.accent} />
                  <stop offset="100%" stopColor={albumColors.primary} />
                </linearGradient>
                
                <linearGradient id="waveGradientBack" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={albumColors.secondary} stopOpacity="0.4" />
                  <stop offset="50%" stopColor={albumColors.primary} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={albumColors.secondary} stopOpacity="0.4" />
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
              className="absolute bottom-0 left-0 w-full h-[4px] rounded-full group-hover/track:h-[6px] transition-all"
              style={{ background: `linear-gradient(to right, ${albumColors.secondary}, ${albumColors.accent}, ${albumColors.primary})` }}
            />
          </div>

          {/* Scrubber Knob with Glowing Aura */}
          <div 
            className="absolute bottom-[2px] w-[18px] h-[18px] rounded-full border-[3.5px] border-white transform -translate-x-1/2 translate-y-1/2 group-hover/track:scale-125 transition-transform"
            style={{ 
              left: `${currentProgressPercent}%`,
              backgroundColor: albumColors.primary,
              boxShadow: `0 0 14px 2px ${albumColors.primary}80`
            }}
          />
        </div>
        
        {/* Timestamps */}
        <div className={`flex justify-between text-[11.5px] mt-1 font-medium px-1 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
          <span>{formatTime(localProgressMs)}</span>
          <span>{song.totalTime}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="relative z-10 flex justify-between items-center px-4 mt-4">
        <button className={`transition-colors ${isLight ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'}`}>
          <ThumbsUp size={20} strokeWidth={2} />
        </button>
        <button className={`transition-colors ${isLight ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'}`} onClick={handlePrev}>
          <SkipBack size={24} className="fill-current" strokeWidth={1} />
        </button>
        <button 
          onClick={togglePlayPause}
          className={`hover:scale-110 transition-transform active:scale-95 ${isLight ? 'text-black' : 'text-white'}`}
        >
          {isPlaying ? (
            <Pause size={32} className="fill-current" strokeWidth={1} />
          ) : (
            <Play size={32} className="fill-current" strokeWidth={1} />
          )}
        </button>
        <button className={`transition-colors ${isLight ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'}`} onClick={handleNext}>
          <SkipForward size={24} className="fill-current" strokeWidth={1} />
        </button>
        <button className={`transition-colors ${isLight ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'}`}>
          <Shuffle size={20} strokeWidth={2} />
        </button>
      </div>

    </Card>
  );
}
