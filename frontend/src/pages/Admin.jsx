import { useState } from "react";
import { Button, Input, Select, CountUp } from "../components/primitives.jsx";
import { Wordmark } from "./Landing.jsx";

export function AdminPage({ navigate }) {
  const [page, setPage] = useState(0);
  const [showDelete, setShowDelete] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const stats = {
    totalUsers: 1247,
    verifiedUsers: 1134,
    localVehicles: 892,
    foreignVehicles: 242,
    usersByModel: [
      { model: "MODEL_3", pretty: "Model 3", count: 412 },
      { model: "MODEL_Y", pretty: "Model Y", count: 328 },
      { model: "MODEL_S", pretty: "Model S", count: 198 },
      { model: "MODEL_X", pretty: "Model X", count: 142 },
      { model: "CYBERTRUCK", pretty: "Cybertruck", count: 54 },
    ],
  };
  const maxCount = Math.max(...stats.usersByModel.map((m) => m.count));

  const USERS = Array.from({ length: 24 }).map((_, i) => ({
    id: "U" + String(i + 1).padStart(4, "0"),
    name: ["Ines Ben Slimane", "Karim Mestiri", "Yassine Trabelsi", "Nour Chahed", "Omar Mansour", "Leila Zouari", "Sami Khemiri", "Anis Dridi", "Racha Ben Amor", "Walid Jaziri", "Mehdi Ayari", "Farah Kallel"][i % 12],
    email: `user${i + 1}@example.tn`,
    model: ["MODEL_3", "MODEL_Y", "MODEL_S", "MODEL_X", "CYBERTRUCK"][i % 5],
    plate: `${100 + i * 7} ${["A", "TU", "RS"][i % 3]} ${14 + i}`,
    origin: i % 4 === 0 ? "FOREIGN" : "LOCAL",
    joined: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i * 3 % 28) + 1).padStart(2, "0")}`,
  }));

  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh" }}>
      <AdminTop navigate={navigate} />

      <section style={{ padding: "40px 48px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>// ADMIN · Terminal 001</span>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Session · {new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--rule)" }}>
          {[
            { k: "Total", v: stats.totalUsers, s: "accounts" },
            { k: "Verified", v: stats.verifiedUsers, s: "email + OTP" },
            { k: "Local", v: stats.localVehicles, s: "TN · RS · CD" },
            { k: "Foreign", v: stats.foreignVehicles, s: "carte grise" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "32px 28px", borderLeft: i === 0 ? "none" : "1px solid var(--rule)" }}>
              <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 12 }}>{m.k}</div>
              <div className="t-display" style={{ fontSize: 96, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
                <CountUp to={m.v} />
              </div>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", marginTop: 12 }}>{m.s}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ padding: "32px 48px", borderRight: "1px solid var(--rule)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <div className="t-caps-bone">Users by model · Live</div>
            <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Bar race · normalized</div>
          </div>
          <div>
            {stats.usersByModel.map((m, i) => (
              <div key={m.model} style={{ padding: "14px 0", borderBottom: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "140px 1fr 70px", gap: 20, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14 }}>{m.pretty}</div>
                  <div className="t-mono" style={{ fontSize: 9, color: "var(--chalk)", letterSpacing: "0.22em" }}>{m.model}</div>
                </div>
                <div style={{ height: 22, background: "var(--carbon)", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "var(--bone)", width: `${(m.count / maxCount) * 100}%`, animation: `barGrow 900ms var(--e-editorial) ${i * 80}ms both`, transformOrigin: "left center" }} />
                  <div className="t-mono" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--ink)", mixBlendMode: "difference" }}>{m.count}</div>
                </div>
                <span className="t-mono" style={{ fontSize: 11, textAlign: "right", color: "var(--chalk)" }}>{((m.count / stats.verifiedUsers) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "32px 48px", background: "var(--graphite)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="t-caps-bone">// Add local vehicle · ERP</div>
            <span className="t-mono" style={{ fontSize: 10, color: "var(--ember)" }}>ENTRY / 042</span>
          </div>
          {!showAdd ? (
            <div style={{ marginTop: 32, padding: 24, border: "1px dashed var(--rule)" }}>
              <div className="t-display" style={{ fontSize: 24, margin: "0 0 12px", fontStyle: "italic" }}>Seed the registry.</div>
              <p style={{ color: "var(--chalk)", fontSize: 13, margin: "0 0 24px" }}>Adds a chassis + plate pair the public verification endpoint will recognize.</p>
              <Button onClick={() => setShowAdd(true)}>Open entry form</Button>
            </div>
          ) : <ErpAddForm onClose={() => setShowAdd(false)} />}
        </div>
      </section>

      <section style={{ padding: "32px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div className="t-caps-bone">// Users · {USERS.length} records</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>Page {page + 1} / {Math.ceil(USERS.length / 10)}</span>
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} className="t-mono" style={{ background: "none", border: 0, color: "var(--bone)", cursor: "pointer", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>← Prev</button>
            <button onClick={() => setPage((p) => Math.min(Math.ceil(USERS.length / 10) - 1, p + 1))} className="t-mono" style={{ background: "none", border: 0, color: "var(--bone)", cursor: "pointer", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>Next →</button>
          </div>
        </div>
        <div style={{ border: "1px solid var(--rule)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1.4fr 100px 120px 100px 120px 80px", padding: "12px 16px", background: "var(--carbon)", position: "sticky", top: 0, borderBottom: "1px solid var(--rule)" }}>
            {"ID,Name,Email,Model,Plate,Origin,Joined,".split(",").map((h) => (
              <span key={h} className="t-mono" style={{ fontSize: 9, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          {USERS.slice(page * 10, page * 10 + 10).map((u) => (
            <AdminRow key={u.id} u={u} onDelete={() => setShowDelete(u)} />
          ))}
        </div>
      </section>

      {showDelete && <DeleteDrawer user={showDelete} onClose={() => setShowDelete(null)} />}
    </div>
  );
}

function AdminTop({ navigate }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", borderBottom: "1px solid var(--rule)", background: "var(--ink)" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} data-cursor="home" style={{ color: "var(--bone)" }}>
          <Wordmark />
        </a>
        <span className="t-mono" style={{ fontSize: 10, color: "var(--ember)", letterSpacing: "0.3em", textTransform: "uppercase", borderLeft: "1px solid var(--rule)", paddingLeft: 24 }}>
          // Admin · ROLE_ADMIN
        </span>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {["Stats", "Users", "ERP", "Audit"].map((t) => (
          <span key={t} className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function AdminRow({ u, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "grid", gridTemplateColumns: "80px 1fr 1.4fr 100px 120px 100px 120px 80px", padding: "12px 16px", borderTop: hover ? "1px solid var(--rule-strong)" : "1px solid transparent", borderBottom: hover ? "1px solid var(--rule-strong)" : "1px solid transparent", alignItems: "center", position: "relative", background: hover ? "var(--carbon)" : "transparent", transition: "background 200ms" }}
    >
      <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)" }}>{u.id}</span>
      <span style={{ fontSize: 13 }}>{u.name}</span>
      <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>{u.email}</span>
      <span className="t-mono" style={{ fontSize: 10, color: "var(--bone)", letterSpacing: "0.1em" }}>{u.model}</span>
      <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>{u.plate}</span>
      <span className="t-mono" style={{ fontSize: 10, color: u.origin === "LOCAL" ? "var(--signal)" : "var(--ember)", letterSpacing: "0.18em" }}>{u.origin}</span>
      <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>{u.joined}</span>
      <button onClick={onDelete} style={{ background: "none", border: 0, color: hover ? "var(--ember)" : "var(--rule)", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", transition: "color 200ms", textAlign: "left" }}>
        Delete →
      </button>
    </div>
  );
}

function DeleteDrawer({ user, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,11,0.72)", zIndex: 100, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 480, background: "var(--graphite)", padding: 48, borderLeft: "1px solid var(--rule)", animation: "slideFromRight 420ms var(--e-editorial)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="t-caps">Confirm · Delete</span>
          <button onClick={onClose} style={{ background: "none", border: 0, color: "var(--bone)", fontFamily: "var(--f-mono)", fontSize: 11, cursor: "pointer", letterSpacing: "0.22em", textTransform: "uppercase" }}>Close ×</button>
        </div>
        <h2 className="t-display" style={{ fontSize: 44, margin: "32px 0 16px", letterSpacing: "-0.03em" }}>
          Remove <span style={{ fontStyle: "italic" }}>{user.name}?</span>
        </h2>
        <p style={{ color: "var(--chalk)", fontSize: 14, lineHeight: 1.55 }}>
          The record at <span className="t-mono" style={{ color: "var(--bone)" }}>{user.id}</span> will be detached from the registry. Vehicle data stays in ERP. This is reversible within 30 days.
        </p>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <Button kind="ember" onClick={onClose}>Delete account</Button>
          <Button kind="ghost" onClick={onClose}>Keep</Button>
        </div>
      </div>
    </div>
  );
}

function ErpAddForm({ onClose }) {
  const [chassis, setChassis] = useState("");
  const [plate, setPlate] = useState("");
  const [plateType, setPlateType] = useState("");
  const [model, setModel] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const valid = chassis.length === 17 && plate && plateType && model;

  return (
    <div style={{ marginTop: 24, border: "1px solid var(--rule)", padding: 24, background: "var(--ink)" }}>
      {submitted ? (
        <div style={{ padding: 32, textAlign: "center" }}>
          <div className="t-mono" style={{ fontSize: 11, color: "var(--signal)", letterSpacing: "0.22em" }}>◉ SEEDED</div>
          <div className="t-display" style={{ fontSize: 32, margin: "12px 0 24px", fontStyle: "italic" }}>Entry recorded.</div>
          <Button kind="ghost" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (valid) setSubmitted(true); }}>
          <Input label="Chassis · VIN" value={chassis} onChange={(v) => setChassis(v.toUpperCase())} maxLength={17} mono />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Plate" value={plate} onChange={(v) => setPlate(v.toUpperCase())} mono />
            <Select label="Type" value={plateType} options={[{ value: "TN", label: "TN" }, { value: "RS", label: "RS" }, { value: "CD", label: "CD" }]} onChange={setPlateType} />
          </div>
          <Select label="Model" value={model} options={[{ value: "MODEL_3", label: "Model 3" }, { value: "MODEL_Y", label: "Model Y" }, { value: "MODEL_S", label: "Model S" }, { value: "MODEL_X", label: "Model X" }, { value: "CYBERTRUCK", label: "Cybertruck" }]} onChange={setModel} />
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Button type="submit" disabled={!valid}>Commit</Button>
            <Button kind="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export function NotFoundPage({ navigate }) {
  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", borderBottom: "1px solid var(--rule)", background: "var(--ink)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} data-cursor="home" style={{ color: "var(--bone)" }}>
          <Wordmark />
        </a>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24, padding: "120px var(--gutter)", alignItems: "center" }}>
        <div style={{ gridColumn: "2 / span 5" }}>
          <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>Code 404</div>
          <h1 className="t-display" style={{ fontSize: "clamp(5rem, 12vw, 14rem)", margin: "16px 0", letterSpacing: "-0.04em" }}>
            Not <span style={{ fontStyle: "italic" }}>listed.</span>
          </h1>
          <p style={{ color: "var(--chalk)", fontSize: 15, maxWidth: 420, lineHeight: 1.6 }}>
            The page is absent from the manifest. Return to the network, or begin a verification.
          </p>
          <div style={{ marginTop: 48, display: "flex", gap: 16 }}>
            <Button onClick={() => navigate("/")}>Return home</Button>
            <Button kind="ghost" onClick={() => navigate("/verify/local")}>Verify a Tesla</Button>
          </div>
        </div>
        <div style={{ gridColumn: "8 / span 4", border: "1px solid var(--rule)", padding: 24, fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--chalk)", lineHeight: 1.7 }}>
          <div>$ GET /page/unknown</div>
          <div>↳ 404 · manifest miss</div>
          <div>↳ ref: {window.location.pathname}</div>
          <div>↳ t: {new Date().toISOString()}</div>
          <div style={{ borderTop: "1px solid var(--rule)", marginTop: 16, paddingTop: 16 }}>
            Try: /verify/local · /login · /app/stations
          </div>
        </div>
      </div>
    </div>
  );
}

