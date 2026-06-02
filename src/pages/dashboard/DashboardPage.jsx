import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { User, Key, Users, LogOut, Shield, Clock, Copy, Check, ExternalLink, Link2, Send, Mail, Zap, Wifi } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@stores/authStore';
import { userApi, trialApi, authApi } from '@services/api';
import { TELEGRAM, ROUTES, BRAND_NAME, PRO_SUBSCRIPTION_LABEL } from '@utils/constants';
import Button from '@components/ui/Button';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', label: 'Обзор', icon: User },
  { id: 'keys', label: 'Ключи', icon: Key },
  { id: 'referrals', label: 'Рефералка', icon: Users },
  { id: 'account', label: 'Аккаунт', icon: Link2 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuthStore();

  return (
    <>
      <Helmet>
        <title>Личный кабинет — {BRAND_NAME}</title>
      </Helmet>

      <section className="py-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Личный кабинет</h1>
              <p className="text-gray-400 text-sm">
                {user?.first_name || user?.username || 'Пользователь'}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-zoomer-card rounded-xl p-1 border border-zoomer-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-zoomer-neon text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'keys' && <KeysTab />}
          {activeTab === 'referrals' && <ReferralsTab />}
          {activeTab === 'account' && <AccountTab />}
        </div>
      </section>
    </>
  );
}

function OverviewTab() {
  const [sub, setSub] = useState(null);
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trialLoading, setTrialLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      userApi.subscription().then(({ data }) => setSub(data)).catch(() => null),
      userApi.keys().then(({ data }) => setKeys(data)).catch(() => null),
    ]).finally(() => setLoading(false));
  }, []);

  const handleTrial = async () => {
    setTrialLoading(true);
    try {
      const { data } = await trialApi.activate();
      if (data.success) {
        toast.success('Триал активирован! 3 дня бесплатно');
        // Refresh data
        const { data: newSub } = await userApi.subscription();
        setSub(newSub);
        const { data: newKeys } = await userApi.keys();
        setKeys(newKeys);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.error || 'Ошибка активации');
    } finally {
      setTrialLoading(false);
    }
  };

  const hasAnySub = sub?.pro?.active;
  const hasAnyKey = keys?.pro_url;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* CTA — Trial or Setup */}
      {!hasAnySub && (
        <button
          onClick={handleTrial}
          disabled={trialLoading}
          className={`w-full p-5 rounded-2xl bg-gradient-to-r from-zoomer-neon-dim to-zoomer-neon text-white font-semibold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity ${trialLoading ? 'opacity-50' : ''}`}
        >
          <Zap className="w-6 h-6" />
          {trialLoading ? 'Активируем...' : 'Активировать 3 дня бесплатно'}
        </button>
      )}

      {hasAnySub && hasAnyKey && (
        <a href={keys.pro_url}
          target="_blank" rel="noopener noreferrer"
          className="w-full p-5 rounded-2xl bg-gradient-to-r from-zoomer-neon-dim to-zoomer-neon text-white font-semibold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity block text-center"
        >
          <Wifi className="w-6 h-6" />
          Подключить VPN
        </a>
      )}

      {/* Subscription */}
      <div className="max-w-md">
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-zoomer-neon/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-zoomer-neon" />
            </div>
            <div>
              <div className="text-white font-semibold">{PRO_SUBSCRIPTION_LABEL}</div>
              <div className={`text-sm ${sub?.pro?.active ? 'text-zoomer-green' : 'text-red-400'}`}>
                {sub?.pro?.active ? 'Активна' : 'Не активна'}
              </div>
            </div>
          </div>
          {sub?.pro?.expires && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              До: {sub.pro.expires}
            </div>
          )}
          {!sub?.pro?.active && (
            <div className="mt-4">
              <Link to={ROUTES.PRICING}>
                <Button className="w-full text-sm">Купить подписку</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card-dark">
        <h3 className="text-white font-semibold mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to={ROUTES.PRICING}
            className="p-4 rounded-xl bg-white/5 border border-zoomer-border hover:border-zoomer-neon/30 transition-colors text-center">
            <Key className="w-5 h-5 text-zoomer-neon mx-auto mb-2" />
            <div className="text-sm text-gray-300">Продлить подписку</div>
          </Link>
          <a href={TELEGRAM.SUPPORT_URL} target="_blank" rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 border border-zoomer-border hover:border-zoomer-neon/30 transition-colors text-center">
            <Users className="w-5 h-5 text-zoomer-neon mx-auto mb-2" />
            <div className="text-sm text-gray-300">Поддержка</div>
          </a>
        </div>
      </div>
    </div>
  );
}

function KeysTab() {
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    userApi.keys()
      .then(({ data }) => setKeys(data))
      .catch(() => setKeys(null))
      .finally(() => setLoading(false));
  }, []);

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    toast.success('Скопировано!');
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      {keys?.pro_url && (
        <div className="card-dark">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-zoomer-neon" />
              <span className="text-white font-semibold">{PRO_SUBSCRIPTION_LABEL}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyUrl(keys.pro_url, 'pro')}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copied === 'pro' ? <Check className="w-4 h-4 text-zoomer-green" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
              <a href={keys.pro_url} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
          <div className="p-3 bg-zoomer-dark rounded-lg">
            <code className="text-xs text-gray-400 break-all">{keys.pro_url}</code>
          </div>
        </div>
      )}

      {!keys?.pro_url && (
        <div className="card-dark text-center py-12">
          <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">У вас пока нет активных ключей</p>
          <Link to={ROUTES.PRICING}>
            <Button className="text-sm">Оформить подписку</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ReferralsTab() {
  const [ref, setRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    userApi.referrals()
      .then(({ data }) => setRef(data))
      .catch(() => setRef(null))
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    if (ref?.referral_link) {
      navigator.clipboard.writeText(ref.referral_link);
      setCopied(true);
      toast.success('Ссылка скопирована!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-dark text-center">
          <div className="text-3xl font-bold text-white mb-1">{ref?.count || 0}</div>
          <div className="text-gray-400 text-sm">Приглашённых</div>
        </div>
        <div className="card-dark text-center">
          <div className="text-3xl font-bold text-zoomer-green mb-1">+{(ref?.count || 0) * 7}</div>
          <div className="text-gray-400 text-sm">Бонусных дней</div>
        </div>
      </div>

      {/* How it works */}
      <div className="card-dark">
        <h3 className="text-white font-semibold mb-3">Как это работает</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <p>1. Поделитесь реферальной ссылкой с другом</p>
          <p>2. Друг регистрируется и покупает подписку</p>
          <p>3. Вы получаете <span className="text-zoomer-green font-semibold">+7 дней</span> к вашей подписке {PRO_SUBSCRIPTION_LABEL}</p>
        </div>
      </div>

      {/* Referral link + QR */}
      {ref?.referral_link && (
        <div className="card-dark">
          <h3 className="text-white font-semibold mb-3">Ваша ссылка</h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 p-3 bg-zoomer-dark rounded-lg">
              <code className="text-xs text-gray-400 break-all">{ref.referral_link}</code>
            </div>
            <button
              onClick={copyLink}
              className="p-3 rounded-lg bg-zoomer-neon/10 hover:bg-zoomer-neon/20 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-5 h-5 text-zoomer-green" /> : <Copy className="w-5 h-5 text-zoomer-neon" />}
            </button>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG
                value={ref.referral_link}
                size={180}
                bgColor="#ffffff"
                fgColor="#080b0e"
                level="M"
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-3">Покажите QR-код другу для быстрой регистрации</p>
        </div>
      )}
    </div>
  );
}

function AccountTab() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkingCode, setLinkingCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    userApi.account()
      .then(({ data }) => setAccount(data))
      .catch(() => setAccount(null))
      .finally(() => setLoading(false));
  }, []);

  const generateCode = async () => {
    try {
      const { data } = await authApi.generateLinkingCode();
      if (data.linkingCode) {
        setLinkingCode(data.linkingCode);
        toast.success('Код создан! Действует 15 минут');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка генерации кода');
    }
  };

  const linkAccount = async () => {
    if (!inputCode.trim()) return;
    try {
      const { data } = await authApi.link({ code: inputCode.trim() });
      if (data.success) {
        toast.success('Аккаунты связаны! Войдите заново');
        // Clear auth and redirect to login
        localStorage.removeItem('zoomer_token');
        localStorage.removeItem('zoomer_user');
        window.location.href = '/login';
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Неверный или просроченный код');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(linkingCode);
    setCodeCopied(true);
    toast.success('Код скопирован!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Account info */}
      <div className="card-dark">
        <h3 className="text-white font-semibold mb-4">Информация об аккаунте</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zoomer-dark">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Telegram</span>
            </div>
            <span className={`text-sm font-medium ${account?.has_telegram ? 'text-zoomer-green' : 'text-gray-500'}`}>
              {account?.has_telegram ? `ID: ${account.telegram_id}` : 'Не привязан'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-zoomer-dark">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-400">Email</span>
            </div>
            <span className={`text-sm font-medium ${account?.has_email ? 'text-zoomer-green' : 'text-gray-500'}`}>
              {account?.has_email ? account.email : 'Не привязан'}
            </span>
          </div>
        </div>
      </div>

      {/* Linking section */}
      {account?.has_telegram && account?.has_email ? (
        <div className="card-dark">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-5 h-5 text-zoomer-green" />
            <h3 className="text-white font-semibold">Аккаунты связаны</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Telegram и Email привязаны. Ваши подписки из обоих источников отображаются в личном кабинете.
          </p>
        </div>
      ) : (
        <div className="card-dark">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-5 h-5 text-zoomer-neon" />
            <h3 className="text-white font-semibold">Привязка аккаунтов</h3>
          </div>

          {account?.auth_type === 'telegram' && !account?.has_email && (
            <>
              <p className="text-gray-400 text-sm mb-4">
                Сгенерируйте код и отправьте его пользователю с email-аккаунтом для объединения.
              </p>
              {linkingCode ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-zoomer-dark rounded-lg text-center">
                      <code className="text-base sm:text-xl font-mono text-white tracking-wider sm:tracking-widest">{linkingCode}</code>
                    </div>
                    <button onClick={copyCode}
                      className="p-3 rounded-lg bg-zoomer-neon/10 hover:bg-zoomer-neon/20 transition-colors flex-shrink-0">
                      {codeCopied ? <Check className="w-5 h-5 text-zoomer-green" /> : <Copy className="w-5 h-5 text-zoomer-neon" />}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs text-center">Код действителен 15 минут</p>
                </div>
              ) : (
                <Button onClick={generateCode} className="w-full text-sm">
                  Сгенерировать код привязки
                </Button>
              )}
            </>
          )}

          {account?.auth_type === 'email' && !account?.has_telegram && (
            <>
              <p className="text-gray-400 text-sm mb-4">
                Введите код привязки, полученный от Telegram-аккаунта, чтобы объединить аккаунты.
              </p>
              <div className="flex gap-2">
                <input
                  type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 sm:px-4 py-3 rounded-xl bg-zoomer-dark border border-zoomer-border text-white text-center text-base sm:text-lg tracking-wider sm:tracking-widest focus:border-zoomer-neon focus:outline-none transition-colors font-mono"
                  placeholder="ABCD1234" maxLength={8}
                />
                <Button onClick={linkAccount} disabled={inputCode.length < 8} className="px-6 text-sm">
                  Привязать
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* How it works */}
      <div className="card-dark">
        <h3 className="text-white font-semibold mb-3">Как привязать аккаунты</h3>
        <div className="space-y-3 text-sm text-gray-400">
          <p>1. Войдите на сайт через <span className="text-blue-400">Telegram</span> и сгенерируйте код привязки</p>
          <p>2. Войдите на сайт через <span className="text-orange-400">Email</span> и введите полученный код</p>
          <p>3. Аккаунты объединятся — подписки из обоих источников будут доступны</p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="card-dark animate-pulse">
          <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
          <div className="h-3 bg-white/5 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
