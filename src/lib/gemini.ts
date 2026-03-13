import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
}

export const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY,
);

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});
