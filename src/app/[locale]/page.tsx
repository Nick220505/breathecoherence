'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
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
              {t('hero.title')}
            </motion.h1>
            <motion.div
              className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-purple-600 to-blue-600"
              variants={fadeInUp}
            />
            <motion.p
              className="mx-auto max-w-2xl px-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300"
              variants={fadeInUp}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div className="pt-8" variants={fadeInUp}>
              <Link href="/store">
                <Button
                  size="lg"
                  className="h-auto transform bg-linear-to-r from-purple-600 to-blue-600 px-8 py-6 text-lg text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600"
                >
                  {t('hero.cta')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 py-24 backdrop-blur-xs dark:bg-black/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl dark:text-white">
              {t('features.title')}
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-purple-600 to-blue-600" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 px-4 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: '🔮',
                title: t('features.geometry.title'),
                description: t('features.geometry.description'),
              },
              {
                icon: '🌸',
                title: t('features.essences.title'),
                description: t('features.essences.description'),
              },
              {
                icon: '✨',
                title: t('features.harmony.title'),
                description: t('features.harmony.description'),
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="transform border-purple-500/10 bg-white/5 shadow-lg backdrop-blur-xs transition-transform duration-300 hover:scale-105 dark:bg-white/5">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="mb-6 flex justify-center text-5xl"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.2,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="mb-4 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-semibold text-transparent">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
    </div>
  );
}
