export const PARTNER_STORAGE_KEY = 'social_partner';
export const START_QUERY_PARAM = 'start';

const PARTNER_PREFIX = 'partner_';

function parsePartnerFromStart(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith(PARTNER_PREFIX)) return null;
  const id = trimmed.slice(PARTNER_PREFIX.length);
  if (!/^\d+$/.test(id) || id === '0') return null;
  return id;
}

/**
 * Сохраняет partner id из ?start=partner_<tg_id> (first-touch) и убирает параметр из URL.
 */
export function captureStartPartnerFromUrl() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get(START_QUERY_PARAM);
  const partnerId = parsePartnerFromStart(raw);

  if (partnerId && !localStorage.getItem(PARTNER_STORAGE_KEY)) {
    localStorage.setItem(PARTNER_STORAGE_KEY, partnerId);
  }

  if (raw !== null && params.has(START_QUERY_PARAM)) {
    params.delete(START_QUERY_PARAM);
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', next);
  }
}

export function getStoredPartner() {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem(PARTNER_STORAGE_KEY);
  if (!id || !/^\d+$/.test(id)) return null;
  return id;
}

export function clearStoredPartner() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PARTNER_STORAGE_KEY);
}
