export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  SETUP: '/setup',
  SUPPORT: '/support',
  LOGIN: '/login',
  /** Редирект Telegram Login Widget (data-auth-url), без popup postMessage */
  LOGIN_TELEGRAM_CALLBACK: '/login/telegram-callback',
  /** Одноразовая ссылка из Telegram-бота (?token=…) */
  LOGIN_BOT: '/auth/bot',
  DASHBOARD: '/dashboard',
  CHECKOUT: '/checkout',
  SUCCESS: '/success',
  PRIVACY_POLICY: '/privacy',
  TERMS: '/terms',
  GIFT: '/gift',
};

export const BRAND_NAME = 'Ускоритель Соцсетей';

export const TELEGRAM = {
  BOT_URL: 'https://t.me/fastmobilevpnbot',
  BOT_NAME: import.meta.env.VITE_TELEGRAM_BOT_NAME || 'fastmobilevpnbot',
  SUPPORT_URL: 'https://t.me/goSocialsupp',
  CHANNEL_URL: 'https://t.me/zoomerskydostup',
};

export const PRO_SUBSCRIPTION_LABEL = 'Подписка PRO - соцсети';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const TARIFFS = [
  { id: '7',   label: '7 дней',   price: 99,   days: 7,   devices: 5, type: 'pro' },
  { id: '30',  label: '30 дней',  price: 199,  days: 30,  devices: 5, type: 'pro' },
  { id: '90',  label: '90 дней (выгода −10%)',  price: 539,  days: 90,  devices: 5, type: 'pro', popular: true },
  { id: '180', label: '180 дней (выгода −15%)', price: 999,  days: 180, devices: 5, type: 'pro' },
  { id: '365', label: '365 дней (выгода −30%)', price: 1699, days: 365, devices: 5, type: 'pro' },
];

export const PAYMENT_METHODS = [
  { id: 'sbp',    label: 'СБП',        icon: 'Zap' },
  { id: 'card',   label: 'Карта РФ',   icon: 'CreditCard' },
];

export const FEATURES = [
  {
    icon: 'Shield',
    title: 'VLESS Reality',
    description: 'Самый защищённый протокол. Трафик неотличим от обычного HTTPS.',
  },
  {
    icon: 'Zap',
    title: 'До 10 Гбит/с',
    description: 'Серверы на быстрых каналах. YouTube, стримы, игры без тормозов.',
  },
  {
    icon: 'Globe',
    title: '4 страны',
    description: 'Германия, Нидерланды, Польша, США. Выбирай ближайший сервер.',
  },
  {
    icon: 'Smartphone',
    title: 'До 5 устройств',
    description: 'Одна подписка на телефон, ноутбук, планшет и другие устройства одновременно.',
  },
  {
    icon: 'Infinity',
    title: 'Без лимитов',
    description: 'Никаких ограничений по трафику и скорости. Безлимит.',
  },
  {
    icon: 'Clock',
    title: '24/7 поддержка',
    description: 'Telegram-бот и живая поддержка. Ответим быстро.',
  },
];
