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
      <section className="relative py-24 bg-gradient-to-b from-background via-background/80 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-12">
            <Image
              src="/images/BC-logo-transp-120.png"
              alt="Breathe Coherence"
              width={120}
              height={120}
              className="dark:invert w-[200px] h-[200px]"
              priority
            />
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-normal px-4">
              {t("hero.title")}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="pt-8">
              <Link href="/store">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-lg px-8 py-6 text-lg h-auto"
                >
                  {t("hero.cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/5 dark:bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
              {t("features.title")}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border-purple-500/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6 text-5xl flex justify-center">🔮</div>
                <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {t("features.geometry.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("features.geometry.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border-purple-500/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6 text-5xl flex justify-center">🌸</div>
                <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {t("features.essences.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("features.essences.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border-purple-500/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6 text-5xl flex justify-center">✨</div>
                <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {t("features.harmony.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("features.harmony.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background/80 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("cta.description")}
            </p>
            <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mx-auto" />
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/store">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-lg px-8 py-6 text-lg h-auto"
                >
                  {t("cta.shop")}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-500/20 hover:bg-purple-500/10 px-8 py-6 text-lg h-auto"
                >
                  {t("cta.signin")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
