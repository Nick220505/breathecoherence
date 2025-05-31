import { Suspense } from 'react';

import OrderHistoryClient from './components/order-history-client';

export default async function OrderHistoryPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderHistoryClient locale={locale} />
    </Suspense>
  );
}
