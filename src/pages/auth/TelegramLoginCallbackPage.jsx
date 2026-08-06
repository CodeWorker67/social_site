import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '@stores/authStore';
import { ROUTES, BRAND_NAME } from '@utils/constants';

/** Дедуп при React Strict Mode (двойной mount в dev). */
let lastHandledTelegramCallbackSearch = '';

/**
 * Собираем тело для POST /auth/telegram из query после data-auth-url.
 * id и прочие строки не прогоняем через Number(id) — большие Telegram id теряют точность в JS.
 * Пустые optional поля не добавляем (как в ответе Telegram без этих ключей в подписи).
 */
function buildTelegramAuthBody(searchParams) {
  const id = searchParams.get('id');
  const authDate = searchParams.get('auth_date');
  const hash = searchParams.get('hash');
  if (!id || !authDate || !hash) return null;

  const body = {
    id,
    auth_date: authDate,
    hash,
    first_name: searchParams.get('first_name') ?? '',
  };

  for (const key of ['last_name', 'username', 'photo_url']) {
    const v = searchParams.get(key);
    if (v != null && v !== '') body[key] = v;
  }

  return body;
}

export default function TelegramLoginCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const telegramLogin = useAuthStore((s) => s.telegramLogin);

  useEffect(() => {
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    if (!qs) {
      toast.error('Нет данных входа');
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    const body = buildTelegramAuthBody(searchParams);
    if (!body) {
      toast.error('Неверные данные входа');
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    if (lastHandledTelegramCallbackSearch === qs) return;
    lastHandledTelegramCallbackSearch = qs;

    (async () => {
      const result = await telegramLogin(body);
      if (result.success) {
        toast.success('Вы вошли через бот!');
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        lastHandledTelegramCallbackSearch = '';
        toast.error(result.error || 'Ошибка авторизации');
        navigate(ROUTES.LOGIN, { replace: true });
      }
    })();
  }, [navigate, searchParams, telegramLogin]);

  return (
    <>
      <Helmet>
        <title>Вход через бот — {BRAND_NAME}</title>
      </Helmet>
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-sm text-gray-400">Завершаем вход через бот…</p>
      </div>
    </>
  );
}
