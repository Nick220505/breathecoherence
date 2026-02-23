'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ShoppingBag, Wallet2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { checkoutSchema } from '@/features/order/schemas';
import type { Checkout } from '@/features/order/types';
import { Link } from '@/i18n/routing';
import { useCart } from '@/providers/cart-provider';

import { PayPalPaymentButton } from './components/paypal-payment-button';
import { ShippingFormFields } from './components/shipping-form-fields';
import { StripePaymentForm } from './components/stripe-payment-form';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const t = useTranslations('CheckoutPage');
  const cart = useCart();
  const { total, cart: cartItems = [] } = cart;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const form = useForm<Checkout>({
    resolver: zodResolver(checkoutSchema, {
      error: (issue) => {
        const path = issue.path?.join('.') ?? '';

        if (path === 'name' && issue.code === 'too_small') {
          return t('validation.nameMin');
        }
        if (path === 'email' && issue.code === 'invalid_format') {
          return t('validation.emailInvalid');
        }
        if (path === 'address' && issue.code === 'too_small') {
          return t('validation.addressMin');
        }
        if (path === 'city' && issue.code === 'too_small') {
          return t('validation.cityMin');
        }
        if (path === 'state' && issue.code === 'too_small') {
          return t('validation.stateMin');
        }
        if (path === 'postalCode' && issue.code === 'invalid_format') {
          return t('validation.zipInvalid');
        }
      },
    }),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      orderNotes: '',
    },
  });

  const {
    handleSubmit,
    watch,
    getValues,
    formState: { isValid },
  } = form;

  const subtotal = parseFloat(total || '0');
  const finalTotal = subtotal;

  const [clientSecret, setClientSecret] = useState<string>();

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    void form.trigger();
  };

  useEffect(() => {
    if (paymentMethod === 'card' && isValid) {
      const formData = getValues();
      const fetchClientSecret = async () => {
        try {
          const response = await fetch('/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: finalTotal,
              items: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price || 0,
                quantity: item.quantity || 1,
              })),
              shippingDetails: {
                name: formData.name || '',
                email: formData.email || '',
                address: formData.address || '',
                city: formData.city || '',
                state: formData.state || '',
                zipCode: formData.postalCode || '',
              },
            }),
          });
          const data = (await response.json()) as { clientSecret: string };
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
        }
      };

      void fetchClientSecret();
    } else if (paymentMethod === 'card' && !isValid) {
      const timer = setTimeout(() => {
        setClientSecret(undefined);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, finalTotal, cartItems, getValues, isValid]);

  const onSubmit = (data: Checkout) => {
    if (paymentMethod === 'card') {
      console.log('Form data:', data);
    } else if (paymentMethod === 'paypal') {
      console.log('PayPal submission handled by button');
    }
  };

  if (!cart || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md space-y-8"
        >
          <ShoppingBag className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h1 className="text-3xl font-bold">{t('empty_cart')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('empty_cart_message')}
          </p>
          <Link href="/store" className="inline-block">
            <Button className="bg-linear-to-r from-purple-600 to-blue-600 px-8 hover:from-purple-700 hover:to-blue-700">
              {t('continue_shopping')}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 flex items-center gap-2">
          <Lock className="h-5 w-5 text-green-500" />
          <h1 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
            {t('title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card className="bg-card/50 p-6 shadow-lg backdrop-blur-lg">
              <form
                onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                className="space-y-6"
              >
                <ShippingFormFields form={form} />
              </form>
            </Card>

            <Card className="bg-card/50 p-6 shadow-lg backdrop-blur-lg">
              <h2 className="mb-4 text-xl font-semibold">
                {t('payment_method')}
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={handlePaymentMethodChange}
                className="space-y-4"
              >
                <div className="hover:bg-accent flex items-center space-x-3 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t('card_payment')}
                  </Label>
                </div>
                <div className="hover:bg-accent flex items-center space-x-3 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2">
                    <Wallet2 className="h-4 w-4" />
                    {t('paypal')}
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="mt-6">
                  {(() => {
                    if (clientSecret && isValid) {
                      return (
                        <Elements
                          stripe={stripePromise}
                          options={{ clientSecret }}
                        >
                          <StripePaymentForm />
                        </Elements>
                      );
                    }

                    if (isValid) {
                      return (
                        <div className="text-muted-foreground flex min-h-[100px] items-center justify-center">
                          {t('loading_payment_form')}
                        </div>
                      );
                    }

                    return (
                      <div className="text-muted-foreground flex min-h-[100px] items-center justify-center">
                        {t('complete_form')}
                      </div>
                    );
                  })()}
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="mt-6">
                  <PayPalPaymentButton
                    finalTotal={finalTotal}
                    watch={watch}
                    isFormValid={isValid}
                  />
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-card/50 sticky top-24 p-6 shadow-lg backdrop-blur-lg">
              <h2 className="mb-4 text-xl font-semibold">
                {t('order_summary')}
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border-2 border-dashed">
                      {item.imageBase64 ? (
                        <Image
                          fill
                          sizes="64px"
                          alt={item.name}
                          src={item.imageBase64}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="text-muted-foreground/50 h-6 w-6">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                              />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="truncate leading-none font-medium">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-sm">
                        x{item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('total')}</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
