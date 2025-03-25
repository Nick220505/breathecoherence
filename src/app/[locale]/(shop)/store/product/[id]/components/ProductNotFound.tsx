'use client';

import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProductNotFound() {
  const t = useTranslations('ProductPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          {t('product_not_found')}
        </p>
        <Link
          href="/store"
          className="text-primary hover:text-primary/80 inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_store')}
        </Link>
      </motion.div>
    </div>
  );
}
