import { getOrderDetailServer } from '@/features/order/actions';

import OrderDetailClient from './components/order-detail-client';

export default async function OrderDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
}>) {
  const { id, locale } = await params;

  let order = null;
  try {
    order = await getOrderDetailServer(id);
  } catch {
    // ignore
  }

  return (
    <OrderDetailClient
      orderId={id}
      locale={locale}
      initialOrder={order ?? undefined}
    />
  );
}
