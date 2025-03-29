
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Mail, Calendar, User, Briefcase, MapPin, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully",
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

  // Format created_at date if available
  const formattedDate = user?.created_at 
    ? format(new Date(user.created_at), 'MMMM dd, yyyy') 
    : 'Not available';

  return (
    <motion.div 
      className="min-h-screen bg-neo-background pt-24 pb-16 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-archivo">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
          <Button 
            variant="outline" 
            className="border-3 border-black hover:bg-red-50 hover:text-black flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="md:col-span-1">
            <div className="bg-white border-3 border-black rounded-xl p-6 shadow-neo">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-3 border-black bg-neo-blue text-white flex items-center justify-center mb-4 shadow-neo-sm">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold">
                      {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="grid gap-2 w-full mt-4">
                  <Button 
                    className="w-full bg-neo-yellow hover:bg-neo-yellow/80 text-black border-3 border-black shadow-neo-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform"
                    onClick={() => navigate('/travel')}
                  >
                    View Travel Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="md:col-span-2">
            <div className="bg-white border-3 border-black rounded-xl p-6 shadow-neo mb-6">
              <h3 className="text-xl font-bold mb-4 font-archivo">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                  <Mail className="text-neo-blue mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                  <User className="text-neo-blue mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{user?.id}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                  <Calendar className="text-neo-blue mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                
                {user?.user_metadata?.provider && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                    <Briefcase className="text-neo-blue mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Authentication Provider</p>
                      <p className="font-medium capitalize">{user.user_metadata.provider}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white border-3 border-black rounded-xl p-6 shadow-neo">
              <h3 className="text-xl font-bold mb-4 font-archivo">Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200">
                  <Key className="text-neo-blue mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Password</p>
                    <p className="font-medium">••••••••</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2 border-gray-300 hover:bg-neo-yellow/20 hover:text-black"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
