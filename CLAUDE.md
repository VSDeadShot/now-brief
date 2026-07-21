# Now Brief — CLAUDE.md

## What this is
A Manifest V3 Chrome/Edge extension that overrides the new-tab page with a personal daily dashboard (design language modeled on Samsung's "Now Brief"). Aggregates weather, Spotify now-playing, YouTube subscriptions, GitHub streak, OmniTask tasks, DSA Tracker reviews, and news into one glassmorphic 2-column feed.

## Tech stack
- **Build**: Vite + `@crxjs/vite-plugin` (MV3 support), React 19, Tailwind CSS, Framer Motion
- **Icons**: `lucide-react` (single set/stroke weight — don't mix icon libraries)
- **Color extraction**: custom canvas-based extractor in `src/lib/colors.js` (pulls dominant color from Spotify album art) — `node-vibrant`/`fast-average-color` are installed but the canvas approach is what's actually wired up; verify before assuming either library is live
- **Lint**: `oxlint` (`npm run lint`) — config in `.oxlintrc.json`, react + oxc plugins
- **No test suite currently exists**

## Architecture
- `src/main.jsx` → mounts `src/newtab/NewTab.jsx`, which lays out all cards in a 2-column grid and picks the time-of-day theme (morning/afternoon/evening/night — each with its own background gradient, greeting, and randomized subtitle).
- **Caching**: `src/lib/cache.js` wraps `chrome.storage.local` (falls back to `localStorage` under plain `vite dev`, i.e. outside the extension shell) so the new tab renders instantly from last-known data with no blank/loading state.
- **Background refresh**: `src/background/service-worker.js` registers a `chrome.alarms` job (every 15 min) that re-fetches all data sources in parallel via `Promise.allSettled` and writes results back to cache. Each source fails independently — one API being down never blocks the others.
- **Per-card fetch-on-mount**: cards also fetch live in `useEffect` on open, layered on top of the cached instant-render.
- One component per card in `src/newtab/components/` (`WeatherCard`, `SpotifyCard`, `YoutubeCard`, `GithubStreakCard`, `OmniTaskCard`, `DsaReviewCard`, `SamsungNewsCard`, `TechNewsCard`, `SettingsPanel`). All cards render through the shared `Card.jsx` wrapper (squircle radius, hover-lift spring animation, light/dark bg switching via a `timeOfDay` prop).
- One fetch wrapper per data source in `src/lib/` (`weather.js`, `github.js`, `dsaTracker.js`, `omnitask.js`, `news.js`) — each returns `null` on failure so the calling card can render a graceful fallback instead of throwing.

### Data sources (current, as of the code — see note below)
| Source | How it's fetched |
|---|---|
| Weather | Routed through the Vercel proxy (`proxy/api/weather.js` at `https://proxy-gamma-three-97.vercel.app/api/weather`) — `OPENWEATHER_API_KEY` lives server-side on the proxy project, never in the client bundle |
| News (Samsung/tech) & YouTube | Direct client-side call to `rss2json.com`, no backend |
| GitHub | Direct public `api.github.com` events call (cache-busted with `?t=timestamp`), 3 pages fetched to compute longer streaks |
| DSA Tracker | Routed through the Vercel proxy (`proxy/api/dsa-tracker.js` at `https://proxy-gamma-three-97.vercel.app/api/dsa-tracker`) — `NOW_BRIEF_SECRET` lives server-side on the proxy project, never in the client bundle. Card still shows its fallback state: the *upstream* `trackingdsa.vercel.app/api/now-brief` route 500s in production independent of the proxy (confirmed by calling it directly with a valid key) — a bug in the separate DSA Tracker project, not fixable from here |
| OmniTask | Direct call to `http://localhost:3001/api/tasks` — only works when the OmniTask Electron app is running locally |
| Spotify | Full OAuth 2.0 PKCE flow run client-side via `chrome.identity.launchWebAuthFlow` — no backend involved, refresh token cached in `chrome.storage.local` |

**Proxy status**: `AGENTS.md`/`docs/Now_Brief.md` describe the Vercel proxy (`proxy/`) as the intended path for API keys. It was fully bypassed for a while (commits `de434ba`, `6f9cb08`, `7715c22`) and the live deployment had drifted stale from the repo's `proxy/api/*.js` source. Weather and DSA Tracker have both been restored to route through it — the proxy was redeployed from current source first (confirmed via curl that `/api/weather` returns the `{ current, forecast }` shape the client expects), then `src/lib/weather.js` and `src/lib/dsaTracker.js` were rewritten to call it instead of hitting their upstream APIs directly with client-side keys. News/YouTube (rss2json), GitHub, and Spotify (PKCE) remain intentionally direct — none of them carry a secret worth hiding.

### Env vars (`.env`, gitignored)
```
VITE_SPOTIFY_CLIENT_ID
```
(`VITE_OPENWEATHER_API_KEY` and `VITE_NOW_BRIEF_SECRET` were both removed — neither weather nor DSA Tracker need a client-side key now that they're proxied.)

## Conventions
- One component per card → `src/newtab/components/`
- One fetch wrapper per data source → `src/lib/`
- Fetch wrappers catch their own errors and return `null` — never throw into the component
- Squircle corner radius 20–24px, consistent across all cards — don't mix radii
- One accent color only, driven by `timeOfDay` — don't introduce per-card colors
- Dark mode is the default/primary target — build and verify dark before light
- Single icon library (`lucide-react`), single stroke weight
- Max 3 font sizes per card
- Glassmorphism/squircle visual system matches the Samsung Now Brief spec and the portfolio's existing design language — don't change it without discussion

## Workflow rules
- Propose one change at a time and wait for local review before moving to the next
- Only commit/push after Vedansh explicitly approves — never batch multiple features into one commit
- Never commit or push notes/handoff/scratch files (`CLAUDE_SUMMARY.md` is already gitignored for this reason — **but `scratch.json` and `scratch_channels.js` are currently tracked in git**, which conflicts with this rule; flagged for cleanup, not touched yet)
- Don't make any card's fetch block the rendering of the others
- Explain the plan for a step before writing code

## Known loose ends
- DSA Tracker card shows its fallback state (upstream `trackingdsa.vercel.app/api/now-brief` 500s in production, unrelated to proxy routing) — fix lives in the separate DSA Tracker project, not here
- `scratch.json` / `scratch_channels.js`: tracked in git, look like throwaway files (the latter is a one-off script for looking up YouTube channel IDs) — not touched, flagged for cleanup
