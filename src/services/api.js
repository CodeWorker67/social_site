import axios from 'axios';
import { API_BASE_URL } from '@utils/constants';

/** JWT из ответа логина (cookie через прокси/ngrok иногда не цепляется к fetch). */
export const AUTH_TOKEN_STORAGE_KEY = 'zoomer_auth_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  /** Мобильные сети и ngrok медленнее; 10s часто даёт ложный «нет связи». */
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Бесплатный ngrok отдаёт HTML-заставку вместо API, если нет этого заголовка.
   * На десктопе после «Visit» ставится cookie и всё ок; на телефоне XHR часто ломается без заголовка.
   */
  if (typeof window !== 'undefined' && window.location.hostname.includes('ngrok')) {
    config.headers['ngrok-skip-browser-warning'] = '69420';
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zoomer_user');
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/auth/bot') && !path.includes('/gift')) {
        window.location.href = '/login?reason=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  telegramLogin: (data) => api.post('/auth/telegram', data),
  botLogin: (data) => api.post('/auth/bot-login', data),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendCode: (data) => api.post('/auth/resend-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  confirmReset: (data) => api.post('/auth/confirm-reset', data),
  logout: () => api.post('/auth/logout'),
  generateLinkingCode: () => api.post('/auth/generate-linking-code'),
  link: (data) => api.post('/auth/link', data),
  googleLogin: (data) => api.post('/auth/google', data),
};

// User
export const userApi = {
  subscription: () => api.get('/user/subscription'),
  keys: () => api.get('/user/keys'),
  referrals: () => api.get('/user/referrals'),
  profile: () => api.get('/user/profile'),
  account: () => api.get('/user/account'),
  changePassword: (data) => api.post('/user/change-password', data),
};

// Payments
export const paymentApi = {
  createPayment: (data) => api.post('/payments/create', data),
  getStatus: (id) => api.get(`/payments/${id}/status`),
};

// Trial
export const trialApi = {
  activate: () => api.post('/trial/activate'),
};

// Config
export const configApi = {
  tariffs: () => api.get('/config/tariffs'),
};

// Gifts
export const giftApi = {
  activate: (giftId) => api.post(`/gifts/${giftId}/activate`),
  activateWeb: (giftId) => api.post(`/gifts/${giftId}/activate-web`),
};

export default api;
