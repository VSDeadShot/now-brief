# Now Brief - Project Changelog & Technical Summary

This document serves as a comprehensive technical log of all features, refactors, and updates applied to the **Now Brief** Chrome Extension project.

## 1. Architecture Migration (Vercel Serverless)
- **Previous Architecture**: Relied on a local Express.js proxy server (`/proxy`) to bypass CORS and hide API keys, which forced the user to manually run a terminal command every day.
- **New Architecture**: Completely migrated to **Vercel Serverless Functions** (`/api`).
  - Implemented stateless API endpoints for Weather, News, YouTube, and Spotify.
  - Eliminated the local proxy dependency.
  - Hardcoded Vercel live URLs into the frontend components.

## 2. Spotify API & Playback Integration
- **OAuth 2.0 Flow**: Implemented a secure Spotify OAuth flow via the Vercel backend (`/api/spotify-token`, `/api/spotify-refresh`). Automatically stores the refresh token in `chrome.storage.local`.
- **Live Now Playing**: Fetches the currently playing track in real-time, including album art, artist, and track name.
- **Full Playback Controls**: Built robust, functional UI controls for:
  - Play / Pause (toggle)
  - Next Track / Previous Track
  - Shuffle toggle
  - Like/Save track
- **Dynamic Color Extraction**: 
  - *Problem*: Traditional libraries like `node-vibrant` crashed the Vite React build due to Node.js dependencies (`Buffer`, `process`).
  - *Solution*: Engineered a custom, bulletproof HTML5 `<canvas>` image data extractor (`src/lib/colors.js`) that analyzes the album art cross-origin (`crossOrigin="Anonymous"`) to mathematically compute the average vibrant color.
  - Dynamically injects these colors into the waveform progress bar, background gradients, and UI accents.
- **60fps Interpolated Scrubber**: 
  - *Problem*: The progress bar jumped/stuttered every 3 seconds when the API polled.
  - *Solution*: Built a buttery smooth local ticker using `requestAnimationFrame` (`localProgressMs`). It seamlessly interpolates the progress between the 3-second API polling intervals.

## 3. Immersive Weather Animations
- **Day/Night Cycle**: The dashboard now checks the OpenWeatherMap icon code (`01d` vs `01n`) to determine the exact time of day.
- **Astronomical Lunar Phases**:
  - Engineered a precise algorithm to calculate the lunar cycle (29.53058867 days) against a known New Moon epoch (Jan 6, 2000).
  - Determines 8 distinct moon phases (New, Waxing Crescent, First Quarter, Waxing Gibbous, Full, Waning Gibbous, Last Quarter, Waning Crescent).
  - Uses advanced CSS `box-shadow` injection to accurately render the geometric shadow of the exact moon phase natively in the UI.
- **Nighttime Skies**: Clear nights replace the glowing sun with the dynamic moon phase and randomly drifting, pulsating, twinkling stars (`framer-motion`).

## 4. GitHub Contribution Streak Fix
- **Problem**: The GitHub API edge nodes and Chrome's native `fetch` aggressively cached the public events endpoint, causing the dashboard to show stale commit counts (e.g., getting stuck at 2 contributions even after pushing 4).
- **Solution**: Implemented a robust cache-buster by appending `?t=${Date.now()}` to the GitHub API request in `src/lib/github.js`, forcing a fresh payload on every new tab.

## 5. UI/UX & Asset Polish
- **Extension Icon**: 
  - Replaced the default Chrome puzzle piece with a custom, user-provided sunrise logo.
  - *Refinement*: Used AI to up-res the image into a perfectly clean, high-resolution vector-style graphic.
  - *Masking*: Built a Node.js image processing script using `sharp` to explicitly resize the icon to `128x128` and programmatically apply a transparent SVG mask with rounded corners, completely stripping out the unwanted white background.
- **Documentation**: Completely rewrote the `README.md` to perfectly outline the Vercel architecture, Spotify capabilities, and Weather animations.

## 6. Cleanup
- Purged all legacy code related to the local Express server.
- Ensured `.gitignore` prevents this summary document from polluting the public GitHub repository.
