# Animation Patterns Reference

## Core Easing Curve

**Always use this for entrance animations:**
```ts
ease: [0.22, 1, 0.36, 1]
// Apple's "emphasized decelerate" — objects snap in with authority
```

## Entrance Variants (copy-paste)

```ts
// Slide up (most common — lists, cards, content blocks)
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}

// Slide in from right (step transitions going forward)
initial={{ opacity: 0, x: 50 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -50 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}

// Scale reveal (modals, completion screens, cards)
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}

// Text word reveal (hero headings — stagger each word)
initial={{ y: '100%', opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}

// Fade only (overlays, badges, supplementary content)
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.4 }}
```

## Stagger Delays

```ts
// Fast stagger (list items, nav items)
transition={{ delay: i * 0.05 }}

// Medium stagger (cards in a grid)
transition={{ delay: i * 0.08 }}

// Slow stagger (hero word-by-word)
transition={{ delay: i * 0.12 }}

// With base offset (elements appear after page loads)
transition={{ delay: i * 0.07 + 0.3 }}
```

## Hover Interactions

```ts
// Slide right on hover (list items, location cards)
whileHover={{ x: 4 }}

// Subtle scale (icon buttons, badges)
whileHover={{ scale: 1.05 }}

// Press feedback
whileTap={{ scale: 0.9 }}  // hard press (keypad buttons)
whileTap={{ scale: 0.98 }} // soft press (cards, options)
```

## Repeating Animations

```ts
// Status dot pulse (system alive indicators)
animate={{ opacity: [1, 0.3, 1] }}
transition={{ duration: 2, repeat: Infinity }}

// Orb breathing (background glows)
animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}

// Scroll indicator bounce
animate={{ y: [0, 8, 0] }}
transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}

// Map marker ping
animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}

// OTP cursor blink
animate={{ opacity: [1, 0, 1] }}
transition={{ duration: 1, repeat: Infinity }}
```

## Spring Configs

```ts
// Magnetic button physics
useSpring(value, { stiffness: 200, damping: 20 })

// layoutId navigation pill
transition={{ type: 'spring', stiffness: 400, damping: 30 }}

// Bouncy success icon reveal
transition={{ delay: 0.3, type: 'spring', stiffness: 200 })
```

## AnimatePresence Rules

```tsx
// Step transitions — ALWAYS mode="wait" to prevent overlap
<AnimatePresence mode="wait">
  {currentStep === 'origin' && <Step1 key="origin" />}
  {currentStep === 'vehicle' && <Step2 key="vehicle" />}
</AnimatePresence>

// Conditional UI (errors, dropdowns, tooltips)
<AnimatePresence>
  {showError && <ErrorBanner key="err" />}
</AnimatePresence>
// Each child MUST have a unique key prop for AnimatePresence to work
```

## Glitch Text Effect

```tsx
const GlitchText = ({ text, className }) => (
  <span className={cn("relative inline-block", className)}>
    <span className="relative z-10">{text}</span>
    {/* Red channel shift */}
    <motion.span className="absolute inset-0 opacity-0"
      animate={{ opacity: [0, 0.6, 0], x: [0, -2, 0] }}
      transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 4 }}
      style={{ color: '#c8a96e', clipPath: 'inset(30% 0 40% 0)' }}>
      {text}
    </motion.span>
    {/* Blue channel shift */}
    <motion.span className="absolute inset-0 opacity-0"
      animate={{ opacity: [0, 0.4, 0], x: [0, 2, 0] }}
      transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 4, delay: 0.05 }}
      style={{ color: '#8888ff', clipPath: 'inset(60% 0 20% 0)' }}>
      {text}
    </motion.span>
  </span>
);
```

## layoutId Pattern (shared element transitions)

```tsx
// Used in NavRail for active step indicator — morphs between positions
{isActive && (
  <motion.div
    layoutId="nav-pill"          // unique ID — only ONE element with this ID visible at a time
    className="absolute ..."
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  />
)}

// Used in TypeSelector (TN / RS / CD buttons) for background highlight
{isActive && (
  <motion.div
    layoutId="type-bg"
    className="absolute inset-0"
    style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.1), transparent)' }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
  />
)}
```
