
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get the intended destination from location state or default to /travel
  const from = location.state?.from || '/travel';
  
  // If already authenticated, redirect to the intended destination
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  // Handle OAuth callback
  useEffect(() => {
    const processOAuthCallback = async () => {
      // Check for OAuth parameters in URL
      const hasOAuthParams = location.hash.includes('access_token=') || 
                            location.search.includes('callback=auth');
      
      if (!hasOAuthParams) return;
      
      console.log("OAuth callback detected");
      
      try {
        // Clean the URL immediately for better UX
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, document.title, '/login');
        }
        
        // Check session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        // If session exists, show success and redirect
        if (data.session) {
          console.log("Valid session found after OAuth callback");
          
          toast({
            title: "Login Successful!",
            description: "Welcome back! You've been successfully logged in.",
          });
        }
      } catch (error: any) {
        console.error("Error processing OAuth callback:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "There was a problem with authentication",
          variant: "destructive"
        });
      }
    };
    
    processOAuthCallback();
  }, [location, toast]);

  // OAuth sign in handler
  const handleOAuthSignIn = async () => {
    try {
      console.log("Initiating Google OAuth sign-in");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login?callback=auth`,
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-neo-background p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center mb-8 text-black font-archivo font-bold hover:text-neo-blue transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <Card className="border-5 border-black shadow-neo bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-archivo">Welcome back!</CardTitle>
            <CardDescription>Sign in to your account to continue your journey</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full font-bold border-3 border-black bg-white hover:bg-gray-50 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform"
              onClick={handleOAuthSignIn}
            >
              <svg className="mr-2 h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </CardContent>
          
          <CardFooter>
            <p className="text-center text-sm w-full">
              By continuing, you agree to our{" "}
              <Link to="#" className="text-neo-blue font-bold hover:underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link to="#" className="text-neo-blue font-bold hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default LoginPage;
