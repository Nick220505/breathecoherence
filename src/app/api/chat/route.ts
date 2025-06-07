import { Product } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getLocale } from 'next-intl/server';

import { productService } from '@/features/product/service';
import { Locale } from '@/i18n/routing';
import { getChatResponse } from '@/lib/gemini';

export const runtime = 'nodejs';

export const maxDuration = 60;

interface ChatRequest {
  message: string;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
}

export async function POST(request: Request) {
  try {
    const { message, chatHistory } = (await request.json()) as ChatRequest;

    const locale = (await getLocale()) as Locale;

    const products = await productService.getAll(locale);

    const productMap = new Map<string, Product>(
      products.map((product) => [product.id, product]),
    );

    const systemPrompt = `You are a helpful shopping assistant for a store that sells Sacred Geometry items and Flower Essences. Here are the current products available:

${products
  .map(
    (product) => `
### ${product.name} - $${product.price.toFixed(2)}
- **Type:** ${product.type}
- **Description:** ${product.description}
- **Stock:** ${product.stock} units available
- **ID:** ${product.id}
`,
  )
  .join('\n')}

When answering questions:
1. Use markdown formatting for better readability
2. Be friendly and helpful
3. Emphasize the energetic and vibrational properties
4. Explain how the products work with our energy and consciousness
5. To recommend a product, you MUST use the following format exactly: [PRODUCT_REC:PRODUCT_ID]. You will be replacing PRODUCT_ID with the actual product ID from the list.
6. If asked about products we don't have, politely explain what we do offer instead
7. Format prices with $ and two decimal places
8. Include stock availability when relevant
9. For flower essences, mention they can be ordered with either water or brandy base`;

    const response = await getChatResponse(message, chatHistory, systemPrompt);

    const recRegex = /\[PRODUCT_REC:([\w-]+)\]/g;
    const finalResponse = response.replace(recRegex, (_match, productId) => {
      const product = productMap.get(productId as string);
      if (product) {
        return `[PRODUCT_REC]${JSON.stringify(product)}[/PRODUCT_REC]`;
      }
      return '';
    });

    return NextResponse.json({ response: finalResponse });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    );
  }
}
