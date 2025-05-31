import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentRequest {
  amount: number;
  items: CartItem[];
  shippingDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { amount, items, shippingDetails } =
      (await req.json()) as PaymentRequest;

    // Generate an order ID for guest users or retrieve from database for authenticated users
    let orderId: string;
    let userId = 'guest';

    if (session?.user) {
      try {
        // Check if the user actually exists in the database
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { id: true },
        });

        if (user) {
          // For authenticated users with a valid database record, create an order
          const order = await prisma.order.create({
            data: {
              userId: user.id,
              status: 'PENDING',
              total: amount,
              items: {
                create: items.map((item) => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            },
          });
          orderId = order.id;
          userId = user.id;
        } else {
          // User has a session but doesn't exist in the database
          // Treat as guest checkout
          console.log(
            'User session exists but no database record found. Using guest checkout.',
          );
          orderId = `guest-${Date.now()}`;
        }
      } catch (error) {
        // Handle database errors gracefully
        console.error('Error creating order:', error);
        orderId = `guest-${Date.now()}`;
      }
    } else {
      // For guest users, create a temporary ID
      orderId = `guest-${Date.now()}`;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId,
        userId,
        customerEmail: shippingDetails.email,
        customerName: shippingDetails.name,
        customerAddress: shippingDetails.address,
        customerCity: shippingDetails.city,
        customerState: shippingDetails.state,
        customerZipCode: shippingDetails.zipCode,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 },
    );
  }
}
