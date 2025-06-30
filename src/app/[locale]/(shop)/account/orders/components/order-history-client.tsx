'use client';

import { motion } from 'framer-motion';
import { Package2 } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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

import type { OrderWithItems } from '@/features/order/types';

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
};

export default function OrderHistoryClient({
  locale,
  initialOrders = [],
}: Readonly<{
  locale: string;
  initialOrders?: OrderWithItems[];
}>) {
  const t = useTranslations('OrderHistory');
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestOrderId = searchParams.get('guestId');

  const [orders] = useState<OrderWithItems[]>(initialOrders);
  const [loading, setLoading] = useState(initialOrders.length === 0);

  const error: string | null = null;

  const isGuestView = Boolean(guestOrderId);

  useEffect(() => {
    if (guestOrderId?.startsWith('guest-')) {
      router.push(`/account/orders/${guestOrderId}`);
    }
  }, [guestOrderId, router]);

  useEffect(() => {
    if (orders.length === 0 && !guestOrderId?.startsWith('guest-')) {
      setLoading(false);
    }
  }, [guestOrderId, orders.length]);

  const getOrderUrl = (orderId: string) =>
    `/${locale}/account/orders/${orderId}`;

  if (guestOrderId?.startsWith('guest-')) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-24">
        <div className="text-center">
          <div className="text-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-24">
        <div className="text-center">
          <div className="text-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md space-y-8"
        >
          <Package2 className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h1 className="text-3xl font-bold">{t('error_title')}</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-linear-to-r from-purple-600 to-blue-600 px-8 hover:from-purple-700 hover:to-blue-700"
          >
            {t('try_again')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md space-y-8"
        >
          <Package2 className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h1 className="text-3xl font-bold">{t('no_orders_title')}</h1>
          <p className="text-muted-foreground mb-6">{t('no_orders_message')}</p>
          <Link href="/store" className="inline-block">
            <Button className="bg-linear-to-r from-purple-600 to-blue-600 px-8 hover:from-purple-700 hover:to-blue-700">
              {t('browse_products')}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
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
      </motion.div>
    </div>
  );
}
