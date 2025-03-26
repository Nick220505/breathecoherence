import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Toaster } from '@/components/ui/toaster';
import { routing } from '@/i18n/routing';

import { ChatBot } from './components/chat-bot';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Providers } from './providers';

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

  if (!routing.locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers messages={messages} locale={locale}>
          <div className="bg-background text-foreground relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
          <div className="fixed right-4 bottom-4 z-50">
            <Toaster />
          </div>
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
