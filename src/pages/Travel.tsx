
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
    
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    
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
        {
          id: '2',
          name: 'Kyoto, Japan',
          description: 'Ancient temples, traditional gardens, and authentic Japanese culture.',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800',
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
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800',
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
          image: 'https://images.unsplash.com/photo-1609790259904-753fcf8544c6?auto=format&fit=crop&w=800',
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
          image: 'https://images.unsplash.com/photo-1597211684565-dca64d72bdfe?auto=format&fit=crop&w=800',
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
          image: 'https://images.unsplash.com/photo-1568797629192-908356a980a4?auto=format&fit=crop&w=800',
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
          image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800',
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
          image: 'https://images.unsplash.com/photo-1518500148151-77db67557a5d?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Relaxation', 'Family-Friendly'],
          season: 'Winter',
          visaRequirement: 'Visa-Free',
          location: { lat: 9.7489, lng: -83.7534 },
          popularity: 91
        },
        {
          id: '9',
          name: 'Swiss Alps, Switzerland',
          description: 'Majestic mountain peaks, charming villages, and world-class skiing opportunities.',
          image: 'https://images.unsplash.com/photo-1531498252044-5ecd8ce65bd9?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '1 Week+',
          locationType: 'Mountain',
          activities: ['Adventure', 'Relaxation'],
          season: 'Winter',
          visaRequirement: 'Visa-Free',
          location: { lat: 46.8182, lng: 8.2275 },
          popularity: 93
        },
        {
          id: '10',
          name: 'Prague, Czech Republic',
          description: 'Fairy-tale architecture, cobblestone streets, and rich history in every corner.',
          image: 'https://images.unsplash.com/photo-1562624475-96c2bc8fff5e?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 50.0755, lng: 14.4378 },
          popularity: 88
        },
        {
          id: '11',
          name: 'Petra, Jordan',
          description: 'Ancient city carved into rose-colored rock with breathtaking archaeological wonders.',
          image: 'https://images.unsplash.com/photo-1569528619797-50daa0ec2beb?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'Rural',
          activities: ['Adventure', 'Cultural'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: 30.3285, lng: 35.4444 },
          popularity: 86
        },
        {
          id: '12',
          name: 'Machu Picchu, Peru',
          description: 'Iconic Incan citadel set amidst breathtaking mountain scenery.',
          image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '1 Week+',
          locationType: 'Mountain',
          activities: ['Adventure', 'Cultural'],
          season: 'Winter',
          visaRequirement: 'Requires Visa',
          location: { lat: -13.1631, lng: -72.5450 },
          popularity: 94
        },
        {
          id: '13',
          name: 'Amalfi Coast, Italy',
          description: 'Dramatic coastline with colorful villages perched on cliffs above the Mediterranean.',
          image: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '3-5 Days',
          locationType: 'Beach',
          activities: ['Relaxation', 'Cultural'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 40.6340, lng: 14.6027 },
          popularity: 92
        },
        {
          id: '14',
          name: 'Amsterdam, Netherlands',
          description: 'Picturesque canals, historic architecture, and world-class museums.',
          image: 'https://images.unsplash.com/photo-1576924542622-772ced3b14a1?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 52.3676, lng: 4.9041 },
          popularity: 89
        },
        {
          id: '15',
          name: 'Serengeti National Park, Tanzania',
          description: 'Vast plains with spectacular wildlife and the annual Great Migration.',
          image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '1 Week+',
          locationType: 'Rural',
          activities: ['Adventure', 'Family-Friendly'],
          season: 'Winter',
          visaRequirement: 'Requires Visa',
          location: { lat: -2.3333, lng: 34.8333 },
          popularity: 90
        },
        {
          id: '16',
          name: 'New York City, USA',
          description: 'Iconic skyline, cultural diversity, and world-class entertainment and dining.',
          image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure', 'Family-Friendly'],
          season: 'All Year',
          visaRequirement: 'Requires Visa',
          location: { lat: 40.7128, lng: -74.0060 },
          popularity: 95
        },
        {
          id: '17',
          name: 'Queenstown, New Zealand',
          description: 'Adventure capital surrounded by dramatic mountains and stunning lake views.',
          image: 'https://images.unsplash.com/photo-1589196728426-9961babf2b9c?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'Mountain',
          activities: ['Adventure', 'Relaxation'],
          season: 'Summer',
          visaRequirement: 'Requires Visa',
          location: { lat: -45.0312, lng: 168.6626 },
          popularity: 87
        },
        {
          id: '18',
          name: 'Dubrovnik, Croatia',
          description: 'Ancient walled city with marble streets and stunning Adriatic Sea views.',
          image: 'https://images.unsplash.com/photo-1580847097346-72d80f164702?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 42.6507, lng: 18.0944 },
          popularity: 88
        },
        {
          id: '19',
          name: 'Phuket, Thailand',
          description: 'Tropical beaches, clear waters, and vibrant nightlife.',
          image: 'https://images.unsplash.com/photo-1589394723503-30515e00d2ea?auto=format&fit=crop&w=800',
          budget: 'Low',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Relaxation', 'Adventure'],
          season: 'Winter',
          visaRequirement: 'Visa on Arrival',
          location: { lat: 7.9519, lng: 98.3381 },
          popularity: 89
        },
        {
          id: '20',
          name: 'Venice, Italy',
          description: 'Romantic canal city with historic architecture and no cars.',
          image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 45.4408, lng: 12.3155 },
          popularity: 91
        },
        {
          id: '21',
          name: 'Rio de Janeiro, Brazil',
          description: 'Stunning beaches, iconic Christ the Redeemer statue, and vibrant culture.',
          image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Cultural', 'Relaxation'],
          season: 'Summer',
          visaRequirement: 'Requires Visa',
          location: { lat: -22.9068, lng: -43.1729 },
          popularity: 90
        },
        {
          id: '22',
          name: 'Reykjavik, Iceland',
          description: 'Gateway to dramatic landscapes, hot springs, and the Northern Lights.',
          image: 'https://images.unsplash.com/photo-1608668554614-eb4b8e81995c?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Adventure', 'Relaxation'],
          season: 'Winter',
          visaRequirement: 'Visa-Free',
          location: { lat: 64.1466, lng: -21.9426 },
          popularity: 87
        },
        {
          id: '23',
          name: 'Great Barrier Reef, Australia',
          description: 'World\'s largest coral reef system with incredible marine diversity.',
          image: 'https://images.unsplash.com/photo-1633616565486-552d88506691?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'Beach',
          activities: ['Adventure', 'Relaxation', 'Family-Friendly'],
          season: 'Fall',
          visaRequirement: 'Requires Visa',
          location: { lat: -18.2871, lng: 147.6992 },
          popularity: 93
        },
        {
          id: '24',
          name: 'Siem Reap, Cambodia',
          description: 'Ancient temples of Angkor Wat surrounded by lush jungles.',
          image: 'https://images.unsplash.com/photo-1572551767996-11e3ce56ed0c?auto=format&fit=crop&w=800',
          budget: 'Low',
          duration: '3-5 Days',
          locationType: 'Rural',
          activities: ['Cultural', 'Adventure'],
          season: 'Winter',
          visaRequirement: 'Visa on Arrival',
          location: { lat: 13.3633, lng: 103.8600 },
          popularity: 88
        },
        {
          id: '25',
          name: 'Budapest, Hungary',
          description: 'Historic thermal baths, stunning architecture, and vibrant nightlife.',
          image: 'https://images.unsplash.com/photo-1570295395545-233d6c3df36c?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 47.4979, lng: 19.0402 },
          popularity: 87
        },
        {
          id: '26',
          name: 'Maldives',
          description: 'Pristine white-sand beaches and overwater bungalows in crystal-clear turquoise waters.',
          image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Relaxation', 'Adventure'],
          season: 'Winter',
          visaRequirement: 'Visa on Arrival',
          location: { lat: 3.2028, lng: 73.2207 },
          popularity: 94
        },
        {
          id: '27',
          name: 'Barcelona, Spain',
          description: 'Unique Gaudí architecture, lively streets, and beautiful Mediterranean beaches.',
          image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation', 'Family-Friendly'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 41.3851, lng: 2.1734 },
          popularity: 92
        },
        {
          id: '28',
          name: 'Cape Winelands, South Africa',
          description: 'Scenic vineyards producing world-class wines with mountain backdrops.',
          image: 'https://images.unsplash.com/photo-1576687010304-c80df5214b5e?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'Rural',
          activities: ['Relaxation', 'Cultural'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: -33.9100, lng: 18.7257 },
          popularity: 85
        },
        {
          id: '29',
          name: 'Kyrgyzstan',
          description: 'Untouched mountain landscapes, nomadic culture, and pristine alpine lakes.',
          image: 'https://images.unsplash.com/photo-1564501434889-df54012e8c85?auto=format&fit=crop&w=800',
          budget: 'Low',
          duration: '1 Week+',
          locationType: 'Mountain',
          activities: ['Adventure', 'Cultural'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 41.2044, lng: 74.7661 },
          popularity: 82
        },
        {
          id: '30',
          name: 'Cairo, Egypt',
          description: 'Ancient pyramids, the Sphinx, and thousands of years of history.',
          image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure'],
          season: 'Winter',
          visaRequirement: 'Visa on Arrival',
          location: { lat: 30.0444, lng: 31.2357 },
          popularity: 89
        },
        {
          id: '31',
          name: 'Patagonia, Argentina & Chile',
          description: 'Dramatic landscapes with glacier-carved peaks, pristine lakes, and wild forests.',
          image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '1 Week+',
          locationType: 'Mountain',
          activities: ['Adventure', 'Relaxation'],
          season: 'Summer',
          visaRequirement: 'Requires Visa',
          location: { lat: -50.3402, lng: -72.2606 },
          popularity: 90
        },
        {
          id: '32',
          name: 'Istanbul, Turkey',
          description: 'Historic metropolis spanning two continents with grand mosques and bazaars.',
          image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: 41.0082, lng: 28.9784 },
          popularity: 91
        },
        {
          id: '33',
          name: 'Galápagos Islands, Ecuador',
          description: 'Unique wildlife and diverse landscapes that inspired Darwin\'s theory of evolution.',
          image: 'https://images.unsplash.com/photo-1560104358-c8b4f939b389?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Family-Friendly'],
          season: 'All Year',
          visaRequirement: 'Requires Visa',
          location: { lat: -0.7393, lng: -90.5107 },
          popularity: 93
        },
        {
          id: '34',
          name: 'Hoi An, Vietnam',
          description: 'Ancient town with colorful lanterns, rich cultural heritage, and beautiful beaches nearby.',
          image: 'https://images.unsplash.com/photo-1559592892-04a218513b15?auto=format&fit=crop&w=800',
          budget: 'Low',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Winter',
          visaRequirement: 'Requires Visa',
          location: { lat: 15.8800, lng: 108.3380 },
          popularity: 86
        },
        {
          id: '35',
          name: 'Dubai, UAE',
          description: 'Futuristic architecture, luxury shopping, and desert adventures.',
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Adventure', 'Relaxation', 'Family-Friendly'],
          season: 'Winter',
          visaRequirement: 'Visa on Arrival',
          location: { lat: 25.2048, lng: 55.2708 },
          popularity: 92
        },
        {
          id: '36',
          name: 'Lisbon, Portugal',
          description: 'Historic trams, colorful buildings, and delicious cuisine on seven hills.',
          image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 38.7223, lng: -9.1393 },
          popularity: 88
        },
        {
          id: '37',
          name: 'Hawaii, USA',
          description: 'Volcanic landscapes, tropical beaches, and vibrant Polynesian culture.',
          image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Adventure', 'Relaxation', 'Cultural'],
          season: 'All Year',
          visaRequirement: 'Requires Visa',
          location: { lat: 19.8968, lng: -155.5828 },
          popularity: 93
        },
        {
          id: '38',
          name: 'Chiang Mai, Thailand',
          description: 'Mountain temples, traditional crafts, and elephant sanctuaries.',
          image: 'https://images.unsplash.com/photo-1599998372309-3ac6a29f6da9?auto=format&fit=crop&w=800',
          budget: 'Low',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure'],
          season: 'Winter',
          visaRequirement: 'Visa on Arrival',
          location: { lat: 18.7883, lng: 98.9853 },
          popularity: 86
        },
        {
          id: '39',
          name: 'Lake Como, Italy',
          description: 'Stunning alpine lake with elegant historic villas and mountain views.',
          image: 'https://images.unsplash.com/photo-1583426446939-001a77a5cf16?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '3-5 Days',
          locationType: 'Rural',
          activities: ['Relaxation', 'Cultural'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 45.9865, lng: 9.2642 },
          popularity: 88
        },
        {
          id: '40',
          name: 'Aruba',
          description: 'White-sand beaches, turquoise waters, and constant warm weather.',
          image: 'https://images.unsplash.com/photo-1552074284-5e55a0742403?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Relaxation', 'Adventure'],
          season: 'All Year',
          visaRequirement: 'Requires Visa',
          location: { lat: 12.5211, lng: -69.9683 },
          popularity: 89
        },
        {
          id: '41',
          name: 'Mexico City, Mexico',
          description: 'Vibrant cultural scene, ancient ruins, and world-class cuisine.',
          image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Adventure'],
          season: 'Fall',
          visaRequirement: 'Visa-Free',
          location: { lat: 19.4326, lng: -99.1332 },
          popularity: 87
        },
        {
          id: '42',
          name: 'Cinque Terre, Italy',
          description: 'Five colorful fishing villages perched on dramatic coastal cliffs.',
          image: 'https://images.unsplash.com/photo-1538150222340-865aecd586c0?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'Beach',
          activities: ['Relaxation', 'Cultural'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 44.1278, lng: 9.7128 },
          popularity: 90
        },
        {
          id: '43',
          name: 'Marfa, Texas, USA',
          description: 'Minimalist art installations and stargazing in a quirky desert town.',
          image: 'https://images.unsplash.com/photo-1620651509868-de6e554af15c?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: 'Weekend',
          locationType: 'Rural',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: 30.3095, lng: -104.0205 },
          popularity: 80
        },
        {
          id: '44',
          name: 'Seoul, South Korea',
          description: 'High-tech metropolis with ancient palaces, street food, and K-culture.',
          image: 'https://images.unsplash.com/photo-1538485399081-7a534a0b6a83?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'City',
          activities: ['Cultural', 'Adventure', 'Family-Friendly'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: 37.5665, lng: 126.9780 },
          popularity: 89
        },
        {
          id: '45',
          name: 'Seychelles',
          description: 'Pristine beaches, giant tortoises, and lush tropical forests.',
          image: 'https://images.unsplash.com/photo-1555380541-a35b91a55760?auto=format&fit=crop&w=800',
          budget: 'Luxury',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Relaxation', 'Adventure'],
          season: 'All Year',
          visaRequirement: 'Visa-Free',
          location: { lat: -4.6796, lng: 55.4920 },
          popularity: 91
        },
        {
          id: '46',
          name: 'Dublin, Ireland',
          description: 'Literary heritage, historic pubs, and friendly locals.',
          image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 53.3498, lng: -6.2603 },
          popularity: 86
        },
        {
          id: '47',
          name: 'Lake District, UK',
          description: 'Scenic hiking trails, charming villages, and peaceful lakes.',
          image: 'https://images.unsplash.com/photo-1628456712608-1bea558e39b5?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'Rural',
          activities: ['Adventure', 'Relaxation'],
          season: 'Summer',
          visaRequirement: 'Visa-Free',
          location: { lat: 54.4609, lng: -3.0886 },
          popularity: 84
        },
        {
          id: '48',
          name: 'Zanzibar, Tanzania',
          description: 'White-sand beaches, historic Stone Town, and spice plantations.',
          image: 'https://images.unsplash.com/photo-1589381855733-8dede5e35e2d?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '1 Week+',
          locationType: 'Beach',
          activities: ['Relaxation', 'Cultural', 'Adventure'],
          season: 'Winter',
          visaRequirement: 'Requires Visa',
          location: { lat: -6.1659, lng: 39.2026 },
          popularity: 85
        },
        {
          id: '49',
          name: 'Vienna, Austria',
          description: 'Imperial palaces, classical music heritage, and café culture.',
          image: 'https://images.unsplash.com/photo-1516550893885-7b92a975c667?auto=format&fit=crop&w=800',
          budget: 'High',
          duration: '3-5 Days',
          locationType: 'City',
          activities: ['Cultural', 'Relaxation'],
          season: 'Spring',
          visaRequirement: 'Visa-Free',
          location: { lat: 48.2082, lng: 16.3738 },
          popularity: 88
        },
        {
          id: '50',
          name: 'Cappadocia, Turkey',
          description: 'Unique rock formations, cave dwellings, and hot air balloon rides.',
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800',
          budget: 'Medium',
          duration: '3-5 Days',
          locationType: 'Rural',
          activities: ['Adventure', 'Cultural'],
          season: 'Spring',
          visaRequirement: 'Requires Visa',
          location: { lat: 38.6431, lng: 34.8283 },
          popularity: 90
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

  // Pagination
  const totalPages = Math.ceil(sortedDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = sortedDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle destination click
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
            {/* Filters Panel - Always visible */}
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
                              e.stopPropagation(); // Prevent card click when saving
                              toggleSaveDestination(destination.id);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
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
      
      {/* Destination Details Modal */}
      {showDetails && selectedDestination && (
        <DestinationDetails 
          destination={selectedDestination}
          isSaved={savedDestinations.includes(selectedDestination.id)}
          onToggleSave={() => toggleSaveDestination(selectedDestination.id)}
          onClose={() => setShowDetails(false)}
        />
      )}
      
      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default TravelPage;
