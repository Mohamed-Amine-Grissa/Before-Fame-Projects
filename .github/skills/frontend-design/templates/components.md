# Component Templates

Copy-paste ready components matching the Telsa design system.

---

## GoldInput (Underline Input Field)

```tsx
const GoldInput = ({
  label, value, onChange, placeholder,
  type = 'text', mono = false, error = false
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; mono?: boolean; error?: boolean;
}) => (
  <div className="space-y-2 group">
    <label className="block text-[9px] uppercase tracking-[0.35em] font-semibold"
      style={{ color: 'rgba(200,169,110,0.6)' }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full py-4 px-5 rounded-none border-b-2 bg-transparent text-white",
        "transition-all duration-300 outline-none placeholder:opacity-15",
        mono && "font-mono tracking-[0.2em]",
        error ? "border-red-500/70 text-red-300" : "border-white/10 focus:border-[#c8a96e]"
      )}
    />
    <div className="h-px w-0 group-focus-within:w-full transition-all duration-500"
      style={{ background: 'linear-gradient(to right, #c8a96e, #e8d5a0)' }} />
  </div>
);
```

---

## CtaButton (Magnetic Primary Button)

```tsx
const CtaButton = ({ onClick, disabled, loading, children }: {
  onClick: () => void; disabled?: boolean; loading?: boolean; children: React.ReactNode;
}) => (
  <MagneticBtn
    onClick={onClick}
    disabled={disabled || loading}
    className={cn(
      "relative w-full py-5 px-10 font-bold text-sm tracking-[0.25em]",
      "uppercase overflow-hidden group transition-all duration-500 bg-transparent text-white",
      (disabled || loading) && "opacity-40 cursor-not-allowed"
    )}
    style={{ border: '1px solid rgba(200,169,110,0.5)' }}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.05))' }} />
    <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
      style={{ background: 'linear-gradient(to right, #c8a96e, #e8d5a0)' }} />
    <div className="absolute top-0 right-0 h-px w-0 group-hover:w-full transition-all duration-700"
      style={{ background: 'linear-gradient(to left, #c8a96e, #e8d5a0)' }} />
    <span className="relative z-10 flex items-center justify-center gap-3">
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
        <>{children} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
      )}
    </span>
  </MagneticBtn>
);
```

---

## SectionHeader

```tsx
const SectionHeader = ({ step, title, subtitle }: {
  step: string; title: React.ReactNode; subtitle: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="mb-16"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px" style={{ background: '#c8a96e' }} />
      <span className="text-[10px] font-semibold tracking-[0.4em] uppercase"
        style={{ color: '#c8a96e' }}>{step}</span>
    </div>
    <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-4"
      style={{ fontFamily: '"Cormorant Garamond", serif' }}>
      {title}
    </h2>
    <p className="text-sm text-white/40 font-light tracking-wide max-w-sm">{subtitle}</p>
  </motion.div>
);
```

---

## ErrorBanner / InfoBanner

```tsx
const ErrorBanner = ({ msg }: { msg: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center gap-3 px-5 py-4 rounded-xl"
    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
  >
    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
    <p className="text-sm text-red-300 font-medium">{msg}</p>
  </motion.div>
);

const InfoBanner = ({ msg }: { msg: string }) => (
  <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
    style={{ background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.15)' }}>
    <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#c8a96e' }} />
    <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,169,110,0.7)' }}>{msg}</p>
  </div>
);
```

---

## IconBadge

```tsx
// Gold variant
<div className="w-10 h-10 rounded-xl flex items-center justify-center"
  style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
  <SomeIcon className="w-5 h-5" style={{ color: '#c8a96e' }} />
</div>

// Indigo variant (service/secondary)
<div className="w-10 h-10 rounded-xl flex items-center justify-center"
  style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)' }}>
  <SomeIcon className="w-5 h-5 text-indigo-400" />
</div>
```

---

## StatGrid (3-column stats row)

```tsx
<div className="grid grid-cols-3 gap-3">
  {[{ label: 'Label', value: 'Val' }].map(({ label, value }) => (
    <div key={label} className="py-4 rounded-xl text-center"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-xl font-black" style={{ color: '#c8a96e', fontFamily: '"Cormorant Garamond", serif' }}>
        {value}
      </p>
      <p className="text-[9px] uppercase tracking-widest text-white/30 mt-0.5">{label}</p>
    </div>
  ))}
</div>
```

---

## Card Surface Variants

```tsx
// Standard surface
const CardBase = ({ children, className }: any) => (
  <div className={cn("p-6 rounded-2xl", className)}
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
    {children}
  </div>
);

// Gold-tinted surface (active / selected state)
const CardGold = ({ children }: any) => (
  <div className="p-6 rounded-2xl"
    style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.25)' }}>
    {children}
  </div>
);

// Glass (overlay / modal)
const CardGlass = ({ children }: any) => (
  <div className="p-6 rounded-2xl glass"> {/* uses .glass from index.css */}
    {children}
  </div>
);
```

---

## Corner Bracket Decoration

```tsx
// Adds architectural corner lines to any container (top-right + bottom-left)
const CornerBrackets = () => (
  <>
    <div className="absolute top-0 right-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-px h-8" style={{ background: 'linear-gradient(to bottom, #c8a96e, transparent)' }} />
      <div className="absolute top-0 right-0 w-8 h-px" style={{ background: 'linear-gradient(to left, #c8a96e, transparent)' }} />
    </div>
    <div className="absolute bottom-0 left-0 pointer-events-none">
      <div className="absolute bottom-0 left-0 w-px h-8" style={{ background: 'linear-gradient(to top, #c8a96e, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-8 h-px" style={{ background: 'linear-gradient(to right, #c8a96e, transparent)' }} />
    </div>
  </>
);

// Usage inside any relative container:
<div className="relative overflow-hidden p-8 rounded-2xl ...">
  <CornerBrackets />
  {/* content */}
</div>
```

---

## TypeSelector (Segmented Control)

```tsx
const TypeSelector = ({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3">
    {options.map((opt) => {
      const isActive = value === opt;
      return (
        <motion.button key={opt} onClick={() => onChange(opt)} whileTap={{ scale: 0.95 }}
          className="relative px-6 py-3 text-sm font-bold tracking-widest uppercase overflow-hidden transition-all duration-400"
          style={{
            border: `1px solid ${isActive ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.08)'}`,
            color: isActive ? '#c8a96e' : 'rgba(255,255,255,0.35)',
            background: isActive ? 'rgba(200,169,110,0.08)' : 'transparent',
          }}>
          {isActive && (
            <motion.div layoutId="type-bg" className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.1), transparent)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          )}
          <span className="relative z-10">{opt}</span>
        </motion.button>
      );
    })}
  </div>
);
```
