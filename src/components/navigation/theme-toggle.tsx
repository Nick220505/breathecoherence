'use client';

import { motion } from 'framer-motion';

import { ThemeToggle as BaseThemeToggle } from '@/components/theme-toggle';

export function ThemeToggle() {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <BaseThemeToggle />
    </motion.div>
  );
}
