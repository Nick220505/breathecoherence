import type { Message } from '@/features/chat/types';

import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  recommendedProductsLabel: string;
  viewDetailsText: string;
  typingText: string;
}

export function ChatMessages({
  messages,
  isTyping,
  messagesEndRef,
  recommendedProductsLabel,
  viewDetailsText,
  typingText,
}: ChatMessagesProps) {
  return (
    <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          recommendedProductsLabel={recommendedProductsLabel}
          viewDetailsText={viewDetailsText}
        />
      ))}
      {isTyping && <TypingIndicator typingText={typingText} />}
      <div ref={messagesEndRef} />
    </div>
  );
}
