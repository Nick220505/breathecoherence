import type { ProductSummary } from '@/features/product/types';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  products?: ProductSummary[];
}
