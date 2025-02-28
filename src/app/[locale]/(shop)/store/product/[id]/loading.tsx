"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProductLoading() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </motion.div>
  );
}
