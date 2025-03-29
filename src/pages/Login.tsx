
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Check URL parameters for errors
    const url = new URL(window.location.href);
    const errorDescription = url.searchParams.get("error_description");
    
    if (errorDescription) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(errorDescription),
        variant: "destructive"
      });
      
      // Clear the error from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);
  
  // Handle Google OAuth sign in
  const handleOAuthSignIn = async () => {
    try {
      setIsOAuthLoading(true);
      console.log("Initiating Google OAuth sign-in");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login?callback=auth`,
        },
      });
      
      if (error) throw error;
      
      console.log("OAuth initiation successful", data);
      // The redirect is handled by Supabase
      
    } catch (error: any) {
      console.error("OAuth error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsOAuthLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neo-blue"></div>
      </div>
    );
  }

  // If user is already logged in, we can show a message
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <Card className="w-full max-w-md border-5 border-black shadow-neo">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-archivo">Already Logged In</CardTitle>
            <CardDescription>You are already signed in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg p-4 bg-blue-50 text-blue-800">
              <p className="font-medium">You will be redirected to the travel page shortly...</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="border-3 border-black bg-white hover:bg-gray-50 text-black font-bold shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform"
              onClick={() => window.location.href = '/travel'}
            >
              Go to Travel Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-500 bg-opacity-10 -z-10 rounded-b-[100px] transform -skew-y-2"></div>
      
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center mb-8 text-black font-archivo font-bold hover:text-neo-blue transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card className="border-5 border-black shadow-neo bg-white relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full transform translate-x-20 -translate-y-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full transform -translate-x-20 translate-y-20 -z-10"></div>
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-archivo bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sign In</CardTitle>
            <CardDescription className="text-sm text-gray-600">Welcome to Voyagent! Continue with your Google account to start your journey.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="p-6 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center">
              <img 
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                alt="Google Sign In" 
                className="w-16 h-16 animate-float" 
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full font-bold border-3 border-black bg-white hover:bg-gray-50 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform relative overflow-hidden group"
              onClick={handleOAuthSignIn}
              disabled={isOAuthLoading}
            >
              <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-100 to-purple-100 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center justify-center">
                {isOAuthLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </span>
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-xs text-gray-500">
              Need help? <a href="#" className="text-blue-600 hover:underline">Contact support</a>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Voyagent - Your personalized travel companion</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
