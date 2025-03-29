
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Handle redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to /travel");
      window.location.href = '/travel';
    }
  }, [user]);

  // Handle OAuth sign in
  const handleOAuthSignIn = async (provider: 'google') => {
    setIsOAuthLoading(true);
    
    try {
      console.log("Initiating OAuth sign-in with", provider);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth?callback=auth`,
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsOAuthLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-neo-background p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="border-5 border-black shadow-neo bg-white max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-archivo">Welcome to Voyagent</CardTitle>
          <CardDescription>Your AI-powered travel companion</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center mb-6">
            <div className="bg-neo-blue text-white p-4 rounded-full inline-flex mb-4 border-3 border-black">
              <LogIn className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <p className="text-lg">Sign in to start planning your next adventure</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full font-bold border-3 border-black bg-white hover:bg-gray-50 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform py-6"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isOAuthLoading}
          >
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
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthPage;
