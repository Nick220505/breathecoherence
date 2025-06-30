import { getTranslations } from 'next-intl/server';

import { getOrderDetailServer } from '@/features/order/actions';

import OrderDetailClient from './components/order-detail-client';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
}>) {
  const { id, locale } = await params;

  const [order, orderErr] = await getOrderDetailServer({ id });

  if (orderErr) {
    const t = await getTranslations('OrderDetail');
    throw new Error(t('error.loadOrder'));
  }

  return (
    <OrderDetailClient orderId={id} locale={locale} initialOrder={order} />
  );
}
