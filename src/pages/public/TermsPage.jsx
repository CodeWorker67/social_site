import { Helmet } from 'react-helmet-async';
import { BRAND_NAME, TELEGRAM } from '@utils/constants';

export default function TermsPage() {
  return (
    <>
      <Helmet><title>Пользовательское соглашение — {BRAND_NAME}</title></Helmet>
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Пользовательское соглашение</h1>
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
            <p>Дата вступления в силу: 01 апреля 2026 г.</p>

            <h2 className="text-xl font-semibold text-white">1. Общие положения</h2>
            <p>Настоящее соглашение регулирует использование VPN-сервиса {BRAND_NAME}. Используя сервис, вы принимаете условия данного соглашения.</p>

            <h2 className="text-xl font-semibold text-white">2. Описание сервиса</h2>
            <p>{BRAND_NAME} предоставляет услугу VPN-подключения с использованием протокола VLESS Reality. Сервис обеспечивает шифрование трафика и стабильное защищённое соединение.</p>

            <h2 className="text-xl font-semibold text-white">3. Правила использования</h2>
            <p>Запрещается использовать сервис для:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Распространения вредоносного ПО</li>
              <li>Рассылки спама</li>
              <li>Атак на другие серверы и сети</li>
              <li>Любой деятельности, нарушающей законодательство</li>
            </ul>

            <h2 className="text-xl font-semibold text-white">4. Оплата и возврат</h2>
            <p>Оплата производится через доступные способы оплаты. Бесплатный пробный период (3 дня) предоставляется однократно. Возврат средств рассматривается индивидуально через поддержку.</p>

            <h2 className="text-xl font-semibold text-white">5. Ограничение ответственности</h2>
            <p>Сервис предоставляется «как есть». Мы не гарантируем бесперебойную работу и не несём ответственности за убытки, связанные с использованием VPN.</p>

            <h2 className="text-xl font-semibold text-white">6. Контакты</h2>
            <p>Поддержка: <a href={TELEGRAM.SUPPORT_URL} className="text-zoomer-neon hover:underline">@goSocialsupp</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
