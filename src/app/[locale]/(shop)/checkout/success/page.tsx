import { Suspense } from 'react';

import CheckoutSuccessClient from './components/checkout-success-client';

export default async function CheckoutSuccessPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessClient locale={locale} />
    </Suspense>
  );
}
