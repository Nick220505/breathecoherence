import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// In Next.js 15, params is a Promise
interface RouteParams {
  params: Promise<{
    id: string; // payment intent ID
  }>;
}

export async function GET(request: Request, context: RouteParams) {
  try {
    // Correctly await the params object
    const { id } = await context.params;

    // Fetch the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    // Get current user session (if any)
    const session = await auth();

    // Check if this is a guest checkout
    const isGuestCheckout = paymentIntent.metadata?.userId === 'guest';

    // If not a guest checkout and there's a user mismatch, restrict access
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

    // Extract the order ID from metadata
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order not found for this payment' },
        { status: 404 },
      );
    }

    // For authenticated users, verify the order in the database
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

    // Return the order details
    return NextResponse.json({
      paymentIntentId: id,
      orderId,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents to dollars
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: 'Error fetching payment details' },
      { status: 500 },
    );
  }
}
