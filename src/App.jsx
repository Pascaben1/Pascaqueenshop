import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { AlertTriangle } from 'lucide-react';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Pages listed here render without the public site header/footer chrome
// (e.g. the admin dashboard gets its own dedicated layout).
const NO_CHROME_PAGES = new Set(['Admin']);

const LayoutWrapper = ({ children, currentPageName }) => {
  if (!Layout || NO_CHROME_PAGES.has(currentPageName)) {
    return <>{children}</>;
  }
  return <Layout currentPageName={currentPageName}>{children}</Layout>;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      }
    />
    {Object.entries(Pages).map(([path, Page]) => (
      <Route
        key={path}
        path={`/${path}`}
        element={
          <LayoutWrapper currentPageName={path}>
            <Page />
          </LayoutWrapper>
        }
      />
    ))}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          {!isSupabaseConfigured && (
            <div className="bg-amber-500 text-amber-950 text-xs sm:text-sm font-medium px-4 py-2 flex items-center justify-center gap-2 text-center">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Backend not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </div>
          )}
          <Router>
            <NavigationTracker />
            <AppRoutes />
          </Router>
          <Toaster />
          <SonnerToaster richColors position="top-center" />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
