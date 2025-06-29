import { Suspense } from 'react';

import { getUserOrdersWithItems } from '@/features/order/actions';

import OrderHistoryClient from './components/order-history-client';

import type { ClientOrder } from './components/order-history-client';

export default async function OrderHistoryPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  const orders: ClientOrder[] = (await getUserOrdersWithItems()).map((o) => ({
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
      <OrderHistoryClient locale={locale} initialOrders={orders} />
    </Suspense>
  );
}
