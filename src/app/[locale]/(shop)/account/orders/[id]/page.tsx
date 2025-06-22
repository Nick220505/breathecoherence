import { getOrderDetailServer } from '@/features/order/actions';

import OrderDetailClient from './components/order-detail-client';

export default async function OrderDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
}>) {
  const { id, locale } = await params;

  const order = await getOrderDetailServer(id);

  return (
    <OrderDetailClient orderId={id} locale={locale} initialOrder={order} />
  );
}
