
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Message } from '../components/travel/ChatMessage';

export const useTravelChat = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [isLastMessageOffTopic, setIsLastMessageOffTopic] = useState(false);
  
  useEffect(() => {
    const storedSessionId = localStorage.getItem('travelChatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadChatHistory(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('travelChatSessionId', newSessionId);
    }

    // Check if we have proper API configuration
    checkApiConfiguration();
  }, []);

  const checkApiConfiguration = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('travel-chat', {
        body: {
          action: 'check_api_config'
        },
      });
      
      if (error || (data && data.error)) {
        setIsApiKeyMissing(true);
        console.warn("API configuration issue:", data?.error || error);
      }
    } catch (err) {
      console.error("Error checking API configuration:", err);
      setIsApiKeyMissing(true);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('travel_chat_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        createdAt: msg.created_at,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error loading chat history",
        description: "Could not load your previous messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (isApiKeyMissing) {
      toast({
        title: "API Key Missing",
        description: "Anthropic API key is not configured. Please add it in your Supabase edge function settings.",
        variant: "destructive",
      });
      return;
    }
    
    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);
    setIsLastMessageOffTopic(false);
    
    try {
      console.log("Sending message to travel-chat function:", userMessage.content);
      
      const response = await supabase.functions.invoke('travel-chat', {
        body: {
          message: userMessage.content,
          sessionId,
          userId: user?.id,
        },
      });
      
      console.log("Response from travel-chat function:", response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Error processing message');
      }
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      if (!response.data.response) {
        throw new Error('No response received from assistant');
      }
      
      // Check if response was for an off-topic question
      if (response.data.isOffTopic) {
        setIsLastMessageOffTopic(true);
      } else {
        setIsLastMessageOffTopic(false);
      }
      
      const botMessage = {
        role: 'assistant' as const,
        content: response.data.response,
        sources: response.data.sources || []
      };
      
      setMessages((msgs) => [...msgs, botMessage]);
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if error is related to API key
      if (error.message && error.message.includes('API key')) {
        setIsApiKeyMissing(true);
        toast({
          title: "API Key Issue",
          description: "There's a problem with the Anthropic API key. Please check your configuration.",
          variant: "destructive",
        });
      } else {
        // Show error toast only on first attempt
        if (retryCount === 0) {
          toast({
            title: "Error sending message",
            description: "Could not process your message. Retrying...",
            variant: "destructive",
          });
        }
      }
      
      // Track retry attempts
      setRetryCount(prev => prev + 1);
      
      // If error persists after multiple retries, show a helpful error message
      const errorMsg = retryCount >= 2 
        ? "Sorry, I'm having trouble connecting. Please try again later."
        : "Retry attempt failed. Please wait a moment and try again.";
        
      setMessages((msgs) => [
        ...msgs,
        {
          role: 'system',
          content: errorMsg,
        },
      ]);
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem('travelChatSessionId', newSessionId);
    setMessages([]);
    setRetryCount(0);
    setErrorMessage(null);
    setIsLastMessageOffTopic(false);
    toast({
      title: "New chat started",
      description: "Your previous chat history is still saved",
    });
  };

  const handlePreferenceSelect = (category: string, option: string) => {
    const preferenceMessages = {
      budget: `I'm looking for ${option.toLowerCase()} options.`,
      companions: `I'm traveling ${option.toLowerCase() === 'solo' ? 'alone' : `with ${option.toLowerCase()}`}.`,
      interests: `I'm interested in ${option.toLowerCase()} activities.`
    };
    
    setInput(prev => {
      const newInput = prev ? `${prev} ${preferenceMessages[category]}` : preferenceMessages[category];
      return newInput;
    });
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const quickPrompts = [
    "What are the best destinations for a beach vacation?",
    "Recommend budget-friendly places in Europe.",
    "I'm planning a family trip to Asia, any suggestions?",
    "Create a 3-day itinerary for Paris.",
    "What are the best restaurants in Tokyo?",
    "Tell me about visa requirements for Thailand.",
    "Recommend hotels in Barcelona."
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  // Add sample travel-related prompts for user assistance if their question was off-topic
  const travelPromptSuggestions = [
    "What are popular beach destinations in Southeast Asia?",
    "How much should I budget for a week in Paris?",
    "What's the best time to visit Japan?",
    "Can you suggest a 3-day itinerary for Rome?",
    "What safety precautions should I take when traveling to South America?"
  ];

  return {
    messages,
    input,
    isLoading,
    isChatOpen,
    errorMessage,
    isFullscreen,
    messagesEndRef,
    inputRef,
    quickPrompts,
    isApiKeyMissing,
    isLastMessageOffTopic,
    travelPromptSuggestions,
    setInput,
    setIsChatOpen,
    setIsFullscreen,
    handleSendMessage,
    handleKeyDown,
    startNewChat,
    handlePreferenceSelect,
    handleQuickPrompt,
    dismissError,
  };
};
