import Stripe from 'stripe';

import { sendOrderConfirmationEmail } from '@/lib/email';
import prisma from '@/lib/prisma';

interface OrderItemSummary {
  name: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  try {
    console.log('Processing payment intent succeeded:', paymentIntent.id);

    const {
      orderId,
      customerEmail,
      customerName,
      customerAddress,
      customerCity,
      customerState,
      customerZipCode,
    } = paymentIntent.metadata || {};

    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return false;
    }

    // Check if this is a guest order (guest-123456789)
    const isGuestOrder = orderId.startsWith('guest-');

    // For guest orders, we don't need to update any database record
    // but we should still send a confirmation email
    if (!isGuestOrder) {
      try {
        // Update order status in database for registered users
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            updatedAt: new Date(),
          },
        });
        console.log(`Order ${orderId} marked as paid`);
      } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        // Continue execution to at least try sending the email
      }
    }

    // For guest orders, we'll use the payment intent data for the email
    let orderItems: OrderItemSummary[] = [];
    let orderTotal = paymentIntent.amount / 100; // Convert from cents to dollars
    let shippingAddress: ShippingAddress | undefined;

    // Prepare shipping address if available
    if (customerAddress && customerCity && customerState && customerZipCode) {
      shippingAddress = {
        address: customerAddress,
        city: customerCity,
        state: customerState,
        zipCode: customerZipCode,
      };
    }

    if (!isGuestOrder) {
      // For registered users, fetch order details from the database
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

      if (order) {
        orderItems = order.items.map((item) => ({
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
        }));
        orderTotal = order.total;
      }
    } else {
      // For guest orders, we don't have the items in the database
      // We could store them in metadata if needed
      // For now, we'll just use a generic message
      orderItems = [
        {
          name: 'Your order',
          price: orderTotal,
          quantity: 1,
        },
      ];
    }

    if (customerEmail) {
      // Send order confirmation email
      await sendOrderConfirmationEmail({
        orderId,
        customerName: customerName || 'Valued Customer',
        customerEmail,
        items: orderItems,
        total: orderTotal,
        shippingAddress,
      });
    }

    return true;
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error);
    return false;
  }
}

export async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
) {
  try {
    console.log('Processing payment intent failed:', paymentIntent.id);

    const { orderId } = paymentIntent.metadata || {};

    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return false;
    }

    // Only update database records for non-guest orders
    if (!orderId.startsWith('guest-')) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date(),
          },
        });
        console.log(
          `Order ${orderId} marked as cancelled due to payment failure`,
        );
      } catch (error) {
        console.error(`Error updating failed order ${orderId}:`, error);
      }
    } else {
      console.log(
        `Guest order ${orderId} payment failed - no database update needed`,
      );
    }

    return true;
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error);
    return false;
  }
}
