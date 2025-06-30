'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Package2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { OrderStatus } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    type?: string;
    imageBase64?: string | null;
    category?: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string | Date;
  items: OrderItem[];
}

const statusColorMap: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
};

export default function OrderDetailClient({
  orderId,
  locale,
  initialOrder,
}: Readonly<{
  orderId: string;
  locale: string;
  initialOrder?: Order | null;
}>) {
  const t = useTranslations('OrderDetail');
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(initialOrder ?? null);
  const [loading, setLoading] = useState(!initialOrder);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        console.log('OrderDetailClient: Fetching order with ID:', orderId);

        const isGuestOrder = orderId.startsWith('guest-');

        console.log('OrderDetailClient: Is guest order:', isGuestOrder);

        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }
        const data = (await response.json()) as Order;
        setOrder(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error loading order details. Please try again later.',
        );
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId && !initialOrder) {
      void fetchOrder();
    }
  }, [orderId, initialOrder]);

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
            onClick={() => router.back()}
            className="bg-linear-to-r from-purple-600 to-blue-600 px-8 hover:from-purple-700 hover:to-blue-700"
          >
            {t('back_to_orders')}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md space-y-8"
        >
          <Package2 className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h1 className="text-3xl font-bold">{t('not_found_title')}</h1>
          <p className="text-muted-foreground mb-6">{t('not_found_message')}</p>
          <Button
            onClick={() => router.back()}
            className="bg-linear-to-r from-purple-600 to-blue-600 px-8 hover:from-purple-700 hover:to-blue-700"
          >
            {t('back_to_orders')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const isGuestOrder = order.id.startsWith('guest-');

  const handleBackClick = () => {
    if (isGuestOrder) {
      router.push(`/${locale}/account/orders?guestId=${order.id}`);
    } else {
      router.push(`/${locale}/account/orders`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 pl-0 text-blue-600"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_orders')}
        </Button>

        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                {t('title')}
              </h1>
              <p className="text-muted-foreground mt-1">
                #{order.id.slice(0, 8)}
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
        </div>

        <Card className="bg-card/50 overflow-hidden p-6 shadow-lg backdrop-blur-lg">
          <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold">{t('order_details')}</h2>
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
                  {(() => {
                    const actualImageValue: unknown = item.product.imageBase64;
                    const categoryName =
                      item.product.type ?? item.product.category?.name ?? '';

                    let imageToDisplay: string;

                    if (
                      typeof actualImageValue === 'string' &&
                      actualImageValue.trim() !== ''
                    ) {
                      imageToDisplay = actualImageValue;
                    } else if (categoryName === 'Sacred Geometry') {
                      imageToDisplay = `/products/sacred-geometry.svg#${item.product.id}`;
                    } else {
                      imageToDisplay = '/products/flower-essence.svg';
                    }

                    return (
                      <Image
                        src={imageToDisplay}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    );
                  })()}
                </div>
                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {t('product_category')}:{' '}
                      {(
                        item.product.type ??
                        item.product.category?.name ??
                        ''
                      ).replace('_', ' ')}
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('subtotal')}</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('shipping')}</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('tax')}</span>
              <span>$0.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>{t('total')}</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
