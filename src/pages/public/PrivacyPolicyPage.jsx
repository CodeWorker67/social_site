import { Helmet } from 'react-helmet-async';
import { BRAND_NAME, TELEGRAM } from '@utils/constants';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet><title>Политика конфиденциальности — {BRAND_NAME}</title></Helmet>
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Политика конфиденциальности</h1>
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
            <p>Дата вступления в силу: 01 апреля 2026 г.</p>

            <h2 className="text-xl font-semibold text-white">1. Какие данные мы собираем</h2>
            <p>При использовании сервиса {BRAND_NAME} мы можем собирать следующую информацию:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ID аккаунта в боте (для идентификации учётной записи)</li>
              <li>Дата регистрации и дата окончания подписки</li>
              <li>Информация о платежах (сумма, метод оплаты, статус)</li>
            </ul>

            <h2 className="text-xl font-semibold text-white">2. Что мы НЕ собираем</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Историю посещённых сайтов</li>
              <li>Содержание трафика</li>
              <li>DNS-запросы</li>
              <li>IP-адреса пользователей</li>
            </ul>
            <p>Мы придерживаемся политики <strong>no-logs</strong> — не ведём журналов активности.</p>

            <h2 className="text-xl font-semibold text-white">3. Как мы используем данные</h2>
            <p>Собранные данные используются исключительно для предоставления услуги VPN, обработки платежей и технической поддержки.</p>

            <h2 className="text-xl font-semibold text-white">4. Передача данных третьим лицам</h2>
            <p>Мы не продаём и не передаём ваши данные третьим лицам, кроме случаев, предусмотренных законодательством.</p>

            <h2 className="text-xl font-semibold text-white">5. Контакты</h2>
            <p>По вопросам конфиденциальности: <a href={TELEGRAM.SUPPORT_URL} className="text-zoomer-neon hover:underline">@goSocialsupp</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
