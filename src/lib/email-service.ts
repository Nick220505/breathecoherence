import * as React from 'react';
import { Resend } from 'resend';

import { OrderConfirmationEmail } from '@/components/email-templates/order-confirmation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
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

interface OrderConfirmationEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: ShippingAddress;
}

export async function sendOrderConfirmationEmail({
  orderId,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailData): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Breathe Coherence <orders@breathecoherence.com>',
      to: [customerEmail],
      subject: `Order Confirmation #${orderId}`,
      react: React.createElement(OrderConfirmationEmail, {
        orderId,
        customerName,
        items,
        total,
        shippingAddress,
      }),
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }

    console.log('Order confirmation email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
}
