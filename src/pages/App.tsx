
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const AppPage = () => {
  const { user } = useAuth();

  return (
    <motion.div 
      className="min-h-screen bg-neo-background p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto">
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
            </div>
            
            <div className="bg-white p-6 rounded-xl border-3 border-black shadow-neo">
              <h3 className="text-xl font-bold mb-3">Coming Soon</h3>
              <p className="text-gray-600">New features will be added here.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppPage;
