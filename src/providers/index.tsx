import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { CartProvider } from './cart-provider';
import { PayPalProvider } from './paypal-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export async function Providers({ children }: Readonly<ProvidersProps>) {
  const messages = await getMessages();

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
