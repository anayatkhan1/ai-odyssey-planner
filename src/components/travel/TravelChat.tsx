
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, Send, X, Loader2, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
};

const TravelChat = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
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

  const quickPrompts = [
    "What are the best places to visit in Europe?",
    "Recommend budget-friendly destinations",
    "Tips for solo traveling",
    "Must-visit landmarks in Asia"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
            isChatOpen 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-travel-blue hover:bg-travel-blue/90"
          )}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md"
          >
            <Card className="flex h-[500px] max-h-[80vh] flex-col overflow-hidden border-3 border-black shadow-neo bg-white">
              <div className="flex items-center justify-between border-b p-3 bg-travel-blue/10">
                <div className="flex items-center gap-2">
                  <div className="bg-travel-blue rounded-full p-1">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-archivo text-lg font-bold text-travel-blue">Travel Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewChat}
                  className="text-xs hover:bg-travel-blue/10"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Chat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center p-6">
                    <div className="bg-travel-blue/10 rounded-full p-4 mb-4">
                      <MessageCircle className="h-10 w-10 text-travel-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-travel-blue mb-2">Travel Assistant</h3>
                    <p className="text-gray-600 mb-8 max-w-xs">
                      Ask me anything about travel destinations, planning tips, or local recommendations!
                    </p>
                    
                    <div className="w-full space-y-2">
                      <p className="text-sm text-gray-500 font-medium">Try asking:</p>
                      {quickPrompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 bg-white 
                                    hover:bg-travel-blue/5 hover:border-travel-blue/30 transition-colors 
                                    text-gray-700 text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "flex",
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3",
                            msg.role === 'user' 
                              ? 'bg-travel-blue text-white rounded-tr-none' 
                              : msg.role === 'system'
                                ? 'bg-gray-200 text-gray-800 rounded-tl-none'
                                : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-tl-none'
                          )}
                        >
                          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              <div className="border-t p-3 bg-white">
                <div className="flex gap-2">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about travel destinations..."
                    className="min-h-[50px] resize-none focus-visible:ring-travel-blue/50 rounded-lg"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="h-[50px] min-w-[50px] bg-travel-blue hover:bg-travel-blue/90 transition-colors rounded-lg"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
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
