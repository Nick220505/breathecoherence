'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Package2 } from 'lucide-react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';

import type { OrderWithItems } from '@/features/order/types';

const statusColorMap = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
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

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">
              <LayoutGrid className="mr-2 h-4 w-4" />
              {t('list_view')}
            </TabsTrigger>
            <TabsTrigger value="table">
              <Package2 className="mr-2 h-4 w-4" />
              {t('table_view')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {t('order_id')}:
                        </span>{' '}
                        <span className="font-medium">
                          #{order.id.slice(0, 8)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {t('date')}:
                        </span>{' '}
                        <span className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {t('total')}:
                        </span>{' '}
                        <span className="font-medium">
                          ${order.total.toFixed(2)}
                        </span>
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          statusColorMap[order.status]
                        }`}
                      >
                        {t(order.status.toLowerCase())}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          {item.product.imageBase64 && (
                            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                              <Image
                                src={item.product.imageBase64}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {t('quantity')}: {item.quantity} × $
                              {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" asChild>
                      <NextLink href={getOrderUrl(order.id)}>
                        {t('view_details')}
                      </NextLink>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="table">
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
                        {new Date(order.createdAt).toLocaleDateString()}
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
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
