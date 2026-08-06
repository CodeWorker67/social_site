import { useEffect, useState } from 'react';
// import { useEffect, useRef, useState } from 'react'; // useRef — для TelegramAuth
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, ArrowLeft } from 'lucide-react';
import useAuthStore from '@stores/authStore';
import { authApi } from '@services/api';
import { ROUTES, GOOGLE_CLIENT_ID, BRAND_NAME } from '@utils/constants';
import Button from '@components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  // const [authMethod, setAuthMethod] = useState('telegram');

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD);
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Helmet>
        <title>Вход — {BRAND_NAME}</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <div className="card-dark text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zoomer-neon-dim to-zoomer-neon flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Войти в {BRAND_NAME}</h1>
            <p className="text-gray-400 text-sm mb-6">Выберите способ входа</p>

            {/* Method tabs — вход через Telegram временно скрыт (раскомментируйте блок ниже и TelegramAuth)
            <div className="flex gap-1 mb-6 bg-zoomer-dark rounded-xl p-1">
              <button
                onClick={() => setAuthMethod('telegram')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  authMethod === 'telegram' ? 'bg-zoomer-neon text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                Бот
              </button>
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  authMethod === 'email' ? 'bg-zoomer-neon text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {authMethod === 'telegram' && <TelegramAuth />}
            {authMethod === 'email' && <EmailAuth />}
            */}

            <EmailAuth />

            {/* Google — always visible */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-zoomer-border" />
              <span className="text-gray-500 text-xs">или</span>
              <div className="flex-1 h-px bg-zoomer-border" />
            </div>
            <GoogleLoginButton />
          </div>
        </motion.div>
      </section>
    </>
  );
}

/*
 * Вернуть вход через Telegram: импорт Send + TELEGRAM из constants, useRef;
 * раскомментировать useState(authMethod), блок «Method tabs» в JSX и вызовы TelegramAuth / EmailAuth по вкладке.
function TelegramAuth() {
  const containerRef = useRef(null);
  const botUsername = TELEGRAM.BOT_NAME.replace(/^@/, '').trim();

  useEffect(() => {
    if (!botUsername) {
      toast.error('Не задано имя бота (VITE_TELEGRAM_BOT_NAME)');
      return undefined;
    }

    const root = containerRef.current;
    if (!root) return undefined;

    const authUrl = `${window.location.origin}${ROUTES.LOGIN_TELEGRAM_CALLBACK}`;

    root.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    // Редирект с параметрами — не зависит от popup/postMessage (COOP, мобильные браузеры).
    script.setAttribute('data-auth-url', authUrl);
    root.appendChild(script);

    return () => {
      root.innerHTML = '';
    };
  }, [botUsername]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="flex min-h-[56px] w-full flex-col items-center justify-center rounded-xl border border-zoomer-border bg-zoomer-dark/50 py-3 [&_iframe]:max-w-full"
      />
      <p className="text-center text-xs text-gray-500">
        После «Войти как …» откроется бот, затем браузер вернёт вас на этот сайт — вход завершится
        автоматически (без всплывающего окна сайта).
      </p>
    </div>
  );
}
*/

function GoogleLoginButton() {
  const navigate = useNavigate();
  const { googleLogin } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error('Не задан Google Client ID (VITE_GOOGLE_CLIENT_ID)');
      return;
    }

    const handleCredential = async (response) => {
      const result = await googleLogin(response.credential);
      if (result.success) {
        toast.success('Вы вошли через Google!');
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error(result.error);
      }
    };

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
        });
        setReady(true);
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, [googleLogin, navigate]);

  const handleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready}
      className={`w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border border-zoomer-border bg-zoomer-card hover:border-gray-500 transition-all text-sm font-medium text-white ${!ready ? 'opacity-50' : ''}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Войти через Google
    </button>
  );
}

function EmailAuth() {
  const navigate = useNavigate();
  const { emailLogin, emailRegister, verifyEmail, isLoading } = useAuthStore();
  // login | register | verify | reset | confirm
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const goToVerify = (em) => {
    setEmail(em);
    setVerifyCode('');
    setMode('verify');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await emailLogin(email, password);
    if (result.success) {
      toast.success('Вы вошли!');
      navigate(ROUTES.DASHBOARD);
    } else if (result.requiresVerification) {
      toast('Подтвердите email — код отправлен на почту');
      goToVerify(result.email);
    } else {
      toast.error(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Пароль минимум 6 символов');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    const result = await emailRegister(email, password);
    if (result.success && result.requiresVerification) {
      toast.success('Код подтверждения отправлен на почту');
      goToVerify(result.email);
    } else if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const result = await verifyEmail(email, verifyCode);
    if (result.success) {
      toast.success('Email подтверждён!');
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.error);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendCode({ email });
      toast.success('Код отправлен повторно');
    } catch {
      toast.error('Не удалось отправить код');
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await authApi.resetPassword({ email });
      toast.success('Код сброса отправлен на почту');
      setMode('confirm');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка отправки');
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Пароль минимум 6 символов');
      return;
    }
    try {
      await authApi.confirmReset({ email, code: resetCode, new_password: newPassword });
      toast.success('Пароль изменён! Войдите');
      setMode('login');
      setPassword('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Неверный код');
    }
  };

  // --- Verify email screen ---
  if (mode === 'verify') {
    return (
      <form onSubmit={handleVerify} className="space-y-4 text-left">
        <button type="button" onClick={() => setMode('login')}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>
        <div className="text-center">
          <Mail className="w-10 h-10 text-zoomer-neon mx-auto mb-2" />
          <p className="text-white font-semibold mb-1">Подтвердите email</p>
          <p className="text-gray-400 text-sm">Код отправлен на <span className="text-white">{email}</span></p>
        </div>
        <div>
          <input
            type="text" required value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-center text-xl sm:text-2xl tracking-[0.2em] sm:tracking-[0.5em] focus:border-zoomer-neon focus:outline-none transition-colors"
            placeholder="000000" maxLength={6} autoFocus
          />
        </div>
        <Button type="submit" disabled={isLoading || verifyCode.length !== 6}
          className={`w-full text-sm ${isLoading || verifyCode.length !== 6 ? 'opacity-50' : ''}`}>
          {isLoading ? 'Проверяем...' : 'Подтвердить'}
        </Button>
        <button type="button" onClick={handleResend}
          className="w-full text-center text-sm text-gray-500 hover:text-zoomer-neon transition-colors">
          Отправить код повторно
        </button>
      </form>
    );
  }

  // --- Reset password screen ---
  if (mode === 'reset') {
    return (
      <form onSubmit={handleResetRequest} className="space-y-4 text-left">
        <button type="button" onClick={() => setMode('login')}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-sm focus:border-zoomer-neon focus:outline-none transition-colors"
            placeholder="your@email.com" />
        </div>
        <Button type="submit" className="w-full text-sm">Отправить код сброса</Button>
      </form>
    );
  }

  // --- Confirm reset screen ---
  if (mode === 'confirm') {
    return (
      <form onSubmit={handleConfirmReset} className="space-y-4 text-left">
        <button type="button" onClick={() => setMode('reset')}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>
        <p className="text-gray-400 text-sm">Код отправлен на <span className="text-white">{email}</span></p>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Код из письма</label>
          <input type="text" required value={resetCode} onChange={(e) => setResetCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-sm focus:border-zoomer-neon focus:outline-none transition-colors text-center tracking-widest"
            placeholder="000000" maxLength={6} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Новый пароль</label>
          <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-sm focus:border-zoomer-neon focus:outline-none transition-colors"
            placeholder="Минимум 6 символов" />
        </div>
        <Button type="submit" className="w-full text-sm">Сменить пароль</Button>
      </form>
    );
  }

  // --- Login / Register screen ---
  return (
    <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4 text-left">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-sm focus:border-zoomer-neon focus:outline-none transition-colors"
          placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Пароль</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-sm focus:border-zoomer-neon focus:outline-none transition-colors"
          placeholder="Минимум 6 символов" />
      </div>
      {mode === 'register' && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">Подтвердите пароль</label>
          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-sm focus:border-zoomer-neon focus:outline-none transition-colors"
            placeholder="Повторите пароль" />
        </div>
      )}
      <Button type="submit" disabled={isLoading} className={`w-full text-sm ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </Button>
      <div className="flex items-center justify-between text-xs">
        {mode === 'login' ? (
          <>
            <button type="button" onClick={() => setMode('reset')} className="text-gray-500 hover:text-zoomer-neon transition-colors">
              Забыли пароль?
            </button>
            <button type="button" onClick={() => setMode('register')} className="text-zoomer-neon hover:text-zoomer-green transition-colors">
              Создать аккаунт
            </button>
          </>
        ) : (
          <>
            <span />
            <button type="button" onClick={() => setMode('login')} className="text-zoomer-neon hover:text-zoomer-green transition-colors">
              Уже есть аккаунт? Войти
            </button>
          </>
        )}
      </div>

    </form>
  );
}
