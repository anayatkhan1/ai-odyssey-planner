
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
  sources?: { name: string; similarity: number }[];
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
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-travel-blue/10 text-xs text-travel-blue/70">
            <div className="flex items-center gap-1 mb-1">
              <BookOpen className="h-3 w-3" />
              <span>Sources:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((source, index) => (
                <span key={index} className="inline-flex items-center bg-travel-blue/5 px-1.5 py-0.5 rounded">
                  {source.name}
                </span>
              ))}
            </div>
          </div>
        )}
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
