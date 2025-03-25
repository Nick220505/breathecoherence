import { NextResponse } from 'next/server';

import { productService } from '@/features/products/service';
import { getChatResponse } from '@/lib/gemini';

export const runtime = 'nodejs';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { message, chatHistory } = await request.json();

    // Get current product data
    const products = await productService.getAll();

    // Create a map of products by ID for quick lookup
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // Create a dynamic system prompt with current product data
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
5. Only recommend products from the list above using their exact IDs
6. If asked about products we don't have, politely explain what we do offer instead
7. Format prices with $ and two decimal places
8. Include stock availability when relevant
9. For flower essences, mention they can be ordered with either water or brandy base`;

    // Get chat response with current product data
    const response = await getChatResponse(message, chatHistory, systemPrompt);

    // Extract product recommendations and validate them
    const regex = /\[PRODUCT_REC\](.*?)\[\/PRODUCT_REC\]/g;
    let validatedResponse = response;
    let match;

    while ((match = regex.exec(response)) !== null) {
      try {
        const recommendation = JSON.parse(match[1]);
        // Check if the recommended product exists in our database
        const validProduct = productMap.get(recommendation.id);
        if (!validProduct) {
          // Remove invalid product recommendation
          validatedResponse = validatedResponse.replace(match[0], '');
        }
      } catch (e) {
        console.error('Error parsing product recommendation:', e);
        // Remove malformed product recommendation
        validatedResponse = validatedResponse.replace(match[0], '');
      }
    }

    return NextResponse.json({ response: validatedResponse });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    );
  }
}
