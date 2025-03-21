"use client";

import { motion } from "framer-motion";

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="w-20 h-20 border-4 border-purple-500/20 rounded-full border-t-purple-500"
      />
    </div>
  );
}
