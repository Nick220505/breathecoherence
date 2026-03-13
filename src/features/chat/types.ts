import type { ProductSummary } from '@/features/product/schemas';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  products?: ProductSummary[];
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  chatHistory: ChatHistoryMessage[];
}
