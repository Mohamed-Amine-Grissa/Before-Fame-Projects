# Design Tokens Reference

## Colors (use via CSS variables or inline style)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-void` | `#060608` | Page background |
| `--color-surface-1` | `#0a0a0d` | Card / panel base |
| `--color-surface-2` | `#0f0f13` | Elevated surface |
| `--color-surface-3` | `#161619` | Hover surface |
| `--color-gold` | `#c8a96e` | Primary accent |
| `--color-gold-light` | `#e8d5a0` | Gold hover / light |
| `--color-gold-dim` | `rgba(200,169,110,0.4)` | Muted gold |
| `--color-gold-ghost` | `rgba(200,169,110,0.08)` | Gold tint bg |
| `--color-emerald` | `#34d399` | Success / available |
| `--color-amber` | `#fb923c` | Warning / occupied |
| `--color-crimson` | `#ef4444` | Error / danger |
| `--color-indigo` | `#818cf8` | Secondary accent |
| `--color-border` | `rgba(255,255,255,0.06)` | Subtle border |

## Opacity Ramp (white text)

| Class | Value | Usage |
|-------|-------|-------|
| `text-white` | 100% | Active / primary content |
| `text-white/80` | 80% | Secondary content |
| `text-white/60` | 60% | Tertiary content |
| `text-white/40` | 40% | Muted / helper text |
| `text-white/30` | 30% | Placeholder / inactive |
| `text-white/15` | 15% | Input placeholder |

## Spacing Scale

| Usage | Value |
|-------|-------|
| Micro gap (icon+label) | `gap-2` / `gap-3` |
| Card internal padding | `p-6` (sm) · `p-8` (md) |
| Section gap | `gap-8` / `gap-10` |
| Page section spacing | `mb-16` |
| Between major sections | `gap-12` / `gap-16` |

## Border Radius Scale

| Usage | Class |
|-------|-------|
| Buttons | `rounded-xl` or no radius (full-width) |
| Cards / panels | `rounded-2xl` |
| Badges / pills | `rounded-full` |
| Icon containers | `rounded-xl` |
| Inputs | `rounded-none` (underline style only) |
| Map container | `rounded-2xl` |

## Typography Scale

| Role | Size | Font | Weight | Tracking |
|------|------|------|--------|----------|
| Hero H1 | `text-7xl` / `text-9xl` | Cormorant Garamond | 900 | `tracking-tighter` |
| Page H2 | `text-5xl` / `text-6xl` | Cormorant Garamond | 700–900 | `tracking-tight` |
| Card H3 | `text-xl` / `text-2xl` | Cormorant Garamond | 700 | default |
| Body | `text-sm` / `text-base` | DM Sans | 400 | `tracking-wide` |
| Small body | `text-xs` | DM Sans | 400–500 | `tracking-wide` |
| Label caps | `text-[9px]` / `text-[10px]` | DM Sans | 600 | `tracking-[0.35em]` |
| Mono data | `text-xl`+ | JetBrains Mono | 700 | `tracking-[0.2em]` |
| Step counter | `text-[10px]` | DM Sans | 600 | `tracking-[0.4em]` |

## Shadow / Glow Reference

```css
/* Gold glow — buttons, active elements */
box-shadow: 0 0 20px rgba(200,169,110,0.2), 0 0 40px rgba(200,169,110,0.1);

/* Emerald glow — success states */
box-shadow: 0 0 20px rgba(52,211,153,0.2);

/* Crimson glow — error states */
box-shadow: 0 0 20px rgba(239,68,68,0.2);

/* Text glow (gold headings) */
text-shadow: 0 0 30px rgba(200,169,110,0.5), 0 0 60px rgba(200,169,110,0.2);
```
