# Design Brief — Telsa Charging Points (Frontend Rebuild)

> Paste this entire file as the first message to the design agent. Do not truncate it. The backend must not be modified. The existing `frontend/` folder is deprecated — build fresh.

---

## 0. Role and standard

You are the creative director and senior front-end engineer for a luxury automotive tech brand — think the team that would ship the digital experience for Porsche Taycan, Rimac Nevera, Zenith watches, or the Arc browser launch page. You do not ship generic SaaS templates. You do not ship "glassmorphism + purple gradient + rounded-3xl card grid" slop. Every pixel is deliberate, every motion has physical weight, every typographic choice has a reason.

If any instruction in this brief conflicts with your training bias toward "safe modern SaaS," **override the bias**. The user's professor and peers will grade this against real commercial work. Mediocrity is a failure condition.

---

## 1. Product — what this actually is

**Name:** Telsa Charging Points
**Market:** Tunisia (plate codes `TN`, `RS`, `CD` are Tunisian) — a small, discerning EV-owning population. Assume the user already owns a Tesla; they are not being convinced, they are being served.
**Core promise:** Verified Tesla owners get access to a curated network of charging stations, matched to their exact model and charging port.

**The brand is not "Tesla."** This is an independent platform that *serves* Tesla owners locally. Do not clone tesla.com. Build your own identity — something that could sit confidently beside Tesla's brand without imitating it. Closer in spirit to a concierge service (Quintessentially, NetJets, Singita) than a consumer app.

---

## 2. Backend contract — the ONLY endpoints you may call

Base URL: `/api` (proxy to Spring Boot). All responses are wrapped in:

```json
{ "success": true, "message": "string", "data": <T>, "timestamp": "ISO-8601" }
```

### 2.1 Public (no auth)

| Method | Path | Purpose | Body / Query |
|---|---|---|---|
| POST | `/api/vehicles/verify/local` | Verify a locally-registered Tesla | `{ chassisNumber, plateNumber, plateType, teslaModel }` |
| POST | `/api/vehicles/verify/foreign` | Verify a foreign Tesla (needs carte grise upload) | multipart: `chassisNumber`, `teslaModel`, `carteGrise` (file) |
| POST | `/api/auth/register` | Create account after verification | `{ verificationToken, firstName, lastName, email, password, phoneNumber, countryCode }` |
| POST | `/api/auth/login` | Start login → triggers OTP | `{ email, password }` → returns `{ userId, otpExpiresSeconds }` |
| POST | `/api/otp/send` | Send OTP | `{ userId }` |
| POST | `/api/otp/verify` | Verify OTP → issues tokens on success | `{ userId, otp }` → `{ success, retriesRemaining, accessToken, refreshToken }` |
| POST | `/api/otp/resend` | Resend OTP | `{ userId }` |
| POST | `/api/auth/refresh` | Rotate tokens | `{ refreshToken }` |
| GET  | `/api/auth/verify-email?token=...` | Email verification link handler | query `token` |

### 2.2 Authenticated (Bearer access token)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/logout` | Revoke all refresh tokens for user |
| GET  | `/api/stations/nearby?lat=&lng=&teslaModel=&modelYear=` | Nearby stations matched to the user's model |

### 2.3 Admin only (`ROLE_ADMIN`)

| Method | Path | Purpose |
|---|---|---|
| GET  | `/api/admin/stats` | `{ totalUsers, verifiedUsers, localVehicles, foreignVehicles, usersByModel }` |
| GET  | `/api/admin/users?page=` | paged users |
| GET  | `/api/admin/users/{id}` | user detail |
| DELETE | `/api/admin/users/{id}` | delete user |
| POST | `/api/admin/erp/local` | `{ chassisNumber, plateNumber, plateType, teslaModel }` |

### 2.4 Enums (exact values — do not rename)

- `TeslaModel`: `MODEL_3`, `MODEL_Y`, `MODEL_S`, `MODEL_X`, `CYBERTRUCK`
- `PlateType`: `TN`, `RS`, `CD`
- `ChargingPortType`: `NACS`, `CCS1`, `CCS2`, `CHADEMO`, `J1772`
- `VehicleOrigin`: `LOCAL`, `FOREIGN`

Display labels (UI copy) may be prettier ("Model 3", "Cybertruck", "Diplomatic Plate (CD)") but the **wire value must match exactly**.

### 2.5 Error behavior to design for

The backend raises `AccountLockedException`, `RateLimitExceededException`, OTP retries-remaining, token expiry. Design dedicated states for each — not a generic red toast. A locked account is a moment, not a toast.

---

## 3. The pages to build

Build every one of these. Treat the list as a contract.

1. **Landing** (`/`) — the hero experience. This is what the professor sees first.
2. **Vehicle verification — Local** (`/verify/local`) — chassis + plate + plateType + model
3. **Vehicle verification — Foreign** (`/verify/foreign`) — chassis + model + carte grise upload (drag-drop)
4. **Register** (`/register`) — consumes the verification token from the previous step
5. **Email verification pending** (`/verify-email/pending`) and **result** (`/verify-email?token=...`)
6. **Login** (`/login`) — email + password
7. **OTP challenge** (`/otp`) — 6-digit entry, resend with cooldown, retries-remaining HUD
8. **Dashboard** (`/app`) — greeting, the user's verified Tesla as a hero object, quick access to nearby stations
9. **Stations map** (`/app/stations`) — full map view, filters by port type, list + map combined
10. **Station detail** (`/app/stations/:id`) — hours, connectors, photos, directions
11. **Account** (`/app/account`) — profile, linked vehicle, sessions, logout
12. **Admin console** (`/admin`) — stats dashboard (counters, chart by model), users table, ERP add form
13. **404 / locked / rate-limited** — bespoke, not a generic "Oops"

---

## 4. Aesthetic direction — lock this in

### 4.1 The mood

Nocturnal. Editorial. Mechanical. The feel of walking into a private automotive showroom at 11pm — polished concrete, a single Tesla under a cone of warm light, the air is cold, the room is silent. The UI is the silence.

**Reference points (study, do not copy):**
- Porsche Taycan configurator (the deliberation, the silence between interactions)
- Rimac Automobili website (the engineering reverence)
- Zenith / A. Lange & Söhne watch sites (the typography, the restraint)
- Linear.app (the motion polish, the precision)
- Arc browser launch page (the confidence)
- Apple Vision Pro page (the depth, the parallax without being gimmicky)
- Kinopio, Rauno Freiberg's portfolio (the weirdness in the details)
- Monocle magazine (the editorial grid)

**Anti-references — if your output looks like these, delete and restart:**
- Vercel template gallery starter kits
- Notion / Linear *clones*
- Generic "dark mode SaaS with purple-to-pink gradient hero"
- Bento grids with 6 identical rounded cards and lucide-react icons
- Floating 3D blobs / mesh gradients as background
- "Built with AI" landing pages
- Any hero that says "The future of [thing]" in 96px

### 4.2 Palette

No purple. No cyan. No teal. No gradient background.

- **Ink** `#0A0A0B` — primary background
- **Graphite** `#141417` — elevated surfaces
- **Carbon** `#1E1E22` — deeper wells, inputs
- **Bone** `#F4F1EC` — primary text on dark (warm off-white, NOT pure white)
- **Chalk** `#9A968E` — secondary text
- **Ember** `#E34E2C` — the one accent. Tesla-adjacent red but shifted warmer, almost terracotta. Used sparingly — a single button per viewport, a status dot, a charging indicator.
- **Signal Green** `#7FB285` — only for "charging available / verified"
- **Rule** `#2A2A2E` — 1px hairlines

Light theme optional; if built, invert to warm paper (`#F4F1EC` bg, `#0A0A0B` text, same Ember accent). Do NOT ship a half-finished light theme.

### 4.3 Typography

Two families, no more.

- **Display / headline:** a high-contrast editorial serif — e.g. *PP Editorial New*, *GT Super*, or free alternative *Fraunces* (heavy optical-size aware). Use for numbers, the hero phrase, station names.
- **UI / body:** a neutral geometric or grotesque — *Inter Tight*, *Geist*, or *PP Neue Montreal*. Tight tracking on large sizes (-0.02em), looser on small caps labels (+0.12em, uppercase).
- **Mono accent:** *JetBrains Mono* or *Geist Mono* for chassis numbers, plate numbers, OTP digits, coordinates. Monospace is part of the identity — it signals engineering.

Scale anchored to an 8pt rhythm. Hero display: `clamp(4rem, 11vw, 12rem)`. Oversized. Confident. Let it bleed.

### 4.4 Layout & grid

12-column grid, 96px gutter on desktop. **Asymmetric by default** — never center-lock a hero. Use editorial negative space: a headline in columns 2–7, a small caption in column 11. The user should feel they are reading a printed object.

Corner radii: `2px` for inputs and buttons (sharp, engineered). `0px` for cards and sections. **No `rounded-2xl` anywhere.** Softness is earned, not default.

Borders: `1px` hairlines in `#2A2A2E`. No drop shadows. Depth comes from elevation color, not blur.

### 4.5 Motion — the hardest part

Motion is the thing that will make your professor stop scrolling. Budget time here.

**Principles:**
- **Every transition has mass.** Use Framer Motion with custom spring configs (`stiffness: 220, damping: 28, mass: 0.9`) or CSS cubic-bezier `(0.2, 0.9, 0.2, 1)`. Never default ease-in-out.
- **Stagger everything that lists.** Children animate in at 40ms offsets.
- **Cursor is a participant.** A bespoke cursor (14px dot, 32px ring that lags by 80ms with spring physics) that magnifies to 52px on interactive targets and shows a caption ("verify", "drag", "view").
- **Scroll is choreographed**, not passive. Use Lenis for buttery scroll. Use GSAP ScrollTrigger or Framer's `useScroll` for section-pinned sequences.
- **Text animations**: split by character/word, mask-reveal upward (`clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`) with 12ms per-char stagger. NOT letter-by-letter fade-in (too slow, too clichéd).
- **Page transitions**: a single Ember-red horizontal bar wipes across the viewport left→right, route changes behind it, wipes off right→left. 650ms total.
- **Hover on a primary button**: the label shifts up and is replaced by an arrow sliding in from the left (classic editorial hover, done well). Background fills from left with Ember.
- **Number counters** on the admin dashboard count up with a spring, not a linear tween.

**Hero sequences to build (pick the ones you can ship well):**
- On landing: the Tesla model names (`MODEL 3`, `MODEL Y`, `MODEL S`, `MODEL X`, `CYBERTRUCK`) cycle vertically like a departure board (Solari/Vestaboard flip), locking on `MODEL S` after 3 flips. Subtle, not carnival.
- A horizontal scroll-pinned section where a charging cable draws itself across the viewport as the user scrolls, connecting to a silhouette of the detected Tesla model. SVG path + `pathLength` scroll-linked.
- Station cards on the dashboard enter with a **list-shift**: the first card doesn't fade — it *pushes* the others down from above with a physics spring, as if slotting into a rack.

### 4.6 3D / WebGL — use sparingly

If you include 3D, it must pay rent. One allowed use: a **wireframe model of the user's verified Tesla** on the dashboard, slowly rotating, rendered in react-three-fiber. Low-poly, matte, no reflections — engineering blueprint, not showroom render. Must be < 200kb model, must degrade to a PNG silhouette on low-power devices (`prefers-reduced-motion` + `navigator.hardwareConcurrency < 4`).

Do not use Three.js for decorative background blobs. Do not use Spline embeds.

---

## 5. Page-by-page direction

### 5.1 Landing (`/`)

**Above the fold (no scroll):**
- Thin top nav: wordmark left (custom lettering, not a font — take time on this), 3 links center (`Network`, `Verify`, `Stations`), `Sign in` + `Verify your Tesla` top-right. The CTA is a button with a 1px Ember border, fills on hover.
- A single headline — editorial serif, oversized, left-aligned, breaking across 2–3 lines. Example (do better): *"A quiet network, for the cars that deserve it."* Set in columns 1–8.
- In columns 10–12, a small caption block: a monospace line `01 / INDEX`, then two short sentences in Chalk. A `→ Begin verification` link underlined with the offset-link pattern (underline animates from left on hover).
- A single ambient element: a slow, grainy, near-black video loop (a charging port LED breathing) in the bottom-right quadrant. Grain overlay at 6% opacity.

**Below:**
- Section II: a typographic map of the 5 Tesla models as a **vertical Solari board**, each row with model name in display serif, port type in mono (`NACS`, `CCS2`), a status dot. Clicking a row previews that model's coverage.
- Section III: "The verification ritual" — 3 steps as horizontal scroll-pinned slides. Each slide is full-height, one big number (`01`, `02`, `03`) in 320px Fraunces, one sentence, one hairline illustration (chassis, plate, carte grise). This replaces the default "3 feature cards in a row."
- Section IV: a live-ish counter — `VERIFIED OWNERS · 0,247` — mono, ticking. (Wire this to `/api/admin/stats` if public, else hardcode and be honest in comments.)
- Section V: FAQ as an accordion but with **horizontal** expansion on desktop (question left, answer reveals to the right column on click). Rule hairlines between.
- Footer: oversized wordmark as the footer itself, 40vh tall, sliced by a horizontal rule, with tiny mono meta in the corners (location, year, "BUILD 001").

### 5.2 Verification flow

This is the product's spine. Treat it like a watchmaker's process — slow, precise, inevitable.

- Two-tab switcher at the top: `LOCAL` / `FOREIGN`. The indicator is a 2px Ember bar that slides (layout animation).
- Single-column form, max-width 520px, centered vertically in viewport, but with the brand meta-nav still visible.
- Each field is a **labelled input** with the label *above-left* in mono small-caps, a 1px underline only (no box), and a live character counter on the right for chassis (must be 17 chars). Input focuses: underline thickens to 2px, grows from left, Ember.
- Dropdowns for `plateType` and `teslaModel` open as **full-row overlays**, not native selects. Each option is a large row with the enum value in mono on the left and the pretty label on the right.
- The foreign flow's file upload is a **drop-zone that occupies the full width**, with a dashed 1px Rule border. On drag-over, the border becomes solid Ember and the whole zone shifts 4px down with a spring. On upload, show a mono-labelled preview card with filesize and a "replace" affordance.
- Submit button: wide, sharp, Bone background, Ink text. On submit, it collapses from the right into an indeterminate 2px progress rail — the button *becomes* the loader.
- Success: a full-viewport takeover — Ember background, a single line of display serif "Verified.", a mono subline with the first 8 chars of the verification token, and a "Continue to registration →" button. 900ms hold, then auto-advance unless hovered.

### 5.3 OTP (`/otp`)

- Six individual input cells, each 72×88px, mono, display-serif 56px digit. Auto-advance, paste-handles-all-6. Backspace walks backward.
- A live countdown ring (SVG circle, `stroke-dasharray` animated) wrapping a small "Resend in 0:42" label. When 0, the ring vanishes and "Resend" becomes clickable.
- Retries-remaining shown as 3 small dots top-right; each failed attempt dims one dot with a subtle horizontal shake.
- On success: digits turn Signal Green one-by-one left-to-right (60ms stagger), then the viewport wipes to the dashboard.
- On rate limit / lock: the cells turn Ember, the page *does not shake* (too cliché) — instead, a full-width Ember hairline slides in from the top with the lock reason in mono. Cells become read-only.

### 5.4 Dashboard (`/app`)

- Left rail nav, 88px wide, icon + mono label vertical. Current section has a 2px Ember vertical bar on the left edge.
- Header: "Good evening, {firstName}." in display serif, 72px, left-aligned. Below it, a single mono line with the verified VIN (last 6 chars only — the rest is dotted for privacy) and model.
- A hero panel occupying ~60% of the viewport width showing the **wireframe 3D Tesla** of the user's exact model, slowly rotating. Beside it, a stat stack: connector type, range class, nearest station distance.
- Below: "Nearby stations" — a list of 5, each row is full-width, hairline-separated. Row shows: station name (display serif), distance (mono), connector compatibility (status dot + label), open/closed state. Hovering a row expands it in place (accordion, not modal) with a small map preview on the right.
- "Activity" strip at the bottom: recent sessions (if no data, show a beautiful empty state with a single phrase "No sessions yet. The network awaits.").

### 5.5 Stations map (`/app/stations`)

- Use MapLibre GL JS (not Mapbox — avoids the token hassle) with a **custom dark style** — warm ink base, 1-weight roads, Ember markers. Tunisia centered by default.
- Left 420px rail: filter by port type (chip row, enum-aware), search, list of stations. Clicking a list item pans+zooms the map with a 900ms eased fly-to.
- Markers are not pins. They are small open circles (12px) with an Ember fill that pulses when charging is available. Selected marker grows to 24px with a hairline ring.
- Detail drawer slides from the right, covering 40%. Has photos, connector breakdown per the `ChargingPortType` enum, hours, a "Get directions" button that opens native maps.

### 5.6 Admin (`/admin`)

Treat this like a Bloomberg Terminal, not a Retool dashboard.

- Top row: 4 oversized counters — `TOTAL · VERIFIED · LOCAL · FOREIGN` — each number in 112px display serif, label below in mono small-caps. Numbers count up from 0 on mount.
- Chart: users-by-model as a **horizontal bar race** (D3 or Visx), bars in Bone on Carbon background, labels in mono. No colors per bar — just length.
- Users table: sticky header, mono columns, row hover reveals a hairline at top+bottom. Delete is a row-level action that opens a sharp confirmation drawer from the right — no browser `confirm()`, no centered modal with a red button.
- ERP-add form: same language as the public verification form but inside a framed panel with a "ADD LOCAL VEHICLE" mono label and an index number (`ENTRY / 001`).

### 5.7 404 / locked / rate-limited

Each gets its own treatment. The locked-account page is a full-viewport Ember wash with a single centered line — display serif — "This account is resting." and a mono line with the unlock time. No cute illustrations.

---

## 6. Tech stack (mandatory)

- **Vite + React 18 + TypeScript** (strict). App Router not required; React Router v6 is fine.
- **Tailwind CSS v3** configured with the exact palette above as tokens. No raw hex in components. Extend spacing on an 8pt scale.
- **Framer Motion** for component motion, **GSAP + ScrollTrigger** for scroll choreography, **Lenis** for smooth scroll.
- **Zustand** for client state (auth tokens, verification token, current user). Persist tokens in `localStorage` under a namespaced key and refresh automatically on 401.
- **TanStack Query** for all server calls. One `apiClient` (axios or fetch wrapper) that wraps the `ApiResponse<T>` envelope and throws typed errors.
- **react-hook-form + zod** for forms. Zod schemas mirror backend DTOs.
- **MapLibre GL JS** for the map.
- **react-three-fiber + drei** only if shipping the wireframe Tesla. Lazy-load the chunk.
- **Variable fonts self-hosted** via `@fontsource-variable/*`. No Google Fonts CDN in production.
- **No component libraries.** No shadcn-ui, no MUI, no Chakra, no Radix-as-shadcn. You may use Radix Primitives *headlessly* (Dialog, Popover) for accessibility, but style 100% custom. Using shadcn's default look is an instant fail.

### Project layout

```
src/
  api/           # apiClient, endpoints, zod schemas
  app/           # routes
  components/
    primitives/  # Button, Input, Dialog — custom
    motion/      # reusable motion wrappers (SplitText, ScrollReveal, MarqueeBoard)
    brand/       # Wordmark, Cursor, PageWipe
  features/
    verification/
    auth/
    stations/
    admin/
  hooks/
  lib/           # tokens.ts, cn.ts, format.ts
  styles/
    tokens.css
    globals.css
  stores/
```

### API client behavior (non-negotiable)

- Bearer auth header auto-injected from Zustand.
- On `401`, a single in-flight refresh call is queued; other 401s await it.
- On rate-limit / lock responses, emit a typed error that the UI layer renders as a full-state, not a toast.
- All datetime values parsed to `Date`. All enums typed from a single `api/enums.ts` that matches the backend exactly.

---

## 7. Copywriting voice

Write like a curator, not a marketer. Short. Declarative. No exclamation marks. No emojis anywhere. No "unlock" / "empower" / "seamless" / "revolutionize" / "game-changing" / "supercharge". No "Get started for free" — there is no free tier; this is a qualified-ownership product.

Good:
- "Verify your Tesla."
- "We confirm the chassis. Nothing else."
- "The network is private. Entry is by ownership."
- "Six digits. Five minutes. One attempt per minute."

Bad:
- "Join thousands of happy EV drivers!"
- "Find your perfect charging match!"
- "Welcome aboard! Let's get you charged up."

---

## 8. Accessibility (yes, still)

Contrast minimum AA throughout. Every interactive element reachable by keyboard with a **custom focus style** — a 2px Ember outline offset by 4px, no default browser ring. Respect `prefers-reduced-motion` — disable the cursor ring, disable pinned scroll sequences, swap masked text reveals for opacity, keep the wireframe Tesla static. `aria-live` on the OTP retries counter. The map has a keyboard-navigable list alternative.

---

## 9. Performance bar

- Landing LCP < 1.8s on a throttled Fast 3G.
- Zero CLS.
- Initial JS < 180kb gzipped (before the map/3D chunks, which are route-level code-split).
- Images as AVIF with WebP fallback, responsive `srcset`, blur-up placeholders.
- Fonts subset to Latin + Arabic-Latin quotes.

---

## 10. Deliverables

1. A complete new Vite React TS app in a new folder at the repo root called `web/` (not `frontend/` — the old one stays untouched for reference).
2. A `web/README.md` covering: how to run, env vars (`VITE_API_BASE_URL` defaulting to `http://localhost:8080`), which fonts are self-hosted, and the design token reference.
3. A `DESIGN.md` in `web/` documenting the palette, type scale, motion primitives, and copywriting voice — so the next dev doesn't dilute it.
4. Every page listed in section 3, wired to the real endpoints in section 2.
5. A Vite dev proxy so `/api/**` forwards to `http://localhost:8080/api/**` during development.

---

## 11. What I will check first (grading rubric)

In this order:
1. Does the landing page look like it belongs to a real luxury brand, not a template? If no → fail.
2. Does the verification flow *feel* like a ritual, or like a typical signup form? If typical → fail.
3. Are the motion details present, tuned, and purposeful — or generic framer-motion fade-ups everywhere? Generic → fail.
4. Is the palette disciplined (Ember used once per viewport, no rogue colors)? If not → fail.
5. Do error states (lock, rate-limit, OTP retries) get bespoke treatment?
6. Does it actually talk to the Spring Boot backend with the real endpoints and enums?
7. Is the admin console information-dense and engineered, not a Retool clone?
8. Does it work with the keyboard and with reduced motion on?

---

## 12. Start here

Before writing a single component:
1. Produce the **design tokens file** (`tokens.css` + Tailwind config) and the **type scale**.
2. Build the **primitives**: `Button`, `Input`, `Select`, `Dialog`, `Cursor`, `PageWipe`, `SplitText`, `ScrollReveal`, `MarqueeBoard`. Make them exceptional. Every other page will be assembled from these.
3. Build the landing page. Iterate until it passes rubric item #1.
4. Then verification → auth → dashboard → map → admin.

Do not scaffold all pages at 40% quality. Build the primitives and landing at 100%, then move forward page by page, each shipped-quality before the next begins.

---

If any requirement is ambiguous, choose the more restrained, more editorial, more mechanical option. When in doubt: remove something, use smaller type with tighter tracking, widen the negative space, and let silence carry more weight than decoration.

Build it like your reputation is on it. Because it is.
