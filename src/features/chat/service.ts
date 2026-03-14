import { generateText, Output } from 'ai';

import { model } from '@/lib/gemini';
import type { Locale } from '@/i18n/routing';
import { productService } from '@/features/product/service';

import { createSystemPrompt } from './prompts';
import {
  chatResponseSchema,
  type ChatHistoryMessage,
  type ChatResponse,
} from './schemas';

export const chatService = {
  async processChat(
    message: string,
    chatHistory: ChatHistoryMessage[],
    locale: Locale,
  ): Promise<ChatResponse> {
    try {
      const products = await productService.getAll(locale);

      const { output } = await generateText({
        model,
        system: createSystemPrompt(products),
        messages: [
          ...chatHistory,
          {
            role: 'user',
            content: message,
          },
        ],
        output: Output.object({
          schema: chatResponseSchema,
        }),
      });

      return output;
    } catch (error) {
      console.error('Error processing chat:', error);
      return {
        response:
          "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
        recommendedProducts: [],
      };
    }
  },
};
