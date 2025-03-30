
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SentryErrorBoundary from "@/components/SentryErrorBoundary";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { setUserScope } from "@/lib/sentry";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppDashboard from "./pages/App";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Travel from "./pages/Travel";
import Profile from "./pages/Profile";
import SentryTest from "./pages/SentryTest";
import Navbar from "./components/Navbar";

// SentryUserMonitor component to track authenticated users
const SentryUserMonitor = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      setUserScope(user.id, user.email);
    } else {
      setUserScope(undefined, undefined);
    }
  }, [user]);
  
  return null;
};

// AnimationWrapper component
const AnimationWrapper = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/app" element={<ProtectedRoute><AppDashboard /></ProtectedRoute>} />
        <Route path="/travel" element={<ProtectedRoute><Travel /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/sentry-test" element={<SentryTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// Create the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrap the application in the proper order of providers
const App = () => {
  return (
    <SentryErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <SentryUserMonitor />
              <Navbar />
              <Toaster />
              <Sonner />
              <AnimationWrapper />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </SentryErrorBoundary>
  );
};

export default App;
