# Now Brief

A sleek, highly personalized daily dashboard browser extension that overrides your New Tab page. Built with a focus on instantaneous loading, beautiful aesthetics inspired by **Samsung's Now Brief** design language, and robust background caching.

## ✨ Features

Now Brief aggregates everything you need into a single, instantly loading feed, organized into a perfectly balanced **2-column desktop layout**:

- **Dynamic Time-of-Day Theming**: The UI automatically shifts its mood based on the hour.
  - 🌅 **Morning**: Bright whites, light sky-blue Aurora Mesh gradients, and blue accents.
  - 🏙️ **Afternoon**: Deep forest greens and pure dark modes.
  - 🌙 **Evening**: Midnight teals and ultra-dark OLED blacks.
- **Aurora Mesh Backgrounds**: Independent, slowly floating blobs of color in the background simulate an organic, fluid ambiance.
- **Conversational Headers**: Each section greets you with personalized, human-readable context rather than clinical labels.

### Widgets

- **Weather**: Real-time weather data for your area, fetched securely via a backend proxy.
- **OmniTask Targets**: Syncs locally with your OmniTask desktop app to show pending tasks due today, complete with priority indicators and project badges.
- **DSA Tracker**: Pulls your daily due algorithm reviews directly from your live DSA Tracker app.
- **Developer Activity**: Tracks your daily GitHub commit streak and today's contribution count. (Click the card to instantly open your GitHub profile).
- **Curated News**: Fetches and parses RSS feeds for Samsung News (SamMobile) and General Tech News (The Verge), providing clean, truncated excerpts.

## 🏗️ Architecture & Stack

- **Frontend Core**: React, Vite, and CRXJS (Manifest V3).
- **Styling & Animation**: Tailwind CSS and Framer Motion for smooth, spring-based micro-animations and custom CSS keyframes for Aurora Mesh gradients.
- **Caching Engine**: Utilizes `chrome.storage.local` to render cached data *instantly* on tab open, completely eliminating layout shift.
- **Background Worker**: A background service worker uses `chrome.alarms` to silently wake up every 15 minutes, fetch all APIs in parallel, and update the cache so it's never stale.
- **Proxy Server**: A custom Node.js Express backend proxy (`/proxy`) handles the heavy lifting for Weather, DSA, and News fetching, keeping sensitive API keys completely out of the client bundle and bypassing browser CORS.

## 🚀 Installation & Setup

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

### 4. Build the Extension
```bash
npm run build
```
The build process will output an unpacked extension to the `dist` folder. 

### 5. Install in Chrome
1. Go to `chrome://extensions` in your browser.
2. Enable **Developer Mode** (top right corner).
3. Click **Load unpacked** (top left corner).
4. Select the `dist` folder located inside the `Now Brief` project directory.
5. Open a New Tab to see your personalized dashboard!

*(Note: To see your OmniTask data, ensure your OmniTask Electron desktop app is running in the background so its local API is active on port 3001).*
