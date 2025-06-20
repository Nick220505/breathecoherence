import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { orderService } from '@/features/order/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    const session = await auth();

    const order = await orderService.getDetail(id, session?.user?.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json(
      { error: 'Error fetching order detail' },
      { status: 500 },
    );
  }
}
