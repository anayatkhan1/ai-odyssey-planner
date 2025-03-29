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
import Footer from '@/components/Footer';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import DestinationDetails from '@/components/travel/DestinationDetails';
import TravelChatbot from '@/components/travel/TravelChatbot';

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

const ITEMS_PER_PAGE = 9;

const TravelPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showMap, setShowMap] = useState(false);
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState<DestinationType | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
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
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  useEffect(() => {
    const loadDestinations = () => {
      setLoading(true);
      const mockDestinations: DestinationType[] = [
        {
          id: '1',
          name: 'Bali, Indonesia',
          description: 'Tropical paradise with beautiful beaches, temples, and vibrant culture.',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Relaxation', 'Cultural'],
          season: 'All Year',
          visaRequirement: 'Visa on Arrival',
          location: { lat: -8.3405, lng: 115.0920 },
          popularity: 98
        },
        // ... rest of mock destinations
      ];
      
      setTimeout(() => {
        setDestinations(mockDestinations);
        setLoading(false);
      }, 800);
    };
    
    loadDestinations();
  }, []);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`savedDestinations-${user.id}`);
      if (saved) {
        setSavedDestinations(JSON.parse(saved));
      }
    }
  }, [user]);

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

  const filteredDestinations = destinations.filter(dest => {
    if (filters.search && !dest.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !dest.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.budget.length > 0 && !filters.budget.includes(dest.budget)) {
      return false;
    }
    
    if (filters.duration.length > 0 && !filters.duration.includes(dest.duration)) {
      return false;
    }
    
    if (filters.locationType.length > 0 && !filters.locationType.includes(dest.locationType)) {
      return false;
    }
    
    if (filters.activities.length > 0 && 
        !dest.activities.some(activity => filters.activities.includes(activity))) {
      return false;
    }
    
    if (filters.season.length > 0 && !filters.season.includes(dest.season)) {
      return false;
    }
    
    if (filters.visaRequirement.length > 0 && !filters.visaRequirement.includes(dest.visaRequirement)) {
      return false;
    }
    
    return true;
  });

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const totalPages = Math.ceil(sortedDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = sortedDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDestinationClick = (destination: DestinationType) => {
    setSelectedDestination(destination);
    setShowDetails(true);
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
                onClick={() => setShowMap(prev => !prev)}
              >
                <Map size={16} />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
          </div>
          
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
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <Card className="border-3 border-black shadow-neo sticky top-24">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-archivo font-bold">Filters</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-travel-blue hover:text-travel-blue/80 p-0 h-auto hover:text-black"
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
            
            <div className="lg:w-3/4">
              <Card className="border-3 border-black shadow-neo mb-6 overflow-hidden">
                <CardContent className="p-0 h-[400px]">
                  <DestinationMap 
                    destinations={sortedDestinations} 
                    savedDestinations={savedDestinations}
                  />
                </CardContent>
              </Card>
              
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
                    <Button onClick={clearAllFilters} className="bg-travel-blue hover:bg-travel-blue/90 text-white hover:text-black">
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {paginatedDestinations.map((destination) => (
                        <div key={destination.id} onClick={() => handleDestinationClick(destination)} className="cursor-pointer">
                          <DestinationCard
                            destination={destination}
                            isSaved={savedDestinations.includes(destination.id)}
                            onToggleSave={(e) => {
                              e.stopPropagation();
                              toggleSaveDestination(destination.id);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {sortedDestinations.length > ITEMS_PER_PAGE && (
                      <Pagination className="my-8">
                        <PaginationContent>
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(prev => prev - 1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                              />
                            </PaginationItem>
                          )}
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                              if (i === 4) return (
                                <PaginationItem key="ellipsis-end">
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                              if (i === 0) return (
                                <PaginationItem key="ellipsis-start">
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            } else {
                              if (i === 0) return (
                                <PaginationItem key="ellipsis-start">
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                              if (i === 4) return (
                                <PaginationItem key="ellipsis-end">
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                              pageNumber = currentPage + i - 2;
                            }
                            
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink 
                                  href="#" 
                                  isActive={currentPage === pageNumber}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(pageNumber);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}
                          
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationNext 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(prev => prev + 1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TravelChatbot />
      
      <DestinationDetails 
        destination={selectedDestination}
        isSaved={savedDestinations.includes(selectedDestination.id)}
        onToggleSave={() => toggleSaveDestination(selectedDestination.id)}
        onClose={() => setShowDetails(false)}
      />
      
      <Footer />
    </motion.div>
  );
};

export default TravelPage;
