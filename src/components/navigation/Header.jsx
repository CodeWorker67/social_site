import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';
import { ROUTES, LEGAL } from '@utils/constants';
import useAuthStore from '@stores/authStore';
import Button from '@components/ui/Button';

const navLinks = [
  { path: ROUTES.HOME, label: 'Главная' },
  { path: ROUTES.PRICING, label: 'Тарифы' },
  { path: ROUTES.SETUP, label: 'Подключение' },
  { path: ROUTES.SUPPORT, label: 'Поддержка' },
  { href: LEGAL.PRIVACY_URL, label: 'Политика конфиденциальности', external: true },
  { href: LEGAL.TERMS_URL, label: 'Пользовательское соглашение', external: true },
];

const navLinkClass = (active) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
    active
      ? 'text-white bg-white/10'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
  }`;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zoomer-dark/80 backdrop-blur-xl border-b border-zoomer-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zoomer-neon-dim to-zoomer-neon flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Ускоритель <span className="text-gradient">Соцсетей</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navLinkClass(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={navLinkClass(location.pathname === link.path)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary" className="text-sm px-4 py-2">
                  Личный кабинет
                </Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" className="text-sm">Войти</Button>
                </Link>
                <Link to={ROUTES.PRICING}>
                  <Button variant="primary" className="text-sm px-4 py-2">
                    Попробовать бесплатно
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile / tablet toggle (full nav with legal links) */}
          <button
            className="xl:hidden p-3 text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-zoomer-dark border-t border-zoomer-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-2 border-t border-zoomer-border space-y-2 md:hidden">
                {isAuthenticated ? (
                  <Link to={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full text-sm">Личный кабинет</Button>
                  </Link>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" className="w-full text-sm">Войти</Button>
                    </Link>
                    <Link to={ROUTES.PRICING} onClick={() => setMobileOpen(false)}>
                      <Button variant="primary" className="w-full text-sm">Попробовать бесплатно</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
