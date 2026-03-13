import type { ProductWithCategory } from '@/features/product/schemas';
import { genAI } from '@/lib/gemini';

import { buildSystemPrompt, PRODUCT_RECOMMENDATION_FORMAT } from './prompts';
import type { ChatHistoryMessage } from './types';

export const chatService = {
  async processChat(
    message: string,
    chatHistory: ChatHistoryMessage[],
    products: ProductWithCategory[],
  ): Promise<string> {
    try {
      const systemPrompt = buildSystemPrompt(products);
      const response = await this.getChatResponse(
        message,
        chatHistory,
        systemPrompt,
      );

      return this.processProductRecommendations(response, products);
    } catch (error) {
      console.error('Error processing chat:', error);
      return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
    }
  },

  async getChatResponse(
    userMessage: string,
    chatHistory: ChatHistoryMessage[],
    systemPrompt: string,
  ): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const enhancedPrompt = `${systemPrompt}${PRODUCT_RECOMMENDATION_FORMAT}`;

    const chat = model.startChat();

    await chat.sendMessage(enhancedPrompt);

    for (const msg of chatHistory) {
      await chat.sendMessage(msg.content);
    }

    const { response } = await chat.sendMessage(userMessage);

    return response.text();
  },

  processProductRecommendations(
    response: string,
    products: ProductWithCategory[],
  ): string {
    const recRegex = /\[PRODUCT_REC:([\w-]+)\]/g;

    return response.replace(recRegex, (_match, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        return `[PRODUCT_REC]${JSON.stringify(product)}[/PRODUCT_REC]`;
      }
      return '';
    });
  },
};
