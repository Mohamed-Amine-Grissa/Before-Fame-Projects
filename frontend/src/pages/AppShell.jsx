import { useState, useEffect, useMemo } from "react";
import { Button } from "../components/primitives.jsx";

export function AppShell({ navigate, current, children }) {
  const items = [
    { id: "dash", label: "Overview", to: "/app" },
    { id: "map", label: "Stations", to: "/app/stations" },
    { id: "account", label: "Account", to: "/app/account" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "88px 1fr", minHeight: "100vh", background: "var(--ink)" }}>
      <aside style={{ borderRight: "1px solid var(--rule)", position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} data-cursor="home" style={{ color: "var(--bone)" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="0.5" y="0.5" width="21" height="21" stroke="currentColor" />
            <path d="M4 11 L11 4 L18 11 L11 18 Z" stroke="currentColor" fill="none" />
            <circle cx="11" cy="11" r="1.4" fill="var(--ember)" />
          </svg>
        </a>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center", marginTop: 64 }}>
          {items.map((it) => {
            const active = current === it.id;
            return (
              <a
                key={it.id}
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(it.to); }}
                data-cursor={it.label.toLowerCase()}
                style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0", width: 88, textDecoration: "none", color: active ? "var(--bone)" : "var(--chalk)" }}
              >
                {active && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "var(--ember)" }} />}
                <SidebarIcon kind={it.id} />
                <span className="t-mono" style={{ fontSize: 9, marginTop: 8, letterSpacing: "0.2em", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{it.label}</span>
              </a>
            );
          })}
        </div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "var(--chalk)", letterSpacing: "0.22em", textAlign: "center", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          V · 001
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}

function SidebarIcon({ kind }) {
  const props = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.25 };
  if (kind === "dash") return <svg {...props} viewBox="0 0 18 18"><rect x="1" y="1" width="7" height="7" /><rect x="10" y="1" width="7" height="7" /><rect x="1" y="10" width="7" height="7" /><rect x="10" y="10" width="7" height="7" /></svg>;
  if (kind === "map") return <svg {...props} viewBox="0 0 18 18"><path d="M1 4 L6 2 L12 4 L17 2 L17 14 L12 16 L6 14 L1 16 Z" /><line x1="6" y1="2" x2="6" y2="14" /><line x1="12" y1="4" x2="12" y2="16" /></svg>;
  return <svg {...props} viewBox="0 0 18 18"><circle cx="9" cy="6" r="3" /><path d="M2 16 C2 12 5 10 9 10 C13 10 16 12 16 16" /></svg>;
}

export function Dashboard({ navigate, user, verificationToken }) {
  const firstName = user?.firstName || "Ines";
  const model = verificationToken?.model || "MODEL_S";
  const prettyModel = ({ MODEL_3: "Model 3", MODEL_Y: "Model Y", MODEL_S: "Model S", MODEL_X: "Model X", CYBERTRUCK: "Cybertruck" })[model];
  const hours = new Date().getHours();
  const greeting = hours < 5 ? "Good night" : hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const stations = DEMO_STATIONS;

  return (
    <AppShell navigate={navigate} current="dash">
      <div style={{ padding: "32px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--rule)", paddingBottom: 20, marginBottom: 48 }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Overview · Tunis</span>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            ◉ Online · Last sync {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <h1 className="t-display" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", margin: 0, letterSpacing: "-0.03em" }}>
          {greeting}, <span style={{ fontStyle: "italic" }}>{firstName}.</span>
        </h1>
        <div className="t-mono" style={{ fontSize: 12, color: "var(--chalk)", marginTop: 16, letterSpacing: "0.1em" }}>
          VIN ••••••••••• <span style={{ color: "var(--bone)" }}>7KF</span> · {prettyModel} · TN-plated
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 48, marginTop: 64 }}>
          <div style={{ border: "1px solid var(--rule)", background: "var(--graphite)", position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
            <WireframeTesla model={model} />
            <div style={{ position: "absolute", top: 20, left: 20, display: "flex", gap: 20 }}>
              <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>◉ {model}</span>
              <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Wireframe · Low poly</span>
            </div>
            <div style={{ position: "absolute", bottom: 20, left: 20, display: "flex", gap: 40 }}>
              {[
                ["Connector", "NACS / CCS2"],
                ["Range class", "Long"],
                ["Nearest", "2.4 km"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="t-mono" style={{ fontSize: 9, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{k}</div>
                  <div className="t-display" style={{ fontSize: 22, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 0, alignContent: "start" }}>
            <StatRow k="Charge credit" v="∞" s="verified owner" />
            <StatRow k="Sessions this month" v="04" s="3 stations · 41 kWh" />
            <StatRow k="Average arrival" v="3 min" s="off-peak" />
            <StatRow k="Saved stations" v="07" s="across three wilayas" />
            <div style={{ marginTop: 32 }}>
              <Button onClick={() => navigate("/app/stations")}>Open map</Button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 96 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
            <h2 className="t-display" style={{ margin: 0, fontSize: 40 }}>Nearby <span style={{ fontStyle: "italic" }}>stations.</span></h2>
            <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>5 within 25km</span>
          </div>
          <div style={{ borderTop: "1px solid var(--rule)" }}>
            {stations.slice(0, 5).map((s, i) => <StationRow key={s.id} station={s} index={i} navigate={navigate} />)}
          </div>
        </div>

        <div style={{ marginTop: 96, padding: "64px 0", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Activity · Sessions</span>
              <div className="t-display" style={{ fontSize: 48, marginTop: 16, fontStyle: "italic", color: "var(--bone)" }}>No sessions yet.</div>
              <p style={{ color: "var(--chalk)", fontSize: 14, marginTop: 8 }}>The network awaits.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(30, 1fr)", gap: 2, alignItems: "end", height: 60 }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{ width: 6, height: `${8 + (i % 6) * 2}%`, background: "var(--rule)", alignSelf: "end" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatRow({ k, v, s }) {
  return (
    <div style={{ borderTop: "1px solid var(--rule)", padding: "24px 0", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline" }}>
      <div>
        <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{k}</div>
        <div className="t-display" style={{ fontSize: 40, marginTop: 8 }}>{v}</div>
      </div>
      <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>{s}</div>
    </div>
  );
}

function StationRow({ station, index, navigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--rule)", animation: `listShift 680ms var(--e-editorial) ${index * 70}ms both` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="inspect"
        style={{ width: "100%", display: "grid", gridTemplateColumns: "40px 2fr 1fr 1.4fr 1fr 120px", padding: "24px 0", background: "transparent", border: 0, color: "var(--bone)", textAlign: "left", alignItems: "center", cursor: "pointer" }}
      >
        <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em" }}>{String(index + 1).padStart(2, "0")}</span>
        <span className="t-display" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{station.name}</span>
        <span className="t-mono" style={{ fontSize: 12, color: "var(--bone)" }}>{station.distance} km</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: station.open ? "var(--signal)" : "var(--chalk)", boxShadow: station.open ? "0 0 8px var(--signal)" : "none" }} />
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.1em" }}>{station.connectors.join(" · ")}</span>
        </span>
        <span className="t-mono" style={{ fontSize: 10, color: station.open ? "var(--signal)" : "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{station.open ? "OPEN" : "CLOSED"}</span>
        <span className="t-mono" style={{ fontSize: 14, color: "var(--ember)", textAlign: "right" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 0 32px 40px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 32, animation: "fadeInUp 380ms var(--e-editorial)" }}>
          <div>
            <p style={{ color: "var(--chalk)", fontSize: 14, maxWidth: 520, lineHeight: 1.6 }}>{station.description}</p>
            <div style={{ display: "flex", gap: 48, marginTop: 24 }}>
              {station.stalls.map((s) => (
                <div key={s.type}>
                  <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{s.type}</div>
                  <div className="t-display" style={{ fontSize: 28, marginTop: 4 }}>{s.free} <span style={{ color: "var(--chalk)", fontSize: 16 }}>/ {s.total}</span></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Button kind="ghost" onClick={() => navigate(`/app/stations/${station.id}`)}>View station →</Button>
            </div>
          </div>
          <MiniMap station={station} />
        </div>
      )}
    </div>
  );
}

function MiniMap({ station }) {
  return (
    <div style={{ border: "1px solid var(--rule)", aspectRatio: "4/3", background: "var(--graphite)", position: "relative", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 280 210" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke="var(--rule)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="280" height="210" fill="url(#grid)" />
        <path d="M0 100 Q 80 60, 140 105 T 280 90" stroke="var(--rule-strong)" strokeWidth="8" fill="none" />
        <path d="M0 100 Q 80 60, 140 105 T 280 90" stroke="var(--carbon)" strokeWidth="6" fill="none" />
        <path d="M60 0 L 90 220" stroke="var(--rule)" strokeWidth="1" />
        <circle cx="140" cy="105" r="10" fill="none" stroke="var(--ember)" />
        <circle cx="140" cy="105" r="4" fill="var(--ember)">
          <animate attributeName="r" values="4;7;4" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
        <span className="t-mono" style={{ fontSize: 9, color: "var(--chalk)", letterSpacing: "0.22em" }}>N 36°48' / E 10°10'</span>
      </div>
    </div>
  );
}

function WireframeTesla({ model }) {
  const [angle, setAngle] = useState(30);
  useEffect(() => {
    const id = setInterval(() => setAngle((a) => a + 0.4), 40);
    return () => clearInterval(id);
  }, []);

  const shape = useMemo(() => {
    if (model === "CYBERTRUCK") {
      const L = 3.2, W = 1.0, HbedFloor = 0.55, Hhood = 0.7, Hroof = 1.35;
      const frontX = L, rearX = -L;
      const profile = [
        { x: frontX, y: HbedFloor - 0.1 },
        { x: frontX - 0.1, y: Hhood - 0.1 },
        { x: frontX - 0.9, y: Hroof * 0.95 },
        { x: -0.3, y: Hroof },
        { x: -0.9, y: Hroof * 0.9 },
        { x: -0.95, y: HbedFloor + 0.05 },
        { x: rearX + 0.1, y: HbedFloor + 0.05 },
        { x: rearX, y: HbedFloor - 0.15 },
      ];
      return makeExtrusion(profile, W, { wheelPositions: [{ x: L * 0.62, r: 0.48 }, { x: -L * 0.62, r: 0.48 }] });
    }
    const Hroof = model === "MODEL_X" || model === "MODEL_Y" ? 1.38 : 1.20;
    const L = 3.2, W = 0.9;
    const profile = [
      { x: L, y: 0.45 },
      { x: L - 0.05, y: 0.62 },
      { x: L - 0.25, y: 0.70 },
      { x: L - 0.95, y: 0.78 },
      { x: L - 1.45, y: Hroof * 0.93 },
      { x: 0.25, y: Hroof },
      { x: -0.55, y: Hroof * 0.985 },
      { x: -1.55, y: Hroof * 0.78 },
      { x: -L + 0.35, y: 0.80 },
      { x: -L + 0.05, y: 0.70 },
      { x: -L, y: 0.55 },
      { x: -L + 0.05, y: 0.42 },
    ];
    return makeExtrusion(profile, W, { wheelPositions: [{ x: L * 0.63, r: 0.42 }, { x: -L * 0.63, r: 0.42 }] });
  }, [model]);

  const cam = useMemo(() => {
    const yaw = angle * Math.PI / 180;
    const pitch = -0.28;
    const r = 9;
    const cx = Math.sin(yaw) * r * Math.cos(pitch);
    const cz = Math.cos(yaw) * r * Math.cos(pitch);
    const cy = 1.0 + r * Math.sin(-pitch);
    return { cx, cy, cz, yaw, pitch };
  }, [angle]);

  const project = (p) => projectPoint(p, cam);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="88%" height="88%" viewBox="-200 -120 400 240" style={{ color: "var(--bone)" }}>
        <g stroke="var(--rule)" strokeWidth="0.4">
          {Array.from({ length: 11 }).map((_, i) => {
            const t = (i - 5) * 0.8;
            const a = project({ x: -4, y: 0, z: t });
            const b = project({ x: 4, y: 0, z: t });
            if (!a || !b) return null;
            return <line key={`gz${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={0.35} />;
          })}
          {Array.from({ length: 11 }).map((_, i) => {
            const t = (i - 5) * 0.8;
            const a = project({ x: t, y: 0, z: -4 });
            const b = project({ x: t, y: 0, z: 4 });
            if (!a || !b) return null;
            return <line key={`gx${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={0.35} />;
          })}
        </g>

        <g stroke="currentColor" strokeWidth="0.9" fill="none">
          {shape.edges.map((e, i) => {
            const a = project(e.a), b = project(e.b);
            if (!a || !b) return null;
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={e.minor ? 0.4 : 1} />;
          })}
        </g>

        {shape.wheels.map((w, i) => {
          const outerPts = [];
          const N = 24;
          for (let k = 0; k < N; k++) {
            const th = (k / N) * Math.PI * 2;
            outerPts.push(project({ x: w.x + Math.cos(th) * w.r, y: w.r + Math.sin(th) * w.r, z: w.z }));
          }
          const outerD = outerPts.filter(Boolean).map((p, idx) => (idx === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ") + " Z";
          return (
            <g key={i} stroke="currentColor" fill="none">
              <path d={outerD} strokeWidth="1" />
              <path d={outerPts.filter(Boolean).map((p, idx) => {
                const th = (idx / N) * Math.PI * 2;
                const inner = project({ x: w.x + Math.cos(th) * w.r * 0.55, y: w.r + Math.sin(th) * w.r * 0.55, z: w.z });
                return inner ? (idx === 0 ? "M" : "L") + inner.x.toFixed(1) + " " + inner.y.toFixed(1) : "";
              }).join(" ") + " Z"} strokeWidth="0.7" opacity="0.6" />
              {(() => {
                const hub = project({ x: w.x, y: w.r, z: w.z });
                return hub ? <circle cx={hub.x} cy={hub.y} r="1.5" fill="var(--ember)" /> : null;
              })()}
            </g>
          );
        })}

        <g stroke="var(--rule)" strokeWidth="0.5">
          <line x1="-180" y1="0" x2="-170" y2="0" />
          <line x1="170" y1="0" x2="180" y2="0" />
        </g>
        <text x="-180" y="105" fontFamily="var(--f-mono)" fontSize="7" fill="var(--chalk)" letterSpacing="2">YAW {Math.round(angle % 360).toString().padStart(3, "0")}° / PITCH −16°</text>
        <text x="110" y="105" fontFamily="var(--f-mono)" fontSize="7" fill="var(--chalk)" letterSpacing="2">WIREFRAME · {model}</text>
        <g stroke="var(--chalk)" strokeWidth="0.6" fill="none">
          <path d="M -188 -108 L -180 -108 L -180 -100" />
          <path d="M 188 -108 L 180 -108 L 180 -100" />
          <path d="M -188 108 L -180 108 L -180 100" />
          <path d="M 188 108 L 180 108 L 180 100" />
        </g>
      </svg>
    </div>
  );
}

function makeExtrusion(profile, width, opts = {}) {
  const halfW = width / 2;
  const left = profile.map((p) => ({ x: p.x, y: p.y, z: -halfW }));
  const right = profile.map((p) => ({ x: p.x, y: p.y, z: halfW }));
  const edges = [];
  for (let i = 0; i < profile.length; i++) {
    const j = (i + 1) % profile.length;
    edges.push({ a: left[i], b: left[j] });
    edges.push({ a: right[i], b: right[j] });
    edges.push({ a: left[i], b: right[i], minor: i !== 0 && i !== Math.floor(profile.length / 2) });
  }
  const wheels = (opts.wheelPositions || []).flatMap((w) => [
    { x: w.x, r: w.r, z: -halfW - 0.05 },
    { x: w.x, r: w.r, z: halfW + 0.05 },
  ]);
  return { edges, wheels };
}

function projectPoint(p, cam) {
  const sy = Math.sin(-cam.yaw), cy = Math.cos(-cam.yaw);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;
  const y1 = p.y;
  const camR = 9;
  const x2 = x1;
  const y2 = y1 - 1.0;
  const z2 = z1 - camR;
  const sp = Math.sin(cam.pitch), cp = Math.cos(cam.pitch);
  const y3 = y2 * cp - z2 * sp;
  const z3 = y2 * sp + z2 * cp;
  if (z3 >= -0.2) return null;
  const f = 180;
  return { x: (x2 * f) / -z3, y: (-y3 * f) / -z3 };
}

const DEMO_STATIONS = [
  { id: "s1", name: "Kram Marina", distance: "2.4", open: true, connectors: ["NACS", "CCS2"], stalls: [{ type: "NACS", free: 6, total: 8 }, { type: "CCS2", free: 2, total: 4 }], description: "Eight stalls under the marina canopy. Staff kiosk, 24/7.", lng: 10.323, lat: 36.841 },
  { id: "s2", name: "La Marsa · Corniche", distance: "5.8", open: true, connectors: ["NACS", "CCS2"], stalls: [{ type: "NACS", free: 3, total: 6 }], description: "Quiet stretch, sea-facing. Peak wait around sunset.", lng: 10.325, lat: 36.880 },
  { id: "s3", name: "Tunis · République", distance: "8.1", open: false, connectors: ["CCS2"], stalls: [{ type: "CCS2", free: 0, total: 4 }], description: "Closed for scheduled maintenance through 23:00.", lng: 10.18, lat: 36.8 },
  { id: "s4", name: "Hammamet · Yasmine", distance: "68.0", open: true, connectors: ["NACS", "CCS2", "CHADEMO"], stalls: [{ type: "NACS", free: 4, total: 6 }, { type: "CCS2", free: 1, total: 2 }], description: "Primary coastal interchange. Six pull-throughs.", lng: 10.602, lat: 36.384 },
  { id: "s5", name: "Sousse · Medina", distance: "142.0", open: true, connectors: ["NACS", "CCS2"], stalls: [{ type: "NACS", free: 5, total: 8 }], description: "Attached to private parking. Attendant 08:00–22:00.", lng: 10.638, lat: 35.825 },
  { id: "s6", name: "Sfax · Nord", distance: "270.0", open: true, connectors: ["CCS2"], stalls: [{ type: "CCS2", free: 2, total: 4 }], description: "Truck-compatible bays. Long-haul priority.", lng: 10.76, lat: 34.74 },
  { id: "s7", name: "Bizerte · Port", distance: "66.0", open: true, connectors: ["NACS", "CCS2"], stalls: [{ type: "NACS", free: 1, total: 2 }], description: "Limited stalls. Reserve if transiting.", lng: 9.866, lat: 37.274 },
];

export function StationsPage({ navigate }) {
  const [selected, setSelected] = useState(DEMO_STATIONS[0]);
  const [filter, setFilter] = useState(["NACS", "CCS2", "CCS1", "CHADEMO", "J1772"]);
  const toggle = (k) => setFilter((f) => f.includes(k) ? f.filter((x) => x !== k) : [...f, k]);
  const filtered = DEMO_STATIONS.filter((s) => s.connectors.some((c) => filter.includes(c)));

  return (
    <AppShell navigate={navigate} current="map">
      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", height: "100vh" }}>
        <div style={{ borderRight: "1px solid var(--rule)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "28px 32px", borderBottom: "1px solid var(--rule)" }}>
            <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Stations</div>
            <h1 className="t-display" style={{ margin: "8px 0 0", fontSize: 44 }}>The <span style={{ fontStyle: "italic" }}>network.</span></h1>
            <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.14em", marginTop: 12 }}>
              {filtered.length} of {DEMO_STATIONS.length} stations · Tunisia
            </div>
          </div>
          <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--rule)" }}>
            <div className="t-caps" style={{ marginBottom: 12 }}>Filter by connector</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["NACS", "CCS2", "CCS1", "CHADEMO", "J1772"].map((k) => (
                <button
                  key={k}
                  onClick={() => toggle(k)}
                  data-cursor="filter"
                  style={{
                    padding: "8px 14px",
                    fontFamily: "var(--f-mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    background: filter.includes(k) ? "var(--bone)" : "transparent",
                    color: filter.includes(k) ? "var(--ink)" : "var(--chalk)",
                    border: "1px solid " + (filter.includes(k) ? "var(--bone)" : "var(--rule)"),
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                data-cursor="pan"
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: selected?.id === s.id ? "var(--carbon)" : "transparent",
                  borderLeft: selected?.id === s.id ? "2px solid var(--ember)" : "2px solid transparent",
                  borderBottom: "1px solid var(--rule)",
                  padding: "20px 32px",
                  cursor: "pointer",
                  color: "var(--bone)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 8,
                  alignItems: "baseline",
                }}
              >
                <div>
                  <div className="t-display" style={{ fontSize: 22 }}>{s.name}</div>
                  <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 6 }}>
                    {s.connectors.join(" · ")} · {s.distance} km
                  </div>
                </div>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: s.open ? "var(--signal)" : "var(--chalk)", boxShadow: s.open ? "0 0 8px var(--signal)" : "none" }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", overflow: "hidden" }}>
          <TunisiaMap stations={filtered} selected={selected} onSelect={setSelected} />
          {selected && <StationDrawer station={selected} onClose={() => setSelected(null)} navigate={navigate} />}
        </div>
      </div>
    </AppShell>
  );
}

function TunisiaMap({ stations, selected, onSelect }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--ink)", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
        <defs>
          <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 L0 0 0 40" fill="none" stroke="var(--rule)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="1000" height="800" fill="url(#mapgrid)" />
        <path d="M 220 120 C 240 90, 340 85, 430 110 L 520 80 L 610 120 L 640 180 L 610 240 L 580 320 L 610 440 L 580 560 L 560 700 L 540 760 L 500 800"
          fill="rgba(30,30,34,0.6)" stroke="var(--rule-strong)" strokeWidth="1" />
        <path d="M 0 800 L 0 0 L 220 120 L 200 220 L 160 380 L 180 520 L 220 680 L 260 800 Z" fill="rgba(20,20,23,0.7)" stroke="var(--rule)" strokeWidth="0.5" />
        <path d="M 380 140 Q 450 260, 520 440 T 560 760" stroke="var(--rule-strong)" strokeWidth="1.5" fill="none" strokeDasharray="3 6" />
        <path d="M 220 120 L 600 130" stroke="var(--rule-strong)" strokeWidth="1" fill="none" strokeDasharray="2 8" />
        <text x="430" y="140" fontFamily="var(--f-mono)" fontSize="9" letterSpacing="2" fill="var(--chalk)">TUNIS</text>
        <text x="500" y="430" fontFamily="var(--f-mono)" fontSize="9" letterSpacing="2" fill="var(--chalk)">SOUSSE</text>
        <text x="540" y="600" fontFamily="var(--f-mono)" fontSize="9" letterSpacing="2" fill="var(--chalk)">SFAX</text>
        <text x="240" y="115" fontFamily="var(--f-mono)" fontSize="9" letterSpacing="2" fill="var(--chalk)">BIZERTE</text>

        {stations.map((s) => {
          const pos = stationToXY(s);
          const sel = selected?.id === s.id;
          return (
            <g key={s.id} onClick={() => onSelect(s)} style={{ cursor: "pointer" }}>
              <circle cx={pos.x} cy={pos.y} r={sel ? 24 : 12} fill="none" stroke="var(--ember)" strokeWidth="1" opacity={sel ? 1 : 0.6}>
                {s.open && <animate attributeName="r" values={sel ? "24;30;24" : "12;18;12"} dur="2.2s" repeatCount="indefinite" />}
              </circle>
              <circle cx={pos.x} cy={pos.y} r="4" fill="var(--ember)" />
              {sel && (
                <g>
                  <line x1={pos.x + 24} y1={pos.y} x2={pos.x + 60} y2={pos.y} stroke="var(--ember)" />
                  <text x={pos.x + 68} y={pos.y + 4} fontFamily="var(--f-display)" fontSize="20" fill="var(--bone)">{s.name}</text>
                  <text x={pos.x + 68} y={pos.y + 20} fontFamily="var(--f-mono)" fontSize="9" letterSpacing="2" fill="var(--chalk)">{s.connectors.join(" · ")}</text>
                </g>
              )}
            </g>
          );
        })}
        <g stroke="var(--rule)" strokeWidth="0.5">
          <line x1="920" y1="740" x2="960" y2="740" />
          <line x1="940" y1="720" x2="940" y2="760" />
        </g>
        <text x="870" y="780" fontFamily="var(--f-mono)" fontSize="9" letterSpacing="2" fill="var(--chalk)">N · 1:800 000</text>
      </svg>
    </div>
  );
}

function stationToXY(s) {
  const x = 200 + ((s.lng - 8) / 3) * 500;
  const y = 620 - ((s.lat - 34) / 3.5) * 500;
  return { x, y };
}

function StationDrawer({ station, onClose }) {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "40%",
        background: "var(--graphite)",
        borderLeft: "1px solid var(--rule)",
        padding: "32px 40px",
        overflow: "auto",
        animation: "slideFromRight 520ms var(--e-editorial)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span className="t-caps">Station · Detail</span>
        <button onClick={onClose} data-cursor="close" style={{ background: "none", border: 0, color: "var(--bone)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}>Close ×</button>
      </div>
      <h2 className="t-display" style={{ fontSize: 56, margin: "24px 0 8px", letterSpacing: "-0.03em" }}>{station.name}</h2>
      <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.14em" }}>
        N {station.lat.toFixed(4)}° / E {station.lng.toFixed(4)}° · {station.distance} km
      </div>

      <div style={{ marginTop: 32, height: 200, border: "1px solid var(--rule)", background: "repeating-linear-gradient(135deg, var(--carbon) 0 16px, var(--graphite) 16px 32px)", position: "relative" }}>
        <span style={{ position: "absolute", bottom: 12, left: 12 }} className="t-mono caption">
          <span style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Photo · placeholder</span>
        </span>
      </div>

      <div style={{ marginTop: 40, borderTop: "1px solid var(--rule)" }}>
        {[["Hours", "24/7 · Attendant 08:00–22:00"], ["Peak kW", "250 kW"], ["Pricing", "0.42 TND / kWh"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid var(--rule)" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{k}</span>
            <span className="t-mono" style={{ fontSize: 13 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="t-caps" style={{ marginBottom: 16 }}>Connectors</div>
        {station.stalls.map((st) => (
          <div key={st.type} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 16, padding: "12px 0", borderTop: "1px solid var(--rule)", alignItems: "center" }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)" }}>{st.type}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: st.total }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 8, background: i < st.free ? "var(--signal)" : "var(--rule)" }} />
              ))}
            </div>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>{st.free}/{st.total}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
        <Button onClick={() => {}}>Get directions</Button>
        <Button kind="ghost" onClick={() => {}}>Save station</Button>
      </div>
    </div>
  );
}

export function AccountPage({ navigate, user, verificationToken, logout }) {
  return (
    <AppShell navigate={navigate} current="account">
      <div style={{ padding: "32px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--rule)", paddingBottom: 20, marginBottom: 48 }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Account · Profile</span>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Member since 2026 · /ENTRY/001</span>
        </div>
        <h1 className="t-display" style={{ fontSize: "clamp(3rem, 5vw, 5rem)", margin: 0, letterSpacing: "-0.03em" }}>Your <span style={{ fontStyle: "italic" }}>file.</span></h1>

        <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <div>
            <SectionHead idx="01" label="Identity" />
            <FieldRow k="Name" v={(user?.firstName || "Ines") + " Ben Slimane"} />
            <FieldRow k="Email" v={user?.email || "ines@example.tn"} />
            <FieldRow k="Phone" v="+216 24 212 488" />
            <FieldRow k="Country" v="Tunisia · TN" />
          </div>
          <div>
            <SectionHead idx="02" label="Linked vehicle" />
            <FieldRow k="Model" v={({ MODEL_3: "Model 3", MODEL_Y: "Model Y", MODEL_S: "Model S", MODEL_X: "Model X", CYBERTRUCK: "Cybertruck" })[verificationToken?.model || "MODEL_S"]} />
            <FieldRow k="VIN" v="5YJ3E1EA7KF•••••••" />
            <FieldRow k="Plate" v="214 A 88 · TN" />
            <FieldRow k="Origin" v={verificationToken?.origin || "LOCAL"} />
          </div>
        </div>

        <div style={{ marginTop: 96 }}>
          <SectionHead idx="03" label="Active sessions" />
          {[
            { dev: "Safari · macOS", loc: "Tunis, TN", when: "Now", current: true },
            { dev: "iOS · iPhone 16", loc: "La Marsa, TN", when: "2 days ago" },
            { dev: "Chrome · Windows", loc: "Sfax, TN", when: "1 month ago" },
          ].map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr auto", padding: "20px 0", borderBottom: "1px solid var(--rule)", alignItems: "baseline" }}>
              <span style={{ fontSize: 16 }}>{s.dev} {s.current && <span className="t-mono" style={{ fontSize: 10, color: "var(--signal)", letterSpacing: "0.18em", textTransform: "uppercase", marginLeft: 12 }}>◉ Current</span>}</span>
              <span className="t-mono" style={{ fontSize: 12, color: "var(--chalk)" }}>{s.loc}</span>
              <span className="t-mono" style={{ fontSize: 12, color: "var(--chalk)" }}>{s.when}</span>
              {!s.current && <button style={{ background: "none", border: 0, color: "var(--ember)", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>Revoke</button>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>Logging out revokes all refresh tokens.</span>
          <Button kind="ghost" onClick={() => { logout(); navigate("/"); }}>Sign out</Button>
        </div>
      </div>
    </AppShell>
  );
}

function SectionHead({ idx, label }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginBottom: 24 }}>
      <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{idx}</span>
      <h3 className="t-display" style={{ fontSize: 32, margin: 0, letterSpacing: "-0.02em" }}>{label}</h3>
    </div>
  );
}

function FieldRow({ k, v }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "18px 0", borderTop: "1px solid var(--rule)", alignItems: "baseline" }}>
      <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontSize: 16 }}>{v}</span>
    </div>
  );
}

