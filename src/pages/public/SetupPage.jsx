import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, Apple, ChevronRight, Download, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '@components/ui/Button';
import { TELEGRAM, BRAND_NAME } from '@utils/constants';

const platforms = [
  { id: 'android', label: 'Android', icon: Smartphone, color: 'text-purple-400' },
  { id: 'ios',     label: 'iOS',     icon: Apple, color: 'text-gray-300' },
  { id: 'windows', label: 'Windows', icon: Monitor, color: 'text-blue-400' },
  { id: 'macos',   label: 'macOS',   icon: Apple, color: 'text-gray-300' },
];

const apps = {
  android: [
    { id: 'happ', name: 'Happ', url: 'https://play.google.com/store/apps/details?id=com.happproxy', recommended: true },
    { id: 'v2raytun', name: 'V2rayTun', url: 'https://play.google.com/store/apps/details?id=com.v2raytun.android', recommended: false },
  ],
  ios: [
    { id: 'happ', name: 'Happ', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973', recommended: true },
    { id: 'v2raytun', name: 'V2rayTun', url: 'https://apps.apple.com/app/v2raytun/id6476628951', recommended: false },
  ],
  windows: [
    { id: 'happ', name: 'Happ', url: 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe', recommended: true },
    { id: 'v2raytun', name: 'V2rayTun', url: 'https://v2raytun.com/', recommended: false },
  ],
  macos: [
    { id: 'happ', name: 'Happ', url: 'https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973', recommended: true },
    { id: 'v2raytun', name: 'V2rayTun', url: 'https://apps.apple.com/ru/app/v2raytun/id6476628951', recommended: false },
  ],
};

const stepsHapp = [
  'Скачайте приложение Happ по ссылке ниже',
  'Откройте Telegram-бот и нажмите "Подключить VPN"',
  'Перейдите в личный кабинет по ссылке из бота',
  'В приложении Happ нажмите кнопку "Из буфера" — ключ загрузится',
  'Выберите сервер и нажмите большую кнопку Вкл.',
  'VPN включён! Приятного использования',
];

const stepsV2ray = [
  'Скачайте приложение V2rayTun по ссылке ниже',
  'Откройте Telegram-бот и нажмите "Подключить VPN"',
  'Перейдите в личный кабинет по ссылке из бота',
  'В приложении нажмите "+" и выберите "Импорт из буфера обмена"',
  'Серверы загрузятся автоматически. Выберите любой.',
  'Нажмите кнопку Вкл. — VPN подключён!',
];

export default function SetupPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const currentApps = selectedPlatform ? apps[selectedPlatform] : [];
  const currentSteps = selectedApp === 'happ' ? stepsHapp : stepsV2ray;

  return (
    <>
      <Helmet>
        <title>Подключение — {BRAND_NAME}</title>
        <meta name="description" content={`Инструкция по подключению ${BRAND_NAME} на Android, iOS, Windows и macOS.`} />
      </Helmet>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient">Подключение</span> VPN
            </h1>
            <p className="text-gray-400 text-lg">
              Выберите устройство и следуйте инструкции. Это займёт 2 минуты.
            </p>
          </motion.div>

          {/* Step 1: Platform */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-zoomer-neon/20 text-zoomer-neon text-sm flex items-center justify-center font-bold">1</span>
              Выберите устройство
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlatform(p.id); setSelectedApp(null); }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    selectedPlatform === p.id
                      ? 'border-zoomer-neon bg-zoomer-neon/10'
                      : 'border-zoomer-border bg-zoomer-card hover:border-zoomer-neon/30'
                  }`}
                >
                  <p.icon className={`w-8 h-8 mx-auto mb-2 ${p.color}`} />
                  <div className="text-sm font-medium text-white">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: App */}
          <AnimatePresence mode="wait">
            {selectedPlatform && (
              <motion.div
                key="apps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-zoomer-neon/20 text-zoomer-neon text-sm flex items-center justify-center font-bold">2</span>
                  Выберите приложение
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedApp === app.id
                          ? 'border-zoomer-neon bg-zoomer-neon/10'
                          : 'border-zoomer-border bg-zoomer-card hover:border-zoomer-neon/30'
                      }`}
                    >
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {app.name}
                          {app.recommended && (
                            <span className="text-xs bg-zoomer-green/10 text-zoomer-green px-2 py-0.5 rounded-full">Рекомендуем</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Instructions */}
          <AnimatePresence mode="wait">
            {selectedApp && (
              <motion.div
                key="steps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-zoomer-neon/20 text-zoomer-neon text-sm flex items-center justify-center font-bold">3</span>
                  Подключение
                </h2>

                {/* Download button */}
                <a
                  href={currentApps.find(a => a.id === selectedApp)?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-zoomer-neon/10 border border-zoomer-neon/30 mb-6 hover:bg-zoomer-neon/20 transition-colors"
                >
                  <Download className="w-5 h-5 text-zoomer-neon" />
                  <span className="text-white font-medium">
                    Скачать {currentApps.find(a => a.id === selectedApp)?.name}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
                </a>

                {/* Steps */}
                <div className="space-y-4">
                  {currentSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-zoomer-card border border-zoomer-border flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-gray-400">{i + 1}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 glass-card text-center">
                  <p className="text-gray-400 text-sm mb-4">
                    Ещё нет подписки? Активируй 3 дня бесплатно в боте!
                  </p>
                  <a href={TELEGRAM.BOT_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="px-6 py-3">Открыть бот</Button>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
