"use client";

import { verifyAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VerifyFormData, verifySchema } from "@/lib/schemas/auth";
import { FormState } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

interface VerificationFormProps {
  email: string | null;
}

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

const digitVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

export function VerificationForm({ email }: VerificationFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(verifyAction, initialState);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = form;

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (state.success) {
      router.push("/login?verified=true");
    }
  }, [state.success, router]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    const code = newDigits.join("");
    setValue("code", code, { shouldValidate: true });
    clearErrors("code");

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }

    if (index === 5 && value && code.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      setValue("code", newDigits.join(""), { shouldValidate: true });
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      setError("code", { message: "Code must contain only numbers" });
      return;
    }

    const newDigits = pastedData.padEnd(6, "").split("");
    setDigits(newDigits);
    setValue("code", pastedData, { shouldValidate: true });
    clearErrors("code");

    if (pastedData.length === 6) {
      handleSubmit(onSubmit)();
    } else {
      const focusIndex = Math.min(pastedData.length, 5);
      refs.current[focusIndex]?.focus();
    }
  };

  const onSubmit = async (data: VerifyFormData) => {
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

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
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
              <div className="relative h-16 w-48">
                <Image
                  src="/images/BC-logo-transp-120.png"
                  alt="Breathe Coherence"
                  fill
                  sizes="(max-width: 192px) 100vw, 192px"
                  className="object-contain dark:invert transition-all duration-300"
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
                Error
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Invalid verification link. Please try registering again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div variants={fadeInUp}>
                <Button
                  onClick={() => router.push("/register")}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Go to Register
                </Button>
              </motion.div>
            </CardContent>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
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
            <div className="relative h-16 w-48">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                fill
                sizes="(max-width: 192px) 100vw, 192px"
                className="object-contain dark:invert transition-all duration-300"
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
              Verify your email
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Enter the code sent to{" "}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {email}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                variants={fadeInUp}
                className="flex gap-3 justify-center"
              >
                {digits.map((digit, index) => (
                  <motion.div
                    key={index}
                    variants={digitVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative"
                  >
                    <Input
                      ref={(el) => {
                        refs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isSubmitting}
                      className="w-14 h-14 text-center text-2xl font-bold bg-white/5 dark:bg-gray-950/50 border-purple-500/20 focus:border-purple-500 focus:ring-purple-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {digit && (
                      <motion.div
                        layoutId={`digit-${index}`}
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/10 dark:to-blue-400/10 rounded-md pointer-events-none"
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {(errors.code || (state.message && !state.success)) && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-red-500 text-center flex items-center justify-center gap-1 bg-red-500/10 p-3 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.code?.message || state.message}
                </motion.p>
              )}

              <motion.div variants={fadeInUp} className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Register
                </Link>
              </motion.div>
            </form>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}
