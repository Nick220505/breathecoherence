'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, use } from 'react';

export default function GuestOrderRedirect({
  params,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
}>) {
  const router = useRouter();
  const t = useTranslations('Account');
  // Use React's use hook to unwrap the params promise
  const resolvedParams = use(params);
  const { id, locale } = resolvedParams;
  const guestId = `guest-${id}`;

  useEffect(() => {
    // Use the correct URL format with locale
    router.push(`/${locale}/account/orders/${guestId}`);
  }, [router, guestId, locale]);

  return (
    <div className="container mx-auto py-16 text-center">
      <div className="text-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
      <p>{t('guest_order_redirect')}</p>
    </div>
  );
}
