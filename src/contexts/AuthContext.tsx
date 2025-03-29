
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        // Update state with the new session information
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (isLoading) {
          setIsLoading(false);
        }
        
        // Log the auth state change to help with debugging
        console.log("Auth session changed:", {
          event,
          session: currentSession ? "present" : "not present",
          pathname: window.location.pathname
        });
        
        // Handle auth state changes
        if (event === 'SIGNED_IN' && currentSession) {
          // Show success toast on sign in
          toast({
            title: "Successfully signed in",
            description: `Welcome ${currentSession.user.email}`,
          });
          
          // Redirect to /travel after successful login if on login page
          if (window.location.pathname.includes('/login')) {
            console.log("Redirecting to /travel after sign in");
            window.location.href = '/travel';
          }
        } else if (event === 'SIGNED_OUT') {
          // Show toast on sign out
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        }
      }
    );

    // Then check for existing session
    const checkExistingSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        console.log("Initial session check:", data.session?.user?.email || "No session");
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // If we have a session and we're on the login page, redirect to /travel
        if (data.session && window.location.pathname.includes('/login')) {
          console.log("Found existing session while on login page, redirecting to /travel");
          window.location.href = '/travel';
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out");
      await supabase.auth.signOut();
      // Redirect is handled by the auth state change listener
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    isLoading,
    user,
    session,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
