import { Package2 } from 'lucide-react';
import NextLink from 'next/link';
import { getTranslations } from 'next-intl/server';

import type { OrderStatus } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { getOrdersByUser } from '@/features/order/actions';

export const dynamic = 'force-dynamic';

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
};

export default async function OrderHistoryPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const guestOrderId = resolvedSearchParams.guestId as string | undefined;

  const t = await getTranslations('OrderHistoryPage');
  const [orders, ordersErr] = await getOrdersByUser();

  if (ordersErr) {
    throw new Error(t('error.loadOrders'));
  }

  const isGuestView = !!guestOrderId;

  const getOrderUrl = (orderId: string) => {
    if (isGuestView) {
      return `/account/orders/${orderId}?guestId=${guestOrderId}`;
    }
    return `/account/orders/${orderId}`;
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-md space-y-8">
          <Package2 className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h1 className="text-3xl font-bold">{t('no_orders_title')}</h1>
          <p className="text-muted-foreground mb-6">{t('no_orders_message')}</p>
          <Link href="/store" className="inline-block">
            <Button className="w-full">{t('browse_products')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
            {isGuestView ? t('guest_order_title') : t('title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isGuestView ? t('guest_order_subtitle') : t('subtitle')}
          </p>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('order_id')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('total')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: 'medium',
                    }).format(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        statusColorMap[order.status]
                      }`}
                    >
                      {t(order.status.toLowerCase())}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <NextLink href={getOrderUrl(order.id)}>
                        {t('view_details')}
                      </NextLink>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
