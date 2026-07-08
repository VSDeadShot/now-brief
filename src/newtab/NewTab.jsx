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
  let bgClass = "bg-gradient-to-b from-[#111e24] to-[#0a0a0a] text-white";
  let highlightClass = "text-teal-400";

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
    greeting = 'Morning brief';
    subtitle = "Start your day with this briefing.";
    bgClass = "bg-gradient-to-b from-[#e0f0ff] to-[#cbe5ff] text-[#1A1A1A]";
    highlightClass = "text-blue-500";
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
    greeting = 'Have a good day';
    subtitle = "Hope your day is going as planned.";
    bgClass = "bg-gradient-to-b from-[#112217] to-[#0a0a0a] text-white";
    highlightClass = "text-emerald-400";
  }

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center justify-start font-sans overflow-y-auto ${bgClass}`}>
      <div className="w-full max-w-2xl py-8 flex flex-col gap-8">
        
        {/* Main Header */}
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <h1 className="text-[42px] font-bold leading-tight tracking-tight">{greeting}</h1>
          <p className="text-xl font-normal opacity-90">{subtitle}</p>
        </div>

        {/* Weather Section */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-lg opacity-90">Here is your weather outlook.</p>
          <WeatherCard timeOfDay={timeOfDay} />
        </div>

        {/* Targets Section */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <p className="text-lg opacity-90">
            The day isn't over yet. There's still time to make progress on your <span className={highlightClass}>daily targets</span>.
          </p>
          <OmniTaskCard timeOfDay={timeOfDay} />
          <DsaReviewCard timeOfDay={timeOfDay} />
        </div>

        {/* Developer Activity Section */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <p className="text-lg opacity-90">
            Here's a summary of your <span className={highlightClass}>developer activity</span>.
          </p>
          <GithubStreakCard timeOfDay={timeOfDay} />
        </div>

        {/* News Section */}
        <div className="flex flex-col gap-3 w-full mt-4 mb-16">
          <p className="text-lg opacity-90">
            Let's get you caught up on the day's <span className={highlightClass}>news</span>.
          </p>
          <SamsungNewsCard timeOfDay={timeOfDay} />
          <TechNewsCard timeOfDay={timeOfDay} />
        </div>

      </div>
    </div>
  );
}
