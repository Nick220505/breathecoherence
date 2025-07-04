import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    const session = await auth();

    const isGuestCheckout = paymentIntent.metadata?.userId === 'guest';
    if (
      !isGuestCheckout &&
      session?.user &&
      paymentIntent.metadata?.userId &&
      paymentIntent.metadata.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to access this payment' },
        { status: 403 },
      );
    }

    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order not found for this payment' },
        { status: 404 },
      );
    }

    if (paymentIntent.status === 'succeeded' && !orderId.startsWith('guest-')) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (order && order.status === 'PENDING') {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              updatedAt: new Date(),
            },
          });

          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        });
      }
    }

    if (session?.user && !orderId.startsWith('guest-')) {
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
          userId: session.user.id,
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found or not accessible' },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({
      paymentIntentId: id,
      orderId,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: 'Error fetching payment details' },
      { status: 500 },
    );
  }
}
