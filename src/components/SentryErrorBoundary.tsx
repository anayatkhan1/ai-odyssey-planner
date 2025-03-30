
import React from 'react';
import { ErrorBoundary } from '@sentry/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type ErrorFallbackProps = {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
};

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    resetError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border-2 border-red-100">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          
          <p className="text-gray-600 mb-6">
            We're sorry, but we've encountered an unexpected error. Our team has been notified.
          </p>
          
          <div className="space-y-3 w-full">
            <Button 
              onClick={resetError} 
              className="w-full"
              variant="outline"
            >
              Try again
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              className="w-full"
            >
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

type SentryErrorBoundaryProps = {
  children: React.ReactNode;
};

const SentryErrorBoundary = ({ children }: SentryErrorBoundaryProps) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default SentryErrorBoundary;
