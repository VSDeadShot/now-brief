import React, { useMemo, useState, useEffect } from 'react';
import GithubStreakCard from './components/GithubStreakCard';
import WeatherCard from './components/WeatherCard';
import DsaReviewCard from './components/DsaReviewCard';
import OmniTaskCard from './components/OmniTaskCard';
import SamsungNewsCard from './components/SamsungNewsCard';
import TechNewsCard from './components/TechNewsCard';
import YoutubeCard from './components/YoutubeCard';
import SpotifyCard from './components/SpotifyCard';
import SettingsPanel from './components/SettingsPanel';

export default function NewTab() {
  const [customWallpaper, setCustomWallpaper] = useState(null);

  // Fetch custom wallpaper on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['custom_wallpaper'], (result) => {
        if (result.custom_wallpaper) {
          setCustomWallpaper(result.custom_wallpaper);
        }
      });
    }
  }, []);
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
  
  let timeOfDay = 'evening';
  let greeting = 'Evening brief';
  let possibleSubtitles = [];
  let baseBgClass = "bg-[#050a0d] text-white";
  let blob1Class = "bg-[#0f2a33]";
  let blob2Class = "bg-[#111e24]";
  let highlightClass = "text-teal-400";

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
    greeting = 'Morning brief';
    possibleSubtitles = ["Good morning.", "Rise and shine.", "Ready to start the day?", "Hope you have a great day."];
    baseBgClass = "bg-[#d5e8ff] text-[#1A1A1A]";
    blob1Class = "bg-[#e0f0ff]";
    blob2Class = "bg-[#cbe5ff]";
    highlightClass = "text-blue-500";
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
    greeting = 'Midday brief';
    possibleSubtitles = ["Enjoy the rest of your day.", "Good afternoon.", "Hope your day is going well.", "Hope your day is going as planned."];
    baseBgClass = "bg-[#0a120c] text-white";
    blob1Class = "bg-[#163321]";
    blob2Class = "bg-[#112217]";
    highlightClass = "text-emerald-400";
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening';
    greeting = 'Evening brief';
    possibleSubtitles = ["Good evening.", "Time to wind down.", "Hope you had a great day.", "Here's a recap of your day."];
  } else {
    // Night (9:00 PM to 4:59 AM)
    timeOfDay = 'evening'; // Keep evening visual theme
    greeting = 'Night brief';
    possibleSubtitles = ["Time for bed.", "Sweet dreams.", "Rest well.", "Time to disconnect and recharge."];
  }

  // Contextual / Day-Specific overrides
  if (day === 1 && hour < 12) {
    possibleSubtitles.push("Start your week strong.");
  }
  if ((day === 5 && hour >= 17) || day === 6 || day === 0) {
    possibleSubtitles.push("Enjoy your weekend.");
  }

  // Pick one randomly and memoize it so it doesn't flicker on re-renders
  const subtitle = useMemo(() => {
    return possibleSubtitles[Math.floor(Math.random() * possibleSubtitles.length)];
  }, [hour]);

  // If a custom wallpaper is active, we make the base background completely transparent so the image shows through.
  const containerBgClass = customWallpaper ? 'bg-transparent text-white' : baseBgClass;
  const isLight = timeOfDay === 'morning';

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center justify-start font-sans overflow-y-auto relative z-0 ${containerBgClass}`}>
      
      {/* Custom Wallpaper Layer */}
      {customWallpaper && (
        <div 
          className="fixed inset-0 z-[-2] bg-cover bg-center transition-opacity duration-500"
          style={{ backgroundImage: `url(${customWallpaper})` }}
        />
      )}

      {/* Animated Aurora Background Mesh (Top and Bottom Halves) - Hidden if custom wallpaper is used */}
      {!customWallpaper && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
          {/* Top Half Blob */}
          <div className={`absolute top-[-20%] left-[-20%] w-[140vw] h-[70vh] rounded-[100%] mix-blend-screen filter blur-[100px] opacity-70 animate-blob1 ${blob1Class}`}></div>
          {/* Bottom Half Blob */}
          <div className={`absolute bottom-[-20%] right-[-20%] w-[140vw] h-[70vh] rounded-[100%] mix-blend-screen filter blur-[120px] opacity-70 animate-blob2 ${blob2Class}`}></div>
        </div>
      )}
      <div className="w-full max-w-5xl py-8 flex flex-col gap-8">
        
        {/* Main Header */}
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <h1 className="text-[42px] font-bold leading-tight tracking-tight">{greeting}</h1>
          <p className="text-xl font-normal opacity-90">{subtitle}</p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {/* Weather Section */}
            <div className="flex flex-col gap-3 w-full">
              <p className="text-lg opacity-90">Here is your weather outlook.</p>
              <WeatherCard timeOfDay={timeOfDay} />
            </div>

            {/* Targets Section */}
            <div className="flex flex-col gap-3 w-full">
              <p className="text-lg opacity-90">
                The day isn't over yet. There's still time to make progress on your <span className={highlightClass}>daily targets</span>.
              </p>
              <OmniTaskCard timeOfDay={timeOfDay} />
              <DsaReviewCard timeOfDay={timeOfDay} />
            </div>

            {/* Developer Activity Section */}
            <div className="flex flex-col gap-3 w-full">
              <p className="text-lg opacity-90">
                Here's a summary of your <span className={highlightClass}>developer activity</span>.
              </p>
              <GithubStreakCard timeOfDay={timeOfDay} />
            </div>

            {/* YouTube Section */}
            <YoutubeCard timeOfDay={timeOfDay} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* News Section */}
            <div className="flex flex-col gap-3 w-full mb-16">
              <p className="text-lg opacity-90">
                Let's get you caught up on the day's <span className={highlightClass}>news</span>.
              </p>
              <SamsungNewsCard timeOfDay={timeOfDay} />
              <TechNewsCard timeOfDay={timeOfDay} />
            </div>

            {/* Spotify Section */}
            <div className="flex flex-col gap-3 w-full">
              <p className="text-lg opacity-90">
                Unwind with your <span className={highlightClass}>music</span>.
              </p>
              <SpotifyCard timeOfDay={timeOfDay} />
            </div>
          </div>
          
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isLight={isLight} 
        onWallpaperChange={setCustomWallpaper} 
      />

    </div>
  );
}
