/* ——— Verification · Local & Foreign ——— */

import { useState, useEffect } from "react";
import { Input, Select, Button } from "../components/primitives.jsx";
import { TopNav } from "./Landing.jsx";
import api, { ApiError } from "../services/api.js";
import { setVerificationToken as persistVerificationToken } from "../services/auth.js";

const TESLA_MODELS = [
  { value: "MODEL_3", label: "Model 3" },
  { value: "MODEL_Y", label: "Model Y" },
  { value: "MODEL_S", label: "Model S" },
  { value: "MODEL_X", label: "Model X" },
  { value: "CYBERTRUCK", label: "Cybertruck" },
];
const PLATE_TYPES = [
  { value: "TN", label: "Tunisian · Standard" },
  { value: "RS", label: "Tunisian · RS series" },
  { value: "CD", label: "Diplomatic · CD" },
];

// Module-level event bus for VerifiedOverlay → no window globals
const verifiedBus = {
  listener: null,
  show(token, onContinue) {
    this.listener?.(token, onContinue);
  },
};

export default function VerifyPage({ mode, navigate }) {
  const [tab, setTab] = useState(mode || "local");
  useEffect(() => { setTab(mode || "local"); }, [mode]);

  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh" }}>
      <TopNav navigate={navigate} />
      <div style={{ padding: "48px var(--gutter) 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--rule)", paddingBottom: 20, marginBottom: 60 }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>02 / Verification</span>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>One car · one account</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24 }}>
          <div style={{ gridColumn: "1 / span 5" }}>
            <h1 className="t-display" style={{ fontSize: "clamp(3.5rem, 7vw, 7.5rem)", margin: 0, letterSpacing: "-0.04em" }}>
              Verify your <span style={{ fontStyle: "italic" }}>Tesla.</span>
            </h1>
            <p style={{ maxWidth: 380, color: "var(--chalk)", fontSize: 15, lineHeight: 1.55, marginTop: 32 }}>
              We confirm the chassis. Nothing else. Local registry for TN, RS and CD plates — carte grise for foreign.
            </p>

            <div style={{ marginTop: 96, borderTop: "1px solid var(--rule)", paddingTop: 32 }}>
              <div className="t-caps">Elapsed</div>
              <div className="t-mono" style={{ fontSize: 28, color: "var(--bone)", marginTop: 12 }}>00 : 00 : 00</div>
              <div className="t-caps" style={{ marginTop: 32 }}>Entry</div>
              <div className="t-mono" style={{ fontSize: 13, color: "var(--bone)", marginTop: 8, letterSpacing: "0.08em" }}>/ENTRY/001</div>
            </div>
          </div>

          <div style={{ gridColumn: "7 / span 6" }}>
            <div style={{ position: "relative", display: "flex", borderBottom: "1px solid var(--rule)", marginBottom: 48 }}>
              {[{ k: "local", l: "LOCAL" }, { k: "foreign", l: "FOREIGN" }].map(t => (
                <button key={t.k} onClick={() => { setTab(t.k); navigate(`/verify/${t.k}`); }} data-cursor="switch"
                  style={{
                    flex: 1, background: "transparent", border: 0, cursor: "pointer",
                    padding: "20px 0",
                    fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                    color: tab === t.k ? "var(--bone)" : "var(--chalk)",
                    transition: "color 280ms var(--e-editorial)",
                  }}>
                  {t.l}
                </button>
              ))}
              <div style={{
                position: "absolute", bottom: -1, left: tab === "local" ? "0%" : "50%", width: "50%",
                height: 2, background: "var(--ember)",
                transition: "left 520ms var(--e-editorial)",
              }} />
            </div>

            {tab === "local"
              ? <LocalForm navigate={navigate} />
              : <ForeignForm navigate={navigate} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocalForm({ navigate }) {
  const [chassisNumber, setChassis] = useState("");
  const [plateNumber, setPlate] = useState("");
  const [plateType, setPlateType] = useState("");
  const [teslaModel, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const valid = chassisNumber.length === 17 && plateNumber && plateType && teslaModel;

  const submit = async () => {
    setLoading(true); setErr(null);
    try {
      const data = await api.verifyLocal({ chassisNumber, plateNumber, plateType, teslaModel });
      const token = data?.verificationToken || data?.token;
      if (!token) throw new ApiError("Verification succeeded but no token was returned.");
      persistVerificationToken({ token, teslaModel, origin: "LOCAL" });
      verifiedBus.show(token, () => navigate("/register"));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) submit(); }}>
      <Input label="Chassis number · VIN" value={chassisNumber} onChange={v => setChassis(v.toUpperCase())} maxLength={17} mono placeholder="17 characters" autoFocus />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Input label="Plate number" value={plateNumber} onChange={v => setPlate(v.toUpperCase())} mono placeholder="e.g. 214 A 88" />
        <Select label="Plate type" value={plateType} options={PLATE_TYPES} onChange={setPlateType} />
      </div>
      <Select label="Tesla model" value={teslaModel} options={TESLA_MODELS} onChange={setModel} />
      {err && <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>{err}</div>}
      <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          {valid ? "Ready" : "Awaiting entries"}
        </span>
        <Button type="submit" disabled={!valid} loading={loading} cursor="confirm">Confirm ownership</Button>
      </div>
    </form>
  );
}

function ForeignForm({ navigate }) {
  const [chassisNumber, setChassis] = useState("");
  const [teslaModel, setModel] = useState("");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const valid = chassisNumber.length === 17 && teslaModel && file;

  const submit = async () => {
    setLoading(true); setErr(null);
    try {
      const data = await api.verifyForeign({ chassisNumber, teslaModel, carteGrise: file });
      const token = data?.verificationToken || data?.token;
      if (!token) throw new ApiError("Submission succeeded but no token was returned.");
      persistVerificationToken({ token, teslaModel, origin: "FOREIGN" });
      verifiedBus.show(token, () => navigate("/register"));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) submit(); }}>
      <Input label="Chassis number · VIN" value={chassisNumber} onChange={v => setChassis(v.toUpperCase())} maxLength={17} mono placeholder="17 characters" autoFocus />
      <Select label="Tesla model" value={teslaModel} options={TESLA_MODELS} onChange={setModel} />

      <div style={{ marginBottom: 8 }}>
        <span className="t-caps">Carte grise · Upload</span>
      </div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
        data-cursor="drop"
        style={{
          display: "block",
          border: drag ? "1px solid var(--ember)" : "1px dashed var(--rule)",
          padding: "64px 40px",
          textAlign: "center",
          cursor: "pointer",
          transform: drag ? "translateY(4px)" : "translateY(0)",
          transition: "transform 420ms var(--e-editorial), border-color 240ms",
          background: drag ? "rgba(227,78,44,0.04)" : "transparent",
        }}>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={(e) => setFile(e.target.files?.[0])} />
        {!file && (
          <>
            <div className="t-display" style={{ fontSize: 36, margin: "0 0 12px" }}>Drop carte grise</div>
            <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              PDF · PNG · JPG · max 8MB
            </div>
          </>
        )}
        {file && (
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr auto",
            alignItems: "center", gap: 24, textAlign: "left",
            border: "1px solid var(--rule)", padding: 20, background: "var(--carbon)",
          }}>
            <div style={{ width: 48, height: 64, background: "var(--graphite)", border: "1px solid var(--rule)", position: "relative" }}>
              <div style={{ position: "absolute", top: 6, left: 6, right: 6, height: 2, background: "var(--rule)" }} />
              <div style={{ position: "absolute", top: 14, left: 6, right: 14, height: 2, background: "var(--rule)" }} />
              <div style={{ position: "absolute", top: 22, left: 6, right: 20, height: 2, background: "var(--rule)" }} />
              <div style={{ position: "absolute", bottom: 6, left: 6, width: 16, height: 12, background: "var(--ember)" }} />
            </div>
            <div>
              <div className="t-display" style={{ fontSize: 22 }}>{file.name}</div>
              <div className="t-mono" style={{ fontSize: 10, color: "var(--chalk)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 6 }}>
                {(file.size / 1024).toFixed(1)} KB · READY
              </div>
            </div>
            <span className="t-mono" style={{ fontSize: 10, color: "var(--ember)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Replace →</span>
          </div>
        )}
      </label>

      {err && <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 16 }}>{err}</div>}

      <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" disabled={!valid} loading={loading}>Submit for review</Button>
      </div>
    </form>
  );
}

// ——— Verified takeover ———
export function VerifiedOverlay() {
  const [state, setState] = useState(null);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    verifiedBus.listener = (token, onContinue) => {
      setState({ token, onContinue });
    };
    return () => { verifiedBus.listener = null; };
  }, []);
  useEffect(() => {
    if (!state) return;
    const t = setTimeout(() => {
      if (!hovering) {
        state.onContinue();
        setState(null);
      }
    }, 2400);
    return () => clearTimeout(t);
  }, [state, hovering]);

  if (!state) return null;
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 6000, background: "var(--ember)",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        animation: "fadeIn 360ms var(--e-editorial)",
      }}>
      <div className="grain" style={{ opacity: 0.1 }} />
      <div className="t-mono" style={{ fontSize: 10, color: "rgba(244,241,236,0.6)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 24 }}>Ownership confirmed</div>
      <div className="t-display" style={{ fontSize: "clamp(7rem, 18vw, 18rem)", fontStyle: "italic", color: "var(--bone)", letterSpacing: "-0.05em" }}>
        Verified.
      </div>
      <div className="t-mono" style={{ fontSize: 13, color: "rgba(244,241,236,0.75)", letterSpacing: "0.18em", marginTop: 24 }}>
        TOKEN · {String(state.token).slice(0, 11)}
      </div>
      <button onClick={() => { const c = state.onContinue; setState(null); c(); }} data-cursor="continue"
        style={{ marginTop: 64, background: "transparent", border: "1px solid var(--bone)", color: "var(--bone)", padding: "16px 28px", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}>
        Continue to registration →
      </button>
    </div>
  );
}
