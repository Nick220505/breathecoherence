import type { ProductSummary } from '@/features/product/schemas';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  products?: ProductSummary[];
}
