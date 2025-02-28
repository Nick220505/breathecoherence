"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProductNotFound() {
  const t = useTranslations("ProductPage");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          {t("product_not_found")}
        </p>
        <Link
          href="/store"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back_to_store")}
        </Link>
      </motion.div>
    </div>
  );
}
