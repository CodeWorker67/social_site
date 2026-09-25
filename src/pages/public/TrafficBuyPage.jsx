import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Zap } from 'lucide-react';
import {
  BRAND_NAME,
  PAYMENT_METHODS,
  PRO_SUBSCRIPTION_LABEL,
  ROUTES,
  TRAFFIC_PACKAGES,
} from '@utils/constants';
import { configApi, paymentApi } from '@services/api';
import useAuthStore from '@stores/authStore';
import Button from '@components/ui/Button';
import toast from 'react-hot-toast';

export default function TrafficBuyPage() {
  const [packages, setPackages] = useState(TRAFFIC_PACKAGES);
  const [selectedGb, setSelectedGb] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    configApi
      .trafficPackages()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data.map((p) => ({ gb: p.gb, price: p.price })));
        }
      })
      .catch(() => {});
  }, []);

  const selectedPackage = packages.find((p) => p.gb === selectedGb);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast('Войдите, чтобы оплатить', { icon: '🔑' });
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!selectedGb || !selectedMethod) return;
    setIsProcessing(true);
    try {
      const { data } = await paymentApi.createTrafficPayment({
        gb: selectedGb,
        method: selectedMethod,
      });
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error('Не удалось создать платёж');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Ошибка при создании платежа';
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Докупка трафика — {BRAND_NAME}</title>
        <meta
          name="description"
          content="Дополнительные пакеты трафика для мобильного доступа к VPN. Оплата СБП или картой РФ."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Докупка <span className="text-gradient">трафика</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Пакеты для сервера с надёжным доступом на мобильном интернете. Нужна активная подписка{' '}
              {PRO_SUBSCRIPTION_LABEL}.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.gb}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.04 }}
                onClick={() => setSelectedGb(pkg.gb)}
                className={`relative card-dark cursor-pointer text-center ${
                  selectedGb === pkg.gb ? 'border-zoomer-neon ring-2 ring-zoomer-neon/50' : ''
                }`}
              >
                <div className="text-gray-400 text-sm mb-3 mt-2">Пакет</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {pkg.gb}
                  <span className="text-base text-gray-400 ml-1">GB</span>
                </div>
                <div className="text-2xl font-semibold text-zoomer-neon mb-4">
                  {pkg.price}
                  <span className="text-sm text-gray-400 ml-1">руб</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-400 text-left px-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zoomer-green flex-shrink-0" />
                    Добавляется к лимиту сервера
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>

          {selectedGb && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <h3 className="text-lg font-semibold text-white text-center mb-4">Способ оплаты</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {PAYMENT_METHODS.map((method) => {
                  const icons = { Zap, CreditCard };
                  const Icon = icons[method.icon] || Zap;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        selectedMethod === method.id
                          ? 'border-zoomer-neon bg-zoomer-neon/10 text-white'
                          : 'border-zoomer-border bg-zoomer-card text-gray-400 hover:border-zoomer-neon/30'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-2" />
                      <div className="text-xs font-medium">{method.label}</div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={handlePurchase}
                disabled={!selectedMethod || isProcessing}
                className={`w-full text-base sm:text-lg py-3 sm:py-4 ${
                  !selectedMethod || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing
                  ? 'Создаём платёж...'
                  : `Оплатить ${selectedPackage?.price ?? ''} руб`}
              </Button>

              <p className="mt-4 text-center text-sm text-gray-500 leading-relaxed">
                После успешной оплаты обновите список серверов в приложении через 1 минуту — новый сервер
                появится.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
