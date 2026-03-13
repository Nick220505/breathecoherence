import { z } from 'zod';

export const chatHistoryMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  chatHistory: z.array(chatHistoryMessageSchema),
});

export type ChatHistoryMessage = z.infer<typeof chatHistoryMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
