# Project Rules — Now Brief

## Stack
- Manifest V3 browser extension (Chrome/Edge)
- Vite + CRXJS plugin, React, Tailwind CSS, Framer Motion
- `chrome.storage.local` for caching, `chrome.alarms` for background refresh
- Vercel serverless function as a proxy for news feed requests

## Architecture
New tab override renders instantly from cached data in `chrome.storage.local`, then fires parallel fetch requests to five sources (OmniTask local API, DSA Tracker API, GitHub API, news proxy, weather API). Each card updates independently as its own data resolves — nothing blocks on the slowest source. Any source failing shows a graceful fallback on just that card, not the whole page.

## Conventions
- One component per card, living in `src/newtab/components/`
- One fetch wrapper per data source, living in `src/lib/` (e.g. `github.js`, `weather.js`)
- API keys for news/weather never touch the client — always routed through the Vercel proxy

## Do Not
- Don't change the glassmorphism/squircle visual design system without discussion — it's meant to match Samsung's actual Now Brief and the portfolio's existing design language
- Don't make any card's fetch block the rendering of the others
- Don't call third-party APIs with exposed keys directly from the extension — proxy them

## Workflow
- Explain the plan for each step before writing any code, and wait for confirmation
- Do not commit or push to GitHub without explicit approval
- Build and test one feature at a time — do not batch multiple features into one commit
- After each feature works and is confirmed, commit and push before starting the next one

## UI Constraints (Now Brief visual polish)
- Card corner radius: 20-24px, consistent across all cards � never mix radii
- One accent color only � do not introduce per-card colors
- Dark mode is default; build/verify dark before light
- Icons: single set, single stroke weight � do not mix icon libraries
- Max 3 font sizes in the popup

