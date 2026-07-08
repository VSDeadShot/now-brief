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
  
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-start bg-[#121212] text-[#F5F5F5] font-sans overflow-y-auto">
      <div className="w-full max-w-2xl py-8">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">{greeting}, Vedansh</h1>
        <p className="text-[#A0A0A0] font-medium mb-8">{dateString}</p>
        
        <div className="flex flex-col gap-3 w-full">
          <OmniTaskCard />
          <WeatherCard />
          <DsaReviewCard />
          <GithubStreakCard />
          <SamsungNewsCard />
          <TechNewsCard />
        </div>
      </div>
    </div>
  );
}
