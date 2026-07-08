import React from 'react';
import GithubStreakCard from './components/GithubStreakCard';
import WeatherCard from './components/WeatherCard';
import DsaReviewCard from './components/DsaReviewCard';
import OmniTaskCard from './components/OmniTaskCard';
import SamsungNewsCard from './components/SamsungNewsCard';
import TechNewsCard from './components/TechNewsCard';

export default function NewTab() {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay = 'evening';
  let greeting = 'Evening brief';
  let subtitle = "Here's a recap of your day.";
  let baseBgClass = "bg-[#050a0d] text-white";
  let blob1Class = "bg-[#0f2a33]";
  let blob2Class = "bg-[#111e24]";
  let highlightClass = "text-teal-400";

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
    greeting = 'Morning brief';
    subtitle = "Start your day with this briefing.";
    baseBgClass = "bg-[#d5e8ff] text-[#1A1A1A]";
    blob1Class = "bg-[#e0f0ff]";
    blob2Class = "bg-[#cbe5ff]";
    highlightClass = "text-blue-500";
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
    greeting = 'Have a good day';
    subtitle = "Hope your day is going as planned.";
    baseBgClass = "bg-[#0a120c] text-white";
    blob1Class = "bg-[#163321]";
    blob2Class = "bg-[#112217]";
    highlightClass = "text-emerald-400";
  }

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center justify-start font-sans overflow-y-auto relative z-0 ${baseBgClass}`}>
      {/* Animated Aurora Background Mesh (Top and Bottom Halves) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        {/* Top Half Blob */}
        <div className={`absolute top-[-20%] left-[-20%] w-[140vw] h-[70vh] rounded-[100%] mix-blend-screen filter blur-[100px] opacity-70 animate-blob1 ${blob1Class}`}></div>
        {/* Bottom Half Blob */}
        <div className={`absolute bottom-[-20%] right-[-20%] w-[140vw] h-[70vh] rounded-[100%] mix-blend-screen filter blur-[120px] opacity-70 animate-blob2 ${blob2Class}`}></div>
      </div>
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
          </div>
          
        </div>
      </div>

    </div>
  );
}
