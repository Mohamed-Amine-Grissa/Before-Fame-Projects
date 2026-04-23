/* ——— Landing Page · Windshield-opening hero ——— */

import { useState, useEffect, useRef } from "react";
import { MarqueeBoard, ScrollReveal } from "../components/primitives.jsx";

// Realistic-looking silhouettes (profile view, original vector drawings)
export function CarSilhouette({ model, color = "currentColor", stroke = 1.1, width = "100%", height = "100%" }) {
  const strokeProps = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinejoin: "round", strokeLinecap: "round" };
  let body, wheels, details;
  switch (model) {
    case "MODEL_3": {
      body = (
        <>
          <path d="M 18 108 L 26 96 Q 34 78, 70 70 L 108 54 Q 150 36, 210 36 Q 262 36, 298 54 L 340 80 Q 368 90, 376 104 L 380 112 L 380 118 L 20 118 Z" {...strokeProps} />
          <path d="M 108 54 Q 200 34, 298 54" {...strokeProps} />
          <path d="M 136 40 L 148 60" {...strokeProps} />
          <path d="M 266 40 L 260 60" {...strokeProps} />
        </>
      );
      wheels = <>
        <g transform="translate(82,112)"><circle r="22" {...strokeProps} /><circle r="12" {...strokeProps} /><circle r="3" fill={color} /></g>
        <g transform="translate(318,112)"><circle r="22" {...strokeProps} /><circle r="12" {...strokeProps} /><circle r="3" fill={color} /></g>
      </>;
      details = <>
        <line x1="20" y1="112" x2="60" y2="112" {...strokeProps} />
        <line x1="340" y1="112" x2="380" y2="112" {...strokeProps} />
        <rect x="356" y="92" width="18" height="4" {...strokeProps} />
        <circle cx="26" cy="98" r="3" fill="var(--ember)" />
      </>;
      break;
    }
    case "MODEL_Y": {
      body = (
        <>
          <path d="M 18 108 L 26 94 Q 32 74, 72 66 L 112 46 Q 156 28, 212 28 Q 264 28, 298 46 L 340 74 Q 370 86, 378 102 L 382 112 L 382 118 L 20 118 Z" {...strokeProps} />
          <path d="M 112 46 Q 206 22, 298 46" {...strokeProps} />
          <path d="M 140 34 L 152 54" {...strokeProps} />
          <path d="M 266 34 L 258 54" {...strokeProps} />
        </>
      );
      wheels = <>
        <g transform="translate(86,112)"><circle r="24" {...strokeProps} /><circle r="13" {...strokeProps} /><circle r="3" fill={color} /></g>
        <g transform="translate(318,112)"><circle r="24" {...strokeProps} /><circle r="13" {...strokeProps} /><circle r="3" fill={color} /></g>
      </>;
      details = <>
        <line x1="20" y1="112" x2="58" y2="112" {...strokeProps} />
        <line x1="344" y1="112" x2="382" y2="112" {...strokeProps} />
        <rect x="358" y="88" width="18" height="4" {...strokeProps} />
        <circle cx="26" cy="96" r="3" fill="var(--ember)" />
      </>;
      break;
    }
    case "MODEL_S": {
      body = (
        <>
          <path d="M 16 110 L 22 96 Q 28 78, 60 70 L 98 50 Q 138 30, 204 30 Q 270 30, 312 50 L 352 78 Q 378 88, 384 102 L 386 114 L 386 118 L 18 118 Z" {...strokeProps} />
          <path d="M 98 50 Q 200 26, 312 50" {...strokeProps} />
          <path d="M 128 36 L 140 58" {...strokeProps} />
          <path d="M 280 36 L 272 58" {...strokeProps} />
        </>
      );
      wheels = <>
        <g transform="translate(76,114)"><circle r="20" {...strokeProps} /><circle r="11" {...strokeProps} /><circle r="3" fill={color} /></g>
        <g transform="translate(326,114)"><circle r="20" {...strokeProps} /><circle r="11" {...strokeProps} /><circle r="3" fill={color} /></g>
      </>;
      details = <>
        <line x1="18" y1="114" x2="56" y2="114" {...strokeProps} />
        <line x1="346" y1="114" x2="386" y2="114" {...strokeProps} />
        <rect x="360" y="94" width="18" height="4" {...strokeProps} />
        <circle cx="24" cy="100" r="3" fill="var(--ember)" />
      </>;
      break;
    }
    case "MODEL_X": {
      body = (
        <>
          <path d="M 18 108 L 24 92 Q 30 70, 64 64 L 104 44 Q 150 22, 210 22 Q 266 22, 302 44 L 346 72 Q 374 84, 380 100 L 384 112 L 384 118 L 20 118 Z" {...strokeProps} />
          <path d="M 104 44 Q 204 16, 302 44" {...strokeProps} />
          <path d="M 132 32 L 144 54" {...strokeProps} />
          <path d="M 270 32 L 262 54" {...strokeProps} />
          <path d="M 200 22 L 200 54" {...strokeProps} />
        </>
      );
      wheels = <>
        <g transform="translate(86,112)"><circle r="26" {...strokeProps} /><circle r="14" {...strokeProps} /><circle r="3" fill={color} /></g>
        <g transform="translate(322,112)"><circle r="26" {...strokeProps} /><circle r="14" {...strokeProps} /><circle r="3" fill={color} /></g>
      </>;
      details = <>
        <line x1="20" y1="112" x2="56" y2="112" {...strokeProps} />
        <line x1="350" y1="112" x2="384" y2="112" {...strokeProps} />
        <rect x="358" y="88" width="18" height="4" {...strokeProps} />
        <circle cx="26" cy="94" r="3" fill="var(--ember)" />
      </>;
      break;
    }
    case "CYBERTRUCK": {
      body = (
        <>
          <path d="M 18 110 L 34 62 L 172 36 L 300 52 L 370 96 L 384 110 L 384 118 L 20 118 Z" {...strokeProps} />
          <path d="M 34 62 L 300 52" {...strokeProps} />
          <path d="M 172 36 L 172 52" {...strokeProps} />
          <line x1="300" y1="52" x2="300" y2="110" {...strokeProps} />
          <rect x="172" y="56" width="128" height="54" {...strokeProps} />
        </>
      );
      wheels = <>
        <g transform="translate(82,114)"><circle r="26" {...strokeProps} /><circle r="14" {...strokeProps} /><circle r="3" fill={color} /></g>
        <g transform="translate(320,114)"><circle r="26" {...strokeProps} /><circle r="14" {...strokeProps} /><circle r="3" fill={color} /></g>
      </>;
      details = <>
        <line x1="20" y1="114" x2="56" y2="114" {...strokeProps} />
        <line x1="346" y1="114" x2="384" y2="114" {...strokeProps} />
        <rect x="360" y="86" width="14" height="4" {...strokeProps} />
        <circle cx="26" cy="92" r="3" fill="var(--ember)" />
      </>;
      break;
    }
    default: body = null; wheels = null; details = null;
  }
  return (
    <svg viewBox="0 0 400 140" width={width} height={height} style={{ color, overflow: "visible" }}>
      {details}
      {body}
      {wheels}
    </svg>
  );
}

// Windshield-opening hero
function WindshieldHero({ navigate }) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const progress = Math.max(0, Math.min(1, scrollY / (vh * 1.4)));

  const pillarX = progress * 60;
  const topBar = progress * 100;
  const dashY = progress * 100;
  const contentOpacity = Math.max(0, (progress - 0.35) / 0.5);
  const interiorFog = 1 - progress;

  return (
    <section ref={heroRef} style={{ position: "relative", height: "220vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "var(--ink)" }}>

        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          transform: `scale(${1 + progress * 0.15})`,
          transition: "none",
        }}>
          <OutsideWorld progress={progress} />
        </div>

        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          padding: "0 var(--gutter)",
          display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24,
          alignContent: "center", alignItems: "center",
          opacity: contentOpacity,
          transform: `translateY(${(1 - contentOpacity) * 40}px)`,
          pointerEvents: contentOpacity > 0.5 ? "auto" : "none",
        }}>
          <div style={{ gridColumn: "1 / span 9" }}>
            <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 24 }}>◉ 00 / Outside</div>
            <h1 style={{ margin: 0, fontFamily: "var(--f-display)", fontSize: "clamp(3.5rem, 10vw, 11rem)", lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 400 }}>
              A quiet network,<br />
              <span style={{ fontStyle: "italic" }}>for the cars</span><br />
              that deserve it.
            </h1>
          </div>
          <div style={{ gridColumn: "11 / span 2", alignSelf: "end" }}>
            <p style={{ color: "var(--chalk)", fontSize: 14, lineHeight: 1.55, margin: "0 0 20px" }}>
              Curated charging for verified Tesla owners across Tunisia.
            </p>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/verify/local"); }} data-cursor="begin"
              className="link-offset t-mono" style={{ fontSize: 12, color: "var(--bone)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              → Begin verification
            </a>
          </div>
        </div>

        {/* A-pillar LEFT */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: "22%", zIndex: 5,
          background: "linear-gradient(90deg, #060607 0%, #0a0a0b 60%, rgba(10,10,11,0) 100%)",
          transform: `translateX(-${pillarX}%)`,
          transition: "transform 120ms linear",
          pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 1, background: "var(--rule-strong)" }} />
          {progress < 0.6 && (
            <div style={{ position: "absolute", top: "18%", right: -40, width: 80, height: 24, background: "#050505", border: "1px solid var(--rule)", opacity: 1 - progress * 1.4 }} />
          )}
        </div>
        {/* A-pillar RIGHT */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, right: 0, width: "22%", zIndex: 5,
          background: "linear-gradient(-90deg, #060607 0%, #0a0a0b 60%, rgba(10,10,11,0) 100%)",
          transform: `translateX(${pillarX}%)`,
          transition: "transform 120ms linear",
          pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "var(--rule-strong)" }} />
        </div>

        {/* ROOF */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "24%", zIndex: 5,
          background: "linear-gradient(180deg, #050506 0%, #0a0a0b 85%, rgba(10,10,11,0) 100%)",
          transform: `translateY(-${topBar}%)`,
          transition: "transform 120ms linear",
          pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", bottom: 20, left: "22%", right: "22%", height: 1, background: "var(--rule)" }} />
          <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", width: 60, height: 8, border: "1px solid var(--rule)", borderBottom: 0 }} />
        </div>

        {/* DASHBOARD */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "34%", zIndex: 6,
          background: "linear-gradient(0deg, #030304 0%, #0a0a0b 70%, rgba(10,10,11,0) 100%)",
          transform: `translateY(${dashY}%)`,
          transition: "transform 120ms linear",
          pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", bottom: "12%", left: "18%", width: 220, height: 100 }}>
            <svg viewBox="0 0 220 100" width="100%" height="100%" style={{ color: "var(--rule-strong)" }}>
              <path d="M 10 50 Q 10 20, 60 20 L 160 20 Q 210 20, 210 50 L 210 55 Q 210 70, 180 70 L 130 70 L 130 82 L 90 82 L 90 70 L 40 70 Q 10 70, 10 55 Z"
                fill="#0c0c0d" stroke="currentColor" strokeWidth="1" />
              <circle cx="110" cy="46" r="14" fill="none" stroke="currentColor" />
              <path d="M 100 46 L 120 46 M 110 38 L 110 54" stroke="var(--ember)" strokeWidth="1" />
            </svg>
          </div>
          <div style={{ position: "absolute", bottom: "30%", left: "44%", width: 220, height: 64, background: "#060606", border: "1px solid var(--rule)", display: "flex", alignItems: "center", padding: "0 14px", gap: 14 }}>
            <div style={{ width: 8, height: 8, background: "var(--signal)", borderRadius: 999, boxShadow: "0 0 10px var(--signal)" }} />
            <div className="t-mono" style={{ fontSize: 9, color: "var(--chalk)", letterSpacing: "0.22em" }}>NAV · ONLINE</div>
            <div style={{ flex: 1 }} />
            <div className="t-mono" style={{ fontSize: 9, color: "var(--chalk)" }}>21:14</div>
          </div>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "var(--rule-strong)", opacity: 1 - progress }} />
        </div>

        <div style={{
          position: "absolute", inset: "12% 18% 24% 18%", zIndex: 4,
          background: "linear-gradient(180deg, rgba(15,17,22,0.7) 0%, rgba(15,17,22,0.3) 40%, rgba(15,17,22,0) 70%)",
          opacity: interiorFog * 0.9,
          pointerEvents: "none",
        }} />

        <div style={{
          position: "absolute", top: 32, left: 32, zIndex: 7, pointerEvents: "none",
          opacity: 1 - progress * 1.6,
        }}>
          <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            ◉ Inside · Cockpit
          </span>
        </div>
        <div style={{
          position: "absolute", top: 32, right: 32, zIndex: 7, pointerEvents: "none",
          opacity: 1 - progress * 1.6,
        }}>
          <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Scroll to open ↓
          </span>
        </div>

        <div style={{
          position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 8,
          opacity: 1 - progress * 2.2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none",
        }}>
          <div className="t-mono" style={{ fontSize: 9, color: "var(--chalk)", letterSpacing: "0.3em", textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: 1, height: 36, background: "var(--chalk)", animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
          <TopNav navigate={navigate} />
        </div>
      </div>
    </section>
  );
}

function OutsideWorld({ progress }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a0b10 0%, #141620 50%, #0e0f14 100%)" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "60%" }} preserveAspectRatio="none">
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 137) % 100;
          const y = (i * 53) % 100;
          const s = (i % 3) * 0.5 + 0.4;
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={s} fill="var(--bone)" opacity={0.3 + (i % 4) * 0.15} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: "58%", height: 1, background: "var(--rule-strong)" }} />
      <svg style={{ position: "absolute", left: 0, right: 0, top: "50%", width: "100%", height: "12%" }} preserveAspectRatio="none" viewBox="0 0 1000 100">
        <path d="M 0 100 L 0 80 L 120 60 L 240 70 L 360 50 L 480 68 L 600 54 L 720 72 L 840 58 L 1000 66 L 1000 100 Z" fill="#0a0b10" stroke="var(--rule)" strokeWidth="0.5" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: "58%", bottom: 0, overflow: "hidden" }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice">
          <path d="M 360 0 L 640 0 L 1000 420 L 0 420 Z" fill="#060608" />
          <line x1="360" y1="0" x2="0" y2="420" stroke="var(--rule-strong)" strokeWidth="1" />
          <line x1="640" y1="0" x2="1000" y2="420" stroke="var(--rule-strong)" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => {
            const t = (i + ((progress * 6) % 1)) / 8;
            const y = Math.pow(t, 2) * 420;
            const w = 4 + t * 40;
            const h = 6 + t * 36;
            return <rect key={i} x={500 - w / 2} y={y} width={w} height={h} fill="var(--ember)" opacity={0.25 + t * 0.6} />;
          })}
          <g transform="translate(470, 60) scale(0.24)" style={{ color: "var(--bone)", opacity: 0.7 + progress * 0.3 }}>
            <CarSilhouette model="MODEL_S" stroke={2} />
          </g>
          <circle cx="500" cy="70" r={3 + progress * 10} fill="var(--ember)" opacity={0.3 + progress * 0.6}>
            <animate attributeName="r" values="3;8;3" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <line x1="500" y1="70" x2="500" y2="20" stroke="var(--ember)" strokeWidth="0.5" opacity={progress * 0.7} />
        </svg>
      </div>
      <div className="grain" style={{ opacity: 0.04 }} />
    </div>
  );
}

export default function Landing({ navigate }) {
  const models = ["MODEL 3", "MODEL Y", "MODEL S", "MODEL X", "CYBERTRUCK"];
  const [flip, setFlip] = useState(0);
  useEffect(() => {
    let i = 0;
    const target = [0, 1, 2, 3, 4, 0, 2];
    const id = setInterval(() => {
      if (i >= target.length) { clearInterval(id); return; }
      setFlip(target[i]); i++;
    }, 620);
    return () => clearInterval(id);
  }, []);

  const [verifiedCount, setVerifiedCount] = useState(247);
  useEffect(() => {
    const t = setInterval(() => setVerifiedCount(c => c + (Math.random() < 0.35 ? 1 : 0)), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", position: "relative" }}>
      <WindshieldHero navigate={navigate} />

      <section style={{ padding: "120px var(--gutter)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24, marginBottom: 64 }}>
          <div style={{ gridColumn: "1 / span 2" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>02 / Fleet</span>
          </div>
          <div style={{ gridColumn: "3 / span 7" }}>
            <h2 className="t-display" style={{ margin: 0, fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Five models. Three ports. One <span style={{ fontStyle: "italic" }}>obsession.</span>
            </h2>
          </div>
          <div style={{ gridColumn: "11 / span 2", alignSelf: "end" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>Currently featuring</span>
            <div style={{ marginTop: 6 }}>
              <MarqueeBoard items={models} index={flip} size={28} color="var(--ember)" />
            </div>
          </div>
        </div>

        <SolariTable />
      </section>

      <section style={{ padding: "160px var(--gutter) 120px", borderTop: "1px solid var(--rule)", background: "var(--graphite)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24, marginBottom: 80 }}>
          <div style={{ gridColumn: "1 / span 2" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>03 / Ritual</span>
          </div>
          <h2 className="t-display" style={{ gridColumn: "3 / span 7", margin: 0, fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            The verification is <span style={{ fontStyle: "italic" }}>deliberate.</span>
          </h2>
        </div>
        <RitualSteps />
      </section>

      <section style={{ padding: "120px var(--gutter)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24, alignItems: "baseline" }}>
          <div style={{ gridColumn: "1 / span 4" }}>
            <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20 }}>Verified owners · Live</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div className="t-display" style={{ fontSize: "clamp(6rem, 14vw, 14rem)", lineHeight: 0.9 }}>
                {String(Math.floor(verifiedCount / 1000)).padStart(1, "0")},{String(verifiedCount % 1000).padStart(3, "0")}
              </div>
            </div>
          </div>
          <div style={{ gridColumn: "7 / span 4" }}>
            <p style={{ color: "var(--chalk)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>
              Each owner confirms through chassis and plate, or carte grise if abroad. The counter updates in quiet moments. We do not celebrate growth.
            </p>
          </div>
          <div style={{ gridColumn: "11 / span 2", textAlign: "right" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--signal)" }}>◉ LIVE</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 96, border: "1px solid var(--rule)" }}>
          {[
            { k: "Stations mapped", v: "68", s: "across 14 wilayas" },
            { k: "Rapid-charge kW", v: "250", s: "NACS / CCS2 peak" },
            { k: "Average wait", v: "04'", s: "minutes · off-peak" },
            { k: "Members by invite", v: "91%", s: "confirmed ownership" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "36px 32px", borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}>
              <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }}>{m.k}</div>
              <div className="t-display" style={{ fontSize: 64, color: "var(--bone)" }}>{m.v}</div>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", marginTop: 8 }}>{m.s}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "120px var(--gutter)", borderTop: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24, marginBottom: 64 }}>
          <span className="t-mono" style={{ gridColumn: "1 / span 2", fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>04 / Questions</span>
          <h2 className="t-display" style={{ gridColumn: "3 / span 7", margin: 0, fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            A few things owners ask.
          </h2>
        </div>
        <HorizontalFAQ />
      </section>

      <footer style={{ borderTop: "1px solid var(--rule)", padding: "24px var(--gutter)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Tunis, TN · 2026</span>
        <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Build 001 · Private Access</span>
      </footer>
      <div style={{ height: "40vh", padding: "0 var(--gutter)", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--rule)" }}>
        <div className="t-display" style={{ fontSize: "clamp(10rem, 28vw, 34rem)", letterSpacing: "-0.055em", lineHeight: 0.85, whiteSpace: "nowrap", color: "var(--bone)" }}>
          Telsa<span style={{ color: "var(--ember)" }}>.</span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--rule)", padding: "20px var(--gutter)", display: "flex", justifyContent: "space-between" }}>
        <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Network · Verification · Stations · Account</span>
        <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Private concierge · By ownership</span>
      </div>
    </div>
  );
}

export function TopNav({ navigate }) {
  return (
    <nav style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "24px var(--gutter)",
      borderBottom: "1px solid var(--rule)",
      background: "rgba(10,10,11,0.55)",
      backdropFilter: "blur(14px)",
    }}>
      <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} data-cursor="home" style={{ textDecoration: "none", color: "var(--bone)" }}>
        <Wordmark />
      </a>
      <div style={{ display: "flex", gap: 40 }}>
        {[{ label: "Network", to: "/" }, { label: "Verify", to: "/verify/local" }, { label: "Stations", to: "/app/stations" }].map(l => (
          <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.to); }} data-cursor="view"
            className="link-offset t-mono"
            style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--bone)" }}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", alignItems: "center" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }} data-cursor="sign in"
          className="t-mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--chalk)", textDecoration: "none" }}>
          Sign in
        </a>
        <EmberCTA onClick={() => navigate("/verify/local")}>Verify your Tesla</EmberCTA>
      </div>
    </nav>
  );
}

export function Wordmark() {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 10 }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="0.5" y="0.5" width="21" height="21" stroke="currentColor" />
        <path d="M4 11 L11 4 L18 11 L11 18 Z" stroke="currentColor" fill="none" />
        <circle cx="11" cy="11" r="1.4" fill="var(--ember)" />
      </svg>
      <span className="t-display" style={{ fontSize: 22, letterSpacing: "-0.03em" }}>
        Telsa<span style={{ color: "var(--ember)" }}>.</span>
      </span>
      <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase", marginLeft: 10 }}>
        Charging points
      </span>
    </span>
  );
}

export function EmberCTA({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} data-cursor="verify"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", overflow: "hidden",
        padding: "12px 20px", border: "1px solid var(--ember)",
        background: "transparent", color: "var(--bone)",
        fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
        cursor: "pointer", borderRadius: 2,
      }}>
      <span style={{
        position: "absolute", inset: 0, background: "var(--ember)",
        transform: hover ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: hover ? "left center" : "right center",
        transition: "transform 500ms var(--e-editorial)",
      }} />
      <span style={{ position: "relative", display: "inline-flex", gap: 10, alignItems: "center" }}>
        {children} <span style={{ opacity: 0.6 }}>→</span>
      </span>
    </button>
  );
}

function SolariTable() {
  const rows = [
    { model: "MODEL_3", pretty: "Model 3", port: "NACS / CCS2", range: "513 km", status: "AVAILABLE" },
    { model: "MODEL_Y", pretty: "Model Y", port: "NACS / CCS2", range: "533 km", status: "AVAILABLE" },
    { model: "MODEL_S", pretty: "Model S", port: "NACS / CCS2", range: "652 km", status: "PRIORITY" },
    { model: "MODEL_X", pretty: "Model X", port: "NACS / CCS2", range: "576 km", status: "AVAILABLE" },
    { model: "CYBERTRUCK", pretty: "Cybertruck", port: "NACS", range: "547 km", status: "LIMITED" },
  ];
  return (
    <div style={{ borderTop: "1px solid var(--rule)" }}>
      {rows.map((r) => (
        <SolariRow key={r.model} row={r} />
      ))}
    </div>
  );
}

function SolariRow({ row }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      data-cursor="preview"
      style={{
        display: "grid", gridTemplateColumns: "80px 1fr 180px 200px 160px 120px",
        alignItems: "center", padding: "28px 0",
        borderBottom: "1px solid var(--rule)",
        position: "relative", cursor: "pointer",
        background: hover ? "var(--carbon)" : "transparent",
        transition: "background 360ms var(--e-editorial)",
      }}>
      <div style={{ paddingLeft: 20 }}>
        <span style={{
          display: "inline-block", width: 8, height: 8, borderRadius: 999,
          background: row.status === "PRIORITY" ? "var(--ember)" : row.status === "LIMITED" ? "var(--chalk)" : "var(--signal)",
          boxShadow: row.status === "PRIORITY" ? "0 0 12px var(--ember)" : "none",
        }} />
      </div>
      <div className="t-display" style={{ fontSize: 72, color: hover ? "var(--ember)" : "var(--bone)", transition: "color 360ms", letterSpacing: "-0.03em" }}>
        {row.pretty}
      </div>
      <div style={{ height: 60, opacity: hover ? 1 : 0.5, transition: "opacity 360ms", color: hover ? "var(--ember)" : "var(--bone)" }}>
        <CarSilhouette model={row.model} stroke={1.1} />
      </div>
      <div className="t-mono" style={{ fontSize: 13, color: "var(--chalk)", letterSpacing: "0.1em" }}>
        {row.port}
      </div>
      <div className="t-mono" style={{ fontSize: 13, color: "var(--bone)" }}>
        {row.range}
      </div>
      <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textAlign: "right", paddingRight: 20 }}>
        {row.status}
      </div>
    </div>
  );
}

function RitualSteps() {
  const steps = [
    { n: "01", t: "Chassis", d: "Seventeen characters. Stamped into your car. We confirm, nothing else.", illust: "chassis" },
    { n: "02", t: "Plate", d: "TN, RS, or CD. The registry responds, or it does not.", illust: "plate" },
    { n: "03", t: "Entry", d: "Your account opens. The network becomes visible.", illust: "key" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
      {steps.map(s => (
        <ScrollReveal key={s.n} delay={100}>
          <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 32 }}>
            <div className="t-display" style={{ fontSize: 220, lineHeight: 0.8, color: "var(--bone)", letterSpacing: "-0.05em" }}>
              {s.n}
            </div>
            <div style={{ margin: "48px 0", height: 120, display: "flex", alignItems: "center" }}>
              <RitualIllustration kind={s.illust} />
            </div>
            <div className="t-display" style={{ fontSize: 32, marginBottom: 12, fontStyle: "italic" }}>{s.t}.</div>
            <p style={{ color: "var(--chalk)", fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 320 }}>{s.d}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

function RitualIllustration({ kind }) {
  if (kind === "chassis") {
    return (
      <svg width="260" height="80" viewBox="0 0 260 80" style={{ color: "var(--bone)" }}>
        <rect x="0.5" y="30" width="259" height="30" fill="none" stroke="currentColor" />
        {Array.from({ length: 17 }).map((_, i) => (
          <line key={i} x1={15 + i * 14} y1={30} x2={15 + i * 14} y2={60} stroke="var(--rule)" />
        ))}
        <text x="8" y="20" fontSize="9" fontFamily="var(--f-mono)" fill="var(--chalk)" letterSpacing="3">CHASSIS · 17</text>
        <text x="130" y="50" fontSize="14" fontFamily="var(--f-mono)" fill="var(--ember)" textAnchor="middle">5YJ3E1EA7KF</text>
      </svg>
    );
  }
  if (kind === "plate") {
    return (
      <svg width="260" height="90" viewBox="0 0 260 90" style={{ color: "var(--bone)" }}>
        <rect x="0.5" y="0.5" width="259" height="89" fill="none" stroke="currentColor" />
        <rect x="0" y="0" width="40" height="90" fill="var(--ember)" />
        <text x="20" y="52" fontSize="18" fontFamily="var(--f-display)" fill="var(--bone)" textAnchor="middle">TN</text>
        <text x="150" y="58" fontSize="36" fontFamily="var(--f-mono)" fill="var(--bone)" textAnchor="middle" letterSpacing="4">214 A 88</text>
      </svg>
    );
  }
  return (
    <svg width="260" height="90" viewBox="0 0 260 90" style={{ color: "var(--bone)" }}>
      <circle cx="50" cy="45" r="20" fill="none" stroke="currentColor" />
      <circle cx="50" cy="45" r="4" fill="var(--ember)" />
      <line x1="70" y1="45" x2="240" y2="45" stroke="currentColor" />
      <line x1="220" y1="35" x2="240" y2="35" stroke="currentColor" />
      <line x1="220" y1="55" x2="240" y2="55" stroke="currentColor" />
      <line x1="210" y1="45" x2="210" y2="25" stroke="currentColor" />
      <line x1="190" y1="45" x2="190" y2="25" stroke="currentColor" />
    </svg>
  );
}

function HorizontalFAQ() {
  const items = [
    { q: "Why is verification required?", a: "The network is reserved for owners. Verification is the entry-fee, paid once, quietly." },
    { q: "What happens to my chassis number?", a: "It is hashed against the registry, compared, and discarded. We do not store it in plaintext." },
    { q: "Do you support foreign plates?", a: "Yes. Upload a carte grise. A reviewer confirms within a business day." },
    { q: "Which cars are eligible?", a: "All five Tesla models sold or imported into Tunisia. Model 3, Y, S, X, and Cybertruck." },
    { q: "What does it cost?", a: "Access is complimentary for verified owners. Stations bill per kWh, at published rates." },
  ];
  const [open, setOpen] = useState(-1);
  return (
    <div style={{ borderTop: "1px solid var(--rule)" }}>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--rule)" }}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            data-cursor={open === i ? "close" : "open"}
            style={{
              width: "100%", display: "grid", gridTemplateColumns: "80px 1fr 1fr 40px",
              alignItems: "center", padding: "28px 0", background: "transparent", border: 0, cursor: "pointer",
              textAlign: "left", color: "var(--bone)",
            }}
          >
            <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", paddingLeft: 20 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="t-display" style={{ fontSize: 32, letterSpacing: "-0.02em", fontStyle: open === i ? "italic" : "normal" }}>
              {it.q}
            </span>
            <span style={{
              overflow: "hidden",
              maxWidth: open === i ? 600 : 0,
              transition: "max-width 700ms var(--e-editorial)",
            }}>
              <span style={{ display: "block", color: "var(--chalk)", fontSize: 14, lineHeight: 1.6 }}>
                {it.a}
              </span>
            </span>
            <span className="t-mono" style={{ fontSize: 16, color: "var(--ember)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 400ms var(--e-editorial)" }}>+</span>
          </button>
        </div>
      ))}
    </div>
  );
}
