import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/routing';

export default async function OrderDetailLoading() {
  const t = await getTranslations('OrderDetailLoading');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account/orders"
          className="mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_orders')}
        </Link>

        <div className="mb-8">
          <div>
            <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
              {t('title')}
            </h1>
            <Skeleton className="mt-1 h-4 w-24" />
          </div>
        </div>

        <Card className="bg-card/50 overflow-hidden p-6 shadow-lg backdrop-blur-lg">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <Skeleton className="h-20 w-20 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="text-muted-foreground text-sm">
                      {t('product_category')}:{' '}
                      <Skeleton className="inline h-4 w-16" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
                    <div className="text-muted-foreground text-sm">
                      {t('quantity')}: <Skeleton className="inline h-4 w-8" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>{t('total')}</span>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
