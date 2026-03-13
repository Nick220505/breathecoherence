import { NextResponse } from 'next/server';
import { hasLocale } from 'next-intl';

import { chatService } from '@/features/chat/service';
import type { ChatRequest } from '@/features/chat/types';
import { productService } from '@/features/product/service';
import { routing } from '@/i18n/routing';

export const runtime = 'nodejs';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale || !hasLocale(routing.locales, locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const { message, chatHistory } = (await request.json()) as ChatRequest;

    const products = await productService.getAll(locale);

    const response = await chatService.processChat(
      message,
      chatHistory,
      products,
    );

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    );
  }
}
