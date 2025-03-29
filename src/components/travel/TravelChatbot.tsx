import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plane, Send, X, User, Bot, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { getChatResponse } from '@/utils/travelChatUtils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const sampleResponses = [
  "Bali is a tropical paradise with beautiful beaches, temples, and vibrant culture. The island is known for its yoga retreats, surf spots, and rice terraces.",
  "Kyoto features ancient temples, traditional gardens, and authentic Japanese culture. The city has over 1,600 Buddhist temples and 400 Shinto shrines.",
  "Santorini is famous for its iconic white buildings with blue domes overlooking the Aegean Sea. The island was formed by a volcanic eruption and features dramatic cliffs and stunning sunsets.",
  "I'd recommend visiting Bali during the dry season (April to October) for the best weather conditions.",
  "When visiting Marrakech, make sure to explore the Jardin Majorelle, visit the Bahia Palace, and experience the night market at Jemaa el-Fnaa square."
];

const TravelChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your travel assistant. Ask me anything about destinations, travel tips, or recommendations!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomIndex = Math.floor(Math.random() * sampleResponses.length);
      const aiResponse = sampleResponses[randomIndex];
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        className="fixed right-6 bottom-6 p-4 rounded-full bg-travel-teal text-white shadow-neo z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Plane size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-md"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-3 border-black shadow-neo overflow-hidden">
                <CardHeader className="p-4 border-b-2 border-gray-100 flex flex-row justify-between items-center bg-travel-sand">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-travel-teal">
                      <MapPin size={16} className="text-white" />
                    </Avatar>
                    <CardTitle className="text-lg font-archivo">Travel Assistant</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-gray-200"
                  >
                    <X size={18} />
                  </Button>
                </CardHeader>
                
                <CardContent className="p-0">
                  <ScrollArea className="h-[350px] p-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex max-w-[80%] ${
                            message.role === 'user'
                              ? 'bg-travel-blue text-white rounded-l-xl rounded-br-xl'
                              : 'bg-gray-100 text-gray-800 rounded-r-xl rounded-bl-xl'
                          } px-4 py-3 shadow-sm`}
                        >
                          {message.role === 'assistant' && (
                            <Bot size={20} className="mr-2 flex-shrink-0 mt-1 text-travel-teal" />
                          )}
                          <div>
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          {message.role === 'user' && (
                            <User size={20} className="ml-2 flex-shrink-0 mt-1 text-white" />
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                </CardContent>
                
                <CardFooter className="p-3 border-t-2 border-gray-100">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about destinations, travel tips..."
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="flex-1 border-2 border-gray-200 focus-visible:ring-travel-teal"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !input.trim()}
                      className="bg-travel-teal hover:bg-travel-teal/90"
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Send size={18} />
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelChatbot;
