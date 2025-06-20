import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';

import { ChatBot } from './components/chat-bot';
import { Footer } from './components/footer';
import { Header } from './components/header';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'es')) notFound();

  setRequestLocale(locale);
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isDashboard = pathname.startsWith(`/${locale}/dashboard`);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="bg-background text-foreground relative flex min-h-screen flex-col">
            {!isDashboard && <Header />}
            <main className={cn('flex-1', !isDashboard && 'pt-16')}>
              {children}
            </main>
            {!isDashboard && <Footer />}
          </div>
          <div className="fixed right-4 bottom-4 z-50">
            <Toaster />
          </div>
          {!isDashboard && <ChatBot />}
        </Providers>
      </body>
    </html>
  );
}
