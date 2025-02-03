"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FlowerEssencesPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t("store.essence.understanding.title")}
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>{t("store.essence.understanding.intro")}</p>
          <p>{t("store.essence.understanding.interaction")}</p>
          <p>{t("store.essence.understanding.process")}</p>
          <p>{t("store.essence.understanding.benefits")}</p>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/store?category=Flower Essence">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t("store.essence.explore")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
