'use client';

import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: [0, 0, 1, 1],
      repeat: Infinity,
    },
  },
};

export function VerificationLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="h-20 w-20 rounded-full border-4 border-purple-500/20 border-t-purple-500"
      />
    </div>
  );
}
