
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { logError, Sentry } from '@/lib/sentry';
import { useToast } from '@/hooks/use-toast';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';

const SentryTest = () => {
  const [loading, setLoading] = useState(false);
  const [sentryStatus, setSentryStatus] = useState<'unknown' | 'configured' | 'error'>('unknown');
  const { toast } = useToast();

  // Check if Sentry is properly configured on component mount
  useEffect(() => {
    const checkSentryConfig = () => {
      try {
        if (import.meta.env.VITE_SENTRY_DSN) {
          console.log('Sentry DSN detected:', import.meta.env.VITE_SENTRY_DSN);
          setSentryStatus('configured');
          
          // Add a test breadcrumb for verification
          Sentry.addBreadcrumb({
            category: 'page-view',
            message: 'User visited Sentry Test page',
            level: 'info',
          });
          
          toast({
            title: 'Sentry Connected',
            description: 'Sentry is properly configured with a valid DSN',
            variant: 'success',
          });
        } else {
          console.error('No Sentry DSN detected');
          setSentryStatus('error');
          toast({
            title: 'Sentry Configuration Error',
            description: 'No Sentry DSN found in environment variables',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error checking Sentry configuration:', error);
        setSentryStatus('error');
      }
    };
    
    checkSentryConfig();
  }, [toast]);

  const triggerError = () => {
    try {
      // Intentionally throw an error
      throw new Error('This is a test error for Sentry');
    } catch (error) {
      // Log the error to Sentry
      logError(error, { source: 'SentryTest', action: 'triggerError', timestamp: new Date().toISOString() });
      
      // Notify the user
      toast({
        title: 'Error Logged',
        description: 'A test error has been logged to Sentry',
        variant: 'info',
      });
    }
  };

  const triggerUnhandledError = () => {
    // This will be caught by the error boundary
    throw new Error('This is an unhandled test error for Sentry');
  };

  const triggerAsyncError = async () => {
    setLoading(true);
    
    try {
      // Add a breadcrumb before the error
      Sentry.addBreadcrumb({
        category: 'async-operation',
        message: 'Starting async operation',
        level: 'info',
      });
      
      // Simulate an API call that fails
      await new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Async operation failed')), 1000)
      );
    } catch (error) {
      // Add operation details to the error
      logError(error, { 
        source: 'SentryTest', 
        action: 'triggerAsyncError', 
        timestamp: new Date().toISOString(),
        networkStatus: 'failed',
      });
      
      toast({
        title: 'Async Error Logged',
        description: 'An async test error has been logged to Sentry',
        variant: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const addBreadcrumb = () => {
    // Add a breadcrumb to track user actions
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: 'User clicked the Add Breadcrumb button',
      level: 'info',
      data: {
        buttonId: 'add-breadcrumb',
        timestamp: new Date().toISOString(),
      }
    });
    
    toast({
      title: 'Breadcrumb Added',
      description: 'A breadcrumb has been added to Sentry tracking',
      variant: 'success',
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-3xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-3.5 w-3.5 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sentry Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="text-3xl font-bold mb-6">Sentry Test Page</h1>
        
        {/* Sentry Status Card */}
        <Card className="p-6 mb-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-4">
            {sentryStatus === 'configured' ? (
              <CheckCircle className="text-green-500 h-6 w-6" />
            ) : sentryStatus === 'error' ? (
              <AlertTriangle className="text-red-500 h-6 w-6" />
            ) : (
              <AlertCircle className="text-yellow-500 h-6 w-6" />
            )}
            
            <h2 className="text-xl font-semibold">
              Sentry Status: {sentryStatus === 'configured' ? 'Connected' : sentryStatus === 'error' ? 'Configuration Error' : 'Checking...'}
            </h2>
          </div>
          
          {sentryStatus === 'configured' ? (
            <p className="text-green-600 mb-2">
              ✓ Sentry is properly configured with DSN: {import.meta.env.VITE_SENTRY_DSN.slice(0, 8)}...{import.meta.env.VITE_SENTRY_DSN.slice(-4)}
            </p>
          ) : sentryStatus === 'error' ? (
            <p className="text-red-600 mb-2">
              ✗ Sentry configuration issue detected. Check the .env file for VITE_SENTRY_DSN.
            </p>
          ) : (
            <p className="text-yellow-600 mb-2">
              Checking Sentry configuration...
            </p>
          )}
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sentry Integration Testing</h2>
          <p className="text-gray-600 mb-6">
            This page allows you to test various Sentry error tracking features.
            Use the buttons below to trigger different types of errors and see how Sentry captures them.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={triggerError} 
              variant="outline"
              className="h-auto py-3"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Trigger Handled Error
            </Button>
            
            <Button 
              onClick={triggerAsyncError} 
              disabled={loading}
              className="h-auto py-3"
            >
              {loading ? 'Loading...' : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Trigger Async Error
                </>
              )}
            </Button>
            
            <Button 
              onClick={addBreadcrumb} 
              variant="outline" 
              className="border-green-400 text-green-600 hover:bg-green-50 h-auto py-3"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Add Breadcrumb
            </Button>
            
            <Button 
              onClick={triggerUnhandledError} 
              variant="destructive"
              className="h-auto py-3"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Trigger Unhandled Error
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              Make sure to set your <code className="bg-gray-100 px-1 rounded font-mono">VITE_SENTRY_DSN</code> in the .env file
            </li>
            <li>
              Handled errors are caught and reported to Sentry manually using <code className="bg-gray-100 px-1 rounded font-mono">logError()</code>
            </li>
            <li>
              Unhandled errors are caught by the ErrorBoundary and reported automatically
            </li>
            <li>
              User information is tracked when a user is authenticated via <code className="bg-gray-100 px-1 rounded font-mono">setUserScope()</code>
            </li>
            <li>
              Breadcrumbs help track user actions leading up to an error
            </li>
            <li>
              Check your Sentry dashboard to view captured errors and session data
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Debugging Tips
            </h3>
            <p className="text-sm text-yellow-700">
              If errors aren't appearing in your Sentry dashboard, check browser console for any initialization errors. 
              Verify your DSN is correct and that the Sentry SDK is properly initialized before any errors occur.
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SentryTest;
