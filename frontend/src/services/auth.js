// Lightweight auth/token store backed by localStorage.
// No external state lib — just a subscribe-based publisher.

const KEY_ACCESS = "telsa.accessToken";
const KEY_REFRESH = "telsa.refreshToken";
const KEY_USER = "telsa.user";
const KEY_VERIFICATION = "telsa.verificationToken";

const listeners = new Set();

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

export function getAccessToken() { return read(KEY_ACCESS); }
export function getRefreshToken() { return read(KEY_REFRESH); }

export function setTokens({ accessToken, refreshToken }) {
  write(KEY_ACCESS, accessToken || null);
  write(KEY_REFRESH, refreshToken || null);
  notify();
}

export function clearTokens() {
  write(KEY_ACCESS, null);
  write(KEY_REFRESH, null);
  notify();
}

export function getUser() {
  const raw = read(KEY_USER);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setUser(user) {
  write(KEY_USER, user ? JSON.stringify(user) : null);
  notify();
}

export function getVerificationToken() {
  const raw = read(KEY_VERIFICATION);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setVerificationToken(v) {
  write(KEY_VERIFICATION, v ? JSON.stringify(v) : null);
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) {
    try { fn(); } catch {}
  }
}

export function logoutLocal() {
  clearTokens();
  setUser(null);
  setVerificationToken(null);
}
