
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
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
      className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-neo-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Abstract shapes background */}
      <div className="absolute top-12 right-32 w-20 h-20 bg-neo-pink rounded-full border-3 border-black z-0 animate-float"></div>
      <div className="absolute bottom-40 left-10 w-16 h-16 bg-neo-green rounded-lg border-3 border-black z-0 rotate-12 animate-bounce-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-neo-yellow rounded-lg border-3 border-black z-0 animate-spin-slow"></div>
      
      {/* Left column - imagery & brand */}
      <div className="hidden md:flex flex-col relative items-center justify-center p-8 overflow-hidden">
        <div className="relative bg-white border-5 border-black rounded-xl shadow-neo-lg p-8 w-full max-w-md z-10 transform -rotate-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H14C15.1046 20 16 19.1046 16 18V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12H20M20 12L18 10M20 12L18 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-archivo font-black text-black">Voyagent</h2>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 font-archivo">Welcome back, traveler!</h3>
          
          <div className="relative mt-6 rounded-xl overflow-hidden border-3 border-black shadow-neo">
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1074&auto=format&fit=crop"
              alt="Travel Landscape"
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
              <p className="text-white font-bold">Continue your travel adventure</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-neo-blue text-white p-1 rounded-full border-3 border-black">
                <Check className="h-4 w-4" />
              </div>
              <p className="font-bold">Discover new destinations</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-neo-orange text-black p-1 rounded-full border-3 border-black">
                <Check className="h-4 w-4" />
              </div>
              <p className="font-bold">Plan your next adventure</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-neo-green text-black p-1 rounded-full border-3 border-black">
                <Check className="h-4 w-4" />
              </div>
              <p className="font-bold">Access your saved itineraries</p>
            </div>
          </div>
        </div>
        
        {/* Grid lines background for left panel */}
        <div className="absolute inset-0 grid-bg z-0"></div>
      </div>
      
      {/* Right column - login form */}
      <div className="flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center mb-8 text-black font-archivo font-bold hover:text-neo-blue transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <Card className="border-5 border-black shadow-neo bg-white relative z-10">
            <CardHeader>
              <CardTitle className="text-2xl font-archivo bg-gradient-to-r from-blue-600 to-neo-pink bg-clip-text text-transparent">Sign In</CardTitle>
              <CardDescription>Welcome back! Sign in to access your account</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center">
                <div className="relative animate-float">
                  <div className="absolute top-0 -right-3 w-4 h-4 bg-neo-pink rounded-full border-2 border-black"></div>
                  <div className="absolute -bottom-2 -left-3 w-3 h-3 bg-neo-yellow rounded-full border-2 border-black"></div>
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
                    alt="Google Sign In" 
                    className="w-16 h-16 relative z-10" 
                  />
                </div>
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
                <p>Don't have an account?{" "}
                  <Link to="/signup" className="text-neo-blue font-bold hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Voyagent - Your personalized travel companion</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
