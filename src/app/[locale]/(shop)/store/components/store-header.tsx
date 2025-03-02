"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flower, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface StoreHeaderProps {
  category: string;
  type: string;
}

export function StoreHeader({ category }: StoreHeaderProps) {
  const t = useTranslations("StoreHeader");

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "sacred geometry":
        return <Sparkles className="w-4 h-4 mr-2" />;
      case "flower essence":
        return <Flower className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const getNormalizedCategory = (category: string) => {
    // Normalize the category to match our translation keys
    return category.toLowerCase();
  };

  const title = category
    ? t(`category.${getNormalizedCategory(category)}.title`)
    : t("title");

  const subtitle = category
    ? t(`category.${getNormalizedCategory(category)}.description`)
    : t("subtitle");

  return (
    <motion.div
      className="text-center space-y-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title with integrated category */}
      <div className="space-y-6">
        <h1
          className={cn(
            "font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-tight",
            "text-5xl md:text-6xl lg:text-7xl",
          )}
        >
          {title}
        </h1>

        {/* Category Badge - Only shown when there's a category */}
        {category && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {getCategoryIcon(category)}
            {t(`category.${getNormalizedCategory(category)}.badge`)}
          </motion.div>
        )}

        {/* Decorative Line */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-6 h-6 rounded-full bg-linear-to-r from-purple-600 to-blue-600 blur-lg opacity-50" />
          <div className="h-1 w-24 bg-linear-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
