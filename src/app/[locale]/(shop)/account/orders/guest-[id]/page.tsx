'use client';

import { use } from 'react';

import OrderDetailClient from '../[id]/components/order-detail-client';

export default function GuestOrderPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
}>) {
  // Use React's use hook to unwrap the params promise
  const resolvedParams = use(params);
  const { id, locale } = resolvedParams;
  const guestOrderId = `guest-${id}`;

  return <OrderDetailClient orderId={guestOrderId} locale={locale} />;
}
