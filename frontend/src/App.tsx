import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Cursor, PageWipe } from "./components/primitives.jsx";
import Landing from "./pages/Landing.jsx";
import VerifyPage, { VerifiedOverlay } from "./pages/Verify.jsx";
import { RegisterPage, EmailPendingPage, LoginPage, OtpPage, LockedState } from "./pages/Auth.jsx";
import { Dashboard, StationsPage, AccountPage } from "./pages/AppShell.jsx";
import { AdminPage, NotFoundPage } from "./pages/Admin.jsx";
import {
  getUser,
  getVerificationToken,
  logoutLocal,
  subscribe,
} from "./services/auth.js";

export default function App() {
  const initialPath = useMemo(() => {
    if (typeof window === "undefined") return "/";
    return localStorage.getItem("telsa:path") || "/";
  }, []);

  const [path, setPath] = useState(initialPath);
  const [wipeTrigger, setWipeTrigger] = useState(0);
  const [user, setUser] = useState(() => getUser());
  const [verificationToken, setVerificationToken] = useState(() => getVerificationToken());

  useEffect(() => {
    const unsub = subscribe(() => {
      setUser(getUser());
      setVerificationToken(getVerificationToken());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("telsa:path", path);
    }
  }, [path]);

  const navigate = (to: string) => {
    if (to === path) return;
    setWipeTrigger((t) => t + 1);
    setTimeout(() => {
      setPath(to);
      window.scrollTo(0, 0);
    }, 325);
  };

  const logout = () => {
    logoutLocal();
  };

  let page: ReactNode;
  if (path === "/") page = <Landing navigate={navigate} />;
  else if (path === "/verify/local") page = <VerifyPage mode="local" navigate={navigate} />;
  else if (path === "/verify/foreign") page = <VerifyPage mode="foreign" navigate={navigate} />;
  else if (path === "/register") page = <RegisterPage navigate={navigate} />;
  else if (path === "/verify-email/pending") page = <EmailPendingPage navigate={navigate} />;
  else if (path === "/login") page = <LoginPage navigate={navigate} />;
  else if (path === "/otp") page = <OtpPage navigate={navigate} user={user} />;
  else if (path === "/app") page = <Dashboard navigate={navigate} user={user} verificationToken={verificationToken} />;
  else if (path === "/app/stations") page = <StationsPage navigate={navigate} />;
  else if (path.startsWith("/app/stations/")) page = <StationsPage navigate={navigate} />;
  else if (path === "/app/account") page = <AccountPage navigate={navigate} user={user} verificationToken={verificationToken} logout={logout} />;
  else if (path === "/admin") page = <AdminPage navigate={navigate} />;
  else if (path === "/locked") page = <LockedState navigate={navigate} reason="Rate-limit engaged · retry in 00:15:00" />;
  else page = <NotFoundPage navigate={navigate} />;

  return (
    <>
      <Cursor />
      <PageWipe trigger={wipeTrigger} />
      <VerifiedOverlay />
      <RouteIndicator path={path} navigate={navigate} />
      {page}
    </>
  );
}

function RouteIndicator({ path, navigate }: { path: string; navigate: (to: string) => void }) {
  const [open, setOpen] = useState(false);
  const routes = [
    ["/", "Landing"],
    ["/verify/local", "Verify · Local"],
    ["/verify/foreign", "Verify · Foreign"],
    ["/register", "Register"],
    ["/verify-email/pending", "Email · Pending"],
    ["/login", "Login"],
    ["/otp", "OTP"],
    ["/app", "Dashboard"],
    ["/app/stations", "Stations"],
    ["/app/account", "Account"],
    ["/admin", "Admin"],
    ["/locked", "Locked"],
    ["/404", "Not found"],
  ];
  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 500, fontFamily: "var(--f-mono)" }}>
      {open && (
        <div style={{ background: "var(--graphite)", border: "1px solid var(--rule)", marginBottom: 8, width: 240, padding: "8px 0", animation: "fadeInUp 320ms var(--e-editorial)" }}>
          <div className="t-caps" style={{ padding: "8px 16px" }}>Route index</div>
          {routes.map(([p, l]) => (
            <button
              key={p}
              onClick={() => { navigate(p); setOpen(false); }}
              data-cursor="jump"
              style={{ width: "100%", textAlign: "left", background: path === p ? "var(--carbon)" : "transparent", border: 0, borderTop: "1px solid var(--rule)", padding: "10px 16px", cursor: "pointer", color: path === p ? "var(--bone)" : "var(--chalk)", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: 12 }}>{l}</span>
              <span className="t-mono" style={{ fontSize: 9, letterSpacing: "0.16em", color: path === p ? "var(--ember)" : "var(--chalk)" }}>{p}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="index"
        style={{ padding: "10px 14px", background: "var(--ink)", border: "1px solid var(--rule)", color: "var(--bone)", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
      >
        <span style={{ width: 6, height: 6, background: "var(--ember)", display: "inline-block" }} />
        {open ? "Close index" : "Route · " + path}
      </button>
    </div>
  );
}
