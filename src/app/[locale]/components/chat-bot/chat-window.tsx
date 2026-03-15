import { motion } from 'motion/react';

import { Card } from '@/components/ui/card';
import type { Message } from '@/features/chat/types';

import { chatBotVariants } from './animations';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

interface ChatWindowProps {
  messages: Message[];
  input: string;
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  closeLabel: string;
  inputPlaceholder: string;
  recommendedProductsLabel: string;
  viewDetailsText: string;
  typingText: string;
}

export function ChatWindow({
  messages,
  input,
  isTyping,
  messagesEndRef,
  inputRef,
  onClose,
  onInputChange,
  onSubmit,
  title,
  closeLabel,
  inputPlaceholder,
  recommendedProductsLabel,
  viewDetailsText,
  typingText,
}: ChatWindowProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={chatBotVariants}
      className="fixed right-4 bottom-4 z-50"
    >
      <Card className="bg-background/95 flex h-[600px] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-purple-500/20 py-0 shadow-2xl backdrop-blur-lg sm:w-[400px]">
        <ChatHeader title={title} closeLabel={closeLabel} onClose={onClose} />
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          recommendedProductsLabel={recommendedProductsLabel}
          viewDetailsText={viewDetailsText}
          typingText={typingText}
        />
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          disabled={isTyping}
          placeholder={inputPlaceholder}
          inputRef={inputRef}
        />
      </Card>
    </motion.div>
  );
}
