
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DestinationType } from '@/pages/Travel';
import { Sparkles, Database, Trash, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TravelDataGenerator = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'ready'>('checking');
  const [statusMessage, setStatusMessage] = useState('');
  const [docsCount, setDocsCount] = useState(0);
  const [embedsCount, setEmbedsCount] = useState(0);

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
      const mockedDestinations: DestinationType[] = [];
      
      // Create random destinations
      for (let i = 1; i <= 50; i++) {
        mockedDestinations.push({
          id: i.toString(),
          name: `Destination ${i}`,
          description: `${['Beautiful', 'Amazing', 'Scenic', 'Historic', 'Cultural'][Math.floor(Math.random() * 5)]} destination with ${['beaches', 'mountains', 'forests', 'museums', 'nightlife'][Math.floor(Math.random() * 5)]} and ${['great food', 'friendly locals', 'affordable accommodations', 'luxury resorts', 'outdoor adventures'][Math.floor(Math.random() * 5)]}.`,
          image: `https://example.com/image${i}.jpg`,
          budget: ['Low', 'Medium', 'High', 'Luxury'][Math.floor(Math.random() * 4)] as any,
          duration: ['Weekend', '3-5 Days', '1 Week+'][Math.floor(Math.random() * 3)] as any,
          locationType: ['Beach', 'Mountain', 'City', 'Rural'][Math.floor(Math.random() * 4)] as any,
          activities: [['Adventure', 'Relaxation', 'Cultural', 'Family-Friendly'][Math.floor(Math.random() * 4)]] as any,
          season: ['Summer', 'Winter', 'Spring', 'Fall', 'All Year'][Math.floor(Math.random() * 5)] as any,
          visaRequirement: ['Visa-Free', 'Visa on Arrival', 'Requires Visa'][Math.floor(Math.random() * 3)] as any,
          location: {
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180,
          },
          popularity: Math.floor(Math.random() * 100),
        });
      }
      
      // For each destination, create a document
      for (let i = 0; i < mockedDestinations.length; i++) {
        const destination = mockedDestinations[i];
        const content = generateDestinationDocument(destination);
        
        // Insert into travel_documents (without embedding for now)
        const { error } = await supabase.from('travel_documents').insert({
          destination_id: destination.id,
          destination_name: destination.name,
          content: content,
          // Embeddings will be added later
        });
        
        if (error) throw error;
        
        // Update progress
        setProgress(Math.floor(((i + 1) / mockedDestinations.length) * 100));
      }
      
      toast({
        title: "Success!",
        description: `Created ${mockedDestinations.length} travel documents in the database.`,
      });

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
      for (let i = 0; i < data.length; i++) {
        const document = data[i];
        
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
          } else {
            console.error('Failed to generate embedding:', fnData?.error || 'Unknown error');
            failCount++;
          }
        } catch (e) {
          console.error('Exception generating embedding:', e);
          failCount++;
        }
        
        // Update progress
        setProgress(Math.floor(((i + 1) / data.length) * 100));
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

  return (
    <Card className="mb-8 border-3 border-black shadow-neo">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-travel-blue" />
          Travel RAG System Data Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status !== 'idle' && (
          <Alert variant={status === 'ready' ? 'default' : status === 'error' ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {status === 'ready' ? 'System Ready' : 
               status === 'error' ? 'Action Required' : 
               'Checking Status'}
            </AlertTitle>
            <AlertDescription>
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}
        
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
        </div>
        
        {(progress > 0 && progress < 100) && (
          <div className="w-full">
            <div className="mb-2 text-xs text-gray-600 flex justify-between">
              <span>{isGeneratingEmbeddings ? 'Generating embeddings...' : 'Creating documents...'}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-travel-blue transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
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
