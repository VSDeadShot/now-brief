import { fetchWeather } from '../lib/weather';
import { fetchDsaReviews } from '../lib/dsaTracker';
import { fetchGithubActivity } from '../lib/github';
import { fetchOmniTasks } from '../lib/omnitask';
import { fetchNews } from '../lib/news';
import { setCache } from '../lib/cache';

const ALARM_NAME = 'refresh_now_brief_data';

chrome.runtime.onInstalled.addListener(() => {
  console.log("Now Brief installed. Setting up background refresh.");
  
  // Set an alarm to fire every 15 minutes
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 15
  });
  
  // Trigger an initial fetch immediately on install
  refreshAllData();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log("Alarm triggered. Refreshing data...");
    refreshAllData();
  }
});

async function refreshAllData() {
  try {
    const [weather, dsa, github, omni, samsungNews, techNews] = await Promise.allSettled([
      fetchWeather('Jaipur'),
      fetchDsaReviews(),
      fetchGithubActivity('VSDeadShot'),
      fetchOmniTasks(),
      fetchNews('samsung'),
      fetchNews('tech')
    ]);

    if (weather.status === 'fulfilled' && weather.value) await setCache('weather_data', weather.value);
    if (dsa.status === 'fulfilled' && dsa.value) await setCache('dsa_reviews', dsa.value);
    if (github.status === 'fulfilled' && github.value) await setCache('github_streak', github.value);
    if (omni.status === 'fulfilled' && omni.value) await setCache('omnitask_data', omni.value);
    if (samsungNews.status === 'fulfilled' && samsungNews.value) await setCache('samsung_news', samsungNews.value);
    if (techNews.status === 'fulfilled' && techNews.value) await setCache('tech_news', techNews.value);
    
    console.log("Background data refresh complete.");
  } catch (error) {
    console.error("Failed to refresh data in background:", error);
  }
}
