
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Plane, Map, Calendar, Compass } from 'lucide-react';
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
      className="min-h-screen bg-neo-background p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-archivo flex items-center">
            <Plane className="mr-2 text-neo-blue" /> 
            Voyagent Travel
          </h1>
          <Button 
            variant="outline" 
            className="border-3 border-black hover:bg-red-50 flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white border-5 border-black rounded-xl p-6 md:p-8 shadow-neo-lg mb-8">
          <h2 className="text-2xl font-bold font-archivo mb-4">Welcome, Traveler! 👋</h2>
          <p className="mb-6">You've successfully logged in to your travel dashboard. Start planning your next adventure!</p>
          
          <div className="p-4 bg-neo-green/10 rounded-lg border-3 border-black mb-6">
            <p className="font-bold">Hello, {user?.email || 'Explorer'}!</p>
            <p className="text-sm">What's your next destination?</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-3 border-black shadow-neo">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2 text-neo-pink" />
                Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Explore amazing destinations around the world.</p>
            </CardContent>
          </Card>
          
          <Card className="border-3 border-black shadow-neo">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 text-neo-yellow" />
                Itineraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Plan your perfect trip day by day.</p>
            </CardContent>
          </Card>
          
          <Card className="border-3 border-black shadow-neo">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Compass className="mr-2 text-neo-blue" />
                Adventures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Discover exciting activities at your destination.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelPage;
