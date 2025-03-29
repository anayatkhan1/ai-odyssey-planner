
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for hash fragment in URL which contains the access token after email link click
  useEffect(() => {
    const handleHashChange = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresIn = hashParams.get('expires_in');
        const tokenType = hashParams.get('token_type');
        
        if (accessToken) {
          console.log("Found access token in URL, setting session");
          
          // Set the user's session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error("Error setting session:", error);
            setError("Your reset link has expired or is invalid. Please request a new one.");
          }
        } else {
          // No token in URL, which means user accessed this page directly
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setError("No active session. Please request a password reset from the login page.");
          }
        }
      } catch (err) {
        console.error("Error handling hash params:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    handleHashChange();
  }, []);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please enter both password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Updating password");
      
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      console.log("Password updated successfully");
      setIsSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been changed successfully",
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Reset failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-4 bg-neo-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background elements */}
      <div className="absolute top-12 right-32 w-20 h-20 bg-neo-pink rounded-full border-3 border-black z-0 animate-float"></div>
      <div className="absolute bottom-40 left-10 w-16 h-16 bg-neo-green rounded-lg border-3 border-black z-0 rotate-12 animate-bounce-slow"></div>
      
      <div className="w-full max-w-md relative z-10">
        <Link to="/login" className="inline-flex items-center mb-8 text-black font-archivo font-bold hover:text-neo-blue transition-colors group">
          <div className="mr-2 w-8 h-8 flex items-center justify-center bg-white rounded-full border-3 border-black shadow-neo group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span>Back to Login</span>
        </Link>
        
        <Card className="border-5 border-black shadow-neo-lg bg-white relative z-10 overflow-hidden">
          {/* Colorful top border */}
          <div className="flex w-full h-2">
            <div className="w-1/4 bg-neo-blue"></div>
            <div className="w-1/4 bg-neo-pink"></div>
            <div className="w-1/4 bg-neo-green"></div>
            <div className="w-1/4 bg-neo-yellow"></div>
          </div>
          
          <CardHeader>
            <CardTitle className="text-2xl font-archivo text-center">
              {isSuccess ? "Password Reset Complete" : "Reset Your Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSuccess 
                ? "Your password has been successfully reset" 
                : "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-3 border-black shadow-neo mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-center font-bold text-red-500">
                  {error}
                </p>
                <Button 
                  onClick={() => navigate('/forgot-password')}
                  className="mt-4 bg-neo-blue hover:bg-blue-700 text-white font-bold border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform"
                >
                  Request New Link
                </Button>
              </div>
            ) : isSuccess ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-16 h-16 bg-neo-green rounded-full flex items-center justify-center border-3 border-black shadow-neo mb-4">
                  <Check className="h-8 w-8 text-black" />
                </div>
                <p className="text-center">
                  Your password has been successfully reset. You will be redirected to the login page shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-neo-blue" /> 
                    New Password
                  </Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-bold flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-neo-blue" /> 
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                      className="pl-4 border-3 border-black h-12" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-neo-blue hover:bg-blue-700 text-white font-bold border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
            
            <div className="flex flex-col items-center space-y-4 mt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link to="/login" className="text-neo-blue font-bold hover:underline">
                  Back to login
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
    </motion.div>
  );
};

export default ResetPasswordPage;
