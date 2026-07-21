# Now Brief

A sleek, highly personalized daily dashboard browser extension that overrides your New Tab page. Built with a focus on instantaneous loading, beautiful aesthetics inspired by **Samsung's Now Brief** design language, and robust background caching.

## ✨ Features

Now Brief aggregates everything you need into a single, instantly loading feed, organized into a perfectly balanced **2-column desktop layout**:

- **Dynamic Time-of-Day Theming**: The UI automatically shifts its mood (colors, gradients, text) based on the hour, morphing seamlessly from a bright morning look to a sleek dark night mode.
- **Contextual Greetings**: Smart randomized greetings that change based on the time of day, with special messages for Monday mornings and the weekend.
- **Bespoke Animations**: Buttery smooth 60fps micro-animations powered by Framer Motion.

### Widgets

- **Weather**: Real-time weather data with incredibly immersive 60fps CSS animations (thunderstorms with lightning, rain, snow, drifting clouds, and an astronomical lunar phase calculator that renders the exact moon phase dynamically at night).
- **Spotify Integration**: Full OAuth 2.0 PKCE integration allowing you to see what's currently playing, play/pause, skip, shuffle, and "like" songs directly from the dashboard. It features a custom HTML5 Canvas color extractor that pulls dominant colors from the live album art and injects them into the UI in real-time, alongside a 60fps interpolated playback progress bar.
- **YouTube Subscriptions**: Instantly fetch and watch the latest videos from your personalized list of favorite creators (wisp, raj shamani, BLOX, etc).
- **Developer Activity**: Tracks your daily GitHub commit streak and today's contribution count. (Click the card to instantly open your GitHub profile).
- **OmniTask Targets**: Syncs locally with your OmniTask desktop app to show pending tasks due today, complete with priority indicators and project badges.
- **DSA Tracker**: Pulls your daily due algorithm reviews directly from your live DSA Tracker app.
- **Curated News**: Fetches and parses RSS feeds for Samsung News (SamMobile) and General Tech News (The Verge), providing clean, truncated excerpts.

## 🏗️ Architecture & Stack

- **Frontend Core**: React, Vite, and CRXJS (Manifest V3).
- **Styling & Animation**: Tailwind CSS and Framer Motion.
- **Caching Engine**: Utilizes `chrome.storage.local` to render cached data *instantly* on tab open, completely eliminating layout shift.
- **Serverless API Handling**: External APIs (like OpenWeatherMap and YouTube) are handled securely. The Spotify integration uses direct **PKCE (Proof Key for Code Exchange)** OAuth, meaning token exchange happens entirely within the extension without needing a backend server or client secret.

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the project and add your required API keys:
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
```
*(Note: Make sure to add the extension's redirect URI to your Spotify Developer Dashboard allowed redirect URIs)*

### 3. Build the Extension
```bash
npm run build
```
The build process will output an unpacked extension to the `dist` folder. 

### 3. Install in Chrome
1. Go to `chrome://extensions` in your browser.
2. Enable **Developer Mode** (top right corner).
3. Click **Load unpacked** (top left corner).
4. Select the `dist` folder located inside the `Now Brief` project directory.
5. Open a New Tab to see your personalized dashboard!

### 5. Spotify Authentication
Click the "Connect Spotify" button on the Spotify card. This will securely open a popup to authenticate with your Spotify account directly via PKCE OAuth, automatically saving the refresh tokens in the background for continuous access.

*(Note: To see your OmniTask data, ensure your OmniTask Electron desktop app is running in the background so its local API is active on port 3001).*
