import { NextResponse } from 'next/server';
import { hasLocale } from 'next-intl';

import { productService } from '@/features/product/service';
import { routing } from '@/i18n/routing';
import { getChatResponse } from '@/lib/gemini';

export const runtime = 'nodejs';

export const maxDuration = 60;

interface ChatRequest {
  message: string;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale || !hasLocale(routing.locales, locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const { message, chatHistory } = (await request.json()) as ChatRequest;

    const products = await productService.getAll(locale);

    const systemPrompt = `You are a helpful shopping assistant for a store that sells Sacred Geometry items and Flower Essences. Here are the current products available:

${products
  .map(
    (product) => `
### ${product.name} - $${product.price.toFixed(2)}
- **Category:** ${product.category.name}
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
5. To recommend a product, you MUST use the following format exactly: [PRODUCT_REC:PRODUCT_ID]. Replace PRODUCT_ID with the actual product ID from the list. For example: [PRODUCT_REC:tetrahedron]. Do not output a JSON object, as the system will handle creating the product details.
6. The product 'category' is a fixed value and must not be changed. The valid categories are 'Sacred Geometry' and 'Flower Essence'.
7. If asked about products we don't have, politely explain what we do offer instead.
8. Format prices with $ and two decimal places.
9. Include stock availability when relevant.
10. For flower essences, mention they can be ordered with either water or brandy base.`;

    const response = await getChatResponse(message, chatHistory, systemPrompt);

    const recRegex = /\[PRODUCT_REC:([\w-]+)\]/g;
    const finalResponse = response.replace(recRegex, (_match, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        return `[PRODUCT_REC]${JSON.stringify(product)}[/PRODUCT_REC]`;
      }
      return '';
    });

    return NextResponse.json({ response: finalResponse });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    );
  }
}
