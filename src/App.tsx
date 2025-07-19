import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from '@/context/AuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

// Layouts
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import TemplatesPage from './pages/TemplatesPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ResumePage from './pages/dashboard/ResumePage';
import ResumeBuilderPage from './pages/dashboard/ResumeBuilderPage';
import CoverLetterPage from './pages/dashboard/CoverLetterPage';
import CoverLetterBuilderPage from './pages/dashboard/CoverLetterBuilderPage';
import PortfolioPage from './pages/dashboard/PortfolioPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster position="top-center" />
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <Routes>
                {/* Marketing Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                
                {/* Auth Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* Dashboard Pages */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="resume" element={<ResumePage />} />
                  <Route path="resume/:id" element={<ResumeBuilderPage />} />
                  <Route path="resume/new" element={<ResumeBuilderPage />} />
                  <Route path="cover-letter" element={<CoverLetterPage />} />
                  <Route path="cover-letter/:id" element={<CoverLetterBuilderPage />} />
                  <Route path="cover-letter/new" element={<CoverLetterBuilderPage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
                
                {/* Public Portfolio */}
                <Route path="/:username" element={<PublicPortfolioPage />} />
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;