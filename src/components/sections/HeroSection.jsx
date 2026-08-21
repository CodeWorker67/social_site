import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES, TELEGRAM } from '@utils/constants';
import Button from '@components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zoomer-neon/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zoomer-blue/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zoomer-neon/10 border border-zoomer-neon/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-zoomer-green animate-pulse" />
            <span className="text-sm text-gray-300">150 000+ пользователей</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Быстрый VPN
            <br />
            <span className="text-gradient">на высокой скорости</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            VLESS Reality протокол. До 10 Гбит/с. Серверы в 4 странах.
            Стабильное соединение для работы, учёбы и отдыха.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 mb-16"
          >
            <div className="inline-flex w-full max-w-md flex-col items-stretch gap-4 sm:w-auto">
              <a href={TELEGRAM.BOT_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2">
                  Перейти в Telegram бот
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to={ROUTES.PRICING} className="block">
                <Button className="w-full text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2">
                  Попробовать 3 дня бесплатно
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <Link to={ROUTES.PRICING}>
              <Button variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Тарифы от 99 руб
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Users, value: '150K+', label: 'Пользователей' },
              { icon: Shield, value: '26', label: 'Серверов' },
              { icon: Zap, value: '10 Гбит/с', label: 'Скорость' },
              { icon: Play, value: '99.9%', label: 'Аптайм' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 text-zoomer-neon mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
