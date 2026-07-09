# Now Brief Extension — Visual Polish Pass Spec

**Status:** Draft for review → approve per-phase → hand to Antigravity CLI
**Scope:** Phase 2 follow-up. No new data/logic changes — this is UI-only.
**Reference:** Samsung Now Brief (One UI 7), as it actually ships on-device, not the marketing render.

---

## 0. Why these three phases, in this order

Layout first because color and type choices only read correctly once the grid is right — picking a palette against a wrong spacing rhythm means redoing the palette later. Icons/type last because they're the fastest to swap and easiest to get wrong if rushed.

Each phase below is a self-contained unit: implement → you review the diff → approve → commit. Don't start Phase 2 until Phase 1 is committed.

---

## Phase 1 — Card Layout & Spacing

**Goal:** Match Now Brief's card rhythm, not just "make cards nicer."

**What real Now Brief does:**
- Content is delivered as discrete cards in a vertical stack, not a dense list — generous whitespace between cards signals "curated," not "dashboard."
- Cards reference the Now Bar's pill/rounded-rect language — large corner radius, no sharp edges anywhere.
- The top of the surface carries a time-of-day-aware header (e.g. "Morning Brief") rather than a static app title — this is a defining Now Brief trait, not decoration.

**Target spec:**
| Token | Value |
|---|---|
| Card corner radius | 20–24px (large, pill-adjacent — not the 8px "generic card" default) |
| Card padding (internal) | 16px |
| Gap between cards | 12px |
| Outer container padding | 16px |
| Card elevation | Soft, diffuse shadow only (0 4px 16px, low opacity) — no hard drop shadows |
| Header | Dynamic greeting driven by local time: "Good morning" / "Good afternoon" / "Good evening" + date, sitting above the card stack, not inside a card |

**Acceptance criteria:**
- [ ] All 5 data cards use identical corner radius and padding — no mismatched components
- [ ] Header text changes based on time of day when the popup opens
- [ ] No card touches the edge of the popup viewport — outer padding respected everywhere
- [ ] Cards don't feel like a table — check by squinting at the whole popup; it should read as "stack of soft objects," not "grid of boxes"

---

## Phase 2 — Color & Theming

**Goal:** One UI's actual palette behavior — adaptive, not a fixed light/dark toggle bolted on.

**What real Now Brief does:**
- Dark surface by default (near-black, not pure black — reads premium, matches Knox/AOD aesthetic Samsung uses for anything framed as "secure/personal").
- One accent color used sparingly (time-block indicators, active states) rather than every card getting its own color — restraint is the tell that separates this from a generic widget grid.
- Light mode exists but is treated as the secondary case, not co-equal — verify dark mode first.

**Target spec:**
| Token | Dark (default) | Light |
|---|---|---|
| Surface background | `#121212`–`#1A1A1A` | `#F5F5F5`–`#FAFAFA` |
| Card background | `#1E1E1E`–`#242424` | `#FFFFFF` |
| Primary text | `#F5F5F5` | `#1A1A1A` |
| Secondary text | `#A0A0A0` | `#6E6E6E` |
| Accent (one only — pick Galaxy blue or your extension's existing brand color) | consistent across both modes | consistent across both modes |
| Card border (dark mode only) | 1px `#2C2C2C` hairline | none needed |

**Acceptance criteria:**
- [ ] Dark mode is the default and is built/reviewed first
- [ ] Exactly one accent color appears across the whole popup — audit and remove any per-card color variation that snuck in from Phase 1
- [ ] Text contrast passes a basic squint test in both modes (secondary text still legible, not decorative-gray)

---

## Phase 3 — Typography & Iconography

**Goal:** Restraint and consistency over variety.

**Target spec:**
- **Font stack:** System UI stack is fine (`-apple-system, "Segoe UI", Roboto, sans-serif` fallback chain) — Samsung's actual font (SamsungOne) isn't licensed for web use, so don't chase it; a clean system sans reads correctly in a browser extension context.
- **Type scale:** 3 sizes max — header (16–18px, medium weight), card title (14px, semibold), card body (12–13px, regular). Resist adding a 4th size.
- **Icons:** Monochrome line icons only, one consistent stroke weight (1.5–2px), sized 16–20px. No mixed icon sets (check your 5 cards don't already have icons from different libraries — this is a common drift point). If you don't have a licensed icon set, Lucide (already available, MIT licensed) matches this style closely.

**Acceptance criteria:**
- [ ] No more than 3 font sizes anywhere in the popup
- [ ] All icons come from one set, one stroke weight
- [ ] Icon color matches the accent token from Phase 2 — not a separate icon-specific color

---

## Out of scope for this pass
- Data/API changes (proxy, refresh interval, card content logic) — untouched
- New cards or removed cards
- Animations/transitions — separate future pass if wanted

## AGENTS.md addition (append, don't replace)
```
## UI Constraints (Now Brief visual polish)
- Card corner radius: 20-24px, consistent across all cards — never mix radii
- One accent color only — do not introduce per-card colors
- Dark mode is default; build/verify dark before light
- Icons: single set, single stroke weight — do not mix icon libraries
- Max 3 font sizes in the popup
```
