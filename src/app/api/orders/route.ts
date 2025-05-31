import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Check URL parameters
    const url = new URL(request.url);
    const guestOrderId = url.searchParams.get('guestId');

    // Get user session
    const session = await auth();

    // If this is a guest order request
    if (guestOrderId) {
      // Fetch the specific guest order
      const order = await prisma.order.findUnique({
        where: {
          id: guestOrderId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Return as an array for consistent response format
      return NextResponse.json([order]);
    }

    // For regular user orders, authentication is required
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 },
    );
  }
}
