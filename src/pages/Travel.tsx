
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Filter, Map, Search, Bookmark, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import TravelFilters from '@/components/travel/TravelFilters';
import DestinationCard from '@/components/travel/DestinationCard';
import DestinationMap from '@/components/travel/DestinationMap';
import { useAuth } from '@/contexts/AuthContext';

// Types for destinations and filters
export type DestinationType = {
  id: string;
  name: string;
  description: string;
  image: string;
  budget: 'Low' | 'Medium' | 'High' | 'Luxury';
  duration: 'Weekend' | '3-5 Days' | '1 Week+';
  locationType: 'Beach' | 'Mountain' | 'City' | 'Rural';
  activities: ('Adventure' | 'Relaxation' | 'Cultural' | 'Family-Friendly')[];
  season: 'Summer' | 'Winter' | 'Spring' | 'Fall' | 'All Year';
  visaRequirement: 'Visa-Free' | 'Visa on Arrival' | 'Requires Visa';
  location: {
    lat: number;
    lng: number;
  };
  popularity: number;
}

export type FilterType = {
  search: string;
  budget: string[];
  duration: string[];
  locationType: string[];
  activities: string[];
  season: string[];
  visaRequirement: string[];
  sortBy: 'popularity' | 'budget' | 'duration';
}

const TravelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL params
  const getInitialFilters = (): FilterType => {
    return {
      search: searchParams.get('search') || '',
      budget: searchParams.get('budget')?.split(',').filter(Boolean) || [],
      duration: searchParams.get('duration')?.split(',').filter(Boolean) || [],
      locationType: searchParams.get('locationType')?.split(',').filter(Boolean) || [],
      activities: searchParams.get('activities')?.split(',').filter(Boolean) || [],
      season: searchParams.get('season')?.split(',').filter(Boolean) || [],
      visaRequirement: searchParams.get('visaRequirement')?.split(',').filter(Boolean) || [],
      sortBy: (searchParams.get('sortBy') as FilterType['sortBy']) || 'popularity',
    };
  };

  const [filters, setFilters] = useState<FilterType>(getInitialFilters());

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    if (filters.search) newParams.set('search', filters.search);
    if (filters.budget.length) newParams.set('budget', filters.budget.join(','));
    if (filters.duration.length) newParams.set('duration', filters.duration.join(','));
    if (filters.locationType.length) newParams.set('locationType', filters.locationType.join(','));
    if (filters.activities.length) newParams.set('activities', filters.activities.join(','));
    if (filters.season.length) newParams.set('season', filters.season.join(','));
    if (filters.visaRequirement.length) newParams.set('visaRequirement', filters.visaRequirement.join(','));
    if (filters.sortBy !== 'popularity') newParams.set('sortBy', filters.sortBy);
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  // Load mock destination data
  useEffect(() => {
    const loadDestinations = () => {
      setLoading(true);
      // Mock data - in a real app this would come from an API
      const mockDestinations: DestinationType[] = [
        {
          id: '1',
          name: 'Bali, Indonesia',
          description: 'Tropical paradise with beautiful beaches, temples, and vibrant culture.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Relaxation', 'Cultural'],
          season: 'All Year',
          visaRequirement: 'Visa on Arrival',
          location: { lat: -8.3405, lng: 115.0920 },
          popularity: 98
        },
        {
          id: '2',
          name: 'Kyoto, Japan',
          description: 'Ancient temples, traditional gardens, and authentic Japanese culture.',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
          budget: 'High',
          duration: '1 Week+',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: 35.0116, lng: 135.7681 },
          popularity: 92
        },
        {
          id: '3',
          name: 'Santorini, Greece',
          description: 'Iconic white buildings with blue domes overlooking the Aegean Sea.',
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
          budget: 'Luxury',
          duration: '3-5 Days',
          locationType: 'Beach',
          activities: ['Relaxation', 'Cultural'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 36.3932, lng: 25.4615 },
          popularity: 95
        },
        {
          id: '4',
          name: 'Banff National Park, Canada',
          description: 'Breathtaking mountain landscapes with turquoise lakes and abundant wildlife.',
          image: 'https://images.unsplash.com/photo-1609790259904-753fcf8544c6',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'Mountain',
          activities: ['Adventure', 'Family-Friendly'],
          season: 'Summer',
          visaRequirement: 'Requires Visa',
          location: { lat: 51.4968, lng: -115.9281 },
          popularity: 90
        },
        {
          id: '5',
          name: 'Marrakech, Morocco',
          description: 'Vibrant markets, historic palaces, and rich Arabic and Berber cultural influence.',
          image: 'https://images.unsplash.com/photo-1597211684565-dca64d72bdfe',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 31.6295, lng: -7.9811 },
          popularity: 87
        },
        {
          id: '6',
          name: 'Tuscany, Italy',
          description: 'Rolling hills, vineyards, medieval towns, and exceptional cuisine.',
          image: 'https://images.unsplash.com/photo-1568797629192-908356a980a4',
          budget: 'High',
          duration: '1 Week+',
          locationType: 'Rural',
          activities: ['Relaxation', 'Cultural', 'Family-Friendly'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 43.7711, lng: 11.2486 },
          popularity: 89
        },
        {
          id: '7',
          name: 'Cape Town, South Africa',
          description: 'Stunning coastal city with mountains, beaches, and diverse cultural attractions.',
          image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'City',
          activities: ['Adventure', 'Cultural', 'Relaxation'],
          season: 'Fall',
          visaRequirement: 'Requires Visa',
          location: { lat: -33.9249, lng: 18.4241 },
          popularity: 88
        },
        {
          id: '8',
          name: 'Costa Rica',
          description: 'Tropical rainforests, wildlife, and breathtaking beaches on two coastlines.',
          image: 'https://images.unsplash.com/photo-1518500148151-77db67557a5d',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Relaxation', 'Family-Friendly'],
          season: 'Winter',
          visaRequirement: 'Visa-Free',
          location: { lat: 9.7489, lng: -83.7534 },
          popularity: 91
        }
      ];
      
      setTimeout(() => {
        setDestinations(mockDestinations);
        setLoading(false);
      }, 800); // Simulate loading time
    };
    
    loadDestinations();
  }, []);

  // Load saved destinations from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`savedDestinations-${user.id}`);
      if (saved) {
        setSavedDestinations(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save destination
  const toggleSaveDestination = (id: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save destinations",
        variant: "destructive"
      });
      return;
    }
    
    const newSavedDestinations = savedDestinations.includes(id)
      ? savedDestinations.filter(destId => destId !== id)
      : [...savedDestinations, id];
    
    setSavedDestinations(newSavedDestinations);
    localStorage.setItem(`savedDestinations-${user.id}`, JSON.stringify(newSavedDestinations));
    
    toast({
      title: savedDestinations.includes(id) ? "Destination Removed" : "Destination Saved",
      description: savedDestinations.includes(id) 
        ? "Destination has been removed from your saved list"
        : "Destination has been saved to your list",
    });
  };

  // Filter destinations based on current filters
  const filteredDestinations = destinations.filter(dest => {
    // Search filter
    if (filters.search && !dest.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !dest.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Budget filter
    if (filters.budget.length > 0 && !filters.budget.includes(dest.budget)) {
      return false;
    }
    
    // Duration filter
    if (filters.duration.length > 0 && !filters.duration.includes(dest.duration)) {
      return false;
    }
    
    // Location type filter
    if (filters.locationType.length > 0 && !filters.locationType.includes(dest.locationType)) {
      return false;
    }
    
    // Activities filter (at least one must match)
    if (filters.activities.length > 0 && 
        !dest.activities.some(activity => filters.activities.includes(activity))) {
      return false;
    }
    
    // Season filter
    if (filters.season.length > 0 && !filters.season.includes(dest.season)) {
      return false;
    }
    
    // Visa requirement filter
    if (filters.visaRequirement.length > 0 && !filters.visaRequirement.includes(dest.visaRequirement)) {
      return false;
    }
    
    return true;
  });

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (filters.sortBy) {
      case 'budget':
        const budgetOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Luxury': 4 };
        return budgetOrder[a.budget] - budgetOrder[b.budget];
      case 'duration':
        const durationOrder = { 'Weekend': 1, '3-5 Days': 2, '1 Week+': 3 };
        return durationOrder[a.duration] - durationOrder[b.duration];
      case 'popularity':
      default:
        return b.popularity - a.popularity;
    }
  });

  // Handle clearing all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      budget: [],
      duration: [],
      locationType: [],
      activities: [],
      season: [],
      visaRequirement: [],
      sortBy: 'popularity'
    });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <motion.div 
      className="min-h-screen bg-travel-sand"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-archivo font-bold text-travel-blue mb-2">
                Discover Your Perfect Destination
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Explore our curated list of amazing destinations around the world. Use the filters to find places that match your preferences.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="border-3 border-black flex items-center gap-2 bg-white hover:bg-gray-100"
                onClick={() => setShowMobileFilters(prev => !prev)}
              >
                <Filter size={16} />
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-3 border-black flex items-center gap-2 bg-white hover:bg-gray-100"
                onClick={() => setShowMap(prev => !prev)}
              >
                <Map size={16} />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by destination name or keyword..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 py-6 border-3 border-black shadow-neo text-lg"
            />
            {filters.search && (
              <Button 
                variant="ghost" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0" 
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Panel */}
            <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="border-3 border-black shadow-neo sticky top-24">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-archivo font-bold">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-travel-blue hover:text-travel-blue/80 p-0 h-auto"
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <TravelFilters 
                    filters={filters} 
                    setFilters={setFilters} 
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Map Section - Only visible when showMap is true */}
              {showMap && (
                <Card className="border-3 border-black shadow-neo mb-6 overflow-hidden">
                  <CardContent className="p-0 h-[400px]">
                    <DestinationMap 
                      destinations={sortedDestinations} 
                      savedDestinations={savedDestinations}
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Results Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {loading ? 'Loading destinations...' : `${sortedDestinations.length} destinations found`}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterType['sortBy'] }))}
                      className="text-sm border-2 border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-travel-blue"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="budget">Budget (Low to High)</option>
                      <option value="duration">Duration (Short to Long)</option>
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="border-3 border-black shadow-neo h-96 animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <CardContent className="p-5">
                          <div className="h-6 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sortedDestinations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border-3 border-black rounded-lg bg-white shadow-neo">
                    <MapPin size={48} className="text-travel-blue mb-4" />
                    <h3 className="text-xl font-bold mb-2">No destinations found</h3>
                    <p className="text-gray-600 text-center max-w-md mb-4">
                      We couldn't find any destinations matching your current filters.
                    </p>
                    <Button onClick={clearAllFilters} className="bg-travel-blue hover:bg-travel-blue/90 text-white">
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedDestinations.map((destination) => (
                      <DestinationCard
                        key={destination.id}
                        destination={destination}
                        isSaved={savedDestinations.includes(destination.id)}
                        onToggleSave={() => toggleSaveDestination(destination.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TravelPage;
