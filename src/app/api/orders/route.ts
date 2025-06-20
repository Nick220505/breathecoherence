import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { orderService } from '@/features/order/service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    const session = await auth();

    if (guestId) {
      const order = await orderService.getDetail(guestId, session?.user?.id);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json([order]);
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await orderService.getAllWithItemsByUser(session.user.id);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 },
    );
  }
}
