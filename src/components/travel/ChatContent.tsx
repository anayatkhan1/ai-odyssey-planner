
import React, { useRef } from 'react';
import { X, Plane, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import EmptyChatState from './EmptyChatState';

type ChatContentProps = {
  messages: Message[];
  input: string;
  isLoading: boolean;
  errorMessage: string | null;
  quickPrompts: string[];
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isFullscreen: boolean;
  dismissError: () => void;
  startNewChat: () => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setInput: (input: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleQuickPrompt: (prompt: string) => void;
  handlePreferenceSelect: (category: string, option: string) => void;
};

const ChatContent = ({
  messages,
  input,
  isLoading,
  errorMessage,
  quickPrompts,
  inputRef,
  messagesEndRef,
  isFullscreen,
  dismissError,
  startNewChat,
  setIsFullscreen,
  setInput,
  handleSendMessage,
  handleKeyDown,
  handleQuickPrompt,
  handlePreferenceSelect,
}: ChatContentProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-travel-blue text-white border-b border-travel-blue/20">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-1.5 flex-shrink-0">
            <Plane className="h-4 w-4 text-travel-blue" />
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
            handlePreferenceSelect={handlePreferenceSelect}
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
      
      {/* Error message toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-0 right-0 mx-auto w-11/12 max-w-sm bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Error sending message</p>
                <p className="text-sm opacity-90">Could not process your message. Please try again later.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={dismissError}
                className="text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatContent;
