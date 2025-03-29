
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TravelPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
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
          <h1 className="text-3xl font-bold font-archivo">Travel Dashboard</h1>
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
          <div className="flex items-center mb-8 gap-4">
            <div className="bg-neo-blue text-white p-3 rounded-full border-3 border-black">
              <Plane className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-archivo">Welcome to Your Travel Hub</h1>
          </div>
          
          <div className="p-4 bg-neo-pink/10 rounded-lg border-3 border-black mb-6">
            <p className="font-bold">Hello, {user?.email || 'Traveler'}! 👋</p>
            <p className="text-sm">You've successfully accessed the protected travel area.</p>
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
              <h3 className="text-xl font-bold mb-3">Your Upcoming Trips</h3>
              <p className="text-gray-600">You don't have any upcoming trips yet. Start planning your next adventure!</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelPage;
