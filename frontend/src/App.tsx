import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import {
  MapPin, Car, User, Key, CheckCircle, ChevronRight, Globe, ShieldCheck,
  Info, ArrowRight, Delete, Home, AlertCircle, Loader2, Navigation, Zap,
  Activity, Radio
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { apiService } from './services/api';
import { GoogleGenAI } from "@google/genai";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
mapboxgl.accessToken = process.env.VITE_MAPBOX_TOKEN || '';

type Step = 'origin' | 'vehicle' | 'identity' | 'verify' | 'finish' | 'maps';

const STEPS: { id: Step; label: string; icon: any; num: string }[] = [
  { id: 'origin',   label: 'Origin',   icon: MapPin,      num: '01' },
  { id: 'vehicle',  label: 'Vehicle',  icon: Car,         num: '02' },
  { id: 'identity', label: 'Identity', icon: User,        num: '03' },
  { id: 'verify',   label: 'Verify',   icon: Key,         num: '04' },
  { id: 'finish',   label: 'Finish',   icon: CheckCircle, num: '05' },
  { id: 'maps',     label: 'Network',  icon: Navigation,  num: '06' },
];

// ─── Magnetic Button ───────────────────────────────────────────────
const MagneticBtn = ({ children, className, onClick, disabled }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
      <motion.button
          ref={ref}
          style={{ x: sx, y: sy }}
          onMouseMove={handleMouse}
          onMouseLeave={reset}
          onClick={onClick}
          disabled={disabled}
          className={className}
      >
        {children}
      </motion.button>
  );
};

// ─── Scanline Background ────────────────────────────────────────────
const Background = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: '#060608' }}>
      {/* Hex grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <polygon points="28,2 54,16 54,44 28,58 2,44 2,16" fill="none" stroke="#c8a96e" strokeWidth="0.5"/>
            <polygon points="28,52 54,66 54,94 28,108 2,94 2,66" fill="none" stroke="#c8a96e" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)"/>
      </svg>

      {/* Scanlines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)',
        backgroundSize: '100% 4px'
      }}/>

      {/* Orb top-right */}
      <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.25) 0%, transparent 65%)' }}
      />
      {/* Orb bottom-left */}
      <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-60 -left-60 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(120,140,200,0.2) 0%, transparent 65%)' }}
      />

      {/* Vertical chrome lines */}
      {[15, 45, 75].map((p, i) => (
          <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 2, delay: i * 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${p}%`,
                background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.08), transparent)',
                transformOrigin: 'top'
              }}
          />
      ))}
    </div>
);

// ─── Glitch Text ────────────────────────────────────────────────────
const GlitchText = ({ text, className }: { text: string; className?: string }) => (
    <span className={cn("relative inline-block", className)}>
    <span className="relative z-10">{text}</span>
    <motion.span
        className="absolute inset-0 opacity-0"
        animate={{ opacity: [0, 0.6, 0], x: [0, -2, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 4 }}
        style={{ color: '#c8a96e', clipPath: 'inset(30% 0 40% 0)' }}
    >{text}</motion.span>
    <motion.span
        className="absolute inset-0 opacity-0"
        animate={{ opacity: [0, 0.4, 0], x: [0, 2, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 4, delay: 0.05 }}
        style={{ color: '#8888ff', clipPath: 'inset(60% 0 20% 0)' }}
    >{text}</motion.span>
  </span>
);

// ─── Gold Input ─────────────────────────────────────────────────────
const GoldInput = ({ label, value, onChange, placeholder, type = 'text', mono = false, error = false }: any) => (
    <div className="space-y-2 group">
      <label className="block text-[9px] uppercase tracking-[0.35em] font-semibold" style={{ color: 'rgba(200,169,110,0.6)' }}>
        {label}
      </label>
      <div className="relative">
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn(
                "w-full py-4 px-5 rounded-none border-b-2 bg-transparent text-white transition-all duration-300 outline-none placeholder:opacity-20",
                mono && "font-mono tracking-[0.2em]",
                error
                    ? "border-red-500/70 text-red-300"
                    : "border-white/10 focus:border-[#c8a96e]"
            )}
            style={{ fontSize: '15px', letterSpacing: mono ? '0.15em' : undefined }}
        />
        <motion.div
            className="absolute bottom-0 left-0 h-0.5 w-0"
            whileFocus={{ width: '100%' }}
            style={{ background: 'linear-gradient(to right, #c8a96e, #e8d5a0)' }}
        />
        {/* Focus glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-focus-within:opacity-100 transition-opacity"
             style={{ boxShadow: '0 0 12px rgba(200,169,110,0.5)', background: '#c8a96e' }} />
      </div>
    </div>
);

// ─── Navigation Rail ────────────────────────────────────────────────
const NavRail = ({ currentStep, onStepClick }: { currentStep: Step; onStepClick: (s: Step) => void }) => (
    <nav className="fixed left-0 top-0 h-full w-20 hidden lg:flex flex-col items-center justify-center gap-8 z-50"
         style={{ borderRight: '1px solid rgba(255,255,255,0.04)', background: 'rgba(6,6,8,0.7)', backdropFilter: 'blur(24px)' }}>
      {/* Logo mark */}
      <div className="absolute top-8">
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-9 h-9 rounded-full border flex items-center justify-center"
            style={{ borderColor: 'rgba(200,169,110,0.4)' }}
        >
          <span className="text-xs font-black" style={{ color: '#c8a96e', fontFamily: '"Cormorant Garamond", serif' }}>T</span>
        </motion.div>
      </div>

      {STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const Icon = step.icon;
        return (
            <motion.button
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 + 0.3, duration: 0.5 }}
                onClick={() => onStepClick(step.id)}
                className="relative flex flex-col items-center gap-1.5 group"
                title={step.label}
            >
              {isActive && (
                  <motion.div
                      layoutId="nav-pill"
                      className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                      style={{ background: 'linear-gradient(to bottom, #c8a96e, #e8d5a0)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
              )}
              <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-[#c8a96e]/15 border border-[#c8a96e]/30" : "border border-transparent hover:border-white/10 hover:bg-white/5"
              )}>
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-[#c8a96e]" : "text-white/30 group-hover:text-white/60")} />
              </div>
              <span className={cn("text-[8px] font-bold tracking-widest uppercase transition-colors", isActive ? "text-[#c8a96e]" : "text-white/20 group-hover:text-white/40")}>
            {step.num}
          </span>
            </motion.button>
        );
      })}

      <div className="absolute bottom-8 flex flex-col items-center gap-1">
        <div className="w-px h-12 opacity-30" style={{ background: 'linear-gradient(to bottom, transparent, #c8a96e)' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </nav>
);

// ─── Top Bar ────────────────────────────────────────────────────────
const TopBar = ({ currentStep, onStepClick }: { currentStep: Step; onStepClick: (s: Step) => void }) => {
  const activeStep = STEPS.find(s => s.id === currentStep);
  return (
      <header className="fixed top-0 left-0 lg:left-20 right-0 z-40 flex items-center justify-between px-8 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(6,6,8,0.6)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-6">
          {/* Mobile logo */}
          <span className="lg:hidden text-lg font-black tracking-[0.3em]" style={{ color: '#c8a96e', fontFamily: '"Cormorant Garamond", serif' }}>TELSA</span>
          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(200,169,110,0.5)' }}>Telsa Registry</span>
            <ChevronRight className="w-3 h-3 opacity-30" style={{ color: '#c8a96e' }} />
            <span className="text-[10px] tracking-widest uppercase text-white/70">{activeStep?.label}</span>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((step) => (
              <button key={step.id} onClick={() => onStepClick(step.id)} className="relative group">
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-500",
                    currentStep === step.id ? "w-6 bg-[#c8a96e]" : "bg-white/20 hover:bg-white/40"
                )} />
              </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Activity className="w-3 h-3" style={{ color: '#c8a96e' }} />
            <span className="text-[9px] font-bold tracking-widest uppercase text-white/40">Online</span>
          </div>
          <button className="text-[10px] font-semibold tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors">
            Exit
          </button>
        </div>
      </header>
  );
};

// ─── Bottom Nav (mobile) ────────────────────────────────────────────
const BottomNav = ({ currentStep, onStepClick }: { currentStep: Step; onStepClick: (s: Step) => void }) => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center px-4 pt-3 pb-6"
         style={{ background: 'rgba(6,6,8,0.95)', backdropFilter: 'blur(30px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {STEPS.map((step) => {
        const isActive = currentStep === step.id;
        const Icon = step.icon;
        return (
            <button key={step.id} onClick={() => onStepClick(step.id)} className="flex flex-col items-center gap-1 p-2">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-all", isActive ? "bg-[#c8a96e]/20" : "")}>
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-[#c8a96e]" : "text-white/25")} />
              </div>
              <span className={cn("text-[8px] font-bold tracking-wider uppercase transition-colors", isActive ? "text-[#c8a96e]" : "text-white/20")}>
            {step.num}
          </span>
            </button>
        );
      })}
    </nav>
);

// ─── Section Header ─────────────────────────────────────────────────
const SectionHeader = ({ step, title, subtitle }: { step: string; title: React.ReactNode; subtitle: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-px" style={{ background: '#c8a96e' }} />
        <span className="text-[10px] font-semibold tracking-[0.4em] uppercase" style={{ color: '#c8a96e' }}>{step}</span>
      </div>
      <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-4" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
        {title}
      </h2>
      <p className="text-sm text-white/40 font-light tracking-wide max-w-sm">{subtitle}</p>
    </motion.div>
);

// ─── Error / Success Banners ────────────────────────────────────────
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

// ─── CTA Button ─────────────────────────────────────────────────────
const CtaButton = ({ onClick, disabled, loading: isLoading, children, variant = 'gold' }: any) => (
    <MagneticBtn
        onClick={onClick}
        disabled={disabled || isLoading}
        className={cn(
            "relative w-full py-5 px-10 font-bold text-sm tracking-[0.25em] uppercase overflow-hidden group transition-all duration-500",
            variant === 'gold'
                ? "bg-transparent text-white"
                : "bg-white/5 text-white/70 hover:bg-white/8 border border-white/10",
            (disabled || isLoading) && "opacity-40 cursor-not-allowed"
        )}
        style={variant === 'gold' ? { border: '1px solid rgba(200,169,110,0.5)' } : {}}
    >
      {variant === 'gold' && (
          <>
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.15), rgba(200,169,110,0.05))' }}
            />
            <motion.div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                style={{ background: 'linear-gradient(to right, #c8a96e, #e8d5a0)' }}
            />
            <motion.div
                className="absolute top-0 right-0 h-px w-0 group-hover:w-full transition-all duration-700"
                style={{ background: 'linear-gradient(to left, #c8a96e, #e8d5a0)' }}
            />
          </>
      )}
      <span className="relative z-10 flex items-center justify-center gap-3">
      {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
          <>
            {children}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
      )}
    </span>
    </MagneticBtn>
);

// ─── STEP 1: WELCOME ────────────────────────────────────────────────
const Step1Welcome = ({onNext, key}: { onNext: () => void, key?: string }) => {
  const words = ['The', 'Future', 'Starts', 'Here.'];
  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Hero image */}
        <div className="absolute inset-0 z-0">
          <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1617788130012-02ba710ee514?q=80&w=2070&auto=format&fit=crop')`,
                opacity: 0.2,
                filter: 'grayscale(60%) contrast(1.2)'
              }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #060608 0%, transparent 30%, transparent 60%, #060608 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #060608 0%, transparent 40%, transparent 60%, #060608 100%)' }} />
        </div>

        {/* Animated corner brackets */}
        {['tl', 'tr', 'bl', 'br'].map((pos, i) => (
            <motion.div
                key={pos}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ delay: i * 0.15 + 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "absolute w-12 h-12 pointer-events-none",
                    pos === 'tl' && "top-8 left-8",
                    pos === 'tr' && "top-8 right-8",
                    pos === 'bl' && "bottom-32 left-8",
                    pos === 'br' && "bottom-32 right-8",
                )}
            >
              <div className={cn("absolute w-6 h-px", pos.includes('l') ? "left-0" : "right-0", pos.includes('t') ? "top-0" : "bottom-0")} style={{ background: '#c8a96e' }} />
              <div className={cn("absolute w-px h-6", pos.includes('l') ? "left-0" : "right-0", pos.includes('t') ? "top-0" : "bottom-0")} style={{ background: '#c8a96e' }} />
            </motion.div>
        ))}

        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto px-6">
          {/* Badge */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex items-center gap-3 mb-12 px-6 py-2.5 rounded-full"
              style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)' }}
          >
            <Radio className="w-3 h-3" style={{ color: '#c8a96e' }} />
            <span className="text-[10px] font-semibold tracking-[0.4em] uppercase" style={{ color: '#c8a96e' }}>
            Tunisia Vehicle Registry — EST. 2024
          </span>
          </motion.div>

          {/* Hero title */}
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-8 overflow-hidden"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block mr-6"
                    style={{ color: i === 3 ? '#c8a96e' : 'white' }}
                >
                  {word}
                </motion.span>
            ))}
          </h1>

          <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-base md:text-lg text-white/40 font-light tracking-wide max-w-lg mx-auto mb-16"
          >
            Experience the nexus of precision engineering and digital sovereignty. Register your vehicle on the Telsa national network.
          </motion.p>

          {/* Card */}
          <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-md w-full"
          >
            <div className="p-8 rounded-2xl relative overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)' }}>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-px h-8" style={{ background: 'linear-gradient(to bottom, #c8a96e, transparent)' }} />
                <div className="absolute top-0 right-0 w-8 h-px" style={{ background: 'linear-gradient(to left, #c8a96e, transparent)' }} />
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-px h-8" style={{ background: 'linear-gradient(to top, #c8a96e, transparent)' }} />
                <div className="absolute bottom-0 left-0 w-8 h-px" style={{ background: 'linear-gradient(to right, #c8a96e, transparent)' }} />
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    <Car className="w-6 h-6" style={{ color: '#c8a96e' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                      Welcome to the Fleet
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5">Synchronize your Telsa Identity</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[{ n: '15', l: 'Stations' }, { n: '99%', l: 'Uptime' }, { n: '24h', l: 'Support' }].map(({ n, l }) => (
                      <div key={l} className="text-center py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-xl font-black" style={{ color: '#c8a96e', fontFamily: '"Cormorant Garamond", serif' }}>{n}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mt-0.5">{l}</p>
                      </div>
                  ))}
                </div>

                <CtaButton onClick={onNext}>Initialize Registration</CtaButton>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-16 flex flex-col items-center gap-3 opacity-30"
          >
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/60">Scroll</span>
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-12"
                style={{ background: 'linear-gradient(to bottom, #c8a96e, transparent)' }}
            />
          </motion.div>
        </div>
      </motion.div>
  );
};

// ─── Radial Type Selector ───────────────────────────────────────────
const TypeSelector = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex items-center gap-3">
      {options.map((opt) => {
        const isActive = value === opt;
        return (
            <motion.button
                key={opt}
                onClick={() => onChange(opt)}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-400 overflow-hidden"
                style={{
                  border: `1px solid ${isActive ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? '#c8a96e' : 'rgba(255,255,255,0.35)',
                  background: isActive ? 'rgba(200,169,110,0.08)' : 'transparent',
                }}
            >
              {isActive && (
                  <motion.div
                      layoutId="type-bg"
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.1), transparent)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
              )}
              <span className="relative z-10">{opt}</span>
            </motion.button>
        );
      })}
    </div>
);

// ─── STEP 2: VEHICLE ────────────────────────────────────────────────
const Step2Vehicle = ({ formData, updateFormData, onVerify, loading, error }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl mx-auto px-6"
    >
      <SectionHeader step="Step 02 / 05" title={<><GlitchText text="Vehicle" /> <span style={{ color: '#c8a96e' }}>ID</span></>} subtitle="Register your vehicle's identification parameters within the Telsa secure registry." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Provenance */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.35em] font-semibold" style={{ color: 'rgba(200,169,110,0.5)' }}>Select Provenance</p>
          {[{ val: 'local', label: 'Local', sub: 'Domestic / Registered', icon: Home }, { val: 'foreign', label: 'Foreign', sub: 'Import / Transit', icon: Globe }].map(({ val, label, sub, icon: Icon }) => {
            const isActive = formData.origin === val;
            return (
                <motion.button
                    key={val}
                    onClick={() => updateFormData({ origin: val })}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 rounded-xl flex items-center justify-between text-left transition-all duration-500 group"
                    style={{
                      background: isActive ? 'rgba(200,169,110,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? 'rgba(200,169,110,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                >
                  <div>
                    <p className="font-bold text-xl mb-1" style={{ color: isActive ? '#c8a96e' : 'rgba(255,255,255,0.75)', fontFamily: '"Cormorant Garamond", serif' }}>{label}</p>
                    <p className="text-xs text-white/35">{sub}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
                       style={{ background: isActive ? 'rgba(200,169,110,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? 'rgba(200,169,110,0.3)' : 'transparent'}` }}>
                    <Icon className="w-5 h-5 transition-colors" style={{ color: isActive ? '#c8a96e' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                </motion.button>
            );
          })}
        </div>

        {/* Form */}
        <motion.div
            animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 p-8 rounded-2xl space-y-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}` }}
        >
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(200,169,110,0.05), transparent)' }} />

          <GoldInput label="Vehicle Identification Number (VIN)" value={formData.vin} onChange={(e: any) => updateFormData({ vin: e.target.value })} placeholder="1HGCM8263 3A004352" mono error={!!error && !formData.vin} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GoldInput label="License Plate" value={formData.plateNumber} onChange={(e: any) => updateFormData({ plateNumber: e.target.value })} placeholder="ABC-9999" error={!!error && !formData.plateNumber} />
            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.35em] font-semibold" style={{ color: 'rgba(200,169,110,0.6)' }}>Category</p>
              <TypeSelector options={['TN', 'RS', 'CD']} value={formData.localPlateType} onChange={(val) => updateFormData({ localPlateType: val })} />
            </div>
          </div>

          <AnimatePresence>{error && <ErrorBanner msg={error} />}</AnimatePresence>

          <div className="space-y-4 pt-2">
            <CtaButton onClick={onVerify} loading={loading} disabled={formData.vin.length < 5}>
              Verify Vehicle
            </CtaButton>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-white/40 leading-tight">Vehicle data cross-referenced with <span className="text-emerald-400 font-semibold">European Registry Hub</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
);

// ─── STEP 3: IDENTITY ────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { code: 'FR', name: 'France',  dial: '+33',  flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dial: '+49',  flag: '🇩🇪' },
  { code: 'US', name: 'USA',     dial: '+1',   flag: '🇺🇸' },
  { code: 'GB', name: 'UK',      dial: '+44',  flag: '🇬🇧' },
];

const Step3UserIdentity = ({ formData, updateFormData, onRegister, loading, error }: any) => {
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const selectedCountry = COUNTRIES.find(c => c.dial === formData.countryCode) || COUNTRIES[0];

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      updateFormData({ phoneNumber: formData.phoneNumber.slice(0, -1) });
    } else if (formData.phoneNumber.length < 8) {
      updateFormData({ phoneNumber: formData.phoneNumber + key });
    }
  };

  const formatPhone = (val: string) => {
    const parts = val.padEnd(8, '–').split('');
    return `${parts.slice(0, 2).join('')} ${parts.slice(2, 5).join('')} ${parts.slice(5, 8).join('')}`;
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl mx-auto px-6"
      >
        <SectionHeader step="Step 03 / 05" title={<>Digital <span style={{ color: '#c8a96e' }}>Identity</span></>} subtitle="Synchronize your biometric and contact data with the Telsa central network." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Personal Info */}
          <div className="p-8 rounded-2xl space-y-7"
               style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
                <User className="w-4 h-4" style={{ color: '#c8a96e' }} />
              </div>
              <h3 className="font-bold text-white" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem' }}>Driver Profile</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <GoldInput label="First Name" value={formData.firstName} onChange={(e: any) => updateFormData({ firstName: e.target.value })} placeholder="ELON" />
              <GoldInput label="Last Name"  value={formData.lastName}  onChange={(e: any) => updateFormData({ lastName: e.target.value })}  placeholder="REEVE" />
            </div>
            <GoldInput label="Secure Email" type="email" value={formData.email} onChange={(e: any) => updateFormData({ email: e.target.value })} placeholder="identity@telsa.tn" />

            <AnimatePresence>{error && <ErrorBanner msg={error} />}</AnimatePresence>

            <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                 style={{ background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.15)' }}>
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#c8a96e' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,169,110,0.7)' }}>
                Identity will be verified via encrypted hardware token upon final confirmation.
              </p>
            </div>
          </div>

          {/* Phone dialer */}
          <div className="flex flex-col gap-4">
            {/* Phone display */}
            <div className="p-6 rounded-2xl text-center relative overflow-hidden"
                 style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(200,169,110,0.5)' }}>Secure Mobile Uplink</p>

              {/* Country selector */}
              <div className="relative inline-block mb-4">
                <button
                    onClick={() => setShowCountrySelector(!showCountrySelector)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="font-bold text-sm" style={{ color: '#c8a96e' }}>{selectedCountry.dial}</span>
                  <ChevronRight className="w-3 h-3 text-white/30 rotate-90" />
                </button>
                <AnimatePresence>
                  {showCountrySelector && (
                      <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden z-50 shadow-2xl"
                          style={{ background: '#0d0d10', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {COUNTRIES.map((c) => (
                            <button key={c.code} onClick={() => { updateFormData({ countryCode: c.dial }); setShowCountrySelector(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <span>{c.flag}</span>
                              <span className="text-sm font-medium text-white/70">{c.name}</span>
                              <span className="text-xs ml-auto" style={{ color: '#c8a96e' }}>{c.dial}</span>
                            </button>
                        ))}
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Number display */}
              <div className="text-4xl font-mono font-bold tracking-wider text-white">
                {formatPhone(formData.phoneNumber).split('').map((ch, i) => (
                    <motion.span
                        key={i}
                        initial={ch !== '–' && formData.phoneNumber.length > 0 ? { y: -20, opacity: 0 } : {}}
                        animate={{ y: 0, opacity: 1 }}
                        style={{ color: ch === '–' ? 'rgba(255,255,255,0.15)' : 'white' }}
                    >{ch}</motion.span>
                ))}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((k, i) => {
                if (k === '') return <div key={i} />;
                return (
                    <motion.button
                        key={i}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleKeyPress(k === 'del' ? 'delete' : k.toString())}
                        className="aspect-square flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-300"
                        style={{
                          background: k === 'del' ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${k === 'del' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                          color: k === 'del' ? '#ef4444' : 'rgba(255,255,255,0.8)',
                        }}
                    >
                      {k === 'del' ? <Delete className="w-5 h-5" /> : k}
                    </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-sm mx-auto lg:mx-0">
          <CtaButton
              onClick={onRegister}
              loading={loading}
              disabled={!formData.firstName || !formData.lastName || !formData.email || formData.phoneNumber.length < 8}
          >
            Continue to Verification
          </CtaButton>
        </div>
      </motion.div>
  );
};

// ─── STEP 4: OTP ────────────────────────────────────────────────────
const Step4OtpVerify = ({ formData, updateFormData, onVerifyOtp, onResendOtp, loading, error }: any) => {
  const otpArray = formData.otp.padEnd(6, '').split('');
  const activeIndex = formData.otp.length < 6 ? formData.otp.length : 5;

  const handleKeyPress = (digit: string) => {
    if (formData.otp.length < 6) updateFormData({ otp: formData.otp + digit });
  };
  const handleDelete = () => updateFormData({ otp: formData.otp.slice(0, -1) });

  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md mx-auto px-6 text-center"
      >
        <SectionHeader
            step="Step 04 / 05"
            title={<>Identity <span style={{ color: '#c8a96e' }}>Verify</span></>}
            subtitle="Enter the 6-digit security code sent to your registered mobile device."
        />

        {/* OTP boxes */}
        <div className="flex justify-center gap-3 mb-10">
          {otpArray.map((digit, i) => (
              <motion.div
                  key={i}
                  animate={i === activeIndex && formData.otp.length < 6 ? { borderColor: ['rgba(200,169,110,0.3)', 'rgba(200,169,110,0.8)', 'rgba(200,169,110,0.3)'] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-12 h-16 md:w-14 md:h-20 rounded-xl flex items-center justify-center relative"
                  style={{
                    background: digit ? 'rgba(200,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${digit ? 'rgba(200,169,110,0.4)' : i === activeIndex ? 'rgba(200,169,110,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}
              >
                {i === activeIndex && !digit ? (
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-px h-8"
                        style={{ background: '#c8a96e' }}
                    />
                ) : (
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-black"
                        style={{ color: '#c8a96e', fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {digit || ''}
                    </motion.span>
                )}
              </motion.div>
          ))}
        </div>

        <AnimatePresence>{error && <div className="mb-6"><ErrorBanner msg={error} /></div>}</AnimatePresence>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((k, i) => {
            if (k === '') return <div key={i} />;
            return (
                <motion.button
                    key={i}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => k === 'del' ? handleDelete() : handleKeyPress(k.toString())}
                    className="aspect-square flex items-center justify-center text-xl font-bold rounded-xl transition-all"
                    style={{
                      background: k === 'del' ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${k === 'del' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      color: k === 'del' ? '#ef4444' : 'rgba(255,255,255,0.8)',
                    }}
                >
                  {k === 'del' ? <Delete className="w-5 h-5" /> : k}
                </motion.button>
            );
          })}
        </div>

        {/* Resend + progress */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <button onClick={onResendOtp} disabled={loading} className="text-[10px] uppercase tracking-[0.35em] font-semibold transition-opacity hover:opacity-70 disabled:opacity-30" style={{ color: '#c8a96e' }}>
            Resend Code
          </button>
          <div className="w-40 h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 60, ease: 'linear' }}
                        className="h-full" style={{ background: '#c8a96e' }} />
          </div>
        </div>

        <CtaButton onClick={onVerifyOtp} loading={loading} disabled={formData.otp.length < 6}>
          Confirm Identity
        </CtaButton>
      </motion.div>
  );
};

// ─── STEP 5: FINISH ─────────────────────────────────────────────────
const StepFinish = ({onGoMaps, key}: { onGoMaps: () => void, key?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center text-center gap-10 max-w-lg mx-auto px-6 py-12"
    >
      {/* Animated success ring */}
      <div className="relative w-36 h-36">
        {[1, 0.6, 0.3].map((opacity, i) => (
            <motion.div
                key={i}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: `rgba(200,169,110,${opacity * 0.4})` }}
                animate={{ scale: [1, 1.15 + i * 0.1], opacity: [opacity * 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
            />
        ))}
        <div className="absolute inset-0 flex items-center justify-center rounded-full"
             style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)' }}>
          <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16" style={{ color: '#c8a96e' }} />
          </motion.div>
        </div>
      </div>

      <div className="space-y-3">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-black"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#c8a96e' }}
        >
          Registration Complete
        </motion.h2>
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/40 text-sm tracking-wide"
        >
          Your identity has been verified and synchronized with the Telsa central network.
        </motion.p>
      </div>

      {/* Stats row */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-4 w-full"
      >
        {[{ label: 'Status', val: 'Active' }, { label: 'Network', val: 'Tunisia' }, { label: 'Tier', val: 'Premium' }].map(({ label, val }) => (
            <div key={label} className="py-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{label}</p>
              <p className="font-bold text-sm" style={{ color: '#c8a96e' }}>{val}</p>
            </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="w-full">
        <CtaButton onClick={onGoMaps}>Explore Network Map</CtaButton>
      </motion.div>
    </motion.div>
);

// ─── STEP 6: MAPS ───────────────────────────────────────────────────
const Step5Maps = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [locationStats, setLocationStats] = useState<any>({});

  const generateRandomStats = (locationId: string) => {
    if (locationStats[locationId]) return locationStats[locationId];
    const reasons = ['Maintenance', 'Upgrade', 'Construction', 'System Update', 'Software Update'];
    const totalPorts = Math.floor(Math.random() * 12) + 4;
    const available = Math.floor(Math.random() * totalPorts);
    const occupied = totalPorts - available;
    const ports = Array.from({ length: totalPorts }, (_, i) => ({
      id: i + 1, status: i < occupied ? 'occupied' : 'available',
      timeRemaining: i < occupied ? Math.floor(Math.random() * 180) + 15 : null,
      statusReason: i < occupied && Math.random() > 0.6 ? reasons[Math.floor(Math.random() * reasons.length)] : null
    }));
    const stats = { totalPorts, available, occupied, ports, failedReason: Math.random() > 0.7 ? reasons[Math.floor(Math.random() * reasons.length)] : null };
    setLocationStats((prev: any) => ({ ...prev, [locationId]: stats }));
    return stats;
  };

  const teslaLocations = [
    { id: 'loc1',    name: 'Tesla Giga Factory, Tunis',    lat: 36.8065, lng: 10.1961, type: 'Factory' },
    { id: 'loc2',    name: 'Lac 2 Supercharger',           lat: 36.8428, lng: 10.1857, type: 'Supercharger' },
    { id: 'loc3',    name: 'La Marsa Service Center',       lat: 36.8737, lng: 10.3225, type: 'Service' },
    { id: 'loc4',    name: 'Hammamet Supercharger',         lat: 36.3868, lng: 10.6146, type: 'Supercharger' },
    { id: 'loc5',    name: 'Sfax Service Point',            lat: 34.7406, lng: 10.7603, type: 'Service' },
    { id: 'sousse1', name: 'Sousse Downtown Charger',       lat: 35.8256, lng: 10.5850, type: 'Supercharger' },
    { id: 'sousse2', name: 'Msaken North Supercharger',     lat: 35.9050, lng: 10.5500, type: 'Supercharger' },
    { id: 'sousse3', name: 'Sahloul West Service Center',   lat: 35.7850, lng: 10.5950, type: 'Service' },
    { id: 'sousse4', name: 'Hammam Sousse Charger',         lat: 35.7650, lng: 10.6200, type: 'Supercharger' },
    { id: 'sousse5', name: 'Akouda South Service Point',    lat: 35.7400, lng: 10.5700, type: 'Service' },
    { id: 'loc6',    name: 'Nabeul Coastal Charger',        lat: 36.4553, lng: 10.7356, type: 'Supercharger' },
    { id: 'loc7',    name: 'Gabes South Service',           lat: 33.8869, lng: 10.1674, type: 'Service' },
    { id: 'loc8',    name: 'Kairouan Historic Charger',     lat: 35.6781, lng: 9.9197,  type: 'Supercharger' },
    { id: 'loc9',    name: 'Gafsa Mining Region Service',   lat: 34.4269, lng: 8.7848,  type: 'Service' },
    { id: 'loc10',   name: 'Tataouine Desert Charger',      lat: 32.9305, lng: 10.4549, type: 'Supercharger' },
  ];

  useEffect(() => {
    if (!mapboxgl.accessToken) { setError('MapBox token not configured'); setLoading(false); return; }
    if (map.current) return;
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [10.1961, 35.8065],
        zoom: 6.5,
      });

      teslaLocations.forEach((location) => {
        const el = document.createElement('div');
        const isCharger = location.type === 'Supercharger';
        el.style.cssText = `
          width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: ${isCharger ? 'rgba(200,169,110,0.15)' : 'rgba(99,102,241,0.15)'};
          border: 1.5px solid ${isCharger ? 'rgba(200,169,110,0.7)' : 'rgba(99,102,241,0.7)'};
          box-shadow: 0 0 16px ${isCharger ? 'rgba(200,169,110,0.3)' : 'rgba(99,102,241,0.3)'};
          transition: transform 0.2s;
        `;
        el.innerHTML = `<div style="width:7px;height:7px;border-radius:50%;background:${isCharger ? '#c8a96e' : '#818cf8'}"></div>`;
        el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.3)');
        el.addEventListener('mouseleave', () => el.style.transform = 'scale(1)');
        el.addEventListener('click', () => {
          const stats = generateRandomStats(location.id);
          setSelectedLocation({ ...location, stats });
        });

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`
            <div style="padding:12px 16px;background:#0d0d10;color:white;border:1px solid rgba(200,169,110,0.3);border-radius:8px;font-family:system-ui">
              <p style="font-weight:700;font-size:13px;margin:0 0 4px">${location.name}</p>
              <p style="font-size:10px;color:#c8a96e;margin:0;text-transform:uppercase;letter-spacing:0.1em">${location.type}</p>
            </div>
          `);

        new mapboxgl.Marker(el).setLngLat([location.lng, location.lat]).setPopup(popup).addTo(map.current!);
      });

      map.current.on('load', () => setLoading(false));
    } catch (err: any) {
      setError('Failed to load map');
      setLoading(false);
    }
    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[72vh]"
      >
        {/* Side panel */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 rounded-2xl overflow-y-auto p-6 space-y-4"
               style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)' }}>
                <Navigation className="w-4 h-4" style={{ color: '#c8a96e' }} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Tesla Locations</h3>
                <p className="text-[9px] uppercase tracking-widest text-white/30">Tunisia Network</p>
              </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#c8a96e' }} />
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Loading map…</p>
                </div>
            ) : error ? (
                <ErrorBanner msg={error} />
            ) : selectedLocation ? (
                <div className="space-y-4">
                  <button onClick={() => setSelectedLocation(null)}
                          className="text-[10px] uppercase tracking-widest font-semibold transition-colors hover:text-white/70"
                          style={{ color: 'rgba(200,169,110,0.6)' }}>
                    ← Back
                  </button>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{selectedLocation.type}</p>
                    <p className="font-bold text-sm" style={{ color: '#c8a96e' }}>{selectedLocation.name}</p>
                  </div>

                  {selectedLocation.stats && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {[{ n: selectedLocation.stats.totalPorts, l: 'Total', c: '#c8a96e' }, { n: selectedLocation.stats.available, l: 'Free', c: '#34d399' }, { n: selectedLocation.stats.occupied, l: 'Busy', c: '#fb923c' }].map(({ n, l, c }) => (
                              <div key={l} className="py-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <p className="text-lg font-black" style={{ color: c }}>{n}</p>
                                <p className="text-[9px] uppercase tracking-wider text-white/30">{l}</p>
                              </div>
                          ))}
                        </div>
                        {selectedLocation.stats.failedReason && (
                            <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                              ⚠ {selectedLocation.stats.failedReason} in progress
                            </div>
                        )}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedLocation.stats.ports.map((port: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                                   style={{ background: port.status === 'available' ? 'rgba(52,211,153,0.06)' : 'rgba(251,146,60,0.06)', border: `1px solid ${port.status === 'available' ? 'rgba(52,211,153,0.2)' : 'rgba(251,146,60,0.2)'}` }}>
                                <span className="font-bold text-white/70">Port {port.id}</span>
                                <span className="font-semibold" style={{ color: port.status === 'available' ? '#34d399' : '#fb923c' }}>
                          {port.status === 'available' ? 'Free' : `${port.timeRemaining}m`}
                        </span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
            ) : (
                <div className="space-y-2">
                  {teslaLocations.map((loc, i) => (
                      <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => { const stats = generateRandomStats(loc.id); setSelectedLocation({ ...loc, stats }); }}
                          whileHover={{ x: 4 }}
                          className="p-3 rounded-xl cursor-pointer transition-all group"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: loc.type === 'Supercharger' ? 'rgba(200,169,110,0.6)' : 'rgba(129,140,248,0.6)' }}>{loc.type}</p>
                            <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-tight">{loc.name}</p>
                          </div>
                          <Zap className="w-4 h-4 shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: loc.type === 'Supercharger' ? '#c8a96e' : '#818cf8' }} />
                        </div>
                      </motion.div>
                  ))}
                </div>
            )}
          </div>

          {/* Network stats mini */}
          <div className="p-5 rounded-2xl hidden lg:block" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] uppercase tracking-[0.35em] font-semibold mb-4" style={{ color: 'rgba(200,169,110,0.5)' }}>Network Stats</p>
            <div className="space-y-3">
              {[{ l: 'Total Locations', v: teslaLocations.length }, { l: 'Superchargers', v: teslaLocations.filter(l => l.type === 'Supercharger').length }, { l: 'Service Centers', v: teslaLocations.filter(l => l.type === 'Service').length }].map(({ l, v }) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{l}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: '#c8a96e' }}>{v}</span>
                  </div>
              ))}
            </div>
            <div className="mt-4 h-16 flex items-end gap-1">
              {[40, 70, 45, 90, 65, 80, 30, 50, 75, 60].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                              className="flex-1 rounded-sm" style={{ background: `rgba(200,169,110,${0.2 + h / 300})` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden relative"
             style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div ref={mapContainer} className="w-full h-full" />
          <div className="absolute top-5 left-5 px-4 py-2 rounded-full flex items-center gap-2 z-10 pointer-events-none"
               style={{ background: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ background: '#c8a96e' }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">Live Network</span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 px-5 py-4 rounded-xl flex items-center justify-between z-10 pointer-events-none"
               style={{ background: 'rgba(6,6,8,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-6">
              {[{ l: 'Region', v: 'Tunisia' }, { l: 'Coverage', v: '95%' }].map(({ l, v }) => (
                  <div key={l}>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">{l}</p>
                    <p className="font-bold text-white text-sm">{v}</p>
                  </div>
              ))}
            </div>
            <div className="flex items-center gap-2" style={{ color: '#c8a96e' }}>
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold">Get Directions</span>
            </div>
          </div>
        </div>
      </motion.div>
  );
};

// ─── ROOT APP ────────────────────────────────────────────────────────
export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('origin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    origin: 'local', localPlateType: 'RS', vin: '', plateNumber: '',
    verificationId: '', userId: '', firstName: '', lastName: '',
    email: '', countryCode: '+216', phoneNumber: '', otp: ''
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setError(null);
  };

  const nextStep = () => {
    const idx = STEPS.findIndex(s => s.id === currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1].id);
  };

  const handleVehicleVerify = async () => {
    try {
      setLoading(true); setError(null);
      const init = await apiService.initializePlateType(formData.origin === 'local' ? formData.localPlateType : 'FOREIGN');
      const verify = await apiService.verifyVehicleDetails(init.verificationId, formData.vin, formData.plateNumber);
      if (verify.success) { updateFormData({ verificationId: init.verificationId }); setSuccess('Véhicule Telsa reconnu !'); nextStep(); }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleUserRegister = async () => {
    try {
      setLoading(true); setError(null);
      const reg = await apiService.registerUser({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, countryCode: formData.countryCode, phoneNumber: formData.phoneNumber });
      if (reg.success) { updateFormData({ userId: reg.id }); await apiService.sendOtp(reg.id, formData.countryCode, formData.phoneNumber); nextStep(); }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleOtpVerification = async () => {
    try {
      setLoading(true); setError(null);
      const result = await apiService.verifyOtp(formData.userId!, formData.otp);
      if (result.success) setCurrentStep('finish');
    } catch (err: any) { setError(err.message || 'Code invalide. Tentatives restantes.'); } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true); setError(null);
      await apiService.resendOtp(formData.userId!, formData.countryCode, formData.phoneNumber);
      setSuccess('Code renvoyé !');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
      <div className="min-h-screen relative" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
        {/* Cormorant Garamond font */}
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');`}</style>

        <Background />
        <NavRail currentStep={currentStep} onStepClick={setCurrentStep} />
        <TopBar currentStep={currentStep} onStepClick={setCurrentStep} />
        <BottomNav currentStep={currentStep} onStepClick={setCurrentStep} />

        {/* Region badge */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="fixed top-24 right-8 z-30 hidden lg:block text-right pointer-events-none"
        >
          <p className="text-3xl font-black tracking-[0.35em] text-white/10" style={{ fontFamily: '"Cormorant Garamond", serif' }}>TUNISIA</p>
          <div className="w-16 h-px ml-auto mt-1" style={{ background: 'linear-gradient(to left, #c8a96e, transparent)' }} />
        </motion.div>

        <main className="lg:ml-20 pt-24 pb-32 min-h-screen flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 'origin'   && <Step1Welcome key="welcome" onNext={nextStep} />}
            {currentStep === 'vehicle'  && <Step2Vehicle key="vehicle" formData={formData} updateFormData={updateFormData} onVerify={handleVehicleVerify} loading={loading} error={error} />}
            {currentStep === 'identity' && <Step3UserIdentity key="identity" formData={formData} updateFormData={updateFormData} onRegister={handleUserRegister} loading={loading} error={error} />}
            {currentStep === 'verify'   && <Step4OtpVerify key="verify" formData={formData} updateFormData={updateFormData} onVerifyOtp={handleOtpVerification} onResendOtp={handleResendOtp} loading={loading} error={error} />}
            {currentStep === 'finish'   && <StepFinish key="finish" onGoMaps={() => setCurrentStep('maps')} />}
            {currentStep === 'maps'     && <Step5Maps key="maps" />}
          </AnimatePresence>
        </main>

        {/* Status bar */}
        <div className="fixed bottom-6 lg:left-28 left-6 right-6 lg:right-auto flex items-center gap-4 pointer-events-none hidden lg:flex">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full"
               style={{ background: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/30">System Nominal</span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/15">© 2026 Telsa Energy Operations, TN</span>
        </div>
      </div>
  );
}
