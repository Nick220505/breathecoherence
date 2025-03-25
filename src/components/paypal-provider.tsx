'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// PayPal script options
const paypalScriptOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: 'USD',
  intent: 'capture',
  components: 'buttons',
};

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
