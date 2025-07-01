'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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

export function HeroSection() {
  const t = useTranslations('HeroSection');

  return (
    <section className="from-background via-background/80 to-background relative overflow-hidden bg-linear-to-b py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/BC-logo-transp-120.png"
            alt="Breathe Coherence"
            width={120}
            height={120}
            className="h-[200px] w-[200px] dark:invert"
            priority
          />
        </motion.div>
        <motion.div
          className="mx-auto max-w-4xl space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text px-4 text-4xl leading-normal font-bold text-transparent md:text-5xl lg:text-6xl dark:from-purple-400 dark:to-blue-400"
            variants={fadeInUp}
          >
            {t('title')}
          </motion.h1>
          <motion.div
            className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-purple-600 to-blue-600"
            variants={fadeInUp}
          />
          <motion.p
            className="mx-auto max-w-2xl px-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300"
            variants={fadeInUp}
          >
            {t('subtitle')}
          </motion.p>
          <motion.div className="pt-8" variants={fadeInUp}>
            <Link href="/store">
              <Button
                size="lg"
                className="h-auto transform bg-linear-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600"
              >
                {t('cta')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
