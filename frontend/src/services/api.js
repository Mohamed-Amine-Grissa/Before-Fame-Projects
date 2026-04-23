// Telsa Charging Points — API client.
// Talks to the Spring Boot backend via the Vite dev proxy at /api.
// All responses are wrapped in { success, message, data, timestamp } — we
// surface `data` on success and throw a typed ApiError on failure.

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth.js";

const BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "") + "/api";

export class ApiError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

let refreshInFlight = null;

async function attemptRefresh() {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        return null;
      }
      const body = await res.json().catch(() => ({}));
      const pair = body?.data;
      if (pair?.accessToken && pair?.refreshToken) {
        setTokens({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
        return pair.accessToken;
      }
      clearTokens();
      return null;
    } catch {
      clearTokens();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

async function request(path, {
  method = "GET",
  body,
  headers = {},
  isMultipart = false,
  auth = true,
  _retried = false,
} = {}) {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const finalHeaders = { ...headers };
  if (!isMultipart) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isMultipart ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 401 → try refresh once
  if (res.status === 401 && !_retried && auth && getRefreshToken()) {
    const fresh = await attemptRefresh();
    if (fresh) {
      return request(path, { method, body, headers, isMultipart, auth, _retried: true });
    }
  }

  let parsed = null;
  try { parsed = await res.json(); } catch { /* body may be empty */ }

  if (!res.ok) {
    const code = parsed?.code || parsed?.error;
    const message = parsed?.message || `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, code, data: parsed });
  }

  // Success envelope: { success, message, data }
  if (parsed && Object.prototype.hasOwnProperty.call(parsed, "data")) return parsed.data;
  return parsed;
}

// ————— Public (no auth) —————

export const api = {
  // ——— vehicle verification ———
  verifyLocal({ chassisNumber, plateNumber, plateType, teslaModel }) {
    return request("/vehicles/verify/local", {
      method: "POST",
      auth: false,
      body: { chassisNumber, plateNumber, plateType, teslaModel },
    });
  },

  verifyForeign({ chassisNumber, teslaModel, carteGrise }) {
    const fd = new FormData();
    fd.append("chassisNumber", chassisNumber);
    fd.append("teslaModel", teslaModel);
    fd.append("carteGrise", carteGrise);
    return request("/vehicles/verify/foreign", {
      method: "POST",
      auth: false,
      isMultipart: true,
      body: fd,
    });
  },

  // ——— auth ———
  register({ verificationToken, firstName, lastName, email, password, phoneNumber, countryCode }) {
    return request("/auth/register", {
      method: "POST",
      auth: false,
      body: { verificationToken, firstName, lastName, email, password, phoneNumber, countryCode },
    });
  },

  login({ email, password }) {
    return request("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
  },

  refresh({ refreshToken }) {
    return request("/auth/refresh", {
      method: "POST",
      auth: false,
      body: { refreshToken },
    });
  },

  verifyEmail(token) {
    return request(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: "GET",
      auth: false,
    });
  },

  logout() {
    return request("/auth/logout", { method: "POST" });
  },

  // ——— OTP ———
  sendOtp({ userId }) {
    return request("/otp/send", {
      method: "POST",
      auth: false,
      body: { userId },
    });
  },

  verifyOtp({ userId, otp }) {
    return request("/otp/verify", {
      method: "POST",
      auth: false,
      body: { userId, otp },
    });
  },

  resendOtp({ userId }) {
    return request("/otp/resend", {
      method: "POST",
      auth: false,
      body: { userId },
    });
  },

  // ——— stations (authenticated) ———
  nearbyStations({ lat, lng, teslaModel, modelYear }) {
    const qs = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      teslaModel,
    });
    if (modelYear != null) qs.append("modelYear", String(modelYear));
    return request(`/stations/nearby?${qs.toString()}`);
  },

  // ——— admin ———
  admin: {
    stats() {
      return request("/admin/stats");
    },
    listUsers({ page = 0 } = {}) {
      return request(`/admin/users?page=${page}`);
    },
    getUser(id) {
      return request(`/admin/users/${encodeURIComponent(id)}`);
    },
    deleteUser(id) {
      return request(`/admin/users/${encodeURIComponent(id)}`, { method: "DELETE" });
    },
    addLocalErp({ chassisNumber, plateNumber, plateType, teslaModel }) {
      return request("/admin/erp/local", {
        method: "POST",
        body: { chassisNumber, plateNumber, plateType, teslaModel },
      });
    },
  },
};

export default api;
