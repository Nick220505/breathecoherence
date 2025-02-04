import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getChatResponse(
  userMessage: string,
  chatHistory: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string,
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Enhance the system prompt to request structured responses
    const enhancedPrompt = `${systemPrompt}

When recommending products, please use the following JSON structure within your response:
[PRODUCT_REC]{"id": "product-id", "name": "Product Name", "price": price}[/PRODUCT_REC]

For example:
I recommend the Dodecahedron for spiritual growth [PRODUCT_REC]{"id": "dodecahedron", "name": "Dodecahedron (Aether Element)", "price": 19.99}[/PRODUCT_REC]`;

    // Start a new chat
    const chat = model.startChat();

    // Send the enhanced system prompt first
    await chat.sendMessage(enhancedPrompt);

    // Send the chat history
    for (const msg of chatHistory) {
      await chat.sendMessage(msg.content);
    }

    // Send the user's message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
  }
}
