'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function NavigationItems() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const { data: session } = useSession();

  return (
    <div className="flex space-x-4">
      <motion.div variants={itemVariants}>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Sacred Geometry',
            },
          }}
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex items-center gap-2 transition-colors duration-300"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-xl"
            >
              ⬡
            </motion.span>
            {t('nav.sacred_geometry')}
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Flower Essence',
            },
          }}
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex items-center gap-2 transition-colors duration-300"
          >
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xl"
            >
              🌸
            </motion.span>
            {t('nav.flower_essences')}
          </Button>
        </Link>
      </motion.div>

      {session?.user.role === 'ADMIN' && (
        <motion.div variants={itemVariants}>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-colors duration-300"
            >
              {t('nav.dashboard')}
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
