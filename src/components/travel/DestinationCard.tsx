
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Clock, Calendar, Tag, Map } from 'lucide-react';
import { DestinationType } from '@/pages/Travel';
import { motion } from 'framer-motion';

interface DestinationCardProps {
  destination: DestinationType;
  isSaved: boolean;
  onToggleSave: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination, 
  isSaved,
  onToggleSave
}) => {
  // Helper function to get budget color based on level
  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'Low':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-blue-500';
      case 'High':
        return 'bg-orange-500';
      case 'Luxury':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Helper function to get visa requirement color
  const getVisaColor = (visa: string) => {
    switch (visa) {
      case 'Visa-Free':
        return 'bg-green-500';
      case 'Visa on Arrival':
        return 'bg-blue-500';
      case 'Requires Visa':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
      className="h-full"
    >
      <Card className="overflow-hidden border-3 border-black shadow-neo h-full bg-white hover:shadow-neo-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-3 right-3 rounded-full bg-white border-2 border-black ${
              isSaved ? 'text-travel-orange' : 'text-gray-500'
            }`}
            onClick={onToggleSave}
          >
            <Bookmark 
              size={18} 
              className={isSaved ? 'fill-travel-orange' : ''} 
            />
          </Button>
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex space-x-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getBudgetColor(destination.budget)}`}>
                {destination.budget}
              </span>
              
              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getVisaColor(destination.visaRequirement)}`}>
                {destination.visaRequirement}
              </span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-5">
          <h3 className="text-xl font-archivo font-bold mb-2 text-travel-blue">{destination.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
          
          <div className="space-y-3 mt-auto">
            <div className="flex items-center space-x-2 text-sm">
              <Clock size={16} className="text-travel-teal" />
              <span className="text-gray-700">{destination.duration}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar size={16} className="text-travel-teal" />
              <span className="text-gray-700">Best season: {destination.season}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Map size={16} className="text-travel-teal" />
              <span className="text-gray-700">{destination.locationType}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {destination.activities.map((activity, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-1 rounded-full bg-travel-lightBlue text-travel-blue text-xs font-medium"
                >
                  <Tag size={12} className="mr-1" />
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DestinationCard;
