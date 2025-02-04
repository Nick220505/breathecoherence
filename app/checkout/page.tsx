"use client";

import { useCart } from "@/components/cart-provider";
import { useTranslation } from "@/components/language-provider";
import { StripePaymentForm } from "@/components/stripe-payment-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { CreditCard, Lock, ShoppingBag, Wallet2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const SHIPPING_COST = 13.0;

// Zod validation schema
const checkoutSchema = z.object({
  // Billing Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Please select a country"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  // Shipping Information (optional based on differentShippingAddress)
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingCountry: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  // Additional Information
  orderNotes: z.string().optional(),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Create a separate PayPal component
function PayPalPaymentButton({
  finalTotal,
  watch,
}: {
  finalTotal: number;
  watch: () => CheckoutFormData;
}) {
  const [{ isPending }] = usePayPalScriptReducer();
  const { t } = useTranslation();

  if (isPending) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        {t("checkout.loading_paypal")}
      </div>
    );
  }

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <PayPalButtons
        style={{
          layout: "vertical",
          shape: "rect",
        }}
        createOrder={(_, actions) => {
          const formData = watch();
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
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
                    country_code: formData.country,
                  },
                }
              : undefined,
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            return actions.order.capture().then((details) => {
              console.log("Payment completed:", details);
              // Handle success
            });
          }
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { total, cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [differentShippingAddress, setDifferentShippingAddress] =
    useState(false);
  const [clientSecret, setClientSecret] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      acceptedTerms: false,
    },
  });

  // Calculate totals
  const subtotal = parseFloat(total);
  const finalTotal = subtotal + SHIPPING_COST;

  // Create PaymentIntent as soon as the page loads
  useEffect(() => {
    if (paymentMethod === "card") {
      fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => console.error("Error:", error));
    }
  }, [paymentMethod, finalTotal]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (paymentMethod === "card") {
      // Stripe payment is handled by StripePaymentForm
      console.log("Form data:", data);
    } else if (paymentMethod === "paypal") {
      // PayPal is handled by PayPal buttons
    }
  };

  // Don't show checkout if cart is empty
  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-6"
        >
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h1 className="text-3xl font-bold">{t("checkout.empty_cart")}</h1>
          <p className="text-muted-foreground">
            {t("checkout.empty_cart_message")}
          </p>
          <Button
            onClick={() => (window.location.href = "/store")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {t("checkout.continue_shopping")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-8">
          <Lock className="h-5 w-5 text-green-500" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            {t("checkout.title")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing & Shipping Information */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 shadow-lg bg-card/50 backdrop-blur-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {t("checkout.billing_info")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        onValueChange={(value) => setValue("country", value)}
                      >
                        <SelectTrigger
                          className={errors.country ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CO">Colombia</SelectItem>
                          {/* Add more countries as needed */}
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State/Department *</Label>
                      <Select
                        onValueChange={(value) => setValue("state", value)}
                      >
                        <SelectTrigger
                          className={errors.state ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BOG">Bogotá</SelectItem>
                          {/* Add more states as needed */}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        {...register("postalCode")}
                        className={errors.postalCode ? "border-red-500" : ""}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="differentShipping"
                      checked={differentShippingAddress}
                      onCheckedChange={(checked) =>
                        setDifferentShippingAddress(checked as boolean)
                      }
                    />
                    <Label htmlFor="differentShipping">
                      {t("checkout.different_shipping")}
                    </Label>
                  </div>

                  {differentShippingAddress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-semibold">
                        {t("checkout.shipping_info")}
                      </h2>
                      {/* Add shipping address fields with their own validation */}
                    </motion.div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="orderNotes">
                    {t("checkout.order_notes")}
                  </Label>
                  <Textarea
                    id="orderNotes"
                    {...register("orderNotes")}
                    className="min-h-[100px]"
                  />
                </div>
              </form>
            </Card>

            <Card className="p-6 shadow-lg bg-card/50 backdrop-blur-lg">
              <h2 className="text-xl font-semibold mb-4">
                {t("checkout.payment_method")}
              </h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t("checkout.card_payment")}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2">
                    <Wallet2 className="h-4 w-4" />
                    {t("checkout.paypal")}
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && clientSecret && (
                <div className="mt-6">
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm />
                  </Elements>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="mt-6">
                  <PayPalPaymentButton finalTotal={finalTotal} watch={watch} />
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg bg-card/50 backdrop-blur-lg sticky top-24">
              <h2 className="text-xl font-semibold mb-4">
                {t("checkout.order_summary")}
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={
                          item.imageUrl ||
                          (item.type === "Sacred Geometry"
                            ? `/products/sacred-geometry.svg#${item.id}`
                            : "/products/flower-essence.svg")
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium leading-none truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        x{item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("checkout.subtotal")}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("checkout.shipping")}
                    </span>
                    <span>${SHIPPING_COST.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("checkout.total")}</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="terms"
                    {...register("acceptedTerms")}
                    className={errors.acceptedTerms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    {t("checkout.terms")}
                  </Label>
                </div>
                {errors.acceptedTerms && (
                  <p className="text-sm text-red-500">
                    {errors.acceptedTerms.message}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
