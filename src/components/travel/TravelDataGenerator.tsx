
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DestinationType } from '@/pages/Travel';
import { Sparkles, Database, Trash, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const TravelDataGenerator = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'ready'>('checking');
  const [statusMessage, setStatusMessage] = useState('');
  const [docsCount, setDocsCount] = useState(0);
  const [embedsCount, setEmbedsCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check database status when component mounts
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setStatus('checking');
    setStatusMessage('Checking database status...');
    
    try {
      // Check if we have documents and how many have embeddings
      const { count: totalDocs, error: countError } = await supabase
        .from('travel_documents')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const { count: embedsCount, error: embedsError } = await supabase
        .from('travel_documents')
        .select('*', { count: 'exact', head: true })
        .not('embedding', 'is', null);
      
      if (embedsError) throw embedsError;
      
      setDocsCount(totalDocs || 0);
      setEmbedsCount(embedsCount || 0);
      setLastChecked(new Date());
      
      if (totalDocs === 0) {
        setStatus('idle');
        setStatusMessage('No documents found. Generate test data to continue.');
      } else if (embedsCount < totalDocs) {
        setStatus('error');
        setStatusMessage(`Found ${totalDocs} documents but only ${embedsCount} have embeddings. Generate embeddings to complete setup.`);
      } else {
        setStatus('ready');
        setStatusMessage(`RAG system ready with ${totalDocs} documents and ${embedsCount} embeddings.`);
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      setStatus('error');
      setStatusMessage('Failed to check database status. See console for details.');
    }
  };

  const generateDestinationDocument = (destination: DestinationType): string => {
    return `
Destination: ${destination.name}
Description: ${destination.description}
Budget: ${destination.budget}
Duration: ${destination.duration}
Location Type: ${destination.locationType}
Activities: ${destination.activities.join(', ')}
Season: ${destination.season}
Visa Requirement: ${destination.visaRequirement}
Popularity Score: ${destination.popularity}/100

${destination.name} is a ${destination.locationType.toLowerCase()} destination ideal for ${destination.activities.map(a => a.toLowerCase()).join(' and ')} activities. 
It's best visited during ${destination.season} and requires a budget in the ${destination.budget.toLowerCase()} range. 
A typical visit lasts ${destination.duration}. The destination has a popularity score of ${destination.popularity}/100 among travelers.
The visa requirement is: ${destination.visaRequirement}.
`.trim();
  };

  const generateRealTravelDestinations = (): DestinationType[] => {
    const destinations: DestinationType[] = [
      {
        id: "1",
        name: "Bali, Indonesia",
        description: "Tropical paradise with beautiful beaches, rich culture, and spiritual temples surrounded by lush rice terraces.",
        image: "https://example.com/bali.jpg",
        budget: "Medium",
        duration: "1 Week+",
        locationType: "Beach",
        activities: ["Adventure", "Relaxation", "Cultural"],
        season: "All Year",
        visaRequirement: "Visa on Arrival",
        location: { lat: -8.4095, lng: 115.1889 },
        popularity: 95,
      },
      {
        id: "2",
        name: "Kyoto, Japan",
        description: "Ancient capital with thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.",
        image: "https://example.com/kyoto.jpg",
        budget: "High",
        duration: "1 Week+",
        locationType: "City",
        activities: ["Cultural", "Family-Friendly"],
        season: "Spring",
        visaRequirement: "Requires Visa",
        location: { lat: 35.0116, lng: 135.7681 },
        popularity: 89,
      },
      {
        id: "3",
        name: "Santorini, Greece",
        description: "Stunning island with white-washed buildings, blue-domed churches overlooking the Aegean Sea and famous sunsets.",
        image: "https://example.com/santorini.jpg",
        budget: "Luxury",
        duration: "3-5 Days",
        locationType: "Beach",
        activities: ["Relaxation", "Cultural"],
        season: "Summer",
        visaRequirement: "Visa-Free",
        location: { lat: 36.3932, lng: 25.4615 },
        popularity: 92,
      },
      {
        id: "4",
        name: "Machu Picchu, Peru",
        description: "Ancient Incan citadel set high in the Andes Mountains, featuring amazing stone architecture and breathtaking views.",
        image: "https://example.com/machupicchu.jpg",
        budget: "Medium",
        duration: "3-5 Days",
        locationType: "Mountain",
        activities: ["Adventure", "Cultural"],
        season: "Winter",
        visaRequirement: "Visa-Free",
        location: { lat: -13.1631, lng: -72.5450 },
        popularity: 88,
      },
      {
        id: "5",
        name: "Barcelona, Spain",
        description: "Vibrant city with stunning architecture by Gaudi, Mediterranean beaches, and world-class dining and nightlife.",
        image: "https://example.com/barcelona.jpg",
        budget: "Medium",
        duration: "3-5 Days",
        locationType: "City",
        activities: ["Cultural", "Family-Friendly"],
        season: "All Year",
        visaRequirement: "Visa-Free",
        location: { lat: 41.3851, lng: 2.1734 },
        popularity: 90,
      }
    ];
    
    // Create 45 more destinations to reach a total of 50
    const locationTypes = ["Beach", "Mountain", "City", "Rural"];
    const seasons = ["Summer", "Winter", "Spring", "Fall", "All Year"];
    const budgets = ["Low", "Medium", "High", "Luxury"];
    const durations = ["Weekend", "3-5 Days", "1 Week+"];
    const visaRequirements = ["Visa-Free", "Visa on Arrival", "Requires Visa"];
    const activityOptions = ["Adventure", "Relaxation", "Cultural", "Family-Friendly"];
    
    const countries = [
      "France", "Italy", "United States", "Thailand", "Australia", "New Zealand", "Canada", 
      "Mexico", "Brazil", "Argentina", "South Africa", "Egypt", "Morocco", "Kenya", "India", 
      "China", "Russia", "United Kingdom", "Germany", "Portugal", "Croatia", "Vietnam", 
      "Cambodia", "Malaysia", "Philippines", "Switzerland", "Iceland", "Norway", "Sweden", 
      "Finland", "Turkey", "UAE", "Singapore", "Costa Rica", "Colombia", "Chile", "Ecuador", 
      "Peru", "Bolivia", "Nepal", "Tanzania", "Ireland", "Scotland", "Austria", "Czech Republic"
    ];
    
    for (let i = 6; i <= 50; i++) {
      const countryIndex = i - 6;
      const country = countries[countryIndex];
      
      // Generate more realistic destination data
      destinations.push({
        id: i.toString(),
        name: `${["Amazing", "Beautiful", "Stunning", "Charming", "Historic"][Math.floor(Math.random() * 5)]} ${country}`,
        description: `${country} offers ${["breathtaking landscapes", "rich cultural experiences", "wonderful cuisine", "historic sites", "unforgettable adventures"][Math.floor(Math.random() * 5)]} and ${["friendly locals", "perfect weather", "unique traditions", "amazing wildlife", "architectural wonders"][Math.floor(Math.random() * 5)]}.`,
        image: `https://example.com/image${i}.jpg`,
        budget: budgets[Math.floor(Math.random() * budgets.length)] as any,
        duration: durations[Math.floor(Math.random() * durations.length)] as any,
        locationType: locationTypes[Math.floor(Math.random() * locationTypes.length)] as any,
        activities: [activityOptions[Math.floor(Math.random() * activityOptions.length)]] as any,
        season: seasons[Math.floor(Math.random() * seasons.length)] as any,
        visaRequirement: visaRequirements[Math.floor(Math.random() * visaRequirements.length)] as any,
        location: {
          lat: (Math.random() * 180 - 90),
          lng: (Math.random() * 360 - 180),
        },
        popularity: Math.floor(Math.random() * 100),
      });
    }
    
    return destinations;
  };

  const populateDatabase = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Check if we already have documents
      const { count, error: countError } = await supabase
        .from('travel_documents')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast({
          title: "Data already exists",
          description: `Found ${count} documents in the database. Clear them first if you want to regenerate.`,
        });
        setIsLoading(false);
        return;
      }
      
      // Get all destinations for seeding
      const destinations = generateRealTravelDestinations();
      
      // For each destination, create a document
      const insertPromises = [];
      for (let i = 0; i < destinations.length; i++) {
        const destination = destinations[i];
        const content = generateDestinationDocument(destination);
        
        // Insert into travel_documents (without embedding for now)
        const promise = supabase.from('travel_documents').insert({
          destination_id: destination.id,
          destination_name: destination.name,
          content: content,
          // Embeddings will be added later
        });
        
        insertPromises.push(promise);
        
        // Update progress every 5 destinations
        if (i % 5 === 0 || i === destinations.length - 1) {
          setProgress(Math.floor(((i + 1) / destinations.length) * 100));
        }
      }
      
      // Wait for all inserts to complete
      const results = await Promise.all(insertPromises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        console.error("Some inserts failed:", errors);
        toast({
          title: "Partial Success",
          description: `Created some travel documents but encountered ${errors.length} errors.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: `Created ${destinations.length} travel documents in the database.`,
        });
      }

      // Update status
      await checkDatabaseStatus();
    } catch (error) {
      console.error('Error populating database:', error);
      toast({
        title: "Error",
        description: "Failed to populate the database. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    setProgress(0);
    
    try {
      // Get all documents without embeddings
      const { data, error } = await supabase
        .from('travel_documents')
        .select('id, content')
        .is('embedding', null);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "No documents found",
          description: "No documents found that need embeddings. Try generating travel data first.",
        });
        setIsGeneratingEmbeddings(false);
        return;
      }
      
      toast({
        title: "Processing",
        description: `Found ${data.length} documents that need embeddings. This might take a while...`,
      });
      
      let successCount = 0;
      let failCount = 0;
      
      // For each document, call the edge function to generate embeddings
      // Process in batches of 5 to avoid overwhelming the API
      const batchSize = 1; // Process one at a time to reduce load
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        for (const document of batch) {
          try {
            // Call edge function to generate embeddings
            const { error: fnError, data: fnData } = await supabase.functions.invoke('travel-chat', {
              body: {
                action: 'generate_embedding',
                document_id: document.id,
                content: document.content
              },
            });
            
            if (fnError) {
              console.error('Error generating embedding:', fnError);
              failCount++;
              continue; // Continue with other documents even if one fails
            }
            
            if (fnData && fnData.success) {
              successCount++;
              
              // Update toast every 5 successful generations
              if (successCount % 5 === 0) {
                toast({
                  title: "Progress Update",
                  description: `Generated ${successCount} embeddings so far...`,
                });
              }
            } else {
              console.error('Failed to generate embedding:', fnData?.error || 'Unknown error');
              failCount++;
            }
          } catch (e) {
            console.error('Exception generating embedding:', e);
            failCount++;
          }
        }
        
        // Update progress
        setProgress(Math.floor(((i + batchSize) / data.length) * 100));
        
        // Brief pause to not overwhelm the API
        if (i + batchSize < data.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (successCount > 0) {
        toast({
          title: "Success!",
          description: `Generated embeddings for ${successCount} documents.${failCount > 0 ? ` Failed: ${failCount}` : ''}`,
        });
      } else {
        toast({
          title: "Failed",
          description: "Could not generate any embeddings. Check that your Anthropic API key is configured.",
          variant: "destructive",
        });
      }
      
      // Update status
      await checkDatabaseStatus();
    } catch (error) {
      console.error('Error generating embeddings:', error);
      toast({
        title: "Error",
        description: "Failed to generate embeddings. Check that your Anthropic API key is configured correctly.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  const clearDatabase = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('travel_documents').delete().neq('id', 'placeholder');
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "All travel documents have been removed from the database.",
      });
      
      // Update status
      await checkDatabaseStatus();
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear the database. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'checking': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-8 border-3 border-black shadow-neo">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-travel-blue" />
          Travel RAG System Data Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-md border ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {status === 'ready' ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              )}
              <h3 className="font-medium">
                {status === 'ready' ? 'System Ready' : 
                 status === 'error' ? 'Action Required' : 
                 'Checking Status'}
              </h3>
            </div>
            {lastChecked && (
              <span className="text-xs text-gray-500">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>
          <p className="text-sm">
            {statusMessage}
          </p>
        </div>
        
        <p className="text-sm text-gray-600">
          Use these tools to populate the travel documents database for RAG system testing.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={populateDatabase}
            disabled={isLoading || isGeneratingEmbeddings}
            className="bg-travel-blue hover:bg-travel-blue/90 flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {isLoading ? 'Generating...' : 'Generate Test Data'}
          </Button>
          
          <Button
            onClick={generateEmbeddings}
            disabled={isLoading || isGeneratingEmbeddings || docsCount === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingEmbeddings ? 'Processing...' : 'Generate Embeddings'}
          </Button>
          
          <Button
            onClick={clearDatabase}
            variant="outline"
            disabled={isLoading || isGeneratingEmbeddings || docsCount === 0}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
            Clear Database
          </Button>
          
          <Button
            onClick={checkDatabaseStatus}
            variant="outline"
            disabled={isLoading || isGeneratingEmbeddings}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>
        
        {(progress > 0) && (
          <div className="w-full">
            <div className="mb-2 text-xs text-gray-600 flex justify-between">
              <span>{isGeneratingEmbeddings ? 'Generating embeddings...' : 'Creating documents...'}</span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <p className="font-medium mb-1 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            How the RAG System Works
          </p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Generate test data to create travel documents</li>
            <li>Generate embeddings to enable semantic search</li>
            <li>Use the travel chat to ask questions about destinations</li>
            <li>The system will retrieve relevant information and provide informed responses</li>
          </ol>
          <p className="mt-2 text-xs text-amber-700">
            Note: For the RAG functionality to work, you need to add the Anthropic API key in your project settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelDataGenerator;
