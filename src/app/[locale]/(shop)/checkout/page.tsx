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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@/i18n/routing';
import { useCart } from '@/providers/cart-provider';

import { StripePaymentForm } from './components/stripe-payment-form';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const SHIPPING_COST = 13.0;

// Constants for styling
const ERROR_TEXT_CLASS = 'mt-1 text-sm text-red-500';
const ERROR_BORDER_CLASS = 'border-red-500';

// Zod validation schema
const checkoutSchema = z.object({
  // Billing Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(
      /^(\d{10}|(\d{3}-){2}\d{4}|\(\d{3}\) \d{3}-\d{4})$/,
      'Invalid US phone number (e.g., 1234567890, 123-456-7890, or (123) 456-7890)',
    ),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code (e.g., 12345 or 12345-6789)'),
  // Additional Information
  orderNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Create a separate PayPal component
function PayPalPaymentButton({
  finalTotal,
  watch,
}: Readonly<{
  finalTotal: number;
  watch: () => CheckoutFormData;
}>) {
  const [{ isPending }] = usePayPalScriptReducer();
  const t = useTranslations('CheckoutPage');

  if (isPending) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center">
        {t('loading_paypal')}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] items-center justify-center">
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
                    given_name: formData.firstName,
                    surname: formData.lastName,
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
              // Handle success
            });
          }
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const t = useTranslations('CheckoutPage');
  const { total, cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [clientSecret, setClientSecret] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {},
  });

  // Calculate totals
  const subtotal = parseFloat(total);
  const finalTotal = subtotal + SHIPPING_COST;

  // Create PaymentIntent as soon as the page loads
  useEffect(() => {
    if (paymentMethod === 'card') {
      fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal }),
      })
        .then((res) => res.json())
        .then((data: { clientSecret: string }) =>
          setClientSecret(data.clientSecret),
        )
        .catch((error) => console.error('Error:', error));
    }
  }, [paymentMethod, finalTotal]);

  const onSubmit = (data: CheckoutFormData) => {
    if (paymentMethod === 'card') {
      // Stripe payment is handled by StripePaymentForm
      console.log('Form data:', data);
    } else if (paymentMethod === 'paypal') {
      // PayPal is handled by PayPal buttons
    }
  };

  // Don't show checkout if cart is empty
  if (!cart || cart.length === 0) {
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
          {/* Billing & Shipping Information */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="bg-card/50 p-6 shadow-lg backdrop-blur-lg">
              <form
                onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    {t('billing_info')}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">{t('first_name')}</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className={errors.firstName ? ERROR_BORDER_CLASS : ''}
                        placeholder={t('placeholder.first_name')}
                      />
                      {errors.firstName && (
                        <p className={ERROR_TEXT_CLASS}>
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('last_name')}</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className={errors.lastName ? ERROR_BORDER_CLASS : ''}
                        placeholder={t('placeholder.last_name')}
                      />
                      {errors.lastName && (
                        <p className={ERROR_TEXT_CLASS}>
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? ERROR_BORDER_CLASS : ''}
                      placeholder={t('placeholder.email')}
                    />
                    {errors.email && (
                      <p className={ERROR_TEXT_CLASS}>{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">{t('address')}</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      className={errors.address ? ERROR_BORDER_CLASS : ''}
                      placeholder={t('placeholder.address')}
                    />
                    {errors.address && (
                      <p className={ERROR_TEXT_CLASS}>
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">{t('phone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className={errors.phone ? ERROR_BORDER_CLASS : ''}
                        placeholder={t('placeholder.phone_us')}
                      />
                      {errors.phone && (
                        <p className={ERROR_TEXT_CLASS}>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">{t('state')}</Label>
                      <Select
                        onValueChange={(value) => setValue('state', value)}
                      >
                        <SelectTrigger
                          className={errors.state ? ERROR_BORDER_CLASS : ''}
                        >
                          <SelectValue placeholder={t('placeholder.state')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="AR">Arkansas</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CT">Connecticut</SelectItem>
                          <SelectItem value="DE">Delaware</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="HI">Hawaii</SelectItem>
                          <SelectItem value="ID">Idaho</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="IN">Indiana</SelectItem>
                          <SelectItem value="IA">Iowa</SelectItem>
                          <SelectItem value="KS">Kansas</SelectItem>
                          <SelectItem value="KY">Kentucky</SelectItem>
                          <SelectItem value="LA">Louisiana</SelectItem>
                          <SelectItem value="ME">Maine</SelectItem>
                          <SelectItem value="MD">Maryland</SelectItem>
                          <SelectItem value="MA">Massachusetts</SelectItem>
                          <SelectItem value="MI">Michigan</SelectItem>
                          <SelectItem value="MN">Minnesota</SelectItem>
                          <SelectItem value="MS">Mississippi</SelectItem>
                          <SelectItem value="MO">Missouri</SelectItem>
                          <SelectItem value="MT">Montana</SelectItem>
                          <SelectItem value="NE">Nebraska</SelectItem>
                          <SelectItem value="NV">Nevada</SelectItem>
                          <SelectItem value="NH">New Hampshire</SelectItem>
                          <SelectItem value="NJ">New Jersey</SelectItem>
                          <SelectItem value="NM">New Mexico</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="ND">North Dakota</SelectItem>
                          <SelectItem value="OH">Ohio</SelectItem>
                          <SelectItem value="OK">Oklahoma</SelectItem>
                          <SelectItem value="OR">Oregon</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="RI">Rhode Island</SelectItem>
                          <SelectItem value="SC">South Carolina</SelectItem>
                          <SelectItem value="SD">South Dakota</SelectItem>
                          <SelectItem value="TN">Tennessee</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="UT">Utah</SelectItem>
                          <SelectItem value="VT">Vermont</SelectItem>
                          <SelectItem value="VA">Virginia</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="WV">West Virginia</SelectItem>
                          <SelectItem value="WI">Wisconsin</SelectItem>
                          <SelectItem value="WY">Wyoming</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className={ERROR_TEXT_CLASS}>
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="city">{t('city')}</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        className={errors.city ? ERROR_BORDER_CLASS : ''}
                        placeholder={t('placeholder.city')}
                      />
                      {errors.city && (
                        <p className={ERROR_TEXT_CLASS}>
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">{t('zip_code')}</Label>
                      <Input
                        id="postalCode"
                        {...register('postalCode')}
                        className={errors.postalCode ? ERROR_BORDER_CLASS : ''}
                        placeholder={t('placeholder.zip_code')}
                      />
                      {errors.postalCode && (
                        <p className={ERROR_TEXT_CLASS}>
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="orderNotes">{t('order_notes')}</Label>
                  <Textarea
                    id="orderNotes"
                    {...register('orderNotes')}
                    className="min-h-[100px]"
                    placeholder={t('placeholder.order_notes')}
                  />
                </div>
              </form>
            </Card>

            {/* 
              The shipping address section is dynamically rendered when `differentShippingAddress` is true.
              It currently does not have its own explicit "Country" field, as it seems to rely on the main
              billing address schema or was intended to be added. Since the previous step removed 
              `shippingCountry` from the Zod schema, there's no corresponding JSX to remove here for 
              a shipping-specific country field. If it were present, a similar removal diff block would be added.
            */}

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

              {paymentMethod === 'card' && clientSecret && (
                <div className="mt-6">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm />
                  </Elements>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="mt-6">
                  <PayPalPaymentButton finalTotal={finalTotal} watch={watch} />
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 sticky top-24 p-6 shadow-lg backdrop-blur-lg">
              <h2 className="mb-4 text-xl font-semibold">
                {t('order_summary')}
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={
                          item.imageUrl ??
                          (item.type === 'Sacred Geometry'
                            ? `/products/sacred-geometry.svg#${item.id}`
                            : '/products/flower-essence.svg')
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
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
