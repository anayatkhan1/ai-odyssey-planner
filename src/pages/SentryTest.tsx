
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { logError, Sentry } from '@/lib/sentry';
import { useToast } from '@/hooks/use-toast';

const SentryTest = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const triggerError = () => {
    try {
      // Intentionally throw an error
      throw new Error('This is a test error for Sentry');
    } catch (error) {
      // Log the error to Sentry
      logError(error, { source: 'SentryTest', action: 'triggerError' });
      
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
      // Simulate an API call that fails
      await new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Async operation failed')), 1000)
      );
    } catch (error) {
      logError(error, { source: 'SentryTest', action: 'triggerAsyncError' });
      
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
        <h1 className="text-3xl font-bold mb-6">Sentry Test Page</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sentry Integration Testing</h2>
          <p className="text-gray-600 mb-6">
            This page allows you to test various Sentry error tracking features.
            Use the buttons below to trigger different types of errors and see how Sentry captures them.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={triggerError} variant="outline">
              Trigger Handled Error
            </Button>
            
            <Button onClick={triggerAsyncError} disabled={loading}>
              {loading ? 'Loading...' : 'Trigger Async Error'}
            </Button>
            
            <Button onClick={addBreadcrumb} variant="outline" className="border-green-400 text-green-600 hover:bg-green-50">
              Add Breadcrumb
            </Button>
            
            <Button onClick={triggerUnhandledError} variant="destructive">
              Trigger Unhandled Error
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              Make sure to set your <code className="bg-gray-100 px-1 rounded">VITE_SENTRY_DSN</code> in the .env file
            </li>
            <li>
              Handled errors are caught and reported to Sentry manually
            </li>
            <li>
              Unhandled errors are caught by the ErrorBoundary and reported automatically
            </li>
            <li>
              User information is tracked when a user is authenticated
            </li>
            <li>
              Breadcrumbs help track user actions leading up to an error
            </li>
          </ul>
        </Card>
      </div>
    </motion.div>
  );
};

export default SentryTest;
