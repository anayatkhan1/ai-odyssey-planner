
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/browser';

// Initialize Sentry
// Replace the DSN with your actual Sentry DSN
export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    integrations: [new BrowserTracing()],
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // Adjust this value in production
    tracesSampleRate: 1.0,
    
    // Capture errors in development mode only if DSN is provided
    enabled: import.meta.env.PROD || !!import.meta.env.VITE_SENTRY_DSN,
    
    // Customize behavior based on environment
    environment: import.meta.env.MODE,
    
    // Don't send PII data
    sendDefaultPii: false,
    
    // Adjust this based on your needs
    beforeSend(event) {
      // Don't send errors if we're in dev and no DSN is configured
      if (!import.meta.env.PROD && !import.meta.env.VITE_SENTRY_DSN) {
        return null;
      }
      
      return event;
    },
  });
};

// Utility function to log errors to Sentry
export const logError = (error: unknown, context?: Record<string, any>) => {
  console.error('Error caught:', error);
  
  Sentry.captureException(error, {
    extra: context,
  });
};

// Create a user scope for better tracking
export const setUserScope = (userId?: string, email?: string) => {
  if (userId || email) {
    Sentry.setUser({
      id: userId,
      email: email,
    });
  } else {
    // Clear the user from the scope to stop tracking them
    Sentry.setUser(null);
  }
};

// Export Sentry directly for advanced use cases
export { Sentry };
