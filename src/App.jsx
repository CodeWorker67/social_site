import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import useAuthStore from '@stores/authStore';
import Header from '@components/navigation/Header';
import Footer from '@components/navigation/Footer';
import Button from '@components/ui/Button';
import { ROUTES } from '@utils/constants';
import { captureStampFromUrl } from '@utils/stamp';

import HomePage from '@pages/public/HomePage';

const PricingPage = lazy(() => import('@pages/public/PricingPage'));
const SetupPage = lazy(() => import('@pages/public/SetupPage'));
const SupportPage = lazy(() => import('@pages/public/SupportPage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const TelegramLoginCallbackPage = lazy(() => import('@pages/auth/TelegramLoginCallbackPage'));
const BotLoginPage = lazy(() => import('@pages/auth/BotLoginPage'));
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const CheckoutPage = lazy(() => import('@pages/checkout/CheckoutPage'));
const SuccessPage = lazy(() => import('@pages/checkout/SuccessPage'));
const PrivacyPolicyPage = lazy(() => import('@pages/public/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@pages/public/TermsPage'));
const GiftPage = lazy(() => import('@pages/gift/GiftPage'));

const PageLoader = () => <div className="min-h-screen" />;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return children;
};

function AppShell() {
  const location = useLocation();
  const hideChrome = location.pathname === ROUTES.GIFT || location.pathname.startsWith('/gift');

  return (
    <div className="min-h-screen bg-zoomer-dark bg-grid">
      {!hideChrome && <Header />}
      <main className={hideChrome ? '' : 'pt-16'}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.GIFT} element={<GiftPage />} />
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PRICING} element={<PricingPage />} />
            <Route path={ROUTES.SETUP} element={<SetupPage />} />
            <Route path={ROUTES.SUPPORT} element={<SupportPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route
              path={ROUTES.LOGIN_TELEGRAM_CALLBACK}
              element={<TelegramLoginCallbackPage />}
            />
            <Route path={ROUTES.LOGIN_BOT} element={<BotLoginPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTES.SUCCESS} element={<SuccessPage />} />
            <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
            <Route path={ROUTES.TERMS} element={<TermsPage />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  const { loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
    captureStampFromUrl();
  }, [loadFromStorage]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppShell />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#1A1A2E', color: '#fff', border: '1px solid #2A2A40' },
              success: { style: { background: '#4C1D95' } },
              error: { style: { background: '#7F1D1D' } },
            }}
          />
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl font-bold text-gradient mb-4">404</div>
        <p className="text-gray-400 mb-8">Страница не найдена</p>
        <Link to="/">
          <Button>На главную</Button>
        </Link>
      </div>
    </div>
  );
}

export default App;
