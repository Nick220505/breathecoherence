'use client';

import type { Category } from '@prisma/client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

interface StoreHeaderProps {
  category?: Category | null;
}

export function StoreHeader({ category }: Readonly<StoreHeaderProps>) {
  const t = useTranslations('StoreHeader');

  const title = category
    ? t('category_title', { name: category.name })
    : t('title');

  const subtitle = category?.description ?? t('subtitle');

  return (
    <motion.div
      className="space-y-8 py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <h1
          className={cn(
            'bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text leading-tight font-bold text-transparent dark:from-purple-400 dark:to-blue-400',
            'text-5xl md:text-6xl lg:text-7xl',
          )}
        >
          {title}
        </h1>

        {category && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/10 text-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
          >
            {category.name}
          </motion.div>
        )}

        <div className="relative">
          <div className="absolute -top-2 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-linear-to-r from-purple-600 to-blue-600 opacity-50 blur-lg" />
          <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-purple-600 to-blue-600" />
        </div>

        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
