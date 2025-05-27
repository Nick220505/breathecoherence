import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactNode } from 'react';

import { CartProvider } from './cart-provider';
import { PayPalProvider } from './paypal-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  const messages = useMessages();

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <PayPalProvider>{children}</PayPalProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}