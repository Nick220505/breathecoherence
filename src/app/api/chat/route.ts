import { NextResponse } from 'next/server';
import { hasLocale } from 'next-intl';

import { chatRequestSchema } from '@/features/chat/schemas';
import { chatService } from '@/features/chat/service';
import { routing } from '@/i18n/routing';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale || !hasLocale(routing.locales, locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const body = await request.json();
    const { data, error, success } = chatRequestSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 },
      );
    }

    const chatResponse = await chatService.processChat(
      data.message,
      data.chatHistory,
      locale,
    );

    return NextResponse.json(chatResponse);
  } catch {
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    );
  }
}
