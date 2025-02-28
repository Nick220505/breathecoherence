"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginFormData, loginSchema } from "@/features/auth/schema";
import { Link } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      startTransition(async () => {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("root", { message: t("error.invalid") });
          return;
        }

        router.push("/");
      });
    } catch {
      setError("root", { message: t("error.generic") });
    }
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-background/80 to-background px-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="w-full max-w-[450px]"
      >
        <motion.div variants={fadeInUp}>
          <Link
            href="/"
            className="flex items-center justify-center mb-12 gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <div className="relative h-24 w-72">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                fill
                sizes="(max-width: 288px) 100vw, 288px"
                className="object-contain dark:invert transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="backdrop-blur-lg bg-white/10 dark:bg-gray-950/50 rounded-2xl border border-purple-500/10 shadow-xl overflow-hidden"
        >
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-center">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t("email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("placeholder.email")}
                  {...register("email")}
                  disabled={isLoading}
                  className="bg-white/5 dark:bg-gray-950/50 border-purple-500/20 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t("password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("placeholder.password")}
                  {...register("password")}
                  disabled={isLoading}
                  className="bg-white/5 dark:bg-gray-950/50 border-purple-500/20 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                />
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {errors.root && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-red-500 text-center flex items-center justify-center gap-1 bg-red-500/10 p-3 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.root.message}
                </motion.p>
              )}

              <motion.div variants={fadeInUp}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loading")}
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
              >
                <span>{t("noAccount")}</span>{" "}
                <Link
                  href="/register"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  {t("register")}
                </Link>
              </motion.div>
            </form>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}
