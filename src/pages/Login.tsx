import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const url = new URL(window.location.href);
    const errorDescription = url.searchParams.get("error_description");
    
    if (errorDescription) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(errorDescription),
        variant: "destructive"
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);
  
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsEmailLoading(true);
      console.log("Initiating email sign-in");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Email sign-in successful", data);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/travel');
      
    } catch (error: any) {
      console.error("Email sign-in error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neo-blue"></div>
      </div>
    );
  }

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
              onClick={() => navigate('/travel')}
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
      <div className="absolute top-12 right-32 w-20 h-20 bg-neo-pink rounded-full border-3 border-black z-0 animate-float"></div>
      <div className="absolute bottom-40 left-10 w-16 h-16 bg-neo-green rounded-lg border-3 border-black z-0 rotate-12 animate-bounce-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-neo-yellow rounded-lg border-3 border-black z-0 animate-spin-slow"></div>
      
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
        
        <div className="absolute inset-0 grid-bg z-0"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-neo-blue/20 rounded-tl-[100px] border-t-3 border-l-3 border-black z-0"></div>
        
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="inline-flex items-center mb-8 text-black font-archivo font-bold hover:text-neo-blue transition-colors group">
            <div className="mr-2 w-8 h-8 flex items-center justify-center bg-white rounded-full border-3 border-black shadow-neo group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Back to Home</span>
          </Link>
          
          <Card className="border-5 border-black shadow-neo-lg bg-white relative z-10 overflow-hidden">
            <div className="flex w-full h-2">
              <div className="w-1/4 bg-neo-blue"></div>
              <div className="w-1/4 bg-neo-pink"></div>
              <div className="w-1/4 bg-neo-green"></div>
              <div className="w-1/4 bg-neo-yellow"></div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl font-archivo text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">Sign in to continue your journey</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleEmailSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-neo-blue" /> 
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com"
                      className="pl-4 border-3 border-black h-12" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-bold flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-neo-blue" /> 
                      Password
                    </Label>
                    <Link to="/forgot-password" className="text-xs text-neo-blue hover:underline font-semibold">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-4 border-3 border-black h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-neo-blue hover:bg-blue-700 text-white font-bold border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform h-12 text-base"
                  disabled={isEmailLoading}
                >
                  {isEmailLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in with Email"
                  )}
                </Button>
              </form>
              
              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="text-xs text-gray-500 uppercase font-bold">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full font-bold border-3 border-black bg-white hover:bg-gray-50 text-black hover:text-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform h-12"
                onClick={handleOAuthSignIn}
                disabled={isOAuthLoading}
              >
                {isOAuthLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Continue with Google
                  </span>
                )}
              </Button>
              
              <div className="flex flex-col items-center space-y-4 mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-neo-blue font-bold hover:underline">
                    Sign up
                  </Link>
                </p>
                
                <div className="text-xs text-gray-500 text-center max-w-xs">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-neo-blue hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-neo-blue hover:underline">
                    Privacy Policy
                  </Link>.
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <span className="inline-flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-neo-blue rounded-full mr-2"></div>
              Voyagent - Your AI-powered travel companion
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
