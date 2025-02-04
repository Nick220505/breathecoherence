import { getProducts } from "@/actions/product";
import { getChatResponse } from "@/lib/gemini";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { message, chatHistory } = await request.json();

    // Get current product data
    const products = await getProducts();

    // Create a dynamic system prompt with current product data
    const systemPrompt = `You are a helpful shopping assistant for a store that sells Sacred Geometry items and Flower Essences. Here are the current products available:

${products
  .map(
    (product) => `
### ${product.name} - $${product.price.toFixed(2)}
- **Type:** ${product.type}
- **Description:** ${product.description}
- **Stock:** ${product.stock} units available
`,
  )
  .join("\n")}

When answering questions:
1. Use markdown formatting for better readability
2. Be friendly and helpful
3. Emphasize the energetic and vibrational properties
4. Explain how the products work with our energy and consciousness
5. Suggest products based on customer's needs
6. If asked about products we don't have, politely explain what we do offer
7. Format prices with $ and two decimal places
8. Include stock availability when relevant
9. For flower essences, mention they can be ordered with either water or brandy base`;

    // Get chat response with current product data
    const response = await getChatResponse(message, chatHistory, systemPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
