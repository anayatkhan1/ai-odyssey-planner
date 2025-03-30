
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  Database, 
  FileText, 
  Loader2, 
  Plus, 
  RefreshCw, 
  Save, 
  Search,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Sample travel destination generator
const destinations = [
  "Paris, France", "Kyoto, Japan", "New York City, USA", "Barcelona, Spain", 
  "Bali, Indonesia", "Santorini, Greece", "Rio de Janeiro, Brazil", "Cape Town, South Africa",
  "Sydney, Australia", "Amsterdam, Netherlands", "Bangkok, Thailand", "Rome, Italy",
  "Dubai, UAE", "Marrakech, Morocco", "Vancouver, Canada", "Cusco, Peru",
  "Prague, Czech Republic", "Reykjavik, Iceland", "Seoul, South Korea", "Vienna, Austria",
  "Singapore", "Istanbul, Turkey", "Queenstown, New Zealand", "Edinburgh, Scotland",
  "Dubrovnik, Croatia", "Havana, Cuba", "Machu Picchu, Peru", "Kyiv, Ukraine",
  "Cairo, Egypt", "Siem Reap, Cambodia", "Mumbai, India", "Budapest, Hungary",
  "Stockholm, Sweden", "Bogotá, Colombia", "Mexico City, Mexico", "Hanoi, Vietnam",
  "Zanzibar, Tanzania", "Chiang Mai, Thailand", "Krakow, Poland", "Helsinki, Finland",
  "Lisbon, Portugal", "San Francisco, USA", "Buenos Aires, Argentina", "Nara, Japan",
  "Galápagos Islands, Ecuador", "Berlin, Germany", "Petra, Jordan", "Copenhagen, Denmark",
  "Jerusalem, Israel", "Maui, Hawaii"
];

// Generate detailed info for a destination
function generateDestinationInfo(destination: string) {
  const [city, country] = destination.split(', ');
  const countryPart = country || '';
  
  // General descriptions based on continent/region patterns
  let climateDesc, budgetDesc, culturalDesc, cuisineDesc, attractionsDesc;
  
  // Very simplified pattern matching - in a real app, you'd have a proper database
  if (countryPart.includes('USA') || countryPart.includes('Canada')) {
    climateDesc = "Varies by season with distinct winters and summers. Best visited in late spring or early fall for moderate temperatures.";
    budgetDesc = "Mid to high budget required. Expect to spend $100-200 per day including accommodation, food, and activities.";
    culturalDesc = "Modern, diverse culture with a mix of influences. English is widely spoken.";
    cuisineDesc = "Diverse food scene with international options and local specialties.";
  } else if (countryPart.includes('Japan') || countryPart.includes('Korea') || countryPart.includes('China')) {
    climateDesc = "Four distinct seasons with humid summers and cold winters. Spring (cherry blossom season) and fall (autumn colors) are particularly beautiful.";
    budgetDesc = "Moderate to high budget needed. Daily expenses range from $70-150 depending on your travel style.";
    culturalDesc = "Rich in traditions with unique customs. Learning a few basic phrases in the local language is appreciated.";
    cuisineDesc = "Exquisite culinary traditions focusing on fresh, seasonal ingredients and precise preparation techniques.";
  } else if (countryPart.includes('France') || countryPart.includes('Spain') || countryPart.includes('Italy') || countryPart.includes('Germany')) {
    climateDesc = "Mediterranean climate with warm, dry summers and mild, wet winters. Peak season is June to August, but May and September offer pleasant weather with fewer crowds.";
    budgetDesc = "Moderate budget needed. Daily costs range from €60-150 depending on accommodations and dining choices.";
    culturalDesc = "Rich European heritage with historical architecture, art, and traditions. Multiple languages may be spoken, but English is common in tourist areas.";
    cuisineDesc = "World-renowned culinary traditions with regional specialties, fresh local ingredients, and excellent wine.";
  } else if (countryPart.includes('Thailand') || countryPart.includes('Indonesia') || countryPart.includes('Vietnam') || countryPart.includes('Cambodia')) {
    climateDesc = "Tropical climate with a dry season (November to April) and a rainy season (May to October). The best time to visit is during the dry season.";
    budgetDesc = "Budget-friendly destination. Daily costs can be as low as $30-70 for comfortable travel.";
    culturalDesc = "Deep spiritual traditions, friendly locals, and a relaxed pace of life. Modest dress is recommended when visiting temples.";
    cuisineDesc = "Flavorful cuisine balancing sweet, sour, spicy, and savory elements. Street food is abundant and delicious.";
  } else {
    climateDesc = "Varies by season. Research the best time to visit based on your preferred activities and weather conditions.";
    budgetDesc = "Costs vary widely. Research accommodation, food, and activity prices before traveling to plan your budget accordingly.";
    culturalDesc = "Unique cultural experiences await. Learn about local customs and basic phrases to enhance your visit.";
    cuisineDesc = "Local cuisine offers authentic flavors worth exploring. Try regional specialties and traditional dishes.";
  }
  
  // Generate random attractions based on destination
  const attractions = [
    `The iconic ${city} Museum showcasing local history and art`,
    `The stunning ${city} Park with beautiful gardens and walking paths`,
    `The historic Old Town district with charming architecture`,
    `The bustling ${city} Market selling local crafts and food`,
    `The breathtaking viewpoint overlooking the entire city`
  ];
  
  attractionsDesc = attractions.join('. ') + '.';
  
  // Assemble comprehensive description
  return `${city}${countryPart ? ' in ' + countryPart : ''} is a captivating destination for travelers seeking ${['culture', 'adventure', 'relaxation', 'culinary experiences', 'historical exploration'][Math.floor(Math.random() * 5)]}.

CLIMATE AND BEST TIME TO VISIT: ${climateDesc}

BUDGET CONSIDERATIONS: ${budgetDesc}

CULTURAL INSIGHTS: ${culturalDesc}

LOCAL CUISINE: ${cuisineDesc}

MUST-SEE ATTRACTIONS: ${attractionsDesc}

TRAVEL TIPS: Visitors should ${['bring comfortable walking shoes', 'try the local transportation', 'learn a few phrases of the local language', 'book accommodations in advance', 'be aware of local customs'][Math.floor(Math.random() * 5)]}. ${['Credit cards are widely accepted', 'Cash is preferred for small purchases', 'Tipping is customary', 'Tipping is not expected', 'Bargaining is common in markets'][Math.floor(Math.random() * 5)]}.

ACCOMMODATION OPTIONS: From ${['luxury hotels', 'boutique guesthouses', 'budget hostels', 'vacation rentals', 'unique homestays'][Math.floor(Math.random() * 5)]} to ${['charming bed and breakfasts', 'resort properties', 'serviced apartments', 'eco-lodges', 'historic hotels'][Math.floor(Math.random() * 5)]}, there are options for every budget and preference.`;
}

const TravelDataManager = () => {
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [processedItems, setProcessedItems] = useState(0);
  const [destination, setDestination] = useState('');
  const [content, setContent] = useState('');
  const [existingDestinations, setExistingDestinations] = useState<any[]>([]);
  const [documentsWithEmbeddings, setDocumentsWithEmbeddings] = useState<number>(0);
  const [documentsWithoutEmbeddings, setDocumentsWithoutEmbeddings] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExistingDestinations();
    checkEmbeddingStatus();
  }, []);

  const loadExistingDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_documents')
        .select('id, destination_name, destination_id, embedding')
        .order('destination_name', { ascending: true });

      if (error) throw error;
      setExistingDestinations(data || []);
      
      // Calculate embedding stats
      const withEmbeddings = data?.filter(doc => doc.embedding !== null).length || 0;
      const withoutEmbeddings = data?.filter(doc => doc.embedding === null).length || 0;
      
      setDocumentsWithEmbeddings(withEmbeddings);
      setDocumentsWithoutEmbeddings(withoutEmbeddings);
    } catch (error) {
      console.error('Error loading destinations:', error);
      toast({
        title: "Error loading destinations",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const checkEmbeddingStatus = () => {
    if (documentsWithoutEmbeddings > 0) {
      setStatusMessage(`${documentsWithEmbeddings} of ${documentsWithEmbeddings + documentsWithoutEmbeddings} documents have embeddings`);
    } else if (documentsWithEmbeddings > 0) {
      setStatusMessage(`All ${documentsWithEmbeddings} documents have embeddings`);
    } else {
      setStatusMessage('No documents found. Generate travel data first.');
    }
  };

  const generateAndSaveDestinations = async () => {
    try {
      setIsGeneratingData(true);
      setError(null);
      setProgress(0);
      setTotalItems(destinations.length);
      setProcessedItems(0);
      
      for (let i = 0; i < destinations.length; i++) {
        setStatusMessage(`Generating data for ${destinations[i]} (${i + 1}/${destinations.length})`);
        
        const destinationId = destinations[i].toLowerCase().replace(/[^\w]/g, '-');
        const content = generateDestinationInfo(destinations[i]);
        
        const { error } = await supabase
          .from('travel_documents')
          .insert({
            id: uuidv4(),
            destination_id: destinationId,
            destination_name: destinations[i],
            content: content
          });
          
        if (error) {
          // If it's a duplicate, we'll just continue
          if (error.code === '23505') {
            console.log(`Destination ${destinations[i]} already exists, skipping`);
          } else {
            throw error;
          }
        }
        
        setProcessedItems(i + 1);
        setProgress(Math.round(((i + 1) / destinations.length) * 100));
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      toast({
        title: "Travel data generated",
        description: `${processedItems} destinations have been created or updated`,
      });
      
      // Refresh the destination list
      await loadExistingDestinations();
      checkEmbeddingStatus();
      
    } catch (error) {
      console.error('Error generating destinations:', error);
      setError(error.message);
      toast({
        title: "Error generating destinations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingData(false);
      setStatusMessage('Data generation complete. Generate embeddings next.');
    }
  };

  const generateEmbeddings = async () => {
    try {
      setIsGeneratingEmbeddings(true);
      setError(null);
      setProgress(0);
      
      // Get all documents without embeddings
      const { data: docsWithoutEmbeddings, error: fetchError } = await supabase
        .from('travel_documents')
        .select('id')
        .is('embedding', null);
        
      if (fetchError) throw fetchError;
      
      if (!docsWithoutEmbeddings || docsWithoutEmbeddings.length === 0) {
        toast({
          title: "No documents need embeddings",
          description: "All documents already have embeddings generated",
        });
        setIsGeneratingEmbeddings(false);
        return;
      }
      
      const docIds = docsWithoutEmbeddings.map(doc => doc.id);
      setTotalItems(docIds.length);
      setProcessedItems(0);
      
      // Process in batches to avoid timeout
      const batchSize = 5;
      for (let i = 0; i < docIds.length; i += batchSize) {
        setStatusMessage(`Generating embeddings (batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(docIds.length/batchSize)})`);
        
        const batch = docIds.slice(i, i + batchSize);
        const response = await supabase.functions.invoke('travel-chat', {
          body: {
            action: 'batch_generate_embeddings',
            document_ids: batch
          },
        });
        
        if (response.error) {
          throw new Error(response.error.message || 'Error generating embeddings');
        }
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        const results = response.data.results;
        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;
        
        if (failedCount > 0) {
          console.warn(`${failedCount} embeddings failed in this batch`);
        }
        
        setProcessedItems(prev => prev + batch.length);
        setProgress(Math.round(((i + batch.length) / docIds.length) * 100));
        
        // Wait a bit between batches to avoid rate limiting
        if (i + batchSize < docIds.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      toast({
        title: "Embeddings generated",
        description: `${processedItems} documents now have embeddings`,
      });
      
      // Refresh the destination list and embedding stats
      await loadExistingDestinations();
      checkEmbeddingStatus();
      
    } catch (error) {
      console.error('Error generating embeddings:', error);
      setError(error.message);
      toast({
        title: "Error generating embeddings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEmbeddings(false);
      setStatusMessage('Embedding generation complete. The travel chatbot is ready to use!');
    }
  };

  const saveDestination = async () => {
    if (!destination.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Both destination name and content are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const destinationId = destination.toLowerCase().replace(/[^\w]/g, '-');
      
      const { error } = await supabase
        .from('travel_documents')
        .insert({
          id: uuidv4(),
          destination_id: destinationId,
          destination_name: destination,
          content: content
        });
        
      if (error) throw error;
      
      toast({
        title: "Destination saved",
        description: `${destination} has been added to the database`,
      });
      
      // Clear form
      setDestination('');
      setContent('');
      
      // Refresh the destination list
      await loadExistingDestinations();
      checkEmbeddingStatus();
      
    } catch (error) {
      console.error('Error saving destination:', error);
      toast({
        title: "Error saving destination",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Travel Database Manager
          </CardTitle>
          <CardDescription>
            Generate and manage travel destination data for the AI chatbot
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {documentsWithoutEmbeddings > 0 ? (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              ) : documentsWithEmbeddings > 0 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Info className="h-5 w-5 text-blue-500" />
              )}
              <h3 className="font-medium">Database Status</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{statusMessage}</p>
            
            {(isGeneratingData || isGeneratingEmbeddings) && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress: {processedItems}/{totalItems}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                {error && (
                  <div className="mt-2 text-sm text-red-500">
                    Error: {error}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={generateAndSaveDestinations}
              disabled={isGeneratingData || isGeneratingEmbeddings}
              className="w-full"
            >
              {isGeneratingData ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Data...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate 50 Travel Destinations
                </>
              )}
            </Button>
            
            <Button
              onClick={generateEmbeddings}
              disabled={isGeneratingData || isGeneratingEmbeddings || documentsWithoutEmbeddings === 0}
              className="w-full"
              variant={documentsWithoutEmbeddings > 0 ? "default" : "outline"}
            >
              {isGeneratingEmbeddings ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Embeddings...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Embeddings
                </>
              )}
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Manually Add Destination</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Destination Name</label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Paris, France"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed description of the destination..."
                  rows={6}
                />
              </div>
              
              <Button onClick={saveDestination} disabled={!destination.trim() || !content.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Save Destination
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex flex-col items-start">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Existing Destinations ({existingDestinations.length})
          </h3>
          <div className="max-h-60 overflow-y-auto w-full">
            {existingDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {existingDestinations.map((dest) => (
                  <div key={dest.id} className="text-sm py-1 px-2 rounded flex items-center gap-1">
                    {dest.destination_name}
                    {dest.embedding ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No destinations yet. Generate or add some!</p>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        <h3 className="font-medium flex items-center gap-1 mb-1">
          <FileText className="h-4 w-4" />
          How This Works
        </h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li>First, generate 50 sample travel destinations for the database (or add your own)</li>
          <li>Then, generate embeddings for all destinations (this powers the similarity search)</li>
          <li>Once embeddings are generated, the AI chatbot can provide personalized recommendations</li>
          <li>Test it out by asking questions about travel in the chat interface!</li>
        </ol>
      </div>
    </div>
  );
};

export default TravelDataManager;
