'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function CTASection() {
  const t = useTranslations('HomePage');

  return (
    <section className="from-background/80 to-background bg-linear-to-b py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          className="mx-auto max-w-3xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-purple-400 dark:to-blue-400">
            {t('cta.title')}
          </h2>
          <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
            {t('cta.description')}
          </p>
          <div className="mx-auto h-px w-full max-w-xs bg-linear-to-r from-transparent via-purple-500/20 to-transparent" />
          <motion.div
            className="flex justify-center gap-4 pt-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Link href="/store">
                <Button
                  variant="default"
                  size="lg"
                  className="h-auto transform bg-linear-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600"
                >
                  {t('cta.shop')}
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto transform border-purple-500/20 px-8 py-6 text-lg transition-transform duration-300 hover:scale-105 hover:bg-purple-500/10"
                >
                  {t('cta.signin')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
