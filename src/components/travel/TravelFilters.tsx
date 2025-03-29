
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

// Map filter options to colors for visual interest
const filterColors = {
  budget: {
    Low: 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200',
    Medium: 'bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200',
    High: 'bg-purple-100 border-purple-400 text-purple-700 hover:bg-purple-200',
    Luxury: 'bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200',
  },
  duration: {
    'Weekend': 'bg-teal-100 border-teal-400 text-teal-700 hover:bg-teal-200',
    '3-5 Days': 'bg-cyan-100 border-cyan-400 text-cyan-700 hover:bg-cyan-200',
    '1 Week+': 'bg-indigo-100 border-indigo-400 text-indigo-700 hover:bg-indigo-200',
  },
  locationType: {
    'Beach': 'bg-travel-lightBlue border-blue-400 text-blue-700 hover:bg-blue-200',
    'Mountain': 'bg-emerald-100 border-emerald-400 text-emerald-700 hover:bg-emerald-200',
    'City': 'bg-violet-100 border-violet-400 text-violet-700 hover:bg-violet-200',
    'Rural': 'bg-lime-100 border-lime-400 text-lime-700 hover:bg-lime-200',
  },
  activities: {
    'Adventure': 'bg-rose-100 border-rose-400 text-rose-700 hover:bg-rose-200',
    'Relaxation': 'bg-sky-100 border-sky-400 text-sky-700 hover:bg-sky-200',
    'Cultural': 'bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200',
    'Family-Friendly': 'bg-emerald-100 border-emerald-400 text-emerald-700 hover:bg-emerald-200',
  },
  season: {
    'Summer': 'bg-orange-100 border-orange-400 text-orange-700 hover:bg-orange-200',
    'Winter': 'bg-blue-100 border-blue-400 text-blue-700 hover:bg-blue-200',
    'Spring': 'bg-pink-100 border-pink-400 text-pink-700 hover:bg-pink-200',
    'Fall': 'bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200',
    'All Year': 'bg-purple-100 border-purple-400 text-purple-700 hover:bg-purple-200',
  },
  visaRequirement: {
    'Visa-Free': 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200',
    'Visa on Arrival': 'bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200',
    'Requires Visa': 'bg-red-100 border-red-400 text-red-700 hover:bg-red-200',
  }
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
    <Collapsible open={open} onOpenChange={setOpen} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between py-2 cursor-pointer">
          <h3 className="font-archivo font-bold text-travel-blue">{title}</h3>
          <ChevronDown 
            size={18} 
            className={`transition-transform text-travel-blue ${open ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option);
            const colorKey = filterKey as keyof typeof filterColors;
            const optionKey = option as keyof (typeof filterColors)[typeof colorKey];
            const colorClass = filterColors[colorKey][optionKey] || 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200';
            
            return (
              <Button
                key={option}
                type="button"
                variant="outline"
                size="sm"
                className={`px-3 py-1 border rounded-full text-sm transition-all hover:text-black ${
                  isSelected 
                    ? `${colorClass} border-2` 
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
                onClick={() => onChange(filterKey, option, !isSelected)}
              >
                <span>{option}</span>
                {isSelected && (
                  <CheckIcon size={14} className="ml-1" />
                )}
              </Button>
            );
          })}
        </div>
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
    <div className="space-y-2 bg-travel-sand p-5 rounded-xl border-3 border-travel-blue shadow-neo">
      <h2 className="text-xl font-bold font-archivo mb-4 text-travel-blue">Filter Destinations</h2>
      
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
      
      {/* Clear Filters Button - Fixed to include all required FilterType properties */}
      <Button 
        className="w-full mt-4 bg-white text-travel-blue border-2 border-travel-blue hover:bg-travel-blue hover:text-black"
        onClick={() => setFilters({
          search: '',
          budget: [],
          duration: [],
          locationType: [],
          activities: [],
          season: [],
          visaRequirement: [],
          sortBy: 'popularity'
        })}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default TravelFilters;
