'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, Package2 } from 'lucide-react';
import Image from 'next/image';
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

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    type: string;
    imageBase64?: string | null;
  };
}

interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const statusColorMap = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderHistoryPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const t = useTranslations('OrderHistory');
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestOrderId = searchParams.get('guestId');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGuestView, setIsGuestView] = useState(false);
  const [locale, setLocale] = useState<string | null>(null);

  // Set the locale from params
  useEffect(() => {
    async function resolveLocale() {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
    }
    void resolveLocale();
  }, [params]);

  // Handle direct navigation to a specific guest order ID
  useEffect(() => {
    if (guestOrderId?.startsWith('guest-')) {
      // If we have a specific guest order ID, redirect to the order details page
      router.push(`/account/orders/${guestOrderId}`);
    }
  }, [guestOrderId, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // If there's a guestId parameter, fetch just that guest order
        let url = '/api/orders';
        if (guestOrderId) {
          url += `?guestId=${guestOrderId}`;
          setIsGuestView(true);
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = (await response.json()) as Order[];
        setOrders(data);
      } catch (err) {
        setError('Error loading your orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch orders if we're not redirecting to a specific guest order
    if (!guestOrderId?.startsWith('guest-')) {
      void fetchOrders();
    }
  }, [guestOrderId]);

  // Create a helper function for locale-aware order URLs
  const getOrderUrl = (orderId: string) => {
    if (!locale) return '';
    return `/${locale}/account/orders/${orderId}`;
  };

  // Don't render anything if we're redirecting to a specific guest order
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

        {!isGuestView && (
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 sm:w-[400px]">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                {t('list_view')}
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                {t('grid_view')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="w-full">
              <Card className="bg-card/50 overflow-hidden p-6 shadow-lg backdrop-blur-lg">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('order_id')}</TableHead>
                        <TableHead>{t('date')}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className="text-right">
                          {t('total')}
                        </TableHead>
                        <TableHead className="text-right">
                          {t('actions')}
                        </TableHead>
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
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                statusColorMap[order.status]
                              }`}
                            >
                              {t(`status_${order.status.toLowerCase()}`)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                              asChild
                            >
                              <a href={getOrderUrl(order.id)}>
                                {t('view_details')}
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="grid" className="w-full">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="bg-card/50 flex h-full flex-col p-6 shadow-lg backdrop-blur-lg"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">#{order.id.slice(0, 8)}</h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          statusColorMap[order.status]
                        }`}
                      >
                        {t(`status_${order.status.toLowerCase()}`)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <Separator className="my-4" />
                    <div className="mb-4 flex-1">
                      <div className="mb-3 text-sm font-medium">
                        {t('items')}
                      </div>
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <div className="relative h-10 w-10 overflow-hidden rounded bg-gray-100">
                              {item.product.imageBase64 ? (
                                <Image
                                  src={`data:image/png;base64,${item.product.imageBase64}`}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs">
                                  {item.product.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {item.product.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                x{item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-muted-foreground text-xs">
                            +{order.items.length - 3} {t('more_items')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between border-t pt-4">
                        <span className="font-medium">{t('total')}</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4 w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                        asChild
                      >
                        <a href={getOrderUrl(order.id)}>{t('view_details')}</a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {isGuestView && (
          <Card className="bg-card/50 overflow-hidden p-6 shadow-lg backdrop-blur-lg">
            <div className="mb-6 flex items-center">
              <Package2 className="mr-2 h-5 w-5 text-green-500" />
              <h2 className="text-xl font-semibold">
                {t('guest_order_details')}
              </h2>
            </div>
            <Separator className="mb-6" />

            {orders.map((order) => (
              <div key={order.id} className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-medium">#{order.id.slice(0, 8)}</h3>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`self-start rounded-full px-3 py-1 text-sm font-medium sm:self-center ${
                      statusColorMap[order.status]
                    }`}
                  >
                    {t(`status_${order.status.toLowerCase()}`)}
                  </span>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-4 text-sm font-medium">{t('items')}</div>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                          {item.product.imageBase64 ? (
                            <Image
                              src={`data:image/png;base64,${item.product.imageBase64}`}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm">
                              {item.product.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            x{item.quantity} - $
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <span className="text-muted-foreground">
                      {t('total')}:{' '}
                    </span>
                    <span className="text-lg font-bold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    asChild
                  >
                    <a href={getOrderUrl(order.id)}>{t('view_details')}</a>
                  </Button>
                </div>

                <Separator className="mt-6" />

                <div className="text-center">
                  <Link href="/store" className="inline-block">
                    <Button variant="outline" className="mt-4">
                      {t('continue_shopping')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </Card>
        )}
      </motion.div>
    </div>
  );
}
