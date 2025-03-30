
import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useTravelChat } from '@/hooks/useTravelChat';
import ChatContent from './ChatContent';

const TravelChat = () => {
  const {
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
  } = useTravelChat();

  const renderChatContent = () => (
    <ChatContent
      messages={messages}
      input={input}
      isLoading={isLoading}
      errorMessage={errorMessage}
      quickPrompts={quickPrompts}
      inputRef={inputRef}
      messagesEndRef={messagesEndRef}
      isFullscreen={isFullscreen}
      isLastMessageOffTopic={isLastMessageOffTopic}
      travelPromptSuggestions={travelPromptSuggestions}
      dismissError={dismissError}
      startNewChat={startNewChat}
      setIsFullscreen={setIsFullscreen}
      setInput={setInput}
      handleSendMessage={handleSendMessage}
      handleKeyDown={handleKeyDown}
      handleQuickPrompt={handleQuickPrompt}
      handlePreferenceSelect={handlePreferenceSelect}
    />
  );

  return (
    <>
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="p-0 sm:max-w-[600px] max-h-[80vh] h-[600px] border-travel-blue/10">
          {renderChatContent()}
        </DialogContent>
      </Dialog>
    
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
              {renderChatContent()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelChat;
