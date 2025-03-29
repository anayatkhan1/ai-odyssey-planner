
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Loader2, Plus, Sparkles, Plane, User, Bot, MapPin, Globe, Compass, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
};

// Chat Message Component
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && !isSystem && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-travel-blue/10 mr-2 flex-shrink-0">
          <Bot className="h-5 w-5 text-travel-blue" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser 
            ? 'bg-travel-blue text-white rounded-tr-none shadow-sm' 
            : isSystem
              ? 'bg-gray-200 text-gray-800 rounded-tl-none shadow-sm'
              : 'bg-travel-lightBlue text-travel-blue/90 border border-travel-blue/10 rounded-tl-none shadow-sm'
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
      </div>
      
      {isUser && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-travel-blue mr-2 flex-shrink-0">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </motion.div>
  );
};

// Quick Prompt Component
const QuickPrompt = ({ prompt, onClick }: { prompt: string, onClick: (prompt: string) => void }) => {
  return (
    <motion.button
      onClick={() => onClick(prompt)}
      className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 bg-white 
                hover:bg-travel-lightBlue hover:border-travel-blue/30 transition-colors 
                text-gray-700 text-sm group flex items-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mr-3 text-travel-blue opacity-70 group-hover:opacity-100">
        {prompt.includes("visit") ? <Globe className="h-4 w-4" /> : 
         prompt.includes("budget") ? <Compass className="h-4 w-4" /> :
         prompt.includes("solo") ? <User className="h-4 w-4" /> :
         <MapPin className="h-4 w-4" />}
      </div>
      <span className="flex-1">{prompt}</span>
      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-travel-blue transition-colors" />
    </motion.button>
  );
};

// Empty Chat State Component
const EmptyChatState = ({ quickPrompts, handleQuickPrompt }: { 
  quickPrompts: string[], 
  handleQuickPrompt: (prompt: string) => void 
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-travel-lightBlue rounded-full p-5 mb-6"
      >
        <Plane className="h-10 w-10 text-travel-blue" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-travel-blue mb-2">Your Travel Assistant</h3>
      <p className="text-gray-600 mb-8 max-w-sm">
        Ask me anything about travel destinations, planning tips, or local recommendations!
      </p>
      
      <div className="w-full space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="outline" className="bg-travel-blue/5 text-travel-blue border-travel-blue/20">Popular Questions</Badge>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>
        
        {quickPrompts.map((prompt, index) => (
          <QuickPrompt 
            key={index} 
            prompt={prompt} 
            onClick={handleQuickPrompt} 
          />
        ))}
      </div>
    </div>
  );
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  
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

  // Dialog version of the chat for fullscreen mode
  const renderChatContent = () => (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-travel-blue text-white border-b border-travel-blue/20">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-1.5 flex-shrink-0">
            <Sparkles className="h-4 w-4 text-travel-blue" />
          </div>
          <h3 className="font-archivo text-lg font-bold">Travel Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={startNewChat}
            className="text-xs hover:bg-travel-blue/20 text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Chat
          </Button>
          {isFullscreen && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsFullscreen(false)}
              className="text-xs hover:bg-travel-blue/20 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4 bg-[#f8fafc]">
        {messages.length === 0 ? (
          <EmptyChatState 
            quickPrompts={quickPrompts} 
            handleQuickPrompt={handleQuickPrompt} 
          />
        ) : (
          <div className="space-y-1 p-1">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t p-3 bg-white">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about travel destinations..."
            className="min-h-[50px] resize-none focus-visible:ring-travel-blue/50 rounded-lg bg-gray-50"
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
    </div>
  );

  return (
    <>
      {/* Fullscreen dialog version */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="p-0 sm:max-w-[600px] max-h-[80vh] h-[600px] border-travel-blue/10">
          {renderChatContent()}
        </DialogContent>
      </Dialog>
    
      {/* Floating chat button */}
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
      
      {/* Popup chat window */}
      <AnimatePresence>
        {isChatOpen && !isFullscreen && (
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
            <Card className="flex h-[500px] max-h-[80vh] flex-col overflow-hidden shadow-lg bg-white">
              <div className="absolute right-3 top-3 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  className="h-8 w-8 rounded-full bg-white/90 border-gray-200 hover:bg-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {renderChatContent()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelChat;
