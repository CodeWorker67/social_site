import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '@stores/authStore';
import { ROUTES, BRAND_NAME } from '@utils/constants';

/** Дедуп при React Strict Mode (двойной mount в dev). */
let lastHandledBotLoginSearch = '';

export default function BotLoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const botLogin = useAuthStore((s) => s.botLogin);

  useEffect(() => {
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    const token = searchParams.get('token')?.trim();

    if (!token) {
      toast.error('Нет ссылки для входа. Откройте сайт из бота.');
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    if (lastHandledBotLoginSearch === qs) return;
    lastHandledBotLoginSearch = qs;

    (async () => {
      const result = await botLogin(token);
      if (result.success) {
        toast.success('Вы вошли через бот!');
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        lastHandledBotLoginSearch = '';
        toast.error(result.error || 'Ссылка устарела. Запросите новую в боте.');
        navigate(ROUTES.LOGIN, { replace: true });
      }
    })();
  }, [navigate, searchParams, botLogin]);

  return (
    <>
      <Helmet>
        <title>Вход с бота — {BRAND_NAME}</title>
      </Helmet>
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-sm text-gray-400">Выполняем вход…</p>
      </div>
    </>
  );
}
