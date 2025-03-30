
import * as Sentry from '@sentry/react';

// Initialize Sentry
export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // Adjust this value in production
    tracesSampleRate: 1.0,
    
    // Capture errors in development mode only if DSN is provided
    enabled: true, // Enable in all environments to test
    
    // Customize behavior based on environment
    environment: import.meta.env.MODE,
    
    // Don't send PII data
    sendDefaultPii: false,
    
    // Add debug mode to see what's happening
    debug: true,
    
    // Use more comprehensive integrations
    integrations: [
      new Sentry.Replay({
        // Additional SDK configuration goes in here, for example:
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Adjust this based on your needs
    beforeSend(event) {
      console.log('Sending event to Sentry:', event);
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
  
  // Log confirmation to console for debugging
  console.log('Error reported to Sentry with context:', context);
};

// Create a user scope for better tracking
export const setUserScope = (userId?: string, email?: string) => {
  if (userId || email) {
    Sentry.setUser({
      id: userId,
      email: email,
    });
    console.log('Sentry user scope set:', { userId, email });
  } else {
    // Clear the user from the scope to stop tracking them
    Sentry.setUser(null);
    console.log('Sentry user scope cleared');
  }
};

// Export Sentry directly for advanced use cases
export { Sentry };
