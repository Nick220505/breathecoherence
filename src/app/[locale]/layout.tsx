import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { CartProvider } from '@/components/cart-provider';
import { ChatBot } from '@/components/chat-bot';
import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation/index';
import { PayPalProvider } from '@/components/paypal-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: 'en' | 'es' }>;
}>) {
  const locale = (await params).locale;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <CartProvider>
                <PayPalProvider>
                  <div className="bg-background text-foreground relative flex min-h-screen flex-col">
                    {/* Geometric Background Pattern */}
                    <div className="fixed inset-0 -z-10 opacity-10 dark:opacity-20">
                      <div className="animate-blob absolute top-0 left-0 h-96 w-96 rounded-full bg-purple-500/30 mix-blend-multiply blur-3xl filter" />
                      <div className="animate-blob animation-delay-2000 absolute top-0 right-0 h-96 w-96 rounded-full bg-yellow-500/30 mix-blend-multiply blur-3xl filter" />
                      <div className="animate-blob animation-delay-4000 absolute bottom-0 left-0 h-96 w-96 rounded-full bg-pink-500/30 mix-blend-multiply blur-3xl filter" />
                      <div className="animate-blob animation-delay-6000 absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/30 mix-blend-multiply blur-3xl filter" />
                    </div>

                    {/* Sacred Geometry Line Pattern */}
                    <div className="fixed inset-0 -z-10 opacity-10 dark:opacity-5">
                      <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id="grid"
                            width="50"
                            height="50"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 50 0 L 0 0 0 50"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            />
                            <circle
                              cx="0"
                              cy="0"
                              r="2"
                              fill="currentColor"
                              opacity="0.3"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    <Navigation />
                    <main className="flex-1 pt-16">{children}</main>
                    <Footer />
                  </div>
                  <div className="fixed right-4 bottom-4 z-50">
                    <Toaster />
                  </div>
                  <ChatBot />
                </PayPalProvider>
              </CartProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
