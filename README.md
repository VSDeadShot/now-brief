# Now Brief

A sleek, highly personalized daily dashboard browser extension that overrides your New Tab page. Built with a focus on instantaneous loading, beautiful glassmorphism aesthetics (inspired by Samsung's design language), and robust background caching.

## ✨ Features

Now Brief aggregates everything you need into a single, instantly loading feed:
- **OmniTask**: Syncs locally with your OmniTask desktop app to show pending tasks due today, complete with priority indicators and project badges.
- **Local Weather**: Real-time weather data for your area, fetched securely via a backend proxy.
- **DSA Tracker**: Pulls your daily due reviews directly from your live DSA Tracker app.
- **GitHub Streak**: Tracks your daily commit streak and contribution count for the day.
- **Curated News**: Fetches and parses RSS feeds for Samsung News (SamMobile) and General Tech News (The Verge), providing clean, truncated excerpts.

## 🏗️ Architecture & Stack

- **Frontend Core**: React, Vite, and CRXJS (Manifest V3).
- **Styling & Animation**: Tailwind CSS and Framer Motion for smooth, spring-based micro-animations and AMOLED dark mode glassmorphism.
- **Caching Engine**: Utilizes `chrome.storage.local` to render cached data *instantly* on tab open, completely eliminating layout shift.
- **Background Worker**: A background service worker uses `chrome.alarms` to silently wake up every 15 minutes, fetch all APIs in parallel, and update the cache so it's never stale.
- **Proxy Server**: A custom Vercel/Express backend proxy (`/proxy`) handles the heavy lifting for Weather, DSA, and News fetching. This bypasses browser CORS restrictions and keeps sensitive API keys completely out of the client bundle.

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm install
cd proxy
npm install
cd ..
```

### 2. Environment Variables
Create a `.env` file inside the `/proxy` directory and add your secret keys:
```env
OPENWEATHER_API_KEY=your_openweathermap_key
NOW_BRIEF_SECRET=your_dsa_tracker_secret
```

### 3. Run the Proxy Server
The local proxy must be running to fetch Weather, DSA, and News data:
```bash
cd proxy
node server.js
# Runs on http://localhost:3000
```

### 4. Run the Extension
```bash
npm run dev
```
Vite and CRXJS will start a local dev server and output an unpacked extension. 
Go to `chrome://extensions`, enable **Developer Mode**, click **Load unpacked**, and select the `dist` folder. The extension will hot-reload as you edit React components!

*(Note: To see your OmniTask data, ensure your OmniTask Electron desktop app is running in the background so its local API is active on port 3001).*
