
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FilterType } from '@/pages/Travel';

interface TravelFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

// Filter options
const filterOptions = {
  budget: ['Low', 'Medium', 'High', 'Luxury'],
  duration: ['Weekend', '3-5 Days', '1 Week+'],
  locationType: ['Beach', 'Mountain', 'City', 'Rural'],
  activities: ['Adventure', 'Relaxation', 'Cultural', 'Family-Friendly'],
  season: ['Summer', 'Winter', 'Spring', 'Fall', 'All Year'],
  visaRequirement: ['Visa-Free', 'Visa on Arrival', 'Requires Visa']
};

const FilterSection = ({ 
  title, 
  filterKey, 
  options, 
  selectedValues, 
  onChange 
}: {
  title: string;
  filterKey: keyof FilterType;
  options: string[];
  selectedValues: string[];
  onChange: (key: keyof FilterType, value: string, checked: boolean) => void;
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-gray-200 pb-4">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between py-2 cursor-pointer">
          <h3 className="font-archivo font-bold">{title}</h3>
          <ChevronDown 
            size={18} 
            className={`transition-transform ${open ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2 space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={`flex items-center justify-between px-3 py-1 border border-gray-300 rounded text-sm ${
                selectedValues.includes(option) 
                  ? 'bg-travel-teal text-white border-travel-teal' 
                  : 'bg-white text-gray-700 hover:bg-travel-lightBlue'
              }`}
              onClick={() => onChange(filterKey, option, !selectedValues.includes(option))}
            >
              <span>{option}</span>
              {selectedValues.includes(option) && (
                <CheckIcon size={14} className="ml-2" />
              )}
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const TravelFilters: React.FC<TravelFiltersProps> = ({ filters, setFilters }) => {
  const handleFilterChange = (key: keyof FilterType, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[key] as string[];
      
      if (checked) {
        return { ...prev, [key]: [...currentValues, value] };
      } else {
        return { ...prev, [key]: currentValues.filter(v => v !== value) };
      }
    });
  };

  return (
    <div className="space-y-4">
      <FilterSection
        title="Budget"
        filterKey="budget"
        options={filterOptions.budget}
        selectedValues={filters.budget}
        onChange={handleFilterChange}
      />
      
      <FilterSection
        title="Duration"
        filterKey="duration"
        options={filterOptions.duration}
        selectedValues={filters.duration}
        onChange={handleFilterChange}
      />
      
      <FilterSection
        title="Location Type"
        filterKey="locationType"
        options={filterOptions.locationType}
        selectedValues={filters.locationType}
        onChange={handleFilterChange}
      />
      
      <FilterSection
        title="Activities"
        filterKey="activities"
        options={filterOptions.activities}
        selectedValues={filters.activities}
        onChange={handleFilterChange}
      />
      
      <FilterSection
        title="Best Season"
        filterKey="season"
        options={filterOptions.season}
        selectedValues={filters.season}
        onChange={handleFilterChange}
      />
      
      <FilterSection
        title="Visa Requirements"
        filterKey="visaRequirement"
        options={filterOptions.visaRequirement}
        selectedValues={filters.visaRequirement}
        onChange={handleFilterChange}
      />
    </div>
  );
};

export default TravelFilters;
