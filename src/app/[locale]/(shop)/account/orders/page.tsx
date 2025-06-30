import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { getUserClientOrders } from '@/features/order/actions';

import OrderHistoryClient from './components/order-history-client';

export const dynamic = 'force-dynamic';

export default async function OrderHistoryPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  const [clientOrders, ordersErr] = await getUserClientOrders();

  if (ordersErr) {
    const t = await getTranslations('OrderHistory');
    throw new Error(t('error.loadOrders'));
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderHistoryClient locale={locale} initialOrders={clientOrders} />
    </Suspense>
  );
}
