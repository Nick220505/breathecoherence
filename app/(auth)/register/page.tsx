"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    formState: { errors },
  } = form;

  const onSubmit = async ({ name, email, password }: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

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
            {error && (
              <p className="text-sm text-red-500 text-center flex items-center justify-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : t("auth.register.submit")}
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
