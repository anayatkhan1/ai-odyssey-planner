
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TravelPreferenceCard = ({ icon, title, options, onSelect }: { 
  icon: React.ReactNode, 
  title: string, 
  options: string[],
  onSelect: (option: string) => void 
}) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="mr-2 text-travel-blue">{icon}</div>
          <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              onClick={() => onSelect(option)}
              className="text-xs hover:bg-travel-blue hover:text-white"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelPreferenceCard;
