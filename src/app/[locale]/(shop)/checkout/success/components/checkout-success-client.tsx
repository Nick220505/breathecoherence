'use client';

import { motion } from 'framer-motion';
import { Check, ChevronRight, Package } from 'lucide-react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { OrderDetails } from '@/features/order/types';
import { Link } from '@/i18n/routing';
import { useCart } from '@/providers/cart-provider';

export default function CheckoutSuccessClient({
  locale,
}: Readonly<{
  locale: string;
}>) {
  const t = useTranslations('CheckoutSuccessClient');
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, removeFromCart } = useCart();

  const getOrderUrl = (orderId: string) => {
    return `/${locale}/account/orders/${orderId}`;
  };

  useEffect(() => {
    if (paymentIntentId && cart.length > 0) {
      cart.forEach((item) => removeFromCart(item.id));
    }
  }, [paymentIntentId, cart, removeFromCart]);

  useEffect(() => {
    async function fetchOrderFromPayment() {
      if (!paymentIntentId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/payments/${paymentIntentId}`);
        if (response.ok) {
          const data = (await response.json()) as OrderDetails;
          setOrderDetails(data);
        } else {
          const errorData = (await response.json()) as { error?: string };
          setError(errorData.error ?? t('error_fetching_order'));
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(t('error_fetching_order'));
      } finally {
        setIsLoading(false);
      }
    }

    void fetchOrderFromPayment();
  }, [paymentIntentId, t]);

  const renderOrderDetails = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-t-2 border-b-2"></div>
          <span className="ml-2">{t('loading_details')}</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500">
          <p>{error}</p>
          <p className="mt-2 text-sm">{t('try_view_orders')}</p>
        </div>
      );
    }

    if (orderDetails?.orderId) {
      return (
        <>
          <p>
            <span className="text-muted-foreground mr-2">{t('order_id')}:</span>
            <span className="font-medium">
              #{orderDetails.orderId.slice(0, 8)}
            </span>
          </p>
          {Boolean(orderDetails.amount) && (
            <p>
              <span className="text-muted-foreground mr-2">
                {t('total_amount')}:
              </span>
              <span className="font-medium">
                ${orderDetails.amount.toFixed(2)}
              </span>
            </p>
          )}
          <p>
            <span className="text-muted-foreground mr-2">{t('status')}:</span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              {orderDetails.status === 'succeeded'
                ? t('succeeded')
                : orderDetails.status}
            </span>
          </p>
          <p className="text-muted-foreground">{t('confirmation_sent')}</p>
        </>
      );
    }

    return <p className="text-muted-foreground">{t('no_order_details')}</p>;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <div className="bg-primary mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <Check className="h-12 w-12 text-white" />
          </div>
          <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg">{t('subtitle')}</p>
        </div>

        <Card className="bg-card/50 mb-8 overflow-hidden p-6 text-center shadow-lg backdrop-blur-lg">
          <div className="mb-4 flex items-center justify-center">
            <Package className="mr-2 h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">{t('order_details')}</h2>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-4">
            {renderOrderDetails()}

            <div className="flex flex-col items-center justify-center space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              {orderDetails?.orderId && (
                <Button
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:w-auto"
                  asChild
                >
                  <NextLink href={getOrderUrl(orderDetails.orderId)}>
                    {t('view_order')}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </NextLink>
                </Button>
              )}
              <Button className="w-full sm:w-auto" variant="outline" asChild>
                <NextLink href={`/${locale}/account/orders`}>
                  {t('view_all_orders')}
                </NextLink>
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t('continue_shopping')}</p>
          <Button variant="outline" asChild>
            <Link href="/store">{t('back_to_store')}</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
