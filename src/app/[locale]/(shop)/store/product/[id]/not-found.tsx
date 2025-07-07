'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, PackageX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function ProductNotFound() {
  const t = useTranslations('ProductNotFound');

  return (
    <div className="from-background via-background/80 to-background min-h-screen bg-linear-to-b">
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
        <motion.div
          className="space-y-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <motion.div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <PackageX className="h-12 w-12" />
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text pb-1 text-4xl leading-tight font-bold text-transparent md:text-5xl dark:from-purple-400 dark:to-blue-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t('title')}
            </motion.h1>

            <motion.p
              className="mx-auto max-w-md text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {t('description')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              asChild
              className="transform bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
            >
              <Link href="/store">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back_to_store')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
