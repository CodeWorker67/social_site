import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES, TARIFFS, TELEGRAM } from '@utils/constants';
import Button from '@components/ui/Button';

const displayTariffs = TARIFFS.filter(t => t.type === 'pro' && !t.promo).slice(0, 3);

export default function PlansPreviewSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Простые <span className="text-gradient">тарифы</span>
          </h2>
          <p className="text-gray-400">
            Без скрытых платежей. Безлимитный трафик. До 5 устройств.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {displayTariffs.map((tariff, index) => (
            <motion.div
              key={tariff.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative card-dark text-center ${
                tariff.popular ? 'border-zoomer-neon ring-1 ring-zoomer-neon/50' : ''
              }`}
            >
              {tariff.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-zoomer-neon-dim to-zoomer-neon rounded-full text-xs font-semibold text-white flex items-center gap-1">
                  <Star className="w-3 h-3" /> Популярный
                </div>
              )}

              <div className="text-gray-400 text-sm mb-2">{tariff.label}</div>
              <div className="text-4xl font-bold text-white mb-1">
                {tariff.price} <span className="text-lg text-gray-400">руб</span>
              </div>
              <div className="text-gray-500 text-xs mb-6">
                ~{Math.round(tariff.price / tariff.days)} руб/день
              </div>

              <ul className="space-y-3 text-sm text-gray-300 mb-6 text-left">
                {['Безлимитный трафик', `До ${tariff.devices} устройств`, '26 серверов', 'VLESS Reality'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-zoomer-green flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={ROUTES.PRICING}>
                <Button
                  variant={tariff.popular ? 'primary' : 'secondary'}
                  className="w-full text-sm"
                >
                  Выбрать
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Free trial CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to={ROUTES.PRICING}>
            <Button className="px-8 py-4 text-lg flex items-center gap-2 mx-auto">
              <Zap className="w-5 h-5" />
              3 дня бесплатно
            </Button>
          </Link>
          <p className="text-gray-500 text-sm mt-3">Без карты. Активация в Telegram-боте.</p>
        </motion.div>
      </div>
    </section>
  );
}
