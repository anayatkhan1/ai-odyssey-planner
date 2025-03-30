
import React from 'react';
import { motion } from 'framer-motion';
import { Plane, DollarSign, Users, Compass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TravelPreferenceCard from './TravelPreferenceCard';
import QuickPrompt from './QuickPrompt';

type EmptyChatStateProps = { 
  quickPrompts: string[], 
  handleQuickPrompt: (prompt: string) => void,
  handlePreferenceSelect: (category: string, option: string) => void
};

const EmptyChatState = ({ quickPrompts, handleQuickPrompt, handlePreferenceSelect }: EmptyChatStateProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-travel-lightBlue rounded-full p-5 mb-6"
      >
        <Plane className="h-10 w-10 text-travel-blue" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-travel-blue mb-2">Your Travel Assistant</h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        Ask me anything about travel destinations, planning tips, or personalized recommendations!
      </p>
      
      <div className="w-full">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline" className="bg-travel-blue/5 text-travel-blue border-travel-blue/20">Tell me your preferences</Badge>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          
          <TravelPreferenceCard 
            icon={<DollarSign className="h-4 w-4" />}
            title="Budget"
            options={["Budget", "Mid-range", "Luxury"]}
            onSelect={(option) => handlePreferenceSelect("budget", option)}
          />
          
          <TravelPreferenceCard 
            icon={<Users className="h-4 w-4" />}
            title="Travel Companions"
            options={["Solo", "Couple", "Family", "Friends"]}
            onSelect={(option) => handlePreferenceSelect("companions", option)}
          />
          
          <TravelPreferenceCard 
            icon={<Compass className="h-4 w-4" />}
            title="Interests"
            options={["Nature", "Culture", "Food", "Adventure", "Relaxation", "Beaches", "Nightlife"]}
            onSelect={(option) => handlePreferenceSelect("interests", option)}
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="w-full space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline" className="bg-travel-blue/5 text-travel-blue border-travel-blue/20">Popular Questions</Badge>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          
          {quickPrompts.map((prompt, index) => (
            <QuickPrompt 
              key={index} 
              prompt={prompt} 
              onClick={handleQuickPrompt} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyChatState;
