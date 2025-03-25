import { NextResponse } from 'next/server';

import { translateText } from '@/lib/translation-service';

export async function POST(request: Request) {
  try {
    const { text, targetLanguage = 'es' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const translatedText = await translateText(text, targetLanguage);

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 },
    );
  }
}
