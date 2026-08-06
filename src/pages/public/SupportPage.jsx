import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageCircle, Send, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { TELEGRAM, BRAND_NAME } from '@utils/constants';
import Button from '@components/ui/Button';

const faqs = [
  {
    q: 'Как подключить VPN?',
    a: 'Откройте бот, нажмите "Подключить VPN", перейдите в личный кабинет и следуйте инструкции. Подробнее — на странице "Подключение".',
  },
  {
    q: 'На скольких устройствах можно использовать?',
    a: 'Тариф PRO — до 5 устройств одновременно.',
  },
  {
    q: 'Как активировать бесплатный период?',
    a: 'Откройте бот и нажмите "Попробовать бесплатно". Получите 3 дня без оплаты и без привязки карты.',
  },
  {
    q: 'Какие способы оплаты доступны?',
    a: 'СБП, банковские карты РФ, криптовалюта (CryptoBot), Stars.',
  },
  {
    q: 'VPN не подключается. Что делать?',
    a: 'Попробуйте другой сервер или другое приложение (Happ / V2rayTun). Если не помогло — напишите в поддержку.',
  },
  {
    q: 'Что такое реферальная программа?',
    a: 'Пригласите друга по вашей ссылке. Когда он оплатит первую подписку — вы получите +7 дней бесплатно.',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <Helmet>
        <title>Поддержка — {BRAND_NAME}</title>
      </Helmet>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Поддержка</span>
            </h1>
            <p className="text-gray-400">
              Ответы на частые вопросы и связь с командой.
            </p>
          </motion.div>

          {/* Contact buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <a
              href={TELEGRAM.SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-dark flex items-center gap-4 hover:border-zoomer-neon/20"
            >
              <div className="w-12 h-12 rounded-xl bg-zoomer-neon/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-zoomer-neon" />
              </div>
              <div>
                <div className="text-white font-semibold">Поддержка</div>
                <div className="text-gray-400 text-sm">Написать в поддержку</div>
              </div>
            </a>
            <a
              href={TELEGRAM.BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-dark flex items-center gap-4 hover:border-zoomer-neon/20"
            >
              <div className="w-12 h-12 rounded-xl bg-zoomer-blue/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-zoomer-blue" />
              </div>
              <div>
                <div className="text-white font-semibold">Бот</div>
                <div className="text-gray-400 text-sm">Управление подпиской</div>
              </div>
            </a>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-zoomer-neon" />
              Частые вопросы
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-zoomer-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium text-sm">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openIndex === i && (
                    <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
