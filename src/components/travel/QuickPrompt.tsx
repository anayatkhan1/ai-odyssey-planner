
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, DollarSign, Users, Map, Utensils, Hotel, Compass } from 'lucide-react';

const QuickPrompt = ({ prompt, onClick }: { prompt: string, onClick: (prompt: string) => void }) => {
  return (
    <motion.button
      onClick={() => onClick(prompt)}
      className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 bg-white 
                hover:bg-travel-lightBlue hover:border-travel-blue/30 transition-colors 
                text-gray-700 text-sm group flex items-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mr-3 text-travel-blue opacity-70 group-hover:opacity-100">
        {prompt.includes("visit") || prompt.includes("destination") ? <Globe className="h-4 w-4" /> : 
         prompt.includes("budget") ? <DollarSign className="h-4 w-4" /> :
         prompt.includes("solo") || prompt.includes("family") ? <Users className="h-4 w-4" /> :
         prompt.includes("itinerary") ? <Map className="h-4 w-4" /> :
         prompt.includes("food") || prompt.includes("restaurants") ? <Utensils className="h-4 w-4" /> :
         prompt.includes("hotel") || prompt.includes("stay") ? <Hotel className="h-4 w-4" /> :
         <Compass className="h-4 w-4" />}
      </div>
      <span className="flex-1">{prompt}</span>
      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-travel-blue transition-colors" />
    </motion.button>
  );
};

export default QuickPrompt;
