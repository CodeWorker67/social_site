import { Link } from 'react-router-dom';
import { Shield, Send, MessageCircle } from 'lucide-react';
import { ROUTES, TELEGRAM, BRAND_NAME, LEGAL } from '@utils/constants';

export default function Footer() {
  return (
    <footer className="bg-zoomer-card border-t border-zoomer-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zoomer-neon-dim to-zoomer-neon flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{BRAND_NAME}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Быстрый и безопасный VPN на базе VLESS Reality. Создан для стабильного интернета.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to={ROUTES.PRICING} className="text-gray-400 hover:text-white text-sm transition-colors">Тарифы</Link></li>
              <li><Link to={ROUTES.SETUP} className="text-gray-400 hover:text-white text-sm transition-colors">Подключение</Link></li>
              <li><Link to={ROUTES.SUPPORT} className="text-gray-400 hover:text-white text-sm transition-colors">Поддержка</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Документы</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={LEGAL.PRIVACY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a
                  href={LEGAL.TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Пользовательское соглашение
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-semibold mb-4">Связаться</h3>
            <div className="flex gap-3">
              <a
                href={TELEGRAM.BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-zoomer-border flex items-center justify-center text-gray-400 hover:text-zoomer-neon hover:border-zoomer-neon transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href={TELEGRAM.SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-zoomer-border flex items-center justify-center text-gray-400 hover:text-zoomer-neon hover:border-zoomer-neon transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zoomer-border text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {BRAND_NAME}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
