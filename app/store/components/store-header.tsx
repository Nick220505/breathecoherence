"use client";

import { useTranslation } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface StoreHeaderProps {
  category: string;
  type: string;
}

export function StoreHeader({ category }: StoreHeaderProps) {
  const { t } = useTranslation();

  const title = category
    ? `${t(`store.category.${category.toLowerCase()}`)}`
    : t("store.title");

  const subtitle = category
    ? t(`store.category.${category.toLowerCase()}.description`)
    : t("store.subtitle");

  return (
    <motion.div
      className="text-center space-y-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Category Badge */}
      {category && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {category}
        </motion.div>
      )}

      {/* Title */}
      <div className="space-y-6">
        <h1
          className={cn(
            "font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-tight",
            category
              ? "text-4xl md:text-5xl"
              : "text-5xl md:text-6xl lg:text-7xl",
          )}
        >
          {title}
        </h1>

        {/* Decorative Line */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-lg opacity-50" />
          <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
