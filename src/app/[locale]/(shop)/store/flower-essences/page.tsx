"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function FlowerEssencesPage() {
  const t = useTranslations("FlowerEssencesPage");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-normal">
              {t("title")}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          </div>

          {/* Content Section */}
          <div className="prose dark:prose-invert max-w-none space-y-8">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/10 shadow-lg">
              <p className="text-lg leading-relaxed">{t("introduction")}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/10 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-purple-500 dark:text-purple-400">
                  {t("energy.title")}
                </h2>
                <p className="text-base leading-relaxed">
                  {t("energy.description")}
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/10 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-blue-500 dark:text-blue-400">
                  {t("healing.title")}
                </h2>
                <p className="text-base leading-relaxed">
                  {t("healing.description")}
                </p>
              </div>
            </div>

            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/10 shadow-lg">
              <p className="text-lg leading-relaxed">{t("benefits")}</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center space-y-6 pt-8">
            <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            <Link
              href={{
                pathname: "/store",
                query: { category: "Flower Essence" },
              }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg px-8 py-6 text-lg h-auto"
              >
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
