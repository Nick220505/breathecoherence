import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import {
  handlePaymentIntentFailed,
  handlePaymentIntentSucceeded,
} from './stripe-handlers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 },
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', errorMessage);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 },
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 },
    );
  }
}
