
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Message = {
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
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-travel-blue ml-2 flex-shrink-0">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
