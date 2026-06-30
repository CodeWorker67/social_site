export const STAMP_STORAGE_KEY = 'social_stamp';
export const STAMP_QUERY_PARAM = 'stamp';

const STAMP_RE = /^[a-z0-9_-]{1,100}$/;

function normalizeStamp(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim().toLowerCase();
  if (!s || s === 'email' || !STAMP_RE.test(s)) return null;
  return s;
}

/**
 * Сохраняет метку из ?stamp=... (first-touch) и убирает параметр из URL.
 */
export function captureStampFromUrl() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get(STAMP_QUERY_PARAM);
  const stamp = normalizeStamp(raw);

  if (stamp && !localStorage.getItem(STAMP_STORAGE_KEY)) {
    localStorage.setItem(STAMP_STORAGE_KEY, stamp);
  }

  if (raw !== null && params.has(STAMP_QUERY_PARAM)) {
    params.delete(STAMP_QUERY_PARAM);
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', next);
  }
}

export function getStoredStamp() {
  if (typeof window === 'undefined') return null;
  return normalizeStamp(localStorage.getItem(STAMP_STORAGE_KEY));
}

export function clearStoredStamp() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STAMP_STORAGE_KEY);
}
