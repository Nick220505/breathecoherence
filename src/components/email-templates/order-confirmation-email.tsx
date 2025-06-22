import { Tailwind, Img } from '@react-email/components';
import * as React from 'react';

import { emailTailwindConfig } from '@/lib/email-tailwind-config';

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

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: ShippingAddress;
  baseUrl: string;
}

export function OrderConfirmationEmail({
  orderId,
  customerName,
  items,
  total,
  shippingAddress,
  baseUrl,
}: Readonly<OrderConfirmationEmailProps>) {
  return (
    <Tailwind config={emailTailwindConfig}>
      <div className="mx-auto max-w-[600px] font-sans">
        <div className="mb-6 text-center">
          <Img
            src={`${baseUrl}/BC-logo-transp-120.png`}
            alt="Breathe Coherence"
            width="120"
            height="120"
            className="inline-block h-auto max-w-full"
          />
        </div>
        <h1 className="text-center text-gray-800">Order Confirmation</h1>
        <p className="text-gray-600">Dear {customerName},</p>
        <p className="text-gray-600">
          Thank you for your order! We&apos;re pleased to confirm that your
          order has been received and is being processed.
        </p>

        <div className="my-6 rounded-lg bg-gray-100 p-6">
          <h2 className="mt-0 text-lg text-gray-800">Order #{orderId}</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 py-2 text-left">
                  Product
                </th>
                <th className="border-b border-gray-300 py-2 text-center">
                  Qty
                </th>
                <th className="border-b border-gray-300 py-2 text-right">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td className="border-b border-gray-300 py-2">{item.name}</td>
                  <td className="border-b border-gray-300 py-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border-b border-gray-300 py-2 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-2 text-right font-bold">
                  Total:
                </td>
                <td className="py-2 text-right font-bold">
                  ${total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {shippingAddress && (
            <div className="mt-6">
              <h3 className="mb-2 text-base text-gray-800">
                Shipping Address:
              </h3>
              <p className="m-0 text-gray-600">
                {shippingAddress.address}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{' '}
                {shippingAddress.zipCode}
              </p>
            </div>
          )}
        </div>

        <p className="text-gray-600">
          You can view your order status and history by visiting your account
          page.
        </p>
        <p className="text-gray-600">Thank you for shopping with us!</p>

        <div className="mt-6 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Breathe Coherence. All rights reserved.
        </div>
      </div>
    </Tailwind>
  );
}

export default OrderConfirmationEmail;
