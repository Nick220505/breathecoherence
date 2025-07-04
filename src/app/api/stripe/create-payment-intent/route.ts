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

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { stock: true, name: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 400 },
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          },
          { status: 400 },
        );
      }
    }

    let orderId: string;
    let userId = 'guest';

    if (session?.user) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { id: true },
        });

        if (user) {
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
          console.log(
            'User session exists but no database record found. Using guest checkout.',
          );
          orderId = `guest-${Date.now()}`;
        }
      } catch (error) {
        console.error('Error creating order:', error);
        orderId = `guest-${Date.now()}`;
      }
    } else {
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
