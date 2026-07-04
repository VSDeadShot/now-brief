# Now Brief — Full Project Document

## The Idea

Right now, checking on things means opening five different tabs — OmniTask for tasks, DSA Tracker for what's due, GitHub to check the streak, Reddit for Samsung news, somewhere else for the weather. Now Brief collapses all of that into one place: a browser extension that replaces the default new tab page with a personal daily dashboard, pulling live data directly from the tools already built.

Open a new tab, see everything that matters for the day — no separate app to remember to open.

---

## What We Are Building

A Manifest V3 browser extension (Chrome/Edge) that overrides the new tab page and shows:

- Tasks due today — pulled live from OmniTask's local API
- DSA problems due for review today — pulled live from DSA Tracker's Supabase-backed API
- GitHub contribution streak and today's activity
- Samsung news section
- General tech news section
- Local weather

---

## Visual Design — Samsung Now Brief Parity

The goal is for this to feel like it was pulled directly off a Galaxy phone, not like a generic browser extension. Samsung's real Now Brief (One UI 7–9) uses:

- **Vertical stack of full-width cards** — one scrollable feed, each card a distinct info block (not a grid)
- **Glassmorphism** — semi-transparent card backgrounds with backdrop-blur, sitting on top of a soft ambient gradient background. Samsung calls its current styles "Nature Glass" (soft transparent tint) and "Frosted" (deeper blur) — pick one consistently
- **Squircle shapes** — large rounded corners (24–32px radius), not sharp rectangles or small 8px rounding
- **Icon + heading + content row structure** — every card leads with a small icon, a bold heading, then scannable content underneath. No dense paragraphs
- **Time-of-day greeting** — Now Brief frames itself around morning/afternoon/evening. Open with a large greeting header ("Good morning, Vedansh") that changes tone based on time of day
- **Typography hierarchy** — big bold numbers/headlines for primary info (like weather temperature or streak count), smaller muted text for secondary detail
- **Soft tactile motion** — cards lift slightly on hover, smooth fade/slide transitions when data refreshes — no jarring pop-ins

This is the same visual language already used on the portfolio site — deep soft shadows, frosted glassmorphism, precise squircle shapes, tactile spring animations. Reuse that exact design system here for consistency across projects.

---

## Tech Stack

**Extension Framework**
- Manifest V3 — current Chrome/Edge extension standard
- Vite + CRXJS plugin — modern build tooling for React-based extensions with hot reload during development
- React — consistent with the rest of the stack already used across other projects
- Tailwind CSS — for styling, dark theme, One UI glassmorphism card design
- Framer Motion — for the soft tactile hover/transition animations matching the portfolio's design system

**Data Layer**
- Native `fetch` for all network calls
- `chrome.storage.local` — caches the last known data so the new tab loads instantly, then refreshes in the background
- `chrome.alarms` API — triggers periodic background refresh of cached data via the service worker

**Backend / Proxy**
- A small serverless function (Vercel) to proxy news feed requests — avoids exposing API keys client-side and sidesteps CORS restrictions some news sources enforce

---

## Data Sources & Integration

1. **OmniTask** — fetches from OmniTask's existing local Express API on `localhost` (the same API the CLI already uses). Only works when running on the same machine as OmniTask — which is fine, since this is opened at the desk each morning anyway. If OmniTask isn't running, the card shows a graceful "OmniTask not running" message instead of breaking the page.

2. **DSA Tracker** — fetches from the existing live API at trackingdsa.vercel.app, reusing the same review queue logic already built.

3. **GitHub** — public REST API (`api.github.com`) for contribution streak and recent activity. No auth needed for public data.

4. **News** — two separate feeds:
   - Samsung section — pulled from a Samsung-focused RSS source, parsed through the proxy function
   - General tech section — pulled from a general tech RSS source, parsed through the proxy function

5. **Weather** — OpenWeatherMap free tier API using a saved location.

---

## Architecture / How It Works

- On new tab open, the extension instantly renders the last cached version from `chrome.storage.local` — no blank loading screen.
- In the background, parallel fetch requests go out to all five data sources at once.
- Each card updates independently as its data resolves — nothing blocks on the slowest source.
- A background service worker refreshes the cache periodically via `chrome.alarms`, so data stays reasonably fresh even before the next tab is opened.
- Any single source failing (API down, OmniTask not running, etc.) fails gracefully — that one card shows a fallback state, everything else still works.

---

## Folder Structure

```
now-brief/
├── src/
│   ├── background/
│   │   └── service-worker.js       — periodic refresh via chrome.alarms
│   ├── newtab/
│   │   ├── NewTab.jsx               — root component
│   │   ├── components/
│   │   │   ├── OmniTaskCard.jsx
│   │   │   ├── DsaReviewCard.jsx
│   │   │   ├── GithubStreakCard.jsx
│   │   │   ├── SamsungNewsCard.jsx
│   │   │   ├── TechNewsCard.jsx
│   │   │   └── WeatherCard.jsx
│   │   └── index.html
│   ├── lib/
│   │   ├── omnitask.js              — fetch wrapper, local API
│   │   ├── dsaTracker.js            — fetch wrapper, DSA Tracker API
│   │   ├── github.js                — fetch wrapper, GitHub API
│   │   ├── news.js                  — fetch wrapper, proxy news endpoint
│   │   └── weather.js               — fetch wrapper, weather API
│   └── manifest.json
├── proxy/
│   └── api/news.js                  — Vercel serverless function, proxies news feeds
├── vite.config.js
└── package.json
```

---

## Core Features — Phase 1 (Ship First)

- Manifest V3 setup, new tab override rendering with placeholder UI
- GitHub streak card — easiest data source, public API, no auth needed
- Weather card
- DSA Tracker review queue card — API already live
- `chrome.storage.local` caching layer so the page loads instantly

## Core Features — Phase 2

- OmniTask integration — local API with graceful fallback
- Samsung news card
- General tech news card
- Background service worker for periodic refresh
- Visual polish pass against the Samsung Now Brief parity spec above — glassmorphism cards, squircle radius, time-of-day greeting header, tactile motion

---

## First Sprint Plan

1. Scaffold the extension with Vite + CRXJS + React, verify new tab override works with placeholder content
2. Build the GitHub streak card end to end — first real data source, no auth complexity
3. Build the weather card
4. Build the DSA Tracker review card using the existing live API
5. Add the `chrome.storage.local` caching layer
6. Load as an unpacked extension in Chrome and test the full flow

Most of the hard backend work already exists across the other projects — this is primarily an integration and UI build, so it should be shippable in 2–3 focused sessions.
