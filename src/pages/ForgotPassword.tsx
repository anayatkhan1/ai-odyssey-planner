
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Missing information",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Initiating password reset for:", email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
      });
      
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Request failed",
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
              {isSuccess ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSuccess 
                ? "We've sent you a password reset link" 
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-16 h-16 bg-neo-green rounded-full flex items-center justify-center border-3 border-black shadow-neo mb-4">
                  <Check className="h-8 w-8 text-black" />
                </div>
                <p className="text-center">
                  We've sent a password reset link to <span className="font-bold">{email}</span>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-sm text-gray-500 text-center">
                  If you don't see the email in your inbox, check your spam folder.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
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
                
                <Button 
                  type="submit"
                  className="w-full bg-neo-blue hover:bg-blue-700 text-white font-bold border-3 border-black shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending link...
                    </span>
                  ) : (
                    "Send Reset Link"
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

export default ForgotPasswordPage;
