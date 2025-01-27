"use client";

import { useTranslation } from "@/components/language-provider";

interface StoreHeaderProps {
  category?: string | null;
  type?: string | null;
}

export function StoreHeader({ category, type }: StoreHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold animate-gradient">
          {category
            ? t(`store.category.${category.toLowerCase()}`)
            : t("store.title")}
        </h1>
        {type && (
          <p className="text-muted-foreground mt-2">
            {t("store.filtering_by")} {type}
          </p>
        )}
      </div>
    </div>
  );
}
