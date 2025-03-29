
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DestinationType } from '@/pages/Travel';
import { useToast } from '@/hooks/use-toast';

interface DestinationMapProps {
  destinations: DestinationType[];
  savedDestinations: string[];
}

const DestinationMap: React.FC<DestinationMapProps> = ({ 
  destinations, 
  savedDestinations 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = (e.currentTarget.elements.namedItem('mapboxToken') as HTMLInputElement)?.value;
    if (token) {
      setMapboxToken(token);
      localStorage.setItem('mapbox_token', token);
    }
  };

  useEffect(() => {
    // Try to get token from localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.5,
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        setMapLoaded(true);
      });
      
      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Could not initialize the map. Please check your Mapbox token.',
        variant: 'destructive'
      });
    }
  }, [mapboxToken, toast]);
  
  // Add markers when map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded || destinations.length === 0) return;
    
    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add markers for each destination
    destinations.forEach(destination => {
      const { location, name, id } = destination;
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'flex flex-col items-center';
      
      const pin = document.createElement('div');
      pin.className = `w-6 h-6 rounded-full flex items-center justify-center ${
        savedDestinations.includes(id) ? 'bg-travel-orange' : 'bg-travel-blue'
      } border-2 border-black cursor-pointer transform transition-transform hover:scale-125`;
      
      // Create popup content
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-travel-blue">${name}</h3>
          <p class="text-sm text-gray-600">${destination.locationType}</p>
          <p class="text-xs mt-1">
            <span class="font-semibold">Budget:</span> ${destination.budget}
          </p>
        </div>
      `);
      
      markerEl.appendChild(pin);
      
      // Add marker to map
      new mapboxgl.Marker(markerEl)
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
    
    // Fit bounds to show all markers if we have destinations
    if (destinations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      destinations.forEach(({ location }) => {
        bounds.extend([location.lng, location.lat]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 5,
        duration: 1000
      });
    }
  }, [mapLoaded, destinations, savedDestinations]);
  
  if (!mapboxToken) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
        <h3 className="text-lg font-bold mb-4">Mapbox API Token Required</h3>
        <p className="text-sm text-gray-600 max-w-md text-center mb-4">
          To display the interactive map, please enter your Mapbox public token. 
          You can get one by signing up at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>.
        </p>
        
        <form onSubmit={handleTokenSubmit} className="w-full max-w-md space-y-4">
          <input
            type="text"
            name="mapboxToken"
            placeholder="Enter your Mapbox public token"
            className="w-full p-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-travel-blue"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-travel-blue text-white rounded font-bold hover:bg-travel-blue/90 transition-colors"
          >
            Save Token & Load Map
          </button>
        </form>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
};

export default DestinationMap;
