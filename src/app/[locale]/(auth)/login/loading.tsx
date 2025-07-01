'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

export default function LoginLoading() {
  const t = useTranslations('LoginLoading');

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

        <div className="overflow-hidden rounded-2xl border border-purple-500/10 bg-white/10 shadow-xl backdrop-blur-lg dark:bg-gray-950/50">
          <div className="flex flex-col items-center justify-center space-y-6 p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <p className="text-center text-gray-600 dark:text-gray-400">
              {t('loading')}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
