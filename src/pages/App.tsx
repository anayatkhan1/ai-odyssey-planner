
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AppPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been logged out successfully",
        variant: "success",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const showToastVariants = () => {
    // Show success toast
    toast({
      title: "Success",
      description: "Your action was completed successfully",
      variant: "success",
    });
    
    // Show info toast after a delay
    setTimeout(() => {
      toast({
        title: "Information",
        description: "Here's some important information for you",
        variant: "info",
      });
    }, 1000);
    
    // Show warning toast after a delay
    setTimeout(() => {
      toast({
        title: "Warning",
        description: "Please be careful with this action",
        variant: "warning",
      });
    }, 2000);
    
    // Show error toast after a delay
    setTimeout(() => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again",
        variant: "destructive",
      });
    }, 3000);
  };

  return (
    <motion.div 
      className="min-h-screen bg-neo-background p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-archivo">Dashboard</h1>
          <Button 
            variant="outline" 
            className="border-3 border-black hover:bg-red-50 flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white border-5 border-black rounded-xl p-8 shadow-neo-lg">
          <h1 className="text-3xl font-bold font-archivo mb-6">Welcome to your Dashboard</h1>
          
          <div className="p-4 bg-neo-pink/10 rounded-lg border-3 border-black mb-6">
            <p className="font-bold">Hello, {user?.email || 'User'}! 👋</p>
            <p className="text-sm">You've successfully logged in to the protected area.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border-3 border-black shadow-neo">
              <h3 className="text-xl font-bold mb-3">Your Profile</h3>
              <p className="text-gray-600 mb-4">User ID: {user?.id}</p>
              <p className="text-gray-600 mb-4">Email: {user?.email}</p>
              {user?.user_metadata?.full_name && (
                <p className="text-gray-600 mb-4">Name: {user.user_metadata.full_name}</p>
              )}
              {user?.user_metadata?.avatar_url && (
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Profile Picture:</p>
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-2 border-black"
                  />
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-xl border-3 border-black shadow-neo">
              <h3 className="text-xl font-bold mb-3">Toast Notifications</h3>
              <p className="text-gray-600 mb-4">Click below to see our enhanced toast notifications.</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => toast({
                    title: "Success Message",
                    description: "Your action was completed successfully",
                    variant: "success",
                  })}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Success Toast
                </Button>
                
                <Button 
                  onClick={() => toast({
                    title: "Error Message",
                    description: "Something went wrong. Please try again",
                    variant: "destructive",
                  })}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  Error Toast
                </Button>
                
                <Button 
                  onClick={() => toast({
                    title: "Info Message",
                    description: "Here's some useful information for you",
                    variant: "info",
                  })}
                  variant="outline"
                  className="flex items-center gap-2 border-blue-400 text-blue-600 hover:bg-blue-50"
                >
                  <Info size={16} />
                  Info Toast
                </Button>
                
                <Button 
                  onClick={() => toast({
                    title: "Warning Message",
                    description: "Please be careful with this action",
                    variant: "warning",
                  })}
                  variant="outline"
                  className="flex items-center gap-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  <AlertTriangle size={16} />
                  Warning Toast
                </Button>
                
                <Button 
                  onClick={showToastVariants}
                  className="col-span-2 bg-gradient-to-r from-neo-blue to-neo-green text-white flex items-center gap-2"
                >
                  <Bell size={16} />
                  Show All Toast Variants
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppPage;
