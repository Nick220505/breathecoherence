'use client';

import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

import { CartProvider } from './cart-provider';
import { PayPalProvider } from './paypal-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  readonly children: ReactNode;
  readonly messages: Record<string, unknown>;
  readonly locale: string;
}

export function Providers({
  children,
  messages,
  locale,
}: Readonly<ProvidersProps>) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <PayPalProvider>{children}</PayPalProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
