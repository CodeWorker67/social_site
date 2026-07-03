import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Gift, Shield, Smartphone, Clock, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { giftApi } from '@services/api';
import Button from '@components/ui/Button';
import { BRAND_NAME } from '@utils/constants';

/** Дедуп при React Strict Mode (двойной mount в dev). */
let lastHandledGiftSearch = '';

function resolveGiftId(searchParams) {
  const byId = searchParams.get('id')?.trim();
  if (byId) return byId;
  const keys = [...searchParams.keys()];
  if (keys.length === 1 && !searchParams.get(keys[0])) {
    return keys[0];
  }
  return searchParams.toString().split('=')[0]?.trim() || '';
}

function deviceLabel(count) {
  const n = Number(count);
  if (n === 1) return '1 устройство';
  if (n >= 2 && n <= 4) return `${n} устройства`;
  return `${n} устройств`;
}

function GiftInfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zoomer-border/60 bg-white/[0.03] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zoomer-neon/10">
        <Icon className="h-5 w-5 text-zoomer-neon" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`mt-0.5 break-all text-base font-medium ${highlight ? 'text-zoomer-neon' : 'text-white'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function GiftPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState({ phase: 'loading' });

  useEffect(() => {
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    const giftId = resolveGiftId(searchParams);

    if (!giftId) {
      setState({ phase: 'error', message: 'Не указан код подарка. Проверьте ссылку.' });
      return;
    }

    if (lastHandledGiftSearch === qs) return;
    lastHandledGiftSearch = qs;

    (async () => {
      try {
        const { data } = await giftApi.activateWeb(giftId);
        if (data.status === 'success') {
          setState({ phase: 'success', data });
        } else {
          setState({ phase: 'error', message: data.message || 'Не удалось активировать подарок.' });
        }
      } catch (err) {
        lastHandledGiftSearch = '';
        const status = err.response?.status;
        const body = err.response?.data;

        if (status === 404 || body?.status === 'not_found') {
          setState({ phase: 'error', message: 'Подарок не найден. Проверьте ссылку.' });
        } else if (status === 409 || body?.status === 'already_activated') {
          setState({ phase: 'already', message: 'Подарок уже активирован.' });
        } else {
          setState({
            phase: 'error',
            message: body?.message || body?.detail || 'Ошибка активации. Попробуйте позже или обратитесь в поддержку.',
          });
        }
      }
    })();
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-zoomer-dark bg-grid bg-radial-glow">
      <Helmet>
        <title>Активация подарка — {BRAND_NAME}</title>
      </Helmet>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zoomer-neon/20 bg-zoomer-neon/10">
              <Gift className="h-8 w-8 text-zoomer-neon" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">{BRAND_NAME}</h1>
            <p className="mt-2 text-gray-400">Активация подарочной подписки</p>
          </div>

          {state.phase === 'loading' && (
            <div className="card-dark flex flex-col items-center py-12 text-center">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-zoomer-neon" />
              <p className="text-gray-300">Активируем подарок…</p>
            </div>
          )}

          {state.phase === 'success' && (
            <div className="card-dark space-y-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-zoomer-neon/15">
                  <Shield className="h-7 w-7 text-zoomer-neon" />
                </div>
                <h2 className="text-2xl font-bold text-white">Вам активирована подписка</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Перейдите в личный кабинет и следуйте инструкции по подключению к VPN
                </p>
              </div>

              <GiftInfoRow
                icon={ExternalLink}
                label="URL подписки"
                value={state.data.subscription_url || '—'}
                highlight
              />
              <GiftInfoRow icon={Clock} label="Длительность" value={state.data.duration_label} />
              <GiftInfoRow
                icon={Smartphone}
                label="Кол-во устройств"
                value={deviceLabel(state.data.devices)}
              />
              {state.data.expires && state.data.expires !== '-' && (
                <GiftInfoRow icon={Clock} label="Активна до" value={state.data.expires} />
              )}

              <a
                href={state.data.cabinet_url || state.data.subscription_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="flex w-full items-center justify-center gap-2">
                  Перейти в личный кабинет
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>

              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm leading-relaxed text-amber-100/90">
                  <strong className="font-semibold">Внимание:</strong> эта страница открывается один раз!
                  Сохраните URL подписки, чтобы всегда оставаться на связи.
                </p>
              </div>
            </div>
          )}

          {state.phase === 'already' && (
            <div className="card-dark text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                <Gift className="h-7 w-7 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Подарок уже активирован</h2>
              <p className="mt-3 text-gray-400">
                Этот подарок был использован ранее. Если вы сохраняли ссылку на подписку — откройте её напрямую.
              </p>
            </div>
          )}

          {state.phase === 'error' && (
            <div className="card-dark text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Не удалось активировать</h2>
              <p className="mt-3 text-gray-400">{state.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
