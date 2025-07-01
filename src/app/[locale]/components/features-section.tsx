'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';

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

export function FeaturesSection() {
  const t = useTranslations('FeaturesSection');

  const features = [
    {
      icon: '🔮',
      title: t('geometry.title'),
      description: t('geometry.description'),
    },
    {
      icon: '🌸',
      title: t('essences.title'),
      description: t('essences.description'),
    },
    {
      icon: '✨',
      title: t('harmony.title'),
      description: t('harmony.description'),
    },
  ];

  return (
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
            {t('title')}
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
          {features.map((feature, index) => (
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
  );
}
