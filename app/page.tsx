"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/BC-logo-transp-120.png"
              alt="Breathe Coherence"
              width={120}
              height={120}
              className="dark:invert w-[200px] h-[200px]"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 px-4 leading-normal py-2">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto px-4">
            {t("hero.subtitle")}
          </p>
          <Link href="/store">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white"
            >
              {t("hero.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white px-4">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <Card className="dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="mb-4 text-4xl">🔮</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {t("features.geometry.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("features.geometry.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="mb-4 text-4xl">🌸</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {t("features.essences.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("features.essences.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="dark:border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="mb-4 text-4xl">✨</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {t("features.harmony.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("features.harmony.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/store">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white"
              >
                {t("cta.shop")}
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {t("cta.signin")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
