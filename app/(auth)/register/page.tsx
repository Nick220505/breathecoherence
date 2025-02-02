"use client";

import { registerAction } from "@/actions/auth";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RegisterFormData, registerSchema } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

const initialState: FormState = {
  errors: {},
  message: "",
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{t("auth.register.title")}</CardTitle>
          <CardDescription>{t("auth.register.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">{t("auth.register.name")}</label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email">{t("auth.register.email")}</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password">{t("auth.register.password")}</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword">
                {t("auth.register.confirmPassword")}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {state.message && !state.success && (
              <p className="text-sm text-red-500 text-center flex items-center justify-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {state.message}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                t("auth.register.submit")
              )}
            </Button>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              <span>{t("auth.register.haveAccount")}</span>{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t("auth.register.login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
