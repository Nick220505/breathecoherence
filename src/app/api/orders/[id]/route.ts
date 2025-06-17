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

    console.log('Fetching order with ID:', id);

    // Check if this is a guest order
    const isGuestOrder = id.startsWith('guest-');

    // Get current user session (if any)
    const session = await auth();
    console.log('Session user ID:', session?.user?.id);

    // If this is not a guest order, we need authentication
    if (!isGuestOrder && !session?.user) {
      console.log('No authentication for non-guest order');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    let order;
    if (isGuestOrder) {
      // For guest orders, lookup by ID without user constraint
      console.log('Fetching guest order');
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
      // For authenticated users, first try to find the order by ID only
      console.log('Looking for order by ID first');
      const orderCheck = await prisma.order.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      console.log('Order check result:', orderCheck);

      if (!orderCheck) {
        console.log('Order not found by ID');
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Check if the order belongs to the current user
      if (orderCheck.userId !== session?.user?.id) {
        console.log(
          `Order userId (${orderCheck.userId}) does not match session userId (${session?.user?.id})`,
        );
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Now fetch the full order with items
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
    }

    if (!order) {
      console.log('Order not found in final fetch');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order found successfully:', order.id);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Error fetching order' },
      { status: 500 },
    );
  }
}
