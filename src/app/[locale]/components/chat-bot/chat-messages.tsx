import type { Message } from '@/features/chat/types';

import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
