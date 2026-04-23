/* ——— Register · Login · OTP ——— */

import { useState, useEffect, useRef, useMemo } from "react";
import { Input, Button } from "../components/primitives.jsx";
import { TopNav } from "./Landing.jsx";
import api, { ApiError } from "../services/api.js";
import {
  getVerificationToken,
  setVerificationToken,
  setTokens,
  setUser as persistUser,
} from "../services/auth.js";

export function RegisterPage({ navigate }) {
  const verification = getVerificationToken();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phoneNumber: "", countryCode: "+216",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const valid = form.firstName && form.lastName && form.email.includes("@") && form.password.length >= 8 && form.phoneNumber;
  const upd = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!verification?.token) {
      // Gently redirect — can't register without a verification token
      navigate("/verify/local");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    setLoading(true); setErr(null);
    try {
      await api.register({
        verificationToken: verification?.token,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        countryCode: form.countryCode,
      });
      // Verification token consumed — drop it
      setVerificationToken(null);
      navigate("/verify-email/pending");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh" }}>
      <TopNav navigate={navigate} />
      <div style={{ padding: "48px var(--gutter)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--rule)", paddingBottom: 20, marginBottom: 60 }}>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase" }}>03 / Account</span>
          <span className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Token · {verification?.token?.slice(0, 11) || "UNBOUND"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24 }}>
          <div style={{ gridColumn: "1 / span 4" }}>
            <h1 className="t-display" style={{ fontSize: "clamp(3rem, 6vw, 6rem)", margin: 0, letterSpacing: "-0.03em" }}>
              Almost <span style={{ fontStyle: "italic" }}>in.</span>
            </h1>
            <p style={{ color: "var(--chalk)", maxWidth: 320, marginTop: 24, fontSize: 14, lineHeight: 1.55 }}>
              Six fields. We use them to reach you — nothing else.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (valid) submit(); }} style={{ gridColumn: "7 / span 6" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <Input label="First name" value={form.firstName} onChange={upd("firstName")} autoFocus />
              <Input label="Last name" value={form.lastName} onChange={upd("lastName")} />
            </div>
            <Input label="Email address" value={form.email} onChange={upd("email")} type="email" />
            <Input label="Password" value={form.password} onChange={upd("password")} type="password" hint="8+ characters · one number" />
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 32 }}>
              <Input label="Country" value={form.countryCode} onChange={upd("countryCode")} mono />
              <Input label="Phone number" value={form.phoneNumber} onChange={upd("phoneNumber")} mono />
            </div>
            {err && <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>{err}</div>}
            <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" disabled={!valid} loading={loading}>Create account</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function EmailPendingPage({ navigate }) {
  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh" }}>
      <TopNav navigate={navigate} />
      <div style={{ padding: "160px var(--gutter)", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24 }}>
        <div style={{ gridColumn: "2 / span 6" }}>
          <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>04 / Confirm</div>
          <h1 className="t-display" style={{ fontSize: "clamp(3rem, 7vw, 7rem)", margin: 0, letterSpacing: "-0.03em" }}>
            Check your <span style={{ fontStyle: "italic" }}>inbox.</span>
          </h1>
          <p style={{ maxWidth: 440, color: "var(--chalk)", marginTop: 32, fontSize: 15, lineHeight: 1.55 }}>
            We sent a confirmation link. Open it, and the network opens for you.
          </p>
          <div style={{ marginTop: 64, display: "flex", gap: 24 }}>
            <Button onClick={() => navigate("/login")}>Proceed to sign-in</Button>
          </div>
        </div>
        <div style={{ gridColumn: "9 / span 3" }}>
          <div style={{ border: "1px solid var(--rule)", padding: 24, background: "var(--graphite)" }}>
            <div className="t-caps" style={{ marginBottom: 12 }}>Envelope · Preview</div>
            <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 16 }}>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)" }}>FROM</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>concierge@telsa.tn</div>
              <div className="t-mono" style={{ fontSize: 11, color: "var(--chalk)", marginTop: 16 }}>SUBJECT</div>
              <div style={{ fontSize: 14, marginTop: 4, fontStyle: "italic", fontFamily: "var(--f-display)" }}>Open your account.</div>
              <div style={{ marginTop: 16, padding: 12, background: "var(--carbon)", border: "1px solid var(--rule)" }}>
                <span className="t-mono" style={{ fontSize: 11, color: "var(--ember)" }}>→ telsa.tn/verify-email?token=…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [reason, setReason] = useState(null);
  const [err, setErr] = useState(null);
  const valid = email.includes("@") && password.length >= 8;

  const submit = async () => {
    setLoading(true); setErr(null);
    try {
      const data = await api.login({ email, password });
      // Backend may return either { userId, otpRequired: true } or full tokens.
      // Per the flow, MFA gate should return userId + otpRequired.
      if (data?.accessToken && data?.refreshToken) {
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        if (data.user) persistUser(data.user);
        navigate("/app");
        return;
      }
      const userId = data?.userId || data?.user?.id;
      if (!userId) throw new ApiError("Login succeeded but no session could be established.");
      // Stash a minimal user object + userId for the OTP page
      persistUser({ id: userId, email });
      try { await api.sendOtp({ userId }); } catch { /* OTP may auto-send on login */ }
      navigate("/otp");
    } catch (e) {
      if (e instanceof ApiError && (e.status === 423 || e.code === "ACCOUNT_LOCKED")) {
        setReason(e.message);
        setLocked(true);
      } else {
        setErr(e instanceof ApiError ? e.message : "Sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (locked) return <LockedState navigate={navigate} reason={reason || "Too many failed attempts · retry shortly"} />;

  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh" }}>
      <TopNav navigate={navigate} />
      <div style={{ padding: "160px var(--gutter)", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24 }}>
        <div style={{ gridColumn: "2 / span 4" }}>
          <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>05 / Entry</div>
          <h1 className="t-display" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", margin: 0, letterSpacing: "-0.03em" }}>
            Sign <span style={{ fontStyle: "italic" }}>in.</span>
          </h1>
          <p style={{ color: "var(--chalk)", maxWidth: 320, marginTop: 24, fontSize: 14, lineHeight: 1.55 }}>
            Two fields. A six-digit code follows.
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (valid) submit(); }} style={{ gridColumn: "7 / span 5" }}>
          <Input label="Email address" value={email} onChange={setEmail} autoFocus type="email" />
          <Input label="Password" value={password} onChange={setPassword} type="password" />
          {err && <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>{err}</div>}
          <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="#" className="t-mono link-offset" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--chalk)", textDecoration: "none" }}>Forgot password</a>
            <Button type="submit" disabled={!valid} loading={loading}>Continue</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ——— OTP ———
export function OtpPage({ navigate, user }) {
  const stashedUser = user || (() => {
    try { return JSON.parse(localStorage.getItem("telsa.user") || "null"); } catch { return null; }
  })();
  const userId = stashedUser?.id || stashedUser?.userId;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [retries, setRetries] = useState(3);
  const [cooldown, setCooldown] = useState(42);
  const [state, setState] = useState("idle"); // idle | verifying | success | ratelimited
  const [errMsg, setErrMsg] = useState(null);

  // Stable array of refs — one per cell
  const refs = useMemo(() => Array.from({ length: 6 }, () => ({ current: null })), []);

  useEffect(() => {
    refs[0].current?.focus();
  }, [refs]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const setDigit = (i, v) => {
    v = (v || "").replace(/\D/g, "").slice(-1);
    setDigits(d => { const n = [...d]; n[i] = v; return n; });
    if (v && i < 5) refs[i + 1].current?.focus();
  };
  const onPaste = (e) => {
    const s = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (s.length) {
      e.preventDefault();
      const arr = ["", "", "", "", "", ""];
      Array.from(s).forEach((c, i) => arr[i] = c);
      setDigits(arr);
      refs[Math.min(s.length, 5)].current?.focus();
    }
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const full = digits.join("");
  useEffect(() => {
    if (full.length !== 6 || state !== "idle") return;
    if (!userId) {
      setErrMsg("Session expired. Please sign in again.");
      return;
    }
    setState("verifying"); setErrMsg(null);
    (async () => {
      try {
        const data = await api.verifyOtp({ userId, otp: full });
        if (data?.accessToken && data?.refreshToken) {
          setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
          if (data.user) persistUser(data.user);
          setState("success");
          setTimeout(() => navigate("/app"), 900);
        } else {
          throw new ApiError("OTP verified but no session was issued.");
        }
      } catch (e) {
        if (e instanceof ApiError && (e.status === 429 || e.code === "RATE_LIMITED")) {
          setState("ratelimited");
        } else {
          setRetries(r => Math.max(0, r - 1));
          setDigits(["", "", "", "", "", ""]);
          setErrMsg(e instanceof ApiError ? e.message : "Code incorrect.");
          if (retries - 1 <= 0) setState("ratelimited");
          else setState("idle");
          refs[0].current?.focus();
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full]);

  const resend = async () => {
    if (!userId) return;
    try {
      await api.resendOtp({ userId });
      setCooldown(42); setErrMsg(null);
    } catch (e) {
      setErrMsg(e instanceof ApiError ? e.message : "Could not resend.");
    }
  };

  const ringPct = cooldown / 42;

  return (
    <div style={{ background: "var(--ink)", color: "var(--bone)", minHeight: "100vh" }}>
      <TopNav navigate={navigate} />
      {state === "ratelimited" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 72, background: "var(--ember)", color: "var(--bone)", padding: "14px var(--gutter)", display: "flex", justifyContent: "space-between", animation: "slideDownIn 520ms var(--e-editorial)" }}>
          <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>◉ Rate-limit engaged</span>
          <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>Account protected · Retry shortly</span>
        </div>
      )}

      <div style={{ padding: "120px var(--gutter)", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", columnGap: 24 }}>
        <div style={{ gridColumn: "2 / span 5" }}>
          <div className="t-mono" style={{ fontSize: 11, color: "var(--ember)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 32 }}>06 / Passage</div>
          <h1 className="t-display" style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", margin: 0, letterSpacing: "-0.03em" }}>
            Six digits.<br /><span style={{ fontStyle: "italic" }}>One attempt per minute.</span>
          </h1>
          <p style={{ color: "var(--chalk)", maxWidth: 380, marginTop: 28, fontSize: 14, lineHeight: 1.55 }}>
            We just sent an OTP to {stashedUser?.email || "your phone"}. Paste, type, or let it land cell by cell.
          </p>
        </div>

        <div style={{ gridColumn: "8 / span 4", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 8 }} aria-live="polite">
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 10, height: 10, borderRadius: 999,
                background: i < retries ? "var(--bone)" : "var(--rule)",
                animation: i === retries ? "shake 420ms" : "none",
              }} />
            ))}
          </div>

          <div className="t-caps" style={{ marginBottom: 20 }}>Code · Six digits</div>
          <div style={{ display: "flex", gap: 12 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs[i].current = el; }}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onPaste={onPaste}
                onKeyDown={(e) => onKey(i, e)}
                inputMode="numeric"
                data-cursor="type"
                style={{
                  width: 72, height: 88, textAlign: "center",
                  background: state === "ratelimited" ? "rgba(227,78,44,0.08)" : "var(--carbon)",
                  border: state === "ratelimited" ? "1px solid var(--ember)" : "1px solid var(--rule)",
                  fontFamily: "var(--f-display)", fontSize: 56, color: state === "success" ? "var(--signal)" : "var(--bone)",
                  outline: "none", borderRadius: 2,
                  transition: `color 360ms var(--e-editorial) ${i * 60}ms, border-color 300ms`,
                }}
                readOnly={state === "ratelimited"}
              />
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16 }}>
            {cooldown > 0 ? (
              <>
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="var(--rule)" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="14" fill="none" stroke="var(--ember)" strokeWidth="1.5"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={(1 - ringPct) * 2 * Math.PI * 14}
                    transform="rotate(-90 16 16)"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className="t-mono" style={{ fontSize: 12, color: "var(--chalk)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Resend in 0:{String(cooldown).padStart(2, "0")}
                </span>
              </>
            ) : (
              <button onClick={resend} data-cursor="resend" className="link-offset t-mono" style={{ background: "none", border: 0, color: "var(--bone)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}>
                → Resend code
              </button>
            )}
          </div>

          <div style={{ marginTop: 40, color: "var(--chalk)", fontSize: 12 }} className="t-mono">
            {state === "verifying" ? "Verifying…" :
              state === "success" ? <span style={{ color: "var(--signal)" }}>◉ Accepted — entering the network</span> :
              state === "ratelimited" ? <span style={{ color: "var(--ember)" }}>◉ Cells are frozen. The code will not accept.</span> :
              errMsg ? <span style={{ color: "var(--ember)" }}>◉ {errMsg}</span> :
              "Awaiting code"}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LockedState({ navigate, reason }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "var(--ember)", color: "var(--bone)", zIndex: 100,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    }}>
      <div className="grain" style={{ opacity: 0.1 }} />
      <div className="t-mono" style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 32 }}>◉ Account locked</div>
      <div className="t-display" style={{ fontSize: "clamp(5rem, 12vw, 12rem)", fontStyle: "italic", letterSpacing: "-0.05em" }}>
        This account is resting.
      </div>
      <div className="t-mono" style={{ fontSize: 12, letterSpacing: "0.22em", marginTop: 32, opacity: 0.7 }}>
        {reason || "It may retry shortly."}
      </div>
      <button onClick={() => navigate("/")} style={{ marginTop: 56, background: "transparent", border: "1px solid var(--bone)", color: "var(--bone)", padding: "16px 28px", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}>
        Return to landing →
      </button>
    </div>
  );
}
