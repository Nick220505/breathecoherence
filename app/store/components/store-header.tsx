"use client";

import { useTranslation } from "@/components/language-provider";

interface StoreHeaderProps {
  category: string;
  type: string;
}

export function StoreHeader({ category }: StoreHeaderProps) {
  const { t } = useTranslation();

  const title = category
    ? `${t(`store.category.${category.toLowerCase()}`)}`
    : t("store.title");

  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-normal">
        {title}
      </h1>
      <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
    </div>
  );
}
