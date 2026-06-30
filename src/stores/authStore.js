import { create } from 'zustand';
import { authApi, AUTH_TOKEN_STORAGE_KEY } from '@services/api';
import { clearStoredStamp, getStoredStamp } from '@utils/stamp';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  loadFromStorage: async () => {
    const userJson = localStorage.getItem('zoomer_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        set({ user, isAuthenticated: true });
        // Verify token is still valid
        const { data } = await authApi.me();
        set({ user: data, isAuthenticated: true });
        localStorage.setItem('zoomer_user', JSON.stringify(data));
      } catch {
        localStorage.removeItem('zoomer_user');
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        set({ user: null, isAuthenticated: false });
      }
    }
  },

  _setAuth: (user, token) => {
    localStorage.setItem('zoomer_user', JSON.stringify(user));
    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    }
    set({ user, isAuthenticated: true, isLoading: false });
  },

  botLogin: async (oneTimeToken) => {
    set({ isLoading: true });
    try {
      const response = await authApi.botLogin({ token: oneTimeToken });
      const { data } = response;
      const jwt =
        data.token ||
        response.headers['x-auth-token'] ||
        response.headers['X-Auth-Token'];
      get()._setAuth(data.user, jwt);
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const detail = error.response?.data?.detail;
      let message = 'Ссылка устарела или уже использована';
      if (typeof detail === 'string') {
        message = detail;
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Нет связи с API (запустите бэкенд и проверьте /api через тот же хост).';
      }
      return { success: false, error: message };
    }
  },

  telegramLogin: async (telegramData) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.telegramLogin(telegramData);
      get()._setAuth(data.user, data.token);
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const detail = error.response?.data?.detail;
      let message = 'Ошибка авторизации';
      if (Array.isArray(detail)) {
        message = detail.map((e) => e?.msg || String(e)).join(' ') || message;
      } else if (typeof detail === 'string') {
        message = detail;
      } else if (detail && typeof detail === 'object' && typeof detail.msg === 'string') {
        message = detail.msg;
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Нет связи с API (запустите бэкенд и проверьте /api через тот же хост).';
      }
      return { success: false, error: message };
    }
  },

  emailRegister: async (email, password) => {
    set({ isLoading: true });
    try {
      const stamp = getStoredStamp();
      const { data } = await authApi.register({
        email,
        password,
        ...(stamp && { stamp }),
      });
      set({ isLoading: false });
      if (data.requires_verification) {
        return { success: true, requiresVerification: true, email: data.email };
      }
      clearStoredStamp();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.detail || 'Ошибка регистрации' };
    }
  },

  emailLogin: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login({ email, password });
      get()._setAuth(data.user, data.token);
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const resp = error.response?.data;
      if (resp?.requires_verification) {
        return { success: false, requiresVerification: true, email: resp.email };
      }
      return { success: false, error: resp?.detail || 'Неверный email или пароль' };
    }
  },

  verifyEmail: async (email, code) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.verifyEmail({ email, code });
      get()._setAuth(data.user, data.token);
      clearStoredStamp();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.detail || 'Неверный код' };
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true });
    try {
      const stamp = getStoredStamp();
      const { data } = await authApi.googleLogin({
        credential,
        ...(stamp && { stamp }),
      });
      get()._setAuth(data.user, data.token);
      clearStoredStamp();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.response?.data?.detail || 'Ошибка авторизации Google' };
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await authApi.me();
      set({ user: data });
      localStorage.setItem('zoomer_user', JSON.stringify(data));
    } catch {
      get().logout();
    }
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('zoomer_user');
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
