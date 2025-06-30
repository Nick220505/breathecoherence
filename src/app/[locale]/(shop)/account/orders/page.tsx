import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { getUserOrdersWithItems } from '@/features/order/actions';

import OrderHistoryClient from './components/order-history-client';

import type { ClientOrder } from './components/order-history-client';

export const dynamic = 'force-dynamic';

export default async function OrderHistoryPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  const [orders, ordersErr] = await getUserOrdersWithItems();

  if (ordersErr) {
    const t = await getTranslations('OrderHistory');
    throw new Error(t('error.loadOrders'));
  }

  const clientOrders: ClientOrder[] = orders.map((o) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    createdAt:
      typeof o.createdAt === 'string' ? o.createdAt : o.createdAt.toISOString(),
    items: o.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name,
        type: (item.product as { type?: string }).type,
        imageBase64: item.product.imageBase64 ?? undefined,
      },
    })),
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderHistoryClient locale={locale} initialOrders={clientOrders} />
    </Suspense>
  );
}
