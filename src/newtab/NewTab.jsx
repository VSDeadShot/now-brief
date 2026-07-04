import React from 'react';
import GithubStreakCard from './components/GithubStreakCard';

export default function NewTab() {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-start bg-black text-white font-sans overflow-y-auto">
      <div className="w-full max-w-2xl py-12">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">{greeting}, Vedansh</h1>
        <p className="text-zinc-400 font-medium mb-10">Here is your daily brief.</p>
        
        <div className="flex flex-col gap-6 w-full">
          <GithubStreakCard />
        </div>
      </div>
    </div>
  );
}
