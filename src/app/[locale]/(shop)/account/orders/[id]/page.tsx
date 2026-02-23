import type { OrderStatus } from '@/features/order/schemas';
import { ArrowLeft, Package2 } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getOrderDetail } from '@/features/order/actions';

export const dynamic = 'force-dynamic';

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { id: orderId } = await params;
  const resolvedSearchParams = await searchParams;
  const guestOrderId = resolvedSearchParams.guestId as string | undefined;

  const t = await getTranslations('OrderDetailPage');
  const { data: order, serverError } = await getOrderDetail({ id: orderId });

  if (serverError || !order) {
    throw new Error(t('error.loadOrder'));
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-md space-y-8">
          <Package2 className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h1 className="text-3xl font-bold">{t('not_found_title')}</h1>
          <p className="text-muted-foreground mb-6">{t('not_found_message')}</p>
          <NextLink
            href="/account/orders"
            className="inline-flex items-center rounded-md bg-linear-to-r from-purple-600 to-blue-600 px-8 py-2 font-medium text-white transition-colors hover:from-purple-700 hover:to-blue-700"
          >
            {t('back_to_orders')}
          </NextLink>
        </div>
      </div>
    );
  }

  const isGuestOrder = !!guestOrderId;
  const backUrl = isGuestOrder
    ? `/account/orders?guestId=${guestOrderId}`
    : '/account/orders';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <NextLink
          href={backUrl}
          className="mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_orders')}
        </NextLink>

        <div className="mb-8">
          <div>
            <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              #{order.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <Card className="bg-card/50 overflow-hidden p-6 shadow-lg backdrop-blur-lg">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <span
              className={`self-start rounded-full px-3 py-1 text-sm font-medium ${
                statusColorMap[order.status]
              }`}
            >
              {t(`status_${order.status.toLowerCase()}`)}
            </span>
            <p className="text-muted-foreground text-sm">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={
                      item.product.imageBase64 &&
                      item.product.imageBase64.trim() !== ''
                        ? item.product.imageBase64
                        : '/products/flower-essence.svg'
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t('product_category')}: Product
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
                    <p className="text-muted-foreground text-sm">
                      {t('quantity')}: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <div className="flex justify-between text-lg font-bold">
              <span>{t('total')}</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
