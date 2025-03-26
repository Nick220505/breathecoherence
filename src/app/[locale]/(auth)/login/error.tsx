'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default function LoginError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const t = useTranslations('LoginPage');

  return (
    <div className="from-background via-background/80 to-background flex min-h-screen items-center justify-center bg-linear-to-b px-4">
      <div className="w-full max-w-[450px]">
        <div>
          <Link
            href="/"
            className="mb-12 flex items-center justify-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <div className="relative h-24 w-72">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                fill
                sizes="(max-width: 288px) 100vw, 288px"
                className="object-contain transition-all duration-300 hover:scale-105 dark:invert"
                priority
              />
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-red-500/20 bg-white/10 shadow-xl backdrop-blur-lg dark:bg-gray-950/50"
        >
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('errorOccurred') || 'An error occurred'}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {error.message ||
                  t('tryAgainLater') ||
                  'Please try again later'}
              </p>
            </div>

            <Button
              onClick={reset}
              className="flex transform items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4" />
              {t('tryAgain') || 'Try again'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
