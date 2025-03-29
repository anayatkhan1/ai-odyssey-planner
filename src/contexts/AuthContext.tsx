
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Handle auth state changes, including redirect results
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        // Update state with the new session information
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        // Log the auth state change to help with debugging
        console.log("Auth session changed:", {
          event,
          session: currentSession ? "present" : "not present",
          pathname: window.location.pathname
        });
        
        // If we get a SIGNED_IN or INITIAL_SESSION with a user while on the login page, redirect to /travel
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && 
            currentSession && 
            window.location.pathname.includes('/login')) {
          console.log("Auth detected authenticated session while on login page, redirecting to /travel");
          
          // Use timeout to ensure state is updated before redirect
          setTimeout(() => {
            window.location.href = '/travel';
          }, 500); // Increased timeout for more reliable redirection
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
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
          
          // Use timeout to ensure state is updated before redirect
          setTimeout(() => {
            window.location.href = '/travel';
          }, 500); // Increased timeout for more reliable redirection
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out");
      await supabase.auth.signOut();
      window.location.href = '/';
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
