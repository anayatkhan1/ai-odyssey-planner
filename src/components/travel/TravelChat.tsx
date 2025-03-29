
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
};

const TravelChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize session ID and load previous messages
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
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
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
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke('travel-chat', {
        body: {
          message: userMessage.content,
          sessionId,
          userId: user?.id,
        },
      });
      
      if (response.error) throw new Error(response.error.message);
      
      const botMessage = {
        role: 'assistant' as const,
        content: response.data.response,
      };
      
      setMessages((msgs) => [...msgs, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Could not process your message. Please try again later.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setMessages((msgs) => [
        ...msgs,
        {
          role: 'system',
          content: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
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
    toast({
      title: "New chat started",
      description: "Your previous chat history is still saved",
    });
  };

  return (
    <>
      {/* Chat toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="h-14 w-14 rounded-full bg-travel-blue text-white shadow-lg hover:bg-travel-blue/90"
        >
          {isChatOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Chat panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md"
          >
            <Card className="flex h-[500px] max-h-[80vh] flex-col overflow-hidden border-3 border-black shadow-neo">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b p-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-travel-blue" />
                  <h3 className="font-archivo text-lg font-bold">Travel Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewChat}
                  className="text-xs"
                >
                  New Chat
                </Button>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                    <MessageCircle className="mb-2 h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-semibold">Travel Assistant</h3>
                    <p className="mt-2 max-w-xs text-sm">
                      Ask me anything about travel destinations, planning tips, or local recommendations!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        msg.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 ${
                          msg.role === 'user'
                            ? 'bg-travel-blue text-white'
                            : msg.role === 'system'
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about travel destinations..."
                    className="min-h-[50px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="h-[50px] min-w-[50px] bg-travel-blue hover:bg-travel-blue/90"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelChat;
