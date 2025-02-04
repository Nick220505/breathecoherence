"use client";

import { registerAction } from "@/actions/auth";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RegisterFormData, registerSchema } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

const initialState: FormState = {
  errors: {},
  message: "",
};

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

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, initialState);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (state.success) {
      const email = form.getValues("email");
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    }
  }, [state.success, router, form]);

  const onSubmit = async (data: RegisterFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    startTransition(() => {
      formAction(formData);
    });
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
            className="flex items-center justify-center mb-8 gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold">Sacred Geometry</span>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="backdrop-blur-lg bg-white/10 dark:bg-gray-950/50 rounded-2xl border border-purple-500/10 shadow-xl overflow-hidden"
        >
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 text-center">
              {t("auth.register.title")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              {t("auth.register.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t("auth.register.name")}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")}
                  disabled={isLoading}
                  className="bg-white/5 dark:bg-gray-950/50 border-purple-500/20 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t("auth.register.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                  {t("auth.register.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
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

              <motion.div variants={fadeInUp} className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {t("auth.register.confirmPassword")}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  className="bg-white/5 dark:bg-gray-950/50 border-purple-500/20 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                />
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </motion.div>

              {state.message && !state.success && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-red-500 text-center flex items-center justify-center gap-1 bg-red-500/10 p-3 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4" />
                  {state.message}
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
                      Creating account...
                    </>
                  ) : (
                    t("auth.register.submit")
                  )}
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
              >
                <span>{t("auth.register.haveAccount")}</span>{" "}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  {t("auth.register.login")}
                </Link>
              </motion.div>
            </form>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}
