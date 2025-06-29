'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ShoppingBag, Wallet2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/routing';
import { useCart } from '@/providers/cart-provider';

import { ShippingFormFields } from './components/shipping-form-fields';
import { StripePaymentForm } from './components/stripe-payment-form';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const SHIPPING_COST = 13.0;

function createCheckoutSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('nameMin')),
    email: z.string().email(t('emailInvalid')),
    address: z.string().min(5, t('addressMin')),
    city: z.string().min(2, t('cityMin')),
    state: z.string().min(2, t('stateMin')),
    postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, t('zipInvalid')),
    orderNotes: z.string().optional(),
  });
}

type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutSchema>>;

function PayPalPaymentButton({
  finalTotal,
  watch,
  isFormValid,
}: Readonly<{
  finalTotal: number;
  watch: () => CheckoutFormData;
  isFormValid: boolean;
}>) {
  const [{ isPending }] = usePayPalScriptReducer();
  const t = useTranslations('CheckoutPage');

  if (!isFormValid) {
    return (
      <div className="text-muted-foreground flex min-h-[100px] items-center justify-center">
        {t('complete_form')}
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="text-muted-foreground flex min-h-[100px] items-center justify-center">
        {t('loading_paypal')}
      </div>
    );
  }

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <PayPalButtons
        style={{
          layout: 'vertical',
          shape: 'rect',
        }}
        createOrder={(_, actions) => {
          const formData = watch();
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: finalTotal.toFixed(2),
                },
              },
            ],
            payer: formData.email
              ? {
                  email_address: formData.email,
                  name: {
                    given_name: formData.name,
                  },
                  address: {
                    address_line_1: formData.address,
                    admin_area_2: formData.city,
                    postal_code: formData.postalCode,
                    country_code: 'US',
                  },
                }
              : undefined,
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            return actions.order.capture().then((details) => {
              console.log('Payment completed:', details);
            });
          }
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const t = useTranslations('CheckoutPage');
  const cart = useCart();
  const { total, cart: cartItems = [] } = cart;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const schemaT = useTranslations('CheckoutSchema');
  const checkoutSchema = createCheckoutSchema(schemaT);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
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
    formState: { isValid },
  } = form;

  const subtotal = parseFloat(total || '0');
  const finalTotal = subtotal + SHIPPING_COST;

  useEffect(() => {
    const validateForm = async () => {
      await form.trigger();
    };
    void validateForm();
  }, [form]);

  const [clientSecret, setClientSecret] = useState<string>();

  useEffect(() => {
    if (paymentMethod === 'card' && isValid) {
      const formData = watch();
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
    }
  }, [paymentMethod, finalTotal, cartItems, watch, isValid]);

  const onSubmit = (data: CheckoutFormData) => {
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
                onValueChange={setPaymentMethod}
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
                    if (clientSecret) {
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
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        fill
                        sizes="64px"
                        alt={item.name}
                        src={
                          item.imageUrl ??
                          (item.category.name === 'Sacred Geometry'
                            ? `/products/sacred-geometry.svg#${item.id}`
                            : '/products/flower-essence.svg')
                        }
                        className="object-cover"
                      />
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('subtotal')}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('shipping')}
                    </span>
                    <span>${SHIPPING_COST.toFixed(2)}</span>
                  </div>
                  <Separator />
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
