
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bookmark, Clock, Calendar, Tag, MapPin, X, Globe, DollarSign, Plane } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DestinationType } from '@/pages/Travel';
import { motion } from 'framer-motion';

interface DestinationDetailsProps {
  destination: DestinationType;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  destination,
  isSaved,
  onToggleSave,
  onClose,
}) => {
  // Helper functions to get colors based on categories
  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Luxury': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'Summer': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Winter': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Spring': return 'bg-green-100 text-green-800 border-green-300';
      case 'Fall': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'All Year': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getVisaColor = (visa: string) => {
    switch (visa) {
      case 'Visa-Free': return 'bg-green-100 text-green-800 border-green-300';
      case 'Visa on Arrival': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Requires Visa': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white border-black border hover:text-black rounded-full"
        >
          <X size={24} />
        </Button>
        
        <div className="h-80 relative overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if the original one fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200';
              target.onerror = null; // Prevent infinite fallback loop
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <h1 className="text-4xl font-bold font-archivo">{destination.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-white/80" />
              <span className="text-white/80">Lat: {destination.location.lat.toFixed(2)}, Lng: {destination.location.lng.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
          <div className="flex justify-between items-start mb-6">
            <p className="text-lg text-gray-700 max-w-3xl">{destination.description}</p>
            <Button
              variant="outline"
              size="sm"
              className={`ml-4 ${isSaved ? 'bg-travel-orange/10 border-travel-orange' : 'bg-white'} border-2 hover:bg-travel-orange/20 hover:text-black`}
              onClick={onToggleSave}
            >
              <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-travel-orange text-travel-orange' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-3 text-travel-blue">Destination Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Globe size={20} className="text-travel-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location Type</p>
                    <p className="font-medium">{destination.locationType}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Clock size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{destination.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Calendar size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Best Season</p>
                    <p className="font-medium">{destination.season}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 text-travel-blue">Travel Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <DollarSign size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget Category</p>
                    <p className="font-medium">{destination.budget}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Plane size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Visa Requirement</p>
                    <p className="font-medium">{destination.visaRequirement}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <Tag size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Popularity</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-travel-blue h-2.5 rounded-full" 
                        style={{ width: `${destination.popularity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-travel-blue">Activities</h3>
            <div className="flex flex-wrap gap-2">
              {destination.activities.map((activity, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-travel-lightBlue text-travel-blue rounded-full text-sm"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold mb-4 text-travel-blue">Travel Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1.5 rounded-full text-sm border ${getBudgetColor(destination.budget)}`}>
                {destination.budget} Budget
              </span>
              <span className={`px-3 py-1.5 rounded-full text-sm border ${getSeasonColor(destination.season)}`}>
                {destination.season}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-sm border ${getVisaColor(destination.visaRequirement)}`}>
                {destination.visaRequirement}
              </span>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              className="bg-travel-blue text-white hover:bg-travel-blue/90 hover:text-black"
              onClick={() => {
                // This would lead to a booking page in a real app
                window.alert(`Booking for ${destination.name} would start here!`);
              }}
            >
              Plan Your Trip
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DestinationDetails;
