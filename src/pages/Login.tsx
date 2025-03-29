
import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, ArrowLeft } from "lucide-react";
import { useSignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neo-blue"></div>
      </div>
    );
  }

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "There was an error with your login. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.errors?.[0]?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (strategy: "oauth_google") => {
    setIsOAuthLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/login',
        redirectUrlComplete: '/',
      });
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
      className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-neo-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Abstract shapes background */}
      <div className="absolute top-12 right-12 w-24 h-24 bg-neo-pink rounded-full border-3 border-black z-0 animate-bounce-slow"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-neo-yellow rounded-lg border-3 border-black z-0 rotate-12 animate-spin-slow"></div>
      <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-neo-green rounded-lg border-3 border-black z-0 animate-float"></div>
      
      {/* Left column - imagery & brand */}
      <div className="hidden md:flex flex-col relative items-center justify-center p-8 overflow-hidden">
        <div className="relative bg-white border-5 border-black rounded-xl shadow-neo-lg p-8 w-full max-w-md z-10 transform rotate-1">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-neo-blue text-white p-2 rounded-lg border-3 border-black shadow-neo">
              <LogIn className="h-6 w-6" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-archivo font-black text-black">Voyagent</h2>
          </div>
          
          <h3 className="text-2xl font-bold mb-4 font-archivo">Discover the world with AI-powered travel planning</h3>
          
          <div className="relative mt-8 rounded-xl overflow-hidden border-3 border-black shadow-neo">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1035&auto=format&fit=crop"
              alt="Travel Destinations"
              className="w-full h-72 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
              <p className="text-white font-bold">Your next adventure is just a few clicks away</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-neo-yellow h-24 rounded-lg border-3 border-black flex items-center justify-center">
              <span className="font-archivo font-black text-lg">50+</span>
            </div>
            <div className="bg-neo-green h-24 rounded-lg border-3 border-black flex items-center justify-center">
              <span className="font-archivo font-black text-lg">100%</span>
            </div>
            <div className="bg-neo-pink h-24 rounded-lg border-3 border-black flex items-center justify-center">
              <span className="font-archivo text-white font-black text-lg">24/7</span>
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
              <CardTitle className="text-2xl font-archivo">Log In</CardTitle>
              <CardDescription>Welcome back! Log in to continue</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Email/Password Login Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="youremail@example.com"
                    className="border-3 border-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="border-3 border-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full font-bold bg-neo-green text-black hover:bg-neo-green/80 border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Logging in...
                    </span>
                  ) : "Log in with Email"}
                </Button>
              </form>
              
              <div className="relative flex items-center">
                <span className="border-t border-gray-300 flex-grow"></span>
                <span className="mx-3 text-sm text-gray-500">or</span>
                <span className="border-t border-gray-300 flex-grow"></span>
              </div>
              
              {/* OAuth Login */}
              <div className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full font-bold border-3 border-black bg-white hover:bg-gray-50 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform"
                  onClick={() => handleOAuthSignIn("oauth_google")}
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
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-neo-blue font-bold hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
