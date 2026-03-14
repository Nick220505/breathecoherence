import { z } from 'zod';

import { productSummarySchema } from '@/features/product/schemas';

export const chatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  chatHistory: z.array(chatHistoryMessageSchema),
});

export const chatResponseSchema = z.object({
  response: z.string(),
  recommendedProducts: z.array(productSummarySchema),
});

export type ChatHistoryMessage = z.infer<typeof chatHistoryMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
