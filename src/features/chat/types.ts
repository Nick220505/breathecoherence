import type { PartialProductWithCategory } from '@/features/product/types';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  products?: PartialProductWithCategory[];
}
