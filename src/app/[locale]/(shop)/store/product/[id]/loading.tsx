'use client';

import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function ProductLoading() {
  return (
    <motion.div
      className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className="text-primary h-12 w-12 animate-spin" />
    </motion.div>
  );
}
