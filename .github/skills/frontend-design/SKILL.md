---
name: telsa-frontend-design
description: >
  Use this skill when designing, building, or refining any UI component, page, screen, or visual element
  in the Telsa frontend (React + TypeScript + Tailwind CSS 4 + Framer Motion). Triggers include requests
  like "design a new page", "create a component", "improve the UI", "add animations", "make this look better",
  "build a form", "style this", or any visual/frontend task in this project.
---

# Telsa Frontend Design System Skill

You are building the **Telsa Vehicle Registry** — a premium, government-grade vehicle registration and OTP verification platform for Tunisia. The frontend is a high-end product used by discerning users who expect innovation and refinement. Never produce generic, "AI-slop" UI.

## Tech Stack

- **React 19** with TypeScript (strict)
- **Tailwind CSS 4** via `@tailwindcss/vite` (use `@theme` tokens, NOT `tailwind.config.js`)
- **Framer Motion** imported as `motion/react` (NOT `framer-motion`)
- **Lucide React** for icons
- **Vite 6** + path alias `@/` resolves to project root

## Design Identity

**Aesthetic direction: Dark Luxury Automotive OS**
Think Rolls-Royce HMI dashboard meets Bloomberg Terminal — refined, architectural, surgical.

### Core Palette (CSS variables defined in `index.css`)

```css
/* Always use these — never hardcode raw hex */
--color-void:         #060608;    /* page background */
--color-surface-1:    #0a0a0d;    /* card base */
--color-surface-2:    #0f0f13;    /* elevated surface */
--color-surface-3:    #161619;    /* hover state */
--color-gold:         #c8a96e;    /* PRIMARY accent — warm chrome gold */
--color-gold-light:   #e8d5a0;    /* gold on hover / lighter variant */
--color-gold-dim:     rgba(200,169,110,0.4);
--color-gold-ghost:   rgba(200,169,110,0.08);
--color-emerald:      #34d399;    /* success / available */
--color-amber:        #fb923c;    /* warning / occupied */
--color-crimson:      #ef4444;    /* error / danger */
--color-indigo:       #818cf8;    /* secondary accent (Service locations) */
--color-border:       rgba(255,255,255,0.06);
```

### Typography Rules

| Role | Font | Weight |
|------|------|--------|
| Display / Headings | `Cormorant Garamond` (serif) | 700–900 |
| Body / UI labels | `DM Sans` | 300–600 |
| Code / Numbers / OTP | `JetBrains Mono` | 400–700 |

- **Never** use Inter, Roboto, or system-ui as a heading font
- Headings: `tracking-tight`, `leading-none` or `leading-[1.05]`
- Labels/caps: `text-[9px] uppercase tracking-[0.35em] font-semibold`
- Mono data (VIN, plate, phone, OTP digits): `font-mono tracking-[0.2em]`

## Component Patterns

### Surfaces / Cards
```tsx
// Standard card
<div className="p-6 rounded-2xl" style={{
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)'
}}>

// Gold-accent card
<div style={{
  background: 'rgba(200,169,110,0.06)',
  border: '1px solid rgba(200,169,110,0.2)'
}}>

// Glass surface (use sparingly for overlays)
<div className="glass"> {/* defined in index.css */}
```

### Inputs (Underline Style — NOT boxed)
```tsx
// All inputs use borderless underline pattern — NO border-radius on inputs
<div className="space-y-2 group">
  <label className="text-[9px] uppercase tracking-[0.35em] font-semibold"
    style={{ color: 'rgba(200,169,110,0.6)' }}>
    Field Label
  </label>
  <input
    className="w-full py-4 px-5 rounded-none border-b-2 border-white/10
               bg-transparent text-white outline-none placeholder:opacity-15
               focus:border-[#c8a96e] transition-all duration-300"
    style={{ fontFamily: 'DM Sans' }}
  />
</div>
```

### Buttons (Gold Border CTA)
```tsx
// Primary CTA — always use MagneticBtn wrapper for interactivity
<button className="relative w-full py-5 px-10 font-bold text-sm
                   tracking-[0.25em] uppercase overflow-hidden group
                   bg-transparent text-white transition-all duration-500"
  style={{ border: '1px solid rgba(200,169,110,0.5)' }}>
  {/* Hover fill overlay */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.05))' }} />
  {/* Animated border sweep lines */}
  <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
    style={{ background: 'linear-gradient(to right, #c8a96e, #e8d5a0)' }} />
  <div className="absolute top-0 right-0 h-px w-0 group-hover:w-full transition-all duration-700"
    style={{ background: 'linear-gradient(to left, #c8a96e, #e8d5a0)' }} />
  <span className="relative z-10 flex items-center justify-center gap-3">
    Button Label <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </span>
</button>

// Secondary / ghost button
<button className="px-6 py-3 text-white/50 hover:text-white/80 transition-colors
                   text-sm font-medium tracking-wide">
  Secondary Action
</button>
```

### Section Headers
```tsx
<div className="mb-16">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-px" style={{ background: '#c8a96e' }} />
    <span className="text-[10px] font-semibold tracking-[0.4em] uppercase"
      style={{ color: '#c8a96e' }}>Step XX / 05</span>
  </div>
  <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-4"
    style={{ fontFamily: '"Cormorant Garamond", serif' }}>
    Page <span style={{ color: '#c8a96e' }}>Title</span>
  </h2>
  <p className="text-sm text-white/40 font-light tracking-wide max-w-sm">Subtitle text.</p>
</div>
```

### Status / Error Banners
```tsx
// Error
<div className="flex items-center gap-3 px-5 py-4 rounded-xl"
  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
  <p className="text-sm text-red-300 font-medium">{message}</p>
</div>

// Info / security notice
<div className="flex items-start gap-3 px-4 py-3 rounded-xl"
  style={{ background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.15)' }}>
  <ShieldCheck className="w-4 h-4 mt-0.5" style={{ color: '#c8a96e' }} />
  <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,169,110,0.7)' }}>Notice text.</p>
</div>
```

### Icon Badges
```tsx
<div className="w-10 h-10 rounded-xl flex items-center justify-center"
  style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
  <Icon className="w-5 h-5" style={{ color: '#c8a96e' }} />
</div>
```

## Animation Patterns

### Easing Curve (always use this for entrances)
```tsx
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
// This is Apple's "snappy spring" curve — use for ALL page/section entrances
```

### Page / Step Transitions
```tsx
// Entry
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}

// Exit
exit={{ opacity: 0, y: -20 }}

// Scale reveal (modals, cards)
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
```

### Staggered List Items
```tsx
{items.map((item, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* item */}
  </motion.div>
))}
```

### Magnetic Button (apply to ALL primary CTAs)
```tsx
const MagneticBtn = ({ children, className, onClick, disabled }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  );
};
```

### layoutId Animations (for active indicators)
```tsx
// Navigation active pill — use layoutId for smooth morphing
{isActive && (
  <motion.div
    layoutId="nav-active-pill"
    className="absolute ..."
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  />
)}
```

### Loading / Pulsing States
```tsx
// Spinner
<Loader2 className="w-5 h-5 animate-spin" style={{ color: '#c8a96e' }} />

// Status dot
<motion.div
  animate={{ opacity: [1, 0.3, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
/>

// Ping ring (map markers, live status)
<motion.div
  animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="absolute inset-0 rounded-full border border-[#c8a96e]"
/>
```

## Background System

The global `<Background />` component (defined once in App.tsx) contains:
1. **Hex grid SVG** — `opacity-[0.04]`, gold stroke `#c8a96e`
2. **Scanlines** — `opacity-[0.03]`, repeating CSS gradient
3. **Two radial orbs** — top-right gold, bottom-left indigo, animated with `scale` + `opacity`
4. **Vertical chrome lines** — at 15%, 45%, 75% viewport width

Do NOT add a new background per page/component — the global one handles it.

## Navigation Architecture

```
Fixed NavRail (left, 80px wide, lg+ only)
├── Logo mark (gold circle with "T")
├── Step icons (with layoutId pill indicator)
└── Status dot (bottom)

Fixed TopBar (top, left-offset by NavRail on lg+)
├── Breadcrumb (registry > current step)
├── Step progress dots (pill expands for active)
└── Online badge + Exit

Fixed BottomNav (mobile only, bottom)
└── Icon grid with step numbers
```

## Rules to Always Follow

1. **Never** use `border-radius` on text inputs — underline style only
2. **Never** use blue (`#3b82f6`) anywhere — the accent is gold
3. **Never** use `Inter`, `Roboto`, or `system-ui` as a display font
4. **Never** add solid white/gray backgrounds — use translucent surfaces
5. **Always** wrap primary CTAs in `MagneticBtn`
6. **Always** use `ease: [0.22, 1, 0.36, 1]` for entrance animations
7. **Always** use `AnimatePresence mode="wait"` for step/route transitions
8. **Always** keep labels in `text-[9px] uppercase tracking-[0.35em]`
9. **Always** import motion from `motion/react`, NOT `framer-motion`
10. **Always** use `style={{ fontFamily: '"Cormorant Garamond", serif' }}` inline on heading elements (Tailwind doesn't pick up Google Fonts automatically)

## File Locations

```
frontend/
├── src/
│   ├── App.tsx          ← All step components live here (single file architecture)
│   ├── index.css        ← Global styles, @theme tokens, utility classes
│   ├── main.tsx         ← Entry point (do not modify)
│   ├── lib/
│   │   └── utils.ts     ← cn() utility (clsx + tailwind-merge)
│   └── services/
│       └── api.ts       ← All API calls (do not modify from frontend skill)
├── index.html
├── vite.config.ts
└── package.json
```

## API Endpoints (read-only reference — do not modify)

| Step | Action | Service call |
|------|--------|-------------|
| Vehicle | Initialize | `apiService.initializePlateType(plateType)` |
| Vehicle | Verify | `apiService.verifyVehicleDetails(verificationId, vin, plate)` |
| Identity | Register | `apiService.registerUser({ firstName, lastName, email, countryCode, phoneNumber })` |
| Identity | Send OTP | `apiService.sendOtp(userId, countryCode, phoneNumber)` |
| Verify | Check OTP | `apiService.verifyOtp(userId, otp)` |
| Verify | Resend OTP | `apiService.resendOtp(userId, countryCode, phoneNumber)` |

## Step Flow (do not reorder)

```
origin → vehicle → identity → verify → finish → maps
  01        02        03         04       05      06
```
