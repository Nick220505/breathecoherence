import Stripe from 'stripe';

import { orderService } from '@/features/order/service';
import type { EmailOrderItem, ShippingAddress } from '@/features/order/schemas';
import prisma from '@/lib/prisma';

export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  try {
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
      return false;
    }

    const isGuestOrder = orderId.startsWith('guest-');

    if (!isGuestOrder) {
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

    let orderItems: EmailOrderItem[] = [];
    let orderTotal = paymentIntent.amount / 100;
    let shippingAddress: ShippingAddress | undefined;
    if (customerAddress && customerCity && customerState && customerZipCode) {
      shippingAddress = {
        address: customerAddress,
        city: customerCity,
        state: customerState,
        zipCode: customerZipCode,
      };
    }

    if (!isGuestOrder) {
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
      orderItems = [
        {
          name: 'Your order',
          price: orderTotal,
          quantity: 1,
        },
      ];
    }

    if (customerEmail) {
      await orderService.sendOrderConfirmationEmail({
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

    if (!orderId.startsWith('guest-')) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PENDING',
            updatedAt: new Date(),
          },
        });
        console.log(
          `Order ${orderId} marked as pending due to payment failure`,
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
