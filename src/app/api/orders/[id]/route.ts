import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: RouteParams) {
  try {
    // Get the order ID from the params
    const { id } = await context.params;

    // Check if this is a guest order
    const isGuestOrder = id.startsWith('guest-');

    // Get current user session (if any)
    const session = await auth();

    // If this is not a guest order, we need authentication
    if (!isGuestOrder && !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    let order;
    if (isGuestOrder) {
      // For guest orders, lookup by ID without user constraint
      order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    } else {
      // For authenticated users, ensure order belongs to current user
      order = await prisma.order.findUnique({
        where: {
          id,
          userId: session?.user?.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Error fetching order' },
      { status: 500 },
    );
  }
}
