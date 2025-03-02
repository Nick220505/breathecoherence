"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-linear-to-b from-background via-background/80 to-background overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/BC-logo-transp-120.png"
              alt="Breathe Coherence"
              width={120}
              height={120}
              className="dark:invert w-[200px] h-[200px]"
              priority
            />
          </motion.div>
          <motion.div
            className="space-y-6 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-normal px-4"
              variants={fadeInUp}
            >
              {t("hero.title")}
            </motion.h1>
            <motion.div
              className="h-1 w-24 bg-linear-to-r from-purple-600 to-blue-600 mx-auto rounded-full"
              variants={fadeInUp}
            />
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed"
              variants={fadeInUp}
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div className="pt-8" variants={fadeInUp}>
              <Link href="/store">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-lg px-8 py-6 text-lg h-auto transform hover:scale-105 transition-transform duration-300"
                >
                  {t("hero.cta")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/5 dark:bg-black/20 backdrop-blur-xs">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
              {t("features.title")}
            </h2>
            <div className="h-1 w-24 bg-linear-to-r from-purple-600 to-blue-600 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: "🔮",
                title: t("features.geometry.title"),
                description: t("features.geometry.description"),
              },
              {
                icon: "🌸",
                title: t("features.essences.title"),
                description: t("features.essences.description"),
              },
              {
                icon: "✨",
                title: t("features.harmony.title"),
                description: t("features.harmony.description"),
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-xs border-purple-500/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="mb-6 text-5xl flex justify-center"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-600">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-b from-background/80 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("cta.description")}
            </p>
            <div className="h-px w-full max-w-xs bg-linear-to-r from-transparent via-purple-500/20 to-transparent mx-auto" />
            <motion.div
              className="flex justify-center gap-4 pt-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Link href="/store">
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white shadow-lg px-8 py-6 text-lg h-auto transform hover:scale-105 transition-transform duration-300"
                  >
                    {t("cta.shop")}
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-500/20 hover:bg-purple-500/10 px-8 py-6 text-lg h-auto transform hover:scale-105 transition-transform duration-300"
                  >
                    {t("cta.signin")}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
