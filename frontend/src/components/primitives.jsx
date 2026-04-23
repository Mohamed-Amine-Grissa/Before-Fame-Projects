/* ——— Primitives ——— */
/* Button, Input, Select, Cursor, PageWipe, SplitText, MarqueeBoard, CountUp, ScrollReveal */

import { useState, useEffect, useRef } from "react";

// ———————————————————————————————————————————————
// Bespoke cursor: 14px dot + 32px ring that lags
// ———————————————————————————————————————————————
export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const captionRef = useRef(null);
  const stateRef = useRef({ x: 0, y: 0, rx: 0, ry: 0, size: 32, caption: "" });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-cursor");

    let raf;
    const onMove = (e) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      const t = e.target.closest?.("[data-cursor]");
      stateRef.current.size = t ? 52 : 32;
      stateRef.current.caption = t ? t.getAttribute("data-cursor") || "" : "";
    };
    const tick = () => {
      const s = stateRef.current;
      s.rx += (s.x - s.rx) * 0.18;
      s.ry += (s.y - s.ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x - 7}px, ${s.y - 7}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.rx - s.size / 2}px, ${s.ry - s.size / 2}px, 0)`;
        ringRef.current.style.width = s.size + "px";
        ringRef.current.style.height = s.size + "px";
      }
      if (captionRef.current) {
        captionRef.current.style.transform = `translate3d(${s.rx + 24}px, ${s.ry + 12}px, 0)`;
        captionRef.current.textContent = s.caption;
        captionRef.current.style.opacity = s.caption ? 1 : 0;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: 14, height: 14,
        background: "var(--bone)", borderRadius: 999,
        pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, width: 32, height: 32,
        border: "1px solid var(--bone)", borderRadius: 999,
        pointerEvents: "none", zIndex: 9999,
        transition: "width 400ms var(--e-editorial), height 400ms var(--e-editorial)",
        mixBlendMode: "difference",
      }} />
      <div ref={captionRef} style={{
        position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999,
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "var(--bone)",
        opacity: 0, transition: "opacity 200ms linear", mixBlendMode: "difference",
      }} />
    </>
  );
}

// ———————————————————————————————————————————————
// PageWipe — Ember bar wipes across on route change
// ———————————————————————————————————————————————
export function PageWipe({ trigger }) {
  const [state, setState] = useState("idle"); // idle | in | out
  useEffect(() => {
    if (trigger === 0) return;
    setState("in");
    const t1 = setTimeout(() => setState("out"), 325);
    const t2 = setTimeout(() => setState("idle"), 650);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [trigger]);

  const transform =
    state === "idle" ? "translateX(-101%)" :
    state === "in"   ? "translateX(0%)" :
                       "translateX(101%)";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 8000, pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "var(--ember)",
        transform,
        transition: state === "in"
          ? "transform 325ms cubic-bezier(0.72,0,0.2,1)"
          : state === "out"
          ? "transform 325ms cubic-bezier(0.72,0,0.2,1)"
          : "none",
      }} />
    </div>
  );
}

// ———————————————————————————————————————————————
// SplitText — mask-reveal upward, per-char stagger
// ———————————————————————————————————————————————
export function SplitText({ children, as = "span", delay = 0, stagger = 18, className, style, keyRefresh }) {
  const Tag = as;
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");
  return (
    <Tag className={className} style={style} key={keyRefresh}>
      {words.map((w, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {Array.from(w).map((ch, ci) => {
            const idx = words.slice(0, wi).reduce((a, x) => a + x.length, 0) + ci;
            return (
              <span key={ci} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                <span
                  style={{
                    display: "inline-block",
                    transform: "translateY(110%)",
                    animation: `splitUp 700ms cubic-bezier(0.2,0.9,0.2,1) forwards`,
                    animationDelay: `${delay + idx * stagger}ms`,
                  }}
                >{ch}</span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

// ———————————————————————————————————————————————
// Button — sharp, Bone on Ink; hover fills from left with Ember
// ———————————————————————————————————————————————
export function Button({ children, onClick, kind = "primary", full, type = "button", disabled, loading, cursor = "act" }) {
  const isPrimary = kind === "primary";
  const isGhost = kind === "ghost";
  const isEmber = kind === "ember";

  const base = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center", justifyContent: "center",
    gap: 12,
    padding: "18px 28px",
    border: isGhost ? "1px solid var(--rule)" : "1px solid transparent",
    background: isPrimary ? "var(--bone)" : isEmber ? "var(--ember)" : "transparent",
    color: isPrimary ? "var(--ink)" : isEmber ? "var(--bone)" : "var(--bone)",
    fontFamily: "var(--f-mono)",
    fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
    borderRadius: "var(--r-btn)",
    cursor: disabled ? "not-allowed" : "pointer",
    overflow: "hidden",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.45 : 1,
    transition: "color 260ms var(--e-editorial), border-color 260ms var(--e-editorial)",
  };

  const [hover, setHover] = useState(false);

  return (
    <button
      type={type} onClick={onClick} disabled={disabled || loading}
      data-cursor={cursor}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...base,
        color: hover && isPrimary ? "var(--bone)" : base.color,
        borderColor: hover && isGhost ? "var(--ember)" : base.borderColor,
      }}
    >
      {/* fill */}
      {isPrimary && (
        <span style={{
          position: "absolute", inset: 0, background: "var(--ember)",
          transform: hover ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: hover ? "left center" : "right center",
          transition: "transform 500ms var(--e-editorial)",
        }} />
      )}
      {isGhost && (
        <span style={{
          position: "absolute", inset: 0, background: "var(--ember)",
          transform: hover ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: hover ? "left center" : "right center",
          transition: "transform 500ms var(--e-editorial)",
        }} />
      )}
      {/* loading rail */}
      {loading && (
        <span style={{
          position: "absolute", left: 0, bottom: 0, height: 2, width: "100%",
          background: "var(--ember)",
          animation: "loaderRail 1.4s linear infinite",
        }} />
      )}

      {/* label stack */}
      <span style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 10,
        height: 20, overflow: "hidden", lineHeight: "20px",
      }}>
        <span style={{
          display: "inline-flex", flexDirection: "column",
          transform: hover ? "translateY(-20px)" : "translateY(0)",
          transition: "transform 420ms var(--e-editorial)",
        }}>
          <span style={{ height: 20, display: "inline-flex", alignItems: "center", lineHeight: "20px" }}>{children}</span>
          <span style={{ height: 20, display: "inline-flex", alignItems: "center", gap: 8, lineHeight: "20px" }}>
            <span style={{ display: "inline-block", transform: hover ? "translateX(0)" : "translateX(-12px)", transition: "transform 420ms var(--e-editorial) 60ms" }}>→</span>
            {children}
          </span>
        </span>
      </span>
    </button>
  );
}

// ———————————————————————————————————————————————
// Input — labelled, above-left, 1px underline, live counter
// ———————————————————————————————————————————————
export function Input({ label, value, onChange, maxLength, placeholder, mono, type = "text", autoFocus, hint, error }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "block", marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span className="t-caps">{label}</span>
        {maxLength != null && (
          <span className="t-mono" style={{ fontSize: 10, color: value?.length === maxLength ? "var(--signal)" : "var(--chalk)" }}>
            {(value || "").length.toString().padStart(2, "0")} / {maxLength}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        data-cursor="type"
        style={{
          width: "100%",
          background: "transparent",
          border: 0,
          borderBottom: "1px solid var(--rule)",
          padding: "10px 0 12px",
          color: "var(--bone)",
          fontFamily: mono ? "var(--f-mono)" : "var(--f-ui)",
          fontSize: 20, letterSpacing: mono ? "0.05em" : "-0.01em",
          outline: "none",
        }}
      />
      {/* underline */}
      <div style={{ position: "relative", height: 2, marginTop: -2 }}>
        <div style={{
          position: "absolute", left: 0, bottom: 0, height: 2,
          width: focus ? "100%" : "0%",
          background: error ? "var(--ember)" : "var(--ember)",
          transformOrigin: "left center",
          transition: "width 380ms var(--e-editorial)",
        }} />
      </div>
      {(hint || error) && (
        <div className="t-mono" style={{ fontSize: 10, marginTop: 8, color: error ? "var(--ember)" : "var(--chalk)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {error || hint}
        </div>
      )}
    </label>
  );
}

// ———————————————————————————————————————————————
// Select — full-row overlay with enum value + pretty label
// ———————————————————————————————————————————————
export function Select({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  return (
    <>
      <label style={{ display: "block", marginBottom: 28 }}>
        <span className="t-caps" style={{ marginBottom: 8, display: "block" }}>{label}</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="choose"
          style={{
            width: "100%", textAlign: "left",
            background: "transparent", border: 0,
            borderBottom: "1px solid var(--rule)",
            padding: "10px 0 12px",
            color: current ? "var(--bone)" : "var(--chalk)",
            fontFamily: "var(--f-ui)", fontSize: 20, letterSpacing: "-0.01em",
            cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span>{current?.label || "— select —"}</span>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>
            {current?.value || "↓"}
          </span>
        </button>
      </label>
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 7000, background: "rgba(10,10,11,0.82)",
          backdropFilter: "blur(12px)",
          display: "flex", flexDirection: "column",
          animation: "fadeIn 240ms var(--e-editorial)",
        }} onClick={() => setOpen(false)}>
          <div style={{ padding: "32px 48px", display: "flex", justifyContent: "space-between" }}>
            <span className="t-caps">{label} · select</span>
            <button onClick={() => setOpen(false)} data-cursor="close" style={{ background: "none", border: 0, color: "var(--bone)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>Close ×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 0" }} onClick={e => e.stopPropagation()}>
            {options.map((o, i) => (
              <button
                key={o.value}
                onClick={() => { onChange?.(o.value); setOpen(false); }}
                data-cursor="pick"
                style={{
                  width: "100%", textAlign: "left",
                  background: "transparent", border: 0, borderTop: "1px solid var(--rule)",
                  padding: "28px 48px",
                  display: "grid", gridTemplateColumns: "220px 1fr auto",
                  gap: 24, alignItems: "baseline", color: "var(--bone)",
                  cursor: "pointer",
                  animation: `slideIn 520ms var(--e-editorial) both`,
                  animationDelay: `${40 * i}ms`,
                }}
                className="sel-row"
              >
                <span className="t-mono" style={{ fontSize: 13, color: "var(--chalk)" }}>{o.value}</span>
                <span className="t-display" style={{ fontSize: 36 }}>{o.label}</span>
                <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)" }}>→</span>
              </button>
            ))}
            <div style={{ borderTop: "1px solid var(--rule)" }} />
          </div>
        </div>
      )}
    </>
  );
}

// ———————————————————————————————————————————————
// MarqueeBoard — Solari flip
// ———————————————————————————————————————————————
export function MarqueeBoard({ items, index, size = 48, color = "var(--bone)" }) {
  const [prev, setPrev] = useState(index);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (prev === index) return;
    setFlipping(true);
    const t = setTimeout(() => { setPrev(index); setFlipping(false); }, 420);
    return () => clearTimeout(t);
  }, [index, prev]);

  return (
    <span style={{
      display: "inline-block", perspective: 600, height: size * 1.1, overflow: "hidden",
    }}>
      <span style={{
        display: "inline-block", position: "relative",
        transformStyle: "preserve-3d",
        transformOrigin: "center",
        transform: flipping ? "rotateX(-90deg)" : "rotateX(0deg)",
        transition: "transform 420ms cubic-bezier(0.72,0,0.2,1)",
        color,
        fontFamily: "var(--f-display)",
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
      }}>
        {items[prev]}
      </span>
    </span>
  );
}

// ———————————————————————————————————————————————
// CountUp — spring-like count-up for admin numbers
// ———————————————————————————————————————————————
export function CountUp({ to, duration = 1400, className, style, format = (n) => n.toLocaleString("en-US") }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span className={className} style={style}>{format(n)}</span>;
}

// ———————————————————————————————————————————————
// ScrollReveal — simple IntersectionObserver-driven
// ———————————————————————————————————————————————
export function ScrollReveal({ children, delay = 0, y = 24, once = true, style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) setVisible(false);
      },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [once]);
  return (
    <div ref={ref} style={{
      transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      opacity: visible ? 1 : 0,
      transition: `transform 800ms var(--e-editorial) ${delay}ms, opacity 800ms var(--e-editorial) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}
